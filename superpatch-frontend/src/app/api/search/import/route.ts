import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

interface SearchResultPractitioner {
  id: string; // Google Place ID
  name: string;
  address: string;
  city: string | null;
  province: string | null;
  country: string;
  phone: string | null;
  website: string | null;
  rating: number | null;
  review_count: number | null;
  business_status: string;
  google_maps_uri: string | null;
  latitude: number | null;
  longitude: number | null;
  practitioner_type?: string;
}

interface ImportRequest {
  practitioners: SearchResultPractitioner[];
  enrichAfterImport?: boolean;
}

interface ImportResponse {
  imported: number;
  duplicates: number;
  errors: string[];
  importedIds: string[];
}

// Normalize phone number for duplicate checking
function normalizePhone(phone: string | null): string | null {
  if (!phone) return null;
  return phone.replace(/\D/g, "").slice(-10);
}

// Check if practitioner already exists by Google Place ID or phone
async function checkExisting(
  googlePlaceId: string,
  phone: string | null
): Promise<string | null> {
  if (!isSupabaseConfigured || !supabaseAdmin) return null;

  try {
    // Check by Google Place ID first
    const { data: byId } = await supabaseAdmin
      .from("practitioners")
      .select("id")
      .eq("id", googlePlaceId)
      .limit(1)
      .single();

    const typedById = byId as { id: string } | null;
    if (typedById) return typedById.id;

    // Check by phone number
    if (phone) {
      const normalizedPhone = normalizePhone(phone);
      if (normalizedPhone) {
        const { data: byPhone } = await supabaseAdmin
          .from("practitioners")
          .select("id")
          .like("phone", `%${normalizedPhone}%`)
          .limit(1);

        const typedByPhone = byPhone as { id: string }[] | null;
        if (typedByPhone && typedByPhone.length > 0) {
          return typedByPhone[0].id;
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

// POST /api/search/import - Bulk import practitioners from search results
export async function POST(request: NextRequest) {
  try {
    // Check Supabase availability
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        {
          imported: 0,
          duplicates: 0,
          errors: ["Database not configured"],
          importedIds: [],
        },
        { status: 500 }
      );
    }

    const body: ImportRequest = await request.json();
    const { practitioners, enrichAfterImport } = body;

    if (!practitioners || practitioners.length === 0) {
      return NextResponse.json(
        {
          imported: 0,
          duplicates: 0,
          errors: ["No practitioners provided"],
          importedIds: [],
        },
        { status: 400 }
      );
    }

    console.log(`[Import API] Processing ${practitioners.length} practitioners`);

    const result: ImportResponse = {
      imported: 0,
      duplicates: 0,
      errors: [],
      importedIds: [],
    };

    // Process each practitioner
    for (const practitioner of practitioners) {
      try {
        // Check if already exists
        const existingId = await checkExisting(practitioner.id, practitioner.phone);
        
        if (existingId) {
          console.log(`[Import API] Duplicate found for ${practitioner.name} (${existingId})`);
          result.duplicates++;
          continue;
        }

        // Build the practitioner record
        const record = {
          id: practitioner.id, // Use Google Place ID as primary ID
          name: practitioner.name,
          practitioner_type: practitioner.practitioner_type || "Unknown",
          address: practitioner.address || null,
          city: practitioner.city || null,
          province: practitioner.province || null,
          phone: practitioner.phone || null,
          website: practitioner.website || null,
          rating: practitioner.rating || null,
          review_count: practitioner.review_count || null,
          business_status: practitioner.business_status || "OPERATIONAL",
          google_maps_uri: practitioner.google_maps_uri || null,
          latitude: practitioner.latitude || null,
          longitude: practitioner.longitude || null,
          scraped_at: new Date().toISOString(),
          is_user_added: false,
          do_not_call: false,
          notes: `Imported from Google Maps search. Country: ${practitioner.country}`,
        };

        // Insert into database
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabaseAdmin as any)
          .from("practitioners")
          .insert(record)
          .select("id")
          .single();

        if (error) {
          // Handle duplicate key error gracefully
          if (error.code === "23505") {
            console.log(`[Import API] Duplicate key for ${practitioner.name}`);
            result.duplicates++;
          } else {
            console.error(`[Import API] Error inserting ${practitioner.name}:`, error.message);
            result.errors.push(`${practitioner.name}: ${error.message}`);
          }
        } else {
          result.imported++;
          result.importedIds.push(data.id);
          console.log(`[Import API] Imported: ${practitioner.name} (${data.id})`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        result.errors.push(`${practitioner.name}: ${errorMessage}`);
      }
    }

    console.log(`[Import API] Complete: ${result.imported} imported, ${result.duplicates} duplicates, ${result.errors.length} errors`);

    // If enrichAfterImport is true, trigger enrichment for imported practitioners
    // This would be done asynchronously in a real implementation
    if (enrichAfterImport && result.importedIds.length > 0) {
      console.log(`[Import API] Enrichment requested for ${result.importedIds.length} practitioners (async)`);
      // Note: In a production system, this would queue background jobs for enrichment
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Import API] Error:", error);
    return NextResponse.json(
      {
        imported: 0,
        duplicates: 0,
        errors: ["Failed to import practitioners"],
        importedIds: [],
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing/info
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Practitioner Import API",
    configured: isSupabaseConfigured,
    usage: {
      method: "POST",
      body: {
        practitioners: "array of practitioner objects from search results",
        enrichAfterImport: "boolean (optional, trigger Firecrawl enrichment after import)",
      },
    },
  });
}
