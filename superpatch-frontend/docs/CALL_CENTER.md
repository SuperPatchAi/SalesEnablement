# Call Center / Campaign Dialer

The AI-powered call center enables automated outbound calling to healthcare practitioners across Canada, leveraging Bland.ai for natural conversations.

## Overview

The call center is accessed at `/campaign` and provides:
- Practitioner database management
- Campaign dialer with queue management
- Real-time call tracking and analytics
- Sample request tracking
- Do Not Call (DNC) compliance

---

## Practitioner Management

### Data Sources

**Database Practitioners**
- Imported from Google Maps scraping of Canadian healthcare practitioners
- Includes chiropractors, naturopaths, massage therapists, acupuncturists, and integrative/functional medicine practitioners
- Contains contact info, ratings, reviews, and location data

**User-Added Practitioners**
- Created via Quick Call when calling numbers not in the database
- Marked with `is_user_added = true` flag
- Displayed with "User Added" badge in UI
- Filterable via the "Source" filter

### Enrichment Data

Practitioners can have enrichment data from website scraping:
- Team members (names, credentials)
- Contact emails
- Services offered
- Languages spoken

Enriched practitioners display a purple "Enriched" badge and compact indicators in the table.

### Filtering Options

| Filter | Description |
|--------|-------------|
| Province | Filter by Canadian province |
| City | Filter by city (province-dependent) |
| Type | Practitioner type (Chiropractor, etc.) |
| Rating | Minimum Google rating |
| Phone | Has phone number (default: on) |
| Website | Has website URL |
| Enriched | Has enrichment data |
| Emails | Has contact emails |
| Team | Has team member data |
| Multilingual | Multiple languages spoken |
| Source | User Added vs Database |
| DNC | Hide/Show Do Not Call |
| Call Status | Filter by call outcome |

---

## Campaign Dialer

### Queue Management

1. Select practitioners in the table (checkbox or shift-click for range)
2. Click "Start Calling" to begin campaign
3. System calls practitioners sequentially
4. Configurable delay between calls (default: 60 seconds)

### Call Flow

```
Start Campaign
    ↓
Pick next practitioner from queue
    ↓
Initiate Bland.ai call with pathway
    ↓
Wait for call completion (webhook)
    ↓
Update call record with results
    ↓
Check for DNC phrases in transcript
    ↓
Continue to next or end campaign
```

### Pathways

Each practitioner type has a dedicated conversational pathway:

| Type | Pathway ID |
|------|------------|
| Chiropractor | `9aa760af-6f9a-430f-8d0c-25bf84afd8fb` |
| Massage Therapist | `1fee31b1-8179-48c6-b6fa-12fcd434ed2b` |
| Naturopath | `db955b59-d278-410e-981e-5728dfa2dafd` |
| Integrative Medicine | `b6240419-3b24-4415-9541-804994cce425` |
| Functional Medicine | `70f3a50a-9055-4f41-bc0d-81964dfae19a` |
| Acupuncturist | `084673ec-84d6-4c3a-bedb-ba9d72bd7e3b` |

---

## Quick Call

For one-off calls to numbers not in the database:

1. Enter phone number
2. Search checks if practitioner exists
3. If found: displays practitioner info, allows pathway selection
4. If not found: enter manual details (practice name, contact, address)
5. Select pathway based on practitioner type
6. Initiate call
7. On success: practitioner is saved to database as "User Added"

### Required Fields
- Phone number
- Practice name (for manual calls)

### Optional Fields
- Contact name (Dr. name)
- Email address
- Street address
- City, Province, Postal code

---

## Do Not Call (DNC) System

### Automatic Detection

The webhook analyzes call transcripts for DNC phrases:

```typescript
const DNC_PHRASES = [
  "don't call",
  "do not call",
  "stop calling",
  "remove me",
  "take me off",
  "not interested",
  "never call again",
  "unsubscribe",
];
```

When detected:
1. Practitioner flagged with `do_not_call = true`
2. Source set to `ai_detected`
3. Matched phrase stored in `dnc_reason`
4. Timestamp recorded in `dnc_detected_at`

### Manual Marking

From the practitioner drawer "More Actions" menu:
1. Click "Mark as Do Not Call"
2. Dialog opens with reason input
3. Enter reason (required)
4. Confirm to mark as DNC

### Restoring from DNC

2-step process to prevent accidents:
1. Click "Restore to Active" in drawer
2. Confirmation dialog appears:
   - Warning about re-adding
   - Checkbox: "I confirm this practitioner has given consent"
   - Must check box to enable Confirm button
3. Click Confirm to restore

### DNC Filtering

- **Default behavior:** DNC practitioners are hidden
- **Filter option:** "Show Do Not Call Only" to view DNC list
- **Visual indicators:** Red "DNC" badge, subtle row tinting

---

## Call Records

### Status Values

| Status | Description |
|--------|-------------|
| `not_called` | No call attempt made |
| `queued` | In campaign queue |
| `in_progress` | Call currently active |
| `completed` | Call finished successfully |
| `booked` | Appointment scheduled |
| `calendar_sent` | Cal.com invite sent |
| `voicemail` | Reached voicemail |
| `failed` | Call failed to connect |

### Sentiment Analysis

Bland.ai provides sentiment analysis:
- **Positive** (green): Interested, engaged
- **Neutral** (gray): Non-committal
- **Negative** (red): Disinterested, hostile

### Lead Scoring

Automatic scoring (0-100) based on:
- Call outcome
- Sentiment score
- Engagement indicators
- Appointment booking

---

## Sample Requests

### Detection

The webhook detects sample requests from call transcripts when prospects express interest in receiving product samples.

### Products

- Freedom (pain)
- Liberty (balance)
- REM (sleep)
- Focus
- Ignite (metabolism)
- Defend (immunity)
- Victory (performance)
- Kick It (habits)
- Joint Flex

### Status Workflow

```
pending → approved → shipped → delivered
              ↓
         cancelled
```

### Export

Sample requests can be exported to CSV for fulfillment processing.

---

## Bland.ai Integration

### Webhook Endpoint

`POST /api/webhooks/bland`

Receives call completion data:
- Call status and duration
- Transcript (concatenated)
- AI-generated summary
- Sentiment analysis
- Recording URL

### Memory System

Cross-call context retention using Bland.ai Memory:
- Stores conversation history per phone number
- Enables personalized follow-up calls
- Maintains practitioner relationship context

### Environment Variables

```env
BLAND_API_KEY=sk_...
NEXT_PUBLIC_BLAND_MEMORY_ID=mem_...
BLAND_MEMORY_ID=mem_...
```

---

## Practitioner Search

### Overview

The "Search New" tab enables discovering and importing practitioners from Google Maps across North America (Canada and USA).

### Features

**Search Options**
- Country selector (Canada / USA)
- Province/State dropdown
- City dropdown with pre-configured coordinates
- Practitioner type selection (Chiropractor, Massage Therapist, Naturopath, etc.)
- Search radius slider (5-50 km)

**Results Management**
- Preview practitioner details before import
- Select multiple practitioners for bulk import
- Duplicate detection (existing practitioners highlighted)
- Enrich with Firecrawl website scraping
- Direct links to Google Maps

### Workflow

```
1. Select Country → Province/State → City
2. Choose Practitioner Type
3. Adjust Search Radius
4. Click "Search Google Maps"
5. Review Results
6. Select practitioners to import
7. Click "Import Selected"
8. Optionally enrich with Firecrawl
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/search/places` | POST | Search Google Maps Places API |
| `/api/search/import` | POST | Bulk import practitioners to database |
| `/api/search/enrich` | POST | Enrich practitioner with Firecrawl |

### Environment Variables for Search

```env
# Required for Practitioner Search
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Required for Enrichment
FIRECRAWL_API_KEY=your_firecrawl_api_key
```

### Cost Considerations

| Service | Cost |
|---------|------|
| Google Maps Places API | ~$40 per 1,000 searches |
| Firecrawl Scrape | 1 credit per website |

### Enrichment Data Extracted

- Team member names and credentials
- Contact emails
- Phone numbers
- Services offered
- Languages spoken

---

## Practitioner Detail Drawer

### Tabs

**Overview**
- Practice information (address, phone, rating)
- Team members (from enrichment)
- Contact emails
- Services offered
- Languages spoken

**History**
- Call timeline with expandable entries
- Transcript preview
- Recording playback
- Sentiment indicators

**Notes**
- AI-generated call summary (read-only)
- User notes (editable, auto-saved)

### Actions

| Action | Description |
|--------|-------------|
| Call Now | Initiate call to practitioner |
| Send Email | Opens mailto link |
| Open Website | Opens practitioner website |
| Add to Queue | Add to campaign queue |
| Copy Phone | Copy phone to clipboard |
| Copy Address | Copy address to clipboard |
| Edit | Edit practitioner details |
| Export CSV | Download as CSV |
| Mark DNC | Mark as Do Not Call |
| Delete | Remove practitioner |

---

## Analytics

### KPI Cards
- Total calls made
- Successful connections
- Appointments booked
- Average call duration

### Pipeline View
- Kanban-style board by call status
- Drag-and-drop status changes

### Charts
- Call volume over time
- Conversion rates
- Sentiment distribution

---

## Database Schema

### practitioners table
```sql
id              UUID PRIMARY KEY
name            TEXT NOT NULL
practitioner_type TEXT
address         TEXT
city            TEXT
province        TEXT
phone           TEXT
website         TEXT
rating          DECIMAL
review_count    INTEGER
is_user_added   BOOLEAN DEFAULT FALSE
do_not_call     BOOLEAN DEFAULT FALSE
dnc_reason      TEXT
dnc_detected_at TIMESTAMPTZ
dnc_source      TEXT  -- 'ai_detected' | 'manual'
enrichment      JSONB
created_at      TIMESTAMPTZ
```

### call_records table
```sql
id                  UUID PRIMARY KEY
practitioner_id     UUID REFERENCES practitioners
practitioner_name   TEXT
phone               TEXT
call_id             TEXT  -- Bland.ai call ID
status              call_status
call_started_at     TIMESTAMPTZ
call_ended_at       TIMESTAMPTZ
duration_seconds    INTEGER
transcript          TEXT
summary             TEXT
sentiment_score     INTEGER
sentiment_label     TEXT
lead_score          INTEGER
recording_url       TEXT
appointment_booked  BOOLEAN
appointment_time    TIMESTAMPTZ
notes               TEXT
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

### sample_requests table
```sql
id              UUID PRIMARY KEY
practitioner_id UUID REFERENCES practitioners
call_record_id  UUID REFERENCES call_records
products        TEXT[]
status          sample_status
shipping_address TEXT
notes           TEXT
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```
