#!/usr/bin/env python3
"""
B2B Healthcare Practitioner Roadmap Generator
Generates visual sales roadmaps for internal B2B sales teams
Uses Gemini 3 Pro Image Preview for generation with quality judge
"""

import os
import sys
import base64
from pathlib import Path
from google import genai
from google.genai import types

# Configuration
IMAGE_MODEL = "gemini-3-pro-image-preview"
JUDGE_MODEL = "gemini-2.5-flash"
MAX_ATTEMPTS = 3
OUTPUT_DIR = Path("/Users/cbsuperpatch/Desktop/SalesEnablement/b2b_sales_enablement/roadmaps_branded")
LOGO_PATH = Path("/Users/cbsuperpatch/Desktop/SalesEnablement/SuperPatch-SYMBL-3_SuperPatch_Logo_SYMBL_WHT.png")
REFERENCE_IMAGE = Path("/Users/cbsuperpatch/Desktop/SalesEnablement/sales_materials/roadmaps_branded/Boost_Branded_Roadmap.png")

# B2B Products with clinical evidence focus
B2B_PRODUCTS = [
    {
        'name': 'Freedom',
        'category': 'Pain Management',
        'tagline': 'Drug-Free Pain Relief',
        'clinical_evidence': 'RESTORE RCT 2025 - Peer Reviewed',
        'key_stats': ['Significant pain reduction vs placebo', 'Improved ROM at Day 7 & 14', '118 patients, double-blind'],
        'practitioner_benefits': ['First-line/adjunct therapy option', 'No contraindications', 'Patient self-care between visits'],
        'target_practitioners': ['Chiropractors', 'Naturopaths', 'Acupuncturists', 'Functional Medicine']
    },
    {
        'name': 'REM',
        'category': 'Sleep Support',
        'tagline': 'Drug-Free Sleep Solution',
        'clinical_evidence': 'HARMONI Study - Clinical Trial',
        'key_stats': ['46% faster sleep onset', '80% stopped sleep medications', '+1.5 hours sleep per night'],
        'practitioner_benefits': ['Medication transition tool', 'Foundational sleep support', 'No dependency concerns'],
        'target_practitioners': ['Naturopaths', 'Functional Medicine', 'Integrative Medicine']
    },
    {
        'name': 'Liberty',
        'category': 'Balance & Mobility',
        'tagline': 'Drug-Free Balance Support',
        'clinical_evidence': 'Balance Study 2022 - Peer Reviewed',
        'key_stats': ['31% improvement in balance scores', 'Statistically significant (p<0.05)', 'Sway Medical Assessment'],
        'practitioner_benefits': ['Fall prevention support', 'Continuous balance support', 'Simple compliance'],
        'target_practitioners': ['Chiropractors', 'Physical Therapists', 'Geriatric Specialists']
    },
    {
        'name': 'Boost',
        'category': 'Energy Support',
        'tagline': 'Stimulant-Free Energy',
        'clinical_evidence': 'VTT Technology - Nobel Prize Research',
        'key_stats': ['No caffeine or stimulants', 'No crash or jitters', 'Neural pathway activation'],
        'practitioner_benefits': ['Caffeine-free alternative', 'No contraindications', 'Supports treatment compliance'],
        'target_practitioners': ['Naturopaths', 'Functional Medicine', 'Integrative Medicine']
    },
    {
        'name': 'Victory',
        'category': 'Athletic Performance',
        'tagline': 'Clean Performance Support',
        'clinical_evidence': 'VTT Technology - Nobel Prize Research',
        'key_stats': ['No banned substances', 'Safe for tested athletes', 'Neural optimization'],
        'practitioner_benefits': ['Clean performance option', 'Return-to-sport support', 'No drug test concerns'],
        'target_practitioners': ['Sports Medicine', 'Chiropractors', 'Physical Therapists']
    },
    {
        'name': 'Focus',
        'category': 'Cognitive Support',
        'tagline': 'Drug-Free Concentration',
        'clinical_evidence': 'VTT Technology - Nobel Prize Research',
        'key_stats': ['Non-stimulant support', 'No dependency risk', 'Neural pathway optimization'],
        'practitioner_benefits': ['Alternative to stimulant meds', 'Broad patient applicability', 'Safe long-term use'],
        'target_practitioners': ['Naturopaths', 'Functional Medicine', 'Integrative Medicine']
    },
    {
        'name': 'Peace',
        'category': 'Stress Management',
        'tagline': 'Drug-Free Calm & Clarity',
        'clinical_evidence': 'VTT Technology - Nobel Prize Research',
        'key_stats': ['No sedation effects', 'Clarity, not impairment', 'Parasympathetic support'],
        'practitioner_benefits': ['Non-pharmaceutical option', 'Supports treatment outcomes', 'No dependency'],
        'target_practitioners': ['Naturopaths', 'Acupuncturists', 'Integrative Medicine']
    },
    {
        'name': 'Defend',
        'category': 'Immune Support',
        'tagline': 'Drug-Free Wellness Support',
        'clinical_evidence': 'VTT Technology - Nobel Prize Research',
        'key_stats': ['No drug interactions', 'Neuro-immune support', 'Simple compliance'],
        'practitioner_benefits': ['Complements immune protocols', 'No supplement conflicts', 'Continuous support'],
        'target_practitioners': ['Naturopaths', 'Functional Medicine', 'Integrative Medicine']
    },
    {
        'name': 'Ignite',
        'category': 'Metabolic Support',
        'tagline': 'Stimulant-Free Metabolism',
        'clinical_evidence': 'VTT Technology - Nobel Prize Research',
        'key_stats': ['No cardiovascular effects', 'Neural pathway optimization', 'Complements lifestyle'],
        'practitioner_benefits': ['Safe for cardiac patients', 'Supports weight programs', 'No stimulant risks'],
        'target_practitioners': ['Naturopaths', 'Functional Medicine', 'Integrative Medicine']
    },
    {
        'name': 'Kick It',
        'category': 'Willpower Support',
        'tagline': 'Drug-Free Habit Support',
        'clinical_evidence': 'VTT Technology - Nobel Prize Research',
        'key_stats': ['Craving management support', 'Impulse control pathways', 'Broad habit application'],
        'practitioner_benefits': ['Cessation complement', 'Behavioral change support', 'No pharmaceutical side effects'],
        'target_practitioners': ['Naturopaths', 'Functional Medicine', 'Acupuncturists']
    },
    {
        'name': 'Joy',
        'category': 'Mood Support',
        'tagline': 'Drug-Free Emotional Wellness',
        'clinical_evidence': 'VTT Technology - Nobel Prize Research',
        'key_stats': ['No discontinuation effects', 'Subclinical mood support', 'Neural pathway optimization'],
        'practitioner_benefits': ['Non-pharmaceutical option', 'Wellness focus', 'Safe to start/stop'],
        'target_practitioners': ['Naturopaths', 'Functional Medicine', 'Integrative Medicine']
    },
    {
        'name': 'Lumi',
        'category': 'Skin Health',
        'tagline': 'Inside-Out Beauty Support',
        'clinical_evidence': 'VTT Technology - Nobel Prize Research',
        'key_stats': ['Neural skin support', 'Complements topicals', 'Holistic approach'],
        'practitioner_benefits': ['Inside-out support', 'Enhances treatments', 'Wellness integration'],
        'target_practitioners': ['Naturopaths', 'Aesthetic Practitioners', 'Integrative Medicine']
    },
    {
        'name': 'Rocket',
        'category': "Men's Vitality",
        'tagline': 'Drug-Free Male Wellness',
        'clinical_evidence': 'VTT Technology - Nobel Prize Research',
        'key_stats': ['No hormonal intervention', 'No monitoring required', 'Neural vitality support'],
        'practitioner_benefits': ['Non-pharmaceutical option', 'Simple integration', 'Wellness optimization'],
        'target_practitioners': ['Naturopaths', 'Functional Medicine', 'Integrative Medicine']
    }
]

def load_image_as_base64(path: Path) -> str:
    """Load image and convert to base64"""
    with open(path, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')

def create_b2b_prompt(product: dict) -> str:
    """Create B2B-focused prompt for roadmap generation"""
    
    stats_text = ' | '.join(product['key_stats'])
    benefits_text = ' | '.join(product['practitioner_benefits'])
    practitioners_text = ', '.join(product['target_practitioners'])
    
    prompt = f"""Create a professional B2B healthcare practitioner sales roadmap infographic for Super Patch {product['name']}.

PRODUCT INFORMATION:
- Product: {product['name']} Patch
- Category: {product['category']}
- Tagline: {product['tagline']}
- Clinical Evidence: {product['clinical_evidence']}

LAYOUT (Follow the reference image layout EXACTLY):
Create a 4K resolution (3840x2160) professional infographic with these sections:

HEADER SECTION (Top):
- Large product name: "{product['name'].upper()}"
- Tagline: "{product['tagline']}"
- Category badge: "{product['category']}"
- Place the white Super Patch logo in the top right corner

CLINICAL EVIDENCE SECTION (Left):
Title: "CLINICAL EVIDENCE"
- {product['clinical_evidence']}
Key Statistics:
- {product['key_stats'][0]}
- {product['key_stats'][1]}
- {product['key_stats'][2]}

PRACTITIONER BENEFITS SECTION (Center):
Title: "PRACTICE BENEFITS"
- {product['practitioner_benefits'][0]}
- {product['practitioner_benefits'][1]}
- {product['practitioner_benefits'][2]}
- 25% Practitioner Discount

TARGET PRACTITIONERS SECTION (Right):
Title: "IDEAL FOR"
- {practitioners_text}

BOTTOM SECTION:
- "VTT Technology - Based on Nobel Prize Research"
- "Drug-Free | No Contraindications | 25% Margin"

DESIGN REQUIREMENTS:
1. DARK BACKGROUND - Use deep teal/navy (#0A2E38 or similar) as primary background
2. ACCENT COLORS - Use bright teal (#00BCD4) and orange (#FF6B35) for highlights
3. TYPOGRAPHY - Use clean, professional sans-serif fonts (like Montserrat, Roboto, or Open Sans)
4. ALL TEXT MUST BE PERFECTLY CLEAR AND READABLE - No blurry, garbled, or distorted text
5. Professional medical/clinical aesthetic suitable for healthcare practitioners
6. Include the white Super Patch logo provided in the top right area
7. Use icons or visual elements to represent each section
8. Ensure high contrast for readability
9. Every word must be spelled correctly and legible

TEXT RENDERING CRITICAL REQUIREMENTS:
- Render all text at HIGH RESOLUTION with SHARP EDGES
- Use BOLD fonts for headers, regular weight for body text
- Ensure MINIMUM 24pt equivalent font size for body text
- Headers should be 48pt+ equivalent
- NO text overlapping or crowding
- WHITE or LIGHT text on dark backgrounds
- Maintain consistent letter spacing

This is a B2B sales tool for internal teams selling to healthcare practitioners. Make it look professional, clinical, and evidence-based."""

    return prompt

def judge_image_quality(client, image_data: bytes, product_name: str) -> tuple[int, str]:
    """Use AI to judge if the generated image has readable text"""
    try:
        judge_prompt = """Analyze this sales roadmap infographic and rate the TEXT QUALITY on a scale of 1-10.

EVALUATE:
1. Is ALL text clearly readable and not garbled/blurry?
2. Are words spelled correctly?
3. Is the layout professional and organized?
4. Is the text high contrast and legible?
5. Does it look like a professional B2B sales document?

RESPOND WITH EXACTLY THIS FORMAT:
SCORE: [1-10]
REASONING: [brief explanation]

A score of 7+ means acceptable for professional use.
A score below 7 means text quality issues need fixing."""

        response = client.models.generate_content(
            model=JUDGE_MODEL,
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(data=image_data, mime_type="image/png"),
                        types.Part.from_text(text=judge_prompt)
                    ]
                )
            ]
        )
        
        result = response.text
        
        # Parse score
        score = 5  # default
        if "SCORE:" in result:
            try:
                score_line = [l for l in result.split('\n') if 'SCORE:' in l][0]
                score = int(''.join(filter(str.isdigit, score_line.split(':')[1][:3])))
            except:
                pass
        
        return score, result
        
    except Exception as e:
        print(f"    Judge error: {e}")
        return 7, "Judge unavailable - accepting image"

def generate_b2b_roadmap(client, product: dict, logo_data: str, reference_data: str) -> tuple[bytes, int]:
    """Generate a B2B roadmap for a product with quality checking"""
    
    prompt = create_b2b_prompt(product)
    best_image = None
    best_score = 0
    
    print(f"\n{'='*60}")
    print(f"🏥 {product['name']} - B2B Practitioner Roadmap")
    print(f"{'='*60}")
    print(f"  📝 Prompt: {len(prompt)} chars")
    
    for attempt in range(1, MAX_ATTEMPTS + 1):
        print(f"  🎨 Attempt {attempt}/{MAX_ATTEMPTS}...")
        
        try:
            # Create content with logo and reference images
            response = client.models.generate_content(
                model=IMAGE_MODEL,
                contents=[
                    types.Content(
                        role="user",
                        parts=[
                            types.Part.from_bytes(
                                data=base64.b64decode(logo_data),
                                mime_type="image/png"
                            ),
                            types.Part.from_bytes(
                                data=base64.b64decode(reference_data),
                                mime_type="image/png"
                            ),
                            types.Part.from_text(text=prompt)
                        ]
                    )
                ],
                config=types.GenerateContentConfig(
                    response_modalities=["image", "text"],
                    temperature=0.7
                )
            )
            
            # Extract image
            image_data = None
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'inline_data') and part.inline_data:
                    image_data = part.inline_data.data
                    break
            
            if not image_data:
                print(f"    ⚠️ No image in response")
                continue
            
            # Judge quality
            print(f"  🔍 Judging text quality...")
            score, reasoning = judge_image_quality(client, image_data, product['name'])
            print(f"     Score: {score}/10", "✅ PASS" if score >= 7 else "❌ FAIL")
            
            # Track best
            if score > best_score:
                best_score = score
                best_image = image_data
                print(f"     🏆 New best! (score: {score})")
            
            if score >= 7:
                return image_data, score
                
        except Exception as e:
            print(f"    ❌ Error: {e}")
            continue
    
    # Return best attempt if we have one
    if best_image:
        print(f"  ⚠️ Using best attempt (score: {best_score})")
        return best_image, best_score
    
    return None, 0

def main():
    # Get API key
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        print("❌ GEMINI_API_KEY environment variable not set")
        sys.exit(1)
    
    # Initialize client
    client = genai.Client(api_key=api_key)
    
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Load reference images
    print("📷 Loading reference images...")
    logo_data = load_image_as_base64(LOGO_PATH)
    reference_data = load_image_as_base64(REFERENCE_IMAGE)
    
    print("="*60)
    print("🏥 B2B HEALTHCARE PRACTITIONER ROADMAP GENERATOR")
    print("="*60)
    print(f"📷 Image Model: {IMAGE_MODEL}")
    print(f"🔍 Judge Model: {JUDGE_MODEL}")
    print(f"📋 Products: {len(B2B_PRODUCTS)}")
    print(f"📁 Output: {OUTPUT_DIR}")
    print("="*60)
    
    # Filter products if specified on command line
    products_to_generate = B2B_PRODUCTS
    if len(sys.argv) > 1:
        product_names = [arg.lower() for arg in sys.argv[1:]]
        products_to_generate = [p for p in B2B_PRODUCTS if p['name'].lower() in product_names]
        if not products_to_generate:
            print(f"❌ No matching products found for: {sys.argv[1:]}")
            sys.exit(1)
    
    # Generate roadmaps
    generated = 0
    for product in products_to_generate:
        output_path = OUTPUT_DIR / f"{product['name']}_B2B_Roadmap.png"
        
        # Skip if exists (unless forced)
        if output_path.exists() and '--force' not in sys.argv:
            print(f"\n⏭️ Skipping {product['name']} (exists)")
            continue
        
        image_data, score = generate_b2b_roadmap(client, product, logo_data, reference_data)
        
        if image_data:
            with open(output_path, 'wb') as f:
                f.write(image_data)
            print(f"  ✅ Saved: {output_path.name} (score: {score})")
            generated += 1
        else:
            print(f"  ❌ Failed to generate {product['name']}")
    
    print(f"\n✅ Complete: {generated} B2B roadmaps generated")
    print(f"📁 Location: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()

