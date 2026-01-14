import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './db/types';

// Environment variables - trim whitespace to handle copy-paste issues
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Log configuration status (only in development or when debugging)
if (process.env.NODE_ENV === 'development' || process.env.DEBUG_SUPABASE) {
  console.log('[Supabase] Configuration check:', {
    url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT_SET',
    anonKey: supabaseAnonKey ? 'SET' : 'NOT_SET',
    serviceKey: supabaseServiceKey ? 'SET' : 'NOT_SET',
    isConfigured: isSupabaseConfigured,
  });
}

// Type for our Supabase client
export type TypedSupabaseClient = SupabaseClient<Database>;

// Create Supabase client for client-side use
export const supabase: TypedSupabaseClient | null = (() => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    return createClient<Database>(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('[Supabase] Failed to create client:', err);
    return null;
  }
})();

// Create Supabase client with service role for server-side operations
// This bypasses RLS and should only be used in API routes
export const supabaseAdmin: TypedSupabaseClient | null = (() => {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  try {
    return createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  } catch (err) {
    console.error('[Supabase] Failed to create admin client:', err);
    return null;
  }
})();

// Helper to get the appropriate client
export function getSupabaseClient(useAdmin = false): TypedSupabaseClient | null {
  if (useAdmin && supabaseAdmin) {
    return supabaseAdmin;
  }
  return supabase;
}

// Type guard to check if client is available
export function assertSupabase(client: TypedSupabaseClient | null): asserts client is TypedSupabaseClient {
  if (!client) {
    throw new Error(
      'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    );
  }
}
