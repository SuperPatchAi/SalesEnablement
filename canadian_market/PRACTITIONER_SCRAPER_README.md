# Canadian Practitioner Scraper

A comprehensive tool for collecting wellness practitioner data across Canada using the Google Maps Places API.

## 📊 Market Size (Total Addressable Market)

Based on deep research from Canadian regulatory bodies and professional associations:

| Practitioner Type | Est. Total in Canada | Primary Regions | Data Source |
|-------------------|---------------------|-----------------|-------------|
| **Massage Therapists** | **23,000+** | Ontario, BC | CRMTA |
| **Chiropractors** | **~9,000** | Ontario, Quebec, BC | Canadian Chiropractic Association |
| **Acupuncturists** | **~4,000** | BC, Ontario, Quebec | Provincial regulatory bodies |
| **Integrative Medicine** | **~2,500** | Urban centers | Industry analysis |
| **Functional Medicine** | **~1,500** | Toronto, Vancouver | Industry analysis |
| **Naturopaths** | **~800** | BC, Ontario | Provincial regulatory bodies |
| **TOTAL** | **~40,800** | | |

### Market Insights

- **Largest segment**: Massage therapists (56% of total market)
- **Most regulated**: Chiropractors (standardized across all provinces)
- **Fastest growing**: Acupuncture (particularly in BC)
- **High-density provinces**: Ontario, British Columbia, Quebec

## Overview

This scraper collects business information for various wellness practitioners including:

| Practitioner Type | Search Terms |
|------------------|--------------|
| Acupuncturists | acupuncturist |
| Chiropractors | chiropractor |
| Functional Medicine | functional medicine doctor, functional medicine practitioner |
| Integrative Medicine | integrative medicine doctor, integrative medicine practitioner |
| Massage Therapists | massage therapist, registered massage therapist |
| Naturopaths | naturopath, naturopathic doctor |

## Data Collected

For each practitioner, the following information is collected:

| Field | Description |
|-------|-------------|
| `id` | Unique Google Place ID |
| `name` | Business name |
| `practitioner_type` | Type of practitioner |
| `address` | Full formatted address |
| `city` | City name |
| `province` | Province name |
| `phone` | Phone number (national format) |
| `website` | Business website URL |
| `rating` | Google rating (1-5 stars) |
| `review_count` | Number of Google reviews |
| `business_status` | OPERATIONAL, CLOSED_TEMPORARILY, CLOSED_PERMANENTLY |
| `google_maps_uri` | Direct link to Google Maps |
| `latitude` | Geographic latitude |
| `longitude` | Geographic longitude |
| `scraped_at` | Timestamp of data collection |
| `notes` | Additional metadata |

## Geographic Coverage

The scraper covers **69 cities** across all 10 Canadian provinces:

- **Ontario**: Toronto, Ottawa, Mississauga, Hamilton, London, + 15 more
- **British Columbia**: Vancouver, Surrey, Victoria, Kelowna, + 9 more
- **Alberta**: Calgary, Edmonton, Red Deer, Lethbridge, + 5 more
- **Quebec**: Montreal, Quebec City, Laval, Gatineau, + 6 more
- **Manitoba**: Winnipeg, Brandon, Steinbach
- **Saskatchewan**: Saskatoon, Regina, Prince Albert, Moose Jaw
- **Nova Scotia**: Halifax, Dartmouth, Sydney
- **New Brunswick**: Moncton, Saint John, Fredericton
- **Newfoundland**: St. John's, Mount Pearl
- **PEI**: Charlottetown, Summerside

## Requirements

### Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Places API (New)**
4. Create an API key under "Credentials"
5. (Recommended) Restrict the key to Places API only

### Python Dependencies

```bash
pip install requests
```

## Usage

### Basic Usage

```bash
# Set API key as environment variable
export GOOGLE_MAPS_API_KEY="your_api_key_here"

# Run the scraper
python scripts/canadian_practitioner_scraper.py
```

### With Command Line Options

```bash
# Specify API key directly
python scripts/canadian_practitioner_scraper.py --api-key YOUR_API_KEY

# Search specific provinces only
python scripts/canadian_practitioner_scraper.py --provinces "Ontario" "British Columbia"

# Search specific practitioner types only
python scripts/canadian_practitioner_scraper.py --types "chiropractor" "massage therapist"

# Export with additional breakdowns
python scripts/canadian_practitioner_scraper.py --export-by-type --export-by-province

# Verbose logging
python scripts/canadian_practitioner_scraper.py -v
```

### Full Options

```bash
python scripts/canadian_practitioner_scraper.py --help

Options:
  --api-key           Google Maps API key
  --output-dir        Output directory (default: canadian_practitioners)
  --types             Specific practitioner types to search
  --provinces         Specific provinces to search
  --max-pages         Max pages per search query (default: 5)
  --export-by-type    Export separate files by practitioner type
  --export-by-province Export separate files by province
  -v, --verbose       Enable verbose logging
```

## Output Files

All files are saved to the `canadian_practitioners/` directory:

```
canadian_practitioners/
├── all_practitioners_latest.csv      # Complete dataset (CSV)
├── all_practitioners_latest.json     # Complete dataset (JSON)
├── all_practitioners_20260109_123456.csv  # Timestamped backup
├── all_practitioners_20260109_123456.json # Timestamped backup
├── by_type/                          # Optional: grouped by type
│   ├── acupuncturist.json
│   ├── chiropractor.json
│   └── ...
└── by_province/                      # Optional: grouped by province
    ├── ontario.json
    ├── british_columbia.json
    └── ...
```

## API Costs

The scraper uses the Google Maps Places API (New) with the following cost considerations:

| SKU | Fields Used | Cost per 1,000 requests |
|-----|-------------|-------------------------|
| Text Search Pro | displayName, formattedAddress, location | $32 |
| Text Search Enterprise | phone, website, rating, reviews | +$8 |
| **Total (using Enterprise fields)** | All fields | **$40** |

### Cost Calculation

| Component | Count |
|-----------|-------|
| Practitioner search types | 10 |
| Canadian cities covered | 69 |
| Total unique searches | 690 |
| Avg pages per search | ~2.5 |
| **Est. total API calls** | **~1,725** |

### Cost Estimates by Scope

| Scope | API Calls | Est. Cost |
|-------|-----------|-----------|
| **Full Canada** (all types, all provinces) | ~1,725 | **$60-80 USD** |
| Two provinces (Ontario + BC) | ~825 | $30-35 USD |
| Single province (Ontario) | ~500 | $18-22 USD |
| Single type + single province | ~50-100 | $2-5 USD |
| Test run (1 type, 1 province, 2 pages) | ~40 | **~$2 USD** |

### ROI Analysis

| Metric | Value |
|--------|-------|
| Full scrape cost | ~$70 USD |
| Expected practitioner captures | 25,000-32,000 |
| **Cost per lead** | **< $0.003** |
| Alternative: Manual research | $5,000-$10,000+ |
| Alternative: Lead list purchase | $0.10-$0.50/lead = $2,500-$12,500 |

**Bottom line**: The scraper delivers leads at < 1 cent each, vs. $0.10-$0.50 from commercial providers.

### Cost Optimization Tips

1. **Start small**: Test with `--provinces "Ontario" --types "chiropractor" --max-pages 2` (~$2)
2. Search specific provinces: `--provinces "Ontario"` (~$20)
3. Search specific types: `--types "chiropractor"` (~$10)
4. Reduce max pages: `--max-pages 2` (cuts costs ~40%)
5. Use API key restrictions in Google Cloud Console to prevent overuse

### Google Cloud Free Credits

New Google Cloud accounts receive **$200 in free credits** per month, which would cover 2-3 full Canada scrapes.

## Rate Limiting

The scraper implements automatic rate limiting:
- Default: 30 requests per minute
- Configurable via code modification
- Automatic retry on rate limit errors

## Data Quality Notes

1. **Deduplication**: The scraper automatically deduplicates by Google Place ID
2. **Coverage**: Google Maps coverage varies; some practitioners may not have listings
3. **Accuracy**: Business information is sourced from Google and may not always be current
4. **Review Data**: High review counts generally indicate established businesses

## Integration with Sales Enablement

The scraped data can be used for:

1. **Bland AI Voice Campaigns**: Import practitioners for outbound calling
2. **Email Campaigns**: Extract emails from website scraping (separate tool needed)
3. **Territory Planning**: Geographic analysis by city/province
4. **Lead Scoring**: Use rating/review_count for prioritization

### Example: Filtering for High-Quality Leads

```python
import json

with open("canadian_practitioners/all_practitioners_latest.json") as f:
    data = json.load(f)

# High-quality leads: rated 4+ with 10+ reviews
quality_leads = [
    p for p in data["practitioners"]
    if p.get("rating", 0) >= 4.0 and p.get("review_count", 0) >= 10
]

print(f"Found {len(quality_leads)} high-quality leads")
```

## Troubleshooting

### Common Issues

**"API key required" error**
- Ensure `GOOGLE_MAPS_API_KEY` is set or use `--api-key` flag

**"REQUEST_DENIED" error**
- Check API key is valid
- Verify Places API (New) is enabled in Google Cloud Console
- Check API key restrictions

**Empty results for a location**
- The search radius may need adjustment
- Try different search terms
- Some areas may have limited Google Maps coverage

**Rate limit errors**
- The scraper handles these automatically with delays
- Reduce concurrent usage if running multiple instances

## Legal Considerations

- Data is sourced from publicly available Google Maps information
- Respect Google's Terms of Service
- Practitioners may opt out of Google Business listings
- Use data responsibly for legitimate business purposes

---

*Last Updated: January 2026*
