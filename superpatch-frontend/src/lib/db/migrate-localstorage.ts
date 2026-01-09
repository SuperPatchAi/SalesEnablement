/**
 * Migration Script: localStorage to Supabase
 * 
 * This script migrates existing call records from localStorage to Supabase.
 * It can be run once when setting up Supabase for an existing deployment.
 * 
 * Usage:
 * 1. Ensure Supabase environment variables are set
 * 2. Call `migrateLocalStorageToSupabase()` from a client-side page or component
 */

import { supabase, isSupabaseConfigured } from '../supabase';
import * as localStorage from '../campaign-storage';
import type { CallRecordInsert } from './types';

export interface MigrationResult {
  success: boolean;
  migrated: number;
  failed: number;
  skipped: number;
  errors: string[];
}

/**
 * Check if migration is needed
 */
export function isMigrationNeeded(): boolean {
  if (typeof window === 'undefined') return false;
  
  const localRecords = localStorage.getCallRecords();
  const recordCount = Object.keys(localRecords).length;
  
  return recordCount > 0;
}

/**
 * Get count of records to migrate
 */
export function getLocalStorageRecordCount(): number {
  if (typeof window === 'undefined') return 0;
  
  const localRecords = localStorage.getCallRecords();
  return Object.keys(localRecords).length;
}

/**
 * Migrate all localStorage records to Supabase
 */
export async function migrateLocalStorageToSupabase(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    migrated: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  // Check if Supabase is configured
  if (!isSupabaseConfigured || !supabase) {
    result.errors.push('Supabase is not configured. Set environment variables first.');
    return result;
  }

  // Check if we're in the browser
  if (typeof window === 'undefined') {
    result.errors.push('Migration must be run in browser context.');
    return result;
  }

  // Get localStorage records
  const localRecords = localStorage.getCallRecords();
  const recordsArray = Object.values(localRecords);

  if (recordsArray.length === 0) {
    result.success = true;
    result.errors.push('No records to migrate.');
    return result;
  }

  console.log(`Starting migration of ${recordsArray.length} records...`);

  // Migrate each record
  for (const record of recordsArray) {
    try {
      // Check if record already exists in Supabase
      const { data: existing } = await supabase
        .from('call_records')
        .select('id')
        .eq('practitioner_id', record.practitioner_id)
        .single();

      if (existing) {
        result.skipped++;
        continue;
      }

      // Convert to Supabase format
      const supabaseRecord: CallRecordInsert = {
        practitioner_id: record.practitioner_id,
        practitioner_name: record.practitioner_name,
        practitioner_type: record.practitioner_type || null,
        phone: record.phone,
        address: record.address || null,
        city: record.city || null,
        province: record.province || null,
        call_id: record.call_id || null,
        status: record.status,
        call_started_at: record.call_started_at || null,
        call_ended_at: record.call_ended_at || null,
        duration_seconds: record.duration_seconds || null,
        transcript: record.transcript || null,
        summary: record.summary || null,
        appointment_booked: record.appointment_booked,
        appointment_time: record.appointment_time || null,
        calendar_invite_sent: record.calendar_invite_sent,
        practitioner_email: record.practitioner_email || null,
        notes: record.notes || null,
        created_at: record.created_at,
        updated_at: record.updated_at,
      };

      // Insert into Supabase
      const { error } = await supabase
        .from('call_records')
        .insert(supabaseRecord as any);

      if (error) {
        result.failed++;
        result.errors.push(`Failed to migrate ${record.practitioner_id}: ${error.message}`);
      } else {
        result.migrated++;
      }
    } catch (error) {
      result.failed++;
      result.errors.push(`Error migrating ${record.practitioner_id}: ${String(error)}`);
    }
  }

  result.success = result.failed === 0;
  
  console.log(`Migration complete: ${result.migrated} migrated, ${result.skipped} skipped, ${result.failed} failed`);
  
  return result;
}

/**
 * Clear localStorage after successful migration
 */
export function clearLocalStorageAfterMigration(): void {
  localStorage.clearAllRecords();
  console.log('localStorage call records cleared');
}

/**
 * Export localStorage data as JSON backup
 */
export function exportLocalStorageBackup(): string {
  return localStorage.exportRecords();
}
