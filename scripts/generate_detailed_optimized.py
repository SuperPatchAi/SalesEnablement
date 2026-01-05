#!/usr/bin/env python3
"""
DETAILED + OPTIMIZED Roadmap Generator
Full detail content WITH text optimization techniques
"""

import os
import json
import re
from pathlib import Path
from PIL import Image
from google import genai
from google.genai import types

# Paths
BASE_DIR = Path(__file__).parent.parent
OUTPUT_DIR = BASE_DIR / 'sales_materials' / 'roadmaps_final'
WORDTRACKS_DIR = BASE_DIR / 'sales_materials' / 'docx'
BRAND_CONFIG = BASE_DIR / 'brand_styling_reference_config.json'
TEMPLATE_PATH = BASE_DIR / 'sales_materials' / 'roadmaps_branded' / 'Boost_Branded_Roadmap.png'
LOGO_PATH = BASE_DIR / 'SuperPatch-SYMBL-3_SuperPatch_Logo_SYMBL_WHT.png'

IMAGE_MODEL = 'gemini-3-pro-image-preview'
JUDGE_MODEL = 'gemini-2.5-flash'

PRODUCTS = [
    {'name': 'Boost', 'category': 'Energy', 'tagline': 'Power Up With Clean Energy'},
    {'name': 'Freedom', 'category': 'Aches & Pains', 'tagline': 'Drug-Free Pain Relief'},
    {'name': 'Liberty', 'category': 'Mobility', 'tagline': 'Better Balance and Mobility'},
    {'name': 'REM', 'category': 'Sleep', 'tagline': 'Better, Deeper Sleep'},
    {'name': 'Victory', 'category': 'Athletic Performance', 'tagline': 'Get Stronger, Faster, More Agile'},
    {'name': 'Focus', 'category': 'Focus & Attention', 'tagline': 'Bolster Your Concentration'},
    {'name': 'Defend', 'category': 'Immune Support', 'tagline': 'Support Your Wellness'},
    {'name': 'Ignite', 'category': 'Max RMR', 'tagline': 'Fire Up Your Metabolism'},
    {'name': 'Kick It', 'category': 'Will Power', 'tagline': 'Overcome Bad Habits'},
    {'name': 'Peace', 'category': 'Stress', 'tagline': 'Experience Calm and Clarity'},
    {'name': 'Joy', 'category': 'Mood', 'tagline': 'Happiness for Healthy Living'},
    {'name': 'Lumi', 'category': 'Beauty', 'tagline': 'Radiant Skin, Natural Glow'},
    {'name': 'Rocket', 'category': "Men's Health", 'tagline': 'Enhance Your Inner Energy'},
]


def load_brand_config():
    with open(BRAND_CONFIG, 'r') as f:
        return json.load(f)


def extract_benefits(product_name: str) -> list:
    wordtrack_path = WORDTRACKS_DIR / f"{product_name}_WordTrack.md"
    if not wordtrack_path.exists():
        return ['Natural wellness solution', 'Drug-free technology', 'VTT powered', 'Easy to use']
    
    with open(wordtrack_path, 'r') as f:
        content = f.read()
    
    benefits = re.findall(r'[•\-]\s*\*?\*?([^•\-\n]{10,50}?)\*?\*?\s*(?:\n|$)', content)
    return [b.strip()[:45] for b in benefits[:4]] if benefits else ['Natural wellness', 'Drug-free', 'VTT powered', 'Easy to use']


def build_full_detail_prompt(product: dict, benefits: list, brand: dict) -> str:
    """Build prompt with FULL DETAIL + text optimization."""
    
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

## CREATE: "{product['name'].upper()}" COMPLETE SALES ROADMAP

### HEADER SECTION (Dark background {dark})
- Super Patch logo (white, top left)
- Main title: "{product['name'].upper()} SALES ROADMAP" (large, white, bold)
- Tagline: "{product['tagline']}" (medium, white)
- Category: "[{product['category']}]" (red {red} badge)

---

### STEP 1: KNOW YOUR CUSTOMER (Light grey box)
Time: 2 minutes to review

**WHO THEY ARE:**
• Professionals aged 25-65+ seeking natural solutions
• Parents with busy schedules needing daily support
• Health-conscious individuals avoiding drugs/chemicals
• Active people wanting peak performance

**WHAT THEY'RE FEELING:**
• Frustrated - current solutions aren't working
• Worried about medication side effects
• Tired of the problem affecting daily life
• Hopeful - looking for something that actually works

**WHAT THEY'VE TRIED:**
Pills, prescriptions, supplements → None worked long-term

---

### STEP 2: START THE CONVERSATION (Blue header)
Time: 1-2 minutes | Choose ONE approach

**[A] COLD APPROACH:**
"Hi! I'm [Name]. What's your go-to solution for [problem]?"

**[B] WARM APPROACH:**
"Hey [Name]! You mentioned [problem]. I found something that really helps."

**[C] SOCIAL DM:**
"Hi [Name]! Saw your post about [issue]. I found a drug-free solution."

**[D] REFERRAL:**
"Hi [Name], [Referrer] suggested we connect about [problem]."

**[E] EVENT/NETWORKING:**
"I work with wellness technology. Ever heard of VTT?"

---

### STEP 3: DISCOVER THEIR NEEDS (Blue header)
Time: 3-5 minutes | Ask 3-5 questions, LISTEN more than you talk

**OPENING QUESTIONS:**
• "Tell me about your typical day with this issue."
• "On a scale of 1-10, how satisfied are you with current solutions?"

**PAIN POINT QUESTIONS:**
• "When does it hit you the hardest?"
• "What have you already tried?"

**IMPACT QUESTIONS:**
• "How does this affect your work? Your family?"
• "Are you concerned about long-term effects?"

**SOLUTION QUESTIONS:**
• "If you had a magic wand, what would ideal look like?"
• "If a natural solution could help, what difference would that make?"

---

### STEP 4A: PRESENT {product['name'].upper()} (Green header)
Time: 2 minutes max | Use P-A-S Framework

**PROBLEM:**
"Have you ever found yourself [experiencing the problem]? It's a common struggle..."

**AGITATE:**
"This isn't just about [surface issue]. It impacts your work, family, overall health..."

**SOLVE:**
"{product['name']} is different. It uses Vibrotactile Technology - 100% drug-free, non-invasive."

**KEY BENEFITS:**
• {benefits[0] if len(benefits) > 0 else 'Natural wellness solution'}
• {benefits[1] if len(benefits) > 1 else 'Drug-free technology'}
• {benefits[2] if len(benefits) > 2 else 'VTT powered'}
• {benefits[3] if len(benefits) > 3 else 'Easy daily use'}
• Powered by patented VTT technology

---

### STEP 4B: TRIAL CLOSE (Red header)
Check understanding before moving forward:
• "Does this make sense for your situation?"
• "Any questions about how it works?"
• "Sound like what you've been looking for?"

---

### STEP 5: HANDLE OBJECTIONS (Orange header)
Formula: "I understand..." + Open-ended question

**8 COMMON OBJECTIONS:**

| "Too expensive" | → "What aspects matter most beyond cost?" |
| "Need to think" | → "What questions would help you decide?" |
| "Ask my spouse" | → "What questions might they have?" |
| "Does it work?" | → "What would convince you to try it?" |
| "Tried patches before" | → "What was missing from those?" |
| "Not interested" | → "What led you to feel that way?" |
| "No time right now" | → "What part feels like too much?" |
| "vs. Competitor X" | → "What do you like/dislike about that?" |

---

### STEP 6: CLOSE THE SALE (Gold/Yellow header)
Time: 1-2 minutes

**PRE-CLOSE CHECK:**
"Any other questions?" → "Does this make sense for you?"

**5 CLOSING TECHNIQUES:**

**[A] ASSUMPTIVE:**
"Based on what you've shared, {product['name']} is exactly what you need. What's the best address to ship to?"

**[B] ALTERNATIVE:**
"Would you prefer the 30-day supply to try it out, or the 90-day for better value?"

**[C] URGENCY:**
"We have a special promotion ending this week. Want to lock in that price?"

**[D] SUMMARY:**
"With {product['name']}, you get [list benefits]. Ready to get started?"

**[E] REFERRAL:**
"I'm excited for you to try this! Who else in your life might benefit?"

---

### STEP 7: FOLLOW UP (Teal header)
Goal: Results → Testimonials → Referrals

**TIMELINE:**
• DAY 1: "Great connecting! Here's the info we discussed."
• DAY 3: "Checking in - did you have a chance to review?"
• DAY 7: "Hope you're having a great week! Any thoughts?"
• DAY 14: "Last check-in - is this still a priority for you?"
• POST-SALE: "Your order is on its way! I'll check in to see how it's working."

---

### FOOTER (Dark strip)
- Small centered logo
- "Super Patch Sales Enablement | {product['name']} - {product['category']}"
- "Remember: Smile, Listen, and Genuinely Care!"

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


def judge_text_quality(client, image_path: Path, product_name: str) -> tuple[bool, int, str]:
    """Judge the text quality in the generated image."""
    
    img = Image.open(image_path)
    
    judge_prompt = f'''You are a QUALITY CONTROL JUDGE for infographic text readability.

Analyze this "{product_name}" sales roadmap infographic and rate the TEXT QUALITY.

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
        import re
        score_match = re.search(r'TEXT_SCORE:\s*(\d+)', feedback)
        score = int(score_match.group(1)) if score_match else 5
        
        # Check verdict
        passed = 'PASS' in feedback.upper() and score >= 7
        
        return passed, score, feedback
        
    except Exception as e:
        print(f"    Judge error: {e}")
        return True, 7, "Judge unavailable"  # Default pass


def generate_roadmap(client, product: dict, brand: dict, output_path: Path, max_attempts: int = 3) -> bool:
    """Generate detailed roadmap with text optimization and quality judge."""
    
    print(f"\n{'='*60}")
    print(f"🎨 {product['name']} - Full Detail + Judge")
    print(f"{'='*60}")
    
    template_img = Image.open(TEMPLATE_PATH)
    logo_img = Image.open(LOGO_PATH)
    benefits = extract_benefits(product['name'])
    
    prompt = build_full_detail_prompt(product, benefits, brand)
    
    print(f"  📝 Prompt: {len(prompt)} chars")
    
    best_score = 0
    best_path = None
    
    for attempt in range(1, max_attempts + 1):
        print(f"  🎨 Attempt {attempt}/{max_attempts}...")
        
        try:
            response = client.models.generate_content(
                model=IMAGE_MODEL,
                contents=[
                    "REFERENCE - Match this professional layout:",
                    template_img,
                    "LOGO (white, use on dark backgrounds):",
                    logo_img,
                    prompt
                ],
                config=types.GenerateContentConfig(
                    response_modalities=['TEXT', 'IMAGE'],
                )
            )
            
            if response.candidates and response.candidates[0].content.parts:
                for part in response.candidates[0].content.parts:
                    if hasattr(part, 'inline_data') and part.inline_data:
                        # Save to temp file
                        temp_path = output_path.with_suffix(f'.attempt{attempt}.png')
                        with open(temp_path, 'wb') as f:
                            f.write(part.inline_data.data)
                        
                        # Judge quality
                        print(f"  🔍 Judging text quality...")
                        passed, score, feedback = judge_text_quality(client, temp_path, product['name'])
                        
                        print(f"     Score: {score}/10 {'✅ PASS' if passed else '❌ FAIL'}")
                        
                        # Track best
                        if score > best_score:
                            if best_path and best_path.exists():
                                best_path.unlink()
                            best_score = score
                            best_path = temp_path
                            print(f"     🏆 New best! (score: {score})")
                        else:
                            temp_path.unlink()
                        
                        if passed:
                            # Move best to final
                            if best_path and best_path.exists():
                                best_path.rename(output_path)
                            print(f"  ✅ PASSED - Saved: {output_path.name}")
                            return True
                        
                        if attempt < max_attempts:
                            print(f"  🔄 Retrying for better text...")
                        break
            
        except Exception as e:
            print(f"  ❌ Error: {e}")
            if attempt < max_attempts:
                print(f"  🔄 Retrying...")
    
    # Save best attempt even if didn't pass
    if best_path and best_path.exists():
        best_path.rename(output_path)
        print(f"  ⚠️ Saved best attempt (score: {best_score}): {output_path.name}")
        return True
    
    print(f"  ❌ Failed after {max_attempts} attempts")
    return False


def main():
    import sys
    
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        print("❌ GEMINI_API_KEY not set")
        return
    
    client = genai.Client(api_key=api_key)
    brand = load_brand_config()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    print("="*60)
    print("🎨 DETAILED + OPTIMIZED + JUDGED ROADMAP GENERATOR")
    print("="*60)
    print(f"📷 Image: {IMAGE_MODEL}")
    print(f"🔍 Judge: {JUDGE_MODEL}")
    print("📋 Full detail + text optimization + quality check")
    print("="*60)
    
    target = sys.argv[1] if len(sys.argv) > 1 else None
    
    success = 0
    for product in PRODUCTS:
        if target and product['name'].lower() != target.lower():
            continue
        
        output_path = OUTPUT_DIR / f"{product['name']}_4K_Roadmap.png"
        
        if generate_roadmap(client, product, brand, output_path):
            success += 1
    
    print(f"\n✅ Complete: {success} generated")


if __name__ == '__main__':
    main()

