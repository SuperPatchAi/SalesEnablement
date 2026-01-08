import { NextRequest, NextResponse } from "next/server";

const API_KEY = "org_8e83a10723c7ccbfa480b0d015920dddd0ae52af444a7691546e51f371dda789b471c727a9faf577ca2769";
const BASE_URL = "https://api.bland.ai/v1";

// POST /api/bland/calls/[id]/stop - Stop an active call
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const response = await fetch(`${BASE_URL}/calls/${id}/stop`, {
      method: "POST",
      headers: {
        "authorization": API_KEY,
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error stopping call:", error);
    return NextResponse.json({ status: "error", message: "Failed to stop call" }, { status: 500 });
  }
}
