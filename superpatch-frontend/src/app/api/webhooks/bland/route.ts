import { NextRequest, NextResponse } from "next/server";

const CAL_API_KEY = process.env.CAL_API_KEY || "";
const CAL_EVENT_TYPE_ID = Number(process.env.CAL_EVENT_TYPE_ID) || 4352394;
const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : "http://localhost:3000";

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
    });
    
    // Check if call completed successfully
    if (!payload.completed) {
      console.log("Call not completed, skipping booking");
      return NextResponse.json({ status: "ok", message: "Call not completed" });
    }
    
    // Extract scheduling variables from the call
    const vars = payload.variables || {};
    
    // Look for scheduling intent and data
    const wantsDemo = vars.wants_demo === "true" || vars.schedule_demo === "true";
    const appointmentTime = vars.appointment_time || vars.preferred_time || vars.start_time;
    const practitionerName = vars.practitioner_name || vars.name || vars.contact_name;
    const practitionerEmail = vars.email || vars.practitioner_email;
    const practitionerPhone = vars.best_phone || vars.phone || payload.to;
    const practiceAddress = vars.address || vars.practice_address;
    const practiceName = vars.practice_name;
    const practitionerType = vars.practitioner_type;
    const productsInterested = vars.products_interested || vars.products;
    
    console.log("📋 Extracted variables:", {
      wantsDemo,
      appointmentTime,
      practitionerName,
      practitionerEmail,
      practiceAddress,
    });
    
    // If they want a demo and we have enough info, book it
    if (wantsDemo && appointmentTime && practitionerName && practitionerEmail) {
      console.log("🗓️ Attempting to book Cal.com appointment...");
      
      try {
        const booking = await bookCalComAppointment({
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
        
        console.log("✅ Booking successful:", booking);
        
        // Update campaign call record with booking success
        await updateCampaignCallRecord(payload, vars, true, booking.id);
        
        return NextResponse.json({
          status: "success",
          message: "Appointment booked",
          booking_id: booking.id,
          booking_uid: booking.uid,
        });
      } catch (bookingError) {
        console.error("❌ Booking failed:", bookingError);
        
        // Log the data for manual follow-up (also updates campaign record)
        await logForManualFollowUp(payload, vars);
        
        return NextResponse.json({
          status: "partial",
          message: "Call completed but booking failed - logged for manual follow-up",
          error: String(bookingError),
        });
      }
    } else {
      // Log for manual follow-up if missing data
      if (wantsDemo) {
        console.log("⚠️ Wants demo but missing required data");
        await logForManualFollowUp(payload, vars);
      } else {
        // Still update the campaign record for completed calls
        await updateCampaignCallRecord(payload, vars, false);
      }
      
      return NextResponse.json({
        status: "ok",
        message: wantsDemo 
          ? "Demo requested but missing booking data - logged for follow-up"
          : "Call completed - no booking requested",
      });
    }
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

async function logForManualFollowUp(payload: BlandWebhookPayload, vars: Record<string, string>) {
  // In production, you'd log this to a database or send to a CRM
  // For now, we'll just log it
  console.log("📝 MANUAL FOLLOW-UP NEEDED:");
  console.log({
    call_id: payload.call_id,
    phone: payload.to,
    timestamp: payload.ended_at,
    variables: vars,
    transcript_preview: payload.concatenated_transcript?.slice(0, 500),
  });
  
  // Also update campaign call record
  await updateCampaignCallRecord(payload, vars, false);
}

async function updateCampaignCallRecord(
  payload: BlandWebhookPayload, 
  vars: Record<string, string>,
  bookingSuccess: boolean,
  bookingId?: string
) {
  try {
    const practitionerId = payload.metadata?.practitioner_id || vars.practitioner_id;
    
    if (!practitionerId && !payload.call_id) {
      console.log("No practitioner_id or call_id found, skipping campaign record update");
      return;
    }

    // Determine call status
    let status = "completed";
    if (payload.status === "failed" || payload.status === "no-answer") {
      status = "failed";
    } else if (bookingSuccess) {
      status = "calendar_sent";
    } else if (vars.wants_demo === "true" || vars.appointment_time) {
      status = "booked";
    }

    const callRecord = {
      practitioner_id: practitionerId,
      practitioner_name: vars.practitioner_name || payload.metadata?.practice_name,
      practitioner_type: vars.practitioner_type || payload.metadata?.practitioner_type,
      phone: payload.to,
      call_id: payload.call_id,
      status,
      call_started_at: payload.created_at,
      call_ended_at: payload.ended_at,
      duration_seconds: payload.call_length,
      transcript: payload.concatenated_transcript,
      summary: payload.analysis?.summary,
      appointment_booked: status === "booked" || status === "calendar_sent",
      appointment_time: vars.appointment_time,
      calendar_invite_sent: bookingSuccess,
      practitioner_email: vars.email || vars.practitioner_email,
      booking_id: bookingId,
    };

    // Update the campaign call record via internal API
    const response = await fetch(`${BASE_URL}/api/campaign/calls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(callRecord),
    });

    if (!response.ok) {
      console.error("Failed to update campaign call record:", await response.text());
    } else {
      console.log("📊 Campaign call record updated:", status);
    }
  } catch (error) {
    console.error("Error updating campaign call record:", error);
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Bland.ai webhook endpoint ready",
    features: [
      "Receives call completion webhooks",
      "Extracts scheduling variables",
      "Books to Cal.com if demo requested",
      "Logs for manual follow-up if booking fails",
    ],
  });
}
