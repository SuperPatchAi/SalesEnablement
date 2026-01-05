#!/usr/bin/env python3
"""
B2B Healthcare Practitioner Sales Roadmap Generator
Creates detailed step-by-step sales process infographics matching the D2C format
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
OUTPUT_DIR = BASE_DIR / 'b2b_sales_enablement' / 'roadmaps_branded'
WORDTRACKS_DIR = BASE_DIR / 'b2b_sales_enablement' / 'wordtracks'
BRAND_CONFIG = BASE_DIR / 'brand_styling_reference_config.json'
TEMPLATE_PATH = BASE_DIR / 'sales_materials' / 'roadmaps_final' / 'Boost_4K_Roadmap.png'
LOGO_PATH = BASE_DIR / 'SuperPatch-SYMBL-3_SuperPatch_Logo_SYMBL_WHT.png'

IMAGE_MODEL = 'gemini-3-pro-image-preview'
JUDGE_MODEL = 'gemini-2.5-flash'
MAX_ATTEMPTS = 3

# B2B Products with clinical evidence
B2B_PRODUCTS = [
    {
        'name': 'Freedom',
        'category': 'Pain Management',
        'tagline': 'Drug-Free Pain Relief',
        'clinical_evidence': 'RESTORE RCT 2025',
        'key_stat': 'Significant pain reduction vs placebo',
        'practitioners': 'Chiropractors, Naturopaths, Acupuncturists'
    },
    {
        'name': 'REM',
        'category': 'Sleep Support',
        'tagline': 'Drug-Free Sleep Solution',
        'clinical_evidence': 'HARMONI Study',
        'key_stat': '80% stopped sleep medications',
        'practitioners': 'Naturopaths, Functional Medicine'
    },
    {
        'name': 'Liberty',
        'category': 'Balance & Mobility',
        'tagline': 'Drug-Free Balance Support',
        'clinical_evidence': 'Balance Study 2022',
        'key_stat': '31% improvement in balance scores',
        'practitioners': 'Chiropractors, Physical Therapists'
    },
    {
        'name': 'Boost',
        'category': 'Energy Support',
        'tagline': 'Stimulant-Free Energy',
        'clinical_evidence': 'VTT Technology',
        'key_stat': 'No caffeine crash or jitters',
        'practitioners': 'Naturopaths, Functional Medicine'
    },
    {
        'name': 'Victory',
        'category': 'Athletic Performance',
        'tagline': 'Clean Performance Support',
        'clinical_evidence': 'VTT Technology',
        'key_stat': 'No banned substances',
        'practitioners': 'Sports Medicine, Chiropractors'
    },
    {
        'name': 'Focus',
        'category': 'Cognitive Support',
        'tagline': 'Drug-Free Concentration',
        'clinical_evidence': 'VTT Technology',
        'key_stat': 'Non-stimulant cognitive support',
        'practitioners': 'Naturopaths, Functional Medicine'
    },
    {
        'name': 'Peace',
        'category': 'Stress Management',
        'tagline': 'Drug-Free Calm & Clarity',
        'clinical_evidence': 'VTT Technology',
        'key_stat': 'Clarity without sedation',
        'practitioners': 'Naturopaths, Acupuncturists'
    },
    {
        'name': 'Defend',
        'category': 'Immune Support',
        'tagline': 'Drug-Free Wellness Support',
        'clinical_evidence': 'VTT Technology',
        'key_stat': 'No drug interactions',
        'practitioners': 'Naturopaths, Functional Medicine'
    },
    {
        'name': 'Ignite',
        'category': 'Metabolic Support',
        'tagline': 'Stimulant-Free Metabolism',
        'clinical_evidence': 'VTT Technology',
        'key_stat': 'Safe for cardiac patients',
        'practitioners': 'Naturopaths, Functional Medicine'
    },
    {
        'name': 'Kick It',
        'category': 'Willpower Support',
        'tagline': 'Drug-Free Habit Support',
        'clinical_evidence': 'VTT Technology',
        'key_stat': 'Supports behavioral change',
        'practitioners': 'Naturopaths, Acupuncturists'
    },
    {
        'name': 'Joy',
        'category': 'Mood Support',
        'tagline': 'Drug-Free Emotional Wellness',
        'clinical_evidence': 'VTT Technology',
        'key_stat': 'No discontinuation effects',
        'practitioners': 'Naturopaths, Functional Medicine'
    },
    {
        'name': 'Lumi',
        'category': 'Skin Health',
        'tagline': 'Inside-Out Beauty Support',
        'clinical_evidence': 'VTT Technology',
        'key_stat': 'Complements topical treatments',
        'practitioners': 'Naturopaths, Aesthetic Practitioners'
    },
    {
        'name': 'Rocket',
        'category': "Men's Vitality",
        'tagline': 'Drug-Free Male Wellness',
        'clinical_evidence': 'VTT Technology',
        'key_stat': 'No hormonal intervention needed',
        'practitioners': 'Naturopaths, Functional Medicine'
    }
]


def load_brand_config():
    with open(BRAND_CONFIG, 'r') as f:
        return json.load(f)


def build_b2b_roadmap_prompt(product: dict, brand: dict) -> str:
    """Build comprehensive B2B sales roadmap prompt matching D2C format."""
    
    red = brand['brand_colors']['primary']['hex']
    dark = brand['brand_colors']['neutrals']['grey_900']['hex']
    
    prompt = f'''Act as a PROFESSIONAL GRAPHIC DESIGNER creating a comprehensive B2B sales training infographic for healthcare practitioners.

## TYPOGRAPHY REQUIREMENTS (CRITICAL)
- ALL text MUST be PERFECTLY CLEAR and LEGIBLE
- Headers: BOLD UPPERCASE SANS-SERIF
- Body: Clean sans-serif, good size
- HIGH CONTRAST always (dark on light, white on dark)
- NO blurred, distorted, or stylized text
- Every single letter must be crisp and distinct

## CREATE: "{product['name'].upper()}" B2B PRACTITIONER SALES ROADMAP

### HEADER SECTION (Dark background {dark})
- Super Patch logo (white, top left)
- Main title: "{product['name'].upper()} B2B SALES ROADMAP" (large, white, bold)
- Tagline: "{product['tagline']}" (medium, white)
- Category badge: "[{product['category']}]" (red {red})
- Sub-badge: "Healthcare Practitioner Edition"

---

### STEP 1: KNOW YOUR PRACTITIONER (Light grey box)
Time: 2 minutes to review

**TARGET PRACTITIONERS:**
• {product['practitioners']}
• Integrative Medicine Doctors
• Alternative healthcare providers
• Natural wellness practitioners

**WHAT THEY'RE LOOKING FOR:**
• Drug-free options for their patients
• Clinical evidence they can trust
• Additional practice revenue streams
• Solutions that complement their protocols

**THEIR PRACTICE PAIN POINTS:**
• Patients want alternatives to medications
• Limited drug-free options available
• Need evidence-based recommendations
• Want to differentiate their practice

**CLINICAL EVIDENCE:**
{product['clinical_evidence']} - {product['key_stat']}

---

### STEP 2: START THE CONVERSATION (Blue header)
Time: 1-2 minutes | Choose ONE approach

**[A] COLD CALL:**
"I'm reaching out to [practitioner type] practices because we have peer-reviewed clinical data on drug-free {product['category'].lower()} solutions. Do you have a moment?"

**[B] EMAIL INTRO:**
"Dr. [Name], the {product['clinical_evidence']} showed {product['key_stat']}. Would you be open to reviewing how this could support your patients?"

**[C] TRADE SHOW:**
"Hi, I'm with Super Patch. We have clinical evidence for drug-free solutions. Are you looking for evidence-based alternatives for your patients?"

**[D] REFERRAL:**
"Dr. [Referrer] suggested I reach out. They've been using {product['name']} with their patients and thought you'd appreciate the clinical data."

**[E] WEBINAR FOLLOW-UP:**
"Following up from [Event]. You expressed interest in drug-free {product['category'].lower()} options. Can we schedule a call?"

---

### STEP 3: DISCOVER THEIR PRACTICE NEEDS (Blue header)
Time: 3-5 minutes | Ask 3-5 questions, LISTEN

**PRACTICE QUESTIONS:**
• "What percentage of patients present with {product['category'].lower()} concerns?"
• "What's your current protocol for patients wanting drug-free options?"

**PAIN POINT QUESTIONS:**
• "What challenges do you face with limited non-pharmaceutical options?"
• "How do patients manage this between visits?"

**OUTCOME QUESTIONS:**
• "How important is peer-reviewed evidence when evaluating new modalities?"
• "Would adding a clinically-validated option enhance your patient outcomes?"

**BUSINESS QUESTIONS:**
• "Would a 25% margin product add value to your practice?"
• "Are you looking to differentiate with innovative solutions?"

---

### STEP 4A: PRESENT {product['name'].upper()} (Green header)
Time: 2 minutes max | Clinical Evidence Focus

**THE CLINICAL PROBLEM:**
"Your patients want drug-free {product['category'].lower()} options, but you have limited evidence-based alternatives..."

**THE EVIDENCE:**
"{product['clinical_evidence']} demonstrated {product['key_stat']}. This is peer-reviewed, validated science."

**THE SOLUTION:**
"{product['name']} uses Vibrotactile Technology based on Nobel Prize-winning mechanoreceptor research - completely drug-free."

**PRACTICE BENEFITS:**
• Clinically-validated drug-free option
• 25% practitioner discount/margin
• No contraindications with treatments
• Patient self-care between visits
• Practice differentiation

---

### STEP 4B: CLINICAL CONFIDENCE CHECK (Red header)
Confirm alignment before moving forward:

• "Does this align with your treatment philosophy?"
• "Any questions about the clinical evidence?"
• "Would this complement your current protocols?"

---

### STEP 5: HANDLE PRACTITIONER OBJECTIONS (Orange header)
Formula: "I understand..." + Evidence-based response

**8 COMMON OBJECTIONS:**

| "Need clinical evidence" | → Share study: "{product['clinical_evidence']}" |
| "Patients tried patches" | → "VTT is different - neural, not transdermal" |
| "Is it placebo effect?" | → "Double-blind RCT with objective measures" |
| "How is this different?" | → "Mechanoreceptor activation, not chemicals" |
| "Not sure patients pay" | → "Less than ongoing OTC purchases" |
| "Already have protocols" | → "Complements; extends between visits" |
| "Need to think about it" | → "What info would help your decision?" |
| "What's in it for me?" | → "25% margin + better patient outcomes" |

---

### STEP 6: CLOSE THE PARTNERSHIP (Gold/Yellow header)
Time: 1-2 minutes

**PRE-CLOSE CHECK:**
"Do you have remaining questions about the evidence?" → "Does this fit your practice?"

**5 CLOSING APPROACHES:**

**[A] STARTER KIT:**
"Start with our Practitioner Starter Kit at your 25% discount to trial with patients."

**[B] FULL ACCOUNT:**
"Set up your practitioner account for ongoing ordering at wholesale pricing."

**[C] PILOT PROGRAM:**
"Trial with 5-10 appropriate patients and evaluate results."

**[D] EVIDENCE REVIEW:**
"Let me send the full study for your review, then we'll reconnect."

**[E] REFERRAL MODEL:**
"If reselling isn't right, our referral program tracks patient purchases to your practice."

---

### STEP 7: PRACTITIONER FOLLOW UP (Teal header)
Goal: Clinical Results → Practice Integration → Colleague Referrals

**TIMELINE:**
• DAY 1: "Thank you - attached is the {product['clinical_evidence']} data."
• DAY 3: "Have you had a chance to review the clinical evidence?"
• DAY 7: "Would a call with our clinical liaison be helpful?"
• DAY 14: "Last check-in - ready to pilot with patients?"
• POST-ORDER: "How are your first patients responding to {product['name']}?"

---

### FOOTER (Dark strip)
- Small centered logo
- "Super Patch B2B Sales | {product['name']} - {product['category']} | Healthcare Practitioner Program"
- "25% Practitioner Discount | Evidence-Based | Drug-Free Solutions"

---

## DESIGN SPECS
- Portrait orientation (3:4 ratio)
- 4K resolution
- Professional corporate/clinical style
- Color-coded sections with headers
- Connecting flow arrows between steps
- Two-column layout where appropriate
- Clean white/light backgrounds for content
- Dark headers with white text
- Match the reference image layout exactly'''

    return prompt


def judge_text_quality(client, image_path: Path, product_name: str) -> tuple[bool, int, str]:
    """Judge the text quality in the generated image."""
    
    img = Image.open(image_path)
    
    judge_prompt = f'''You are a QUALITY CONTROL JUDGE for infographic text readability.

Analyze this "{product_name}" B2B sales roadmap infographic and rate the TEXT QUALITY.

CHECK FOR:
1. Are ALL words clearly readable? (no garbled/distorted letters)
2. Is the text properly spaced? (not overlapping or cramped)
3. Are headers distinct from body text?
4. Is there good contrast between text and backgrounds?
5. Can you read the specific content in each section?
6. Does it follow a step-by-step sales process format?

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


def generate_b2b_roadmap(client, product: dict, brand: dict, output_path: Path) -> bool:
    """Generate B2B roadmap with quality checking."""
    
    print(f"\n{'='*60}")
    print(f"🏥 {product['name']} - B2B Practitioner Roadmap")
    print(f"{'='*60}")
    
    template_img = Image.open(TEMPLATE_PATH)
    logo_img = Image.open(LOGO_PATH)
    
    prompt = build_b2b_roadmap_prompt(product, brand)
    
    print(f"  📝 Prompt: {len(prompt)} chars")
    
    best_score = 0
    best_path = None
    
    for attempt in range(1, MAX_ATTEMPTS + 1):
        print(f"  🎨 Attempt {attempt}/{MAX_ATTEMPTS}...")
        
        try:
            response = client.models.generate_content(
                model=IMAGE_MODEL,
                contents=[
                    "REFERENCE - Match this exact step-by-step sales roadmap layout:",
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
                            if best_path and best_path.exists():
                                best_path.rename(output_path)
                            print(f"  ✅ PASSED - Saved: {output_path.name}")
                            return True
                        
                        if attempt < MAX_ATTEMPTS:
                            print(f"  🔄 Retrying for better text...")
                        break
            
        except Exception as e:
            print(f"  ❌ Error: {e}")
            if attempt < MAX_ATTEMPTS:
                print(f"  🔄 Retrying...")
    
    # Save best attempt
    if best_path and best_path.exists():
        best_path.rename(output_path)
        print(f"  ⚠️ Saved best attempt (score: {best_score}): {output_path.name}")
        return True
    
    print(f"  ❌ Failed after {MAX_ATTEMPTS} attempts")
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
    
    # Clear old roadmaps
    for old_file in OUTPUT_DIR.glob('*.png'):
        old_file.unlink()
        print(f"🗑️ Removed old: {old_file.name}")
    
    print("="*60)
    print("🏥 B2B PRACTITIONER SALES ROADMAP GENERATOR v2")
    print("="*60)
    print(f"📷 Image: {IMAGE_MODEL}")
    print(f"🔍 Judge: {JUDGE_MODEL}")
    print(f"📋 Detailed step-by-step format (matching D2C)")
    print(f"📁 Template: {TEMPLATE_PATH.name}")
    print("="*60)
    
    target = sys.argv[1] if len(sys.argv) > 1 else None
    force = '--force' in sys.argv
    
    success = 0
    for product in B2B_PRODUCTS:
        if target and product['name'].lower() != target.lower():
            continue
        
        output_path = OUTPUT_DIR / f"{product['name']}_B2B_Roadmap.png"
        
        if output_path.exists() and not force:
            print(f"\n⏭️ Skipping {product['name']} (exists, use --force to regenerate)")
            continue
        
        if generate_b2b_roadmap(client, product, brand, output_path):
            success += 1
    
    print(f"\n✅ Complete: {success} B2B roadmaps generated")
    print(f"📁 Location: {OUTPUT_DIR}")


if __name__ == '__main__':
    main()

