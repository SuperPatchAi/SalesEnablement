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
  | 'failed';

export interface Database {
  public: {
    Tables: {
      call_records: {
        Row: {
          id: string;
          practitioner_id: string;
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
          practitioner_id: string;
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
          practitioner_id?: string;
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
  total_duration_seconds: number;
  avg_duration_seconds: number;
  success_rate: number;
  booking_rate: number;
}
