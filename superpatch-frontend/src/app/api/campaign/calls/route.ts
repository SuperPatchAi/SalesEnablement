import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Simple file-based storage for campaign calls (MVP solution)
// In production, use a proper database like Vercel KV, Supabase, or MongoDB

const STORAGE_FILE = path.join(process.cwd(), ".campaign-calls.json");

interface CampaignCallRecord {
  practitioner_id: string;
  practitioner_name: string;
  practitioner_type: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  call_id?: string;
  status: string;
  call_started_at?: string;
  call_ended_at?: string;
  duration_seconds?: number;
  transcript?: string;
  summary?: string;
  appointment_booked: boolean;
  appointment_time?: string;
  calendar_invite_sent: boolean;
  practitioner_email?: string;
  booking_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface StorageData {
  records: Record<string, CampaignCallRecord>;
  lastUpdated: string;
}

function loadStorage(): StorageData {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load campaign storage:", error);
  }
  return { records: {}, lastUpdated: new Date().toISOString() };
}

function saveStorage(data: StorageData): void {
  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to save campaign storage:", error);
  }
}

// GET - Retrieve campaign calls
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callId = searchParams.get("call_id");
  const practitionerId = searchParams.get("practitioner_id");
  const status = searchParams.get("status");
  const since = searchParams.get("since"); // ISO timestamp for polling

  const storage = loadStorage();
  let records = Object.values(storage.records);

  // Filter by call_id
  if (callId) {
    records = records.filter(r => r.call_id === callId);
  }

  // Filter by practitioner_id
  if (practitionerId) {
    records = records.filter(r => r.practitioner_id === practitionerId);
  }

  // Filter by status
  if (status) {
    records = records.filter(r => r.status === status);
  }

  // Filter by updates since timestamp (for polling)
  if (since) {
    const sinceDate = new Date(since);
    records = records.filter(r => new Date(r.updated_at) > sinceDate);
  }

  // Sort by updated_at desc
  records.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return NextResponse.json({
    records,
    lastUpdated: storage.lastUpdated,
    total: records.length,
  });
}

// POST - Create or update a campaign call record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const storage = loadStorage();

    // Determine if this is an update by call_id or practitioner_id
    let existingKey: string | null = null;

    if (body.call_id) {
      // Find by call_id
      existingKey = Object.keys(storage.records).find(
        key => storage.records[key].call_id === body.call_id
      ) || null;
    }

    if (!existingKey && body.practitioner_id) {
      existingKey = body.practitioner_id;
    }

    const now = new Date().toISOString();
    const key = existingKey || body.practitioner_id || body.call_id || `call_${Date.now()}`;

    const existingRecord = storage.records[key] || {};

    const record: CampaignCallRecord = {
      ...existingRecord,
      ...body,
      updated_at: now,
      created_at: existingRecord.created_at || now,
    };

    storage.records[key] = record;
    saveStorage(storage);

    return NextResponse.json({
      status: "success",
      record,
    });
  } catch (error) {
    console.error("Failed to save campaign call:", error);
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}

// DELETE - Clear all records or a specific one
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const practitionerId = searchParams.get("practitioner_id");

  const storage = loadStorage();

  if (practitionerId) {
    delete storage.records[practitionerId];
  } else {
    storage.records = {};
  }

  saveStorage(storage);

  return NextResponse.json({
    status: "success",
    message: practitionerId ? "Record deleted" : "All records cleared",
  });
}
