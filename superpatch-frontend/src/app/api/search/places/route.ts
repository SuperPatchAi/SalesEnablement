import { NextRequest, NextResponse } from "next/server";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";
const PLACES_API_URL = "https://places.googleapis.com/v1/places:searchText";

// Fields to request from the API
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.websiteUri",
  "places.rating",
  "places.userRatingCount",
  "places.businessStatus",
  "places.googleMapsUri",
  "places.location",
  "places.addressComponents",
  "nextPageToken",
].join(",");

export interface GooglePlace {
  id: string;
  displayName: { text: string; languageCode?: string };
  formattedAddress: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  businessStatus?: string;
  googleMapsUri?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  addressComponents?: Array<{
    longText: string;
    shortText: string;
    types: string[];
  }>;
}

export interface PlacesSearchRequest {
  query: string;
  location: {
    lat: number;
    lng: number;
    radius: number;
  };
  country: "CA" | "US";
  pageToken?: string;
}

export interface PlacesSearchResponse {
  places: GooglePlace[];
  nextPageToken?: string;
  totalRequests: number;
  error?: string;
}

// Extract city and state/province from address components
function extractLocationInfo(
  addressComponents?: GooglePlace["addressComponents"]
): { city: string | null; region: string | null } {
  if (!addressComponents) return { city: null, region: null };

  let city: string | null = null;
  let region: string | null = null;

  for (const component of addressComponents) {
    if (component.types.includes("locality")) {
      city = component.longText;
    }
    if (component.types.includes("administrative_area_level_1")) {
      region = component.longText;
    }
  }

  return { city, region };
}

// Normalize place data for frontend consumption
function normalizePlaceData(place: GooglePlace, country: "CA" | "US") {
  const { city, region } = extractLocationInfo(place.addressComponents);

  return {
    id: place.id,
    name: place.displayName?.text || "Unknown",
    address: place.formattedAddress || "",
    city: city,
    province: region, // Works for both Canadian provinces and US states
    country: country,
    phone: place.nationalPhoneNumber || place.internationalPhoneNumber || null,
    website: place.websiteUri || null,
    rating: place.rating || null,
    review_count: place.userRatingCount || null,
    business_status: place.businessStatus || "OPERATIONAL",
    google_maps_uri: place.googleMapsUri || null,
    latitude: place.location?.latitude || null,
    longitude: place.location?.longitude || null,
  };
}

// POST /api/search/places - Search Google Maps Places API
export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!GOOGLE_MAPS_API_KEY) {
      return NextResponse.json(
        {
          places: [],
          error: "Google Maps API key not configured. Set GOOGLE_MAPS_API_KEY environment variable.",
        },
        { status: 500 }
      );
    }

    const body: PlacesSearchRequest = await request.json();
    const { query, location, country, pageToken } = body;

    // Validate required fields
    if (!query || !location) {
      return NextResponse.json(
        {
          places: [],
          error: "Query and location are required",
        },
        { status: 400 }
      );
    }

    // Build the search payload
    const payload: Record<string, unknown> = {
      textQuery: query,
      locationBias: {
        circle: {
          center: {
            latitude: location.lat,
            longitude: location.lng,
          },
          radius: location.radius || 20000,
        },
      },
      regionCode: country || "CA",
      languageCode: "en",
      pageSize: 20,
    };

    if (pageToken) {
      payload.pageToken = pageToken;
    }

    console.log(`[Places API] Searching: "${query}" near (${location.lat}, ${location.lng})`);

    // Make the API request
    const response = await fetch(PLACES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Places API] Error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        {
          places: [],
          error: `Google Maps API error: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawPlaces: GooglePlace[] = data.places || [];
    const nextToken: string | undefined = data.nextPageToken;

    // Normalize the place data
    const normalizedPlaces = rawPlaces.map((place) => normalizePlaceData(place, country));

    console.log(`[Places API] Found ${normalizedPlaces.length} places, nextToken: ${!!nextToken}`);

    return NextResponse.json({
      places: normalizedPlaces,
      nextPageToken: nextToken,
      totalRequests: 1,
    });
  } catch (error) {
    console.error("[Places API] Error:", error);
    return NextResponse.json(
      {
        places: [],
        error: "Failed to search places",
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing/info
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Google Maps Places Search API",
    configured: !!GOOGLE_MAPS_API_KEY,
    usage: {
      method: "POST",
      body: {
        query: "string (e.g., 'chiropractor')",
        location: {
          lat: "number",
          lng: "number",
          radius: "number (meters, default 20000)",
        },
        country: "'CA' | 'US'",
        pageToken: "string (optional, for pagination)",
      },
    },
  });
}
