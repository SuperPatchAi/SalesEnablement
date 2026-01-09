# SuperPatch Sales Enablement Platform

> **From 0 to AI-Powered Outbound Sales in 4 Phases**  
> A comprehensive system that transforms world-class sales training into intelligent, context-aware voice agents.

---

## 🎯 The Vision

Build an end-to-end sales enablement platform that:
1. **Extracts** proven sales frameworks from top trainers (Grant Cardone, Jordan Belfort, Brian Tracy)
2. **Synthesizes** these techniques into practitioner-specific word tracks
3. **Deploys** intelligent AI voice agents that can conduct real sales conversations
4. **Schedules** in-person demo appointments directly into calendars

---

## 📊 Project Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     SUPERPATCH SALES ENABLEMENT                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   PHASE 1: Knowledge Extraction                                         │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐            │
│   │  60 YouTube │───▶│   Gemini    │───▶│  44 Framework   │            │
│   │   Videos    │    │  Analysis   │    │   Extractions   │            │
│   └─────────────┘    └─────────────┘    └─────────────────┘            │
│                                                                         │
│   PHASE 2: Content Synthesis                                            │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐            │
│   │  Frameworks │───▶│  SuperPatch │───▶│  6 Practitioner │            │
│   │ + Products  │    │   Context   │    │   Word Tracks   │            │
│   └─────────────┘    └─────────────┘    └─────────────────┘            │
│                                                                         │
│   PHASE 3: Voice Agent Development                                      │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐            │
│   │ Word Tracks │───▶│  Bland.ai   │───▶│  34-Node Convo  │            │
│   │  + Context  │    │  Pathways   │    │     Flows       │            │
│   └─────────────┘    └─────────────┘    └─────────────────┘            │
│                                                                         │
│   PHASE 4: Scheduling Integration                                       │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐            │
│   │   Cal.com   │───▶│   Custom    │───▶│   Automated     │            │
│   │     API     │    │   Tools     │    │   Bookings      │            │
│   └─────────────┘    └─────────────┘    └─────────────────┘            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
SalesEnablement/
│
├── 📺 PHASE 1: Knowledge Extraction
│   ├── YouTube videos.md          # 60 curated training videos
│   ├── youtube_videos.json        # Structured video metadata
│   ├── scripts/
│   │   ├── gemini_video_analyzer.py   # AI video analysis tool
│   │   └── transcribe_video.py        # Audio transcription
│   ├── analyses/                  # 44 video analyses (JSON + MD)
│   │   ├── _summary.json
│   │   └── [video_id].md          # Extracted frameworks per video
│   └── frameworks/
│       ├── all_frameworks.md      # 5,357 lines of extracted techniques
│       ├── closing_techniques.md
│       ├── objection_handling.md
│       ├── cold_calling.md
│       └── ...
│
├── 📝 PHASE 2: Content Synthesis
│   ├── products/
│   │   ├── SuperPatch_Product_Reference.md
│   │   └── superpatch_products.json
│   ├── b2b_sales_enablement/
│   │   └── wordtracks/
│   │       └── practitioners/     # 6 practitioner-specific guides
│   │           ├── Chiropractors_WordTrack.md
│   │           ├── Massage_Therapists_WordTrack.md
│   │           ├── Naturopaths_WordTrack.md
│   │           ├── Functional_Medicine_WordTrack.md
│   │           ├── Integrative_Medicine_WordTrack.md
│   │           └── Acupuncturists_WordTrack.md
│   └── canadian_market/           # Canadian-specific content
│
├── 🤖 PHASE 3: Voice Agent Development
│   └── b2b_sales_enablement/
│       └── bland_ai_pathways/
│           ├── [Practitioner]_contextual.json  # Live pathways
│           ├── deploy_pathways.py
│           ├── update_pathways_with_context.py
│           ├── expanded_pathway_generator.py
│           └── superpatch_knowledge_base.txt
│
├── 📅 PHASE 4: Scheduling Integration
│   └── b2b_sales_enablement/
│       ├── appointment_webhook/
│       │   ├── server.py              # Flask webhook server (legacy)
│       │   ├── sheets_integration.py  # Google Sheets logging
│       │   └── update_bland_tools_calcom.py
│       └── bland_ai_pathways/
│           ├── bland_cli.py           # CLI for Bland.ai API
│           ├── make_call_with_kb.py   # Python call script
│           └── make_call_with_kb.sh   # Bash call script
│
└── 🖥️ Frontend Application
    └── superpatch-frontend/           # Next.js sales enablement app
        ├── src/app/
        │   ├── [market]/              # Pages by market (D2C, B2B, Canadian)
        │   ├── voice-agent/           # Voice Agent Dashboard
        │   └── api/
        │       ├── bland/             # Bland.ai API proxy routes
        │       │   ├── calls/route.ts
        │       │   └── calls/[id]/...
        │       └── webhooks/
        │           └── bland/route.ts # Cal.com booking webhook
        ├── src/data/wordtracks/       # TypeScript word track data
        └── public/                    # Patch images & roadmaps
```

---

## 🔬 Phase 1: Knowledge Extraction

### The Source Material
We curated **60 YouTube videos** from the world's top sales trainers:

| Trainer | Focus Area | Key Techniques |
|---------|------------|----------------|
| **Grant Cardone** | Closing, Persistence | 10X Rule, Assumptive Close |
| **Jordan Belfort** | Persuasion, Tonality | Straight Line Selling, Certainty Transfer |
| **Brian Tracy** | Psychology, Process | AIDA, Consultative Selling |
| **Jeremy Miner** | NEPQ, Questions | Neuro-Emotional Persuasion Questions |
| **Various** | Objection Handling | Feel-Felt-Found, Reframing |

### The Extraction Process

```python
# scripts/gemini_video_analyzer.py
# Uses Google Gemini to analyze videos and extract:
# - Step-by-step frameworks
# - Exact scripts and word tracks
# - Objection handling responses
# - SuperPatch-specific applications

ANALYSIS_PROMPT = """
Analyze this sales training video and extract:
1. Main technique and framework name
2. Step-by-step process with psychology
3. Exact scripts and word tracks (quotable)
4. Objection handling with exact responses
5. Key actionable takeaways
6. How to apply to SuperPatch wellness products
"""
```

### Output: 44 Framework Analyses

Each video analysis includes SuperPatch-specific applications:

```markdown
## CLOSING Steps Framework (from VoUJ848UpWA)

### The 5-Step Closing Framework:
1. Proactively Overcome Objections
2. Sprinkle "Do you have any questions?"
3. The "Loop" Before Close
4. The Close
5. The Backup Close

### SuperPatch Application:
"Many people wonder how a small patch can make a big difference. 
Our patches don't contain drugs—they use vibrotactile technology 
to communicate with your brain. Let me show you how that works..."
```

---

## 📋 Phase 2: Content Synthesis

### Product Knowledge Base

13 SuperPatch products with clinical evidence:

| Product | Target | Clinical Evidence |
|---------|--------|-------------------|
| **Freedom** | Pain Relief | RESTORE Study: RCT, 118 participants |
| **REM** | Sleep | HARMONI Study: 80% stopped sleep meds |
| **Liberty** | Balance | 31% improvement, p<0.05 |
| **Peace** | Stress | Parasympathetic activation |
| **Boost** | Energy | Drug-free energy support |
| **Focus** | Clarity | Cognitive enhancement |
| *+ 7 more* | Various | Supporting research |

### Practitioner-Specific Word Tracks

We created comprehensive sales guides for 6 practitioner types, each with:

| Section | Content |
|---------|---------|
| **Understanding** | Practice philosophy, patient demographics, pain points |
| **Product Recommendations** | Which patches fit which patient presentations |
| **Opening Scripts** | 5 different approaches (cold call, referral, conference, etc.) |
| **Discovery Questions** | 15+ practitioner-specific questions |
| **Product Presentation** | P-A-S-E framework adapted to practice |
| **Objection Handling** | 6-8 objections with exact responses |
| **Closing Scripts** | 5 closing approaches |
| **Follow-Up Sequences** | Day 1, 3, 7, 14 email/call scripts |
| **Business Models** | Wholesale vs. Affiliate explanation |

### Example: Unique Content Per Practitioner

**Chiropractors:**
```markdown
Key Hook: "Support patients between adjustments so they don't lose progress"
Unique Objection: "How is this different from Salonpas?"
Response: "Salonpas delivers menthol through the skin. SuperPatch uses 
Vibrotactile Technology—nothing enters the body. The ridge patterns 
stimulate mechanoreceptors. Completely different mechanism."
```

**Naturopaths:**
```markdown
Key Hook: "Works WITH the body's innate healing, honors First Do No Harm"
Philosophy: Vis Medicatrix Naturae, natural interventions
Unique Objection: "My patients prefer supplements"
Response: "Many do. This isn't meant to replace those. For patients with 
GI sensitivities or supplement fatigue, this offers a non-oral option."
```

**Acupuncturists:**
```markdown
Key Hook: "Like acupuncture without needles for home use"
Language: TCM terminology (Qi flow, Shen, Liver Qi stagnation)
Unique Objection: "This isn't real acupuncture"
Response: "Correct—it's a complementary technology. Think of it as a 
take-home bridge between sessions, not a replacement."
```

---

## 🤖 Phase 3: Voice Agent Development

### Bland.ai Conversational Pathways

We programmatically generated **6 intelligent voice agents**—one for each practitioner type—with **34 nodes each**:

```
Conversation Flow (34 Nodes):
┌─────────────┐
│ Introduction │ ──▶ "Hi, this is Jennifer with SuperPatch..."
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Discovery  │ ──▶ 5 practitioner-specific questions
│  Questions  │
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Product    │ ──▶ Freedom, REM, Peace, Liberty, Boost presentations
│ Presentations│
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Objection  │ ──▶ 7 individual objection handlers
│  Handling   │
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Business   │ ──▶ Wholesale, Affiliate, Hybrid models
│   Model     │
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Scheduling │ ──▶ Cal.com integration for in-person visits
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  End Call   │ ──▶ 5 ending variations (sale, callback, etc.)
└─────────────┘
```

### Agent Personality: Jennifer

```
Persona: Jennifer, 32, SuperPatch sales representative
Personality: Warm, professional, Midwest friendly ("Minnesota nice")
Style: Conversational, not scripted; uses natural speech patterns
Goal: Schedule in-person demo visits with practitioners

Tone Guidelines:
- Amiable, concise, cheerful
- Apologetic when appropriate ("oh, sorry about that!")
- Self-deprecating humor okay
- Neighborly ("no worries, take your time!")
- Down-to-earth and empathetic
```

### Context Injection

Each pathway has practitioner-specific context embedded in every node:

```python
# update_pathways_with_context.py

PRACTITIONER_CONTEXTS = {
    "Chiropractors": {
        "philosophy": "Focus on spine-nervous system relationship...",
        "key_hook": "support between adjustments",
        "patient_types": "back pain, neck pain, sports injuries...",
        "pain_points": "patients relapse between visits...",
        "top_products": {"Freedom": "RESTORE study...", ...},
        "objection_responses": {"salonpas": "Transdermal vs VTT..."}
    },
    # ... 5 more practitioners
}
```

---

## 📅 Phase 4: Scheduling Integration

### Cal.com + Webhook Integration

> **Important**: Bland.ai's API does not allow `tools` to be passed when using `pathway_id`. 
> Therefore, Cal.com booking is handled via **webhooks** instead of inline tools.

The voice agent workflow:
1. **Collects scheduling info** during the call (name, email, preferred time, address)
2. **Sends webhook** on call completion with extracted variables
3. **Webhook books** to Cal.com automatically
4. **Logs data** to Google Sheets for tracking

### Webhook Architecture

```
┌─────────────┐    ┌──────────┐    ┌─────────────┐    ┌─────────┐
│ Voice Agent │───▶│ Bland.ai │───▶│ Your Webhook│───▶│ Cal.com │
│   (Call)    │    │ (Pathway)│    │ (Book Appt) │    │(Calendar)│
└─────────────┘    └──────────┘    └─────────────┘    └─────────┘
```

### Webhook Endpoint

The Next.js app includes a webhook endpoint at `/api/webhooks/bland`:

```typescript
// superpatch-frontend/src/app/api/webhooks/bland/route.ts

// Receives call completion data from Bland.ai
// Extracts: name, email, preferred_time, address, practice_name
// Books: Cal.com appointment for in-person sales visit
// Fallback: Logs for manual follow-up if booking fails
```

### Setting Up Webhook Booking

**Production Webhook URL**:
```
https://sales-enablement-six.vercel.app/api/webhooks/bland
```

1. Go to the [Voice Agent Dashboard](https://sales-enablement-six.vercel.app/voice-agent)
2. Enter the webhook URL above
3. Make a call - appointments will auto-book to Cal.com!

For local testing, use ngrok: `ngrok http 3000`

### Variables Extracted

The pathway nodes extract these variables during the conversation:

| Variable | Purpose |
|----------|---------|
| `practitioner_name` | Contact name for booking |
| `email` | Email for calendar invite |
| `appointment_time` | Preferred date/time |
| `address` | Practice address for in-person visit |
| `practice_name` | Business name |
| `products_interested` | Which patches to bring samples of |

### Legacy: Direct Tool Integration

For reference, two Cal.com tools are also configured in Bland.ai (for non-pathway calls):

```python
Tool 1: check_cal_availability (TL-79a3c232-ca51-4244-b5d2-21f4e70fd872)
- Endpoint: Cal.com /v1/slots

Tool 2: book_cal_appointment (TL-bbaa7f38-1b6a-4f27-ad27-18fb7c6e1526)
- Endpoint: Cal.com /v1/bookings
```

### What Gets Booked

The appointment is for an **in-person sales visit**:
- SuperPatch rep visits the practice
- Brings product samples
- Provides hands-on demonstration
- Duration: 20-30 minutes

```
Agent Script:
"Great! So what we'd like to do is have one of our reps stop by 
your practice to drop off some samples and give you a quick demo. 
It only takes about 20-30 minutes. What day works best for you?"
```

---

## 🖥️ Frontend Application

**Live URL**: https://sales-enablement-six.vercel.app/

A Next.js sales enablement app for human sales reps AND voice agent management:

### Features

#### Sales Enablement
- **Market Switcher**: D2C, B2B, Canadian views
- **Word Track Viewer**: Full scripts with copy functionality
- **Product Pages**: Each patch with clinical evidence
- **Practitioner Pages**: All 6 word tracks accessible
- **Roadmap Visualizations**: Sales journey infographics
- **Practice Mode**: Objection handling flashcards

#### Voice Agent Dashboard (`/voice-agent`)
- **Make Calls**: Select practitioner pathway, enter phone number
- **Webhook Integration**: Enter webhook URL for Cal.com booking
- **Call History**: View all calls with status and duration
- **Call Details**: Full transcript, analysis, recording links
- **Call Management**: Stop active calls, analyze completed calls

### API Routes

The app includes API routes that proxy Bland.ai requests (avoiding CORS issues):

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/bland/calls` | POST | Initiate a new call |
| `/api/bland/calls` | GET | List all calls |
| `/api/bland/calls/[id]` | GET | Get call details |
| `/api/bland/calls/[id]/analyze` | POST | Analyze a call |
| `/api/bland/calls/[id]/stop` | POST | Stop an active call |
| `/api/webhooks/bland` | POST | Receive call completion webhooks |

### Tech Stack
- Next.js 14 + TypeScript
- Tailwind CSS + shadcn/ui
- Responsive design
- Server-side API proxying

---

## 🚀 How to Use

### Running the Voice Agent

#### Option 1: Voice Agent Dashboard (Recommended)

The Next.js app includes a full-featured Voice Agent Dashboard:

```bash
cd superpatch-frontend
npm run dev
# Open http://localhost:3000/voice-agent
```

Features:
- **Make Calls**: Select pathway, enter phone number, start call
- **Call History**: View all calls with status, duration, recordings
- **Call Details**: Full transcript, analysis, metadata
- **Webhook Support**: Enter webhook URL for Cal.com booking

#### Option 2: Command Line Interface

```bash
cd b2b_sales_enablement/bland_ai_pathways

# Make a call
python bland_cli.py call +1234567890 --pathway cf2233ef-7fb2-49ff-af29-0eee47204e9f

# Check call status
python bland_cli.py status <call_id>

# List recent calls
python bland_cli.py list

# Get call recording
python bland_cli.py recording <call_id>

# Analyze call
python bland_cli.py analyze <call_id> --goal "Did they book a demo?"

# Stop an active call
python bland_cli.py stop <call_id>
```

#### Option 3: Direct API Call

```bash
curl -X POST "https://api.bland.ai/v1/calls" \
  -H "authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+1234567890",
    "pathway_id": "PATHWAY_ID",
    "voice": "78c8543e-e5fe-448e-8292-20a7b8c45247",
    "first_sentence": "Hi, this is Jennifer with SuperPatch.",
    "wait_for_greeting": true
  }'
```

> ⚠️ **Note**: When using `pathway_id`, you cannot include `tools` in the call payload. Tools must be configured via webhooks.

### Available Pathway IDs

| Practitioner | Pathway ID |
|--------------|------------|
| Chiropractors | `cf2233ef-7fb2-49ff-af29-0eee47204e9f` |
| Massage Therapists | `d202aad7-bcb6-478c-a211-b00877545e05` |
| Naturopaths | `1d07d635-147e-4f69-a4cd-c124b33b073d` |
| Integrative Medicine | `1c958dd7-e1ff-4f6d-b9a3-f80a369c26aa` |
| Functional Medicine | `236dbd85-c74d-4774-a7af-4b5812015c68` |
| Acupuncturists | `154f93f4-54a5-4900-92e8-0fa217508127` |

### Running the Frontend

```bash
cd superpatch-frontend
npm install
npm run dev
# Open http://localhost:3000
```

---

## 📈 Results & Metrics

### Content Generated

| Asset | Quantity |
|-------|----------|
| Videos Analyzed | 44 |
| Framework Extractions | 5,357 lines |
| Word Track Documents | 6 (1,500+ lines each) |
| Conversation Nodes | 204 (34 per pathway × 6) |
| Unique Objection Responses | 42+ |
| Discovery Questions | 90+ |

### Voice Agent Capabilities

- ✅ Natural conversation flow
- ✅ Practitioner-specific language
- ✅ Real-time objection handling
- ✅ Calendar integration
- ✅ Appointment booking
- ✅ Google Sheets logging

---

## 🔧 Technical Details

### APIs & Services Used

| Service | Purpose |
|---------|---------|
| **Google Gemini** | Video analysis and framework extraction |
| **Bland.ai** | Voice agent platform |
| **Cal.com** | Appointment scheduling |
| **Google Sheets** | Data logging |
| **Firecrawl** | Documentation research |

### Key Scripts

| Script | Purpose |
|--------|---------|
| `gemini_video_analyzer.py` | Analyze YouTube videos for sales techniques |
| `bland_ai_pathway_generator.py` | Generate conversation flows from word tracks |
| `update_pathways_with_context.py` | Inject practitioner-specific content |
| `expanded_pathway_generator.py` | Create 34-node detailed pathways |
| `deploy_pathways.py` | Deploy pathways to Bland.ai API |
| `bland_cli.py` | CLI for making calls, checking status, analyzing |
| `restore_with_edge_labels.py` | Redeploy pathways with proper routing |

---

## 🎓 Key Learnings

### What Worked Well
1. **Video-to-Framework Pipeline**: Gemini excels at extracting structured data from video
2. **Context Injection**: Same conversation flow, different content per practitioner
3. **Two-Step Bland.ai API**: Create pathway first, then update with full content
4. **Prompt Engineering**: Using `prompt` (not `text`) for intelligent responses

### Challenges Overcome
1. **Bland.ai UI Compatibility**: Stripped problematic fields from payloads
2. **Static Text Toggle**: Ensured prompts weren't read verbatim
3. **Knowledge Base Integration**: Embedded facts in prompts instead of separate nodes
4. **Cal.com v1 vs v2 API**: Navigated endpoint differences
5. **Tools + Pathways Conflict**: Bland.ai doesn't allow `tools` with `pathway_id`—solved with webhooks
6. **Edge Labels for Routing**: Discovered correct edge format for conversation routing
7. **Version Management**: Must update both pathway AND version 1 for UI visibility

---

## 🔮 Future Enhancements

### Completed ✅
- [x] Voice Agent Dashboard with call management
- [x] Webhook-based Cal.com booking integration
- [x] CLI tool for Bland.ai API interactions

### Planned
- [ ] Add more practitioner types (Physical Therapists, Athletic Trainers)
- [ ] Enhanced call analytics and reporting
- [ ] Add SMS follow-up sequences
- [ ] Integrate with CRM systems (HubSpot, Salesforce)
- [ ] A/B test different opening scripts
- [ ] Add multilingual support
- [ ] Real-time call monitoring dashboard
- [ ] Automated follow-up email sequences

---

## 📄 License

Proprietary - SuperPatch AI

---

## 👥 Contributors

Built with AI assistance for SuperPatch sales enablement.

---

*Last Updated: January 2026*
