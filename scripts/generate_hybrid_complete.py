#!/usr/bin/env python3
"""
COMPLETE Hybrid Roadmap Generator
1. AI (Nano Banana Pro) generates visual layout with NO TEXT
2. Pillow adds ALL text programmatically for perfect rendering
"""

import os
import json
import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import textwrap
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

# Output dimensions (4K-ish, 3:4 ratio)
WIDTH = 2400
HEIGHT = 3200

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
        return ['Improved wellness', 'Natural VTT technology', 'Drug-free solution', 'Easy to use']
    
    with open(wordtrack_path, 'r') as f:
        content = f.read()
    
    benefits = re.findall(r'[•\-]\s*\*?\*?([^•\-\n]+?)\*?\*?\s*(?:\n|$)', content)
    return benefits[:4] if benefits else ['Improved wellness', 'Natural technology', 'Easy to use', 'Drug-free']


def get_fonts():
    """Load fonts for text rendering."""
    # Try system fonts
    font_paths = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/SFNSDisplay.ttf",
        "/Library/Fonts/Arial.ttf",
    ]
    
    font_file = None
    for path in font_paths:
        if os.path.exists(path):
            font_file = path
            break
    
    if font_file:
        return {
            'title': ImageFont.truetype(font_file, 72),
            'subtitle': ImageFont.truetype(font_file, 48),
            'header': ImageFont.truetype(font_file, 36),
            'body': ImageFont.truetype(font_file, 28),
            'small': ImageFont.truetype(font_file, 22),
            'tiny': ImageFont.truetype(font_file, 18),
        }
    else:
        # Fallback to default
        default = ImageFont.load_default()
        return {k: default for k in ['title', 'subtitle', 'header', 'body', 'small', 'tiny']}


def generate_visual_template(client, product_name: str, category: str) -> bytes:
    """Generate visual layout with AI - NO TEXT, just colored boxes and structure."""
    
    template_img = Image.open(TEMPLATE_PATH)
    logo_img = Image.open(LOGO_PATH)
    
    prompt = f'''Create a VISUAL TEMPLATE for a sales roadmap infographic. Generate ONLY the visual design elements - NO TEXT AT ALL.

IMPORTANT: DO NOT INCLUDE ANY TEXT OR LETTERS. Only generate:
- Colored section boxes/panels
- Connecting arrows between sections
- Background gradients and shapes
- Visual structure and layout

LAYOUT STRUCTURE (based on reference):
1. HEADER BAR (dark charcoal/black, full width at top)
2. LEFT COLUMN (40% width):
   - Box 1: Light grey background
   - Box 2: Blue header bar, white content area
   - Box 3: Blue header bar, white content area with 4 sub-boxes
3. RIGHT COLUMN (60% width):
   - Box 4A: Green header bar, white content area
   - Box 4B: Red header bar, small white content area
   - Box 5: Orange header bar, 8 small boxes (2x4 grid)
   - Box 6: Gold/yellow header bar, 5 boxes (horizontal)
   - Box 7: Teal header bar, timeline with 5 circles connected by line
4. FOOTER BAR (dark charcoal/black, full width at bottom)

STYLE:
- Professional, modern, corporate design
- Rounded corners on boxes (8px radius)
- Subtle shadows for depth
- Connecting arrows between major sections
- Clean white/light grey backgrounds for content areas
- Color-coded section headers

SIZE: {WIDTH}x{HEIGHT} pixels (portrait)

CRITICAL: Generate ONLY visual elements. Leave all text areas BLANK/EMPTY.
We will add text programmatically later.'''

    try:
        response = client.models.generate_content(
            model=IMAGE_MODEL,
            contents=[
                "REFERENCE - Match this layout structure but WITHOUT any text:",
                template_img,
                prompt
            ],
            config=types.GenerateContentConfig(
                response_modalities=['TEXT', 'IMAGE'],
            )
        )
        
        if response.candidates and response.candidates[0].content.parts:
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'inline_data') and part.inline_data:
                    return part.inline_data.data
        return None
    except Exception as e:
        print(f"    Error: {e}")
        return None


def add_text_overlay(image_data: bytes, product: dict, benefits: list, brand: dict) -> Image.Image:
    """Add all text to the visual template using Pillow."""
    
    import io
    
    # Load image
    img = Image.open(io.BytesIO(image_data)).convert('RGBA')
    
    # Resize to standard dimensions if needed
    if img.size != (WIDTH, HEIGHT):
        img = img.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    
    draw = ImageDraw.Draw(img)
    fonts = get_fonts()
    
    # Colors
    WHITE = (255, 255, 255)
    BLACK = (16, 16, 16)
    DARK_GREY = (77, 77, 77)
    RED = (221, 6, 4)
    
    # Add logo to header
    try:
        logo = Image.open(LOGO_PATH).convert('RGBA')
        logo_h = 80
        logo_w = int(logo_h * logo.width / logo.height)
        logo = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
        img.paste(logo, (40, 30), logo)
    except:
        pass
    
    # === HEADER ===
    draw.text((WIDTH//2, 60), f"{product['name'].upper()} SALES ROADMAP", 
              font=fonts['title'], fill=WHITE, anchor='mt')
    draw.text((WIDTH//2, 140), product['tagline'],
              font=fonts['subtitle'], fill=WHITE, anchor='mt')
    draw.text((WIDTH//2, 200), f"[ {product['category']} ]",
              font=fonts['body'], fill=RED, anchor='mt')
    
    # Column positions
    LEFT_X = 60
    LEFT_W = int(WIDTH * 0.38)
    RIGHT_X = LEFT_X + LEFT_W + 40
    RIGHT_W = WIDTH - RIGHT_X - 60
    
    # === STEP 1: KNOW YOUR CUSTOMER (Left column) ===
    y = 280
    draw.text((LEFT_X + 10, y), "1. KNOW YOUR CUSTOMER", font=fonts['header'], fill=BLACK)
    draw.text((LEFT_X + LEFT_W - 10, y), "2 min", font=fonts['small'], fill=DARK_GREY, anchor='rt')
    
    y += 50
    customers = [
        "WHO THEY ARE:",
        "• Professionals (25-65+) seeking natural solutions",
        "• Health-conscious avoiding medications",
        "• Active individuals wanting peak performance",
        "",
        "WHAT THEY'RE FEELING:",
        "• Frustrated with current solutions",
        "• Worried about side effects",
        "• Looking for something that works",
        "",
        "WHAT THEY'VE TRIED:",
        "• Pills, prescriptions, supplements",
        "• None worked long-term"
    ]
    for line in customers:
        if line.startswith("WHO") or line.startswith("WHAT"):
            draw.text((LEFT_X + 15, y), line, font=fonts['small'], fill=BLACK)
        elif line:
            draw.text((LEFT_X + 20, y), line, font=fonts['tiny'], fill=DARK_GREY)
        y += 24
    
    # === STEP 2: START CONVERSATION ===
    y += 20
    draw.text((LEFT_X + 10, y), "2. START THE CONVERSATION", font=fonts['header'], fill=WHITE)
    y += 45
    
    approaches = [
        ("COLD:", "What's your go-to for [issue]?"),
        ("WARM:", "You mentioned... I found something"),
        ("SOCIAL:", "Saw your post, found a solution"),
        ("REFERRAL:", "[Name] suggested we connect"),
        ("EVENT:", "Work with wellness tech. Heard of VTT?"),
    ]
    for label, text in approaches:
        draw.text((LEFT_X + 15, y), label, font=fonts['small'], fill=BLACK)
        draw.text((LEFT_X + 100, y), text, font=fonts['tiny'], fill=DARK_GREY)
        y += 28
    
    # === STEP 3: DISCOVERY ===
    y += 30
    draw.text((LEFT_X + 10, y), "3. DISCOVER THEIR NEEDS", font=fonts['header'], fill=WHITE)
    y += 45
    
    questions = [
        "OPENING:",
        "• Tell me about your typical day",
        "• Scale 1-10, how satisfied are you?",
        "",
        "PAIN POINTS:",
        "• When does it hit hardest?",
        "• What have you tried before?",
        "",
        "IMPACT:",
        "• How does this affect work/family?",
        "• Concerned about long-term effects?",
        "",
        "SOLUTION:",
        "• If you had a magic wand...?",
        "• Natural solution - what difference?"
    ]
    for line in questions:
        if line.endswith(":"):
            draw.text((LEFT_X + 15, y), line, font=fonts['small'], fill=BLACK)
        elif line:
            draw.text((LEFT_X + 20, y), line, font=fonts['tiny'], fill=DARK_GREY)
        y += 22
    
    # === RIGHT COLUMN ===
    
    # === STEP 4A: PRESENT SOLUTION ===
    y = 280
    draw.text((RIGHT_X + 10, y), f"4A. PRESENT {product['name'].upper()}", font=fonts['header'], fill=WHITE)
    y += 45
    
    draw.text((RIGHT_X + 15, y), "PROBLEM:", font=fonts['small'], fill=BLACK)
    y += 26
    draw.text((RIGHT_X + 20, y), "Have you ever found yourself struggling with...", font=fonts['tiny'], fill=DARK_GREY)
    y += 30
    
    draw.text((RIGHT_X + 15, y), "AGITATE:", font=fonts['small'], fill=BLACK)
    y += 26
    draw.text((RIGHT_X + 20, y), "This impacts your work, family, and overall health...", font=fonts['tiny'], fill=DARK_GREY)
    y += 30
    
    draw.text((RIGHT_X + 15, y), "SOLVE:", font=fonts['small'], fill=BLACK)
    y += 26
    draw.text((RIGHT_X + 20, y), f"{product['name']} uses Vibrotactile Technology.", font=fonts['tiny'], fill=DARK_GREY)
    y += 22
    draw.text((RIGHT_X + 20, y), "100% drug-free, non-invasive solution.", font=fonts['tiny'], fill=DARK_GREY)
    y += 30
    
    draw.text((RIGHT_X + 15, y), "KEY BENEFITS:", font=fonts['small'], fill=BLACK)
    y += 26
    for benefit in benefits[:4]:
        draw.text((RIGHT_X + 20, y), f"• {benefit[:50]}", font=fonts['tiny'], fill=DARK_GREY)
        y += 22
    
    # === STEP 4B: TRIAL CLOSE ===
    y += 20
    draw.text((RIGHT_X + 10, y), "4B. TRIAL CLOSE", font=fonts['header'], fill=WHITE)
    y += 40
    
    trial_closes = [
        '"Does this make sense for your situation?"',
        '"Any questions about how it works?"',
        '"Sound like what you\'ve been looking for?"'
    ]
    for tc in trial_closes:
        draw.text((RIGHT_X + 20, y), tc, font=fonts['tiny'], fill=DARK_GREY)
        y += 24
    
    # === STEP 5: HANDLE OBJECTIONS ===
    y += 30
    draw.text((RIGHT_X + 10, y), "5. HANDLE OBJECTIONS", font=fonts['header'], fill=WHITE)
    draw.text((RIGHT_X + RIGHT_W - 10, y), '"I understand..." + Open Q', font=fonts['tiny'], fill=DARK_GREY, anchor='rt')
    y += 40
    
    objections = [
        ("Too expensive", "What matters beyond cost?"),
        ("Need to think", "What questions would help?"),
        ("Ask spouse", "What would they want to know?"),
        ("Does it work?", "What would convince you?"),
        ("Tried before", "What was missing?"),
        ("Not interested", "What led you to say that?"),
        ("No time", "What feels like too much?"),
        ("vs Competitor", "What do you like about that?"),
    ]
    
    col_w = (RIGHT_W - 40) // 2
    for i, (obj, response) in enumerate(objections):
        col = i % 2
        row = i // 2
        x = RIGHT_X + 15 + col * (col_w + 20)
        obj_y = y + row * 55
        draw.text((x, obj_y), f'"{obj}"', font=fonts['tiny'], fill=BLACK)
        draw.text((x, obj_y + 20), f"→ {response}", font=fonts['tiny'], fill=DARK_GREY)
    
    y += 230
    
    # === STEP 6: CLOSE THE SALE ===
    draw.text((RIGHT_X + 10, y), "6. CLOSE THE SALE", font=fonts['header'], fill=WHITE)
    y += 40
    
    closes = [
        ("[A] ASSUMPTIVE", f"Based on our discussion, {product['name']} is what you need."),
        ("[B] ALTERNATIVE", "30-day supply to try, or 90-day for better value?"),
        ("[C] URGENCY", "Special promotion ending this week."),
        ("[D] SUMMARY", f"With {product['name']}, you get all these benefits. Ready?"),
        ("[E] REFERRAL", "Who else in your life could benefit from this?"),
    ]
    for label, text in closes:
        draw.text((RIGHT_X + 15, y), label, font=fonts['small'], fill=BLACK)
        y += 24
        # Wrap long text
        wrapped = textwrap.fill(text, width=55)
        for line in wrapped.split('\n'):
            draw.text((RIGHT_X + 20, y), line, font=fonts['tiny'], fill=DARK_GREY)
            y += 20
        y += 8
    
    # === STEP 7: FOLLOW UP ===
    y += 20
    draw.text((RIGHT_X + 10, y), "7. FOLLOW UP", font=fonts['header'], fill=WHITE)
    draw.text((RIGHT_X + RIGHT_W - 10, y), "Goal: Results → Testimonials → Referrals", font=fonts['tiny'], fill=DARK_GREY, anchor='rt')
    y += 40
    
    timeline = [
        ("DAY 1", "Great connecting! Here's the info."),
        ("DAY 3", "Checking in - did you review?"),
        ("DAY 7", "Hope you're having a great week!"),
        ("DAY 14", "Last check - still a priority?"),
        ("POST-SALE", "Order on its way! Will check in."),
    ]
    
    step_w = (RIGHT_W - 40) // 5
    for i, (day, msg) in enumerate(timeline):
        x = RIGHT_X + 20 + i * step_w
        draw.text((x, y), day, font=fonts['tiny'], fill=BLACK)
        # Wrap message
        wrapped = textwrap.fill(msg, width=12)
        msg_y = y + 22
        for line in wrapped.split('\n'):
            draw.text((x, msg_y), line, font=fonts['tiny'], fill=DARK_GREY)
            msg_y += 18
    
    # === FOOTER ===
    footer_y = HEIGHT - 80
    draw.text((WIDTH//2, footer_y), f"Super Patch Sales Enablement | {product['name']} - {product['category']}", 
              font=fonts['small'], fill=WHITE, anchor='mt')
    draw.text((WIDTH//2, footer_y + 30), "Remember: Smile, Listen, and Genuinely Care!", 
              font=fonts['tiny'], fill=DARK_GREY, anchor='mt')
    
    # Add small logo to footer
    try:
        logo = Image.open(LOGO_PATH).convert('RGBA')
        logo_h = 40
        logo_w = int(logo_h * logo.width / logo.height)
        logo = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
        logo_x = (WIDTH - logo_w) // 2
        img.paste(logo, (logo_x, footer_y - 50), logo)
    except:
        pass
    
    return img


def generate_roadmap(client, product: dict, brand: dict, output_path: Path) -> bool:
    """Generate roadmap using hybrid approach."""
    
    print(f"\n{'='*60}")
    print(f"🎨 Generating: {product['name']} (Hybrid)")
    print(f"{'='*60}")
    
    benefits = extract_benefits(product['name'])
    
    # Step 1: Generate visual template
    print("  🖼️  Generating visual template (AI)...")
    image_data = generate_visual_template(client, product['name'], product['category'])
    
    if not image_data:
        print("  ❌ Failed to generate visual template")
        return False
    
    print("  ✓ Visual template generated")
    
    # Step 2: Add text overlay
    print("  📝 Adding text overlay (Pillow)...")
    final_img = add_text_overlay(image_data, product, benefits, brand)
    
    # Save
    final_img.convert('RGB').save(output_path, 'PNG', quality=100)
    print(f"  ✅ Saved: {output_path.name}")
    
    return True


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
    print("🎨 HYBRID ROADMAP GENERATOR (Complete)")
    print("="*60)
    print("Step 1: AI generates visual layout (no text)")
    print("Step 2: Pillow adds all text programmatically")
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

