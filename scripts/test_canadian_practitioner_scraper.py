#!/usr/bin/env python3
"""
Tests for Canadian Practitioner Scraper

Run with: python -m pytest scripts/test_canadian_practitioner_scraper.py -v
Or simply: python scripts/test_canadian_practitioner_scraper.py
"""

import os
import json
import tempfile
import unittest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime

# Import the scraper module
from canadian_practitioner_scraper import (
    Practitioner,
    GooglePlacesScraper,
    PRACTITIONER_TYPES,
    CANADIAN_LOCATIONS,
    export_to_csv,
    export_to_json,
)


class TestPractitionerDataclass(unittest.TestCase):
    """Test the Practitioner dataclass"""
    
    def test_practitioner_creation(self):
        """Test creating a practitioner with all fields"""
        p = Practitioner(
            id="ChIJ123",
            name="Test Clinic",
            practitioner_type="chiropractor",
            address="123 Main St, Toronto, ON",
            city="Toronto",
            province="Ontario",
            phone="416-555-1234",
            website="https://testclinic.ca",
            rating=4.5,
            review_count=100,
            business_status="OPERATIONAL",
            google_maps_uri="https://maps.google.com/...",
            latitude=43.6532,
            longitude=-79.3832,
            scraped_at="2026-01-09T12:00:00",
            notes="Rating: 4.5/5; Reviews: 100"
        )
        
        self.assertEqual(p.name, "Test Clinic")
        self.assertEqual(p.city, "Toronto")
        self.assertEqual(p.rating, 4.5)
    
    def test_practitioner_optional_fields(self):
        """Test practitioner with minimal fields"""
        p = Practitioner(
            id="ChIJ456",
            name="Basic Clinic",
            practitioner_type="acupuncturist",
            address="456 Oak Ave",
            city="Vancouver",
            province="British Columbia",
            phone=None,
            website=None,
            rating=None,
            review_count=None,
            business_status=None,
            google_maps_uri=None,
            latitude=None,
            longitude=None,
            scraped_at="2026-01-09T12:00:00"
        )
        
        self.assertIsNone(p.phone)
        self.assertIsNone(p.website)
        self.assertIsNone(p.notes)


class TestCanadianLocations(unittest.TestCase):
    """Test the Canadian locations configuration"""
    
    def test_all_provinces_have_locations(self):
        """All major provinces should have location data"""
        expected_provinces = [
            "Ontario", "British Columbia", "Alberta", "Quebec",
            "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick",
            "Newfoundland and Labrador", "Prince Edward Island"
        ]
        
        for province in expected_provinces:
            self.assertIn(province, CANADIAN_LOCATIONS,
                         f"Missing province: {province}")
    
    def test_location_has_required_fields(self):
        """Each location should have city, lat, lng, radius"""
        for province, locations in CANADIAN_LOCATIONS.items():
            for loc in locations:
                self.assertIn("city", loc, f"Missing 'city' in {province}")
                self.assertIn("lat", loc, f"Missing 'lat' in {loc.get('city', 'unknown')}")
                self.assertIn("lng", loc, f"Missing 'lng' in {loc.get('city', 'unknown')}")
                self.assertIn("radius", loc, f"Missing 'radius' in {loc.get('city', 'unknown')}")
    
    def test_toronto_in_ontario(self):
        """Toronto should be in Ontario with correct coordinates"""
        ontario = CANADIAN_LOCATIONS["Ontario"]
        toronto = next((loc for loc in ontario if loc["city"] == "Toronto"), None)
        
        self.assertIsNotNone(toronto)
        self.assertAlmostEqual(toronto["lat"], 43.6532, places=2)
        self.assertAlmostEqual(toronto["lng"], -79.3832, places=2)
    
    def test_vancouver_in_bc(self):
        """Vancouver should be in BC with correct coordinates"""
        bc = CANADIAN_LOCATIONS["British Columbia"]
        vancouver = next((loc for loc in bc if loc["city"] == "Vancouver"), None)
        
        self.assertIsNotNone(vancouver)
        self.assertAlmostEqual(vancouver["lat"], 49.2827, places=2)
        self.assertAlmostEqual(vancouver["lng"], -123.1207, places=2)


class TestPractitionerTypes(unittest.TestCase):
    """Test the practitioner types configuration"""
    
    def test_required_types_present(self):
        """All required practitioner types should be defined"""
        required = [
            "acupuncturist",
            "chiropractor",
            "massage therapist",
            "naturopath"
        ]
        
        for ptype in required:
            self.assertIn(ptype, PRACTITIONER_TYPES,
                         f"Missing practitioner type: {ptype}")
    
    def test_types_are_lowercase(self):
        """All types should be lowercase for consistency"""
        for ptype in PRACTITIONER_TYPES:
            self.assertEqual(ptype, ptype.lower(),
                           f"Type should be lowercase: {ptype}")


class TestGooglePlacesScraper(unittest.TestCase):
    """Test the GooglePlacesScraper class"""
    
    def test_scraper_initialization(self):
        """Test scraper initializes with correct headers"""
        scraper = GooglePlacesScraper("test_api_key")
        
        self.assertEqual(scraper.api_key, "test_api_key")
        self.assertIn("X-Goog-Api-Key", scraper.session.headers)
        self.assertIn("X-Goog-FieldMask", scraper.session.headers)
    
    def test_field_mask_contains_required_fields(self):
        """Field mask should contain all necessary fields"""
        required_fields = [
            "places.displayName",
            "places.formattedAddress",
            "places.nationalPhoneNumber",
            "places.websiteUri",
            "places.rating",
            "places.userRatingCount",
            "places.location"
        ]
        
        for field in required_fields:
            self.assertIn(field, GooglePlacesScraper.FIELD_MASK,
                         f"Missing field in mask: {field}")
    
    @patch('requests.Session.post')
    def test_search_places_success(self, mock_post):
        """Test successful API response parsing"""
        mock_response = Mock()
        mock_response.json.return_value = {
            "places": [
                {
                    "id": "ChIJ123",
                    "displayName": {"text": "Test Clinic"},
                    "formattedAddress": "123 Main St",
                    "nationalPhoneNumber": "416-555-1234",
                    "websiteUri": "https://test.com",
                    "rating": 4.5,
                    "userRatingCount": 50,
                    "businessStatus": "OPERATIONAL",
                    "location": {"latitude": 43.65, "longitude": -79.38}
                }
            ],
            "nextPageToken": "token123"
        }
        mock_response.raise_for_status = Mock()
        mock_post.return_value = mock_response
        
        scraper = GooglePlacesScraper("test_key")
        scraper.last_request_time = 0  # Skip rate limiting for test
        
        places, next_token = scraper.search_places(
            query="chiropractor in Toronto",
            location={"lat": 43.65, "lng": -79.38, "radius": 20000}
        )
        
        self.assertEqual(len(places), 1)
        self.assertEqual(next_token, "token123")
        self.assertEqual(places[0]["id"], "ChIJ123")
    
    @patch('requests.Session.post')
    def test_search_places_empty_response(self, mock_post):
        """Test handling of empty API response"""
        mock_response = Mock()
        mock_response.json.return_value = {"places": []}
        mock_response.raise_for_status = Mock()
        mock_post.return_value = mock_response
        
        scraper = GooglePlacesScraper("test_key")
        scraper.last_request_time = 0
        
        places, next_token = scraper.search_places(
            query="rare practitioner",
            location={"lat": 43.65, "lng": -79.38, "radius": 20000}
        )
        
        self.assertEqual(len(places), 0)
        self.assertIsNone(next_token)
    
    def test_parse_place(self):
        """Test parsing a place result into Practitioner"""
        scraper = GooglePlacesScraper("test_key")
        
        place_data = {
            "id": "ChIJ789",
            "displayName": {"text": "Wellness Center"},
            "formattedAddress": "789 Health Ave, Calgary, AB",
            "nationalPhoneNumber": "403-555-9999",
            "websiteUri": "https://wellness.ca",
            "rating": 4.8,
            "userRatingCount": 200,
            "businessStatus": "OPERATIONAL",
            "googleMapsUri": "https://maps.google.com/...",
            "location": {"latitude": 51.04, "longitude": -114.07}
        }
        
        practitioner = scraper.parse_place(
            place_data,
            practitioner_type="massage therapist",
            province="Alberta",
            city="Calgary"
        )
        
        self.assertEqual(practitioner.name, "Wellness Center")
        self.assertEqual(practitioner.practitioner_type, "massage therapist")
        self.assertEqual(practitioner.city, "Calgary")
        self.assertEqual(practitioner.province, "Alberta")
        self.assertEqual(practitioner.rating, 4.8)
        self.assertIn("Rating: 4.8/5", practitioner.notes)


class TestExportFunctions(unittest.TestCase):
    """Test CSV and JSON export functions"""
    
    def setUp(self):
        """Create test practitioners"""
        self.practitioners = [
            Practitioner(
                id="test1",
                name="Test Clinic 1",
                practitioner_type="chiropractor",
                address="123 Test St",
                city="Toronto",
                province="Ontario",
                phone="416-555-0001",
                website="https://test1.ca",
                rating=4.5,
                review_count=100,
                business_status="OPERATIONAL",
                google_maps_uri="https://maps.google.com/1",
                latitude=43.65,
                longitude=-79.38,
                scraped_at="2026-01-09T12:00:00",
                notes="Test notes 1"
            ),
            Practitioner(
                id="test2",
                name="Test Clinic 2",
                practitioner_type="acupuncturist",
                address="456 Test Ave",
                city="Vancouver",
                province="British Columbia",
                phone="604-555-0002",
                website="https://test2.ca",
                rating=4.0,
                review_count=50,
                business_status="OPERATIONAL",
                google_maps_uri="https://maps.google.com/2",
                latitude=49.28,
                longitude=-123.12,
                scraped_at="2026-01-09T12:00:00",
                notes="Test notes 2"
            )
        ]
    
    def test_export_to_csv(self):
        """Test CSV export creates valid file"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
            filepath = f.name
        
        try:
            export_to_csv(self.practitioners, filepath)
            
            # Read and verify
            with open(filepath, 'r') as f:
                content = f.read()
            
            self.assertIn("Test Clinic 1", content)
            self.assertIn("Test Clinic 2", content)
            self.assertIn("chiropractor", content)
            self.assertIn("Ontario", content)
        finally:
            os.unlink(filepath)
    
    def test_export_to_json(self):
        """Test JSON export creates valid file"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            filepath = f.name
        
        try:
            export_to_json(self.practitioners, filepath)
            
            # Read and verify
            with open(filepath, 'r') as f:
                data = json.load(f)
            
            self.assertIn("metadata", data)
            self.assertIn("practitioners", data)
            self.assertEqual(data["metadata"]["total_count"], 2)
            self.assertEqual(len(data["practitioners"]), 2)
            self.assertEqual(data["practitioners"][0]["name"], "Test Clinic 1")
        finally:
            os.unlink(filepath)
    
    def test_export_empty_list(self):
        """Test export handles empty list gracefully"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
            filepath = f.name
        
        try:
            # Should not raise an error
            export_to_csv([], filepath)
        finally:
            if os.path.exists(filepath):
                os.unlink(filepath)


class TestIntegration(unittest.TestCase):
    """Integration tests (require API key)"""
    
    @unittest.skipUnless(
        os.environ.get("GOOGLE_MAPS_API_KEY"),
        "GOOGLE_MAPS_API_KEY not set"
    )
    def test_live_api_call(self):
        """Test a real API call (requires valid API key)"""
        api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
        scraper = GooglePlacesScraper(api_key)
        
        places, _ = scraper.search_places(
            query="chiropractor in Toronto, Canada",
            location={"lat": 43.6532, "lng": -79.3832, "radius": 5000}
        )
        
        # Should find at least some chiropractors in downtown Toronto
        self.assertGreater(len(places), 0, "Should find chiropractors in Toronto")
        
        # Verify first result has expected fields
        if places:
            first = places[0]
            self.assertIn("id", first)
            self.assertIn("displayName", first)


def run_quick_validation():
    """Run a quick validation of the scraper setup"""
    print("=" * 60)
    print("Canadian Practitioner Scraper - Quick Validation")
    print("=" * 60)
    
    # Check practitioner types
    print(f"\n✓ {len(PRACTITIONER_TYPES)} practitioner types configured")
    for ptype in PRACTITIONER_TYPES[:5]:
        print(f"  - {ptype}")
    print(f"  ... and {len(PRACTITIONER_TYPES) - 5} more")
    
    # Check locations
    total_cities = sum(len(locs) for locs in CANADIAN_LOCATIONS.values())
    print(f"\n✓ {len(CANADIAN_LOCATIONS)} provinces configured with {total_cities} cities")
    for province, locs in list(CANADIAN_LOCATIONS.items())[:3]:
        print(f"  - {province}: {len(locs)} cities")
    
    # Check API key
    api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
    if api_key:
        print(f"\n✓ GOOGLE_MAPS_API_KEY is set")
        print(f"  Key starts with: {api_key[:8]}...")
    else:
        print(f"\n⚠ GOOGLE_MAPS_API_KEY not set")
        print("  Set it with: export GOOGLE_MAPS_API_KEY='your_key'")
    
    print("\n" + "=" * 60)
    print("Validation complete!")
    print("=" * 60)


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--validate":
        run_quick_validation()
    else:
        # Run unit tests
        unittest.main(verbosity=2)
