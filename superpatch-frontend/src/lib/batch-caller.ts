/**
 * Batch Caller - Queue management for campaign calls
 * 
 * Handles sequential calling with rate limiting and status tracking
 */

import {
  CampaignCallRecord,
  createCallRecord,
  getCallRecord,
  updateCallStatus,
  getCampaignQueueState,
  saveCampaignQueueState,
  removeFromQueue,
} from './campaign-storage';

// Pathway IDs for different practitioner types
const PATHWAYS: Record<string, string> = {
  chiropractor: "cf2233ef-7fb2-49ff-af29-0eee47204e9f",
  "massage therapist": "d202aad7-bcb6-478c-a211-b00877545e05",
  massage_therapist: "d202aad7-bcb6-478c-a211-b00877545e05",
  rmt: "d202aad7-bcb6-478c-a211-b00877545e05",
  naturopath: "1d07d635-147e-4f69-a4cd-c124b33b073d",
  "naturopathic doctor": "1d07d635-147e-4f69-a4cd-c124b33b073d",
  "integrative medicine": "1c958dd7-e1ff-4f6d-b9a3-f80a369c26aa",
  "integrative medicine doctor": "1c958dd7-e1ff-4f6d-b9a3-f80a369c26aa",
  "integrative medicine practitioner": "1c958dd7-e1ff-4f6d-b9a3-f80a369c26aa",
  "functional medicine": "236dbd85-c74d-4774-a7af-4b5812015c68",
  "functional medicine doctor": "236dbd85-c74d-4774-a7af-4b5812015c68",
  "functional medicine practitioner": "236dbd85-c74d-4774-a7af-4b5812015c68",
  acupuncturist: "154f93f4-54a5-4900-92e8-0fa217508127",
};

const DEFAULT_PATHWAY = "cf2233ef-7fb2-49ff-af29-0eee47204e9f"; // Chiropractors
const KB_ID = "b671527d-0c2d-4a21-9586-033dad3b0255";
const VOICE_ID = "78c8543e-e5fe-448e-8292-20a7b8c45247";
const WEBHOOK_URL = "https://sales-enablement-six.vercel.app/api/webhooks/bland";
// Bland Memory Store ID for cross-call context retention
const MEMORY_ID = process.env.NEXT_PUBLIC_BLAND_MEMORY_ID || "";

export interface Practitioner {
  id: string;
  name: string;
  practitioner_type: string;
  address: string;
  city: string;
  province: string;
  phone: string | null;
  website?: string | null;
  rating?: number | null;
  review_count?: number | null;
  is_user_added?: boolean;
  // Do Not Call fields
  do_not_call?: boolean;
  dnc_reason?: string | null;
  dnc_detected_at?: string | null;
  dnc_source?: 'ai_detected' | 'manual' | null;
}

export interface CallResult {
  success: boolean;
  call_id?: string;
  error?: string;
  practitioner_id: string;
}

export type BatchCallerEventType = 
  | 'call_started'
  | 'call_completed'
  | 'call_failed'
  | 'queue_empty'
  | 'campaign_paused'
  | 'campaign_stopped';

export interface BatchCallerEvent {
  type: BatchCallerEventType;
  practitioner_id?: string;
  call_id?: string;
  error?: string;
  remaining?: number;
}

type EventListener = (event: BatchCallerEvent) => void;

/**
 * Get pathway ID for a practitioner type
 */
function getPathwayId(practitionerType: string): string {
  const typeKey = practitionerType.toLowerCase().trim();
  return PATHWAYS[typeKey] || DEFAULT_PATHWAY;
}

/**
 * Format phone number to E.164 format
 */
function formatPhoneNumber(phone: string): string | null {
  if (!phone) return null;
  
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 10) {
    return `+1${digits}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  } else if (digits.length > 11) {
    return `+${digits.slice(0, 11)}`;
  }
  
  return null;
}

/**
 * BatchCaller class - manages campaign call queue
 */
export class BatchCaller {
  private isRunning = false;
  private isPaused = false;
  private currentCallId: string | null = null;
  private currentPractitionerId: string | null = null;
  private delayBetweenCalls = 60000; // 1 minute default
  private listeners: EventListener[] = [];
  private pollingInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Restore state from storage
    const state = getCampaignQueueState();
    this.isRunning = state.is_running;
    this.delayBetweenCalls = state.delay_between_calls_ms;
    this.currentCallId = state.current_call_id || null;
    this.currentPractitionerId = state.current_practitioner_id || null;
  }

  /**
   * Subscribe to batch caller events
   */
  subscribe(listener: EventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private emit(event: BatchCallerEvent) {
    this.listeners.forEach(l => l(event));
  }

  /**
   * Set delay between calls (in milliseconds)
   */
  setDelayBetweenCalls(ms: number) {
    this.delayBetweenCalls = ms;
    saveCampaignQueueState({ delay_between_calls_ms: ms });
  }

  /**
   * Make a single call to a practitioner
   */
  async makeCall(practitioner: Practitioner): Promise<CallResult> {
    const phone = formatPhoneNumber(practitioner.phone || '');
    
    if (!phone) {
      return {
        success: false,
        error: 'Invalid phone number',
        practitioner_id: practitioner.id,
      };
    }

    // Ensure we have a call record
    let record = getCallRecord(practitioner.id);
    if (!record) {
      record = createCallRecord({
        id: practitioner.id,
        name: practitioner.name,
        practitioner_type: practitioner.practitioner_type,
        phone: practitioner.phone || '',
        address: practitioner.address,
        city: practitioner.city,
        province: practitioner.province,
      });
    }

    // Build request_data with practice context
    const requestData = {
      practice_name: practitioner.name || 'your practice',
      practice_address: practitioner.address || '',
      practice_city: practitioner.city || '',
      practice_province: practitioner.province || '',
      google_rating: practitioner.rating?.toString() || '',
      review_count: practitioner.review_count?.toString() || '',
      website: practitioner.website || '',
      practitioner_type: practitioner.practitioner_type || '',
      has_address: practitioner.address ? 'true' : 'false',
    };

    const pathwayId = getPathwayId(practitioner.practitioner_type);

    const callPayload: Record<string, unknown> = {
      phone_number: phone,
      pathway_id: pathwayId,
      pathway_version: 1,
      knowledge_base: KB_ID,
      voice: VOICE_ID,
      // Don't use first_sentence with pathways - let the pathway handle the intro
      wait_for_greeting: true,
      record: true,
      max_duration: 15,
      webhook: WEBHOOK_URL,
      request_data: requestData,
      metadata: {
        campaign: 'canadian_practitioners',
        source: 'campaign_dialer',
        practitioner_id: practitioner.id,
        practice_name: practitioner.name,
        practitioner_type: practitioner.practitioner_type,
        // Include full address info for webhook processing
        address: practitioner.address || '',
        city: practitioner.city || '',
        province: practitioner.province || '',
      },
    };

    // Add memory_id for cross-call context retention (if configured)
    if (MEMORY_ID) {
      callPayload.memory_id = MEMORY_ID;
    }

    try {
      const response = await fetch('/api/bland/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callPayload),
      });

      const result = await response.json();

      if (result.status === 'success' && result.call_id) {
        // Update record with call_id and status
        updateCallStatus(practitioner.id, 'in_progress', {
          call_id: result.call_id,
          call_started_at: new Date().toISOString(),
        });

        return {
          success: true,
          call_id: result.call_id,
          practitioner_id: practitioner.id,
        };
      } else {
        updateCallStatus(practitioner.id, 'failed', {
          notes: result.message || 'Call initiation failed',
        });

        return {
          success: false,
          error: result.message || 'Call initiation failed',
          practitioner_id: practitioner.id,
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      updateCallStatus(practitioner.id, 'failed', {
        notes: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
        practitioner_id: practitioner.id,
      };
    }
  }

  /**
   * Start the campaign queue
   */
  async startCampaign(practitioners: Practitioner[]): Promise<void> {
    if (this.isRunning) {
      console.log('Campaign already running');
      return;
    }

    this.isRunning = true;
    this.isPaused = false;

    saveCampaignQueueState({
      is_running: true,
      started_at: new Date().toISOString(),
    });

    // Ensure all practitioners have call records and are queued
    for (const practitioner of practitioners) {
      let record = getCallRecord(practitioner.id);
      if (!record) {
        record = createCallRecord({
          id: practitioner.id,
          name: practitioner.name,
          practitioner_type: practitioner.practitioner_type,
          phone: practitioner.phone || '',
          address: practitioner.address,
          city: practitioner.city,
          province: practitioner.province,
        });
      }
      if (record.status === 'not_called') {
        updateCallStatus(practitioner.id, 'queued');
      }
    }

    // Start processing queue
    await this.processQueue(practitioners);
  }

  /**
   * Process the call queue
   */
  private async processQueue(practitioners: Practitioner[]): Promise<void> {
    for (let i = 0; i < practitioners.length; i++) {
      if (!this.isRunning || this.isPaused) {
        break;
      }

      const practitioner = practitioners[i];
      const record = getCallRecord(practitioner.id);

      // Skip if already called or no phone
      if (record && record.status !== 'queued' && record.status !== 'not_called') {
        continue;
      }

      if (!practitioner.phone) {
        continue;
      }

      this.currentPractitionerId = practitioner.id;
      saveCampaignQueueState({ current_practitioner_id: practitioner.id });

      // Make the call
      const result = await this.makeCall(practitioner);

      if (result.success) {
        this.currentCallId = result.call_id || null;
        saveCampaignQueueState({ current_call_id: result.call_id });

        this.emit({
          type: 'call_started',
          practitioner_id: practitioner.id,
          call_id: result.call_id,
          remaining: practitioners.length - i - 1,
        });

        // Wait for call to complete (poll status)
        await this.waitForCallCompletion(result.call_id!);

        this.emit({
          type: 'call_completed',
          practitioner_id: practitioner.id,
          call_id: result.call_id,
          remaining: practitioners.length - i - 1,
        });
      } else {
        this.emit({
          type: 'call_failed',
          practitioner_id: practitioner.id,
          error: result.error,
          remaining: practitioners.length - i - 1,
        });
      }

      // Remove from queue
      removeFromQueue(practitioner.id);

      // Delay before next call (unless last one)
      if (i < practitioners.length - 1 && this.isRunning && !this.isPaused) {
        await this.delay(this.delayBetweenCalls);
      }
    }

    // Campaign finished
    this.isRunning = false;
    this.currentCallId = null;
    this.currentPractitionerId = null;

    saveCampaignQueueState({
      is_running: false,
      current_call_id: undefined,
      current_practitioner_id: undefined,
    });

    this.emit({ type: 'queue_empty' });
  }

  /**
   * Wait for a call to complete by polling its status
   */
  private async waitForCallCompletion(callId: string, maxWaitMs = 900000): Promise<void> {
    const startTime = Date.now();
    const pollIntervalMs = 5000; // Poll every 5 seconds

    while (Date.now() - startTime < maxWaitMs) {
      if (!this.isRunning || this.isPaused) {
        break;
      }

      try {
        const response = await fetch(`/api/bland/calls/${callId}`);
        const callData = await response.json();

        if (callData.status === 'completed' || callData.status === 'failed' || callData.status === 'no-answer') {
          // Update local record with call data
          const record = getCallRecord(this.currentPractitionerId!);
          if (record) {
            let status: 'completed' | 'booked' | 'failed' = 'completed';
            
            if (callData.status === 'failed' || callData.status === 'no-answer') {
              status = 'failed';
            } else if (callData.variables?.wants_demo === 'true' || callData.variables?.appointment_time) {
              status = 'booked';
            }

            updateCallStatus(record.practitioner_id, status, {
              duration_seconds: callData.call_length,
              transcript: callData.concatenated_transcript,
              call_ended_at: new Date().toISOString(),
            });
          }
          
          return;
        }
      } catch (error) {
        console.error('Error polling call status:', error);
      }

      await this.delay(pollIntervalMs);
    }
  }

  /**
   * Pause the campaign
   */
  pauseCampaign(): void {
    this.isPaused = true;
    saveCampaignQueueState({
      paused_at: new Date().toISOString(),
    });
    this.emit({ type: 'campaign_paused' });
  }

  /**
   * Resume the campaign
   */
  resumeCampaign(practitioners: Practitioner[]): void {
    if (!this.isPaused) return;
    
    this.isPaused = false;
    saveCampaignQueueState({ paused_at: undefined });
    
    // Continue processing from where we left off
    const remaining = practitioners.filter(p => {
      const record = getCallRecord(p.id);
      return !record || record.status === 'queued' || record.status === 'not_called';
    });
    
    this.processQueue(remaining);
  }

  /**
   * Stop the campaign completely
   */
  stopCampaign(): void {
    this.isRunning = false;
    this.isPaused = false;
    this.currentCallId = null;
    this.currentPractitionerId = null;

    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }

    saveCampaignQueueState({
      is_running: false,
      current_call_id: undefined,
      current_practitioner_id: undefined,
    });

    this.emit({ type: 'campaign_stopped' });
  }

  /**
   * Get current campaign state
   */
  getState() {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      currentCallId: this.currentCallId,
      currentPractitionerId: this.currentPractitionerId,
      delayBetweenCalls: this.delayBetweenCalls,
    };
  }

  /**
   * Helper to delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
let batchCallerInstance: BatchCaller | null = null;

export function getBatchCaller(): BatchCaller {
  if (!batchCallerInstance) {
    batchCallerInstance = new BatchCaller();
  }
  return batchCallerInstance;
}
