import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './db/types';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Debug: Log configuration status at module load (remove in production)
if (typeof window === 'undefined') {
  console.log('🔧 Supabase config check:', {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    hasServiceKey: !!supabaseServiceKey,
    isConfigured: isSupabaseConfigured,
  });
}

// Type for our Supabase client
export type TypedSupabaseClient = SupabaseClient<Database>;

// Create Supabase client for client-side use
export const supabase: TypedSupabaseClient | null = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

// Create Supabase client with service role for server-side operations
// This bypasses RLS and should only be used in API routes
export const supabaseAdmin: TypedSupabaseClient | null = supabaseUrl && supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

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
