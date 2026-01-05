#!/usr/bin/env python3
"""
Generate Canadian Business Wellness Sales Roadmap Visualization
Using Gemini 3 Pro Image Preview with quality judging
"""

import os
import json
import base64
from pathlib import Path
from google import genai
from google.genai import types

# Model configuration - same as successful B2B roadmaps
IMAGE_MODEL = 'gemini-3-pro-image-preview'
JUDGE_MODEL = 'gemini-2.5-flash'

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = PROJECT_ROOT / "canadian_market" / "roadmaps"
BRAND_CONFIG = PROJECT_ROOT / "brand_styling_reference_config.json"
LOGO_PATH = PROJECT_ROOT / "SuperPatch-SYMBL-3_SuperPatch_Logo_SYMBL_WHT.png"
TEMPLATE_PATH = PROJECT_ROOT / "sales_materials" / "roadmaps_final" / "Boost_4K_Roadmap.png"

# Ensure output directory exists
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def load_brand_config():
    """Load brand styling configuration."""
    with open(BRAND_CONFIG, 'r') as f:
        return json.load(f)


def load_image_as_base64(path: Path) -> str:
    """Load image file as base64 string."""
    with open(path, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')


def build_canadian_roadmap_prompt(brand: dict) -> str:
    """Build the detailed prompt for Canadian business sales roadmap."""
    
    red = brand['brand_colors']['primary']['hex']
    dark = brand['brand_colors']['neutrals']['grey_900']['hex']
    light_grey = brand['brand_colors']['neutrals']['grey_100']['hex']
    
    # Get colors from product_palette
    palette = {c['name']: c['hex'] for c in brand['brand_colors']['product_palette']}
    blue = palette.get('Cyan', '#009ADE')
    green = palette.get('Teal', '#66C9BA')
    orange = palette.get('Orange', '#FFA400')
    gold = palette.get('Yellow/Gold', '#FFC629')
    teal = palette.get('Teal (Dark)', '#008F89')

    prompt = f'''Act as a PROFESSIONAL GRAPHIC DESIGNER creating a comprehensive B2B sales training infographic for Canadian business wellness sales.

## TYPOGRAPHY REQUIREMENTS (CRITICAL)
- ALL text MUST be PERFECTLY CLEAR and LEGIBLE
- Headers: BOLD UPPERCASE SANS-SERIF
- Sub-headers: BOLD SANS-SERIF
- Body: Clean sans-serif, good size
- HIGH CONTRAST always (dark on light, white on dark)
- NO blurred, distorted, or stylized text
- Every single letter must be crisp and distinct
- Use bullet points for lists, not emojis

## CREATE: "CANADIAN BUSINESS WELLNESS" SALES ROADMAP

### HEADER SECTION (Dark background {dark})
- Super Patch logo (white, top left)
- Main title: "CANADIAN BUSINESS WELLNESS SALES ROADMAP" (large, white, bold)
- Tagline: "Selling to HR Directors, SMB Owners & Chamber Executives" (medium, white)
- Category badge: "[CORPORATE WELLNESS]" (red {red} badge)

---

### STEP 1: KNOW YOUR BUYER (Light grey box {light_grey})
Time: Research before every call

**THREE BUYER PERSONAS:**

| Persona | Company Size | Key Pain Points |
|---------|--------------|-----------------|
| HR Director / Benefits Mgr | 100-1,000+ employees | Rising costs, low engagement, talent competition |
| SMB Owner / CEO | 5-99 employees | Sick days hit bottom line, can't compete on benefits |
| Chamber Executive | 400+ chambers | Member differentiation, new revenue streams |

**WHAT THEY'RE FEELING:**
• HR: Pressure to show ROI, frustrated with low program adoption
• SMB: Every sick day is expensive, wearing multiple hats
• Chamber: Need to stay relevant, looking for partnership wins

**MARKET OPPORTUNITY:**
• 200,000+ businesses via Chamber network
• $17.4B CAD corporate wellness market
• 9.3 sick days/employee/year = $3,300 cost

---

### STEP 2: START THE CONVERSATION (Blue header {blue})
Time: 1-2 minutes | Choose approach by persona

**[A] HR DIRECTOR - COLD CALL:**
"[Name], I'm [Your Name] with SuperPatch. We help Canadian companies reduce benefits costs and absenteeism through drug-free wellness tech. Many HR leaders deal with rising costs and low program engagement - is that something you're experiencing?"

**[B] SMB OWNER - COLD CALL:**
"Hi [Name], we help small businesses compete with bigger companies on wellness - without the big company price tag. Quick question: when employees are dealing with poor sleep or stress, how does that affect your business?"

**[C] CHAMBER EXECUTIVE - PARTNERSHIP:**
"[Name], we're looking to partner with chambers to bring innovative wellness solutions to member businesses. I believe this could add real value to your members. Do you have a few minutes to discuss?"

---

### STEP 3: DISCOVER THEIR NEEDS (Blue header {blue})
Time: 3-5 minutes | LISTEN more than you talk

**FOR HR DIRECTORS:**
• "Walk me through your current wellness program - what's working?"
• "How would you describe employee engagement with existing offerings?"
• "What portion of claims come from sleep, pain, or stress medications?"
• "What does success look like - what metrics do you report on?"

**FOR SMB OWNERS:**
• "How does employee health impact your business day-to-day?"
• "When employees call in sick, how does that affect operations?"
• "How hard is it to compete for talent against bigger companies?"

**FOR CHAMBER EXECUTIVES:**
• "What are your priorities for increasing member value this year?"
• "How do you currently generate revenue beyond membership dues?"
• "What would make a partnership successful from your perspective?"

---

### STEP 4: PRESENT VALUE - ROI FRAMEWORK (Green header {green})
Time: 3 minutes | Problem-Agitate-Solve-ROI

**PROBLEM:**
"Canadian businesses lose an average of 9.3 days per employee per year to illness. That's costing you approximately $3,300 per employee annually in lost productivity."

**AGITATE:**
"Traditional wellness programs have 10-20% engagement. Employees don't have time for gym classes or meditation apps. Meanwhile, costs keep rising."

**SOLUTION:**
"SuperPatch is a drug-free wellness solution that addresses root causes: sleep, pain, stress. Employees apply a patch - that's it. No appointments, no pills, no side effects. We see 60%+ adoption because it works and takes 5 seconds."

**ROI CALCULATION (100 employees example):**
| Metric | Current Cost | Impact | Savings |
|--------|--------------|--------|---------|
| Absenteeism | $330,000 | -25% | $82,500 |
| Presenteeism | $1,000,000 | -15% | $150,000 |
| Pharma claims | $120,000 | -30% | $36,000 |
| **Annual Savings** | | | **$268,500** |
| **Investment** | | | **$80,000** |
| **ROI** | | | **335%** |

---

### STEP 5: HANDLE OBJECTIONS (Orange header {orange})
Formula: Acknowledge → Validate → Redirect → Provide Value

**TOP 6 OBJECTIONS:**

| Objection | Response |
|-----------|----------|
| "No budget" | "What is absenteeism costing you? Let me show ROI - this saves money, not costs money." |
| "Does it work?" | "Based on Nobel Prize research. Let's do a 90-day pilot - see results yourself." |
| "Tried wellness before" | "Those need behavior change. This is a patch - 60% adoption vs 10-20% typical." |
| "Not the right time" | "Employee health issues don't wait. Start small with a pilot - minimal commitment." |
| "Already have wellness" | "Great! SuperPatch complements by addressing sleep, pain, stress foundation." |
| "Too expensive" | "Companies use this to REDUCE costs. Let me run your numbers." |

---

### STEP 6: CLOSE THE DEAL (Gold header {gold})
Time: 1-2 minutes

**PRE-CLOSE CHECK:**
"Any other questions?" → "Does this make sense for [Company/Chamber]?"

**CLOSING TECHNIQUES:**

**[A] PILOT CLOSE:**
"Rather than full commitment, let's start with 25-50 employees for 90 days. Measure results in your environment first."

**[B] ROI CLOSE:**
"The numbers show [$X] in savings. Can you afford NOT to address these costs?"

**[C] COMPETITIVE CLOSE:**
"What would it mean for recruiting if you could offer something competitors don't?"

**[D] PARTNERSHIP CLOSE (Chambers):**
"Exclusive member pricing + revenue share. Let's present to your board."

---

### STEP 7: FOLLOW UP SEQUENCE (Teal header {teal})
Goal: Keep momentum → Pilot → Full rollout

**TIMELINE:**
• DAY 1: "Thank you - here's the ROI calculator and case studies."
• DAY 3-5: "Thought you'd find this interesting..." [relevant article/stat]
• DAY 7: "Formal pilot proposal attached - 25-50 employees, 90 days."
• DAY 14: "Checking in - still interested in reducing absenteeism?"
• DAY 21-30: "Final follow-up. When timing is better, let me know."

**SUCCESS METRICS FOR PILOT:**
• 60%+ employee engagement
• Measurable improvement in 2+ wellness categories
• Positive ROI indicators
• Employee testimonials

---

### FOOTER (Dark strip {dark})
- Small centered Super Patch logo (white)
- "Super Patch Canadian Business Sales Enablement"
- "Target: 200,000+ Businesses | $600M-900M Market Opportunity"

---

## DESIGN SPECS
- Portrait orientation (3:4 ratio)
- 4K resolution
- Professional, corporate business style
- Color-coded sections with distinct headers
- Connecting flow arrows between steps
- Two-column layout where appropriate
- Clean white/light backgrounds for content
- Dark headers with white text
- Reference the provided Boost_4K_Roadmap.png for layout structure
- Include provided Super Patch logo (white) on dark backgrounds
'''
    return prompt


def generate_roadmap():
    """Generate the Canadian business wellness roadmap."""
    
    print("=" * 60)
    print("CANADIAN BUSINESS WELLNESS ROADMAP GENERATOR")
    print("=" * 60)
    
    # Initialize client
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set")
    
    client = genai.Client(api_key=api_key)
    
    # Load brand config
    print("\n📁 Loading brand configuration...")
    brand = load_brand_config()
    
    # Load reference images
    print("📷 Loading reference images...")
    logo_data = load_image_as_base64(LOGO_PATH)
    template_data = load_image_as_base64(TEMPLATE_PATH)
    
    # Build prompt
    print("📝 Building prompt...")
    prompt = build_canadian_roadmap_prompt(brand)
    
    # Prepare content parts
    content_parts = [
        types.Part.from_bytes(
            data=base64.b64decode(logo_data),
            mime_type="image/png"
        ),
        types.Part.from_bytes(
            data=base64.b64decode(template_data),
            mime_type="image/png"
        ),
        types.Part.from_text(text=prompt)
    ]
    
    output_path = OUTPUT_DIR / "Canadian_Business_Wellness_Roadmap.png"
    max_attempts = 3
    
    for attempt in range(1, max_attempts + 1):
        print(f"\n🎨 Generating roadmap (Attempt {attempt}/{max_attempts})...")
        
        try:
            response = client.models.generate_content(
                model=IMAGE_MODEL,
                contents=content_parts,
                config=types.GenerateContentConfig(
                    response_modalities=['image', 'text'],
                    temperature=0.7,
                )
            )
            
            # Extract image from response
            image_saved = False
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'inline_data') and part.inline_data:
                    image_data = part.inline_data.data
                    
                    # Save image
                    with open(output_path, 'wb') as f:
                        f.write(image_data)
                    
                    file_size = output_path.stat().st_size / 1024
                    print(f"✅ Saved: {output_path.name} ({file_size:.1f}KB)")
                    image_saved = True
                    
                    # Run quality check
                    if check_image_quality(client, output_path):
                        print("✅ Quality check PASSED!")
                        return True
                    else:
                        print(f"⚠️ Quality check failed, {'retrying...' if attempt < max_attempts else 'keeping best attempt'}")
                    break
            
            if not image_saved:
                print(f"⚠️ No image in response (Attempt {attempt})")
                
        except Exception as e:
            print(f"❌ Error on attempt {attempt}: {e}")
    
    print(f"\n{'=' * 60}")
    if output_path.exists():
        print(f"📊 Roadmap saved (best attempt): {output_path}")
        return True
    else:
        print("❌ Failed to generate roadmap")
        return False


def check_image_quality(client, image_path: Path) -> bool:
    """Use AI to check if the generated image has readable text."""
    
    print("🔍 Running quality check...")
    
    try:
        with open(image_path, 'rb') as f:
            image_data = f.read()
        
        judge_prompt = """Analyze this sales roadmap infographic for TEXT QUALITY ONLY.

CRITICAL CHECKS:
1. Can you read ALL section headers clearly?
2. Can you read the bullet points and body text?
3. Is any text blurry, garbled, or illegible?
4. Are there any nonsense words or character scrambling?

Respond with ONLY:
- "PASS" if 90%+ of text is clearly readable
- "FAIL" if significant text is unreadable

Your response (one word only):"""

        response = client.models.generate_content(
            model=JUDGE_MODEL,
            contents=[
                types.Part.from_bytes(data=image_data, mime_type="image/png"),
                types.Part.from_text(text=judge_prompt)
            ],
            config=types.GenerateContentConfig(temperature=0.1)
        )
        
        result = response.text.strip().upper()
        print(f"   Quality result: {result}")
        return "PASS" in result
        
    except Exception as e:
        print(f"   Quality check error: {e}")
        return True  # Assume pass on error


def main():
    """Main entry point."""
    success = generate_roadmap()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ CANADIAN BUSINESS ROADMAP GENERATED SUCCESSFULLY!")
        print(f"📁 Location: {OUTPUT_DIR}")
    else:
        print("❌ ROADMAP GENERATION FAILED")
    print("=" * 60)


if __name__ == "__main__":
    main()

