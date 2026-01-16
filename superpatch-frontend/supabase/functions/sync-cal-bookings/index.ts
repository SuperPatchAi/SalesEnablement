// Supabase Edge Function for syncing Cal.com bookings
// Triggered by pg_cron every 15 minutes to sync booking status
// @ts-nocheck - Deno types not available in IDE

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CAL_API_KEY = Deno.env.get("CAL_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface CalBooking {
  id: number;
  uid: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  attendees: Array<{
    email: string;
    name: string;
    timeZone: string;
  }>;
  metadata?: {
    call_record_id?: string;
    source?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CalBookingsResponse {
  bookings: CalBooking[];
}

interface SyncResult {
  synced: number;
  created: number;
  updated: number;
  cancelled: number;
  errors: string[];
}

/**
 * Fetch recent bookings from Cal.com API
 */
async function fetchCalBookings(
  afterDate?: string,
  beforeDate?: string
): Promise<CalBooking[]> {
  if (!CAL_API_KEY) {
    throw new Error("CAL_API_KEY not configured");
  }

  // Build query parameters
  const params = new URLSearchParams();
  params.append("apiKey", CAL_API_KEY);
  
  if (afterDate) {
    params.append("afterStart", afterDate);
  }
  if (beforeDate) {
    params.append("beforeStart", beforeDate);
  }

  const response = await fetch(
    `https://api.cal.com/v1/bookings?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cal.com API error: ${response.status} - ${errorText}`);
  }

  const data: CalBookingsResponse = await response.json();
  return data.bookings || [];
}

/**
 * Sync a single booking to Supabase
 */
async function syncBooking(
  supabase: ReturnType<typeof createClient>,
  booking: CalBooking
): Promise<{ action: "created" | "updated" | "cancelled" | "skipped"; error?: string }> {
  try {
    // Try to find existing call record by booking_id (uid)
    const { data: existingByBookingId } = await supabase
      .from("call_records")
      .select("id, status, appointment_time")
      .eq("booking_id", booking.uid)
      .single();

    // Also try to find by call_record_id in metadata
    let existingByMetadata = null;
    if (booking.metadata?.call_record_id) {
      const { data } = await supabase
        .from("call_records")
        .select("id, status, appointment_time, booking_id")
        .eq("id", booking.metadata.call_record_id)
        .single();
      existingByMetadata = data;
    }

    const existing = existingByBookingId || existingByMetadata;

    if (!existing) {
      // Booking not linked to any call record - could be manually created
      console.log(`⏭️ Booking ${booking.uid} not linked to any call record, skipping`);
      return { action: "skipped" };
    }

    // Determine what updates are needed
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Update booking_id if not set
    if (!existingByBookingId && existingByMetadata && !existingByMetadata.booking_id) {
      updates.booking_id = booking.uid;
    }

    // Handle different booking statuses
    if (booking.status === "CANCELLED") {
      updates.appointment_booked = false;
      updates.notes = `Appointment cancelled on Cal.com at ${booking.updatedAt}`;
      
      const { error } = await supabase
        .from("call_records")
        .update(updates)
        .eq("id", existing.id);

      if (error) {
        return { action: "cancelled", error: error.message };
      }

      console.log(`🚫 Booking ${booking.uid} marked as cancelled`);
      return { action: "cancelled" };
    }

    // Check if appointment time changed
    const existingTime = existing.appointment_time
      ? new Date(existing.appointment_time).toISOString()
      : null;
    const bookingTime = new Date(booking.startTime).toISOString();

    if (existingTime !== bookingTime) {
      updates.appointment_time = bookingTime;
      console.log(`📅 Booking ${booking.uid} time updated: ${existingTime} -> ${bookingTime}`);
    }

    // Ensure appointment_booked is true
    updates.appointment_booked = true;
    updates.calendar_invite_sent = true;

    const { error } = await supabase
      .from("call_records")
      .update(updates)
      .eq("id", existing.id);

    if (error) {
      return { action: "updated", error: error.message };
    }

    return { action: "updated" };
  } catch (error) {
    return { 
      action: "skipped", 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  console.log("🔄 sync-cal-bookings edge function called");

  try {
    // Parse optional date range from request
    let afterDate: string | undefined;
    let beforeDate: string | undefined;

    if (req.method === "POST") {
      try {
        const body = await req.json();
        afterDate = body.after_date;
        beforeDate = body.before_date;
      } catch {
        // No body or invalid JSON, use defaults
      }
    }

    // Default: sync bookings from last 24 hours to next 7 days
    if (!afterDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      afterDate = yesterday.toISOString();
    }

    if (!beforeDate) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      beforeDate = nextWeek.toISOString();
    }

    console.log(`📅 Syncing bookings from ${afterDate} to ${beforeDate}`);

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch bookings from Cal.com
    const bookings = await fetchCalBookings(afterDate, beforeDate);
    
    console.log(`📋 Found ${bookings.length} bookings to sync`);

    // Sync results
    const result: SyncResult = {
      synced: 0,
      created: 0,
      updated: 0,
      cancelled: 0,
      errors: [],
    };

    // Sync each booking
    for (const booking of bookings) {
      const syncResult = await syncBooking(supabase, booking);
      
      if (syncResult.error) {
        result.errors.push(`${booking.uid}: ${syncResult.error}`);
      }

      switch (syncResult.action) {
        case "created":
          result.created++;
          result.synced++;
          break;
        case "updated":
          result.updated++;
          result.synced++;
          break;
        case "cancelled":
          result.cancelled++;
          result.synced++;
          break;
      }
    }

    console.log("✅ Sync complete:", result);

    return new Response(
      JSON.stringify({
        success: true,
        total_bookings: bookings.length,
        ...result,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("❌ Sync error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
