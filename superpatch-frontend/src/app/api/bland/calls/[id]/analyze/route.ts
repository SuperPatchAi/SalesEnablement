import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.BLAND_API_KEY || "";
const BASE_URL = "https://api.bland.ai/v1";

// POST /api/bland/calls/[id]/analyze - Analyze a call
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    
    const response = await fetch(`${BASE_URL}/calls/${id}/analyze`, {
      method: "POST",
      headers: {
        "authorization": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error analyzing call:", error);
    return NextResponse.json({ status: "error", message: "Failed to analyze call" }, { status: 500 });
  }
}
