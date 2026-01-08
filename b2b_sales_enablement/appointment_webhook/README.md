# SuperPatch Appointment Scheduling System

## Overview

This system enables Bland.ai voice agents to:
1. **Check available appointment slots** via custom tool
2. **Schedule follow-up appointments** with practitioners
3. **Log appointments to CSV/Google Sheets** automatically

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Bland.ai       │────▶│  Webhook Server │────▶│  Google Sheets  │
│  Voice Agent    │◀────│  (Flask API)    │     │  (or CSV)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  Custom Tools   │     │  Appointments   │
│  - Check Avail  │     │  Database       │
│  - Schedule     │     └─────────────────┘
└─────────────────┘
```

## Custom Tools Created

### 1. Check Availability
- **Tool ID:** `TL-79a3c232-ca51-4244-b5d2-21f4e70fd872`
- **Endpoint:** `GET /api/check-availability`
- **Purpose:** Returns available appointment slots

### 2. Schedule Appointment  
- **Tool ID:** `TL-bbaa7f38-1b6a-4f27-ad27-18fb7c6e1526`
- **Endpoint:** `POST /api/schedule-appointment`
- **Purpose:** Books appointment and logs to spreadsheet

## Setup Instructions

### 1. Deploy the Webhook Server

#### Option A: Local Development
```bash
cd appointment_webhook
pip install -r requirements.txt
python3 server.py
```

#### Option B: Deploy to Cloud (Render, Railway, etc.)
```bash
# Example with Render
# 1. Push to GitHub
# 2. Connect Render to repo
# 3. Set build command: pip install -r requirements.txt
# 4. Set start command: gunicorn server:app
```

### 2. Update Tool URLs

After deploying, update the custom tools with your actual webhook URL:

```bash
curl -X POST "https://api.bland.ai/v1/tools/TL-79a3c232-ca51-4244-b5d2-21f4e70fd872" \
  -H "authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://YOUR_DEPLOYED_URL/api/check-availability"
  }'

curl -X POST "https://api.bland.ai/v1/tools/TL-bbaa7f38-1b6a-4f27-ad27-18fb7c6e1526" \
  -H "authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://YOUR_DEPLOYED_URL/api/schedule-appointment"
  }'
```

### 3. Google Sheets Integration (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project and enable Google Sheets API
3. Create a Service Account and download JSON key
4. Share your Google Sheet with the service account email
5. Set environment variables:
   ```bash
   export GOOGLE_SHEETS_CREDENTIALS=/path/to/credentials.json
   export GOOGLE_SHEET_ID=your_sheet_id_here
   ```

## API Endpoints

### GET /api/check-availability
```bash
curl "https://YOUR_URL/api/check-availability?date_range=next_week&practitioner_type=chiropractor"
```

Response:
```json
{
  "status": "success",
  "data": {
    "slots": [
      {"date": "2026-01-15", "day": "Wednesday", "times": ["09:00", "10:00", "14:00"]}
    ],
    "message": "I have availability on Wednesday January 15 at 9am, 10am, or 2pm..."
  }
}
```

### POST /api/schedule-appointment
```bash
curl -X POST "https://YOUR_URL/api/schedule-appointment" \
  -H "Content-Type: application/json" \
  -d '{
    "practitioner_name": "Dr. Smith",
    "practitioner_type": "chiropractor",
    "practice_name": "Smith Chiropractic",
    "phone_number": "+15551234567",
    "email": "dr.smith@example.com",
    "appointment_date": "2026-01-15",
    "appointment_time": "10:00",
    "products_interested": "Freedom, REM",
    "notes": "Interested in wholesale program"
  }'
```

Response:
```json
{
  "status": "success",
  "data": {
    "confirmation_number": "SP-20260108120000",
    "message": "I've scheduled your follow-up call for Wednesday, January 15 at 10:00. Your confirmation number is SP-20260108120000."
  }
}
```

## Conversation Flow

```
Introduction
    │
    ├──▶ Discovery ──▶ Presentation ──▶ Business Model
    │                       │                 │
    │                       │                 ▼
    │                       │            Close/Schedule
    │                       │                 │
    │                       ▼                 ▼
    │               Handle Objections   Check Availability
    │                       │                 │
    │                       │                 ▼
    │                       │         Schedule Appointment
    │                       │                 │
    ▼                       ▼                 ▼
Schedule Callback ─────────────────────▶ End Call
```

## Data Captured

Each appointment logs:
- Confirmation number
- Timestamp
- Practitioner name
- Practitioner type
- Practice name
- Phone number
- Email
- Appointment date/time
- Products interested in
- Conversation notes
- Call ID
- Status

## Files

| File | Purpose |
|------|---------|
| `server.py` | Flask webhook server |
| `sheets_integration.py` | Google Sheets API integration |
| `requirements.txt` | Python dependencies |
| `appointments.csv` | Local CSV log |
| `appointments_log.json` | JSON backup log |

## Pathways Updated

All 6 practitioner pathways now include scheduling:
- SuperPatch - Chiropractors Sales
- SuperPatch - Massage Therapists Sales
- SuperPatch - Naturopaths Sales
- SuperPatch - Integrative Medicine Sales
- SuperPatch - Functional Medicine Sales
- SuperPatch - Acupuncturists Sales

## Making Calls with Scheduling

```bash
curl -X POST "https://api.bland.ai/v1/calls" \
  -H "authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+15551234567",
    "pathway_id": "cf2233ef-7fb2-49ff-af29-0eee47204e9f",
    "knowledge_base": "b671527d-0c2d-4a21-9586-033dad3b0255",
    "voice": "maya",
    "record": true
  }'
```

The agent will automatically:
1. Run through the sales conversation
2. Offer to schedule a follow-up if they need time
3. Check available slots using the custom tool
4. Book the appointment and provide confirmation
5. Log to spreadsheet
