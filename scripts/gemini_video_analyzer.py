#!/usr/bin/env python3
"""
Gemini Video Analyzer for Sales Training Videos
Uses Google's Gemini API to analyze YouTube videos and extract sales frameworks

Setup:
    pip install google-generativeai

Usage:
    # Set your API key
    export GEMINI_API_KEY="your-api-key"
    
    # Single video
    python gemini_video_analyzer.py "https://www.youtube.com/watch?v=VIDEO_ID"
    
    # From JSON file
    python gemini_video_analyzer.py --json ../youtube_videos.json --limit 5
    
    # Specific category
    python gemini_video_analyzer.py --json ../youtube_videos.json --category closing
"""

import os
import sys
import json
import time
from pathlib import Path
from datetime import datetime

import google.generativeai as genai

# Analysis prompt for extracting sales frameworks
ANALYSIS_PROMPT = """Analyze this sales training video and extract the following information in a structured format:

## VIDEO ANALYSIS

### 1. MAIN TOPIC
What is the primary sales concept being taught?

### 2. KEY FRAMEWORKS & TECHNIQUES
List each specific sales technique or framework mentioned:
- Framework/Technique Name
- Step-by-step process (if applicable)
- Exact scripts or phrases to use
- When to use this technique

### 3. OBJECTION HANDLING
If objections are discussed:
- Common objections mentioned
- Recommended responses (exact wording if provided)
- Psychology behind the response

### 4. SCRIPTS & WORD TRACKS
Extract any specific scripts, phrases, or word tracks that salespeople should use:
- Opening lines
- Discovery questions  
- Closing phrases
- Follow-up messages

### 5. KEY TAKEAWAYS
Top 3-5 actionable insights a salesperson can immediately implement

### 6. SUPER PATCH APPLICATION
How can these techniques be specifically applied to selling Super Patch wellness products in a direct sales context?

Please be specific and include exact quotes/scripts when the speaker provides them."""


def setup_gemini(api_key: str = None):
    """Configure Gemini API"""
    api_key = api_key or os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found. Set it via environment variable or pass directly.")
    
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-1.5-flash")  # or "gemini-1.5-pro" for longer videos


def analyze_video(video_url: str, model, title: str = None, category: str = None) -> dict:
    """Analyze a YouTube video using Gemini"""
    
    print(f"\nAnalyzing: {title or video_url}")
    print(f"  URL: {video_url}")
    
    try:
        # Gemini can process YouTube URLs directly
        response = model.generate_content([
            video_url,
            ANALYSIS_PROMPT
        ])
        
        analysis = response.text
        
        result = {
            "video_url": video_url,
            "title": title,
            "category": category,
            "analyzed_at": datetime.now().isoformat(),
            "analysis": analysis,
            "model": "gemini-1.5-flash"
        }
        
        print(f"  ✓ Analysis complete ({len(analysis)} chars)")
        return result
        
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return {
            "video_url": video_url,
            "title": title,
            "category": category,
            "error": str(e)
        }


def process_from_json(json_path: str, model, limit: int = None, 
                      category_filter: str = None, output_dir: str = "analyses"):
    """Process multiple videos from youtube_videos.json"""
    
    with open(json_path, 'r') as f:
        data = json.load(f)
    
    Path(output_dir).mkdir(exist_ok=True)
    
    results = []
    count = 0
    
    for category in data['categories']:
        if category_filter and category['id'] != category_filter:
            continue
        
        print(f"\n{'='*60}")
        print(f"Category: {category['name']}")
        print(f"{'='*60}")
        
        for video in category['videos']:
            if limit and count >= limit:
                break
            
            # Skip playlists and channels (Gemini can't process these)
            if video.get('type') in ['playlist', 'channel']:
                print(f"\nSkipping {video['type']}: {video['title'][:50]}...")
                continue
            
            result = analyze_video(
                video_url=video['url'],
                model=model,
                title=video['title'],
                category=category['name']
            )
            
            if 'error' not in result:
                # Save individual analysis
                video_id = video['url'].split('watch?v=')[-1].split('&')[0]
                output_path = Path(output_dir) / f"{video_id}.json"
                
                with open(output_path, 'w') as f:
                    json.dump(result, f, indent=2)
                
                # Also save markdown version
                md_path = Path(output_dir) / f"{video_id}.md"
                with open(md_path, 'w') as f:
                    f.write(f"# {video['title']}\n\n")
                    f.write(f"**URL:** {video['url']}\n")
                    f.write(f"**Category:** {category['name']}\n")
                    f.write(f"**Analyzed:** {result['analyzed_at']}\n\n")
                    f.write("---\n\n")
                    f.write(result['analysis'])
                
                results.append(result)
                count += 1
            
            # Rate limiting - Gemini has quota limits
            time.sleep(2)
            
            if limit and count >= limit:
                break
    
    # Save combined summary
    summary_path = Path(output_dir) / "_summary.json"
    with open(summary_path, 'w') as f:
        json.dump({
            "processed_at": datetime.now().isoformat(),
            "total_analyzed": len(results),
            "videos": [{"title": r['title'], "category": r['category']} for r in results]
        }, f, indent=2)
    
    print(f"\n{'='*60}")
    print(f"COMPLETE: Analyzed {len(results)} videos")
    print(f"Results saved to: {output_dir}/")
    print(f"{'='*60}")
    
    return results


def compile_frameworks(analyses_dir: str = "analyses", output_file: str = "frameworks/all_frameworks.md"):
    """Compile all analyses into a single frameworks document"""
    
    Path("frameworks").mkdir(exist_ok=True)
    
    analyses = []
    for json_file in Path(analyses_dir).glob("*.json"):
        if json_file.name.startswith("_"):
            continue
        with open(json_file) as f:
            analyses.append(json.load(f))
    
    with open(output_file, 'w') as f:
        f.write("# Sales Training Frameworks - Compiled Analysis\n\n")
        f.write(f"*Compiled from {len(analyses)} video analyses*\n\n")
        f.write("---\n\n")
        
        # Group by category
        by_category = {}
        for a in analyses:
            cat = a.get('category', 'Uncategorized')
            if cat not in by_category:
                by_category[cat] = []
            by_category[cat].append(a)
        
        for category, items in by_category.items():
            f.write(f"## {category}\n\n")
            for item in items:
                f.write(f"### {item.get('title', 'Unknown')}\n\n")
                f.write(f"**Source:** {item.get('video_url', 'N/A')}\n\n")
                f.write(item.get('analysis', 'No analysis available'))
                f.write("\n\n---\n\n")
    
    print(f"Compiled {len(analyses)} analyses into {output_file}")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Analyze YouTube sales training videos with Gemini")
    parser.add_argument("url", nargs="?", help="YouTube video URL")
    parser.add_argument("--json", help="Path to youtube_videos.json")
    parser.add_argument("--limit", type=int, help="Limit number of videos")
    parser.add_argument("--category", help="Only process specific category ID")
    parser.add_argument("--api-key", help="Gemini API key (or set GEMINI_API_KEY env var)")
    parser.add_argument("--compile", action="store_true", help="Compile existing analyses into frameworks doc")
    parser.add_argument("--output", default="analyses", help="Output directory for analyses")
    
    args = parser.parse_args()
    
    if args.compile:
        compile_frameworks(args.output)
        sys.exit(0)
    
    # Setup Gemini
    try:
        model = setup_gemini(args.api_key)
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
            model, 
            limit=args.limit, 
            category_filter=args.category,
            output_dir=args.output
        )
    elif args.url:
        result = analyze_video(args.url, model)
        if 'analysis' in result:
            print("\n" + "="*60)
            print("ANALYSIS:")
            print("="*60)
            print(result['analysis'])
    else:
        parser.print_help()
