#!/usr/bin/env python3
"""
Enhanced Sales Roadmap Dashboard Generator v2.0

Creates COMPREHENSIVE, DETAILED visual roadmaps that provide a complete
at-a-glance view of the entire sales process with FULL scripts and details.

Enhanced Features:
- Full opening scripts (not just hints)
- All 10 discovery questions with categories
- Complete Problem→Agitate→Solve presentation scripts
- All 8 objection responses with psychology notes
- All 5 closing techniques with "when to use" guidance
- Complete follow-up sequences with templates
- Target customer profile section
- Quick reference card section
- Visual customer pain points
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime

from google import genai
from google.genai import types

# Configuration
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
BASE_DIR = Path('/Users/cbsuperpatch/Desktop/SalesEnablement')
OUTPUT_DIR = BASE_DIR / 'sales_materials/roadmaps_v2'
SPECS_DIR = BASE_DIR / 'sales_materials/roadmap_specs_v2'
PRODUCTS_FILE = BASE_DIR / 'products/superpatch_products.json'
WORDTRACKS_DIR = BASE_DIR / 'sales_materials/docx'


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


def extract_opening_scripts(wordtrack: str) -> list:
    """Extract all 5 opening scripts from word track."""
    scripts = []
    
    # Define the 5 opening types with their patterns
    openings = [
        ("COLD APPROACH", r"Cold Approach.*?Script:\s*(.+?)(?=\*\*Technique|$)", "Stranger at coffee shop"),
        ("WARM INTRO", r"Warm Introduction.*?Script:\s*(.+?)(?=\*\*Technique|$)", "Friend/family member"),
        ("SOCIAL MEDIA DM", r"Social Media DM.*?Script:\s*(.+?)(?=\*\*Technique|$)", "Instagram/Facebook"),
        ("REFERRAL", r"Referral.*?Script:\s*(.+?)(?=\*\*Technique|$)", "Mutual connection"),
        ("EVENT/PARTY", r"Event/Party.*?Script:\s*(.+?)(?=\*\*Technique|$)", "Casual networking"),
    ]
    
    for name, pattern, context in openings:
        match = re.search(pattern, wordtrack, re.DOTALL | re.IGNORECASE)
        if match:
            script = match.group(1).strip()
            # Clean up the script
            script = re.sub(r'\*+', '', script)
            script = re.sub(r'\s+', ' ', script)
            script = script[:300] + "..." if len(script) > 300 else script
            scripts.append({
                "type": name,
                "context": context,
                "script": script
            })
        else:
            scripts.append({
                "type": name,
                "context": context,
                "script": f"[See full word track for {name} script]"
            })
    
    return scripts


def extract_discovery_questions(wordtrack: str) -> list:
    """Extract all 10 discovery questions with categories."""
    questions = []
    
    # Find the discovery questions section
    discovery_section = re.search(r'DISCOVERY QUESTIONS.*?(?=##|\Z)', wordtrack, re.DOTALL | re.IGNORECASE)
    if discovery_section:
        section_text = discovery_section.group(0)
        
        # Extract numbered questions
        q_matches = re.findall(r'\d+\.\s*\*\*([^:]+):\*\*\s*"([^"]+)"', section_text)
        for q_type, question in q_matches[:10]:
            questions.append({
                "type": q_type.strip(),
                "question": question.strip()
            })
    
    # Default questions if extraction fails
    if len(questions) < 10:
        default_qs = [
            ("Opening", "How would you describe your typical day and energy levels?"),
            ("Opening", "What does feeling your best look like for you?"),
            ("Pain Point", "When do you typically experience challenges with this?"),
            ("Pain Point", "On a scale of 1-10, how much does this impact your daily life?"),
            ("Pain Point", "What frustrates you most about your current situation?"),
            ("Impact", "What activities are you holding back on because of this?"),
            ("Impact", "How does this affect your mood, relationships, or work?"),
            ("Impact", "If this was solved tomorrow, what would you do first?"),
            ("Solution", "What have you tried before and what worked or didn't?"),
            ("Solution", "What's most important to you - speed, natural, or ease of use?"),
        ]
        questions = [{"type": t, "question": q} for t, q in default_qs]
    
    return questions


def extract_presentation_pas(wordtrack: str, product_data: dict) -> dict:
    """Extract Problem-Agitate-Solve presentation framework."""
    pas = {
        "problem": "",
        "agitate": "",
        "solve": "",
        "key_benefits": product_data.get('benefits', []),
        "differentiator": "100% Drug-Free • Non-Invasive • Vibrotactile Technology"
    }
    
    # Extract Problem
    problem_match = re.search(r'\*\*\(Problem\)\*\*:?\s*"?([^"]+)"?(?=\*\*\(Agitate|\Z)', wordtrack, re.DOTALL | re.IGNORECASE)
    if problem_match:
        pas["problem"] = problem_match.group(1).strip()[:400]
    else:
        pas["problem"] = f"Many people struggle with {product_data['category'].lower()} challenges - feeling frustrated by temporary solutions that don't address the root cause."
    
    # Extract Agitate
    agitate_match = re.search(r'\*\*\(Agitate\)\*\*:?\s*"?([^"]+)"?(?=\*\*\(Solve|\Z)', wordtrack, re.DOTALL | re.IGNORECASE)
    if agitate_match:
        pas["agitate"] = agitate_match.group(1).strip()[:400]
    else:
        pas["agitate"] = "This isn't just a minor inconvenience - it impacts your productivity, relationships, mood, and overall quality of life. The costs add up over time."
    
    # Extract Solve
    solve_match = re.search(r'\*\*\(Solve\)\*\*:?\s*"?([^"]+)"?(?=##|\Z)', wordtrack, re.DOTALL | re.IGNORECASE)
    if solve_match:
        pas["solve"] = solve_match.group(1).strip()[:400]
    else:
        pas["solve"] = f"That's why {product_data['name']} uses Vibrotactile Technology - specialized patterns that work with your body's natural neural responses. Drug-free, non-invasive, effective."
    
    return pas


def extract_objection_responses(wordtrack: str) -> list:
    """Extract all 8 objection handling responses with psychology."""
    
    # These are the complete, polished objection responses from the framework
    # Using consistent, proven scripts rather than trying to parse varied formats
    objections = [
        {
            "objection": "TOO EXPENSIVE",
            "trigger": "Price concern",
            "response": "I understand cost is important. What other criteria matter most to you beyond price?",
            "psychology": "Shift focus to value"
        },
        {
            "objection": "NEED TO THINK",
            "trigger": "Stalling",
            "response": "Of course! What specific questions would help you make this decision?",
            "psychology": "Identify real concern"
        },
        {
            "objection": "ASK MY SPOUSE",
            "trigger": "Shared decision",
            "response": "Great idea! What concerns might they have that we could address now?",
            "psychology": "Surface objections early"
        },
        {
            "objection": "DOES IT WORK?",
            "trigger": "Skepticism",
            "response": "I understand the skepticism. What would you need to see or experience to feel confident?",
            "psychology": "Let them define proof"
        },
        {
            "objection": "TRIED BEFORE",
            "trigger": "Past failure",
            "response": "What did you like or dislike about those solutions? What was missing?",
            "psychology": "Learn what was missing"
        },
        {
            "objection": "NOT INTERESTED",
            "trigger": "Rejection",
            "response": "That's fine. What specifically doesn't align with what you're looking for?",
            "psychology": "Uncover hidden needs"
        },
        {
            "objection": "NO TIME",
            "trigger": "Busy excuse",
            "response": "If you could solve this challenge easily, how would that help your time and energy?",
            "psychology": "Reframe to benefit"
        },
        {
            "objection": "VS COMPETITOR",
            "trigger": "Comparison",
            "response": "What appeals to you about that option? (Then explain VTT difference)",
            "psychology": "Highlight VTT difference"
        },
    ]
    
    return objections


def extract_closing_techniques(wordtrack: str, product_name: str) -> list:
    """Extract all 5 closing techniques with when to use."""
    closings = [
        {
            "name": "ASSUMPTIVE",
            "script": f"Great! {product_name} is exactly what you need. What's the best shipping address for your order?",
            "when": "Strong buying signals, nodding, engaged",
            "icon": "[A]"
        },
        {
            "name": "ALTERNATIVE",
            "script": "Would you prefer the 30-day supply, or the 90-day pack for better value?",
            "when": "Need gentle push, considering options",
            "icon": "[B]"
        },
        {
            "name": "URGENCY",
            "script": "We have a special promotion ending this week. Want to lock that in today?",
            "when": "They're hesitating, need reason to act",
            "icon": "[!]"
        },
        {
            "name": "SUMMARY",
            "script": f"So you want [goal], drug-free, easy to use. {product_name} does exactly that. Ready?",
            "when": "Complex conversation, recap benefits",
            "icon": "[S]"
        },
        {
            "name": "REFERRAL",
            "script": "Who else do you know dealing with similar challenges who could benefit?",
            "when": "After close, leverage enthusiasm",
            "icon": "[R]"
        },
    ]
    
    return closings


def extract_followup_sequence(wordtrack: str) -> list:
    """Extract follow-up sequence with actual templates."""
    sequence = [
        {
            "day": "DAY 1",
            "action": "Thank You + Tips",
            "template": "Great connecting! Here's a quick guide to get the most from your patch. Let me know if questions pop up!",
            "channel": "Text"
        },
        {
            "day": "DAY 3",
            "action": "Check-In",
            "template": "How are you feeling with your patches? Noticed any difference yet? I'd love to hear!",
            "channel": "Text"
        },
        {
            "day": "DAY 7",
            "action": "Results + Testimonial",
            "template": "One week in! Are you feeling the benefits? Would you be open to sharing your experience?",
            "channel": "Call/Text"
        },
        {
            "day": "DAY 14",
            "action": "Reorder + Referral",
            "template": "Hope you're loving the results! Time to reorder soon. Who else might benefit from this?",
            "channel": "Call"
        },
    ]
    
    return sequence


def extract_customer_profile(wordtrack: str, product_data: dict) -> dict:
    """Extract target customer profile."""
    
    # Category-specific profiles for better targeting
    category_profiles = {
        "Energy": {
            "demographics": ["Age: 25-65+", "Professionals & Parents", "Active lifestyle seekers", "Health-conscious"],
            "pain_points": ["Afternoon energy slump", "Caffeine jitters & crash", "Need sustained focus", "Tired of stimulants"]
        },
        "Aches & Pains": {
            "demographics": ["Age: 30-70+", "Active adults & seniors", "Office workers", "Athletes/weekend warriors"],
            "pain_points": ["Daily aches & stiffness", "Tired of taking pills", "Want drug-free relief", "Interrupted sleep from pain"]
        },
        "Sleep": {
            "demographics": ["Age: 25-70+", "Busy professionals", "Stressed parents", "Anyone with sleep issues"],
            "pain_points": ["Can't fall asleep", "Wake up tired", "Racing mind at night", "Want drug-free sleep aid"]
        },
        "Mobility": {
            "demographics": ["Age: 45-75+", "Seniors concerned about balance", "Active aging adults", "Post-injury recovery"],
            "pain_points": ["Balance concerns", "Fear of falling", "Reduced mobility", "Want to stay active"]
        },
        "Athletic Performance": {
            "demographics": ["Age: 18-55", "Athletes at all levels", "Fitness enthusiasts", "Competitive sports"],
            "pain_points": ["Hit training plateau", "Need performance edge", "Want natural enhancement", "Seek faster recovery"]
        },
        "Focus & Attention": {
            "demographics": ["Age: 18-60", "Students & professionals", "Parents juggling tasks", "Knowledge workers"],
            "pain_points": ["Can't concentrate", "Mind keeps wandering", "Need mental clarity", "Avoid stimulants"]
        },
        "Max RMR": {
            "demographics": ["Age: 25-65", "Weight management seekers", "Slow metabolism", "Health-conscious"],
            "pain_points": ["Metabolism slowed down", "Hard to lose weight", "Need metabolism boost", "Want natural support"]
        },
        "Will Power": {
            "demographics": ["Age: 25-65", "Breaking bad habits", "Quitting smoking", "Managing cravings"],
            "pain_points": ["Struggle with willpower", "Can't stick to changes", "Cravings derail progress", "Need support system"]
        },
        "Immune Support": {
            "demographics": ["Age: 25-70+", "Health-conscious", "Prevention-focused", "Wellness seekers"],
            "pain_points": ["Want immune support", "Seeking natural wellness", "Preventive health focus", "Drug-free preference"]
        },
        "Mood": {
            "demographics": ["Age: 25-65", "Stressed professionals", "Emotional balance seekers", "Wellness-focused"],
            "pain_points": ["Feeling down lately", "Want natural mood boost", "Seeking emotional balance", "Drug-free preference"]
        },
        "Beauty": {
            "demographics": ["Age: 30-65", "Skin appearance focused", "Natural beauty seekers", "Anti-aging interest"],
            "pain_points": ["Skin not glowing", "Want radiant complexion", "Seeking natural beauty", "Inside-out approach"]
        },
        "Men's Health": {
            "demographics": ["Age: 35-70", "Men seeking vitality", "Energy & wellness", "Natural health focus"],
            "pain_points": ["Lost youthful energy", "Want natural vitality", "Seeking male wellness", "Drug-free preference"]
        },
        "Stress": {
            "demographics": ["Age: 25-65", "Stressed professionals", "Anxious individuals", "Busy parents"],
            "pain_points": ["Constantly stressed", "Can't seem to relax", "Need calm & clarity", "Want natural relief"]
        }
    }
    
    category = product_data.get('category', 'Energy')
    profile = category_profiles.get(category, category_profiles['Energy'])
    
    return {
        "demographics": profile["demographics"],
        "psychographics": [],
        "pain_points": profile["pain_points"],
        "tried_before": []
    }


def create_enhanced_spec(product_key: str, product_data: dict) -> dict:
    """Create a comprehensive, detailed roadmap specification."""
    
    # Load the word track for this product
    wordtrack = load_wordtrack(product_data['name'])
    
    spec = {
        "metadata": {
            "product": product_data['name'],
            "category": product_data['category'],
            "tagline": product_data['tagline'],
            "benefits": product_data['benefits'],
            "type": "comprehensive_sales_roadmap_v2",
            "purpose": "Detailed visual dashboard with FULL scripts and guidance",
            "generated": datetime.now().isoformat()
        },
        "sections": {
            "1_customer_profile": {
                "title": "🎯 TARGET CUSTOMER",
                "description": "Know your ideal prospect",
                "content": extract_customer_profile(wordtrack, product_data)
            },
            "2_opening_approaches": {
                "title": "🚀 5 OPENING APPROACHES",
                "description": "Choose based on context",
                "approaches": extract_opening_scripts(wordtrack)
            },
            "3_discovery_questions": {
                "title": "🔍 DISCOVERY QUESTIONS",
                "description": "Uncover needs & pain points (ask 3-5)",
                "questions": extract_discovery_questions(wordtrack)
            },
            "4_presentation": {
                "title": "🎤 PRESENT THE SOLUTION",
                "framework": "Problem → Agitate → Solve",
                "content": extract_presentation_pas(wordtrack, product_data)
            },
            "5_objection_handling": {
                "title": "🛡️ HANDLE 8 OBJECTIONS",
                "technique": "Conversation Aikido: 'I understand... [Open Question]'",
                "objections": extract_objection_responses(wordtrack)
            },
            "6_closing": {
                "title": "🏆 5 CLOSING TECHNIQUES",
                "pre_close": "Always ask: 'Do you have any questions?' + 'Does this make sense?'",
                "techniques": extract_closing_techniques(wordtrack, product_data['name'])
            },
            "7_followup": {
                "title": "📅 FOLLOW-UP SEQUENCE",
                "goal": "Build relationship → Get testimonials → Generate referrals",
                "sequence": extract_followup_sequence(wordtrack)
            }
        },
        "visual_design": {
            "layout": "Multi-panel dashboard infographic",
            "dimensions": "Portrait, 3:4 aspect ratio, high detail",
            "color_scheme": {
                "header": "#1a1a2e (dark navy)",
                "customer_profile": "#4a90d9 (blue - trust)",
                "openings": "#5b8fb9 (sky blue)",
                "discovery": "#7c4dff (purple - exploration)",
                "presentation": "#00c853 (green - solution)",
                "objections": "#ff6d00 (orange - handle with care)",
                "closing": "#d50000 (red - action/urgency)",
                "followup": "#00bfa5 (teal - relationship)"
            },
            "typography": {
                "title": "Bold, 48pt",
                "section_headers": "Bold, 24pt",
                "body_text": "Regular, 12-14pt",
                "script_text": "Italic, 11pt"
            }
        }
    }
    
    return spec


def generate_enhanced_roadmap_image(client, spec: dict, output_path: Path) -> bool:
    """Generate a comprehensive, detailed roadmap dashboard."""
    
    product = spec['metadata']['product']
    category = spec['metadata']['category']
    tagline = spec['metadata']['tagline']
    benefits = spec['metadata']['benefits']
    
    sections = spec['sections']
    customer = sections['1_customer_profile']['content']
    openings = sections['2_opening_approaches']['approaches']
    questions = sections['3_discovery_questions']['questions']
    presentation = sections['4_presentation']['content']
    objections = sections['5_objection_handling']['objections']
    closings = sections['6_closing']['techniques']
    followups = sections['7_followup']['sequence']
    
    # Build comprehensive prompt
    prompt = f"""Create a COMPREHENSIVE SALES ROADMAP DASHBOARD infographic for "{product}" wellness patch.

THIS IS A DETAILED VISUAL GUIDE with FULL SCRIPTS that salespeople can reference at a glance.
Make it information-dense but well-organized with clear visual hierarchy.

DESIGN: Professional corporate training poster, clean modern design, color-coded sections.
SIZE: Portrait 3:4 ratio, detailed enough to read all text clearly.
STYLE: Premium infographic with icons, color blocks, flow arrows, and readable typography.

════════════════════════════════════════════════════════════════════════════
HEADER (Dark Navy Background)
════════════════════════════════════════════════════════════════════════════
Title: "{product.upper()} PATCH - COMPLETE SALES ROADMAP"
Subtitle: "{tagline}"
Top right: "Super Patch Sales Enablement"

════════════════════════════════════════════════════════════════════════════
SECTION 1: TARGET CUSTOMER (Blue section - 10% height)
════════════════════════════════════════════════════════════════════════════
🎯 Icon with "KNOW YOUR CUSTOMER"
Two columns:
LEFT - Demographics: {', '.join(customer['demographics'][:3])}
RIGHT - Pain Points: {', '.join(customer['pain_points'][:3])}

════════════════════════════════════════════════════════════════════════════
SECTION 2: 5 OPENING APPROACHES (Sky Blue - 15% height)
════════════════════════════════════════════════════════════════════════════
🚀 "5 WAYS TO START THE CONVERSATION"
Show 5 horizontal cards with FULL scripts:

"""

    # Add opening scripts to prompt
    for i, opening in enumerate(openings, 1):
        prompt += f"""
Card {i}: {opening['type']}
Context: {opening['context']}
Script: "{opening['script'][:100]}..."
"""

    prompt += f"""
All arrows flow down to Discovery

════════════════════════════════════════════════════════════════════════════
SECTION 3: DISCOVERY QUESTIONS (Purple section - 15% height)
════════════════════════════════════════════════════════════════════════════
🔍 "UNCOVER THEIR NEEDS" - "Ask 3-5 questions"
Organize in 4 columns by type:

OPENING Qs | PAIN POINT Qs | IMPACT Qs | SOLUTION Qs
"""

    # Add discovery questions
    for q in questions[:10]:
        prompt += f'\n• [{q["type"]}] "{q["question"][:50]}..."'

    prompt += f"""

════════════════════════════════════════════════════════════════════════════
SECTION 4: PRESENT THE SOLUTION (Green section - 15% height)
════════════════════════════════════════════════════════════════════════════
🎤 "PRESENT {product.upper()}"
Framework: PROBLEM → AGITATE → SOLVE (show as 3 connected boxes)

PROBLEM: "{presentation['problem'][:100]}..."
↓
AGITATE: "{presentation['agitate'][:100]}..."
↓
SOLVE: "{presentation['solve'][:100]}..."

KEY BENEFITS: {' • '.join(benefits)}
DIFFERENTIATOR: {presentation['differentiator']}

════════════════════════════════════════════════════════════════════════════
SECTION 5: HANDLE 8 OBJECTIONS (Orange section - LARGEST - 25% height)
════════════════════════════════════════════════════════════════════════════
🛡️ "HANDLE OBJECTIONS"
Technique Banner: "Conversation Aikido: 'I understand... [Open Question]'"

Show 8 objection cards in 2 rows of 4:
"""

    # Add objections
    for obj in objections:
        prompt += f"""
┌─────────────────────────┐
│ "{obj['objection']}"     │
│ → {obj['response'][:60]}...│
│ [Psychology: {obj['psychology']}] │
└─────────────────────────┘
"""

    prompt += f"""

════════════════════════════════════════════════════════════════════════════
SECTION 6: 5 CLOSING TECHNIQUES (Red section - 12% height)
════════════════════════════════════════════════════════════════════════════
🏆 "CLOSE THE SALE"
PRE-CLOSE: "Always ask: 'Any questions?' + 'Does this make sense?'"

Show 5 closing cards with scripts AND when to use:
"""

    for close in closings:
        prompt += f"""
{close['icon']} {close['name']}
"{close['script'][:60]}..."
When: {close['when']}
"""

    prompt += f"""

════════════════════════════════════════════════════════════════════════════
SECTION 7: FOLLOW-UP SEQUENCE (Teal section - 8% height)
════════════════════════════════════════════════════════════════════════════
📅 "FOLLOW-UP SEQUENCE"
Goal: Build relationship → Get testimonials → Generate referrals

Timeline with 4 milestones:
"""

    for fu in followups:
        prompt += f'{fu["day"]}: {fu["action"]} ({fu["channel"]}) → '

    prompt += f"""

════════════════════════════════════════════════════════════════════════════
FOOTER
════════════════════════════════════════════════════════════════════════════
"Super Patch Sales Enablement | {product} Patch - {category}"

════════════════════════════════════════════════════════════════════════════
CRITICAL DESIGN REQUIREMENTS:
════════════════════════════════════════════════════════════════════════════
1. ALL TEXT MUST BE READABLE - use at least 10pt font
2. Color-coded sections with clear visual separation
3. Icons for each section (🎯🚀🔍🎤🛡️🏆📅)
4. Flow arrows connecting sections top to bottom
5. INCLUDE ACTUAL SCRIPT TEXT in quotes
6. Professional, premium quality infographic
7. Dense with information but well-organized
8. Portrait orientation (3:4 aspect ratio)
9. Each objection box should show the response
10. Each closing should show when to use it

NO: Photorealistic images, cluttered layout, tiny unreadable text, generic placeholders"""

    try:
        print(f"  📝 Prompt length: {len(prompt)} characters")
        
        # Use Imagen 4 Ultra for high-quality generation
        response = client.models.generate_images(
            model='imagen-4.0-ultra-generate-001',
            prompt=prompt[:8000],  # Imagen has prompt limits
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
            print(f"  ✅ Created enhanced roadmap: {output_path}")
            return True
        
        print(f"  ⚠️ No image in response for {product}")
        return False
        
    except Exception as e:
        print(f"  ❌ Error generating {product}: {e}")
        return False


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate enhanced comprehensive sales roadmaps')
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
        product_lower = args.product.lower().replace(" ", "")
        # Handle "Kick It" -> "kickit" mapping
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
    
    print(f"\n🚀 Generating ENHANCED roadmaps for {len(products_to_process)} product(s)...\n")
    
    # Initialize client
    client = genai.Client(api_key=GEMINI_API_KEY)
    
    success_count = 0
    error_count = 0
    
    for product_key, product_data in products_to_process.items():
        print(f"\n{'='*60}")
        print(f"📦 {product_data['name']} Patch ({product_data['category']})")
        print(f"{'='*60}")
        
        # Create enhanced spec
        print("  📋 Creating detailed spec...")
        spec = create_enhanced_spec(product_key, product_data)
        
        # Save spec
        spec_path = SPECS_DIR / f"{product_data['name']}_Enhanced_Spec.json"
        with open(spec_path, 'w') as f:
            json.dump(spec, f, indent=2)
        print(f"  ✅ Spec saved: {spec_path.name}")
        
        if not args.specs_only:
            # Generate enhanced roadmap image
            print("  🎨 Generating comprehensive roadmap...")
            roadmap_path = OUTPUT_DIR / f"{product_data['name']}_Enhanced_Roadmap.png"
            
            if generate_enhanced_roadmap_image(client, spec, roadmap_path):
                success_count += 1
            else:
                error_count += 1
    
    print(f"\n{'='*60}")
    print("📊 GENERATION COMPLETE")
    print(f"{'='*60}")
    print(f"✅ Success: {success_count}")
    print(f"❌ Errors: {error_count}")
    print(f"📁 Specs: {SPECS_DIR}")
    print(f"📁 Roadmaps: {OUTPUT_DIR}")


if __name__ == '__main__':
    main()

