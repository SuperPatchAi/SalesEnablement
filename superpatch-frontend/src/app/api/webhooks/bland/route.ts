import { NextRequest, NextResponse } from "next/server";
import { serverUpsertCallRecord, serverUpdateByCallId } from "@/lib/db/call-records";
import type { CallStatus, CallRecordInsert } from "@/lib/db/types";

const CAL_API_KEY = process.env.CAL_API_KEY || "";
const CAL_EVENT_TYPE_ID = Number(process.env.CAL_EVENT_TYPE_ID) || 4352394;

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
  variables?: Record<string, string>;
  pathway_logs?: Record<string, unknown>[];
  analysis?: {
    summary?: string;
    [key: string]: unknown;
  };
  metadata?: {
    practitioner_id?: string;
    practice_name?: string;
    practitioner_type?: string;
    campaign?: string;
    source?: string;
    address?: string;
    city?: string;
    province?: string;
  };
}

// POST /api/webhooks/bland - Handle Bland.ai call completion webhooks
export async function POST(request: NextRequest) {
  try {
    const payload: BlandWebhookPayload = await request.json();
    
    console.log("📞 Received Bland webhook:", {
      call_id: payload.call_id,
      status: payload.status,
      to: payload.to,
      completed: payload.completed,
      variables: payload.variables,
      metadata: payload.metadata,
    });
    
    // Extract scheduling variables from the call
    const vars = payload.variables || {};
    const meta = payload.metadata || {};
    
    // Look for scheduling intent and data
    const wantsDemo = vars.wants_demo === "true" || vars.schedule_demo === "true";
    const appointmentTime = vars.appointment_time || vars.preferred_time || vars.start_time;
    const practitionerName = vars.practitioner_name || vars.name || vars.contact_name || meta.practice_name;
    const practitionerEmail = vars.email || vars.practitioner_email;
    const practitionerPhone = vars.best_phone || vars.phone || payload.to;
    const practiceAddress = vars.address || vars.practice_address || meta.address;
    const practiceName = vars.practice_name || meta.practice_name;
    const practitionerType = vars.practitioner_type || meta.practitioner_type;
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
    
    // Determine call status
    let callStatus: CallStatus = "completed";
    if (payload.status === "failed" || payload.status === "no-answer" || !payload.completed) {
      callStatus = "failed";
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
        });
        
        console.log("✅ Booking successful:", bookingResult);
        callStatus = "calendar_sent";
      } catch (bookingError) {
        console.error("❌ Booking failed:", bookingError);
        // Keep status as "booked" since they wanted a demo
      }
    }
    
    // Save to database
    const callRecord: CallRecordInsert = {
      practitioner_id: practitionerId || payload.call_id, // Use call_id if no practitioner_id
      practitioner_name: practitionerName || practiceName || "Unknown",
      practitioner_type: practitionerType,
      phone: payload.to,
      address: practiceAddress,
      city: meta.city,
      province: meta.province,
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
      practitioner_email: practitionerEmail,
      booking_id: bookingResult?.id,
    };
    
    // Try to update existing record by call_id first, then upsert
    let savedRecord = null;
    if (practitionerId) {
      savedRecord = await serverUpsertCallRecord(callRecord);
    } else {
      // If no practitioner_id, try to update by call_id
      savedRecord = await serverUpdateByCallId(payload.call_id, callRecord);
      if (!savedRecord) {
        // Create new record
        savedRecord = await serverUpsertCallRecord(callRecord);
      }
    }
    
    if (savedRecord) {
      console.log("📊 Call record saved to database:", {
        id: savedRecord.id,
        status: savedRecord.status,
        practitioner_id: savedRecord.practitioner_id,
      });
    } else {
      console.warn("⚠️ Failed to save call record to database");
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
}) {
  // Parse the start time and calculate end time (30 min later)
  const start = new Date(data.startTime);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  
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
    metadata: {
      source: "bland_ai_webhook",
      call_id: data.callId,
      practice_name: data.practiceName,
      practitioner_type: data.practitionerType,
      practitioner_phone: data.phone,
      products_interested: data.products,
    },
  };
  
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
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Bland.ai webhook endpoint ready",
    features: [
      "Receives call completion webhooks",
      "Saves call records to Supabase database",
      "Extracts scheduling variables",
      "Books to Cal.com if demo requested",
      "Stores transcripts and summaries",
    ],
  });
}
