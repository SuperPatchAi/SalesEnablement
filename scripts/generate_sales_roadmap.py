#!/usr/bin/env python3
"""
Sales Roadmap Dashboard Generator

Creates comprehensive visual roadmaps/decision trees that map the ENTIRE
word track for each Super Patch product - a complete sales process dashboard
that salespeople can follow from first contact to close.

Includes:
- All 5 opening approaches
- 10 discovery questions flow
- Presentation framework
- All 8 objection handling branches
- All 5 closing techniques
- Follow-up sequence
"""

import os
import json
from pathlib import Path
from datetime import datetime

from google import genai
from google.genai import types

# Configuration
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyCg5Q8EYqYy54xmFq31Dv1iGmbXixsBb4w')
OUTPUT_DIR = Path('/workspace/sales_materials/roadmaps')
SPECS_DIR = Path('/workspace/sales_materials/roadmap_specs')
PRODUCTS_FILE = Path('/workspace/products/superpatch_products.json')
WORDTRACKS_DIR = Path('/workspace/sales_materials/docx')


def load_products():
    """Load product data from JSON file."""
    with open(PRODUCTS_FILE, 'r') as f:
        return json.load(f)


def load_wordtrack(product_name: str) -> str:
    """Load the markdown word track for a product."""
    md_path = WORDTRACKS_DIR / f"{product_name}_WordTrack.md"
    if md_path.exists():
        with open(md_path, 'r') as f:
            return f.read()
    return ""


def create_roadmap_spec(product_key: str, product_data: dict) -> dict:
    """
    Create a comprehensive roadmap specification covering the entire sales process.
    """
    
    spec = {
        "metadata": {
            "product": product_data['name'],
            "category": product_data['category'],
            "tagline": product_data['tagline'],
            "type": "complete_sales_roadmap",
            "purpose": "Visual dashboard of entire sales process from contact to close"
        },
        "roadmap_sections": {
            "1_opening_approaches": {
                "title": "OPENING APPROACHES",
                "description": "5 ways to start the conversation",
                "branches": [
                    {"id": "cold", "label": "COLD APPROACH", "script_hint": "Hi! I noticed... How's your day?"},
                    {"id": "warm", "label": "WARM INTRO", "script_hint": "Hey [Name]! I was thinking about you..."},
                    {"id": "social", "label": "SOCIAL MEDIA DM", "script_hint": "Loved your post about..."},
                    {"id": "referral", "label": "REFERRAL", "script_hint": "[Friend] suggested I reach out..."},
                    {"id": "event", "label": "EVENT/PARTY", "script_hint": "Great event! What brings you here?"}
                ],
                "all_lead_to": "discovery"
            },
            "2_discovery": {
                "title": "DISCOVERY QUESTIONS",
                "description": "Uncover pain points and needs",
                "question_flow": [
                    {"type": "opening", "questions": ["How would you describe your energy levels?", "What does feeling your best look like?"]},
                    {"type": "pain_point", "questions": ["Where do you feel discomfort most?", "How often does this happen?", "Scale 1-10, how much does it impact you?"]},
                    {"type": "impact", "questions": ["What activities are you avoiding?", "How does this affect your sleep/mood?", "If this was solved, what would you do first?"]},
                    {"type": "solution", "questions": ["What have you tried before?", "What's most important - speed, drug-free, or ease?"]}
                ],
                "leads_to": "presentation"
            },
            "3_presentation": {
                "title": "PRESENT THE SOLUTION",
                "framework": "Problem → Agitate → Solve",
                "steps": [
                    {"step": "PROBLEM", "content": f"Many people struggle with {product_data['category'].lower()} challenges..."},
                    {"step": "AGITATE", "content": "Think about what it costs you - missed moments, frustration..."},
                    {"step": "SOLVE", "content": f"That's why {product_data['name']} uses Vibrotactile Technology..."}
                ],
                "key_points": product_data['benefits'],
                "differentiator": "100% Drug-Free • Non-Invasive • Works with your body",
                "leads_to": "objection_check"
            },
            "4_objection_handling": {
                "title": "HANDLE OBJECTIONS",
                "technique": "Conversation Aikido: 'I understand... [Open Question]'",
                "objections": [
                    {
                        "objection": "TOO EXPENSIVE",
                        "response": "I understand cost is important. What other criteria matter most to you beyond price?",
                        "psychology": "Shift focus to value"
                    },
                    {
                        "objection": "NEED TO THINK",
                        "response": "Of course! What specific questions would help you decide?",
                        "psychology": "Identify real concern"
                    },
                    {
                        "objection": "ASK MY SPOUSE",
                        "response": "Great idea! What concerns might they have we could address now?",
                        "psychology": "Surface objections early"
                    },
                    {
                        "objection": "DOES IT WORK?",
                        "response": "I understand the skepticism. What would you need to see or experience to feel confident?",
                        "psychology": "Let them define proof"
                    },
                    {
                        "objection": "TRIED BEFORE",
                        "response": "What did you like/dislike about those? What was missing?",
                        "psychology": "Learn from past failures"
                    },
                    {
                        "objection": "NOT INTERESTED",
                        "response": "That's fine. What specifically doesn't align with what you're looking for?",
                        "psychology": "Uncover hidden needs"
                    },
                    {
                        "objection": "NO TIME",
                        "response": "If you could reduce discomfort easily, how would that help your time and energy?",
                        "psychology": "Reframe to benefit"
                    },
                    {
                        "objection": "VS COMPETITOR",
                        "response": "What appeals to you about [competitor]? (Then explain VTT difference)",
                        "psychology": "Understand their criteria"
                    }
                ],
                "all_lead_to": "closing"
            },
            "5_closing": {
                "title": "CLOSE THE SALE",
                "pre_close": "Do you have any questions? Does this make sense?",
                "techniques": [
                    {
                        "name": "ASSUMPTIVE",
                        "script": "Would you like to start with a single pack or save with the bundle?",
                        "when": "Strong buying signals"
                    },
                    {
                        "name": "ALTERNATIVE",
                        "script": "Would you prefer to pick it up today or have it shipped?",
                        "when": "Need gentle push"
                    },
                    {
                        "name": "URGENCY",
                        "script": "We have a special this week. Want to lock that in?",
                        "when": "They're hesitating"
                    },
                    {
                        "name": "SUMMARY",
                        "script": "So you want relief from X, without drugs, easily. [Product] does all that. Ready to try it?",
                        "when": "Complex conversation"
                    },
                    {
                        "name": "REFERRAL",
                        "script": "Who else do you know dealing with similar challenges?",
                        "when": "After successful close"
                    }
                ],
                "leads_to": "follow_up"
            },
            "6_follow_up": {
                "title": "FOLLOW-UP SEQUENCE",
                "sequence": [
                    {"day": 1, "action": "Thank you message + usage tips"},
                    {"day": 3, "action": "Check-in: How are you feeling?"},
                    {"day": 7, "action": "Results check + testimonial request"},
                    {"day": 14, "action": "Reorder reminder + referral ask"}
                ],
                "goal": "Build relationship, get testimonials, generate referrals"
            }
        },
        "visual_layout": {
            "format": "Top-to-bottom flowchart with horizontal branches",
            "sections_flow": "Opening → Discovery → Present → Objections → Close → Follow-up",
            "color_coding": {
                "openings": "Blue (trust)",
                "discovery": "Purple (exploration)",
                "presentation": "Green (solution)",
                "objections": "Orange (caution/handle)",
                "closing": "Red (action/urgency)",
                "follow_up": "Teal (relationship)"
            }
        }
    }
    
    return spec


def generate_roadmap_image(client, spec: dict, product_data: dict, output_path: Path) -> bool:
    """
    Generate a comprehensive sales roadmap dashboard using Nano Banana Pro.
    """
    
    product = spec['metadata']['product']
    category = spec['metadata']['category']
    sections = spec['roadmap_sections']
    
    # Build comprehensive prompt for full roadmap
    prompt = f"""Create a comprehensive SALES ROADMAP DASHBOARD infographic for "{product}" patch sales.

THIS IS A COMPLETE VISUAL GUIDE showing the ENTIRE sales process from first contact to follow-up.
Design it as a professional flowchart/decision tree that salespeople can follow step-by-step.

LAYOUT: Vertical flow with horizontal branches at each stage
SIZE: Detailed enough to read all text clearly
STYLE: Professional corporate training material, clean modern design

═══════════════════════════════════════════════════════════════
SECTION 1: OPENING APPROACHES (Top - Blue section)
═══════════════════════════════════════════════════════════════
Title: "5 WAYS TO START"
Show 5 boxes branching horizontally, all flowing down to Discovery:

┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ COLD        │ │ WARM        │ │ SOCIAL DM   │ │ REFERRAL    │ │ EVENT       │
│ "Hi! I      │ │ "Hey! Was   │ │ "Loved your │ │ "[Name]     │ │ "Great      │
│ noticed..." │ │ thinking    │ │ post..."    │ │ suggested   │ │ party!..."  │
│             │ │ of you..."  │ │             │ │ I call..."  │ │             │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       └───────────────┴───────────────┴───────────────┴───────────────┘
                                       ▼

═══════════════════════════════════════════════════════════════
SECTION 2: DISCOVERY QUESTIONS (Purple section)
═══════════════════════════════════════════════════════════════
Title: "DISCOVER THEIR NEEDS"
Show question flow in 4 columns:

Opening Qs → Pain Point Qs → Impact Qs → Solution Qs
"Energy      "Where does    "What are    "What have
levels?"     it hurt?"      you avoiding?" you tried?"

                                       ▼

═══════════════════════════════════════════════════════════════
SECTION 3: PRESENTATION (Green section)
═══════════════════════════════════════════════════════════════
Title: "PRESENT {product.upper()}"
Framework: PROBLEM → AGITATE → SOLVE

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ PROBLEM         │ → │ AGITATE         │ → │ SOLVE           │
│ "Many struggle  │    │ "Think what it  │    │ "{product} uses │
│ with {category.lower()}..."│    │ costs you..."   │    │ VTT technology" │
└─────────────────┘    └─────────────────┘    └─────────────────┘

Key Benefits: {', '.join(product_data['benefits'])}
"100% Drug-Free • Non-Invasive"
                                       ▼

═══════════════════════════════════════════════════════════════
SECTION 4: OBJECTION HANDLING (Orange section - LARGEST)
═══════════════════════════════════════════════════════════════
Title: "HANDLE OBJECTIONS"
Technique: "I understand... [Open Question]"

Show 8 objection boxes in 2 rows of 4, each with response:

Row 1:
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ "TOO         │ │ "NEED TO     │ │ "ASK         │ │ "DOES IT     │
│ EXPENSIVE"   │ │ THINK"       │ │ SPOUSE"      │ │ WORK?"       │
│              │ │              │ │              │ │              │
│ → What other │ │ → What Qs    │ │ → What       │ │ → What would │
│ criteria?    │ │ would help?  │ │ concerns?    │ │ convince you?│
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

Row 2:
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ "TRIED       │ │ "NOT         │ │ "NO TIME"    │ │ "VS          │
│ BEFORE"      │ │ INTERESTED"  │ │              │ │ COMPETITOR"  │
│              │ │              │ │              │ │              │
│ → What was   │ │ → What       │ │ → How would  │ │ → What       │
│ missing?     │ │ doesn't fit? │ │ relief help? │ │ appeals?     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
                                       ▼

═══════════════════════════════════════════════════════════════
SECTION 5: CLOSING TECHNIQUES (Red section)
═══════════════════════════════════════════════════════════════
Title: "CLOSE THE SALE"
Pre-close: "Any questions? Does this make sense?"

Show 5 closing techniques horizontally:

┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ ASSUMPTIVE  │ │ ALTERNATIVE │ │ URGENCY     │ │ SUMMARY     │ │ REFERRAL    │
│ "Single or  │ │ "Pick up or │ │ "Special    │ │ "So you     │ │ "Who else   │
│ bundle?"    │ │ ship?"      │ │ this week"  │ │ want X..."  │ │ needs this?"│
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
                                       ▼

═══════════════════════════════════════════════════════════════
SECTION 6: FOLLOW-UP (Teal section)
═══════════════════════════════════════════════════════════════
Title: "FOLLOW-UP SEQUENCE"
Timeline showing: Day 1 → Day 3 → Day 7 → Day 14
                 Thank you  Check-in  Results  Reorder

═══════════════════════════════════════════════════════════════

DESIGN REQUIREMENTS:
- Professional corporate training poster style
- Clear visual hierarchy with numbered sections
- Color-coded sections (Blue→Purple→Green→Orange→Red→Teal)
- All text must be readable
- Arrows showing flow between sections
- Each box should have the script snippet visible
- Portrait orientation (3:4 ratio) - like a training poster
- Title at top: "{product} PATCH - COMPLETE SALES ROADMAP"
- Footer: "Super Patch Sales Enablement"

NO: Photorealistic images, cluttered design, tiny unreadable text"""

    try:
        # Use nano-banana-pro-preview (Gemini 3 Pro Image)
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
                    print(f"✅ Created roadmap: {output_path}")
                    return True
        
        print(f"⚠️ No image in response for {product}")
        return False
        
    except Exception as e:
        print(f"❌ Error: {e}")
        
        # Fallback to Imagen 4 Ultra with simpler prompt
        try:
            simple_prompt = f"""Create a professional SALES PROCESS ROADMAP poster for "{product}" wellness patch.

Design a vertical flowchart showing the complete sales journey:

1. TOP: "5 OPENING APPROACHES" (5 blue boxes: Cold, Warm, Social, Referral, Event)
   ↓
2. "DISCOVERY QUESTIONS" (purple section with question types)
   ↓
3. "PRESENT SOLUTION" (green: Problem→Agitate→Solve framework)
   ↓
4. "HANDLE 8 OBJECTIONS" (orange grid: Price, Think, Spouse, Works?, Tried, Not Interested, No Time, Competitor)
   ↓
5. "5 CLOSING TECHNIQUES" (red boxes: Assumptive, Alternative, Urgency, Summary, Referral)
   ↓
6. "FOLLOW-UP" (teal timeline: Day 1, 3, 7, 14)

Style: Corporate training poster, color-coded sections, professional flowchart
Include brief script hints in each box
Title: "{product} PATCH - SALES ROADMAP"
Portrait orientation, readable text, clean modern design"""

            response = client.models.generate_images(
                model='imagen-4.0-ultra-generate-001',
                prompt=simple_prompt,
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
                print(f"✅ Created roadmap (Imagen): {output_path}")
                return True
                
        except Exception as e2:
            print(f"❌ Fallback also failed: {e2}")
            
        return False


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate complete sales roadmap dashboards')
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
    
    print(f"\n🚀 Generating roadmaps for {len(products_to_process)} product(s)...\n")
    
    # Initialize client
    client = genai.Client(api_key=GEMINI_API_KEY)
    
    for product_key, product_data in products_to_process.items():
        print(f"\n{'='*50}")
        print(f"📦 {product_data['name']} Patch")
        print(f"{'='*50}")
        
        # Create roadmap spec
        spec = create_roadmap_spec(product_key, product_data)
        spec_path = SPECS_DIR / f"{product_data['name']}_Roadmap_Spec.json"
        with open(spec_path, 'w') as f:
            json.dump(spec, f, indent=2)
        print(f"✅ Spec: {spec_path}")
        
        if not args.specs_only:
            # Generate roadmap image
            print(f"🎨 Generating complete sales roadmap...")
            roadmap_path = OUTPUT_DIR / f"{product_data['name']}_Sales_Roadmap.png"
            generate_roadmap_image(client, spec, product_data, roadmap_path)
    
    print(f"\n{'='*50}")
    print("📊 GENERATION COMPLETE")
    print(f"{'='*50}")
    print(f"📁 Specs: {SPECS_DIR}")
    print(f"📁 Roadmaps: {OUTPUT_DIR}")


if __name__ == '__main__':
    main()
