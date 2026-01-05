#!/usr/bin/env python3
"""
Programmatic Sales Roadmap Dashboard Generator

Creates COMPREHENSIVE, DETAILED visual roadmaps using Python graphics libraries
for crisp, readable text that AI image generation can't match.

Uses matplotlib and Pillow for precise text rendering.
"""

import json
import os
from pathlib import Path
from datetime import datetime
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Arrow, FancyArrowPatch
import matplotlib.patheffects as pe
import numpy as np

# Configuration
BASE_DIR = Path('/Users/cbsuperpatch/Desktop/SalesEnablement')
OUTPUT_DIR = BASE_DIR / 'sales_materials/roadmaps_v3'
SPECS_DIR = BASE_DIR / 'sales_materials/roadmap_specs_v2'
PRODUCTS_FILE = BASE_DIR / 'products/superpatch_products.json'

# Color scheme
COLORS = {
    'header': '#1a1a2e',
    'header_text': '#ffffff',
    'customer': '#3498db',
    'openings': '#5dade2',
    'discovery': '#9b59b6',
    'presentation': '#27ae60',
    'objections': '#e67e22',
    'closing': '#e74c3c',
    'followup': '#1abc9c',
    'white': '#ffffff',
    'light_gray': '#f8f9fa',
    'dark_gray': '#2c3e50',
    'text': '#2c3e50',
    'subtext': '#7f8c8d',
}


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


def wrap_text(text: str, max_chars: int = 30) -> str:
    """Wrap text to fit within max_chars per line."""
    words = text.split()
    lines = []
    current_line = []
    current_length = 0
    
    for word in words:
        if current_length + len(word) + 1 <= max_chars:
            current_line.append(word)
            current_length += len(word) + 1
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]
            current_length = len(word)
    
    if current_line:
        lines.append(' '.join(current_line))
    
    return '\n'.join(lines)


def create_roadmap_figure(spec: dict, output_path: Path):
    """Create a comprehensive sales roadmap using matplotlib."""
    
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
    
    # Create figure with high DPI for print quality
    fig = plt.figure(figsize=(16, 24), facecolor=COLORS['light_gray'], dpi=150)
    
    # Remove all axes borders
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 150)
    ax.axis('off')
    
    current_y = 148
    
    # ═══════════════════════════════════════════════════════════════════════
    # HEADER
    # ═══════════════════════════════════════════════════════════════════════
    header_box = FancyBboxPatch((0, current_y - 12), 100, 12, 
                                 boxstyle="square,pad=0", 
                                 facecolor=COLORS['header'], 
                                 edgecolor='none')
    ax.add_patch(header_box)
    
    ax.text(50, current_y - 4, f"{product.upper()} PATCH", 
            fontsize=24, fontweight='bold', color=COLORS['white'],
            ha='center', va='center')
    ax.text(50, current_y - 8, "COMPLETE SALES ROADMAP", 
            fontsize=16, fontweight='bold', color='#5dade2',
            ha='center', va='center')
    ax.text(50, current_y - 11, tagline, 
            fontsize=10, color='#95a5a6',
            ha='center', va='center')
    ax.text(95, current_y - 3, "Super Patch\nSales Enablement", 
            fontsize=8, color='#95a5a6',
            ha='right', va='top')
    
    current_y -= 14
    
    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 1: TARGET CUSTOMER
    # ═══════════════════════════════════════════════════════════════════════
    section_height = 12
    section_box = FancyBboxPatch((1, current_y - section_height), 98, section_height, 
                                  boxstyle="round,pad=0.02,rounding_size=0.5", 
                                  facecolor=COLORS['customer'], 
                                  edgecolor='none', alpha=0.15)
    ax.add_patch(section_box)
    
    ax.text(3, current_y - 2, "[1] TARGET CUSTOMER", 
            fontsize=12, fontweight='bold', color=COLORS['customer'])
    
    # Demographics column
    ax.text(5, current_y - 4.5, "Demographics:", fontsize=9, fontweight='bold', color=COLORS['text'])
    for i, demo in enumerate(customer['demographics'][:4]):
        ax.text(5, current_y - 6 - i*1.8, f"• {demo}", fontsize=8, color=COLORS['subtext'])
    
    # Pain Points column  
    ax.text(55, current_y - 4.5, "Pain Points:", fontsize=9, fontweight='bold', color=COLORS['text'])
    for i, pain in enumerate(customer['pain_points'][:4]):
        ax.text(55, current_y - 6 - i*1.8, f"• {pain}", fontsize=8, color=COLORS['subtext'])
    
    current_y -= section_height + 1
    
    # Flow arrow
    ax.annotate('', xy=(50, current_y - 0.5), xytext=(50, current_y + 0.5),
                arrowprops=dict(arrowstyle='->', color=COLORS['dark_gray'], lw=2))
    current_y -= 1.5
    
    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 2: OPENING APPROACHES
    # ═══════════════════════════════════════════════════════════════════════
    section_height = 22
    section_box = FancyBboxPatch((1, current_y - section_height), 98, section_height, 
                                  boxstyle="round,pad=0.02,rounding_size=0.5", 
                                  facecolor=COLORS['openings'], 
                                  edgecolor='none', alpha=0.15)
    ax.add_patch(section_box)
    
    ax.text(3, current_y - 2, "[2] 5 OPENING APPROACHES", 
            fontsize=12, fontweight='bold', color=COLORS['openings'])
    ax.text(60, current_y - 2, "Choose based on context - all lead to discovery", 
            fontsize=8, color=COLORS['subtext'])
    
    # Opening cards - 5 columns
    card_width = 18
    card_height = 17
    card_spacing = 19
    start_x = 3
    
    for i, opening in enumerate(openings[:5]):
        x = start_x + i * card_spacing
        y = current_y - 5
        
        # Card background
        card = FancyBboxPatch((x, y - card_height), card_width, card_height, 
                              boxstyle="round,pad=0.02,rounding_size=0.3", 
                              facecolor=COLORS['white'], 
                              edgecolor=COLORS['openings'], linewidth=1)
        ax.add_patch(card)
        
        # Card header
        header = FancyBboxPatch((x, y - 3), card_width, 3, 
                                boxstyle="round,pad=0,rounding_size=0.3", 
                                facecolor=COLORS['openings'], 
                                edgecolor='none')
        ax.add_patch(header)
        
        ax.text(x + card_width/2, y - 1.5, opening['type'], 
                fontsize=7, fontweight='bold', color=COLORS['white'],
                ha='center', va='center')
        
        ax.text(x + 1, y - 4.5, f"Context: {opening['context']}", 
                fontsize=6, color=COLORS['subtext'])
        
        # Script text (wrapped)
        script_short = opening['script'][:100] + "..." if len(opening['script']) > 100 else opening['script']
        script_wrapped = wrap_text(script_short, 25)
        ax.text(x + 1, y - 6.5, f'"{script_wrapped}"', 
                fontsize=5.5, color=COLORS['text'], style='italic',
                va='top')
    
    current_y -= section_height + 1
    
    # Flow arrow
    ax.annotate('', xy=(50, current_y - 0.5), xytext=(50, current_y + 0.5),
                arrowprops=dict(arrowstyle='->', color=COLORS['dark_gray'], lw=2))
    current_y -= 1.5
    
    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 3: DISCOVERY QUESTIONS
    # ═══════════════════════════════════════════════════════════════════════
    section_height = 18
    section_box = FancyBboxPatch((1, current_y - section_height), 98, section_height, 
                                  boxstyle="round,pad=0.02,rounding_size=0.5", 
                                  facecolor=COLORS['discovery'], 
                                  edgecolor='none', alpha=0.15)
    ax.add_patch(section_box)
    
    ax.text(3, current_y - 2, "[3] DISCOVERY QUESTIONS", 
            fontsize=12, fontweight='bold', color=COLORS['discovery'])
    ax.text(55, current_y - 2, "Uncover needs & pain points (ask 3-5)", 
            fontsize=8, color=COLORS['subtext'])
    
    # Group questions by type
    q_types = {'Opening': [], 'Pain Point': [], 'Impact': [], 'Solution': []}
    for q in questions[:10]:
        q_type = q['type'].replace(' Question', '')
        if q_type in q_types:
            q_types[q_type].append(q['question'])
        else:
            # Handle variations
            for key in q_types.keys():
                if key.lower() in q['type'].lower():
                    q_types[key].append(q['question'])
                    break
    
    # 4 columns for question types
    col_width = 24
    start_x = 3
    
    for i, (q_type, qs) in enumerate(q_types.items()):
        x = start_x + i * col_width
        y = current_y - 5
        
        ax.text(x, y, f"{q_type} Qs:", fontsize=8, fontweight='bold', color=COLORS['discovery'])
        
        for j, q in enumerate(qs[:3]):
            q_short = q[:45] + "..." if len(q) > 45 else q
            ax.text(x, y - 2 - j*3.5, f'• "{q_short}"', 
                    fontsize=6, color=COLORS['text'], style='italic')
    
    current_y -= section_height + 1
    
    # Flow arrow
    ax.annotate('', xy=(50, current_y - 0.5), xytext=(50, current_y + 0.5),
                arrowprops=dict(arrowstyle='->', color=COLORS['dark_gray'], lw=2))
    current_y -= 1.5
    
    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 4: PRESENTATION (Problem → Agitate → Solve)
    # ═══════════════════════════════════════════════════════════════════════
    section_height = 16
    section_box = FancyBboxPatch((1, current_y - section_height), 98, section_height, 
                                  boxstyle="round,pad=0.02,rounding_size=0.5", 
                                  facecolor=COLORS['presentation'], 
                                  edgecolor='none', alpha=0.15)
    ax.add_patch(section_box)
    
    ax.text(3, current_y - 2, f"[4] PRESENT {product.upper()}", 
            fontsize=12, fontweight='bold', color=COLORS['presentation'])
    ax.text(55, current_y - 2, "Framework: Problem → Agitate → Solve", 
            fontsize=8, color=COLORS['subtext'])
    
    # PAS boxes
    pas_data = [
        ("PROBLEM", presentation['problem'][:80], COLORS['presentation']),
        ("AGITATE", presentation['agitate'][:80], '#f39c12'),
        ("SOLVE", presentation['solve'][:80], COLORS['presentation']),
    ]
    
    box_width = 30
    start_x = 4
    
    for i, (title, content, color) in enumerate(pas_data):
        x = start_x + i * 32
        y = current_y - 5
        
        pas_box = FancyBboxPatch((x, y - 8), box_width, 8, 
                                  boxstyle="round,pad=0.02,rounding_size=0.3", 
                                  facecolor=COLORS['white'], 
                                  edgecolor=color, linewidth=2)
        ax.add_patch(pas_box)
        
        ax.text(x + box_width/2, y - 1, title, 
                fontsize=9, fontweight='bold', color=color,
                ha='center')
        
        content_wrapped = wrap_text(content + "...", 35)
        ax.text(x + 1, y - 2.5, f'"{content_wrapped}"', 
                fontsize=6, color=COLORS['text'], style='italic',
                va='top')
        
        # Arrow between boxes
        if i < 2:
            ax.text(x + box_width + 1, y - 4, "→", fontsize=14, color=color)
    
    # Benefits and differentiator
    ax.text(4, current_y - 14, f"KEY BENEFITS: {' • '.join(benefits)}", 
            fontsize=7, fontweight='bold', color=COLORS['presentation'])
    ax.text(50, current_y - 14, presentation['differentiator'], 
            fontsize=7, color=COLORS['presentation'])
    
    current_y -= section_height + 1
    
    # Flow arrow
    ax.annotate('', xy=(50, current_y - 0.5), xytext=(50, current_y + 0.5),
                arrowprops=dict(arrowstyle='->', color=COLORS['dark_gray'], lw=2))
    current_y -= 1.5
    
    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 5: OBJECTION HANDLING (LARGEST)
    # ═══════════════════════════════════════════════════════════════════════
    section_height = 26
    section_box = FancyBboxPatch((1, current_y - section_height), 98, section_height, 
                                  boxstyle="round,pad=0.02,rounding_size=0.5", 
                                  facecolor=COLORS['objections'], 
                                  edgecolor='none', alpha=0.15)
    ax.add_patch(section_box)
    
    ax.text(3, current_y - 2, "[5] HANDLE 8 OBJECTIONS", 
            fontsize=12, fontweight='bold', color=COLORS['objections'])
    ax.text(55, current_y - 2, "Technique: \"I understand... [Open Question]\"", 
            fontsize=8, color=COLORS['subtext'])
    
    # 8 objection cards in 2 rows of 4
    card_width = 23
    card_height = 10
    start_x = 3
    
    for i, obj in enumerate(objections[:8]):
        row = i // 4
        col = i % 4
        x = start_x + col * 24
        y = current_y - 5 - row * 11
        
        # Card background
        card = FancyBboxPatch((x, y - card_height), card_width, card_height, 
                              boxstyle="round,pad=0.02,rounding_size=0.3", 
                              facecolor=COLORS['white'], 
                              edgecolor=COLORS['objections'], linewidth=1)
        ax.add_patch(card)
        
        # Objection header
        header = FancyBboxPatch((x, y - 2.5), card_width, 2.5, 
                                boxstyle="round,pad=0,rounding_size=0.3", 
                                facecolor=COLORS['objections'], 
                                edgecolor='none')
        ax.add_patch(header)
        
        ax.text(x + card_width/2, y - 1.2, f'"{obj["objection"]}"', 
                fontsize=6, fontweight='bold', color=COLORS['white'],
                ha='center')
        
        # Response
        response_short = obj['response'][:70] + "..." if len(obj['response']) > 70 else obj['response']
        response_wrapped = wrap_text(f"→ {response_short}", 30)
        ax.text(x + 1, y - 3.5, response_wrapped, 
                fontsize=5.5, color=COLORS['text'],
                va='top')
        
        # Psychology tag
        ax.text(x + card_width/2, y - card_height + 1, f"[{obj['psychology']}]", 
                fontsize=5, color=COLORS['subtext'],
                ha='center', style='italic')
    
    current_y -= section_height + 1
    
    # Flow arrow
    ax.annotate('', xy=(50, current_y - 0.5), xytext=(50, current_y + 0.5),
                arrowprops=dict(arrowstyle='->', color=COLORS['dark_gray'], lw=2))
    current_y -= 1.5
    
    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 6: CLOSING TECHNIQUES
    # ═══════════════════════════════════════════════════════════════════════
    section_height = 16
    section_box = FancyBboxPatch((1, current_y - section_height), 98, section_height, 
                                  boxstyle="round,pad=0.02,rounding_size=0.5", 
                                  facecolor=COLORS['closing'], 
                                  edgecolor='none', alpha=0.15)
    ax.add_patch(section_box)
    
    ax.text(3, current_y - 2, "[6] 5 CLOSING TECHNIQUES", 
            fontsize=12, fontweight='bold', color=COLORS['closing'])
    ax.text(55, current_y - 2, "Pre-close: \"Any questions?\" + \"Does this make sense?\"", 
            fontsize=8, color=COLORS['subtext'])
    
    # 5 closing cards
    card_width = 18
    card_height = 12
    start_x = 3
    
    for i, close in enumerate(closings[:5]):
        x = start_x + i * 19
        y = current_y - 4.5
        
        # Card
        card = FancyBboxPatch((x, y - card_height), card_width, card_height, 
                              boxstyle="round,pad=0.02,rounding_size=0.3", 
                              facecolor=COLORS['white'], 
                              edgecolor=COLORS['closing'], linewidth=1)
        ax.add_patch(card)
        
        # Header
        header = FancyBboxPatch((x, y - 2.5), card_width, 2.5, 
                                boxstyle="round,pad=0,rounding_size=0.3", 
                                facecolor=COLORS['closing'], 
                                edgecolor='none')
        ax.add_patch(header)
        
        ax.text(x + card_width/2, y - 1.2, f"{close['icon']} {close['name']}", 
                fontsize=6, fontweight='bold', color=COLORS['white'],
                ha='center')
        
        # Script
        script_short = close['script'][:60] + "..." if len(close['script']) > 60 else close['script']
        script_wrapped = wrap_text(f'"{script_short}"', 23)
        ax.text(x + 1, y - 3.5, script_wrapped, 
                fontsize=5.5, color=COLORS['text'], style='italic',
                va='top')
        
        # When to use
        ax.text(x + 1, y - card_height + 2, f"When: {close['when']}", 
                fontsize=5, color=COLORS['subtext'])
    
    current_y -= section_height + 1
    
    # Flow arrow
    ax.annotate('', xy=(50, current_y - 0.5), xytext=(50, current_y + 0.5),
                arrowprops=dict(arrowstyle='->', color=COLORS['dark_gray'], lw=2))
    current_y -= 1.5
    
    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 7: FOLLOW-UP SEQUENCE
    # ═══════════════════════════════════════════════════════════════════════
    section_height = 10
    section_box = FancyBboxPatch((1, current_y - section_height), 98, section_height, 
                                  boxstyle="round,pad=0.02,rounding_size=0.5", 
                                  facecolor=COLORS['followup'], 
                                  edgecolor='none', alpha=0.15)
    ax.add_patch(section_box)
    
    ax.text(3, current_y - 2, "[7] FOLLOW-UP SEQUENCE", 
            fontsize=12, fontweight='bold', color=COLORS['followup'])
    ax.text(55, current_y - 2, "Goal: Build relationship → Get testimonials → Generate referrals", 
            fontsize=8, color=COLORS['subtext'])
    
    # Timeline
    start_x = 5
    timeline_y = current_y - 6
    
    for i, fu in enumerate(followups[:4]):
        x = start_x + i * 24
        
        # Circle for day
        circle = plt.Circle((x + 3, timeline_y), 2, 
                            facecolor=COLORS['followup'], edgecolor='none')
        ax.add_patch(circle)
        
        ax.text(x + 3, timeline_y, fu['day'], 
                fontsize=7, fontweight='bold', color=COLORS['white'],
                ha='center', va='center')
        
        ax.text(x + 7, timeline_y + 0.5, fu['action'], 
                fontsize=7, fontweight='bold', color=COLORS['text'])
        ax.text(x + 7, timeline_y - 1.5, f"({fu['channel']})", 
                fontsize=6, color=COLORS['subtext'])
        
        # Arrow to next
        if i < 3:
            ax.annotate('', xy=(x + 22, timeline_y), xytext=(x + 18, timeline_y),
                        arrowprops=dict(arrowstyle='->', color=COLORS['followup'], lw=1.5))
    
    # ═══════════════════════════════════════════════════════════════════════
    # FOOTER
    # ═══════════════════════════════════════════════════════════════════════
    footer_y = current_y - section_height - 2
    ax.text(50, footer_y, f"Super Patch Sales Enablement | {product} Patch - {category} | Generated {datetime.now().strftime('%Y-%m-%d')}", 
            fontsize=7, color=COLORS['subtext'],
            ha='center')
    
    # Save figure
    plt.savefig(output_path, dpi=150, bbox_inches='tight', 
                facecolor=COLORS['light_gray'], edgecolor='none',
                pad_inches=0.2)
    plt.close(fig)
    
    print(f"  ✅ Created roadmap: {output_path.name}")
    return True


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate programmatic sales roadmaps')
    parser.add_argument('--product', type=str, help='Generate for specific product')
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
    
    print(f"\n🚀 Generating PROGRAMMATIC roadmaps for {len(products_to_process)} product(s)...\n")
    
    success_count = 0
    error_count = 0
    
    for product_key, product_data in products_to_process.items():
        print(f"\n{'='*60}")
        print(f"📦 {product_data['name']} Patch ({product_data['category']})")
        print(f"{'='*60}")
        
        # Load spec
        spec = load_spec(product_data['name'])
        if not spec:
            print(f"  ⚠️ No spec found for {product_data['name']}. Skipping.")
            error_count += 1
            continue
        
        # Generate roadmap
        print("  🎨 Generating programmatic roadmap...")
        output_path = OUTPUT_DIR / f"{product_data['name']}_Roadmap_v3.png"
        
        try:
            create_roadmap_figure(spec, output_path)
            success_count += 1
        except Exception as e:
            print(f"  ❌ Error: {e}")
            error_count += 1
    
    print(f"\n{'='*60}")
    print("📊 GENERATION COMPLETE")
    print(f"{'='*60}")
    print(f"✅ Success: {success_count}")
    print(f"❌ Errors: {error_count}")
    print(f"📁 Roadmaps: {OUTPUT_DIR}")


if __name__ == '__main__':
    main()

