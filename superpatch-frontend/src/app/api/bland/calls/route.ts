import { NextRequest, NextResponse } from "next/server";

const API_KEY = "org_8e83a10723c7ccbfa480b0d015920dddd0ae52af444a7691546e51f371dda789b471c727a9faf577ca2769";
const BASE_URL = "https://api.bland.ai/v1";

// GET /api/bland/calls - List calls
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit") || "20";
  
  try {
    const response = await fetch(`${BASE_URL}/calls?limit=${limit}`, {
      headers: {
        "authorization": API_KEY,
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error listing calls:", error);
    return NextResponse.json({ status: "error", message: "Failed to list calls" }, { status: 500 });
  }
}

// POST /api/bland/calls - Make a new call
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BASE_URL}/calls`, {
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
    console.error("Error making call:", error);
    return NextResponse.json({ status: "error", message: "Failed to make call" }, { status: 500 });
  }
}
