#!/usr/bin/env python3
"""
AI-Powered Sales Roadmap Dashboard Generator v4.0

Uses Google's latest image generation models:
- Primary: Nano Banana Pro (nano-banana-pro-preview) - Gemini 3 Pro Image, 4K support
- Fallback: Imagen 4 Ultra (imagen-4.0-ultra-generate-001) - Best text rendering

Optimized prompts for clear, readable infographic generation.
"""

import os
import json
from pathlib import Path
from datetime import datetime

from google import genai
from google.genai import types

# Configuration
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is required. Get one at https://aistudio.google.com/apikey")
BASE_DIR = Path('/Users/cbsuperpatch/Desktop/SalesEnablement')
OUTPUT_DIR = BASE_DIR / 'sales_materials/roadmaps_v4'
SPECS_DIR = BASE_DIR / 'sales_materials/roadmap_specs_v2'
PRODUCTS_FILE = BASE_DIR / 'products/superpatch_products.json'


def load_products():
    """Load product data from JSON file."""
    with open(PRODUCTS_FILE, 'r') as f:
        return json.load(f)


def load_spec(product_name: str) -> dict:
    """Load enhanced spec for a product."""
    spec_path = SPECS_DIR / f"{product_name}_Enhanced_Spec.json"
    if spec_path.exists():
        with open(spec_path, 'r') as f:
            return json.load(f)
    return None


def generate_with_nano_banana_pro(client, prompt: str, output_path: Path) -> bool:
    """
    Generate image using Nano Banana Pro (Gemini 3 Pro Image Preview).
    Official model: gemini-3-pro-image-preview
    Supports 4K resolution, advanced controls, and multi-object composition.
    """
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
                    return True
        return False
    except Exception as e:
        print(f"    Nano Banana Pro error: {e}")
        return False


def generate_with_imagen_4_ultra(client, prompt: str, output_path: Path) -> bool:
    """
    Generate image using Imagen 4 Ultra.
    Best for photorealism and text rendering.
    """
    try:
        response = client.models.generate_images(
            model='imagen-4.0-ultra-generate-001',
            prompt=prompt[:4000],  # Imagen has strict prompt limits
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio='3:4',
                safety_filter_level='BLOCK_LOW_AND_ABOVE',
            )
        )
        
        if response.generated_images:
            image_data = response.generated_images[0].image.image_bytes
            with open(output_path, 'wb') as f:
                f.write(image_data)
            return True
        return False
    except Exception as e:
        print(f"    Imagen 4 Ultra error: {e}")
        return False


def generate_with_nano_banana(client, prompt: str, output_path: Path) -> bool:
    """
    Generate image using Nano Banana (Gemini 2.5 Flash Image).
    Official model: gemini-2.5-flash-image (STABLE)
    Fast and cost-effective.
    """
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash-image',
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
                    return True
        return False
    except Exception as e:
        print(f"    Nano Banana error: {e}")
        return False


def build_optimized_prompt(spec: dict) -> str:
    """
    Build an optimized prompt for AI image generation.
    Focused on clear structure and readable text.
    """
    product = spec['metadata']['product']
    category = spec['metadata']['category']
    tagline = spec['metadata']['tagline']
    benefits = spec['metadata']['benefits']
    
    sections = spec['sections']
    customer = sections['1_customer_profile']['content']
    objections = sections['5_objection_handling']['objections']
    closings = sections['6_closing']['techniques']
    
    # Build a simplified but comprehensive prompt
    prompt = f"""Create a professional SALES ROADMAP INFOGRAPHIC poster for "{product}" wellness patch.

DESIGN STYLE: Clean corporate training poster, modern flat design, color-coded sections with flow arrows.
ORIENTATION: Portrait (3:4 ratio)
RESOLUTION: High quality, all text must be clearly readable

=== HEADER (Dark navy background) ===
Title: "{product.upper()} PATCH - COMPLETE SALES ROADMAP"
Subtitle: "{tagline}"
Top right corner: "Super Patch Sales Enablement"

=== SECTION 1: TARGET CUSTOMER (Blue) ===
Header: "TARGET CUSTOMER"
Left column - Demographics:
• {customer['demographics'][0]}
• {customer['demographics'][1]}
• {customer['demographics'][2]}
Right column - Pain Points:
• {customer['pain_points'][0]}
• {customer['pain_points'][1]}
• {customer['pain_points'][2]}

⬇ Arrow down ⬇

=== SECTION 2: OPENING APPROACHES (Light Blue) ===
Header: "5 WAYS TO START"
Show 5 horizontal boxes with labels:
[COLD] [WARM] [SOCIAL DM] [REFERRAL] [EVENT]
Each with brief script hint below

⬇ Arrow down ⬇

=== SECTION 3: DISCOVERY QUESTIONS (Purple) ===
Header: "DISCOVERY QUESTIONS"
4 columns: Opening Qs | Pain Point Qs | Impact Qs | Solution Qs
List 2-3 questions per column

⬇ Arrow down ⬇

=== SECTION 4: PRESENT SOLUTION (Green) ===
Header: "PRESENT {product.upper()}"
Show 3 connected boxes: PROBLEM → AGITATE → SOLVE
Below: "KEY BENEFITS: {' • '.join(benefits)}"
"100% Drug-Free • Non-Invasive • Vibrotactile Technology"

⬇ Arrow down ⬇

=== SECTION 5: HANDLE OBJECTIONS (Orange - Largest Section) ===
Header: "HANDLE 8 OBJECTIONS"
Subheader: 'Technique: "I understand... [Open Question]"'
Show 8 boxes in 2 rows of 4:

Row 1:
[TOO EXPENSIVE] → "What other criteria matter beyond price?"
[NEED TO THINK] → "What questions would help you decide?"
[ASK SPOUSE] → "What concerns might they have?"
[DOES IT WORK?] → "What would convince you?"

Row 2:
[TRIED BEFORE] → "What was missing from those?"
[NOT INTERESTED] → "What doesn't align for you?"
[NO TIME] → "How would solving this help your time?"
[VS COMPETITOR] → "What appeals about that option?"

⬇ Arrow down ⬇

=== SECTION 6: CLOSING TECHNIQUES (Red) ===
Header: "5 CLOSING TECHNIQUES"
Subheader: 'Pre-close: "Any questions? Does this make sense?"'
Show 5 boxes horizontally:
[ASSUMPTIVE] [ALTERNATIVE] [URGENCY] [SUMMARY] [REFERRAL]
Each with brief script below

⬇ Arrow down ⬇

=== SECTION 7: FOLLOW-UP (Teal) ===
Header: "FOLLOW-UP SEQUENCE"
Timeline: DAY 1 → DAY 3 → DAY 7 → DAY 14
Labels: Thank You | Check-In | Results | Reorder

=== FOOTER ===
"Super Patch Sales Enablement | {product} Patch - {category}"

CRITICAL REQUIREMENTS:
1. ALL TEXT MUST BE READABLE - clear fonts, good contrast
2. Each section clearly color-coded as specified
3. Professional corporate design aesthetic
4. Flow arrows connecting sections vertically
5. No photorealistic images - use icons and flat design elements
6. Portrait orientation optimized for printing"""

    return prompt


def generate_roadmap(client, spec: dict, output_path: Path) -> bool:
    """
    Generate a roadmap using the best available model.
    Tries models in order: Nano Banana Pro → Imagen 4 Ultra → Gemini Flash
    """
    prompt = build_optimized_prompt(spec)
    product = spec['metadata']['product']
    
    print(f"  📝 Prompt length: {len(prompt)} characters")
    
    # Try Nano Banana Pro first (Gemini 3 Pro Image - best for infographics)
    print(f"  🎨 Trying Nano Banana Pro (nano-banana-pro-preview)...")
    if generate_with_nano_banana_pro(client, prompt, output_path):
        print(f"  ✅ Generated with Nano Banana Pro: {output_path.name}")
        return True
    
    # Fallback to Imagen 4 Ultra (best text rendering)
    print(f"  🎨 Trying Imagen 4 Ultra (imagen-4.0-ultra-generate-001)...")
    if generate_with_imagen_4_ultra(client, prompt, output_path):
        print(f"  ✅ Generated with Imagen 4 Ultra: {output_path.name}")
        return True
    
    # Final fallback to Nano Banana (stable, fast, cost-effective)
    print(f"  🎨 Trying Nano Banana (gemini-2.5-flash-image)...")
    if generate_with_nano_banana(client, prompt, output_path):
        print(f"  ✅ Generated with Nano Banana: {output_path.name}")
        return True
    
    print(f"  ❌ All models failed for {product}")
    return False


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate AI-powered sales roadmaps')
    parser.add_argument('--product', type=str, help='Generate for specific product')
    parser.add_argument('--model', type=str, choices=['nano-banana-pro', 'imagen-4-ultra', 'nano-banana'],
                        help='Force specific model')
    parser.add_argument('--list', action='store_true', help='List products')
    args = parser.parse_args()
    
    # Load products
    print("📂 Loading product data...")
    products = load_products()
    
    if args.list:
        print("\n📋 Available Products:")
        for key, data in products.items():
            print(f"  - {key}: {data['name']} ({data['category']})")
        print("\n🤖 Available Models:")
        print("  - nano-banana-pro: gemini-3-pro-image-preview (4K, advanced controls)")
        print("  - imagen-4-ultra: imagen-4.0-ultra-generate-001 (best text rendering)")
        print("  - nano-banana: gemini-2.5-flash-image (stable, fast, cost-effective)")
        return
    
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Determine which products to process
    if args.product:
        product_lower = args.product.lower().replace(" ", "")
        found_key = None
        for key in products.keys():
            if key.replace(" ", "").lower() == product_lower or products[key]['name'].lower().replace(" ", "") == product_lower:
                found_key = key
                break
        
        if not found_key:
            print(f"❌ Product '{args.product}' not found. Use --list to see available products.")
            return
        products_to_process = {found_key: products[found_key]}
    else:
        products_to_process = products
    
    print(f"\n🚀 Generating AI-powered roadmaps for {len(products_to_process)} product(s)...")
    print(f"📁 Output directory: {OUTPUT_DIR}\n")
    
    # Initialize client
    client = genai.Client(api_key=GEMINI_API_KEY)
    
    success_count = 0
    error_count = 0
    
    for product_key, product_data in products_to_process.items():
        print(f"\n{'='*60}")
        print(f"📦 {product_data['name']} Patch ({product_data['category']})")
        print(f"{'='*60}")
        
        # Load spec
        spec = load_spec(product_data['name'])
        if not spec:
            print(f"  ⚠️ No spec found. Run generate_enhanced_roadmaps.py --specs-only first.")
            error_count += 1
            continue
        
        # Generate roadmap
        output_path = OUTPUT_DIR / f"{product_data['name']}_Roadmap_v4.png"
        
        if generate_roadmap(client, spec, output_path):
            success_count += 1
        else:
            error_count += 1
    
    print(f"\n{'='*60}")
    print("📊 GENERATION COMPLETE")
    print(f"{'='*60}")
    print(f"✅ Success: {success_count}")
    print(f"❌ Errors: {error_count}")
    print(f"📁 Roadmaps: {OUTPUT_DIR}")
    print(f"\n🤖 Models tried (in order):")
    print(f"   1. Nano Banana Pro (gemini-3-pro-image-preview)")
    print(f"   2. Imagen 4 Ultra (imagen-4.0-ultra-generate-001)")
    print(f"   3. Nano Banana (gemini-2.5-flash-image)")


if __name__ == '__main__':
    main()

