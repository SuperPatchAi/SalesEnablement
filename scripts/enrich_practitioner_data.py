#!/usr/bin/env python3
"""
Practitioner Data Enrichment using Firecrawl (Scrape Mode - 1 credit per page)

Enhances the scraped Canadian practitioner data by:
1. Scraping clinic websites to find individual practitioner names
2. Extracting emails, specialties, and bios
3. Finding team/staff pages for multi-practitioner clinics

COST: ~1 credit per clinic (uses Scrape, not Extract)
With 100,000 credits/month, you can enrich ALL 12,492 clinics!

Usage:
    python enrich_practitioner_data.py --input all_practitioners_latest.csv --limit 100
    
Requires:
    pip install requests
    FIRECRAWL_API_KEY environment variable
"""

import os
import json
import csv
import time
import re
import argparse
import logging
from datetime import datetime
from typing import Optional
import requests

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class FirecrawlEnricher:
    """Use Firecrawl Scrape (1 credit) to extract practitioner details from clinic websites"""
    
    SCRAPE_URL = "https://api.firecrawl.dev/v1/scrape"
    MAP_URL = "https://api.firecrawl.dev/v1/map"
    
    # Common practitioner title patterns
    TITLE_PATTERNS = [
        r'\b(Dr\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',  # Dr. First Last
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?),?\s*(?:DC|RMT|ND|LAc|R\.Ac|RAc|PhD|MD|DO|PT|DPT|OT|RN|NP|PA|LMT|CMT|DOMP)',  # Name, Credentials
        r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*[-–]\s*(?:Chiropractor|Massage Therapist|Naturopath|Acupuncturist|Physiotherapist)',  # Name - Title
        r'(?:Meet|About)\s+(?:Dr\.?\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',  # Meet Dr. Name
    ]
    
    # Credential patterns
    CREDENTIALS = [
        'DC', 'RMT', 'ND', 'LAc', 'R.Ac', 'RAc', 'PhD', 'MD', 'DO', 
        'PT', 'DPT', 'OT', 'RN', 'NP', 'PA', 'LMT', 'CMT', 'DOMP',
        'BSc', 'MSc', 'BScN', 'MScN', 'CFMP', 'DACM', 'DOM', 'Dipl.Ac',
        'Registered Massage Therapist', 'Doctor of Chiropractic',
        'Naturopathic Doctor', 'Licensed Acupuncturist'
    ]
    
    # Email exclusion patterns
    EMAIL_EXCLUSIONS = [
        'example.com', 'wordpress', 'gravatar', 'wix', 'squarespace',
        'sentry', 'cloudflare', 'google', 'facebook', 'twitter',
        'instagram', 'linkedin', 'youtube', 'noreply', 'no-reply',
        'support@', 'webmaster', 'admin@wordpress'
    ]
    
    def __init__(self, api_key: str, requests_per_minute: int = 20):
        self.api_key = api_key
        self.request_interval = 60.0 / requests_per_minute
        self.last_request_time = 0
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        })
        self.credits_used = 0
    
    def _rate_limit(self):
        """Implement rate limiting"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.request_interval:
            sleep_time = self.request_interval - time_since_last
            time.sleep(sleep_time)
        self.last_request_time = time.time()
    
    def scrape_website(self, website_url: str) -> Optional[dict]:
        """
        Scrape a clinic website (1 credit) and parse for practitioner info
        """
        self._rate_limit()
        
        payload = {
            "url": website_url,
            "formats": ["markdown"],
            "onlyMainContent": False,  # Get full page including headers/footers
            "timeout": 30000
        }
        
        try:
            response = self.session.post(self.SCRAPE_URL, json=payload, timeout=60)
            response.raise_for_status()
            data = response.json()
            self.credits_used += 1
            
            if data.get("success") and data.get("data", {}).get("markdown"):
                content = data["data"]["markdown"]
                metadata = data.get("data", {}).get("metadata", {})
                
                # Parse the content for practitioner info
                return self._parse_content(content, metadata, website_url)
            else:
                logger.warning(f"No content from {website_url}")
                return None
                
        except requests.exceptions.Timeout:
            logger.error(f"Timeout scraping {website_url}")
            return None
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP error for {website_url}: {e}")
            return None
        except Exception as e:
            logger.error(f"Error scraping {website_url}: {e}")
            return None
    
    def _parse_content(self, content: str, metadata: dict, url: str) -> dict:
        """Parse scraped content to extract practitioner information"""
        
        result = {
            "url": url,
            "title": metadata.get("title", ""),
            "description": metadata.get("description", ""),
            "practitioners": [],
            "emails": [],
            "phones": [],
            "services": [],
            "raw_text_preview": content[:1000] if content else ""
        }
        
        # Extract emails
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        emails = re.findall(email_pattern, content)
        filtered_emails = [
            e for e in emails 
            if not any(excl in e.lower() for excl in self.EMAIL_EXCLUSIONS)
        ]
        result["emails"] = list(set(filtered_emails))[:5]  # Max 5 unique emails
        
        # Extract phone numbers (Canadian format)
        phone_pattern = r'(?:\+1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_pattern, content)
        result["phones"] = list(set(phones))[:3]  # Max 3 unique phones
        
        # Extract practitioner names with credentials
        practitioners = self._extract_practitioners(content)
        result["practitioners"] = practitioners
        
        # Extract services mentioned
        services = self._extract_services(content)
        result["services"] = services
        
        # Check for key phrases
        content_lower = content.lower()
        # Extract languages spoken
        result["languages"] = self._extract_languages(content)
        
        return result
    
    def _extract_practitioners(self, content: str) -> list:
        """Extract practitioner names and credentials from content"""
        practitioners = []
        seen_names = set()
        
        # Split into lines for context
        lines = content.split('\n')
        
        for line in lines:
            # Skip very short or very long lines
            if len(line) < 5 or len(line) > 500:
                continue
            
            # Look for credential patterns
            for cred in self.CREDENTIALS:
                if cred in line:
                    # Try to extract name near the credential
                    # Pattern: Name followed by comma and credentials
                    pattern = rf'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?(?:\s+[A-Z][a-z]+)?)\s*[,\-–]\s*.*{re.escape(cred)}'
                    matches = re.findall(pattern, line)
                    
                    for name in matches:
                        name = name.strip()
                        if name and name not in seen_names and len(name) > 3:
                            # Filter out common false positives
                            if not any(fp in name.lower() for fp in ['click', 'read', 'more', 'view', 'our', 'the', 'and']):
                                seen_names.add(name)
                                practitioners.append({
                                    "name": name,
                                    "credentials": cred,
                                    "context": line[:200]
                                })
            
            # Look for "Dr." pattern
            dr_pattern = r'Dr\.?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)'
            dr_matches = re.findall(dr_pattern, line)
            for name in dr_matches:
                name = f"Dr. {name.strip()}"
                if name not in seen_names:
                    seen_names.add(name)
                    practitioners.append({
                        "name": name,
                        "credentials": "Dr.",
                        "context": line[:200]
                    })
        
        return practitioners[:10]  # Max 10 practitioners
    
    def _extract_services(self, content: str) -> list:
        """Extract services mentioned in the content"""
        service_keywords = [
            "chiropractic", "massage therapy", "acupuncture", "naturopathy",
            "physiotherapy", "physical therapy", "osteopathy", "cupping",
            "dry needling", "spinal decompression", "laser therapy",
            "shockwave therapy", "athletic therapy", "sports massage",
            "deep tissue", "prenatal massage", "pediatric", "orthotics",
            "nutrition", "herbal medicine", "homeopathy", "iv therapy",
            "functional medicine", "integrative medicine", "wellness",
            "rehabilitation", "manual therapy", "adjustments"
        ]
        
        content_lower = content.lower()
        found_services = []
        
        for service in service_keywords:
            if service in content_lower:
                found_services.append(service.title())
        
        return found_services[:15]  # Max 15 services
    
    def _extract_languages(self, content: str) -> list:
        """Extract languages spoken at the clinic"""
        # Common languages in Canada
        languages = {
            "english": ["english", "anglais"],
            "french": ["french", "français", "francais", "francophone"],
            "mandarin": ["mandarin", "chinese", "中文", "普通话", "國語"],
            "cantonese": ["cantonese", "广东话", "粵語"],
            "punjabi": ["punjabi", "ਪੰਜਾਬੀ"],
            "spanish": ["spanish", "español", "espanol"],
            "tagalog": ["tagalog", "filipino"],
            "arabic": ["arabic", "العربية"],
            "italian": ["italian", "italiano"],
            "german": ["german", "deutsch"],
            "portuguese": ["portuguese", "português", "portugues"],
            "polish": ["polish", "polski"],
            "vietnamese": ["vietnamese", "tiếng việt"],
            "korean": ["korean", "한국어"],
            "japanese": ["japanese", "日本語"],
            "hindi": ["hindi", "हिन्दी"],
            "urdu": ["urdu", "اردو"],
            "russian": ["russian", "русский"],
            "persian": ["persian", "farsi", "فارسی"],
            "greek": ["greek", "ελληνικά"],
            "ukrainian": ["ukrainian", "українська"],
            "tamil": ["tamil", "தமிழ்"],
            "gujarati": ["gujarati", "ગુજરાતી"],
            "bengali": ["bengali", "বাংলা"],
        }
        
        content_lower = content.lower()
        found_languages = []
        
        # Look for language-related sections
        language_indicators = [
            "languages spoken", "we speak", "languages:", "fluent in",
            "bilingual", "multilingual", "langues parlées", "nous parlons"
        ]
        
        # Check if there's a language section
        has_language_section = any(ind in content_lower for ind in language_indicators)
        
        for lang_name, keywords in languages.items():
            for keyword in keywords:
                if keyword in content_lower:
                    # If there's a dedicated language section, be more confident
                    # Otherwise, only add if it seems like a language reference
                    if has_language_section or any(f"{keyword}" in content_lower for indicator in ["speak", "fluent", "language"]):
                        if lang_name.title() not in found_languages:
                            found_languages.append(lang_name.title())
                        break
        
        # Default to English if in Canada and nothing found
        if not found_languages:
            # Check if French content (Quebec)
            french_indicators = ["québec", "quebec", "montréal", "montreal", "laval", "gatineau"]
            if any(ind in content_lower for ind in french_indicators):
                found_languages = ["French", "English"]
            else:
                found_languages = ["English"]  # Default assumption
        
        return found_languages[:10]  # Max 10 languages


def load_practitioners(csv_path: str) -> list[dict]:
    """Load practitioners from CSV"""
    practitioners = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            practitioners.append(row)
    return practitioners


def save_enriched_data(practitioners: list[dict], output_path: str, credits_used: int = 0):
    """Save enriched data to JSON"""
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump({
            "metadata": {
                "enriched_at": datetime.now().isoformat(),
                "total_count": len(practitioners),
                "source": "Firecrawl Scrape API (1 credit/page)",
                "credits_used": credits_used
            },
            "practitioners": practitioners
        }, f, indent=2, ensure_ascii=False)
    logger.info(f"Saved enriched data to {output_path}")


def save_progress(practitioners: list[dict], output_path: str, processed_ids: set):
    """Save progress checkpoint"""
    checkpoint = {
        "processed_ids": list(processed_ids),
        "practitioners": practitioners,
        "timestamp": datetime.now().isoformat()
    }
    checkpoint_path = output_path.replace('.json', '_checkpoint.json')
    with open(checkpoint_path, 'w', encoding='utf-8') as f:
        json.dump(checkpoint, f, indent=2)
    logger.debug(f"Checkpoint saved: {len(processed_ids)} processed")


def load_checkpoint(output_path: str) -> tuple[list[dict], set]:
    """Load from checkpoint if exists"""
    checkpoint_path = output_path.replace('.json', '_checkpoint.json')
    if os.path.exists(checkpoint_path):
        with open(checkpoint_path, 'r', encoding='utf-8') as f:
            checkpoint = json.load(f)
        logger.info(f"Resuming from checkpoint: {len(checkpoint['processed_ids'])} already processed")
        return checkpoint['practitioners'], set(checkpoint['processed_ids'])
    return [], set()


def enrich_practitioners(
    input_csv: str,
    output_json: str,
    api_key: str,
    limit: Optional[int] = None,
    min_rating: float = 0,
    province_filter: Optional[str] = None,
    type_filter: Optional[str] = None,
    resume: bool = True,
    skip: int = 0
) -> list[dict]:
    """
    Main enrichment function - uses Scrape (1 credit) instead of Extract (24 credits)
    """
    enricher = FirecrawlEnricher(api_key, requests_per_minute=20)
    
    # Load practitioners
    practitioners = load_practitioners(input_csv)
    logger.info(f"Loaded {len(practitioners)} practitioners from CSV")
    
    # Apply filters
    filtered = practitioners
    if min_rating > 0:
        filtered = [p for p in filtered if float(p.get('rating') or 0) >= min_rating]
        logger.info(f"After rating filter (>={min_rating}): {len(filtered)}")
    
    if province_filter:
        filtered = [p for p in filtered if p.get('province', '').lower() == province_filter.lower()]
        logger.info(f"After province filter ({province_filter}): {len(filtered)}")
    
    if type_filter:
        filtered = [p for p in filtered if type_filter.lower() in p.get('practitioner_type', '').lower()]
        logger.info(f"After type filter ({type_filter}): {len(filtered)}")
    
    # Only process those with websites
    filtered = [p for p in filtered if p.get('website')]
    logger.info(f"With websites: {len(filtered)}")
    
    # Apply skip (for resuming from previous runs)
    if skip > 0:
        filtered = filtered[skip:]
        logger.info(f"After skipping first {skip}: {len(filtered)}")
    
    if limit:
        filtered = filtered[:limit]
        logger.info(f"Limited to: {len(filtered)}")
    
    # Resume from checkpoint
    enriched_data, processed_ids = ([], set())
    if resume:
        enriched_data, processed_ids = load_checkpoint(output_json)
    
    # Stats
    stats = {
        "total": len(filtered),
        "processed": len(processed_ids),
        "enriched": 0,
        "failed": 0,
        "practitioners_found": 0,
        "emails_found": 0,
        "multilingual_clinics": 0
    }
    
    logger.info(f"\n{'='*60}")
    logger.info(f"FIRECRAWL ENRICHMENT (Scrape Mode - 1 credit/page)")
    logger.info(f"{'='*60}")
    logger.info(f"Clinics to process: {len(filtered)}")
    logger.info(f"Estimated credits: {len(filtered)} credits")
    logger.info(f"Already processed: {len(processed_ids)}")
    logger.info(f"{'='*60}\n")
    
    for i, clinic in enumerate(filtered):
        clinic_id = clinic.get('id')
        
        # Skip if already processed
        if clinic_id in processed_ids:
            continue
        
        website = clinic.get('website')
        name = clinic.get('name')
        
        logger.info(f"[{i+1}/{len(filtered)}] {name}")
        logger.info(f"  🌐 {website}")
        
        # Scrape website (1 credit)
        scraped = enricher.scrape_website(website)
        
        # Build enriched record
        enriched_record = {
            **clinic,  # Original data
            "enrichment": {
                "scraped_at": datetime.now().isoformat(),
                "success": scraped is not None,
                "data": scraped
            }
        }
        
        if scraped:
            stats["enriched"] += 1
            practitioners_found = len(scraped.get("practitioners", []))
            emails_found = len(scraped.get("emails", []))
            services_found = len(scraped.get("services", []))
            languages_found = scraped.get("languages", [])
            
            stats["practitioners_found"] += practitioners_found
            stats["emails_found"] += emails_found
            if len(languages_found) > 1:
                stats["multilingual_clinics"] += 1
            
            # Log findings
            if practitioners_found > 0:
                logger.info(f"  👥 Found {practitioners_found} practitioner(s):")
                for prac in scraped.get("practitioners", [])[:3]:
                    logger.info(f"     • {prac.get('name', 'Unknown')} ({prac.get('credentials', 'N/A')})")
            
            if emails_found > 0:
                logger.info(f"  📧 Emails: {', '.join(scraped['emails'][:2])}")
            
            if services_found > 0:
                logger.info(f"  🏥 Services: {', '.join(scraped['services'][:5])}")
            
            if languages_found:
                logger.info(f"  🌍 Languages: {', '.join(languages_found)}")
        else:
            stats["failed"] += 1
            logger.info(f"  ❌ Could not scrape")
        
        enriched_data.append(enriched_record)
        processed_ids.add(clinic_id)
        stats["processed"] += 1
        
        # Save checkpoint every 25 records
        if stats["processed"] % 25 == 0:
            save_progress(enriched_data, output_json, processed_ids)
            logger.info(f"\n{'─'*60}")
            logger.info(f"Progress: {stats['processed']}/{stats['total']} | " +
                       f"Credits used: {enricher.credits_used} | " +
                       f"Practitioners: {stats['practitioners_found']} | " +
                       f"Emails: {stats['emails_found']}")
            logger.info(f"{'─'*60}\n")
    
    # Final save
    save_enriched_data(enriched_data, output_json, enricher.credits_used)
    
    # Print summary
    logger.info(f"\n{'='*60}")
    logger.info("ENRICHMENT COMPLETE")
    logger.info(f"{'='*60}")
    logger.info(f"Total processed: {stats['processed']}")
    logger.info(f"Successfully scraped: {stats['enriched']}")
    logger.info(f"Failed: {stats['failed']}")
    logger.info(f"{'─'*60}")
    logger.info(f"📊 DATA EXTRACTED:")
    logger.info(f"   Practitioners found: {stats['practitioners_found']}")
    logger.info(f"   Emails found: {stats['emails_found']}")
    logger.info(f"   Multilingual clinics: {stats['multilingual_clinics']}")
    logger.info(f"{'─'*60}")
    logger.info(f"💰 CREDITS USED: {enricher.credits_used}")
    logger.info(f"📁 Output: {output_json}")
    logger.info(f"{'='*60}")
    
    return enriched_data


def main():
    parser = argparse.ArgumentParser(
        description="Enrich Canadian practitioner data using Firecrawl"
    )
    parser.add_argument(
        "--input", "-i",
        required=True,
        help="Input CSV file from the scraper"
    )
    parser.add_argument(
        "--output", "-o",
        default=None,
        help="Output JSON file (default: enriched_practitioners_TIMESTAMP.json)"
    )
    parser.add_argument(
        "--api-key",
        default=os.environ.get("FIRECRAWL_API_KEY"),
        help="Firecrawl API key (or set FIRECRAWL_API_KEY env var)"
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Limit number of clinics to process"
    )
    parser.add_argument(
        "--min-rating",
        type=float,
        default=0,
        help="Only process clinics with rating >= this value"
    )
    parser.add_argument(
        "--province",
        default=None,
        help="Filter by province (e.g., 'Ontario')"
    )
    parser.add_argument(
        "--type",
        default=None,
        help="Filter by practitioner type (e.g., 'chiropractor')"
    )
    parser.add_argument(
        "--no-resume",
        action="store_true",
        help="Don't resume from checkpoint, start fresh"
    )
    parser.add_argument(
        "--skip",
        type=int,
        default=0,
        help="Skip the first N clinics (for resuming from a previous run)"
    )
    
    args = parser.parse_args()
    
    if not args.api_key:
        logger.error("Firecrawl API key required. Use --api-key or set FIRECRAWL_API_KEY")
        return 1
    
    # Generate output filename if not specified
    if not args.output:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        args.output = f"enriched_practitioners_{timestamp}.json"
    
    # Run enrichment
    enrich_practitioners(
        input_csv=args.input,
        output_json=args.output,
        api_key=args.api_key,
        limit=args.limit,
        min_rating=args.min_rating,
        province_filter=args.province,
        type_filter=args.type,
        resume=not args.no_resume,
        skip=args.skip
    )
    
    return 0


if __name__ == "__main__":
    exit(main())
