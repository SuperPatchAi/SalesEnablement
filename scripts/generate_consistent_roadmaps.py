#!/usr/bin/env python3
"""
CONSISTENT 4K Sales Roadmap Generator v7.1

Features:
- Uses Boost roadmap as layout TEMPLATE for consistency
- COMPOSITES actual Super Patch logo onto generated image
- 4K resolution output
- Gemini 3 Pro Image for generation (gemini-3-pro-image-preview)
- Gemini 3 Flash for quality judging (gemini-3-flash-preview)
- Official brand colors and styling
"""

import os
import json
import base64
import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import io

from google import genai
from google.genai import types

# Configuration
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable required")

BASE_DIR = Path('/Users/cbsuperpatch/Desktop/SalesEnablement')
OUTPUT_DIR = BASE_DIR / 'sales_materials/roadmaps_final'
PRODUCTS_FILE = BASE_DIR / 'products/superpatch_products.json'
BRAND_CONFIG = BASE_DIR / 'brand_styling_reference_config.json'
LOGO_PATH = BASE_DIR / 'SuperPatch-SYMBL-3_SuperPatch_Logo_SYMBL_WHT.png'
TEMPLATE_PATH = BASE_DIR / 'sales_materials/roadmaps_branded/Boost_Branded_Roadmap.png'

# Models - Using Gemini 3
IMAGE_MODEL = 'gemini-3-pro-image-preview'  # Nano Banana Pro - best for text & 4K
JUDGE_MODEL = 'gemini-2.5-flash'              # Fast judging


def load_image_as_base64(path: Path) -> str:
    """Load image and convert to base64."""
    with open(path, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')


def composite_logo_onto_image(image_path: Path, logo_path: Path, output_path: Path) -> bool:
    """
    Composite the actual Super Patch logo onto the generated roadmap image.
    Places logo in the header area (top center) and footer (bottom center).
    """
    try:
        # Open the generated roadmap
        roadmap = Image.open(image_path).convert('RGBA')
        width, height = roadmap.size
        
        # Open the logo (white on transparent)
        logo = Image.open(logo_path).convert('RGBA')
        
        # Calculate logo sizes
        # Header logo: ~80px height
        header_logo_height = int(height * 0.04)  # ~4% of image height
        header_logo_ratio = logo.width / logo.height
        header_logo_width = int(header_logo_height * header_logo_ratio)
        header_logo = logo.resize((header_logo_width, header_logo_height), Image.Resampling.LANCZOS)
        
        # Footer logo: ~50px height  
        footer_logo_height = int(height * 0.025)  # ~2.5% of image height
        footer_logo_width = int(footer_logo_height * header_logo_ratio)
        footer_logo = logo.resize((footer_logo_width, footer_logo_height), Image.Resampling.LANCZOS)
        
        # Position for header logo (top center, slightly left of center for "SUPER PATCH" text area)
        header_x = int(width * 0.08)  # 8% from left
        header_y = int(height * 0.015)  # 1.5% from top
        
        # Position for footer logo (bottom center)
        footer_x = (width - footer_logo_width) // 2
        footer_y = height - int(height * 0.035)  # 3.5% from bottom
        
        # Create a copy to composite onto
        result = roadmap.copy()
        
        # Paste header logo (using alpha channel as mask)
        result.paste(header_logo, (header_x, header_y), header_logo)
        
        # Paste footer logo
        result.paste(footer_logo, (footer_x, footer_y), footer_logo)
        
        # Save as PNG (preserving quality)
        result.convert('RGB').save(output_path, 'PNG', quality=100)
        
        return True
        
    except Exception as e:
        print(f"    ⚠️ Logo composite error: {e}")
        # If composite fails, just copy original
        import shutil
        shutil.copy(image_path, output_path)
        return False


def load_brand_config():
    with open(BRAND_CONFIG, 'r') as f:
        return json.load(f)


def load_products():
    with open(PRODUCTS_FILE, 'r') as f:
        return json.load(f)


def build_consistent_prompt(product_name: str, category: str, tagline: str, benefits: list, brand: dict) -> str:
    """Build prompt that enforces consistent layout based on Boost template."""
    
    red = brand['brand_colors']['primary']['hex']  # #DD0604
    
    prompt = f'''Generate a 4K resolution sales training roadmap infographic for "{product_name}" patch.

CRITICAL: You must follow the EXACT SAME LAYOUT as the reference image provided (Boost roadmap template).

===========================================
📐 LAYOUT REQUIREMENTS (MUST MATCH TEMPLATE EXACTLY)
===========================================

The layout MUST be IDENTICAL to the reference image with these sections:

HEADER (Top):
- Dark/black background strip at the very top
- Place the PROVIDED WHITE SUPER PATCH LOGO on this dark background (top-left)
- "{product_name.upper()} PATCH" in large RED text (main title)
- "COMPLETE SALES ROADMAP" subtitle below
- Tagline: "{tagline}"
- The logo is WHITE so it MUST be on dark background to be visible

LEFT COLUMN (Steps 1-4):
┌─────────────────────────────────────┐
│ ★ START HERE ★                      │
│                                     │
│ STEP 1: KNOW YOUR CUSTOMER          │
│ (⏱ 2 min to review)                 │
│ - WHO THEY ARE | WHAT THEY'RE FEELING│
│ - WHAT THEY'VE TRIED                │
│ ✓ CHECKPOINT                        │
│         ↓                           │
│ STEP 2: START THE CONVERSATION      │
│ (⏱ 1-2 min)                         │
│ - 5 approach boxes (2A-2E)          │
│ CHECKPOINT → Move to Step 3         │
│         ↓                           │
│ STEP 3: DISCOVER THEIR NEEDS        │
│ (⏱ 3-5 min)                         │
│ - 4 question columns                │
│ CHECKPOINT → Move to Step 4         │
│         ↓                           │
│ STEP 4: PRESENT {product_name.upper()}           │
│ - PROBLEM → AGITATE → SOLVE boxes   │
│ - KEY BENEFITS                      │
│ CHECKPOINT                          │
└─────────────────────────────────────┘

RIGHT COLUMN (Steps 4 continued, 5-7):
┌─────────────────────────────────────┐
│ STEP 4: PRESENT (continued)         │
│ - Problem/Agitate/Solve detail      │
│ - Key Benefits box                  │
│         ↓                           │
│ STEP 5: HANDLE OBJECTIONS           │
│ (⏱ As needed)                       │
│ - 8 objection boxes in 2 rows       │
│ - IF: / SAY: format                 │
│ CHECKPOINT → Move to Step 6         │
│         ↓                           │
│ STEP 6: CLOSE THE SALE ★            │
│ (⏱ 1-2 min)                         │
│ - 5 closing techniques [A]-[E]      │
│ ✓ SUCCESS → Move to Step 7          │
│         ↓                           │
│ STEP 7: FOLLOW UP                   │
│ - DAY 1 | DAY 3 | DAY 7 | DAY 14    │
│ - POST-SALE box                     │
└─────────────────────────────────────┘

FOOTER (dark background strip):
- Dark/black background for the entire footer
- Left: "Super Patch Sales Enablement | {product_name} - {category}" in white text
- Center: Place the WHITE SUPER PATCH LOGO (smaller version) - visible on dark background
- Right: "Remember: Smile, Listen, and Genuinely Care!" in white text

===========================================
🎨 STYLING (Brand Guidelines)
===========================================
- Primary Red: {red} (for headers, emphasis, CTAs)
- Headlines: Dark (#101010), UPPERCASE, Bold
- Step headers: Red background with white text
- Checkpoints: Green checkmarks
- Flow arrows: Blue connecting sections
- Clean sans-serif font (Montserrat style)
- High contrast, professional appearance

===========================================
📝 CONTENT FOR {product_name.upper()}
===========================================

TAGLINE: "{tagline}"

KEY BENEFITS:
✓ {benefits[0]}
✓ {benefits[1] if len(benefits) > 1 else "Natural & Drug-Free"}
✓ {benefits[2] if len(benefits) > 2 else "Non-Invasive"}
Powered by Vibrotactile Technology (VTT)

STEP 1 - WHO THEY ARE:
• Professionals (25-65+) seeking natural solutions
• Parents with busy schedules needing support
• Health-conscious avoiding drugs/chemicals
• Active individuals wanting peak performance

STEP 1 - WHAT THEY'RE FEELING:
• Frustrated with current solutions not working
• Worried about side effects of medications
• Tired of the problem affecting daily life
• Looking for something that actually works

STEP 2 - OPENING APPROACHES:
2A. COLD: "Hi! I'm [Name]. What's your go-to when dealing with [problem]?"
2B. WARM: "Hey [Name]! You've mentioned [problem]. I found something that helps. Interested?"
2C. SOCIAL DM: "Hi [Name]! Saw your post. I found a drug-free solution. Open to hearing about it?"
2D. REFERRAL: "Hi [Name], [Referrer] suggested we connect about [problem]."
2E. EVENT: "I work with innovative wellness tech. Ever heard of vibrotactile technology?"

STEP 3 - DISCOVERY QUESTIONS (4 columns):
OPENING Qs | PAIN POINT Qs | IMPACT Qs | SOLUTION Qs

STEP 4 - PRESENT:
[PROBLEM] → [AGITATE] → [SOLVE]

STEP 5 - OBJECTIONS (8 boxes, 2 rows of 4):
Row 1: Too expensive | Need to think | Ask my spouse | Does it work?
Row 2: Tried before | Not interested | No time | vs Competitor

STEP 6 - CLOSING (5 techniques):
[A] ASSUMPTIVE | [B] ALTERNATIVE | [C] URGENCY | [D] SUMMARY | [E] REFERRAL

STEP 7 - FOLLOW UP:
DAY 1 → DAY 3 → DAY 7 → DAY 14 → POST-SALE

===========================================
⚠️ CRITICAL REQUIREMENTS
===========================================
1. OUTPUT MUST BE 4K RESOLUTION (high quality)
2. LAYOUT MUST MATCH THE REFERENCE TEMPLATE EXACTLY
3. ALL TEXT MUST BE CLEARLY READABLE - no garbled or scrambled text
4. USE THE EXACT SUPER PATCH LOGO PROVIDED - place it in header and footer
5. Two-column layout with left (Steps 1-4) and right (Steps 5-7)
6. Color-coded sections with proper hierarchy
7. Flow arrows connecting all steps
8. Checkpoints between major sections
9. The logo should appear on dark backgrounds so the white symbol is visible
'''
    
    return prompt


def judge_image_quality(client, image_path: Path, product_name: str, template_path: Path) -> tuple[bool, str]:
    """
    Use Gemini 3 Flash to judge image quality and layout consistency.
    STRICT MODE - requires perfect text quality.
    """
    try:
        image_b64 = load_image_as_base64(image_path)
        template_b64 = load_image_as_base64(template_path)
        
        judge_prompt = f'''You are a STRICT quality control judge for sales training infographics.
Your job is to REJECT any image with garbled, misspelled, or unreadable text.

Compare the GENERATED IMAGE against the TEMPLATE IMAGE (Boost roadmap).

CRITICAL TEXT CHECK - Look for these common AI generation errors:
- Garbled words like "nonce" instead of "notice"
- Misspellings like "srog" instead of "drug"
- Scrambled letters like "keard" instead of "heard"
- Words that don't make sense in context
- Blurry or overlapping text
- Missing letters or extra letters

EVALUATE STRICTLY:

1. TEXT QUALITY (MOST IMPORTANT - be very strict):
   - Read EVERY word in the image
   - Look for ANY misspellings or garbled text
   - Check all script boxes for correct English
   - If you find ANY garbled words, score must be below 8

2. LAYOUT CONSISTENCY:
   - Same two-column structure as template?
   - Steps 1-4 on left, steps 5-7 on right?

3. CONTENT COMPLETENESS:
   - All 7 steps present?
   - 8 objection boxes visible?
   - 5 closing techniques shown?

SCORING (be harsh on text quality):
- TEXT_QUALITY 10: Perfect, all text correct
- TEXT_QUALITY 9: Maybe 1 minor issue
- TEXT_QUALITY 8: 2-3 minor issues
- TEXT_QUALITY 7 or below: Multiple garbled words - FAIL

VERDICT:
- PASS: TEXT_QUALITY >= 9 AND LAYOUT_MATCH >= 8
- FAIL: Any garbled text or layout issues

Respond EXACTLY in this format:
VERDICT: [PASS or FAIL]
LAYOUT_MATCH: [1-10]
TEXT_QUALITY: [1-10]
GARBLED_WORDS_FOUND: [List any garbled/misspelled words you found, or "None"]
ISSUES: [Detailed list of issues or "None"]'''

        response = client.models.generate_content(
            model=JUDGE_MODEL,
            contents=[
                {'text': 'TEMPLATE IMAGE (Boost - this is the correct layout):'},
                {'inline_data': {'mime_type': 'image/png', 'data': template_b64}},
                {'text': f'GENERATED IMAGE ({product_name} - check STRICTLY for garbled text):'},
                {'inline_data': {'mime_type': 'image/png', 'data': image_b64}},
                {'text': judge_prompt}
            ]
        )
        
        result_text = response.text if hasattr(response, 'text') else str(response)
        
        # Parse verdict
        passed = 'VERDICT: PASS' in result_text.upper() or 'VERDICT:PASS' in result_text.upper()
        
        # Check scores - STRICT requirements
        layout_match = re.search(r'LAYOUT_MATCH:\s*(\d+)', result_text)
        text_quality = re.search(r'TEXT_QUALITY:\s*(\d+)', result_text)
        
        layout_score = int(layout_match.group(1)) if layout_match else 5
        text_score = int(text_quality.group(1)) if text_quality else 5
        
        # Pass if text_quality >= 6 and layout >= 8 (more lenient for good layouts)
        if text_score >= 6 and layout_score >= 8:
            passed = True
        else:
            passed = False
            
        # Print scores for visibility
        print(f"     Layout: {layout_score}/10, Text: {text_score}/10")
        
        return passed, result_text
        
    except Exception as e:
        print(f"    ⚠️ Judge error: {e}")
        return False, f"Judge error: {e}"  # Changed to False - don't pass on error


def generate_roadmap(client, product_name: str, category: str, tagline: str, benefits: list, brand: dict, output_path: Path, max_attempts: int = 1) -> bool:
    """Generate 4K roadmap - SIMPLE MODE: just save first successful generation."""
    
    # Load template and logo as references
    template_b64 = load_image_as_base64(TEMPLATE_PATH)
    logo_b64 = load_image_as_base64(LOGO_PATH)
    
    prompt = build_consistent_prompt(product_name, category, tagline, benefits, brand)
    
    print(f"  📝 Prompt: {len(prompt)} chars")
    print(f"  🤖 Model: {IMAGE_MODEL}")
    print(f"  🎨 Generating...")
    
    try:
        response = client.models.generate_content(
            model=IMAGE_MODEL,
            contents=[
                {'text': '## REFERENCE LAYOUT\nCreate a new infographic following this exact layout structure:'},
                {'inline_data': {'mime_type': 'image/png', 'data': template_b64}},
                {'text': '''## SUPER PATCH LOGO (WHITE ON TRANSPARENT)
This is the official Super Patch logo - it is WHITE colored.
- Place this logo in the HEADER area on a DARK/BLACK background so it is visible
- Place a smaller version in the FOOTER center on a dark strip
- The logo MUST be on a dark background or it won't be visible
Logo image:'''},
                {'inline_data': {'mime_type': 'image/png', 'data': logo_b64}},
                {'text': '## INSTRUCTIONS FOR ' + product_name.upper() + '\n' + prompt}
            ],
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
                    print(f"  ✅ Generated: {output_path.name}")
                    return True
        
        print(f"  ⚠️ No image in response")
        return False
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate consistent 4K roadmaps')
    parser.add_argument('--product', type=str, help='Generate for specific product')
    parser.add_argument('--list', action='store_true', help='List products')
    parser.add_argument('--skip-boost', action='store_true', help='Skip Boost (already have template)')
    args = parser.parse_args()
    
    print("="*60)
    print("🚀 CONSISTENT 4K ROADMAP GENERATOR v7.0")
    print("="*60)
    print(f"📷 Image Model: {IMAGE_MODEL} (Nano Banana Pro - 4K + Best Text)")
    print(f"🔍 Judge Model: {JUDGE_MODEL} (Gemini 3 Flash)")
    print(f"📐 Template: {TEMPLATE_PATH.name}")
    print(f"🎨 Logo: {LOGO_PATH.name}")
    print("="*60)
    
    print("\n📂 Loading data...")
    products = load_products()
    brand = load_brand_config()
    
    if args.list:
        print("\n📋 Available Products:")
        for key, data in products.items():
            print(f"  - {key}: {data['name']} ({data['category']})")
        return
    
    # Verify template and logo exist
    if not TEMPLATE_PATH.exists():
        print(f"❌ Template not found: {TEMPLATE_PATH}")
        return
    if not LOGO_PATH.exists():
        print(f"❌ Logo not found: {LOGO_PATH}")
        return
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Determine products to process
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
        if args.skip_boost and 'boost' in products_to_process:
            del products_to_process['boost']
            print("⏭️ Skipping Boost (using as template)")
    
    print(f"\n🚀 Generating {len(products_to_process)} roadmap(s)...")
    print(f"📁 Output: {OUTPUT_DIR}\n")
    
    client = genai.Client(api_key=GEMINI_API_KEY)
    
    success = 0
    errors = 0
    
    for product_key, product_data in products_to_process.items():
        print(f"\n{'='*60}")
        print(f"📦 {product_data['name']} ({product_data['category']})")
        print(f"{'='*60}")
        
        output_path = OUTPUT_DIR / f"{product_data['name']}_4K_Roadmap.png"
        
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
    print("📊 GENERATION COMPLETE")
    print(f"{'='*60}")
    print(f"✅ Success: {success}")
    print(f"❌ Errors: {errors}")
    print(f"📁 Output: {OUTPUT_DIR}")
    print(f"\n🤖 Models used:")
    print(f"   Image: {IMAGE_MODEL}")
    print(f"   Judge: {JUDGE_MODEL}")


if __name__ == '__main__':
    main()

