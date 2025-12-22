#!/usr/bin/env python3
"""
Gemini Video Analyzer for Sales Training Videos
Uses Google's Gemini API to analyze YouTube videos and extract sales frameworks

Setup:
    pip install google-genai

Usage:
    # Set your API key
    export GEMINI_API_KEY="your-api-key"
    
    # Single video
    python gemini_video_analyzer.py "https://www.youtube.com/watch?v=VIDEO_ID"
    
    # From JSON file
    python gemini_video_analyzer.py --json ../youtube_videos.json --limit 5
    
    # Specific category
    python gemini_video_analyzer.py --json ../youtube_videos.json --category objection-handling
"""

import os
import sys
import json
import time
from pathlib import Path
from datetime import datetime

from google import genai
from google.genai import types

# Analysis prompt for extracting sales frameworks
ANALYSIS_PROMPT = """Analyze this sales training video and extract the following information in a structured format:

## VIDEO ANALYSIS

### 1. MAIN TOPIC & TECHNIQUE
What is the primary sales concept/technique being taught? Give it a clear name.

### 2. KEY FRAMEWORKS & STEP-BY-STEP PROCESS
List each specific sales technique or framework mentioned:
- Framework/Technique Name
- Step-by-step process (numbered steps)
- The psychology/principle behind why it works

### 3. EXACT SCRIPTS & WORD TRACKS
Extract any specific scripts, phrases, or word tracks that salespeople should use:
- Opening lines
- Discovery questions  
- Objection responses (exact wording)
- Closing phrases
- Follow-up messages

Format these as quotable scripts that can be used directly.

### 4. OBJECTION HANDLING
If objections are discussed:
- Common objections mentioned
- Recommended responses (exact wording if provided)
- The reframe or psychology behind each response

### 5. KEY TAKEAWAYS
Top 3-5 actionable insights a salesperson can immediately implement

### 6. SUPER PATCH APPLICATION
How can these techniques be specifically applied to selling Super Patch wellness products (patches that use technology for pain relief, energy, sleep, etc.) in a direct sales/network marketing context? Give specific examples.

Please be specific and include exact quotes/scripts when the speaker provides them. This will be used to train a direct sales team."""


def setup_gemini(api_key: str = None):
    """Configure Gemini API client"""
    api_key = api_key or os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found. Set it via environment variable or pass directly.")
    
    return genai.Client(api_key=api_key)


def analyze_video(video_url: str, client, title: str = None, category: str = None,
                  model: str = "gemini-2.5-flash") -> dict:
    """Analyze a YouTube video using Gemini"""
    
    print(f"\n{'='*60}")
    print(f"Analyzing: {title or 'Unknown'}")
    print(f"URL: {video_url}")
    print(f"Model: {model}")
    print(f"{'='*60}")
    
    try:
        response = client.models.generate_content(
            model=model,
            contents=[
                types.Part.from_uri(file_uri=video_url, mime_type="video/*"),
                ANALYSIS_PROMPT
            ]
        )
        
        analysis = response.text
        
        result = {
            "video_url": video_url,
            "title": title,
            "category": category,
            "analyzed_at": datetime.now().isoformat(),
            "model": model,
            "analysis": analysis
        }
        
        print(f"✓ Analysis complete ({len(analysis)} chars)")
        return result
        
    except Exception as e:
        error_msg = str(e)
        print(f"✗ Error: {error_msg}")
        return {
            "video_url": video_url,
            "title": title,
            "category": category,
            "error": error_msg
        }


def save_analysis(result: dict, output_dir: str = "analyses"):
    """Save analysis to JSON and Markdown files"""
    Path(output_dir).mkdir(exist_ok=True)
    
    # Extract video ID for filename
    video_url = result.get('video_url', '')
    if 'watch?v=' in video_url:
        video_id = video_url.split('watch?v=')[-1].split('&')[0]
    else:
        video_id = video_url.split('/')[-1]
    
    # Save JSON
    json_path = Path(output_dir) / f"{video_id}.json"
    with open(json_path, 'w') as f:
        json.dump(result, f, indent=2)
    
    # Save Markdown
    if 'analysis' in result:
        md_path = Path(output_dir) / f"{video_id}.md"
        with open(md_path, 'w') as f:
            f.write(f"# {result.get('title', 'Unknown Video')}\n\n")
            f.write(f"**URL:** {result.get('video_url', 'N/A')}\n\n")
            f.write(f"**Category:** {result.get('category', 'N/A')}\n\n")
            f.write(f"**Analyzed:** {result.get('analyzed_at', 'N/A')}\n\n")
            f.write(f"**Model:** {result.get('model', 'N/A')}\n\n")
            f.write("---\n\n")
            f.write(result['analysis'])
        print(f"  Saved: {md_path}")
    
    return json_path


def process_from_json(json_path: str, client, limit: int = None, 
                      category_filter: str = None, output_dir: str = "analyses",
                      model: str = "gemini-2.5-flash"):
    """Process multiple videos from youtube_videos.json"""
    
    with open(json_path, 'r') as f:
        data = json.load(f)
    
    Path(output_dir).mkdir(exist_ok=True)
    
    results = []
    errors = []
    count = 0
    skipped = 0
    
    for category in data['categories']:
        if category_filter and category['id'] != category_filter:
            continue
        
        print(f"\n{'#'*60}")
        print(f"# Category: {category['name']}")
        print(f"{'#'*60}")
        
        for video in category['videos']:
            if limit and count >= limit:
                break
            
            # Skip playlists and channels
            if video.get('type') in ['playlist', 'channel']:
                print(f"\nSkipping {video['type']}: {video['title'][:50]}...")
                skipped += 1
                continue
            
            result = analyze_video(
                video_url=video['url'],
                client=client,
                title=video['title'],
                category=category['name'],
                model=model
            )
            
            if 'error' not in result:
                save_analysis(result, output_dir)
                results.append(result)
                count += 1
            else:
                errors.append(result)
            
            # Rate limiting - be nice to the API
            print("  Waiting 3s before next request...")
            time.sleep(3)
            
            if limit and count >= limit:
                break
    
    # Save summary
    summary = {
        "processed_at": datetime.now().isoformat(),
        "total_analyzed": len(results),
        "total_errors": len(errors),
        "total_skipped": skipped,
        "model": model,
        "videos": [
            {
                "title": r['title'], 
                "category": r['category'],
                "url": r['video_url']
            } for r in results
        ],
        "errors": [
            {
                "title": e.get('title'),
                "url": e.get('video_url'),
                "error": e.get('error')
            } for e in errors
        ]
    }
    
    summary_path = Path(output_dir) / "_summary.json"
    with open(summary_path, 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\n{'='*60}")
    print(f"COMPLETE!")
    print(f"  Analyzed: {len(results)} videos")
    print(f"  Errors: {len(errors)}")
    print(f"  Skipped: {skipped} (playlists/channels)")
    print(f"  Output: {output_dir}/")
    print(f"{'='*60}")
    
    return results


def compile_frameworks(analyses_dir: str = "analyses", output_dir: str = "frameworks"):
    """Compile all analyses into organized framework documents"""
    
    Path(output_dir).mkdir(exist_ok=True)
    
    # Load all analyses
    analyses = []
    for json_file in Path(analyses_dir).glob("*.json"):
        if json_file.name.startswith("_"):
            continue
        try:
            with open(json_file) as f:
                data = json.load(f)
                if 'analysis' in data:
                    analyses.append(data)
        except:
            continue
    
    if not analyses:
        print("No analyses found to compile")
        return
    
    # Group by category
    by_category = {}
    for a in analyses:
        cat = a.get('category', 'Uncategorized')
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append(a)
    
    # Create master document
    master_path = Path(output_dir) / "all_frameworks.md"
    with open(master_path, 'w') as f:
        f.write("# Sales Training Frameworks - Complete Analysis\n\n")
        f.write(f"*Compiled from {len(analyses)} video analyses on {datetime.now().strftime('%Y-%m-%d')}*\n\n")
        f.write("---\n\n")
        f.write("## Table of Contents\n\n")
        
        for cat in sorted(by_category.keys()):
            anchor = cat.lower().replace(' ', '-').replace('&', 'and')
            f.write(f"- [{cat}](#{anchor}) ({len(by_category[cat])} videos)\n")
        
        f.write("\n---\n\n")
        
        for cat in sorted(by_category.keys()):
            f.write(f"## {cat}\n\n")
            
            for item in by_category[cat]:
                f.write(f"### {item.get('title', 'Unknown')}\n\n")
                f.write(f"**Source:** [{item.get('video_url', 'N/A')}]({item.get('video_url', '')})\n\n")
                f.write(item.get('analysis', 'No analysis available'))
                f.write("\n\n---\n\n")
    
    print(f"✓ Compiled {len(analyses)} analyses into {master_path}")
    
    # Create category-specific documents
    for cat, items in by_category.items():
        cat_filename = cat.lower().replace(' ', '_').replace('&', 'and')
        cat_path = Path(output_dir) / f"{cat_filename}.md"
        
        with open(cat_path, 'w') as f:
            f.write(f"# {cat} - Sales Frameworks\n\n")
            f.write(f"*{len(items)} videos analyzed*\n\n")
            f.write("---\n\n")
            
            for item in items:
                f.write(f"## {item.get('title', 'Unknown')}\n\n")
                f.write(f"**Source:** [{item.get('video_url', 'N/A')}]({item.get('video_url', '')})\n\n")
                f.write(item.get('analysis', 'No analysis available'))
                f.write("\n\n---\n\n")
        
        print(f"✓ Created {cat_path}")
    
    print(f"\nAll frameworks compiled to {output_dir}/")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Analyze YouTube sales training videos with Gemini")
    parser.add_argument("url", nargs="?", help="YouTube video URL")
    parser.add_argument("--json", help="Path to youtube_videos.json")
    parser.add_argument("--limit", type=int, help="Limit number of videos")
    parser.add_argument("--category", help="Only process specific category ID")
    parser.add_argument("--api-key", help="Gemini API key (or set GEMINI_API_KEY env var)")
    parser.add_argument("--model", default="gemini-2.5-flash", help="Gemini model to use")
    parser.add_argument("--compile", action="store_true", help="Compile existing analyses into frameworks doc")
    parser.add_argument("--output", default="analyses", help="Output directory for analyses")
    
    args = parser.parse_args()
    
    if args.compile:
        compile_frameworks(args.output)
        sys.exit(0)
    
    # Setup Gemini
    try:
        client = setup_gemini(args.api_key)
    except ValueError as e:
        print(f"Error: {e}")
        print("\nTo get a Gemini API key:")
        print("1. Go to https://makersuite.google.com/app/apikey")
        print("2. Create a new API key")
        print("3. Set it: export GEMINI_API_KEY='your-key'")
        sys.exit(1)
    
    if args.json:
        process_from_json(
            args.json, 
            client, 
            limit=args.limit, 
            category_filter=args.category,
            output_dir=args.output,
            model=args.model
        )
    elif args.url:
        result = analyze_video(args.url, client, model=args.model)
        if 'analysis' in result:
            save_analysis(result, args.output)
            print("\n" + "="*60)
            print("ANALYSIS:")
            print("="*60)
            print(result['analysis'])
    else:
        parser.print_help()
