import { NextRequest, NextResponse } from "next/server";
import { serverUpsertCallRecord, serverUpdateByCallId } from "@/lib/db/call-records";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import type { CallStatus, CallRecordInsert, SampleRequestInsert } from "@/lib/db/types";

const CAL_API_KEY = process.env.CAL_API_KEY || "";
const CAL_EVENT_TYPE_ID = Number(process.env.CAL_EVENT_TYPE_ID) || 4352394;

// Helper to normalize phone numbers for comparison
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10); // Get last 10 digits
}

// Practitioner lookup result type
interface PractitionerLookup {
  id: string;
  name: string;
  practitioner_type: string;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  phone?: string | null;
}

// Look up practitioner by phone number in Supabase
async function findPractitionerByPhone(phone: string): Promise<PractitionerLookup | null> {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return null;
  }
  
  try {
    const normalizedPhone = normalizePhone(phone);
    
    // Try exact match first
    const { data: exactMatch, error: exactError } = await supabaseAdmin
      .from('practitioners')
      .select('id, name, practitioner_type, address, city, province, phone')
      .eq('phone', phone)
      .limit(1)
      .single();
    
    if (!exactError && exactMatch) {
      const result = exactMatch as PractitionerLookup;
      console.log(`📍 Found practitioner by exact phone: ${result.name}`);
      return result;
    }
    
    // Try partial match (last 10 digits)
    const { data: partialMatches } = await supabaseAdmin
      .from('practitioners')
      .select('id, name, practitioner_type, address, city, province, phone')
      .not('phone', 'is', null)
      .limit(100);
    
    if (partialMatches) {
      const matches = partialMatches as PractitionerLookup[];
      for (const p of matches) {
        if (p.phone && normalizePhone(p.phone) === normalizedPhone) {
          console.log(`📍 Found practitioner by normalized phone: ${p.name}`);
          return p;
        }
      }
    }
    
    console.log(`📍 No practitioner found for phone: ${phone}`);
    return null;
  } catch (error) {
    console.error('Error looking up practitioner by phone:', error);
    return null;
  }
}

interface BlandWebhookPayload {
  call_id: string;
  status: string;
  to: string;
  from: string;
  call_length: number;
  completed: boolean;
  created_at: string;
  ended_at: string;
  concatenated_transcript: string;
  recording_url?: string;  // URL to call recording
  variables?: Record<string, string>;
  pathway_logs?: Record<string, unknown>[];
  analysis?: {
    summary?: string;
    sentiment?: string;  // "positive", "neutral", "negative"
    sentiment_score?: number;  // 0-1 score
    keywords?: string[];
    [key: string]: unknown;
  };
  metadata?: {
    practitioner_id?: string;
    practice_name?: string;
    contact_name?: string;  // Contact/Dr name for manual quick calls
    practitioner_type?: string;
    campaign?: string;
    source?: string;
    address?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    clinic_email?: string;
    call_language?: string;
    selected_pathway?: string;  // For manual quick calls
  };
  // Voicemail detection fields
  voicemail_detected?: boolean;
  answered_by?: "human" | "voicemail" | "unknown";
}

// Calculate lead score based on call outcomes
function calculateLeadScore(payload: BlandWebhookPayload, callStatus: string): number {
  let score = 0;
  
  // Answered by human: +30
  if (payload.answered_by === "human") {
    score += 30;
  }
  
  // Call duration > 2 minutes: +20
  if (payload.call_length > 120) {
    score += 20;
  }
  
  // Demo booked: +50
  if (callStatus === "booked" || callStatus === "calendar_sent") {
    score += 50;
  }
  
  // Sample requested: +25
  const vars = payload.variables || {};
  if (vars.wants_sample === "true" || vars.sample_requested === "true") {
    score += 25;
  }
  
  // Sentiment: +15 positive, -10 negative
  const sentiment = payload.analysis?.sentiment?.toLowerCase();
  if (sentiment === "positive") {
    score += 15;
  } else if (sentiment === "negative") {
    score -= 10;
  }
  
  // Voicemail: -20
  if (payload.voicemail_detected || payload.answered_by === "voicemail") {
    score -= 20;
  }
  
  // Failed call: -30
  if (!payload.completed || payload.status === "failed") {
    score -= 30;
  }
  
  return Math.max(0, score); // Don't go below 0
}

// Do Not Call (DNC) phrases to detect in transcripts
const DNC_PHRASES = [
  "don't call",
  "do not call",
  "stop calling",
  "remove me",
  "take me off",
  "not interested",
  "never call again",
  "unsubscribe",
  "remove my number",
  "don't contact",
  "do not contact",
  "no more calls",
  "quit calling",
];

// Detect DNC request in transcript
function detectDNCRequest(transcript: string): { detected: boolean; matchedPhrase: string | null } {
  if (!transcript) {
    return { detected: false, matchedPhrase: null };
  }
  
  const lowerTranscript = transcript.toLowerCase();
  
  for (const phrase of DNC_PHRASES) {
    if (lowerTranscript.includes(phrase)) {
      console.log(`🚫 DNC phrase detected: "${phrase}"`);
      return { detected: true, matchedPhrase: phrase };
    }
  }
  
  return { detected: false, matchedPhrase: null };
}

// Mark practitioner as Do Not Call
async function markPractitionerAsDNC(
  practitionerId: string,
  reason: string,
  source: 'ai_detected' | 'manual' = 'ai_detected'
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    console.error("Cannot mark DNC: Supabase not configured");
    return false;
  }
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any)
      .from('practitioners')
      .update({
        do_not_call: true,
        dnc_reason: reason,
        dnc_detected_at: new Date().toISOString(),
        dnc_source: source,
      })
      .eq('id', practitionerId);

    if (error) {
      console.error("Error marking practitioner as DNC:", error);
      return false;
    }

    console.log(`✅ Practitioner ${practitionerId} marked as DNC (source: ${source})`);
    return true;
  } catch (error) {
    console.error("Error marking practitioner as DNC:", error);
    return false;
  }
}

// POST /api/webhooks/bland - Handle Bland.ai call completion webhooks
export async function POST(request: NextRequest) {
  console.log("🔔 WEBHOOK RECEIVED - Starting processing...");
  
  try {
    const payload: BlandWebhookPayload = await request.json();
    
    console.log("📞 Received Bland webhook:", {
      call_id: payload.call_id,
      status: payload.status,
      to: payload.to,
      completed: payload.completed,
      call_length: payload.call_length,
      answered_by: payload.answered_by,
      variables: payload.variables,
      metadata: payload.metadata,
    });
    
    console.log("🔧 Supabase configured:", isSupabaseConfigured);
    console.log("🔧 Supabase admin client:", !!supabaseAdmin);
    
    // Extract scheduling variables from the call
    const vars = payload.variables || {};
    const meta = payload.metadata || {};
    
    // Look for scheduling intent and data
    const wantsDemo = vars.wants_demo === "true" || vars.schedule_demo === "true";
    const appointmentTime = vars.appointment_time || vars.preferred_time || vars.start_time;
    // For practitioner name, check: call variables > metadata practice_name > metadata contact_name
    const practitionerName = vars.practitioner_name || vars.name || vars.contact_name || meta.practice_name || meta.contact_name;
    const practitionerEmail = vars.email || vars.practitioner_email;
    const practitionerPhone = vars.best_phone || vars.phone || payload.to;
    const practiceAddress = vars.address || vars.practice_address || meta.address;
    const practiceName = vars.practice_name || meta.practice_name;
    const contactName = meta.contact_name || vars.contact_name;  // Specific contact person
    const practitionerType = vars.practitioner_type || meta.practitioner_type || meta.selected_pathway;
    const productsInterested = vars.products_interested || vars.products;
    const practitionerId = meta.practitioner_id || vars.practitioner_id;
    
    console.log("📋 Extracted variables:", {
      wantsDemo,
      appointmentTime,
      practitionerName,
      practitionerEmail,
      practiceAddress,
      practitionerId,
    });
    
    // Try to find practitioner by phone if not provided in metadata
    let resolvedPractitionerId: string | undefined | null = practitionerId;
    let resolvedPractitionerName = practitionerName || practiceName;
    let resolvedPractitionerType = practitionerType;
    let resolvedAddress = practiceAddress;
    let resolvedCity = meta.city;
    let resolvedProvince = meta.province;
    
    if (!resolvedPractitionerId) {
      const foundPractitioner = await findPractitionerByPhone(payload.to);
      if (foundPractitioner) {
        resolvedPractitionerId = foundPractitioner.id;
        resolvedPractitionerName = resolvedPractitionerName || foundPractitioner.name;
        resolvedPractitionerType = resolvedPractitionerType || foundPractitioner.practitioner_type;
        resolvedAddress = resolvedAddress || foundPractitioner.address || undefined;
        resolvedCity = resolvedCity || foundPractitioner.city || undefined;
        resolvedProvince = resolvedProvince || foundPractitioner.province || undefined;
        
        console.log(`✅ Linked call to practitioner: ${foundPractitioner.name} (${foundPractitioner.id})`);
      } else {
        // Unknown caller - practitioner_id will be NULL
        // Extract whatever info we can from the call variables and metadata
        resolvedPractitionerId = undefined; // Will be NULL in DB
        
        // For manual quick calls, use the practice name or contact name from metadata
        const manualPracticeName = meta.practice_name || vars.practice_name;
        const manualContactName = meta.contact_name || vars.contact_name;
        
        // Build a display name from available info
        if (manualPracticeName) {
          resolvedPractitionerName = manualContactName 
            ? `${manualPracticeName} (${manualContactName})`
            : manualPracticeName;
        } else {
          resolvedPractitionerName = resolvedPractitionerName || vars.business_name || vars.company_name || "Unknown Caller";
        }
        
        resolvedPractitionerType = resolvedPractitionerType || meta.practitioner_type || vars.business_type || meta.selected_pathway || "Unknown";
        
        // Build address from metadata - include postal code if available
        const streetAddress = meta.address || vars.address || vars.location;
        const postalCode = meta.postal_code || vars.postal_code;
        if (streetAddress) {
          resolvedAddress = postalCode ? `${streetAddress}, ${postalCode}` : streetAddress;
        } else {
          resolvedAddress = resolvedAddress || undefined;
        }
        
        resolvedCity = resolvedCity || meta.city || undefined;
        resolvedProvince = resolvedProvince || meta.province || undefined;
        
        console.log(`📝 Recording call from unknown number: ${payload.to}`);
        console.log(`   Name: ${resolvedPractitionerName}`);
        console.log(`   Type: ${resolvedPractitionerType}`);
        console.log(`   Address: ${resolvedAddress}`);
        console.log(`   Location: ${resolvedCity}, ${resolvedProvince}`);
        console.log(`   Email: ${meta.clinic_email}`);
        console.log(`   Source: ${meta.source}`);
      }
    }
    
    // Determine call status
    let callStatus: CallStatus = "completed";
    
    // Check for voicemail first
    const wentToVoicemail = 
      payload.voicemail_detected === true ||
      payload.answered_by === "voicemail" ||
      payload.status === "voicemail" ||
      vars.went_to_voicemail === "true" ||
      vars.voicemail_left === "true";
    
    if (payload.status === "failed" || payload.status === "no-answer" || !payload.completed) {
      callStatus = "failed";
    } else if (wentToVoicemail) {
      // Voicemail was left - track separately for follow-up
      callStatus = "voicemail" as CallStatus;
    } else if (wantsDemo || appointmentTime) {
      callStatus = "booked";
    }
    
    // If they want a demo and we have enough info, book it
    let bookingResult: { id: string; uid: string } | null = null;
    
    if (wantsDemo && appointmentTime && practitionerName && practitionerEmail && payload.completed) {
      console.log("🗓️ Attempting to book Cal.com appointment...");
      
      try {
        bookingResult = await bookCalComAppointment({
          startTime: appointmentTime,
          name: practitionerName,
          email: practitionerEmail,
          phone: practitionerPhone,
          address: practiceAddress,
          practiceName: practiceName,
          practitionerType: practitionerType,
          products: productsInterested,
          callId: payload.call_id,
          summary: payload.analysis?.summary,
        });
        
        console.log("✅ Booking successful:", bookingResult);
        callStatus = "calendar_sent";
      } catch (bookingError) {
        console.error("❌ Booking failed:", bookingError);
        // Keep status as "booked" since they wanted a demo
      }
    }
    
    // Extract sentiment data from analysis
    const sentimentLabel = payload.analysis?.sentiment?.toLowerCase() || null;
    const sentimentScore = payload.analysis?.sentiment_score || null;
    
    // Calculate lead score based on call outcomes
    const leadScore = calculateLeadScore(payload, callStatus);
    
    console.log("📊 Call analysis:", {
      sentiment: sentimentLabel,
      sentiment_score: sentimentScore,
      lead_score: leadScore,
      recording_url: payload.recording_url ? "present" : "none",
    });

    // Save to database - use resolved practitioner data
    const callRecord: CallRecordInsert = {
      practitioner_id: resolvedPractitionerId,
      practitioner_name: resolvedPractitionerName || "Unknown",
      practitioner_type: resolvedPractitionerType,
      phone: payload.to,
      address: resolvedAddress,
      city: resolvedCity,
      province: resolvedProvince,
      call_id: payload.call_id,
      status: callStatus,
      call_started_at: payload.created_at,
      call_ended_at: payload.ended_at,
      duration_seconds: payload.call_length,
      transcript: payload.concatenated_transcript,
      summary: payload.analysis?.summary,
      appointment_booked: callStatus === "booked" || callStatus === "calendar_sent",
      appointment_time: appointmentTime ? new Date(appointmentTime).toISOString() : null,
      calendar_invite_sent: callStatus === "calendar_sent",
      practitioner_email: practitionerEmail || meta.clinic_email,
      booking_id: bookingResult?.id,
      // New sentiment and scoring fields
      sentiment_label: sentimentLabel,
      sentiment_score: sentimentScore,
      recording_url: payload.recording_url || null,
      lead_score: leadScore,
    };
    
    // Try to update existing record by call_id first, then upsert
    let savedRecord = null;
    
    console.log("💾 Attempting to save call record:", {
      practitioner_id: callRecord.practitioner_id,
      phone: callRecord.phone,
      status: callRecord.status,
      call_id: callRecord.call_id,
    });
    
    // First, try to update by call_id (in case call is already in progress)
    savedRecord = await serverUpdateByCallId(payload.call_id, callRecord);
    console.log("💾 Update by call_id result:", savedRecord ? "success" : "no existing record");
    
    if (!savedRecord) {
      // If no existing record, upsert with practitioner_id
      console.log("💾 Trying upsert with practitioner_id:", callRecord.practitioner_id);
      savedRecord = await serverUpsertCallRecord(callRecord);
      console.log("💾 Upsert result:", savedRecord ? "success" : "failed");
    }
    
    if (savedRecord) {
      console.log("✅ Call record saved to database:", {
        id: savedRecord.id,
        status: savedRecord.status,
        practitioner_id: savedRecord.practitioner_id,
      });
    } else {
      console.error("❌ Failed to save call record to database - check Supabase connection");
    }
    
    // Handle sample request if requested
    const wantsSample = vars.wants_sample === "true" || vars.sample_requested === "true";
    
    if (wantsSample && isSupabaseConfigured && supabaseAdmin) {
      console.log("📦 Sample request detected - creating sample request record...");
      
      // Parse products requested
      const productsRaw = vars.sample_products || vars.products_requested || "";
      let productsRequested: string[] | null = null;
      
      if (productsRaw && productsRaw !== "all" && productsRaw !== "standard_kit") {
        productsRequested = productsRaw.split(",").map(p => p.trim().toLowerCase()).filter(Boolean);
      }
      
      const sampleType = productsRaw === "all" || !productsRaw ? "standard_kit" : "custom";
      
      // Use shipping address if provided, otherwise use practice address
      const shippingAddress = vars.sample_shipping_address || vars.shipping_address || resolvedAddress;
      const shippingCity = vars.sample_shipping_city || vars.shipping_city || resolvedCity;
      const shippingProvince = vars.sample_shipping_province || vars.shipping_province || resolvedProvince;
      const shippingPostalCode = vars.sample_postal_code || vars.shipping_postal_code || meta.postal_code;
      
      const sampleRequest: SampleRequestInsert = {
        call_record_id: savedRecord?.id || null,
        practitioner_id: resolvedPractitionerId || null,
        requester_name: contactName || resolvedPractitionerName || "Unknown",
        practice_name: practiceName || resolvedPractitionerName,
        email: practitionerEmail || meta.clinic_email || null,
        phone: payload.to,
        shipping_address: shippingAddress || null,
        shipping_city: shippingCity || null,
        shipping_province: shippingProvince || null,
        shipping_postal_code: shippingPostalCode || null,
        sample_type: sampleType,
        products_requested: productsRequested,
        quantity: parseInt(vars.sample_quantity || "1", 10) || 1,
        notes: vars.sample_notes || null,
        status: "pending",
      };
      
      try {
        // Use type assertion for new table not yet in Supabase types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: sampleData, error: sampleError } = await (supabaseAdmin as any)
          .from("sample_requests")
          .insert(sampleRequest)
          .select()
          .single();
        
        if (sampleError) {
          console.error("❌ Failed to create sample request:", sampleError.message);
        } else {
          console.log("✅ Sample request created:", {
            id: sampleData.id,
            requester: sampleData.requester_name,
            products: sampleData.products_requested || "standard_kit",
            shipping_city: sampleData.shipping_city,
          });
        }
      } catch (err) {
        console.error("❌ Error creating sample request:", err);
      }
    }
    
    // Log for manual follow-up if demo requested but booking failed
    if (wantsDemo && !bookingResult) {
      console.log("📝 MANUAL FOLLOW-UP NEEDED:");
      console.log({
        call_id: payload.call_id,
        phone: payload.to,
        timestamp: payload.ended_at,
        variables: vars,
        transcript_preview: payload.concatenated_transcript?.slice(0, 500),
      });
    }
    
    // Check for Do Not Call (DNC) request in transcript
    const dncResult = detectDNCRequest(payload.concatenated_transcript || "");
    if (dncResult.detected && resolvedPractitionerId) {
      console.log(`🚫 DNC request detected for ${resolvedPractitionerName} - marking as Do Not Call`);
      const dncMarked = await markPractitionerAsDNC(
        resolvedPractitionerId,
        `AI detected phrase: "${dncResult.matchedPhrase}"`,
        'ai_detected'
      );
      if (dncMarked) {
        console.log(`✅ Practitioner ${resolvedPractitionerName} successfully marked as DNC`);
      }
    }
    
    // Return appropriate response
    if (!payload.completed) {
      return NextResponse.json({ 
        status: "ok", 
        message: "Call not completed",
        record_saved: !!savedRecord,
      });
    }
    
    if (bookingResult) {
      return NextResponse.json({
        status: "success",
        message: "Appointment booked",
        booking_id: bookingResult.id,
        booking_uid: bookingResult.uid,
        record_saved: !!savedRecord,
      });
    }
    
    if (wantsDemo) {
      return NextResponse.json({
        status: "partial",
        message: "Demo requested but booking failed - logged for follow-up",
        record_saved: !!savedRecord,
      });
    }
    
    return NextResponse.json({
      status: "ok",
      message: "Call completed - no booking requested",
      record_saved: !!savedRecord,
    });
    
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}

async function bookCalComAppointment(data: {
  startTime: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  practiceName?: string;
  practitionerType?: string;
  products?: string;
  callId: string;
  summary?: string;
}) {
  // Parse the start time and calculate end time (30 min later)
  const start = new Date(data.startTime);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  
  // Build notes for sales team with full context
  const notes = [
    `Practice: ${data.practiceName || 'N/A'}`,
    `Type: ${data.practitionerType || 'N/A'}`,
    `Phone: ${data.phone || 'N/A'}`,
    `Products Interested: ${data.products || 'N/A'}`,
    `Address: ${data.address || 'TBD'}`,
    '',
    'Call Summary:',
    data.summary || 'No summary available',
  ].join('\n');
  
  const bookingPayload = {
    eventTypeId: CAL_EVENT_TYPE_ID,
    start: start.toISOString(),
    end: end.toISOString(),
    responses: {
      name: data.name,
      email: data.email,
      location: {
        value: "inPerson",
        optionValue: data.address || "TBD",
      },
    },
    timeZone: "America/New_York",
    language: "en",
    title: `SuperPatch Demo - ${data.practiceName || data.name}`,
    // Description field - this shows in calendar event details
    description: notes,
    metadata: {
      source: "bland_ai_webhook",
      call_id: data.callId,
      practice_name: data.practiceName,
      practitioner_type: data.practitionerType,
      practitioner_phone: data.phone,
      products_interested: data.products,
      call_summary: data.summary || "No summary available",
    },
  };
  
  console.log("📅 Cal.com booking payload:", JSON.stringify(bookingPayload, null, 2));
  
  const response = await fetch(`https://api.cal.com/v1/bookings?apiKey=${CAL_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingPayload),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cal.com booking failed: ${response.status} - ${errorText}`);
  }
  
  return response.json();
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Test Supabase connection
  if (searchParams.get("test") === "supabase") {
    console.log("🧪 Testing Supabase connection...");
    console.log("🔧 isSupabaseConfigured:", isSupabaseConfigured);
    console.log("🔧 supabaseAdmin exists:", !!supabaseAdmin);
    
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json({
        status: "error",
        message: "Supabase not configured",
        debug: {
          isSupabaseConfigured,
          hasAdminClient: !!supabaseAdmin,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "NOT_SET",
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "NOT_SET",
          serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "NOT_SET",
        }
      });
    }
    
    try {
      // Try to read from call_records
      const { error, count } = await supabaseAdmin
        .from('call_records')
        .select('*', { count: 'exact' })
        .limit(5);
      
      if (error) {
        return NextResponse.json({
          status: "error",
          message: "Supabase read failed",
          error: error.message,
          code: error.code,
        });
      }
      
      return NextResponse.json({
        status: "ok",
        message: "Supabase connection working",
        test_results: {
          read_success: true,
          records_found: count,
        },
      });
    } catch (err) {
      return NextResponse.json({
        status: "error",
        message: "Supabase test failed",
        error: String(err),
      });
    }
  }
  
  return NextResponse.json({
    status: "ok",
    message: "Bland.ai webhook endpoint ready",
    features: [
      "Receives call completion webhooks",
      "Saves call records to Supabase database",
      "Links calls to practitioners by phone lookup",
      "Extracts scheduling variables",
      "Books to Cal.com if demo requested",
      "Stores transcripts and summaries",
      "Tracks voicemail status",
      "Creates sample requests when requested",
    ],
    debug_endpoints: {
      test_supabase: "/api/webhooks/bland?test=supabase",
    },
    config: {
      supabase_configured: isSupabaseConfigured,
      has_admin_client: !!supabaseAdmin,
    }
  });
}
