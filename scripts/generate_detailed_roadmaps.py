#!/usr/bin/env python3
"""
DETAILED "Dummy Proof" Sales Roadmap Generator v5.0

Creates COMPREHENSIVE infographics with FULL WORD-FOR-WORD SCRIPTS
that a sales rep can read directly from the roadmap.

Uses Nano Banana Pro (gemini-3-pro-image-preview) for 4K quality.
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
    raise ValueError("GEMINI_API_KEY environment variable required")

BASE_DIR = Path('/Users/cbsuperpatch/Desktop/SalesEnablement')
OUTPUT_DIR = BASE_DIR / 'sales_materials/roadmaps_detailed'
WORDTRACK_DIR = BASE_DIR / 'sales_materials/docx'
PRODUCTS_FILE = BASE_DIR / 'products/superpatch_products.json'


def load_products():
    with open(PRODUCTS_FILE, 'r') as f:
        return json.load(f)


def load_wordtrack(product_name: str) -> str:
    """Load the full wordtrack content."""
    wordtrack_path = WORDTRACK_DIR / f"{product_name}_WordTrack.md"
    if wordtrack_path.exists():
        with open(wordtrack_path, 'r') as f:
            return f.read()
    return ""


def build_detailed_prompt(product_name: str, category: str, tagline: str, benefits: list, wordtrack: str) -> str:
    """
    Build a SUPER DETAILED prompt with complete scripts from the wordtrack.
    """
    
    prompt = f'''Create a LARGE, HIGHLY DETAILED professional sales training poster infographic for "{product_name}" wellness patch.

THIS MUST BE A COMPREHENSIVE "CHEAT SHEET" - Sales reps should be able to READ THE EXACT WORDS TO SAY directly from this poster.

===========================================
DESIGN SPECIFICATIONS
===========================================
- Size: LARGE poster format (portrait orientation)
- Style: Clean corporate training document with color-coded sections
- Text: ALL TEXT MUST BE CLEARLY READABLE - use appropriate font sizes
- Colors: Use distinct colors for each of the 7 sections
- Layout: Dense with information but organized with clear visual hierarchy

===========================================
HEADER (Dark Navy #1a1a2e)
===========================================
TITLE: "{product_name.upper()} PATCH"
SUBTITLE: "COMPLETE SALES ROADMAP"
TAGLINE: "{tagline}"
CORNER: "Super Patch Sales Enablement"

===========================================
SECTION 1: TARGET CUSTOMER (Blue #4a90d9)
===========================================
HEADER: "🎯 WHO TO TALK TO"

LEFT SIDE - "DEMOGRAPHICS":
• Age: 25-65+ (Anyone needing this solution)
• Professionals: Office workers, entrepreneurs, healthcare
• Parents: Busy schedules, need support
• Health-Conscious: Seeking natural solutions

RIGHT SIDE - "PAIN POINTS THEY EXPERIENCE":
• Struggling with the core problem daily
• Frustrated with current solutions
• Worried about side effects of drugs
• Need something that actually works

BOTTOM - "WHAT THEY'VE TRIED":
Coffee, supplements, prescriptions, other products (didn't work long-term)

===========================================
SECTION 2: 5 OPENING SCRIPTS (Light Blue #5b8fb9)
===========================================
HEADER: "🚀 HOW TO START THE CONVERSATION"
SUBHEADER: "Choose based on context - Use these EXACT words"

BOX 1 - "[COLD] STRANGER APPROACH":
"Hi there! I couldn't help but notice... I'm [Your Name]. What's typically your go-to when you're dealing with [problem]?"

BOX 2 - "[WARM] FRIEND/FAMILY":
"Hey [Name]! You know how you've mentioned [problem]? I've been using something that's made a huge difference. Have you looked into natural solutions?"

BOX 3 - "[SOCIAL DM] ONLINE":
"Hi [Name]! I saw your post about [problem]. I've found a game-changer that's completely drug-free. Would you be open to hearing about it?"

BOX 4 - "[REFERRAL] INTRODUCTION":
"Hi [Name], [Referrer] mentioned you've been looking for solutions to [problem]. Is that something you're actively exploring?"

BOX 5 - "[EVENT] CASUAL":
"I hear you! Everyone seems to be dealing with that. I work with innovative tech that helps naturally. Ever heard of vibrotactile technology?"

===========================================
SECTION 3: 10 DISCOVERY QUESTIONS (Purple #7c4dff)
===========================================
HEADER: "🔍 QUESTIONS TO ASK"
SUBHEADER: "Listen actively! Ask 3-5 of these to understand their needs"

COLUMN 1 - "OPENING Qs":
1. "Tell me about your typical day. What are your biggest challenges with [problem]?"
2. "On a scale of 1-10, how satisfied are you with how you currently manage this?"

COLUMN 2 - "PAIN POINT Qs":
3. "When do you typically feel the [problem] most, and how does it impact you?"
4. "What's the biggest frustration with your current routine?"
5. "What have you tried before? What did you like/dislike?"

COLUMN 3 - "IMPACT Qs":
6. "How does this affect your daily life, family, or work?"
7. "Are you concerned about long-term effects of your current approach?"

COLUMN 4 - "SOLUTION Qs":
8. "If you could wave a magic wand, what would ideal look like for you?"
9. "Beyond solving the main issue, what other improvements would you want?"
10. "If you found a natural solution, what difference would that make?"

===========================================
SECTION 4: PRESENT THE SOLUTION (Green #00c853)
===========================================
HEADER: "🎤 THE 2-MINUTE PITCH"
SUBHEADER: "Problem → Agitate → Solve Framework"

BOX 1 - "PROBLEM" (State the pain):
"Have you ever found yourself [experiencing the core problem]? It's a common struggle - trying to [achieve goal] while [facing obstacles]."

BOX 2 - "AGITATE" (Make it real):
"This isn't just about [surface issue]. It impacts everything - your [work/relationships/health]. And typical solutions? They often [create more problems]."

BOX 3 - "SOLVE" (Present {product_name}):
"That's why I'm excited about {product_name}. Imagine [desired outcome] without [negative side effects]. {product_name} uses Vibrotactile Technology - special patterns that communicate with your body's natural systems. 100% drug-free, non-invasive."

BOTTOM - "KEY BENEFITS":
✓ {benefits[0]} | ✓ {benefits[1] if len(benefits) > 1 else 'Natural solution'} | ✓ {benefits[2] if len(benefits) > 2 else 'Drug-free'}
"100% Drug-Free • Non-Invasive • Vibrotactile Technology (VTT)"

===========================================
SECTION 5: HANDLE 8 OBJECTIONS (Orange #ff6d00) - LARGEST SECTION
===========================================
HEADER: "🛡️ OBJECTION RESPONSES"
SUBHEADER: "Technique: Acknowledge → Understand → Ask Open Question"
TIP: "Always say 'I understand...' then ask a question"

OBJECTION 1 - "TOO EXPENSIVE":
Response: "I understand price is important. What aspects matter most to you beyond cost?"
Psychology: Shift focus to value

OBJECTION 2 - "NEED TO THINK":
Response: "I understand you want to make the right decision. What specific questions would help you decide?"
Psychology: Identify real concerns

OBJECTION 3 - "ASK MY SPOUSE":
Response: "I understand you want to involve them. What questions might they have?"
Psychology: Prepare for joint conversation

OBJECTION 4 - "DOES IT WORK?":
Response: "I understand the skepticism. What would you need to see or experience to feel confident?"
Psychology: Let them define proof

OBJECTION 5 - "TRIED BEFORE":
Response: "I understand past products disappointed you. What were those, and what was missing?"
Psychology: Highlight how this is different

OBJECTION 6 - "NOT INTERESTED":
Response: "I understand. Could you share what led you to say that, or what your current approach is?"
Psychology: Uncover hidden needs

OBJECTION 7 - "NO TIME":
Response: "I understand you're busy. What part feels like it would take too much time?"
Psychology: Offer concise info

OBJECTION 8 - "VS COMPETITOR":
Response: "I understand you're comparing options. What do you like/dislike about that product?"
Psychology: Highlight unique VTT benefits

===========================================
SECTION 6: 5 CLOSING TECHNIQUES (Red #d50000)
===========================================
HEADER: "🏆 CLOSE THE SALE"
SUBHEADER: "First ask: 'Do you have any questions?' + 'Does this make sense?'"

CLOSE 1 - "[ASSUMPTIVE]" When: Strong buying signals
Script: "Based on what we discussed, {product_name} is exactly what you need. What's the best shipping address?"

CLOSE 2 - "[ALTERNATIVE]" When: Need gentle push
Script: "Would you prefer the 30-day supply to try it, or the 90-day pack for better value?"

CLOSE 3 - "[URGENCY]" When: They're considering
Script: "We have a special promotion ending this week. Want to lock in that price today?"

CLOSE 4 - "[SUMMARY]" When: Need to reinforce value
Script: "So with {product_name}, you'll get [benefit 1], [benefit 2], and [benefit 3]. How does getting started sound?"

CLOSE 5 - "[REFERRAL]" When: After successful sale
Script: "I'm excited for you! Who else do you know who might benefit from this?"

===========================================
SECTION 7: FOLLOW-UP SEQUENCE (Teal #00bfa5)
===========================================
HEADER: "📅 AFTER THE CONVERSATION"
SUBHEADER: "Goal: Build relationship → Get testimonials → Generate referrals"

TIMELINE:
DAY 1: "Great connecting! Here's the info link. Let me know if questions come up!"
DAY 3: "Checking in - did you review the info? I truly believe this could help."
DAY 7: "Hope you're having a great week! Still curious? Happy to answer questions."
DAY 14: "Last check-in - if [solving problem] is still a priority, let's chat."

POST-SALE:
"Your order is on its way! I'll check in soon to see how it's working for you."

===========================================
FOOTER
===========================================
"Super Patch Sales Enablement | {product_name} Patch - {category}"
"Remember: Smile, Listen, and Genuinely Care!"

===========================================
CRITICAL DESIGN REQUIREMENTS
===========================================
1. ALL text MUST be clearly readable - this is a reference document
2. Use the exact color codes specified for each section
3. Include ALL scripts word-for-word as shown above
4. Make section headers large and prominent
5. Use icons/emojis as specified
6. Portrait orientation (3:4 ratio)
7. Professional corporate training aesthetic
8. Dense with information but organized
9. Flow arrows connecting sections vertically
10. This is a "cheat sheet" - reps should read directly from it
'''

    return prompt


def generate_roadmap(client, product_name: str, category: str, tagline: str, benefits: list, output_path: Path) -> bool:
    """Generate a detailed roadmap using Nano Banana Pro."""
    
    wordtrack = load_wordtrack(product_name)
    prompt = build_detailed_prompt(product_name, category, tagline, benefits, wordtrack)
    
    print(f"  📝 Prompt length: {len(prompt)} characters")
    
    try:
        # Use Nano Banana Pro (Gemini 3 Pro Image)
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
                    print(f"  ✅ Generated: {output_path.name}")
                    return True
        
        print(f"  ⚠️ No image in response")
        return False
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate detailed dummy-proof roadmaps')
    parser.add_argument('--product', type=str, help='Generate for specific product')
    parser.add_argument('--list', action='store_true', help='List products')
    args = parser.parse_args()
    
    print("📂 Loading product data...")
    products = load_products()
    
    if args.list:
        print("\n📋 Available Products:")
        for key, data in products.items():
            print(f"  - {key}: {data['name']} ({data['category']})")
        return
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
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
    
    print(f"\n🚀 Generating DETAILED roadmaps for {len(products_to_process)} product(s)...")
    print(f"📁 Output: {OUTPUT_DIR}\n")
    
    client = genai.Client(api_key=GEMINI_API_KEY)
    
    success = 0
    errors = 0
    
    for product_key, product_data in products_to_process.items():
        print(f"\n{'='*60}")
        print(f"📦 {product_data['name']} ({product_data['category']})")
        print(f"{'='*60}")
        
        output_path = OUTPUT_DIR / f"{product_data['name']}_Detailed_Roadmap.png"
        
        if generate_roadmap(
            client,
            product_data['name'],
            product_data['category'],
            product_data['tagline'],
            product_data['benefits'],
            output_path
        ):
            success += 1
        else:
            errors += 1
    
    print(f"\n{'='*60}")
    print("📊 COMPLETE")
    print(f"{'='*60}")
    print(f"✅ Success: {success}")
    print(f"❌ Errors: {errors}")


if __name__ == '__main__':
    main()

