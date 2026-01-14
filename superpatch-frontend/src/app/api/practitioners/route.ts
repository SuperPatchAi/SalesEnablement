import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

// Types
interface Practitioner {
  id: string;
  name: string;
  practitioner_type: string;
  address: string | null;
  city: string | null;
  province: string | null;
  phone: string | null;
  website: string | null;
  rating: number | null;
  review_count: number | null;
  business_status: string | null;
  google_maps_uri: string | null;
  latitude: number | null;
  longitude: number | null;
  scraped_at: string | null;
  notes: string | null;
  enrichment?: {
    success?: boolean;
    scraped_at?: string;
    data?: {
      practitioners?: Array<{ name: string; credentials?: string }>;
      emails?: string[];
      services?: string[];
      languages?: string[];
    };
  } | null;
  enrichment_status?: string;
  enriched_at?: string | null;
}

interface PractitionerData {
  metadata: {
    total_count: number;
    scraped_at: string;
    source: string;
  };
  practitioners: Practitioner[];
}

// Cache for JSON fallback (only used if Supabase fails)
let jsonCache: Practitioner[] | null = null;
let metadataCache: { provinces: string[]; cities: Record<string, string[]>; types: string[] } | null = null;
let metadataCacheTime: number = 0;
const METADATA_CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL

// Check if practitioners table exists in Supabase
let supabaseTableExists: boolean | null = null;

async function checkSupabaseTable(): Promise<boolean> {
  if (supabaseTableExists !== null) return supabaseTableExists;
  
  if (!isSupabaseConfigured || !supabaseAdmin) {
    supabaseTableExists = false;
    return false;
  }
  
  try {
    const { error } = await supabaseAdmin
      .from('practitioners')
      .select('id')
      .limit(1);
    
    supabaseTableExists = !error;
    return supabaseTableExists;
  } catch {
    supabaseTableExists = false;
    return false;
  }
}

// Load from JSON file (fallback)
async function loadFromJSON(): Promise<Practitioner[]> {
  if (jsonCache) return jsonCache;

  const possiblePaths = [
    path.join(process.cwd(), "public", "data", "practitioners.json"),
    path.join(process.cwd(), "..", "canadian_practitioners", "all_practitioners_latest.json"),
  ];

  for (const filePath of possiblePaths) {
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const data: PractitionerData = JSON.parse(fileContent);
        jsonCache = data.practitioners;
        console.log(`[Practitioners API] Loaded from JSON: ${filePath}`);
        return jsonCache;
      }
    } catch (error) {
      console.log(`[Practitioners API] Failed to load from ${filePath}:`, error);
    }
  }

  console.error("[Practitioners API] No practitioner data found");
  return [];
}

// Clear metadata cache
function clearMetadataCache() {
  metadataCache = null;
  metadataCacheTime = 0;
  console.log("[Practitioners API] Metadata cache cleared");
}

// Get metadata for filters
async function getMetadata(forceRefresh: boolean = false): Promise<{ provinces: string[]; cities: Record<string, string[]>; types: string[] }> {
  // Check if cache is valid (not expired and not force refresh)
  const now = Date.now();
  const cacheValid = metadataCache && (now - metadataCacheTime) < METADATA_CACHE_TTL;
  
  if (cacheValid && !forceRefresh) {
    return metadataCache!;
  }
  
  // Clear stale cache
  if (metadataCache && !cacheValid) {
    console.log("[Practitioners API] Metadata cache expired, refreshing...");
  }
  if (forceRefresh) {
    console.log("[Practitioners API] Force refresh requested");
  }

  const useSupabase = await checkSupabaseTable();
  
  if (useSupabase && supabaseAdmin) {
    try {
      // Get distinct provinces - need high limit since Supabase defaults to 1000
      const { data: provinceData } = await supabaseAdmin
        .from('practitioners')
        .select('province')
        .not('province', 'is', null)
        .limit(50000);  // Ensure we get all records for unique extraction
      
      const provinces = [...new Set(
        (provinceData as { province: string }[] || [])
          .map(p => p.province)
          .filter(Boolean)
      )].sort();
      
      // Get distinct types
      const { data: typeData } = await supabaseAdmin
        .from('practitioners')
        .select('practitioner_type')
        .not('practitioner_type', 'is', null)
        .limit(50000);  // Ensure we get all records for unique extraction
      
      const types = [...new Set(
        (typeData as { practitioner_type: string }[] || [])
          .map(t => t.practitioner_type)
          .filter(Boolean)
      )].sort();
      
      // Get cities by province - need all records
      const { data: cityData } = await supabaseAdmin
        .from('practitioners')
        .select('province, city')
        .not('city', 'is', null)
        .limit(50000);  // Ensure we get all records for unique extraction
      
      const typedCityData = cityData as { province: string; city: string }[] || [];
      const cities: Record<string, string[]> = {};
      for (const province of provinces) {
        const provinceCities = typedCityData
          .filter(c => c.province === province)
          .map(c => c.city)
          .filter(Boolean);
        cities[province] = [...new Set(provinceCities)].sort();
      }
      
      metadataCache = { provinces, cities, types };
      metadataCacheTime = Date.now();
      console.log(`[Practitioners API] Metadata cached: ${provinces.length} provinces, ${Object.keys(cities).length} city groups, ${types.length} types`);
      return metadataCache;
    } catch (error) {
      console.error("[Practitioners API] Supabase metadata error, falling back to JSON:", error);
    }
  }
  
  // Fallback to JSON
  const practitioners = await loadFromJSON();
  const provinces = [...new Set(practitioners.map(p => p.province).filter(Boolean))].sort() as string[];
  const cities: Record<string, string[]> = {};
  for (const province of provinces) {
    const provincePractitioners = practitioners.filter(p => p.province === province);
    cities[province] = [...new Set(provincePractitioners.map(p => p.city).filter(Boolean))].sort() as string[];
  }
  const types = [...new Set(practitioners.map(p => p.practitioner_type).filter(Boolean))].sort();
  
  metadataCache = { provinces, cities, types };
  metadataCacheTime = Date.now();
  console.log(`[Practitioners API] Metadata cached from JSON: ${provinces.length} provinces, ${Object.keys(cities).length} city groups, ${types.length} types`);
  return metadataCache;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Allow cache busting for metadata
  if (searchParams.get("clearCache") === "true") {
    metadataCache = null;
    jsonCache = null;
    supabaseTableExists = null;
    console.log("[Practitioners API] Cache cleared");
  }
  
  // Check if requesting metadata only
  if (searchParams.get("metadata") === "true") {
    const forceRefresh = searchParams.get("refresh") === "true";
    const metadata = await getMetadata(forceRefresh);
    return NextResponse.json({
      ...metadata,
      _cache: {
        refreshed: forceRefresh,
        ttl_ms: METADATA_CACHE_TTL,
        cached_at: metadataCacheTime ? new Date(metadataCacheTime).toISOString() : null,
      }
    });
  }
  
  // Clear cache endpoint (for admin use)
  if (searchParams.get("clearCache") === "true") {
    clearMetadataCache();
    return NextResponse.json({ status: "ok", message: "Cache cleared" });
  }

  // Parse parameters
  const province = searchParams.get("province");
  const city = searchParams.get("city");
  const type = searchParams.get("type");
  const types = searchParams.get("types")?.split(",").filter(Boolean);
  const search = searchParams.get("search")?.toLowerCase();
  const minRating = searchParams.get("minRating") ? parseFloat(searchParams.get("minRating")!) : null;
  const hasPhone = searchParams.get("hasPhone") === "true";
  const phoneSearch = searchParams.get("phone");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "100");
  const offset = (page - 1) * limit;

  // Try Supabase first
  const useSupabase = await checkSupabaseTable();
  
  if (useSupabase && supabaseAdmin) {
    try {
      // Build Supabase query
      let query = supabaseAdmin
        .from('practitioners')
        .select('*', { count: 'exact' });

      // Apply filters
      if (province) {
        query = query.eq('province', province);
      }
      if (city) {
        query = query.eq('city', city);
      }
      if (type) {
        query = query.eq('practitioner_type', type);
      }
      if (types && types.length > 0) {
        query = query.in('practitioner_type', types);
      }
      if (search) {
        // Use ilike for case-insensitive search
        query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,city.ilike.%${search}%`);
      }
      if (minRating !== null) {
        query = query.gte('rating', minRating);
      }
      if (hasPhone) {
        query = query.not('phone', 'is', null).neq('phone', '');
      }
      if (phoneSearch) {
        // Normalize phone for search
        const normalizedPhone = phoneSearch.replace(/\D/g, "");
        query = query.like('phone', `%${normalizedPhone.slice(-10)}%`);
      }

      // Apply pagination and ordering
      const { data, count, error } = await query
        .order('rating', { ascending: false, nullsFirst: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error("[Practitioners API] Supabase query error:", error);
        throw error;
      }

      // Parse enrichment JSONB back to object
      const practitioners = (data || []).map((p: Record<string, unknown>) => ({
        ...p,
        enrichment: typeof p.enrichment === 'string' ? JSON.parse(p.enrichment as string) : p.enrichment,
      })) as Practitioner[];

      return NextResponse.json({
        practitioners,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
          hasMore: offset + limit < (count || 0),
        },
        filters: {
          province,
          city,
          type,
          types,
          search,
          minRating,
          hasPhone,
          phone: phoneSearch,
        },
        source: 'supabase',
      });
    } catch (error) {
      console.error("[Practitioners API] Supabase failed, falling back to JSON:", error);
    }
  }

  // Fallback to JSON file
  const practitioners = await loadFromJSON();
  
  // Apply filters (client-side)
  let filtered = practitioners;

  if (province) {
    filtered = filtered.filter(p => p.province === province);
  }
  if (city) {
    filtered = filtered.filter(p => p.city === city);
  }
  if (type) {
    filtered = filtered.filter(p => p.practitioner_type === type);
  }
  if (types && types.length > 0) {
    filtered = filtered.filter(p => types.includes(p.practitioner_type));
  }
  if (search) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(search) ||
      p.address?.toLowerCase().includes(search) ||
      p.city?.toLowerCase().includes(search)
    );
  }
  if (minRating !== null) {
    filtered = filtered.filter(p => (p.rating || 0) >= minRating);
  }
  if (hasPhone) {
    filtered = filtered.filter(p => p.phone && p.phone.trim() !== "");
  }
  if (phoneSearch) {
    const normalizedSearch = phoneSearch.replace(/\D/g, "");
    filtered = filtered.filter(p => {
      if (!p.phone) return false;
      const normalizedPhone = p.phone.replace(/\D/g, "");
      return normalizedPhone === normalizedSearch ||
             normalizedPhone.endsWith(normalizedSearch) ||
             normalizedSearch.endsWith(normalizedPhone);
    });
  }

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    practitioners: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: offset + limit < total,
    },
    filters: {
      province,
      city,
      type,
      types,
      search,
      minRating,
      hasPhone,
      phone: phoneSearch,
    },
    source: 'json',
  });
}
