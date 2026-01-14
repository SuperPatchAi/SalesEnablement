/**
 * Database types for Supabase
 * 
 * These types match the schema defined in supabase/schema.sql
 * In production, you would generate these with: npx supabase gen types typescript
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type CallStatus = 
  | 'not_called' 
  | 'queued' 
  | 'in_progress' 
  | 'completed' 
  | 'booked' 
  | 'calendar_sent' 
  | 'failed'
  | 'voicemail';

export type SampleStatus = 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';

export type SampleProduct = 
  | 'freedom'
  | 'liberty' 
  | 'rem'
  | 'focus'
  | 'ignite'
  | 'defend'
  | 'victory'
  | 'kick_it'
  | 'joint_flex';

export interface Database {
  public: {
    Tables: {
      call_records: {
        Row: {
          id: string;
          practitioner_id: string | null;  // NULL for unknown callers
          practitioner_name: string;
          practitioner_type: string | null;
          phone: string;
          address: string | null;
          city: string | null;
          province: string | null;
          call_id: string | null;
          status: CallStatus;
          call_started_at: string | null;
          call_ended_at: string | null;
          duration_seconds: number | null;
          transcript: string | null;
          summary: string | null;
          appointment_booked: boolean;
          appointment_time: string | null;
          calendar_invite_sent: boolean;
          practitioner_email: string | null;
          booking_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          practitioner_id?: string | null;  // Optional - NULL for unknown callers
          practitioner_name: string;
          practitioner_type?: string | null;
          phone: string;
          address?: string | null;
          city?: string | null;
          province?: string | null;
          call_id?: string | null;
          status?: CallStatus;
          call_started_at?: string | null;
          call_ended_at?: string | null;
          duration_seconds?: number | null;
          transcript?: string | null;
          summary?: string | null;
          appointment_booked?: boolean;
          appointment_time?: string | null;
          calendar_invite_sent?: boolean;
          practitioner_email?: string | null;
          booking_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          practitioner_id?: string | null;
          practitioner_name?: string;
          practitioner_type?: string | null;
          phone?: string;
          address?: string | null;
          city?: string | null;
          province?: string | null;
          call_id?: string | null;
          status?: CallStatus;
          call_started_at?: string | null;
          call_ended_at?: string | null;
          duration_seconds?: number | null;
          transcript?: string | null;
          summary?: string | null;
          appointment_booked?: boolean;
          appointment_time?: string | null;
          calendar_invite_sent?: boolean;
          practitioner_email?: string | null;
          booking_id?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      call_notes: {
        Row: {
          id: string;
          call_record_id: string;
          content: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          call_record_id: string;
          content: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          call_record_id?: string;
          content?: string;
          created_by?: string | null;
        };
      };
      campaign_analytics: {
        Row: {
          id: string;
          date: string;
          total_calls: number;
          completed: number;
          booked: number;
          failed: number;
          total_duration_seconds: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          total_calls?: number;
          completed?: number;
          booked?: number;
          failed?: number;
          total_duration_seconds?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          total_calls?: number;
          completed?: number;
          booked?: number;
          failed?: number;
          total_duration_seconds?: number;
        };
      };
      sample_requests: {
        Row: {
          id: string;
          call_record_id: string | null;
          practitioner_id: string | null;
          requester_name: string;
          practice_name: string | null;
          email: string | null;
          phone: string;
          shipping_address: string | null;
          shipping_city: string | null;
          shipping_province: string | null;
          shipping_postal_code: string | null;
          sample_type: string;
          products_requested: string[] | null;
          quantity: number;
          notes: string | null;
          status: SampleStatus;
          tracking_number: string | null;
          shipped_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          call_record_id?: string | null;
          practitioner_id?: string | null;
          requester_name: string;
          practice_name?: string | null;
          email?: string | null;
          phone: string;
          shipping_address?: string | null;
          shipping_city?: string | null;
          shipping_province?: string | null;
          shipping_postal_code?: string | null;
          sample_type?: string;
          products_requested?: string[] | null;
          quantity?: number;
          notes?: string | null;
          status?: SampleStatus;
          tracking_number?: string | null;
          shipped_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          call_record_id?: string | null;
          practitioner_id?: string | null;
          requester_name?: string;
          practice_name?: string | null;
          email?: string | null;
          phone?: string;
          shipping_address?: string | null;
          shipping_city?: string | null;
          shipping_province?: string | null;
          shipping_postal_code?: string | null;
          sample_type?: string;
          products_requested?: string[] | null;
          quantity?: number;
          notes?: string | null;
          status?: SampleStatus;
          tracking_number?: string | null;
          shipped_at?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience types
export type CallRecord = Database['public']['Tables']['call_records']['Row'];
export type CallRecordInsert = Database['public']['Tables']['call_records']['Insert'];
export type CallRecordUpdate = Database['public']['Tables']['call_records']['Update'];

export type CallNote = Database['public']['Tables']['call_notes']['Row'];
export type CallNoteInsert = Database['public']['Tables']['call_notes']['Insert'];

export type CampaignAnalytics = Database['public']['Tables']['campaign_analytics']['Row'];

export type SampleRequest = Database['public']['Tables']['sample_requests']['Row'];
export type SampleRequestInsert = Database['public']['Tables']['sample_requests']['Insert'];
export type SampleRequestUpdate = Database['public']['Tables']['sample_requests']['Update'];

// Stats type (computed from call_records)
export interface CampaignStats {
  total_calls: number;
  completed: number;
  booked: number;
  failed: number;
  in_progress: number;
  queued: number;
  not_called: number;
  calendar_sent: number;
  voicemail: number;
  total_duration_seconds: number;
  avg_duration_seconds: number;
  success_rate: number;
  booking_rate: number;
}
