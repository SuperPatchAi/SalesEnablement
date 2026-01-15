# SuperPatch Sales Calls with Knowledge Base

## Knowledge Base ID
```
b671527d-0c2d-4a21-9586-033dad3b0255
```

This KB contains:
- All 13 SuperPatch products
- Clinical studies (RESTORE, HARMONI, Balance)
- VTT technology explanation
- Pricing information
- Business model options

## Pathway IDs

| Practitioner | Pathway ID |
|-------------|------------|
| Chiropractors | `9aa760af-6f9a-430f-8d0c-25bf84afd8fb` |
| Massage Therapists | `1fee31b1-8179-48c6-b6fa-12fcd434ed2b` |
| Naturopaths | `db955b59-d278-410e-981e-5728dfa2dafd` |
| Integrative Medicine | `b6240419-3b24-4415-9541-804994cce425` |
| Functional Medicine | `70f3a50a-9055-4f41-bc0d-81964dfae19a` |
| Acupuncturists | `084673ec-84d6-4c3a-bedb-ba9d72bd7e3b` |

## Making a Call

### Using cURL

```bash
curl -X POST "https://api.bland.ai/v1/calls" \
  -H "authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+15551234567",
    "pathway_id": "9aa760af-6f9a-430f-8d0c-25bf84afd8fb",
    "knowledge_base": "b671527d-0c2d-4a21-9586-033dad3b0255",
    "voice": "78c8543e-e5fe-448e-8292-20a7b8c45247",
    "first_sentence": "Hi, this is Jennifer with SuperPatch.",
    "wait_for_greeting": true,
    "record": true
  }'
```

### Using the Shell Script

```bash
./make_call_with_kb.sh "+15551234567" "chiropractors"
```

### Using Python

```python
from make_call_with_kb import make_superpatch_call

# Single call
result = make_superpatch_call("+15551234567", "chiropractors")

# With custom options
result = make_superpatch_call(
    "+15551234567", 
    "naturopaths",
    voice="78c8543e-e5fe-448e-8292-20a7b8c45247",
    record=True,
    max_duration=20
)

# Batch calls
from make_call_with_kb import make_batch_calls
results = make_batch_calls(
    ["+15551111111", "+15552222222", "+15553333333"],
    "massage"
)
```

## Key Parameter: `knowledge_base`

The `knowledge_base` parameter in the call request tells the AI agent to use the specified KB for accurate information:

```json
{
  "knowledge_base": "b671527d-0c2d-4a21-9586-033dad3b0255"
}
```

This ensures the agent retrieves correct:
- Product names and benefits
- Clinical study details
- Pricing information
- Technology explanations

## Response Example

```json
{
  "status": "success",
  "call_id": "call_abc123",
  "message": "Call initiated successfully"
}
```

## Checking Call Status

```bash
curl -X GET "https://api.bland.ai/v1/calls/CALL_ID" \
  -H "authorization: YOUR_API_KEY"
```

---

## Publishing Pathways to Production

### "Error Fetching Version" Fix

If you see "Error Fetching Version" in the Bland.ai dashboard, you need to **create and publish a version to production**.

### The Correct Bland.ai API Workflow

Per [docs.bland.ai](https://docs.bland.ai), the workflow is:

1. **Create a new version**: `POST /v1/pathway/{pathway_id}/version`
   - Body: `{ "name": "...", "nodes": [...], "edges": [...] }`
   - Response: `{ "data": { "version_number": N } }`

2. **Promote that version**: `POST /v1/pathway/{pathway_id}/publish`
   - Body: `{ "version_id": N, "environment": "production" }`
   - Response: `{ "message": "Pathway published successfully" }`

**Important**: Use the actual `version_number` returned from step 1, not a hardcoded value!

### Using the Publish Script

```bash
cd b2b_sales_enablement/bland_ai_pathways
python3 publish_pathways_production.py
```

This script will:
1. Load pathway data from local `*_contextual.json` files
2. Create a new version for each pathway
3. Promote each version to production

### After Making Pathway Changes

If you modify a pathway (e.g., add extractVars with `add_qualification_vars.py`), always run:

```bash
python3 publish_pathways_production.py
```

to ensure changes are published to production.

---

## Variable Extraction (extractVars)

### Correct Format

Bland.ai requires `extractVars` to be an **array of arrays** with 3 elements each:

```json
"extractVars": [
  ["variable_name", "type", "description"],
  ["contact_name", "string", "Name of the person we're speaking with"],
  ["decision_maker", "string", "Whether they make purchasing decisions"],
  ["interest_level", "string", "Level of interest: high, medium, low"]
]
```

### WRONG Formats (Will Cause Dashboard Errors)

```json
// WRONG - plain strings
"extractVars": ["contact_name", "decision_maker"]

// WRONG - object format  
"extractVars": [
  {"name": "contact_name", "description": "Name of contact"}
]
```

### Available Types

- `string` - Text values (most common)
- `integer` - Whole numbers
- `boolean` - True/false values

### Variables Captured in All Pathways

| Variable | Type | Description |
|----------|------|-------------|
| `contact_name` | string | Name of the person we're speaking with |
| `contact_role` | string | Role: owner, office_manager, receptionist, practitioner |
| `decision_maker` | string | Whether they make purchasing decisions |
| `interest_level` | string | Interest level: high, medium, low, not_interested |
| `pain_points` | string | Main challenges or pain points mentioned |
| `objections` | string | Main objections or concerns raised |
| `patient_volume` | string | Approximate patient volume |
| `practice_name` | string | Name of the practice |
| `practitioner_name` | string | Name of the practitioner |
| `practitioner_email` | string | Email address |
| `best_callback_time` | string | Best time to call back |
| `follow_up_action` | string | Next action: send_info, callback, sample, demo, none |
| `team_size` | string | Number of practitioners at the practice |
| `products_interested` | string | Which SuperPatch products they showed interest in |
| `wants_demo` | string | Whether they want a demo |

### Adding/Modifying extractVars

1. Edit the appropriate `*_contextual.json` file
2. Use the correct array-of-arrays format
3. Run `python3 publish_pathways_production.py` to publish changes

### Troubleshooting

If you see **"Error Fetching Version"** in the Bland.ai dashboard:
1. Check that all `extractVars` use the correct format
2. Run `fix_extractvars.py` to auto-convert to correct format
3. Redeploy using `publish_pathways_production.py`
