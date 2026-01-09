import { NextRequest, NextResponse } from "next/server";
import {
  getNotesForCall,
  addNote,
  updateNote,
  deleteNote,
  getRecentNotes,
} from "@/lib/db/call-notes";

// GET - Retrieve notes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const callRecordId = searchParams.get("call_record_id");
    const recent = searchParams.get("recent");

    // Get recent notes across all calls
    if (recent) {
      const limit = parseInt(recent) || 10;
      const notes = await getRecentNotes(limit);
      return NextResponse.json({
        notes,
        total: notes.length,
      });
    }

    // Get notes for a specific call
    if (callRecordId) {
      const notes = await getNotesForCall(callRecordId);
      return NextResponse.json({
        notes,
        total: notes.length,
      });
    }

    return NextResponse.json(
      { status: "error", message: "call_record_id or recent parameter is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Failed to get notes:", error);
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}

// POST - Create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.call_record_id || !body.content) {
      return NextResponse.json(
        { status: "error", message: "call_record_id and content are required" },
        { status: 400 }
      );
    }

    const note = await addNote({
      call_record_id: body.call_record_id,
      content: body.content,
      created_by: body.created_by,
    });

    if (!note) {
      return NextResponse.json(
        { status: "error", message: "Failed to create note. Make sure Supabase is configured." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      note,
    });
  } catch (error) {
    console.error("Failed to create note:", error);
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}

// PATCH - Update a note
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id || !body.content) {
      return NextResponse.json(
        { status: "error", message: "id and content are required" },
        { status: 400 }
      );
    }

    const note = await updateNote(body.id, body.content);

    if (!note) {
      return NextResponse.json(
        { status: "error", message: "Note not found or Supabase not configured" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      note,
    });
  } catch (error) {
    console.error("Failed to update note:", error);
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}

// DELETE - Delete a note
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const noteId = searchParams.get("id");

    if (!noteId) {
      return NextResponse.json(
        { status: "error", message: "id is required" },
        { status: 400 }
      );
    }

    const success = await deleteNote(noteId);

    return NextResponse.json({
      status: success ? "success" : "error",
      message: success ? "Note deleted" : "Failed to delete note",
    });
  } catch (error) {
    console.error("Failed to delete note:", error);
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}
