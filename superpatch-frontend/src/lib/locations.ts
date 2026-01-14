/**
 * North America Location Data for Practitioner Search
 * 
 * Contains coordinates and default search radii for major cities
 * in Canada and the United States for Google Maps Places API searches.
 */

export interface CityLocation {
  city: string;
  lat: number;
  lng: number;
  radius: number; // meters
}

export interface CountryData {
  name: string;
  code: "CA" | "US";
  regions: Record<string, CityLocation[]>;
}

// Practitioner types to search for
export const PRACTITIONER_TYPES = [
  { id: "chiropractor", label: "Chiropractor" },
  { id: "massage_therapist", label: "Massage Therapist" },
  { id: "registered_massage_therapist", label: "Registered Massage Therapist" },
  { id: "naturopath", label: "Naturopath" },
  { id: "naturopathic_doctor", label: "Naturopathic Doctor" },
  { id: "acupuncturist", label: "Acupuncturist" },
  { id: "functional_medicine_doctor", label: "Functional Medicine Doctor" },
  { id: "functional_medicine_practitioner", label: "Functional Medicine Practitioner" },
  { id: "integrative_medicine_doctor", label: "Integrative Medicine Doctor" },
  { id: "integrative_medicine_practitioner", label: "Integrative Medicine Practitioner" },
  { id: "physiotherapist", label: "Physiotherapist" },
  { id: "physical_therapist", label: "Physical Therapist" },
  { id: "osteopath", label: "Osteopath" },
] as const;

export type PractitionerTypeId = typeof PRACTITIONER_TYPES[number]["id"];

// Search radius options
export const RADIUS_OPTIONS = [
  { value: 5000, label: "5 km" },
  { value: 10000, label: "10 km" },
  { value: 15000, label: "15 km" },
  { value: 20000, label: "20 km" },
  { value: 25000, label: "25 km" },
  { value: 30000, label: "30 km" },
  { value: 40000, label: "40 km" },
  { value: 50000, label: "50 km" },
] as const;

// Results limit options
export const RESULTS_LIMIT_OPTIONS = [
  { value: 20, label: "20 results" },
  { value: 40, label: "40 results" },
  { value: 60, label: "60 results" },
  { value: 80, label: "80 results" },
  { value: 100, label: "100 results (max)" },
] as const;

// Canadian provinces and cities
export const CANADA: CountryData = {
  name: "Canada",
  code: "CA",
  regions: {
    "Ontario": [
      { city: "Toronto", lat: 43.6532, lng: -79.3832, radius: 30000 },
      { city: "Ottawa", lat: 45.4215, lng: -75.6972, radius: 25000 },
      { city: "Mississauga", lat: 43.5890, lng: -79.6441, radius: 20000 },
      { city: "Brampton", lat: 43.7315, lng: -79.7624, radius: 15000 },
      { city: "Hamilton", lat: 43.2557, lng: -79.8711, radius: 20000 },
      { city: "London", lat: 42.9849, lng: -81.2453, radius: 20000 },
      { city: "Markham", lat: 43.8561, lng: -79.3370, radius: 15000 },
      { city: "Vaughan", lat: 43.8563, lng: -79.5085, radius: 15000 },
      { city: "Kitchener", lat: 43.4516, lng: -80.4925, radius: 15000 },
      { city: "Windsor", lat: 42.3149, lng: -83.0364, radius: 15000 },
      { city: "Richmond Hill", lat: 43.8828, lng: -79.4403, radius: 12000 },
      { city: "Oakville", lat: 43.4675, lng: -79.6877, radius: 12000 },
      { city: "Burlington", lat: 43.3255, lng: -79.7990, radius: 12000 },
      { city: "Oshawa", lat: 43.8971, lng: -78.8658, radius: 15000 },
      { city: "Barrie", lat: 44.3894, lng: -79.6903, radius: 15000 },
      { city: "St. Catharines", lat: 43.1594, lng: -79.2469, radius: 12000 },
      { city: "Guelph", lat: 43.5448, lng: -80.2482, radius: 12000 },
      { city: "Cambridge", lat: 43.3616, lng: -80.3144, radius: 12000 },
      { city: "Waterloo", lat: 43.4643, lng: -80.5204, radius: 12000 },
      { city: "Kingston", lat: 44.2312, lng: -76.4860, radius: 15000 },
    ],
    "British Columbia": [
      { city: "Vancouver", lat: 49.2827, lng: -123.1207, radius: 25000 },
      { city: "Surrey", lat: 49.1913, lng: -122.8490, radius: 20000 },
      { city: "Burnaby", lat: 49.2488, lng: -122.9805, radius: 15000 },
      { city: "Richmond", lat: 49.1666, lng: -123.1336, radius: 15000 },
      { city: "Victoria", lat: 48.4284, lng: -123.3656, radius: 20000 },
      { city: "Kelowna", lat: 49.8880, lng: -119.4960, radius: 20000 },
      { city: "Coquitlam", lat: 49.2838, lng: -122.7932, radius: 12000 },
      { city: "Abbotsford", lat: 49.0504, lng: -122.3045, radius: 15000 },
      { city: "Langley", lat: 49.1044, lng: -122.6605, radius: 12000 },
      { city: "Nanaimo", lat: 49.1659, lng: -123.9401, radius: 15000 },
      { city: "Kamloops", lat: 50.6745, lng: -120.3273, radius: 15000 },
      { city: "North Vancouver", lat: 49.3165, lng: -123.0688, radius: 10000 },
      { city: "New Westminster", lat: 49.2057, lng: -122.9110, radius: 10000 },
    ],
    "Alberta": [
      { city: "Calgary", lat: 51.0447, lng: -114.0719, radius: 30000 },
      { city: "Edmonton", lat: 53.5461, lng: -113.4938, radius: 30000 },
      { city: "Red Deer", lat: 52.2681, lng: -113.8112, radius: 15000 },
      { city: "Lethbridge", lat: 49.6956, lng: -112.8451, radius: 15000 },
      { city: "St. Albert", lat: 53.6300, lng: -113.6258, radius: 12000 },
      { city: "Medicine Hat", lat: 50.0405, lng: -110.6764, radius: 12000 },
      { city: "Grande Prairie", lat: 55.1707, lng: -118.7886, radius: 12000 },
      { city: "Airdrie", lat: 51.2917, lng: -114.0144, radius: 10000 },
      { city: "Spruce Grove", lat: 53.5450, lng: -113.9008, radius: 10000 },
    ],
    "Quebec": [
      { city: "Montreal", lat: 45.5017, lng: -73.5673, radius: 30000 },
      { city: "Quebec City", lat: 46.8139, lng: -71.2080, radius: 25000 },
      { city: "Laval", lat: 45.6066, lng: -73.7124, radius: 20000 },
      { city: "Gatineau", lat: 45.4765, lng: -75.7013, radius: 20000 },
      { city: "Longueuil", lat: 45.5312, lng: -73.5185, radius: 15000 },
      { city: "Sherbrooke", lat: 45.4042, lng: -71.8929, radius: 15000 },
      { city: "Trois-Rivières", lat: 46.3432, lng: -72.5477, radius: 12000 },
      { city: "Saguenay", lat: 48.4280, lng: -71.0686, radius: 15000 },
      { city: "Lévis", lat: 46.8032, lng: -71.1779, radius: 12000 },
      { city: "Terrebonne", lat: 45.7050, lng: -73.6473, radius: 12000 },
    ],
    "Manitoba": [
      { city: "Winnipeg", lat: 49.8951, lng: -97.1384, radius: 30000 },
      { city: "Brandon", lat: 49.8485, lng: -99.9500, radius: 12000 },
      { city: "Steinbach", lat: 49.5258, lng: -96.6847, radius: 8000 },
    ],
    "Saskatchewan": [
      { city: "Saskatoon", lat: 52.1579, lng: -106.6702, radius: 25000 },
      { city: "Regina", lat: 50.4452, lng: -104.6189, radius: 25000 },
      { city: "Prince Albert", lat: 53.2033, lng: -105.7531, radius: 12000 },
      { city: "Moose Jaw", lat: 50.3934, lng: -105.5519, radius: 10000 },
    ],
    "Nova Scotia": [
      { city: "Halifax", lat: 44.6488, lng: -63.5752, radius: 25000 },
      { city: "Dartmouth", lat: 44.6713, lng: -63.5772, radius: 12000 },
      { city: "Sydney", lat: 46.1368, lng: -60.1942, radius: 12000 },
    ],
    "New Brunswick": [
      { city: "Moncton", lat: 46.0878, lng: -64.7782, radius: 15000 },
      { city: "Saint John", lat: 45.2733, lng: -66.0633, radius: 15000 },
      { city: "Fredericton", lat: 45.9636, lng: -66.6431, radius: 15000 },
    ],
    "Newfoundland and Labrador": [
      { city: "St. John's", lat: 47.5615, lng: -52.7126, radius: 20000 },
      { city: "Mount Pearl", lat: 47.5189, lng: -52.8058, radius: 10000 },
    ],
    "Prince Edward Island": [
      { city: "Charlottetown", lat: 46.2382, lng: -63.1311, radius: 15000 },
      { city: "Summerside", lat: 46.3934, lng: -63.7902, radius: 10000 },
    ],
  },
};

// US states and cities
export const USA: CountryData = {
  name: "United States",
  code: "US",
  regions: {
    "California": [
      { city: "Los Angeles", lat: 34.0522, lng: -118.2437, radius: 40000 },
      { city: "San Francisco", lat: 37.7749, lng: -122.4194, radius: 25000 },
      { city: "San Diego", lat: 32.7157, lng: -117.1611, radius: 30000 },
      { city: "San Jose", lat: 37.3382, lng: -121.8863, radius: 25000 },
      { city: "Sacramento", lat: 38.5816, lng: -121.4944, radius: 25000 },
      { city: "Fresno", lat: 36.7378, lng: -119.7871, radius: 20000 },
      { city: "Long Beach", lat: 33.7701, lng: -118.1937, radius: 20000 },
      { city: "Oakland", lat: 37.8044, lng: -122.2712, radius: 20000 },
      { city: "Bakersfield", lat: 35.3733, lng: -119.0187, radius: 20000 },
      { city: "Anaheim", lat: 33.8366, lng: -117.9143, radius: 15000 },
      { city: "Santa Ana", lat: 33.7455, lng: -117.8677, radius: 15000 },
      { city: "Irvine", lat: 33.6846, lng: -117.8265, radius: 15000 },
    ],
    "New York": [
      { city: "New York City", lat: 40.7128, lng: -74.0060, radius: 30000 },
      { city: "Buffalo", lat: 42.8864, lng: -78.8784, radius: 20000 },
      { city: "Rochester", lat: 43.1566, lng: -77.6088, radius: 20000 },
      { city: "Yonkers", lat: 40.9312, lng: -73.8987, radius: 15000 },
      { city: "Syracuse", lat: 43.0481, lng: -76.1474, radius: 20000 },
      { city: "Albany", lat: 42.6526, lng: -73.7562, radius: 20000 },
    ],
    "Texas": [
      { city: "Houston", lat: 29.7604, lng: -95.3698, radius: 40000 },
      { city: "San Antonio", lat: 29.4241, lng: -98.4936, radius: 35000 },
      { city: "Dallas", lat: 32.7767, lng: -96.7970, radius: 35000 },
      { city: "Austin", lat: 30.2672, lng: -97.7431, radius: 30000 },
      { city: "Fort Worth", lat: 32.7555, lng: -97.3308, radius: 25000 },
      { city: "El Paso", lat: 31.7619, lng: -106.4850, radius: 25000 },
      { city: "Arlington", lat: 32.7357, lng: -97.1081, radius: 20000 },
      { city: "Plano", lat: 33.0198, lng: -96.6989, radius: 15000 },
    ],
    "Florida": [
      { city: "Miami", lat: 25.7617, lng: -80.1918, radius: 30000 },
      { city: "Orlando", lat: 28.5383, lng: -81.3792, radius: 30000 },
      { city: "Tampa", lat: 27.9506, lng: -82.4572, radius: 30000 },
      { city: "Jacksonville", lat: 30.3322, lng: -81.6557, radius: 35000 },
      { city: "Fort Lauderdale", lat: 26.1224, lng: -80.1373, radius: 20000 },
      { city: "St. Petersburg", lat: 27.7676, lng: -82.6403, radius: 20000 },
      { city: "West Palm Beach", lat: 26.7153, lng: -80.0534, radius: 20000 },
    ],
    "Illinois": [
      { city: "Chicago", lat: 41.8781, lng: -87.6298, radius: 35000 },
      { city: "Aurora", lat: 41.7606, lng: -88.3201, radius: 15000 },
      { city: "Naperville", lat: 41.7508, lng: -88.1535, radius: 15000 },
      { city: "Rockford", lat: 42.2711, lng: -89.0940, radius: 20000 },
      { city: "Springfield", lat: 39.7817, lng: -89.6501, radius: 20000 },
    ],
    "Pennsylvania": [
      { city: "Philadelphia", lat: 39.9526, lng: -75.1652, radius: 30000 },
      { city: "Pittsburgh", lat: 40.4406, lng: -79.9959, radius: 25000 },
      { city: "Allentown", lat: 40.6084, lng: -75.4902, radius: 15000 },
      { city: "Erie", lat: 42.1292, lng: -80.0851, radius: 15000 },
    ],
    "Ohio": [
      { city: "Columbus", lat: 39.9612, lng: -82.9988, radius: 30000 },
      { city: "Cleveland", lat: 41.4993, lng: -81.6944, radius: 25000 },
      { city: "Cincinnati", lat: 39.1031, lng: -84.5120, radius: 25000 },
      { city: "Toledo", lat: 41.6528, lng: -83.5379, radius: 20000 },
      { city: "Akron", lat: 41.0814, lng: -81.5190, radius: 20000 },
    ],
    "Georgia": [
      { city: "Atlanta", lat: 33.7490, lng: -84.3880, radius: 35000 },
      { city: "Augusta", lat: 33.4735, lng: -82.0105, radius: 20000 },
      { city: "Savannah", lat: 32.0809, lng: -81.0912, radius: 20000 },
    ],
    "North Carolina": [
      { city: "Charlotte", lat: 35.2271, lng: -80.8431, radius: 30000 },
      { city: "Raleigh", lat: 35.7796, lng: -78.6382, radius: 25000 },
      { city: "Durham", lat: 35.9940, lng: -78.8986, radius: 20000 },
      { city: "Greensboro", lat: 36.0726, lng: -79.7920, radius: 20000 },
    ],
    "Michigan": [
      { city: "Detroit", lat: 42.3314, lng: -83.0458, radius: 30000 },
      { city: "Grand Rapids", lat: 42.9634, lng: -85.6681, radius: 20000 },
      { city: "Ann Arbor", lat: 42.2808, lng: -83.7430, radius: 15000 },
      { city: "Lansing", lat: 42.7325, lng: -84.5555, radius: 20000 },
    ],
    "New Jersey": [
      { city: "Newark", lat: 40.7357, lng: -74.1724, radius: 20000 },
      { city: "Jersey City", lat: 40.7178, lng: -74.0431, radius: 15000 },
      { city: "Paterson", lat: 40.9168, lng: -74.1718, radius: 15000 },
      { city: "Trenton", lat: 40.2171, lng: -74.7429, radius: 15000 },
    ],
    "Virginia": [
      { city: "Virginia Beach", lat: 36.8529, lng: -75.9780, radius: 25000 },
      { city: "Norfolk", lat: 36.8508, lng: -76.2859, radius: 20000 },
      { city: "Richmond", lat: 37.5407, lng: -77.4360, radius: 25000 },
      { city: "Arlington", lat: 38.8816, lng: -77.0910, radius: 15000 },
    ],
    "Washington": [
      { city: "Seattle", lat: 47.6062, lng: -122.3321, radius: 30000 },
      { city: "Spokane", lat: 47.6588, lng: -117.4260, radius: 20000 },
      { city: "Tacoma", lat: 47.2529, lng: -122.4443, radius: 20000 },
      { city: "Bellevue", lat: 47.6101, lng: -122.2015, radius: 15000 },
    ],
    "Arizona": [
      { city: "Phoenix", lat: 33.4484, lng: -112.0740, radius: 40000 },
      { city: "Tucson", lat: 32.2226, lng: -110.9747, radius: 30000 },
      { city: "Mesa", lat: 33.4152, lng: -111.8315, radius: 20000 },
      { city: "Scottsdale", lat: 33.4942, lng: -111.9261, radius: 20000 },
    ],
    "Massachusetts": [
      { city: "Boston", lat: 42.3601, lng: -71.0589, radius: 25000 },
      { city: "Worcester", lat: 42.2626, lng: -71.8023, radius: 20000 },
      { city: "Springfield", lat: 42.1015, lng: -72.5898, radius: 20000 },
      { city: "Cambridge", lat: 42.3736, lng: -71.1097, radius: 10000 },
    ],
    "Tennessee": [
      { city: "Nashville", lat: 36.1627, lng: -86.7816, radius: 30000 },
      { city: "Memphis", lat: 35.1495, lng: -90.0490, radius: 30000 },
      { city: "Knoxville", lat: 35.9606, lng: -83.9207, radius: 20000 },
      { city: "Chattanooga", lat: 35.0456, lng: -85.3097, radius: 20000 },
    ],
    "Colorado": [
      { city: "Denver", lat: 39.7392, lng: -104.9903, radius: 30000 },
      { city: "Colorado Springs", lat: 38.8339, lng: -104.8214, radius: 25000 },
      { city: "Aurora", lat: 39.7294, lng: -104.8319, radius: 20000 },
      { city: "Boulder", lat: 40.0150, lng: -105.2705, radius: 15000 },
    ],
    "Maryland": [
      { city: "Baltimore", lat: 39.2904, lng: -76.6122, radius: 25000 },
      { city: "Rockville", lat: 39.0840, lng: -77.1528, radius: 15000 },
      { city: "Frederick", lat: 39.4143, lng: -77.4105, radius: 15000 },
    ],
    "Minnesota": [
      { city: "Minneapolis", lat: 44.9778, lng: -93.2650, radius: 25000 },
      { city: "St. Paul", lat: 44.9537, lng: -93.0900, radius: 20000 },
      { city: "Rochester", lat: 44.0121, lng: -92.4802, radius: 20000 },
    ],
    "Wisconsin": [
      { city: "Milwaukee", lat: 43.0389, lng: -87.9065, radius: 25000 },
      { city: "Madison", lat: 43.0731, lng: -89.4012, radius: 20000 },
      { city: "Green Bay", lat: 44.5192, lng: -88.0198, radius: 15000 },
    ],
    "Oregon": [
      { city: "Portland", lat: 45.5152, lng: -122.6784, radius: 30000 },
      { city: "Salem", lat: 44.9429, lng: -123.0351, radius: 20000 },
      { city: "Eugene", lat: 44.0521, lng: -123.0868, radius: 20000 },
    ],
    "Nevada": [
      { city: "Las Vegas", lat: 36.1699, lng: -115.1398, radius: 35000 },
      { city: "Henderson", lat: 36.0395, lng: -114.9817, radius: 20000 },
      { city: "Reno", lat: 39.5296, lng: -119.8138, radius: 20000 },
    ],
  },
};

// Combined locations for easy access
export const NORTH_AMERICA_LOCATIONS = {
  CA: CANADA,
  US: USA,
} as const;

// Helper functions
export function getRegions(countryCode: "CA" | "US"): string[] {
  return Object.keys(NORTH_AMERICA_LOCATIONS[countryCode].regions).sort();
}

export function getCities(countryCode: "CA" | "US", region: string): CityLocation[] {
  return NORTH_AMERICA_LOCATIONS[countryCode].regions[region] || [];
}

export function findCity(
  countryCode: "CA" | "US",
  region: string,
  cityName: string
): CityLocation | undefined {
  const cities = getCities(countryCode, region);
  return cities.find((c) => c.city === cityName);
}

export function getCountryLabel(countryCode: "CA" | "US"): string {
  return countryCode === "CA" ? "🇨🇦 Canada" : "🇺🇸 United States";
}

export function getRegionLabel(countryCode: "CA" | "US"): string {
  return countryCode === "CA" ? "Province" : "State";
}
