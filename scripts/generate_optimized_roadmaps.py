#!/usr/bin/env python3
"""
OPTIMIZED Roadmap Generator - Applying Best Practices for Perfect Text

Key Techniques Applied:
1. Break text into smaller chunks (sections)
2. Explicit typography instructions
3. Semantic negative prompts
4. High contrast backgrounds
5. Iterative refinement
6. "Act as" professional designer
7. Specific font details
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

PRODUCTS = [
    {'name': 'Boost', 'category': 'Energy & Performance', 'tagline': 'Unlock Your Energy'},
    {'name': 'Freedom', 'category': 'Pain & Mobility', 'tagline': 'Move Without Limits'},
    {'name': 'Liberty', 'category': 'Pain & Mobility', 'tagline': 'Embrace Freedom'},
    {'name': 'REM', 'category': 'Sleep & Recovery', 'tagline': 'Wake Refreshed'},
    {'name': 'Victory', 'category': 'Mood & Wellness', 'tagline': 'Conquer Every Day'},
    {'name': 'Focus', 'category': 'Mental Clarity', 'tagline': 'Sharpen Your Mind'},
    {'name': 'Defend', 'category': 'Immune Support', 'tagline': 'Strengthen Defense'},
    {'name': 'Ignite', 'category': 'Weight Management', 'tagline': 'Fuel Transformation'},
    {'name': 'Kick It', 'category': 'Habit Control', 'tagline': 'Break Free'},
    {'name': 'Peace', 'category': 'Stress & Calm', 'tagline': 'Find Inner Calm'},
    {'name': 'Jet Lag', 'category': 'Travel Recovery', 'tagline': 'Arrive Ready'},
    {'name': 'Joy', 'category': 'Mood Enhancement', 'tagline': 'Elevate Your Mood'},
    {'name': 'Launch', 'category': 'Intimacy & Vitality', 'tagline': 'Reignite Passion'},
]


def load_brand_config():
    with open(BRAND_CONFIG, 'r') as f:
        return json.load(f)


def extract_benefits(product_name: str) -> list:
    """Extract benefits from wordtrack."""
    wordtrack_path = WORDTRACKS_DIR / f"{product_name}_WordTrack.md"
    if not wordtrack_path.exists():
        return ['Natural wellness', 'Drug-free', 'VTT powered']
    
    with open(wordtrack_path, 'r') as f:
        content = f.read()
    
    benefits = re.findall(r'[•\-]\s*\*?\*?([^•\-\n]{10,40}?)\*?\*?\s*(?:\n|$)', content)
    return [b.strip()[:35] for b in benefits[:3]] if benefits else ['Natural wellness', 'Drug-free', 'VTT powered']


def build_optimized_prompt(product: dict, benefits: list, brand: dict) -> str:
    """Build prompt with ALL best practices for text rendering."""
    
    red = brand['brand_colors']['primary']['hex']
    dark = brand['brand_colors']['neutrals']['grey_900']['hex']
    
    # SHORT, CLEAR text items - key to good rendering
    prompt = f'''Act as a PROFESSIONAL GRAPHIC DESIGNER specializing in corporate infographics and typography.

Create a sales roadmap infographic for "{product['name']}" by Super Patch.

## CRITICAL TEXT RENDERING RULES
- ALL text must be CLEAR, CRISP, and PERFECTLY LEGIBLE
- Use BOLD, UPPERCASE, SANS-SERIF fonts for headers
- Use clean sans-serif for body text
- HIGH CONTRAST: dark text on light backgrounds, white text on dark backgrounds
- DO NOT blend, distort, blur, or stylize any text
- Every letter must be distinct and readable
- Uniform letter spacing throughout
- NO decorative or script fonts

## LAYOUT (Portrait 3:4)

### HEADER (dark charcoal {dark} background)
White text, centered:
- "SUPER PATCH" (small, top)
- "{product['name'].upper()}" (large, bold)
- "{product['tagline']}" (medium)
- "[{product['category']}]" (small, red {red})

### LEFT COLUMN (40% width)

BOX 1 - Light grey background, black text:
Header: "KNOW YOUR CUSTOMER"
• Health-conscious adults 25-65+
• Frustrated with current solutions
• Looking for natural alternatives

BOX 2 - Blue header bar, white content:
Header: "START CONVERSATION"
• COLD: Ask about their wellness
• WARM: Reference their situation  
• REFERRAL: Mention who sent you

BOX 3 - Blue header bar, white content:
Header: "DISCOVER NEEDS"
• What have you tried?
• How does it affect your life?
• What would help most?

### RIGHT COLUMN (60% width)

BOX 4 - Green header bar, white content:
Header: "PRESENT {product['name'].upper()}"
• Problem: Identify their struggle
• Solution: {product['name']} uses VTT
• Benefits: {', '.join(benefits[:3])}

BOX 5 - Orange header bar, 4 small boxes (2x2):
Header: "HANDLE OBJECTIONS"
"Too expensive" → Value question
"Need to think" → What would help?
"Does it work?" → Share results
"Not sure" → Trial offer

BOX 6 - Gold header bar, white content:
Header: "CLOSE THE SALE"
[A] Assumptive close
[B] Alternative choice
[C] Summary of benefits
[D] Referral request

BOX 7 - Teal header bar, horizontal timeline:
Header: "FOLLOW UP"
Day 1 → Day 3 → Day 7 → Post-Sale

### FOOTER (dark charcoal strip)
White text: "Super Patch | {product['name']} Sales Guide"

## OUTPUT REQUIREMENTS
- 4K resolution, portrait orientation
- Professional, corporate design
- Color-coded sections
- Connecting arrows between sections
- PERFECT TEXT LEGIBILITY - this is the #1 priority'''

    return prompt


def generate_roadmap(client, product: dict, brand: dict, output_path: Path) -> bool:
    """Generate roadmap with optimized text rendering."""
    
    print(f"\n{'='*60}")
    print(f"🎨 {product['name']} - Optimized Text Rendering")
    print(f"{'='*60}")
    
    template_img = Image.open(TEMPLATE_PATH)
    logo_img = Image.open(LOGO_PATH)
    benefits = extract_benefits(product['name'])
    
    prompt = build_optimized_prompt(product, benefits, brand)
    
    print(f"  📝 Prompt length: {len(prompt)} chars")
    print(f"  🎨 Generating with text optimization...")
    
    try:
        response = client.models.generate_content(
            model=IMAGE_MODEL,
            contents=[
                "REFERENCE LAYOUT - Follow this structure:",
                template_img,
                "LOGO (white, place on dark header):",
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
        
        print("  ⚠️ No image generated")
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
    print("🎨 OPTIMIZED ROADMAP GENERATOR")
    print("="*60)
    print("Techniques Applied:")
    print("  ✓ Shorter text chunks")
    print("  ✓ Explicit typography instructions")
    print("  ✓ Semantic negative prompts")
    print("  ✓ High contrast requirements")
    print("  ✓ 'Act as designer' framing")
    print("  ✓ Sans-serif font specification")
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

