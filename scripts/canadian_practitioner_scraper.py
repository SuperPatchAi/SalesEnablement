#!/usr/bin/env python3
"""
Canadian Practitioner Scraper using Google Maps Places API (New)

This script searches for wellness practitioners across Canada including:
- Acupuncturists
- Chiropractors
- Functional Medicine practitioners
- Integrative Medicine practitioners
- Massage Therapists
- Naturopaths

Collects: Name, Address, Phone, Website, Rating, Reviews, and more.
Exports to CSV and JSON formats.

Usage:
    python canadian_practitioner_scraper.py --api-key YOUR_API_KEY
    
    Or set GOOGLE_MAPS_API_KEY environment variable
"""

import os
import json
import csv
import time
import argparse
import logging
from datetime import datetime
from typing import Optional
from dataclasses import dataclass, asdict
import requests

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# =============================================================================
# CONFIGURATION
# =============================================================================

# Practitioner types to search for
PRACTITIONER_TYPES = [
    "acupuncturist",
    "chiropractor", 
    "functional medicine doctor",
    "functional medicine practitioner",
    "integrative medicine doctor",
    "integrative medicine practitioner",
    "massage therapist",
    "registered massage therapist",
    "naturopath",
    "naturopathic doctor",
]

# Major Canadian cities and regions to search
# Organized by province for comprehensive coverage
CANADIAN_LOCATIONS = {
    "Ontario": [
        {"city": "Toronto", "lat": 43.6532, "lng": -79.3832, "radius": 30000},
        {"city": "Ottawa", "lat": 45.4215, "lng": -75.6972, "radius": 25000},
        {"city": "Mississauga", "lat": 43.5890, "lng": -79.6441, "radius": 20000},
        {"city": "Brampton", "lat": 43.7315, "lng": -79.7624, "radius": 15000},
        {"city": "Hamilton", "lat": 43.2557, "lng": -79.8711, "radius": 20000},
        {"city": "London", "lat": 42.9849, "lng": -81.2453, "radius": 20000},
        {"city": "Markham", "lat": 43.8561, "lng": -79.3370, "radius": 15000},
        {"city": "Vaughan", "lat": 43.8563, "lng": -79.5085, "radius": 15000},
        {"city": "Kitchener", "lat": 43.4516, "lng": -80.4925, "radius": 15000},
        {"city": "Windsor", "lat": 42.3149, "lng": -83.0364, "radius": 15000},
        {"city": "Richmond Hill", "lat": 43.8828, "lng": -79.4403, "radius": 12000},
        {"city": "Oakville", "lat": 43.4675, "lng": -79.6877, "radius": 12000},
        {"city": "Burlington", "lat": 43.3255, "lng": -79.7990, "radius": 12000},
        {"city": "Oshawa", "lat": 43.8971, "lng": -78.8658, "radius": 15000},
        {"city": "Barrie", "lat": 44.3894, "lng": -79.6903, "radius": 15000},
        {"city": "St. Catharines", "lat": 43.1594, "lng": -79.2469, "radius": 12000},
        {"city": "Guelph", "lat": 43.5448, "lng": -80.2482, "radius": 12000},
        {"city": "Cambridge", "lat": 43.3616, "lng": -80.3144, "radius": 12000},
        {"city": "Waterloo", "lat": 43.4643, "lng": -80.5204, "radius": 12000},
        {"city": "Kingston", "lat": 44.2312, "lng": -76.4860, "radius": 15000},
    ],
    "British Columbia": [
        {"city": "Vancouver", "lat": 49.2827, "lng": -123.1207, "radius": 25000},
        {"city": "Surrey", "lat": 49.1913, "lng": -122.8490, "radius": 20000},
        {"city": "Burnaby", "lat": 49.2488, "lng": -122.9805, "radius": 15000},
        {"city": "Richmond", "lat": 49.1666, "lng": -123.1336, "radius": 15000},
        {"city": "Victoria", "lat": 48.4284, "lng": -123.3656, "radius": 20000},
        {"city": "Kelowna", "lat": 49.8880, "lng": -119.4960, "radius": 20000},
        {"city": "Coquitlam", "lat": 49.2838, "lng": -122.7932, "radius": 12000},
        {"city": "Abbotsford", "lat": 49.0504, "lng": -122.3045, "radius": 15000},
        {"city": "Langley", "lat": 49.1044, "lng": -122.6605, "radius": 12000},
        {"city": "Nanaimo", "lat": 49.1659, "lng": -123.9401, "radius": 15000},
        {"city": "Kamloops", "lat": 50.6745, "lng": -120.3273, "radius": 15000},
        {"city": "North Vancouver", "lat": 49.3165, "lng": -123.0688, "radius": 10000},
        {"city": "New Westminster", "lat": 49.2057, "lng": -122.9110, "radius": 10000},
    ],
    "Alberta": [
        {"city": "Calgary", "lat": 51.0447, "lng": -114.0719, "radius": 30000},
        {"city": "Edmonton", "lat": 53.5461, "lng": -113.4938, "radius": 30000},
        {"city": "Red Deer", "lat": 52.2681, "lng": -113.8112, "radius": 15000},
        {"city": "Lethbridge", "lat": 49.6956, "lng": -112.8451, "radius": 15000},
        {"city": "St. Albert", "lat": 53.6300, "lng": -113.6258, "radius": 12000},
        {"city": "Medicine Hat", "lat": 50.0405, "lng": -110.6764, "radius": 12000},
        {"city": "Grande Prairie", "lat": 55.1707, "lng": -118.7886, "radius": 12000},
        {"city": "Airdrie", "lat": 51.2917, "lng": -114.0144, "radius": 10000},
        {"city": "Spruce Grove", "lat": 53.5450, "lng": -113.9008, "radius": 10000},
    ],
    "Quebec": [
        {"city": "Montreal", "lat": 45.5017, "lng": -73.5673, "radius": 30000},
        {"city": "Quebec City", "lat": 46.8139, "lng": -71.2080, "radius": 25000},
        {"city": "Laval", "lat": 45.6066, "lng": -73.7124, "radius": 20000},
        {"city": "Gatineau", "lat": 45.4765, "lng": -75.7013, "radius": 20000},
        {"city": "Longueuil", "lat": 45.5312, "lng": -73.5185, "radius": 15000},
        {"city": "Sherbrooke", "lat": 45.4042, "lng": -71.8929, "radius": 15000},
        {"city": "Trois-Rivières", "lat": 46.3432, "lng": -72.5477, "radius": 12000},
        {"city": "Saguenay", "lat": 48.4280, "lng": -71.0686, "radius": 15000},
        {"city": "Lévis", "lat": 46.8032, "lng": -71.1779, "radius": 12000},
        {"city": "Terrebonne", "lat": 45.7050, "lng": -73.6473, "radius": 12000},
    ],
    "Manitoba": [
        {"city": "Winnipeg", "lat": 49.8951, "lng": -97.1384, "radius": 30000},
        {"city": "Brandon", "lat": 49.8485, "lng": -99.9500, "radius": 12000},
        {"city": "Steinbach", "lat": 49.5258, "lng": -96.6847, "radius": 8000},
    ],
    "Saskatchewan": [
        {"city": "Saskatoon", "lat": 52.1579, "lng": -106.6702, "radius": 25000},
        {"city": "Regina", "lat": 50.4452, "lng": -104.6189, "radius": 25000},
        {"city": "Prince Albert", "lat": 53.2033, "lng": -105.7531, "radius": 12000},
        {"city": "Moose Jaw", "lat": 50.3934, "lng": -105.5519, "radius": 10000},
    ],
    "Nova Scotia": [
        {"city": "Halifax", "lat": 44.6488, "lng": -63.5752, "radius": 25000},
        {"city": "Dartmouth", "lat": 44.6713, "lng": -63.5772, "radius": 12000},
        {"city": "Sydney", "lat": 46.1368, "lng": -60.1942, "radius": 12000},
    ],
    "New Brunswick": [
        {"city": "Moncton", "lat": 46.0878, "lng": -64.7782, "radius": 15000},
        {"city": "Saint John", "lat": 45.2733, "lng": -66.0633, "radius": 15000},
        {"city": "Fredericton", "lat": 45.9636, "lng": -66.6431, "radius": 15000},
    ],
    "Newfoundland and Labrador": [
        {"city": "St. John's", "lat": 47.5615, "lng": -52.7126, "radius": 20000},
        {"city": "Mount Pearl", "lat": 47.5189, "lng": -52.8058, "radius": 10000},
    ],
    "Prince Edward Island": [
        {"city": "Charlottetown", "lat": 46.2382, "lng": -63.1311, "radius": 15000},
        {"city": "Summerside", "lat": 46.3934, "lng": -63.7902, "radius": 10000},
    ],
}


@dataclass
class Practitioner:
    """Data class for practitioner information"""
    id: str
    name: str
    practitioner_type: str
    address: str
    city: str
    province: str
    phone: Optional[str]
    website: Optional[str]
    rating: Optional[float]
    review_count: Optional[int]
    business_status: Optional[str]
    google_maps_uri: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    scraped_at: str
    notes: Optional[str] = None


class GooglePlacesScraper:
    """Scraper using Google Maps Places API (New)"""
    
    BASE_URL = "https://places.googleapis.com/v1/places:searchText"
    
    # Fields to request from the API
    FIELD_MASK = ",".join([
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
        "nextPageToken"
    ])
    
    def __init__(self, api_key: str, requests_per_minute: int = 30):
        self.api_key = api_key
        self.requests_per_minute = requests_per_minute
        self.request_interval = 60.0 / requests_per_minute
        self.last_request_time = 0
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": self.FIELD_MASK
        })
        
    def _rate_limit(self):
        """Implement rate limiting"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.request_interval:
            sleep_time = self.request_interval - time_since_last
            logger.debug(f"Rate limiting: sleeping {sleep_time:.2f}s")
            time.sleep(sleep_time)
        self.last_request_time = time.time()
    
    def search_places(
        self,
        query: str,
        location: dict,
        page_token: Optional[str] = None
    ) -> tuple[list[dict], Optional[str]]:
        """
        Search for places using the Text Search API
        
        Returns:
            Tuple of (list of place results, next page token or None)
        """
        self._rate_limit()
        
        payload = {
            "textQuery": query,
            "locationBias": {
                "circle": {
                    "center": {
                        "latitude": location["lat"],
                        "longitude": location["lng"]
                    },
                    "radius": location.get("radius", 20000)
                }
            },
            "regionCode": "CA",
            "languageCode": "en",
            "pageSize": 20
        }
        
        if page_token:
            payload["pageToken"] = page_token
        
        try:
            response = self.session.post(self.BASE_URL, json=payload)
            response.raise_for_status()
            data = response.json()
            
            places = data.get("places", [])
            next_token = data.get("nextPageToken")
            
            logger.debug(f"Found {len(places)} places, next_token: {bool(next_token)}")
            return places, next_token
            
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP error: {e}")
            logger.error(f"Response: {response.text}")
            return [], None
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {e}")
            return [], None
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            return [], None
    
    def parse_place(
        self,
        place: dict,
        practitioner_type: str,
        province: str,
        city: str
    ) -> Practitioner:
        """Parse a place result into a Practitioner object"""
        
        # Extract location coordinates
        location = place.get("location", {})
        lat = location.get("latitude")
        lng = location.get("longitude")
        
        # Extract display name
        display_name = place.get("displayName", {})
        name = display_name.get("text", "Unknown")
        
        # Build notes from available info
        notes_parts = []
        if place.get("rating"):
            notes_parts.append(f"Rating: {place.get('rating')}/5")
        if place.get("userRatingCount"):
            notes_parts.append(f"Reviews: {place.get('userRatingCount')}")
        if place.get("businessStatus"):
            notes_parts.append(f"Status: {place.get('businessStatus')}")
        
        return Practitioner(
            id=place.get("id", ""),
            name=name,
            practitioner_type=practitioner_type,
            address=place.get("formattedAddress", ""),
            city=city,
            province=province,
            phone=place.get("nationalPhoneNumber") or place.get("internationalPhoneNumber"),
            website=place.get("websiteUri"),
            rating=place.get("rating"),
            review_count=place.get("userRatingCount"),
            business_status=place.get("businessStatus"),
            google_maps_uri=place.get("googleMapsUri"),
            latitude=lat,
            longitude=lng,
            scraped_at=datetime.now().isoformat(),
            notes="; ".join(notes_parts) if notes_parts else None
        )


def scrape_practitioners(
    api_key: str,
    output_dir: str = "canadian_practitioners",
    practitioner_types: Optional[list[str]] = None,
    provinces: Optional[list[str]] = None,
    max_pages_per_search: int = 5
) -> list[Practitioner]:
    """
    Main function to scrape Canadian practitioners
    
    Args:
        api_key: Google Maps API key
        output_dir: Directory to save output files
        practitioner_types: List of practitioner types to search (default: all)
        provinces: List of provinces to search (default: all)
        max_pages_per_search: Maximum pages to fetch per search query
        
    Returns:
        List of all scraped practitioners
    """
    scraper = GooglePlacesScraper(api_key)
    
    # Use defaults if not specified
    search_types = practitioner_types or PRACTITIONER_TYPES
    search_provinces = provinces or list(CANADIAN_LOCATIONS.keys())
    
    # Track unique practitioners by ID
    practitioners_by_id: dict[str, Practitioner] = {}
    
    # Statistics
    stats = {
        "total_searches": 0,
        "total_api_calls": 0,
        "total_results": 0,
        "by_type": {},
        "by_province": {}
    }
    
    total_searches = sum(
        len(CANADIAN_LOCATIONS.get(p, [])) 
        for p in search_provinces
    ) * len(search_types)
    
    logger.info(f"Starting scrape: {len(search_types)} practitioner types across {len(search_provinces)} provinces")
    logger.info(f"Estimated searches: {total_searches}")
    
    search_count = 0
    
    for prac_type in search_types:
        logger.info(f"\n{'='*60}")
        logger.info(f"Searching for: {prac_type}")
        logger.info(f"{'='*60}")
        
        stats["by_type"][prac_type] = 0
        
        for province in search_provinces:
            if province not in CANADIAN_LOCATIONS:
                logger.warning(f"Province '{province}' not in location database")
                continue
                
            locations = CANADIAN_LOCATIONS[province]
            stats["by_province"].setdefault(province, 0)
            
            for location in locations:
                search_count += 1
                city = location["city"]
                
                # Build search query
                query = f"{prac_type} in {city}, {province}, Canada"
                logger.info(f"[{search_count}/{total_searches}] Searching: {query}")
                
                stats["total_searches"] += 1
                page_count = 0
                page_token = None
                
                while page_count < max_pages_per_search:
                    places, next_token = scraper.search_places(
                        query=query,
                        location=location,
                        page_token=page_token
                    )
                    
                    stats["total_api_calls"] += 1
                    
                    if not places:
                        break
                    
                    for place in places:
                        practitioner = scraper.parse_place(
                            place, prac_type, province, city
                        )
                        
                        # Deduplicate by ID
                        if practitioner.id not in practitioners_by_id:
                            practitioners_by_id[practitioner.id] = practitioner
                            stats["total_results"] += 1
                            stats["by_type"][prac_type] += 1
                            stats["by_province"][province] += 1
                    
                    logger.info(f"  Page {page_count + 1}: Found {len(places)} results " +
                               f"(Total unique: {len(practitioners_by_id)})")
                    
                    if not next_token:
                        break
                    
                    page_token = next_token
                    page_count += 1
    
    # Convert to list
    practitioners = list(practitioners_by_id.values())
    
    # Log statistics
    logger.info(f"\n{'='*60}")
    logger.info("SCRAPING COMPLETE - STATISTICS")
    logger.info(f"{'='*60}")
    logger.info(f"Total API calls: {stats['total_api_calls']}")
    logger.info(f"Total unique practitioners: {len(practitioners)}")
    logger.info(f"\nBy practitioner type:")
    for prac_type, count in sorted(stats["by_type"].items(), key=lambda x: -x[1]):
        logger.info(f"  {prac_type}: {count}")
    logger.info(f"\nBy province:")
    for province, count in sorted(stats["by_province"].items(), key=lambda x: -x[1]):
        logger.info(f"  {province}: {count}")
    
    return practitioners


def export_to_csv(practitioners: list[Practitioner], filepath: str):
    """Export practitioners to CSV file"""
    if not practitioners:
        logger.warning("No practitioners to export")
        return
    
    fieldnames = [
        "id", "name", "practitioner_type", "address", "city", "province",
        "phone", "website", "rating", "review_count", "business_status",
        "google_maps_uri", "latitude", "longitude", "scraped_at", "notes"
    ]
    
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for p in practitioners:
            writer.writerow(asdict(p))
    
    logger.info(f"Exported {len(practitioners)} practitioners to {filepath}")


def export_to_json(practitioners: list[Practitioner], filepath: str):
    """Export practitioners to JSON file"""
    if not practitioners:
        logger.warning("No practitioners to export")
        return
    
    data = {
        "metadata": {
            "total_count": len(practitioners),
            "scraped_at": datetime.now().isoformat(),
            "source": "Google Maps Places API"
        },
        "practitioners": [asdict(p) for p in practitioners]
    }
    
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    logger.info(f"Exported {len(practitioners)} practitioners to {filepath}")


def export_by_type(practitioners: list[Practitioner], output_dir: str):
    """Export practitioners grouped by type"""
    by_type: dict[str, list[Practitioner]] = {}
    
    for p in practitioners:
        # Normalize type for filename
        type_key = p.practitioner_type.replace(" ", "_").lower()
        by_type.setdefault(type_key, []).append(p)
    
    for type_key, type_practitioners in by_type.items():
        filepath = os.path.join(output_dir, f"{type_key}.json")
        export_to_json(type_practitioners, filepath)


def export_by_province(practitioners: list[Practitioner], output_dir: str):
    """Export practitioners grouped by province"""
    by_province: dict[str, list[Practitioner]] = {}
    
    for p in practitioners:
        by_province.setdefault(p.province, []).append(p)
    
    for province, province_practitioners in by_province.items():
        # Normalize province name for filename
        province_key = province.replace(" ", "_").lower()
        filepath = os.path.join(output_dir, f"{province_key}.json")
        export_to_json(province_practitioners, filepath)


def main():
    parser = argparse.ArgumentParser(
        description="Scrape Canadian wellness practitioners using Google Maps Places API"
    )
    parser.add_argument(
        "--api-key",
        help="Google Maps API key (or set GOOGLE_MAPS_API_KEY env var)",
        default=os.environ.get("GOOGLE_MAPS_API_KEY")
    )
    parser.add_argument(
        "--output-dir",
        help="Output directory for results",
        default="canadian_practitioners"
    )
    parser.add_argument(
        "--types",
        nargs="+",
        help="Specific practitioner types to search",
        default=None
    )
    parser.add_argument(
        "--provinces",
        nargs="+",
        help="Specific provinces to search",
        default=None
    )
    parser.add_argument(
        "--max-pages",
        type=int,
        help="Maximum pages per search query",
        default=5
    )
    parser.add_argument(
        "--export-by-type",
        action="store_true",
        help="Also export separate files by practitioner type"
    )
    parser.add_argument(
        "--export-by-province",
        action="store_true",
        help="Also export separate files by province"
    )
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Enable verbose logging"
    )
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    if not args.api_key:
        logger.error("API key required. Use --api-key or set GOOGLE_MAPS_API_KEY env var")
        return 1
    
    # Create output directory
    os.makedirs(args.output_dir, exist_ok=True)
    
    # Run the scraper
    practitioners = scrape_practitioners(
        api_key=args.api_key,
        output_dir=args.output_dir,
        practitioner_types=args.types,
        provinces=args.provinces,
        max_pages_per_search=args.max_pages
    )
    
    if not practitioners:
        logger.warning("No practitioners found!")
        return 1
    
    # Export results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Main exports
    csv_path = os.path.join(args.output_dir, f"all_practitioners_{timestamp}.csv")
    json_path = os.path.join(args.output_dir, f"all_practitioners_{timestamp}.json")
    
    export_to_csv(practitioners, csv_path)
    export_to_json(practitioners, json_path)
    
    # Also create "latest" versions without timestamp
    csv_latest = os.path.join(args.output_dir, "all_practitioners_latest.csv")
    json_latest = os.path.join(args.output_dir, "all_practitioners_latest.json")
    export_to_csv(practitioners, csv_latest)
    export_to_json(practitioners, json_latest)
    
    # Optional exports
    if args.export_by_type:
        type_dir = os.path.join(args.output_dir, "by_type")
        os.makedirs(type_dir, exist_ok=True)
        export_by_type(practitioners, type_dir)
    
    if args.export_by_province:
        province_dir = os.path.join(args.output_dir, "by_province")
        os.makedirs(province_dir, exist_ok=True)
        export_by_province(practitioners, province_dir)
    
    logger.info(f"\n{'='*60}")
    logger.info("EXPORT COMPLETE")
    logger.info(f"{'='*60}")
    logger.info(f"Main files: {csv_path}")
    logger.info(f"            {json_path}")
    
    return 0


if __name__ == "__main__":
    exit(main())
