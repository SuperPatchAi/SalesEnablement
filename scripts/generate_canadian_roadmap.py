#!/usr/bin/env python3
"""
Generate Canadian Business Wellness Sales Roadmap Visualization
Using optimized prompt structure matching successful D2C roadmaps
"""

import os
import re
import json
from pathlib import Path
from PIL import Image
from google import genai
from google.genai import types

# Model configuration - same as successful D2C roadmaps
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

MAX_ATTEMPTS = 5


def load_brand_config():
    """Load brand styling configuration."""
    with open(BRAND_CONFIG, 'r') as f:
        return json.load(f)


def build_optimized_prompt(brand: dict) -> str:
    """Build optimized prompt matching successful D2C format."""
    
    red = brand['brand_colors']['primary']['hex']
    dark = brand['brand_colors']['neutrals']['grey_900']['hex']
    
    prompt = f'''Act as a PROFESSIONAL GRAPHIC DESIGNER creating a comprehensive sales training infographic.

## TYPOGRAPHY REQUIREMENTS (CRITICAL)
- ALL text MUST be PERFECTLY CLEAR and LEGIBLE
- Headers: BOLD UPPERCASE SANS-SERIF
- Body: Clean sans-serif, good size
- HIGH CONTRAST always (dark on light, white on dark)
- NO blurred, distorted, or stylized text
- Every single letter must be crisp and distinct

## CREATE: "CANADIAN BUSINESS WELLNESS" COMPLETE SALES ROADMAP

### HEADER SECTION (Dark background {dark})
- Super Patch logo (white, top left)
- Main title: "CANADIAN BUSINESS WELLNESS SALES ROADMAP" (large, white, bold)
- Tagline: "Selling to HR Directors, SMB Owners & Chamber Executives" (medium, white)
- Category: "[Corporate Wellness]" (red {red} badge)

---

### STEP 1: KNOW YOUR BUYER (Light grey box)
Time: 2 minutes to review

**WHO THEY ARE:**
• HR Directors at companies with 100-1000+ employees
• Small business owners with 5-99 employees
• Chamber of Commerce executives

**WHAT THEY'RE FEELING:**
• Frustrated - rising healthcare costs, low program adoption
• Worried - employee burnout, absenteeism, turnover
• Hopeful - looking for innovative wellness solutions

**MARKET OPPORTUNITY:**
• 200,000+ businesses via Chamber network
• $17.4B CAD corporate wellness market
• 9.3 sick days per employee per year costs $3,300

---

### STEP 2: START THE CONVERSATION (Blue header)
Time: 1-2 minutes | Choose ONE approach

**[A] HR DIRECTOR:**
"We help Canadian companies reduce benefits costs and absenteeism through drug-free wellness tech. Is that something you're dealing with?"

**[B] SMB OWNER:**
"We help small businesses compete with bigger companies on wellness. When employees deal with poor sleep or stress, how does that affect your business?"

**[C] CHAMBER EXECUTIVE:**
"We're partnering with chambers to bring innovative wellness to member businesses. Can we discuss?"

**[D] REFERRAL:**
"[Referrer] suggested we connect about reducing absenteeism at [Company]."

**[E] NETWORKING:**
"I work with wellness technology that's helping businesses cut sick days by 25%. Ever heard of VTT?"

---

### STEP 3: DISCOVER THEIR NEEDS (Blue header)
Time: 3-5 minutes | Ask 3-5 questions, LISTEN more than you talk

**OPENING QUESTIONS:**
• "Walk me through your current wellness program - what's working?"
• "How would you describe employee engagement with existing offerings?"

**PAIN POINT QUESTIONS:**
• "What portion of claims come from sleep, pain, or stress meds?"
• "What does absenteeism cost your organization?"

**IMPACT QUESTIONS:**
• "How does employee health affect your bottom line?"
• "How hard is it to compete for talent against bigger companies?"

**SOLUTION QUESTIONS:**
• "What would success look like - what metrics do you report on?"
• "If you could enhance your wellness program, what outcomes would you want?"

---

### STEP 4A: PRESENT VALUE (Green header)
Time: 2-3 minutes | Use P-A-S-R Framework

**PROBLEM:**
"Canadian businesses lose 9.3 days per employee per year - that's $3,300 in lost productivity per person."

**AGITATE:**
"Traditional wellness programs have 10-20% engagement. Meanwhile, costs keep rising."

**SOLVE:**
"SuperPatch is a drug-free wellness solution. Employees apply a patch - no appointments, no pills, no side effects. We see 60%+ adoption."

**ROI (100 employees):**
• Absenteeism savings: $82,500 (25% reduction)
• Productivity gains: $150,000 (15% improvement)
• Pharma savings: $36,000 (30% reduction)
• Total Annual ROI: 335%

---

### STEP 4B: TRIAL CLOSE (Red header)
Check understanding before moving forward:
• "Does this make sense for your organization?"
• "Any questions about how it works?"
• "Sound like something that could help your team?"

---

### STEP 5: HANDLE OBJECTIONS (Orange header)
Formula: "I understand..." + Open-ended question

**6 COMMON OBJECTIONS:**

| "No budget" | → "What is absenteeism costing you? This saves money." |
| "Does it work?" | → "Based on Nobel Prize research. Let's do a 90-day pilot." |
| "Tried wellness before" | → "This is different - 60% adoption vs 10-20% typical." |
| "Not the right time" | → "Employee health issues don't wait. Start small with a pilot." |
| "Already have wellness" | → "Great! SuperPatch complements by addressing sleep, pain, stress." |
| "Too expensive" | → "Companies use this to REDUCE costs. Let me run your numbers." |

---

### STEP 6: CLOSE THE DEAL (Gold/Yellow header)
Time: 1-2 minutes

**PRE-CLOSE CHECK:**
"Any other questions?" → "Does this make sense for you?"

**5 CLOSING TECHNIQUES:**

**[A] PILOT:**
"Rather than full commitment, let's start with 25-50 employees for 90 days."

**[B] ROI:**
"The numbers show significant savings. Can you afford NOT to address these costs?"

**[C] COMPETITIVE:**
"What would it mean for recruiting if you could offer this?"

**[D] PARTNERSHIP (Chambers):**
"Exclusive member pricing plus revenue share. Let's present to your board."

**[E] TIMELINE:**
"Every week is more preventable costs. Let's start this month."

---

### STEP 7: FOLLOW UP (Teal header)
Goal: Keep momentum → Pilot → Full rollout

**TIMELINE:**
• DAY 1: "Thank you - here's the ROI calculator and case studies."
• DAY 3-5: "Thought you'd find this interesting..." [relevant article]
• DAY 7: "Formal pilot proposal - 25-50 employees, 90 days."
• DAY 14: "Still interested in reducing absenteeism?"
• DAY 21-30: "Final follow-up. When timing is better, let me know."

**SUCCESS METRICS:**
• 60%+ employee engagement
• Improvement in 2+ wellness categories
• Positive ROI indicators
• Employee testimonials

---

### FOOTER (Dark strip)
- Small centered logo
- "Super Patch Canadian Business Sales Enablement"
- "Target: 200,000+ Businesses | $600M-900M Market Opportunity"

---

## DESIGN SPECS
- Portrait orientation (3:4 ratio)
- 4K resolution
- Professional corporate style
- Color-coded sections with headers
- Connecting flow arrows between steps
- Two-column layout where appropriate
- Clean white/light backgrounds for content
- Dark headers with white text'''

    return prompt


def judge_text_quality(client, image_path: Path) -> tuple[bool, int, str]:
    """Judge the text quality using the same approach as successful D2C roadmaps."""
    
    img = Image.open(image_path)
    
    judge_prompt = '''You are a QUALITY CONTROL JUDGE for infographic text readability.

Analyze this "Canadian Business Wellness" sales roadmap infographic and rate the TEXT QUALITY.

CHECK FOR:
1. Are ALL words clearly readable? (no garbled/distorted letters)
2. Is the text properly spaced? (not overlapping or cramped)
3. Are headers distinct from body text?
4. Is there good contrast between text and backgrounds?
5. Can you read the specific content in each section?

SCORING:
- 10: Perfect - every word is crystal clear
- 8-9: Excellent - minor issues, fully usable
- 6-7: Good - some words unclear but mostly readable
- 4-5: Fair - significant readability issues
- 1-3: Poor - text is largely unreadable

RESPOND IN THIS EXACT FORMAT:
TEXT_SCORE: [number 1-10]
ISSUES: [list any specific problems]
VERDICT: [PASS if score >= 7, FAIL if score < 7]'''

    try:
        response = client.models.generate_content(
            model=JUDGE_MODEL,
            contents=[judge_prompt, img]
        )
        
        feedback = response.text if response.text else ""
        
        # Extract score
        score_match = re.search(r'TEXT_SCORE:\s*(\d+)', feedback)
        score = int(score_match.group(1)) if score_match else 5
        
        # Check verdict
        passed = 'PASS' in feedback.upper() and score >= 7
        
        return passed, score, feedback
        
    except Exception as e:
        print(f"    Judge error: {e}")
        return True, 7, "Judge unavailable"


def generate_roadmap():
    """Generate the Canadian business wellness roadmap."""
    
    print("=" * 60)
    print("CANADIAN BUSINESS WELLNESS ROADMAP GENERATOR")
    print(f"📷 Image Model: {IMAGE_MODEL}")
    print(f"🔍 Judge Model: {JUDGE_MODEL}")
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
    logo_img = Image.open(LOGO_PATH)
    template_img = Image.open(TEMPLATE_PATH)
    
    # Build prompt
    print("📝 Building optimized prompt...")
    prompt = build_optimized_prompt(brand)
    
    output_path = OUTPUT_DIR / "Canadian_Business_Wellness_Roadmap.png"
    best_score = 0
    best_attempt = None
    
    for attempt in range(1, MAX_ATTEMPTS + 1):
        print(f"\n🎨 Generating roadmap (Attempt {attempt}/{MAX_ATTEMPTS})...")
        
        try:
            response = client.models.generate_content(
                model=IMAGE_MODEL,
                contents=[
                    "Reference layout template:",
                    template_img,
                    "Logo to include (white, for dark backgrounds):",
                    logo_img,
                    prompt
                ],
                config=types.GenerateContentConfig(
                    response_modalities=['image', 'text'],
                    temperature=0.7,
                )
            )
            
            # Extract image from response
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'inline_data') and part.inline_data:
                    image_data = part.inline_data.data
                    
                    # Save to temp path for judging
                    temp_path = OUTPUT_DIR / f"temp_attempt_{attempt}.png"
                    with open(temp_path, 'wb') as f:
                        f.write(image_data)
                    
                    file_size = temp_path.stat().st_size / 1024
                    print(f"   Generated: {file_size:.1f}KB")
                    
                    # Judge quality
                    passed, score, feedback = judge_text_quality(client, temp_path)
                    print(f"   Score: {score}/10 - {'PASS ✅' if passed else 'FAIL ❌'}")
                    
                    # Track best attempt
                    if score > best_score:
                        best_score = score
                        best_attempt = temp_path
                        print(f"   New best score!")
                    
                    if passed:
                        # Move to final location
                        import shutil
                        shutil.move(str(temp_path), str(output_path))
                        
                        # Clean up other attempts
                        for f in OUTPUT_DIR.glob("temp_attempt_*.png"):
                            f.unlink()
                        
                        print(f"\n✅ SUCCESS! Score: {score}/10")
                        return True
                    break
                    
        except Exception as e:
            print(f"❌ Error on attempt {attempt}: {e}")
    
    # Use best attempt if no pass
    if best_attempt and best_attempt.exists():
        import shutil
        shutil.move(str(best_attempt), str(output_path))
        print(f"\n⚠️ Using best attempt (Score: {best_score}/10)")
        
        # Clean up other attempts
        for f in OUTPUT_DIR.glob("temp_attempt_*.png"):
            f.unlink()
        
        return True
    
    return False


def main():
    """Main entry point."""
    success = generate_roadmap()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ CANADIAN BUSINESS ROADMAP GENERATED!")
        print(f"📁 Location: {OUTPUT_DIR}")
    else:
        print("❌ ROADMAP GENERATION FAILED")
    print("=" * 60)


if __name__ == "__main__":
    main()
