#!/usr/bin/env python3
"""
Enterprise-Class Sales Infographic Generator

Uses structured JSON specifications and Google's Nano Banana Pro (Gemini 3 Pro Image)
to create professional, enterprise-grade sales infographics for direct sales teams.

Based on research:
- Visual hierarchy principles (size, color, contrast, typography)
- Step-by-step process visualization
- Color psychology for sales materials
- Clear CTAs and decision flowcharts
"""

import os
import json
from pathlib import Path
from datetime import datetime

from google import genai
from google.genai import types

# Configuration
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyCg5Q8EYqYy54xmFq31Dv1iGmbXixsBb4w')
OUTPUT_DIR = Path('/workspace/sales_materials/infographics_v2')
SPECS_DIR = Path('/workspace/sales_materials/infographic_specs')
PRODUCTS_FILE = Path('/workspace/products/superpatch_products.json')


# Color Psychology for Sales (from research)
COLOR_SCHEMES = {
    "Aches & Pains": {
        "primary": "#2E7D32",  # Green - healing, relief
        "secondary": "#81C784",
        "accent": "#FF5722",  # Orange CTA
        "background": "#E8F5E9",
        "text": "#1B5E20"
    },
    "Sleep": {
        "primary": "#1565C0",  # Deep blue - calm, trust
        "secondary": "#64B5F6",
        "accent": "#7E57C2",  # Purple - dreams
        "background": "#E3F2FD",
        "text": "#0D47A1"
    },
    "Athletic Performance": {
        "primary": "#D32F2F",  # Red - energy, power
        "secondary": "#FF8A80",
        "accent": "#FFD600",  # Gold - victory
        "background": "#FFEBEE",
        "text": "#B71C1C"
    },
    "Energy": {
        "primary": "#FF6F00",  # Orange - energy
        "secondary": "#FFB74D",
        "accent": "#FFC107",  # Yellow - vitality
        "background": "#FFF3E0",
        "text": "#E65100"
    },
    "Focus & Attention": {
        "primary": "#0277BD",  # Blue - focus
        "secondary": "#4FC3F7",
        "accent": "#00E676",  # Green success
        "background": "#E1F5FE",
        "text": "#01579B"
    },
    "Mobility": {
        "primary": "#00897B",  # Teal - movement
        "secondary": "#80CBC4",
        "accent": "#FF7043",
        "background": "#E0F2F1",
        "text": "#004D40"
    },
    "Mood": {
        "primary": "#8E24AA",  # Purple - emotion
        "secondary": "#CE93D8",
        "accent": "#FFD54F",  # Yellow - happiness
        "background": "#F3E5F5",
        "text": "#4A148C"
    },
    "Stress": {
        "primary": "#5C6BC0",  # Indigo - calm
        "secondary": "#9FA8DA",
        "accent": "#26C6DA",  # Cyan - peace
        "background": "#E8EAF6",
        "text": "#283593"
    },
    "Immune Support": {
        "primary": "#388E3C",  # Green - health
        "secondary": "#A5D6A7",
        "accent": "#03A9F4",  # Blue - shield
        "background": "#E8F5E9",
        "text": "#1B5E20"
    },
    "Max RMR": {
        "primary": "#E64A19",  # Deep orange - fire
        "secondary": "#FF8A65",
        "accent": "#FFCA28",
        "background": "#FBE9E7",
        "text": "#BF360C"
    },
    "Will Power": {
        "primary": "#6A1B9A",  # Purple - determination
        "secondary": "#BA68C8",
        "accent": "#00E5FF",
        "background": "#F3E5F5",
        "text": "#4A148C"
    },
    "Beauty": {
        "primary": "#EC407A",  # Pink - beauty
        "secondary": "#F48FB1",
        "accent": "#FFD700",  # Gold
        "background": "#FCE4EC",
        "text": "#880E4F"
    },
    "Men's Health": {
        "primary": "#1976D2",  # Strong blue - masculinity
        "secondary": "#42A5F5",
        "accent": "#FF5722",
        "background": "#E3F2FD",
        "text": "#0D47A1"
    }
}


def load_products():
    """Load product data from JSON file."""
    with open(PRODUCTS_FILE, 'r') as f:
        return json.load(f)


def create_infographic_spec(product_key: str, product_data: dict) -> dict:
    """
    Create a detailed JSON specification for an enterprise-class infographic.
    """
    category = product_data['category']
    colors = COLOR_SCHEMES.get(category, COLOR_SCHEMES["Energy"])
    
    spec = {
        "metadata": {
            "product": product_data['name'],
            "category": category,
            "tagline": product_data['tagline'],
            "generated": datetime.now().isoformat(),
            "version": "2.0"
        },
        "design_system": {
            "colors": colors,
            "typography": {
                "headline": "Bold sans-serif, 48pt, white on primary color",
                "subheadline": "Semi-bold, 24pt, primary color",
                "body": "Regular, 14pt, text color",
                "step_numbers": "Extra bold, 36pt, accent color",
                "cta": "Bold, 18pt, white on accent"
            },
            "spacing": {
                "section_gap": "40px",
                "element_gap": "20px",
                "padding": "30px"
            }
        },
        "layout": {
            "type": "vertical_flow",
            "sections": [
                {
                    "name": "header",
                    "height": "15%",
                    "content": {
                        "logo_area": "Super Patch logo (top left)",
                        "product_name": product_data['name'],
                        "tagline": product_data['tagline']
                    }
                },
                {
                    "name": "problem_section",
                    "height": "20%",
                    "content": {
                        "title": "THE CHALLENGE",
                        "pain_points": [
                            f"Struggling with {category.lower()} issues?",
                            "Tired of temporary solutions?",
                            "Looking for drug-free alternatives?"
                        ],
                        "icon": "frustrated_person_icon"
                    }
                },
                {
                    "name": "solution_section",
                    "height": "25%",
                    "content": {
                        "title": f"THE {product_data['name'].upper()} SOLUTION",
                        "benefits": product_data['benefits'],
                        "key_differentiator": "100% Drug-Free • Non-Invasive • Vibrotactile Technology"
                    }
                },
                {
                    "name": "process_section",
                    "height": "30%",
                    "content": {
                        "title": "5 SIMPLE STEPS TO SUCCESS",
                        "steps": [
                            {"number": 1, "title": "CONNECT", "description": "Start with genuine rapport", "icon": "handshake"},
                            {"number": 2, "title": "DISCOVER", "description": f"Uncover their {category.lower()} challenges", "icon": "magnifying_glass"},
                            {"number": 3, "title": "PRESENT", "description": f"Show how {product_data['name']} helps", "icon": "presentation"},
                            {"number": 4, "title": "HANDLE", "description": "Address concerns confidently", "icon": "shield_check"},
                            {"number": 5, "title": "CLOSE", "description": "Ask for the commitment", "icon": "trophy"}
                        ],
                        "layout": "horizontal_flow_with_arrows"
                    }
                },
                {
                    "name": "cta_section",
                    "height": "10%",
                    "content": {
                        "cta_text": "START SELLING TODAY",
                        "supporting_text": f"Help customers experience {product_data['benefits'][0].lower()}"
                    }
                }
            ]
        },
        "visual_elements": {
            "icons": "modern flat icons with rounded corners",
            "arrows": "curved flow arrows between steps",
            "shapes": "rounded rectangles, soft shadows",
            "imagery": "abstract wellness imagery, no photorealistic people"
        },
        "accessibility": {
            "contrast_ratio": "minimum 4.5:1",
            "color_blindness": "use patterns in addition to color",
            "text_sizing": "minimum 12pt for all body text"
        }
    }
    
    return spec


def create_sales_process_spec(product_key: str, product_data: dict) -> dict:
    """
    Create a detailed JSON specification for a sales process flowchart.
    """
    category = product_data['category']
    colors = COLOR_SCHEMES.get(category, COLOR_SCHEMES["Energy"])
    
    spec = {
        "metadata": {
            "product": product_data['name'],
            "type": "sales_process_flowchart",
            "purpose": "Step-by-step sales conversation guide"
        },
        "design_system": {
            "colors": colors,
            "style": "modern flowchart with decision branches"
        },
        "flowchart": {
            "orientation": "top_to_bottom",
            "nodes": [
                {
                    "id": "start",
                    "type": "start_node",
                    "label": "START CONVERSATION",
                    "shape": "rounded_rectangle",
                    "color": "primary"
                },
                {
                    "id": "rapport",
                    "type": "action",
                    "label": "BUILD RAPPORT",
                    "description": "Smile, use their name, find common ground",
                    "script": "Hi! I love your energy today. How's your week going?",
                    "shape": "rectangle",
                    "color": "secondary"
                },
                {
                    "id": "discover",
                    "type": "action",
                    "label": "ASK DISCOVERY QUESTIONS",
                    "description": f"Uncover {category.lower()} pain points",
                    "script": f"Have you ever struggled with {category.lower()} challenges?",
                    "shape": "rectangle",
                    "color": "secondary"
                },
                {
                    "id": "decision_interested",
                    "type": "decision",
                    "label": "INTERESTED?",
                    "shape": "diamond",
                    "color": "accent",
                    "branches": {
                        "yes": "present",
                        "no": "handle_not_interested"
                    }
                },
                {
                    "id": "handle_not_interested",
                    "type": "objection",
                    "label": "HANDLE: 'NOT INTERESTED'",
                    "script": "I understand. Just curious - what would need to be different for this to be worth exploring?",
                    "shape": "hexagon",
                    "color": "accent"
                },
                {
                    "id": "present",
                    "type": "action",
                    "label": f"PRESENT {product_data['name'].upper()}",
                    "description": f"Share {', '.join(product_data['benefits'][:2])}",
                    "script": f"The {product_data['name']} patch uses vibrotactile technology to help with {product_data['benefits'][0].lower()}...",
                    "shape": "rectangle",
                    "color": "secondary"
                },
                {
                    "id": "decision_objection",
                    "type": "decision",
                    "label": "ANY OBJECTIONS?",
                    "shape": "diamond",
                    "color": "accent",
                    "branches": {
                        "price": "handle_price",
                        "think": "handle_think",
                        "spouse": "handle_spouse",
                        "none": "close"
                    }
                },
                {
                    "id": "handle_price",
                    "type": "objection",
                    "label": "HANDLE: 'TOO EXPENSIVE'",
                    "script": "I understand cost is important. What criteria beyond price matters most to you?",
                    "shape": "hexagon",
                    "color": "accent"
                },
                {
                    "id": "handle_think",
                    "type": "objection",
                    "label": "HANDLE: 'NEED TO THINK'",
                    "script": "Of course! What specific questions would help you decide?",
                    "shape": "hexagon",
                    "color": "accent"
                },
                {
                    "id": "handle_spouse",
                    "type": "objection",
                    "label": "HANDLE: 'ASK SPOUSE'",
                    "script": "Great idea! What concerns might they have that we could address now?",
                    "shape": "hexagon",
                    "color": "accent"
                },
                {
                    "id": "close",
                    "type": "action",
                    "label": "CLOSE THE SALE",
                    "description": "Use assumptive or alternative close",
                    "script": "Would you like to start with a single pack or save with the bundle?",
                    "shape": "rectangle",
                    "color": "primary"
                },
                {
                    "id": "success",
                    "type": "end_node",
                    "label": "SUCCESS! 🎉",
                    "description": "Schedule follow-up, ask for referrals",
                    "shape": "rounded_rectangle",
                    "color": "accent"
                }
            ],
            "connections": [
                {"from": "start", "to": "rapport"},
                {"from": "rapport", "to": "discover"},
                {"from": "discover", "to": "decision_interested"},
                {"from": "decision_interested", "to": "present", "label": "YES"},
                {"from": "decision_interested", "to": "handle_not_interested", "label": "NO"},
                {"from": "handle_not_interested", "to": "discover", "label": "RE-ENGAGE"},
                {"from": "present", "to": "decision_objection"},
                {"from": "decision_objection", "to": "handle_price", "label": "PRICE"},
                {"from": "decision_objection", "to": "handle_think", "label": "THINK"},
                {"from": "decision_objection", "to": "handle_spouse", "label": "SPOUSE"},
                {"from": "decision_objection", "to": "close", "label": "NONE"},
                {"from": "handle_price", "to": "close"},
                {"from": "handle_think", "to": "close"},
                {"from": "handle_spouse", "to": "close"},
                {"from": "close", "to": "success"}
            ]
        }
    }
    
    return spec


def generate_infographic_with_gemini(client, spec: dict, output_path: Path, infographic_type: str) -> bool:
    """
    Generate an enterprise-class infographic using Gemini's image generation.
    Uses nano-banana-pro-preview (Gemini 3 Pro Image) for best quality.
    """
    
    product = spec['metadata']['product']
    category = spec['metadata'].get('category', spec['metadata'].get('type', 'Sales'))
    colors = spec['design_system']['colors']
    
    if infographic_type == "overview":
        prompt = f"""Create a professional enterprise-grade sales infographic for "{product}" wellness patch.

DESIGN REQUIREMENTS (MUST FOLLOW):
- Clean, corporate design with strong visual hierarchy
- Use this color scheme: Primary {colors['primary']}, Secondary {colors['secondary']}, Accent {colors['accent']}, Background {colors['background']}
- Modern flat design style with soft shadows
- Sans-serif typography throughout
- Minimum 4.5:1 contrast ratio for accessibility

LAYOUT (TOP TO BOTTOM):
1. HEADER SECTION (15% of height):
   - Large bold title: "{product}" in white on {colors['primary']} banner
   - Tagline: "{spec['metadata']['tagline']}" in elegant script below

2. PROBLEM SECTION (20% of height):
   - Small heading: "THE CHALLENGE" 
   - 3 pain point icons with brief text
   - Use muted background

3. SOLUTION SECTION (25% of height):
   - Heading: "THE {product.upper()} SOLUTION"
   - 3 benefit cards with icons: {', '.join(spec['layout']['sections'][2]['content']['benefits'])}
   - Highlight text: "100% Drug-Free • Non-Invasive"

4. PROCESS SECTION (30% of height):
   - Heading: "5 STEPS TO SUCCESS"
   - Horizontal flow with 5 numbered circles connected by arrows:
     1. CONNECT (handshake icon)
     2. DISCOVER (magnifying glass)
     3. PRESENT (lightbulb)
     4. HANDLE (shield)
     5. CLOSE (trophy)
   - Each step has short description below

5. CTA SECTION (10% of height):
   - Bold button: "START SELLING TODAY" in {colors['accent']}
   - Supporting text below

STYLE: Corporate wellness, professional training material, easily scannable
FORMAT: Portrait orientation (3:4 aspect ratio)
NO: Photorealistic people, cluttered elements, gradients, stock photo look"""

    else:  # flowchart
        nodes = spec['flowchart']['nodes']
        connections = spec['flowchart']['connections']
        
        prompt = f"""Create a professional sales process flowchart infographic for "{product}" patch sales.

DESIGN REQUIREMENTS:
- Clean corporate flowchart style
- Color scheme: Primary {colors['primary']}, Secondary {colors['secondary']}, Accent {colors['accent']}
- Modern flat design with clear node shapes
- Easy to follow flow from top to bottom

FLOWCHART STRUCTURE:
Create a clear flowchart with these nodes (top to bottom):

START: "START CONVERSATION" (rounded rectangle, {colors['primary']})
  ↓
BOX: "BUILD RAPPORT" - "Smile, use name, find common ground"
  ↓
BOX: "ASK DISCOVERY QUESTIONS" - "Uncover pain points"
  ↓
DIAMOND: "INTERESTED?" (decision point in {colors['accent']})
  ↓ YES                    ↓ NO
BOX: "PRESENT {product.upper()}"    HEXAGON: "Handle 'Not Interested'"
  ↓                              (loops back to Discovery)
DIAMOND: "ANY OBJECTIONS?"
  ↓ branches to:
  - "Handle Price" (hexagon)
  - "Handle 'Need to Think'" (hexagon)
  - "Handle 'Ask Spouse'" (hexagon)
  All lead to:
  ↓
BOX: "CLOSE THE SALE" - "Assumptive or alternative close"
  ↓
END: "SUCCESS! 🎉" (rounded rectangle, {colors['accent']})

VISUAL REQUIREMENTS:
- Clear arrows connecting all nodes
- Color-coded by node type (action=secondary, decision=accent, objection=hexagon)
- Include brief script snippets in smaller text
- Legend showing node types

STYLE: Professional sales training flowchart, decision tree style
FORMAT: Portrait orientation (3:4 aspect ratio)
NO: Photorealistic images, complex backgrounds"""

    try:
        # Try nano-banana-pro-preview first (Gemini 3 Pro Image)
        try:
            response = client.models.generate_content(
                model='nano-banana-pro-preview',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_modalities=['IMAGE', 'TEXT'],
                )
            )
            
            # Extract image from response
            if response.candidates and response.candidates[0].content.parts:
                for part in response.candidates[0].content.parts:
                    if hasattr(part, 'inline_data') and part.inline_data:
                        image_data = part.inline_data.data
                        with open(output_path, 'wb') as f:
                            f.write(image_data)
                        print(f"✅ Created (Gemini 3 Pro): {output_path}")
                        return True
                        
        except Exception as e:
            print(f"⚠️ nano-banana-pro failed: {e}, trying Imagen 4 Ultra...")
        
        # Fallback to Imagen 4 Ultra
        response = client.models.generate_images(
            model='imagen-4.0-ultra-generate-001',
            prompt=prompt,
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
            print(f"✅ Created (Imagen 4 Ultra): {output_path}")
            return True
            
        return False
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate enterprise-class sales infographics')
    parser.add_argument('--product', type=str, help='Generate for specific product')
    parser.add_argument('--specs-only', action='store_true', help='Only generate JSON specs')
    parser.add_argument('--list', action='store_true', help='List products')
    args = parser.parse_args()
    
    # Load products
    print("📂 Loading product data...")
    products = load_products()
    
    if args.list:
        print("\n📋 Available Products:")
        for key, data in products.items():
            print(f"  - {key}: {data['name']} ({data['category']})")
        return
    
    # Create output directories
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    SPECS_DIR.mkdir(parents=True, exist_ok=True)
    
    # Determine which products to process
    if args.product:
        if args.product.lower() not in products:
            print(f"❌ Product '{args.product}' not found.")
            return
        products_to_process = {args.product.lower(): products[args.product.lower()]}
    else:
        products_to_process = products
    
    print(f"\n🚀 Processing {len(products_to_process)} product(s)...\n")
    
    # Generate specs and optionally images
    all_specs = {}
    
    for product_key, product_data in products_to_process.items():
        print(f"\n{'='*50}")
        print(f"📦 {product_data['name']} Patch ({product_data['category']})")
        print(f"{'='*50}")
        
        # Create overview spec
        overview_spec = create_infographic_spec(product_key, product_data)
        spec_path = SPECS_DIR / f"{product_data['name']}_Overview_Spec.json"
        with open(spec_path, 'w') as f:
            json.dump(overview_spec, f, indent=2)
        print(f"✅ Created spec: {spec_path}")
        
        # Create flowchart spec
        flowchart_spec = create_sales_process_spec(product_key, product_data)
        flowchart_spec_path = SPECS_DIR / f"{product_data['name']}_Flowchart_Spec.json"
        with open(flowchart_spec_path, 'w') as f:
            json.dump(flowchart_spec, f, indent=2)
        print(f"✅ Created spec: {flowchart_spec_path}")
        
        all_specs[product_key] = {
            'overview': overview_spec,
            'flowchart': flowchart_spec
        }
        
        if not args.specs_only:
            # Initialize client
            client = genai.Client(api_key=GEMINI_API_KEY)
            
            # Generate overview infographic
            print(f"\n🎨 Generating overview infographic...")
            overview_path = OUTPUT_DIR / f"{product_data['name']}_Overview_v2.png"
            generate_infographic_with_gemini(client, overview_spec, overview_path, "overview")
            
            # Generate flowchart
            print(f"🎨 Generating sales process flowchart...")
            flowchart_path = OUTPUT_DIR / f"{product_data['name']}_SalesProcess_v2.png"
            generate_infographic_with_gemini(client, flowchart_spec, flowchart_path, "flowchart")
    
    # Save master specs file
    master_spec_path = SPECS_DIR / "all_infographic_specs.json"
    with open(master_spec_path, 'w') as f:
        json.dump(all_specs, f, indent=2)
    print(f"\n✅ Master spec file: {master_spec_path}")
    
    print(f"\n{'='*50}")
    print("📊 GENERATION COMPLETE")
    print(f"{'='*50}")
    print(f"📁 Specs: {SPECS_DIR}")
    print(f"📁 Images: {OUTPUT_DIR}")


if __name__ == '__main__':
    main()
