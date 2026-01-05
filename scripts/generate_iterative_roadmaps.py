#!/usr/bin/env python3
"""
Generate Sales Roadmaps Iteratively - Section by Section
Uses multi-turn chat to build roadmaps piece by piece for better text quality.
"""

import os
import json
import re
import base64
from pathlib import Path
from google import genai
from google.genai import types

# Paths
BASE_DIR = Path(__file__).parent.parent
WORDTRACKS_DIR = BASE_DIR / 'sales_materials' / 'docx'
OUTPUT_DIR = BASE_DIR / 'sales_materials' / 'roadmaps_final'
BRAND_CONFIG = BASE_DIR / 'brand_styling_reference_config.json'
TEMPLATE_PATH = BASE_DIR / 'sales_materials' / 'roadmaps_branded' / 'Boost_Branded_Roadmap.png'
LOGO_PATH = BASE_DIR / 'SuperPatch-SYMBL-3_SuperPatch_Logo_SYMBL_WHT.png'

# Model
IMAGE_MODEL = 'gemini-3-pro-image-preview'

# Products to generate
PRODUCTS = [
    {'name': 'Boost', 'category': 'Energy & Performance', 'tagline': 'Unlock Your Energy Potential'},
    {'name': 'Freedom', 'category': 'Pain & Mobility', 'tagline': 'Move Without Limits'},
    {'name': 'Liberty', 'category': 'Pain & Mobility', 'tagline': 'Embrace Your Freedom of Movement'},
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


def load_image_as_base64(path: Path) -> str:
    """Load image and return base64 encoded string."""
    with open(path, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')


def load_brand_config() -> dict:
    """Load brand styling configuration."""
    with open(BRAND_CONFIG, 'r') as f:
        return json.load(f)


def extract_wordtrack_sections(product_name: str) -> dict:
    """Extract key sections from wordtrack markdown."""
    wordtrack_path = WORDTRACKS_DIR / f"{product_name}_WordTrack.md"
    
    if not wordtrack_path.exists():
        return {}
    
    with open(wordtrack_path, 'r') as f:
        content = f.read()
    
    sections = {}
    
    # Extract opening hook
    hook_match = re.search(r'Opening Hook.*?\n(.*?)(?=\n##|\n\*\*[A-Z]|\Z)', content, re.DOTALL | re.IGNORECASE)
    if hook_match:
        sections['hook'] = hook_match.group(1).strip()[:300]
    
    # Extract key benefits (first 3)
    benefits = re.findall(r'[•\-]\s*\*?\*?([^•\-\n]+?)\*?\*?\s*(?:\n|$)', content)
    sections['benefits'] = benefits[:3] if benefits else ['Improved wellness', 'Natural technology', 'Easy to use']
    
    # Extract objection handling
    objection_match = re.search(r'Objection.*?Handling.*?\n(.*?)(?=\n##|\Z)', content, re.DOTALL | re.IGNORECASE)
    if objection_match:
        sections['objections'] = objection_match.group(1).strip()[:400]
    
    # Extract closing
    closing_match = re.search(r'Clos(?:e|ing).*?\n(.*?)(?=\n##|\Z)', content, re.DOTALL | re.IGNORECASE)
    if closing_match:
        sections['closing'] = closing_match.group(1).strip()[:300]
    
    return sections


def generate_roadmap_iteratively(client, product: dict, brand: dict, output_path: Path) -> bool:
    """Generate roadmap by building it section by section using chat."""
    
    print(f"\n{'='*60}")
    print(f"🎨 Generating: {product['name']} Roadmap (Iterative)")
    print(f"{'='*60}")
    
    # Load references
    template_b64 = load_image_as_base64(TEMPLATE_PATH)
    logo_b64 = load_image_as_base64(LOGO_PATH)
    
    # Get wordtrack content
    sections = extract_wordtrack_sections(product['name'])
    benefits = sections.get('benefits', ['Improved wellness', 'Natural approach', 'Easy to use'])
    
    # Brand colors
    red = brand['brand_colors']['primary']['hex']
    dark = brand['brand_colors']['neutrals']['grey_900']['hex']
    
    # Create chat session
    chat = client.chats.create(
        model=IMAGE_MODEL,
        config=types.GenerateContentConfig(
            response_modalities=['TEXT', 'IMAGE'],
        )
    )
    
    # STEP 1: Create base layout with header
    print("  📐 Step 1: Creating base layout with header...")
    step1_prompt = f"""Create a professional sales roadmap infographic for "{product['name']}" by Super Patch.

REFERENCE LAYOUT - follow this structure exactly:
[Image attached]

LOGO TO USE (white on transparent - place on dark background):
[Image attached]

FOR THIS FIRST STEP, create just:
1. A dark header bar at top with the white Super Patch logo
2. Large title: "{product['name'].upper()} SALES ROADMAP"
3. Subtitle: "{product['tagline']}"
4. Category badge: "{product['category']}"

Leave the rest of the canvas as a clean layout grid ready for content.
Use brand red {red} for accents and dark {dark} for backgrounds.
Aspect ratio 3:4, high quality."""

    # Build content parts for first message
    from PIL import Image
    import io
    
    # Load images as PIL
    template_img = Image.open(TEMPLATE_PATH)
    logo_img = Image.open(LOGO_PATH)
    
    response = chat.send_message([
        step1_prompt,
        template_img,
        logo_img,
    ])
    
    current_image = None
    for part in response.candidates[0].content.parts if response.candidates else []:
        if hasattr(part, 'inline_data') and part.inline_data:
            current_image = part.inline_data.data
            print("  ✓ Base layout created")
            break
    
    if not current_image:
        print("  ❌ Failed to create base layout")
        return False
    
    # STEP 2: Add Opening section
    print("  📝 Step 2: Adding Opening section...")
    step2_prompt = f"""Now add SECTION 1 - "OPENING" to this roadmap.

Add a section box with:
- Header: "1. OPENING" in bold
- Time estimate: "2-3 minutes"
- Key text: "Introduce yourself and ask discovery questions"
- Bullet points:
  • "Hi, I'm [name] with Super Patch"
  • "What brings you here today?"
  • "Have you tried wellness patches before?"

Keep all existing elements. Place this in the upper-left content area.
Make the text CLEAR and READABLE - use clean sans-serif font."""

    response = chat.send_message(step2_prompt)
    
    for part in response.candidates[0].content.parts if response.candidates else []:
        if hasattr(part, 'inline_data') and part.inline_data:
            current_image = part.inline_data.data
            print("  ✓ Opening section added")
            break
    
    # STEP 3: Add Benefits section
    print("  📝 Step 3: Adding Benefits section...")
    benefits_text = '\n  • '.join(benefits[:3])
    step3_prompt = f"""Now add SECTION 2 - "KEY BENEFITS" to the roadmap.

Add a section box with:
- Header: "2. KEY BENEFITS" in bold
- Time estimate: "3-4 minutes"
- Key benefits:
  • {benefits_text}

Place this next to or below the Opening section.
Keep all existing elements intact.
TEXT MUST BE PERFECTLY READABLE."""

    response = chat.send_message(step3_prompt)
    
    for part in response.candidates[0].content.parts if response.candidates else []:
        if hasattr(part, 'inline_data') and part.inline_data:
            current_image = part.inline_data.data
            print("  ✓ Benefits section added")
            break
    
    # STEP 4: Add Demo section
    print("  📝 Step 4: Adding Demo section...")
    step4_prompt = f"""Now add SECTION 3 - "PRODUCT DEMO" to the roadmap.

Add a section box with:
- Header: "3. PRODUCT DEMO" in bold
- Time estimate: "2-3 minutes"
- Steps:
  • "Show the {product['name']} patch"
  • "Explain VTT technology"
  • "Demonstrate application"
  • "Discuss wear time (12-24 hours)"

Keep all existing elements. Place in the layout flow.
ENSURE ALL TEXT IS CRYSTAL CLEAR."""

    response = chat.send_message(step4_prompt)
    
    for part in response.candidates[0].content.parts if response.candidates else []:
        if hasattr(part, 'inline_data') and part.inline_data:
            current_image = part.inline_data.data
            print("  ✓ Demo section added")
            break
    
    # STEP 5: Add Objections section
    print("  📝 Step 5: Adding Objections section...")
    step5_prompt = """Now add SECTION 4 - "HANDLE OBJECTIONS" to the roadmap.

Add a section box with:
- Header: "4. HANDLE OBJECTIONS" in bold
- Common objections with responses:
  • "Too expensive" → "Compare to daily costs"
  • "Does it really work?" → "Share testimonials"
  • "I need to think" → "Offer starter pack"

Keep all existing elements. 
MAKE SURE TEXT IS LEGIBLE AND NOT GARBLED."""

    response = chat.send_message(step5_prompt)
    
    for part in response.candidates[0].content.parts if response.candidates else []:
        if hasattr(part, 'inline_data') and part.inline_data:
            current_image = part.inline_data.data
            print("  ✓ Objections section added")
            break
    
    # STEP 6: Add Closing section
    print("  📝 Step 6: Adding Closing section...")
    step6_prompt = f"""Finally, add SECTION 5 - "CLOSE THE SALE" to complete the roadmap.

Add a section box with:
- Header: "5. CLOSE THE SALE" in bold
- Time estimate: "2-3 minutes"
- Closing techniques:
  • "Which pack works best for you?"
  • "Ready to start your {product['name']} journey?"
  • "I can set you up with a subscription"

Also add a footer with the Super Patch logo (small, centered) on a dark strip.

FINAL CHECK: All text must be perfectly readable.
Keep the professional, clean layout."""

    response = chat.send_message(step6_prompt)
    
    for part in response.candidates[0].content.parts if response.candidates else []:
        if hasattr(part, 'inline_data') and part.inline_data:
            current_image = part.inline_data.data
            print("  ✓ Closing section added")
            break
    
    # Save final image
    if current_image:
        with open(output_path, 'wb') as f:
            f.write(current_image)
        print(f"  ✅ Saved: {output_path.name}")
        return True
    
    print("  ❌ Failed to generate complete roadmap")
    return False


def main():
    """Main entry point."""
    # Initialize client
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        print("❌ Error: GEMINI_API_KEY environment variable not set")
        return
    
    client = genai.Client(api_key=api_key)
    
    # Load brand config
    brand = load_brand_config()
    
    # Ensure output directory exists
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    print("="*60)
    print("🎨 ITERATIVE ROADMAP GENERATOR")
    print("="*60)
    print(f"📷 Model: {IMAGE_MODEL} (Nano Banana Pro)")
    print(f"📁 Output: {OUTPUT_DIR}")
    print(f"📊 Products: {len(PRODUCTS)}")
    print("="*60)
    
    # Check for --product argument
    import sys
    target_product = None
    if len(sys.argv) > 1:
        target_product = sys.argv[1]
        print(f"🎯 Target: {target_product} only")
    
    success = 0
    failed = 0
    
    for product in PRODUCTS:
        if target_product and product['name'].lower() != target_product.lower():
            continue
            
        output_path = OUTPUT_DIR / f"{product['name']}_4K_Roadmap.png"
        
        # Skip if exists
        if output_path.exists() and not target_product:
            print(f"⏭️  Skipping {product['name']} (exists)")
            success += 1
            continue
        
        if generate_roadmap_iteratively(client, product, brand, output_path):
            success += 1
        else:
            failed += 1
    
    print("\n" + "="*60)
    print(f"✅ Complete: {success} successful, {failed} failed")
    print("="*60)


if __name__ == '__main__':
    main()

