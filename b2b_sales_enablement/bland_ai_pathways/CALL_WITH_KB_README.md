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
| Chiropractors | `cf2233ef-7fb2-49ff-af29-0eee47204e9f` |
| Massage Therapists | `d202aad7-bcb6-478c-a211-b00877545e05` |
| Naturopaths | `1d07d635-147e-4f69-a4cd-c124b33b073d` |
| Integrative Medicine | `1c958dd7-e1ff-4f6d-b9a3-f80a369c26aa` |
| Functional Medicine | `236dbd85-c74d-4774-a7af-4b5812015c68` |
| Acupuncturists | `154f93f4-54a5-4900-92e8-0fa217508127` |

## Making a Call

### Using cURL

```bash
curl -X POST "https://api.bland.ai/v1/calls" \
  -H "authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+15551234567",
    "pathway_id": "cf2233ef-7fb2-49ff-af29-0eee47204e9f",
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
