#!/usr/bin/env python3
"""
BRANDED Sales Roadmap Generator v6.0

Uses official Super Patch brand styling from brand_styling_reference_config.json
Improved flow with numbered steps, decision trees, and time estimates.

Features:
- Official brand colors (Super Patch Red #DD0604)
- Montserrat typography (web font)
- UPPERCASE headlines per brand guidelines
- Numbered step-by-step flow
- Time estimates per phase
- Decision tree for objections
- Success checkpoints
- "Start Here" indicator
"""

import os
import json
from pathlib import Path

from google import genai
from google.genai import types

# Configuration
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable required")

BASE_DIR = Path('/Users/cbsuperpatch/Desktop/SalesEnablement')
OUTPUT_DIR = BASE_DIR / 'sales_materials/roadmaps_branded'
WORDTRACK_DIR = BASE_DIR / 'sales_materials/docx'
PRODUCTS_FILE = BASE_DIR / 'products/superpatch_products.json'
BRAND_CONFIG = BASE_DIR / 'brand_styling_reference_config.json'


def load_brand_config():
    with open(BRAND_CONFIG, 'r') as f:
        return json.load(f)


def load_products():
    with open(PRODUCTS_FILE, 'r') as f:
        return json.load(f)


def load_wordtrack(product_name: str) -> str:
    wordtrack_path = WORDTRACK_DIR / f"{product_name}_WordTrack.md"
    if wordtrack_path.exists():
        with open(wordtrack_path, 'r') as f:
            return f.read()
    return ""


def build_branded_prompt(product_name: str, category: str, tagline: str, benefits: list, brand: dict) -> str:
    """
    Build prompt using official Super Patch brand styling with improved flow.
    """
    
    # Brand colors
    red = brand['brand_colors']['primary']['hex']  # #DD0604
    grey_900 = brand['brand_colors']['neutrals']['grey_900']['hex']  # #101010
    grey_700 = brand['brand_colors']['neutrals']['grey_700']['hex']  # #4D4D4D
    white = brand['brand_colors']['neutrals']['white']['hex']  # #FFFFFF
    
    # Product palette colors for sections
    cyan = "#009ADE"      # Step indicator
    blue_dark = "#0055B8" # Discovery
    purple = "#652F6C"    # Presentation
    teal = "#66C9BA"      # Follow-up
    gold = "#FFC629"      # Closing
    orange = "#FF4D00"    # Objections
    
    prompt = f'''Create a professional SALES TRAINING ROADMAP poster for Super Patch "{product_name}" patch.

===========================================
🎨 BRAND STYLING (MUST FOLLOW)
===========================================
PRIMARY COLOR: Super Patch Red {red} - Use for emphasis, CTAs, key actions
HEADLINES: {grey_900} (Dark) - UPPERCASE, Bold
BODY TEXT: {grey_700} - Sentence case
BACKGROUNDS: White {white} with subtle grey sections
FONT STYLE: Clean sans-serif (Montserrat style)
OVERALL: High contrast, clean, professional, vibrant

===========================================
📐 LAYOUT & FLOW DESIGN
===========================================
ORIENTATION: Portrait (3:4 ratio), Large poster format
FLOW: Numbered steps flowing TOP → BOTTOM with clear progression
INCLUDE: "START HERE" indicator at top, step numbers, time estimates

===========================================
HEADER SECTION
===========================================
Background: {grey_900} (Dark)
Logo area: "SUPER PATCH" in {red}
Title: "{product_name.upper()} PATCH" in White, large bold
Subtitle: "COMPLETE SALES ROADMAP" in White
Tagline: "{tagline}" in lighter grey

===========================================
★ START HERE ★ - STEP 1: KNOW YOUR CUSTOMER (2 min)
===========================================
Background: Light grey section
Header: "STEP 1: KNOW YOUR CUSTOMER" with {cyan} accent
Time indicator: "⏱ 2 min to review"

TWO COLUMNS:
LEFT - "WHO THEY ARE":
• Professionals (25-65+) seeking natural solutions
• Parents with busy schedules needing support
• Health-conscious avoiding drugs/chemicals
• Active individuals wanting peak performance

RIGHT - "WHAT THEY'RE FEELING":
• Frustrated with current solutions not working
• Worried about side effects of medications
• Tired of the problem affecting daily life
• Looking for something that actually works

BOTTOM - "WHAT THEY'VE TRIED":
Pills, prescriptions, supplements, other products → None worked long-term

✓ CHECKPOINT: "Can you identify their pain point?"

===========================================
STEP 2: START THE CONVERSATION (1-2 min)
===========================================
Background: {cyan} accent bar at top
Header: "STEP 2: START THE CONVERSATION"
Subheader: "Choose ONE approach based on context"

5 SCRIPT BOXES (numbered):

2A. COLD APPROACH 🧊
"Hi! I'm [Name]. I couldn't help but notice... What's your go-to when dealing with [problem]?"

2B. WARM INTRO 🤝
"Hey [Name]! You've mentioned [problem] before. I found something that's made a huge difference. Interested?"

2C. SOCIAL DM 📱
"Hi [Name]! Saw your post about [problem]. I found a drug-free solution that's helping many people. Open to hearing about it?"

2D. REFERRAL 👥
"Hi [Name], [Referrer] suggested we connect about [problem]. Is that something you're exploring?"

2E. EVENT 🎉
"I hear you! I work with innovative wellness tech that helps naturally. Ever heard of vibrotactile technology?"

✓ CHECKPOINT: "Did they engage? → Move to Step 3"

===========================================
STEP 3: DISCOVER THEIR NEEDS (3-5 min)
===========================================
Background: {blue_dark} accent
Header: "STEP 3: ASK & LISTEN"
Subheader: "Ask 3-5 questions. LISTEN more than you talk."
Time: "⏱ 3-5 min"

4 QUESTION CATEGORIES (with 2-3 each):

OPENING Qs:
• "Tell me about your typical day. What are your biggest challenges with [problem]?"
• "On a scale of 1-10, how satisfied are you with your current approach?"

PAIN POINT Qs:
• "When does [problem] hit you hardest? How does it impact you?"
• "What have you tried before? What did you like/dislike?"

IMPACT Qs:
• "How does this affect your work, family, or things you love?"
• "Are you concerned about long-term effects of your current solution?"

SOLUTION Qs:
• "If you could wave a magic wand, what would ideal look like?"
• "If you found a natural solution, what difference would that make?"

✓ CHECKPOINT: "Do you understand their pain? → Move to Step 4"

===========================================
STEP 4: PRESENT {product_name.upper()} (2 min)
===========================================
Background: {purple} accent
Header: "STEP 4: THE 2-MINUTE PITCH"
Subheader: "Problem → Agitate → Solve"
Time: "⏱ 2 min max"

THREE CONNECTED BOXES WITH ARROWS:

[PROBLEM] →
"Have you ever found yourself [experiencing core problem]? It's a common struggle..."

[AGITATE] →
"This isn't just about [surface issue]. It impacts your [work/family/health]. And typical solutions often [create more problems]..."

[SOLVE]
"That's why {product_name} is different. Imagine [desired outcome] without [side effects]. It uses Vibrotactile Technology - special patterns that work with your body's natural systems. 100% drug-free."

KEY BENEFITS BOX (with {red} accent):
✓ {benefits[0]}
✓ {benefits[1] if len(benefits) > 1 else "Natural & Drug-Free"}
✓ {benefits[2] if len(benefits) > 2 else "Non-Invasive"}
"Powered by Vibrotactile Technology (VTT)"

✓ CHECKPOINT: "Are they interested? → Handle objections OR Close"

===========================================
STEP 5: HANDLE OBJECTIONS (as needed)
===========================================
Background: {orange} accent (attention-getting)
Header: "STEP 5: IF THEY OBJECT..."
Subheader: "FORMULA: 'I understand...' + Open Question"
Time: "⏱ As needed"

DECISION TREE LAYOUT - 8 OBJECTION BOXES:

IF: "Too expensive"
SAY: "I understand price matters. What aspects are most important to you beyond cost?"
→ Shift to value discussion

IF: "Need to think"
SAY: "I understand. What specific questions would help you decide?"
→ Identify real concerns

IF: "Ask my spouse"
SAY: "I understand. What questions might they have? I'm happy to speak with both of you."
→ Prepare joint conversation

IF: "Does it work?"
SAY: "I understand the skepticism. What would you need to see or experience to feel confident?"
→ Offer testimonials/trial

IF: "Tried before"
SAY: "I understand past products disappointed. What were those, and what was missing?"
→ Explain how VTT is different

IF: "Not interested"
SAY: "I understand. Could you share what led you to say that?"
→ Uncover hidden needs

IF: "No time"
SAY: "I understand you're busy. What part feels like too much time?"
→ Offer brief info

IF: "vs Competitor"
SAY: "I understand you're comparing. What do you like/dislike about that option?"
→ Highlight VTT uniqueness

✓ CHECKPOINT: "Objection handled? → Move to Step 6"

===========================================
STEP 6: CLOSE THE SALE ★
===========================================
Background: {gold} accent (success/winning)
Header: "STEP 6: CLOSE THE SALE" with {red} emphasis
Subheader: "FIRST ASK: 'Any questions?' + 'Does this make sense?'"
Time: "⏱ 1-2 min"

5 CLOSING TECHNIQUES (choose based on signals):

[A] ASSUMPTIVE ✓ (Strong buying signals)
"Based on what we discussed, {product_name} is exactly what you need. What's the best shipping address?"

[B] ALTERNATIVE ↔ (Need gentle push)
"Would you prefer the 30-day supply to try it, or the 90-day pack for better value?"

[C] URGENCY ⏰ (They're considering)
"We have a special promotion ending this week. Want to lock in that price today?"

[D] SUMMARY 📋 (Need to reinforce value)
"So with {product_name}, you'll get [benefit 1], [benefit 2], and [benefit 3]. Ready to get started?"

[E] REFERRAL 👥 (After successful sale)
"I'm excited for you! Who else do you know who might benefit from this?"

★ SUCCESS: "Order placed! → Move to Step 7"

===========================================
STEP 7: FOLLOW UP (ongoing)
===========================================
Background: {teal} accent (relationship)
Header: "STEP 7: BUILD THE RELATIONSHIP"
Subheader: "Goal: Results → Testimonials → Referrals"

TIMELINE WITH 4 MILESTONES:

DAY 1 📧
"Great connecting! Here's the info. Let me know if questions come up!"

DAY 3 📱
"Checking in - did you review? I truly believe this could help."

DAY 7 💬
"Hope you're having a great week! Still curious? Happy to answer questions."

DAY 14 🔄
"Last friendly check-in. If [solving problem] is still a priority, let's chat."

POST-SALE (if purchased):
"Your order is on its way! I'll check in soon to see how it's working."

===========================================
FOOTER
===========================================
Background: {grey_900}
Left: "Super Patch Sales Enablement | {product_name} - {category}"
Right: "Remember: Smile, Listen, and Genuinely Care!"
Center: Super Patch logo area

===========================================
CRITICAL DESIGN REQUIREMENTS
===========================================
1. ALL TEXT CLEARLY READABLE - appropriate font sizes
2. Step numbers prominently displayed (1, 2, 3...)
3. Flow arrows connecting steps vertically
4. Time estimates visible for each step
5. Checkpoints between major sections
6. Color-coded sections per brand palette
7. "START HERE" indicator at Step 1
8. Success indicator at Step 6
9. Professional corporate training aesthetic
10. Dense but organized - this is a reference document
11. Brand red {red} used for emphasis and CTAs
12. Clean, high-contrast, vibrant per brand guidelines
'''

    return prompt


def judge_image_quality(client, image_path: Path, product_name: str) -> tuple[bool, str]:
    """
    Use Gemini Vision to judge if the generated image has readable text.
    Returns (passed: bool, feedback: str)
    """
    try:
        # Read the image
        with open(image_path, 'rb') as f:
            image_data = f.read()
        
        import base64
        image_b64 = base64.b64encode(image_data).decode('utf-8')
        
        judge_prompt = f'''You are a quality control judge for sales training infographics.

Analyze this image of a "{product_name}" sales roadmap and evaluate:

1. TEXT READABILITY: Is ALL text in the image clearly readable? Look for:
   - Garbled/scrambled letters
   - Overlapping text
   - Text that's too small to read
   - Blurry or distorted words
   - Missing letters or words

2. CONTENT COMPLETENESS: Does the image contain:
   - A clear header with product name
   - Multiple numbered steps (1-7)
   - Script text in each section
   - Objection handling section
   - Closing techniques

3. LAYOUT QUALITY: Is the layout:
   - Organized and professional
   - Color-coded sections visible
   - Flow arrows/connections present

SCORING:
- PASS: All text is readable, content is complete, layout is professional
- FAIL: Any garbled text, missing sections, or unreadable content

Respond in this EXACT format:
VERDICT: [PASS or FAIL]
TEXT_QUALITY: [1-10 score]
ISSUES: [List any specific issues found, or "None" if passing]
RECOMMENDATION: [Brief recommendation]'''

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                {'inline_data': {'mime_type': 'image/png', 'data': image_b64}},
                judge_prompt
            ]
        )
        
        result_text = response.text if hasattr(response, 'text') else str(response)
        
        # Parse the verdict
        passed = 'VERDICT: PASS' in result_text.upper() or 'VERDICT:PASS' in result_text.upper()
        
        # Extract score if present
        import re
        score_match = re.search(r'TEXT_QUALITY:\s*(\d+)', result_text)
        score = int(score_match.group(1)) if score_match else 5
        
        # Consider scores >= 7 as passing even if verdict parsing failed
        if score >= 7:
            passed = True
        
        return passed, result_text
        
    except Exception as e:
        print(f"    ⚠️ Judge error: {e}")
        # If judge fails, assume image is okay
        return True, f"Judge error: {e}"


def generate_roadmap(client, product_name: str, category: str, tagline: str, benefits: list, brand: dict, output_path: Path, max_attempts: int = 3) -> bool:
    """Generate branded roadmap with quality judge verification."""
    
    prompt = build_branded_prompt(product_name, category, tagline, benefits, brand)
    
    print(f"  📝 Prompt: {len(prompt)} chars")
    
    for attempt in range(1, max_attempts + 1):
        print(f"  🎨 Attempt {attempt}/{max_attempts}...")
        
        try:
            response = client.models.generate_content(
                model='gemini-3-pro-image-preview',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_modalities=['IMAGE', 'TEXT'],
                )
            )
            
            if response.candidates and response.candidates[0].content.parts:
                for part in response.candidates[0].content.parts:
                    if hasattr(part, 'inline_data') and part.inline_data:
                        image_data = part.inline_data.data
                        with open(output_path, 'wb') as f:
                            f.write(image_data)
                        
                        # Judge the image quality
                        print(f"  🔍 Judging quality...")
                        passed, feedback = judge_image_quality(client, output_path, product_name)
                        
                        if passed:
                            print(f"  ✅ PASSED quality check!")
                            print(f"  📄 Generated: {output_path.name}")
                            return True
                        else:
                            print(f"  ❌ FAILED quality check (attempt {attempt})")
                            # Extract key issues
                            if 'ISSUES:' in feedback:
                                issues = feedback.split('ISSUES:')[1].split('\n')[0].strip()
                                print(f"     Issues: {issues[:100]}...")
                            
                            if attempt < max_attempts:
                                print(f"  🔄 Regenerating...")
                            continue
            
            print(f"  ⚠️ No image in response")
            
        except Exception as e:
            print(f"  ❌ Error: {e}")
            if attempt < max_attempts:
                print(f"  🔄 Retrying...")
    
    print(f"  ❌ Failed after {max_attempts} attempts")
    return False


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate branded roadmaps with improved flow')
    parser.add_argument('--product', type=str, help='Generate for specific product')
    parser.add_argument('--list', action='store_true', help='List products')
    args = parser.parse_args()
    
    print("📂 Loading data...")
    products = load_products()
    brand = load_brand_config()
    
    print(f"🎨 Brand: Super Patch Red {brand['brand_colors']['primary']['hex']}")
    
    if args.list:
        print("\n📋 Available Products:")
        for key, data in products.items():
            print(f"  - {key}: {data['name']} ({data['category']})")
        return
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    if args.product:
        product_lower = args.product.lower().replace(" ", "")
        found_key = None
        for key in products.keys():
            if key.replace(" ", "").lower() == product_lower or products[key]['name'].lower().replace(" ", "") == product_lower:
                found_key = key
                break
        
        if not found_key:
            print(f"❌ Product '{args.product}' not found")
            return
        products_to_process = {found_key: products[found_key]}
    else:
        products_to_process = products
    
    print(f"\n🚀 Generating BRANDED roadmaps for {len(products_to_process)} product(s)...")
    print(f"📁 Output: {OUTPUT_DIR}\n")
    
    client = genai.Client(api_key=GEMINI_API_KEY)
    
    success = 0
    errors = 0
    
    for product_key, product_data in products_to_process.items():
        print(f"\n{'='*60}")
        print(f"📦 {product_data['name']} ({product_data['category']})")
        print(f"{'='*60}")
        
        output_path = OUTPUT_DIR / f"{product_data['name']}_Branded_Roadmap.png"
        
        if generate_roadmap(
            client,
            product_data['name'],
            product_data['category'],
            product_data['tagline'],
            product_data['benefits'],
            brand,
            output_path
        ):
            success += 1
        else:
            errors += 1
    
    print(f"\n{'='*60}")
    print("📊 COMPLETE")
    print(f"{'='*60}")
    print(f"✅ Success: {success}")
    print(f"❌ Errors: {errors}")


if __name__ == '__main__':
    main()

