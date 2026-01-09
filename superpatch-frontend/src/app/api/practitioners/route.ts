import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Cache the practitioner data in memory
let practitionersCache: Practitioner[] | null = null;
let metadataCache: { provinces: string[]; cities: Record<string, string[]>; types: string[] } | null = null;
let dataLoadPromise: Promise<Practitioner[]> | null = null;

interface Practitioner {
  id: string;
  name: string;
  practitioner_type: string;
  address: string;
  city: string;
  province: string;
  phone: string | null;
  website: string | null;
  rating: number | null;
  review_count: number | null;
  business_status: string;
  google_maps_uri: string;
  latitude: number;
  longitude: number;
  scraped_at: string;
  notes: string;
}

interface PractitionerData {
  metadata: {
    total_count: number;
    scraped_at: string;
    source: string;
  };
  practitioners: Practitioner[];
}

async function loadPractitioners(): Promise<Practitioner[]> {
  // Return cache if available
  if (practitionersCache) {
    return practitionersCache;
  }

  // Prevent concurrent loading
  if (dataLoadPromise) {
    return dataLoadPromise;
  }

  dataLoadPromise = (async () => {
    // Try file system paths first (works locally)
    const possiblePaths = [
      // For local development - public folder
      path.join(process.cwd(), "public", "data", "practitioners.json"),
      // For local development - parent directory
      path.join(process.cwd(), "..", "canadian_practitioners", "all_practitioners_latest.json"),
    ];

    let data: PractitionerData | null = null;
    
    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, "utf-8");
          data = JSON.parse(fileContent);
          console.log(`Loaded practitioners from file: ${filePath}`);
          break;
        }
      } catch (error) {
        console.log(`Failed to load from ${filePath}:`, error);
      }
    }

    // If file not found locally, try fetching from public URL (for Vercel)
    if (!data) {
      try {
        // Get the base URL from environment or construct it
        const baseUrl = process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` 
          : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        
        console.log(`Attempting to fetch practitioners from: ${baseUrl}/data/practitioners.json`);
        const response = await fetch(`${baseUrl}/data/practitioners.json`);
        
        if (response.ok) {
          data = await response.json();
          console.log(`Loaded practitioners from URL: ${baseUrl}/data/practitioners.json`);
        } else {
          console.error(`Failed to fetch practitioners: ${response.status}`);
        }
      } catch (error) {
        console.error("Failed to fetch practitioners from URL:", error);
      }
    }

    if (!data) {
      console.error("Could not find practitioner data from any source");
      return [];
    }

    practitionersCache = data.practitioners;
    return practitionersCache;
  })();

  return dataLoadPromise;
}

async function getMetadata(): Promise<{ provinces: string[]; cities: Record<string, string[]>; types: string[] }> {
  if (metadataCache) {
    return metadataCache;
  }

  const practitioners = await loadPractitioners();
  
  // Extract unique provinces
  const provinces = [...new Set(practitioners.map(p => p.province).filter(Boolean))].sort();
  
  // Extract cities grouped by province
  const cities: Record<string, string[]> = {};
  for (const province of provinces) {
    const provincePractitioners = practitioners.filter(p => p.province === province);
    cities[province] = [...new Set(provincePractitioners.map(p => p.city).filter(Boolean))].sort();
  }
  
  // Extract unique practitioner types
  const types = [...new Set(practitioners.map(p => p.practitioner_type).filter(Boolean))].sort();
  
  metadataCache = { provinces, cities, types };
  return metadataCache;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Check if requesting metadata only
  if (searchParams.get("metadata") === "true") {
    const metadata = await getMetadata();
    return NextResponse.json(metadata);
  }

  const practitioners = await loadPractitioners();
  
  // Filter parameters
  const province = searchParams.get("province");
  const city = searchParams.get("city");
  const type = searchParams.get("type");
  const types = searchParams.get("types")?.split(",").filter(Boolean);
  const search = searchParams.get("search")?.toLowerCase();
  const minRating = searchParams.get("minRating") ? parseFloat(searchParams.get("minRating")!) : null;
  const hasPhone = searchParams.get("hasPhone") === "true";
  const phoneSearch = searchParams.get("phone");
  
  // Pagination
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "100");
  const offset = (page - 1) * limit;

  // Apply filters
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

  // Phone number search - normalize and match
  if (phoneSearch) {
    const normalizedSearch = phoneSearch.replace(/\D/g, "");
    filtered = filtered.filter(p => {
      if (!p.phone) return false;
      const normalizedPhone = p.phone.replace(/\D/g, "");
      // Match if the digits are the same (handles different formats)
      return normalizedPhone === normalizedSearch ||
             normalizedPhone.endsWith(normalizedSearch) ||
             normalizedSearch.endsWith(normalizedPhone);
    });
  }

  // Get total before pagination
  const total = filtered.length;

  // Apply pagination
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
  });
}
