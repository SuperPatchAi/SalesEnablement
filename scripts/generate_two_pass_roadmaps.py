#!/usr/bin/env python3
"""
Two-Pass Roadmap Generator
Pass 1: Generate beautiful layout with HALF the sections (Steps 1-3)
Pass 2: Add remaining sections (Steps 4-7) with full detail
"""

import os
import json
import re
import base64
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

PRODUCTS = [
    {'name': 'Boost', 'category': 'Energy & Performance', 'tagline': 'Unlock Your Energy Potential'},
    {'name': 'Freedom', 'category': 'Pain & Mobility', 'tagline': 'Move Without Limits'},
    {'name': 'Liberty', 'category': 'Pain & Mobility', 'tagline': 'Embrace Your Freedom'},
    {'name': 'REM', 'category': 'Sleep & Recovery', 'tagline': 'Wake Up Refreshed'},
    {'name': 'Victory', 'category': 'Mood & Wellness', 'tagline': 'Conquer Every Day'},
    {'name': 'Focus', 'category': 'Mental Clarity', 'tagline': 'Sharpen Your Mind'},
    {'name': 'Defend', 'category': 'Immune Support', 'tagline': 'Strengthen Your Defense'},
    {'name': 'Ignite', 'category': 'Weight Management', 'tagline': 'Fuel Your Transformation'},
    {'name': 'Kick It', 'category': 'Habit Control', 'tagline': 'Break Free From Cravings'},
    {'name': 'Peace', 'category': 'Stress & Calm', 'tagline': 'Find Your Inner Calm'},
    {'name': 'Jet Lag', 'category': 'Travel Recovery', 'tagline': 'Arrive Ready'},
    {'name': 'Joy', 'category': 'Mood Enhancement', 'tagline': 'Elevate Your Mood'},
    {'name': 'Launch', 'category': 'Intimacy & Vitality', 'tagline': 'Reignite Your Passion'},
]


def load_brand_config():
    with open(BRAND_CONFIG, 'r') as f:
        return json.load(f)


def extract_benefits(product_name: str) -> list:
    """Extract benefits from wordtrack."""
    wordtrack_path = WORDTRACKS_DIR / f"{product_name}_WordTrack.md"
    if not wordtrack_path.exists():
        return ['Improved wellness', 'Natural VTT technology', 'Drug-free solution']
    
    with open(wordtrack_path, 'r') as f:
        content = f.read()
    
    benefits = re.findall(r'[•\-]\s*\*?\*?([^•\-\n]+?)\*?\*?\s*(?:\n|$)', content)
    return benefits[:4] if benefits else ['Improved wellness', 'Natural technology', 'Easy to use']


def generate_roadmap(client, product: dict, brand: dict, output_path: Path) -> bool:
    """Generate roadmap in a single comprehensive pass."""
    
    print(f"\n{'='*60}")
    print(f"🎨 Generating: {product['name']} Roadmap")
    print(f"{'='*60}")
    
    # Load references
    template_img = Image.open(TEMPLATE_PATH)
    logo_img = Image.open(LOGO_PATH)
    
    benefits = extract_benefits(product['name'])
    benefits_text = ' | '.join(benefits[:3])
    
    # Brand colors
    red = brand['brand_colors']['primary']['hex']
    dark = brand['brand_colors']['neutrals']['grey_900']['hex']
    
    # Single comprehensive prompt with VISUAL EMPHASIS
    prompt = f'''Create a professional, visually stunning sales roadmap infographic for "{product['name']}" patch by Super Patch.

## CRITICAL REQUIREMENTS
1. Follow the EXACT layout structure from the reference image
2. Use the white Super Patch logo on dark header/footer
3. Make ALL text READABLE - use clean fonts, good contrast
4. Include ALL sections with their content

## HEADER (dark background {dark})
- White Super Patch logo (top left)
- Title: "{product['name'].upper()} SALES ROADMAP" 
- Subtitle: "{product['tagline']}" 
- Category badge: "{product['category']}"

## LEFT COLUMN - Customer Understanding
### [1] KNOW YOUR CUSTOMER (grey box)
- WHO: Professionals 25-65+, health-conscious
- WHAT THEY FEEL: Frustrated, tired, seeking solutions
- WHAT TRIED: Pills, prescriptions - none worked

### [2] START CONVERSATION (blue header)
Approaches with SHORT text:
- COLD: "What's your go-to for [issue]?"
- WARM: "You mentioned... I found something"
- SOCIAL: "Saw your post, found a solution"
- REFERRAL: "[Name] suggested we connect"

### [3] DISCOVERY (blue header)
Questions in boxes:
- "Tell me about your day"
- "When does it hit hardest?"
- "How does this affect life?"
- "What would ideal look like?"

## RIGHT COLUMN - Sales Execution
### [4A] PRESENT SOLUTION (green header)
- Problem: "Ever found yourself struggling?"
- Solution: "{product['name']} uses VTT technology"
- Benefits: {benefits_text}

### [4B] TRIAL CLOSE (red header)
- "Does this make sense for you?"
- "Any questions so far?"
- "Sound like what you need?"

### [5] HANDLE OBJECTIONS (orange header, 8 small boxes)
Show as mini cards:
"Too expensive" → "What matters besides cost?"
"Need to think" → "What questions would help?"
"Ask spouse" → "What would they want to know?"
"Does it work?" → "What would convince you?"

### [6] CLOSE THE SALE (gold header, 5 boxes)
Techniques as numbered items:
[A] ASSUMPTIVE: "This is what you need"
[B] ALTERNATIVE: "30-day or 90-day?"
[C] URGENCY: "Special pricing this week"
[D] SUMMARY: "You get [benefits]. Ready?"
[E] REFERRAL: "Who else could benefit?"

### [7] FOLLOW UP (teal header, timeline)
Day 1 → Day 3 → Day 7 → Post-Sale

## FOOTER (dark strip)
- Centered small logo
- "Super Patch Sales Enablement | {product['name']}"

## STYLE REQUIREMENTS
- Professional, corporate look
- Color-coded sections matching reference
- Connecting arrows between sections
- 3:4 portrait orientation
- 4K resolution
- ALL TEXT MUST BE CRISP AND READABLE'''

    print(f"  🎨 Generating (single pass, full detail)...")
    
    try:
        response = client.models.generate_content(
            model=IMAGE_MODEL,
            contents=[
                "REFERENCE LAYOUT - Match this exact structure:",
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
                    with open(output_path, 'wb') as f:
                        f.write(part.inline_data.data)
                    print(f"  ✅ Saved: {output_path.name}")
                    return True
        
        print("  ⚠️ No image in response")
        return False
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
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
    print("🎨 TWO-PASS ROADMAP GENERATOR")
    print(f"📷 Model: {IMAGE_MODEL}")
    print("="*60)
    
    # Check for specific product
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

