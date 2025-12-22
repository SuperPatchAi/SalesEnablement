#!/usr/bin/env python3
"""
Local YouTube Transcription Pipeline for Mac
Run this on your local Mac to transcribe sales training videos

Setup:
    pip install yt-dlp faster-whisper youtube-transcript-api

Usage:
    # Single video
    python local_transcribe.py "https://www.youtube.com/watch?v=VIDEO_ID"
    
    # From JSON file (processes all videos)
    python local_transcribe.py --json ../youtube_videos.json --limit 5
    
    # Specific category only
    python local_transcribe.py --json ../youtube_videos.json --category objection-handling
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime

def get_transcript_from_api(video_id: str) -> dict:
    """Try to get transcript directly from YouTube's captions API (faster)"""
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        
        api = YouTubeTranscriptApi()
        transcripts = api.list(video_id)
        
        # Try English first, then auto-generated
        for lang in ['en', 'en-US', 'en-GB']:
            try:
                transcript = transcripts.find_transcript([lang]).fetch()
                full_text = " ".join([entry['text'] for entry in transcript])
                return {
                    "method": "youtube_api",
                    "language": lang,
                    "segments": transcript,
                    "full_text": full_text
                }
            except:
                continue
        
        # Try any available transcript
        for t in transcripts:
            transcript = t.fetch()
            full_text = " ".join([entry['text'] for entry in transcript])
            return {
                "method": "youtube_api",
                "language": t.language_code,
                "segments": transcript,
                "full_text": full_text
            }
            
    except Exception as e:
        print(f"  YouTube API failed: {e}")
        return None


def download_and_transcribe(video_url: str, video_id: str, model_size: str = "base") -> dict:
    """Download audio and transcribe with Whisper (slower but more reliable)"""
    from faster_whisper import WhisperModel
    
    audio_dir = Path("audio")
    audio_dir.mkdir(exist_ok=True)
    audio_path = audio_dir / f"{video_id}.mp3"
    
    # Download audio if not exists
    if not audio_path.exists():
        print(f"  Downloading audio...")
        cmd = [
            "yt-dlp",
            "-x",
            "--audio-format", "mp3",
            "--audio-quality", "0",
            "-o", str(audio_path),
            "--no-playlist",
            "--quiet",
            video_url
        ]
        try:
            subprocess.run(cmd, check=True, capture_output=True, text=True)
        except subprocess.CalledProcessError as e:
            print(f"  Download failed: {e.stderr}")
            return None
    
    # Transcribe
    print(f"  Transcribing with Whisper ({model_size})...")
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    segments, info = model.transcribe(str(audio_path), beam_size=5)
    
    transcript_segments = []
    full_text = []
    
    for segment in segments:
        transcript_segments.append({
            "start": segment.start,
            "end": segment.end,
            "text": segment.text.strip()
        })
        full_text.append(segment.text.strip())
    
    return {
        "method": "whisper",
        "model": model_size,
        "language": info.language,
        "duration": info.duration,
        "segments": transcript_segments,
        "full_text": " ".join(full_text)
    }


def extract_video_id(url: str) -> str:
    """Extract video ID from YouTube URL"""
    if "watch?v=" in url:
        return url.split("watch?v=")[1].split("&")[0]
    elif "youtu.be/" in url:
        return url.split("youtu.be/")[1].split("?")[0]
    else:
        return url.split("/")[-1]


def process_video(video_url: str, title: str = None, category: str = None, 
                  use_whisper: bool = False, model_size: str = "base") -> dict:
    """Process a single video - try API first, fall back to Whisper"""
    
    video_id = extract_video_id(video_url)
    print(f"\nProcessing: {title or video_id}")
    
    # Try YouTube transcript API first (faster)
    if not use_whisper:
        print("  Trying YouTube transcript API...")
        result = get_transcript_from_api(video_id)
        if result:
            print(f"  ✓ Got transcript via API ({len(result['full_text'].split())} words)")
        else:
            print("  Falling back to Whisper...")
            result = download_and_transcribe(video_url, video_id, model_size)
    else:
        result = download_and_transcribe(video_url, video_id, model_size)
    
    if not result:
        return {"error": "Failed to transcribe", "url": video_url}
    
    # Add metadata
    output = {
        "video_id": video_id,
        "url": video_url,
        "title": title,
        "category": category,
        "transcribed_at": datetime.now().isoformat(),
        **result
    }
    
    # Save transcript
    transcript_dir = Path("transcripts")
    transcript_dir.mkdir(exist_ok=True)
    
    output_path = transcript_dir / f"{video_id}.json"
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"  ✓ Saved: {output_path}")
    print(f"  Words: {len(result['full_text'].split())} | Method: {result['method']}")
    
    return output


def process_from_json(json_path: str, limit: int = None, category_filter: str = None,
                      use_whisper: bool = False):
    """Process videos from youtube_videos.json"""
    
    with open(json_path, 'r') as f:
        data = json.load(f)
    
    results = []
    count = 0
    skipped = 0
    
    for category in data['categories']:
        if category_filter and category['id'] != category_filter:
            continue
        
        print(f"\n{'='*60}")
        print(f"Category: {category['name']}")
        print(f"{'='*60}")
        
        for video in category['videos']:
            if limit and count >= limit:
                break
            
            # Skip playlists and channels
            if video.get('type') in ['playlist', 'channel']:
                print(f"\nSkipping {video['type']}: {video['title'][:50]}...")
                skipped += 1
                continue
            
            result = process_video(
                video_url=video['url'],
                title=video['title'],
                category=category['name'],
                use_whisper=use_whisper
            )
            
            if 'error' not in result:
                results.append(result)
                count += 1
            
            if limit and count >= limit:
                break
    
    # Save summary
    summary = {
        "processed_at": datetime.now().isoformat(),
        "total_processed": len(results),
        "total_skipped": skipped,
        "videos": [{"video_id": r['video_id'], "title": r['title'], "words": len(r['full_text'].split())} for r in results]
    }
    
    with open("transcripts/_summary.json", 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\n{'='*60}")
    print(f"COMPLETE: Processed {len(results)} videos, skipped {skipped}")
    print(f"{'='*60}")
    
    return results


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Transcribe YouTube sales training videos")
    parser.add_argument("url", nargs="?", help="YouTube video URL")
    parser.add_argument("--json", help="Path to youtube_videos.json")
    parser.add_argument("--limit", type=int, help="Limit number of videos to process")
    parser.add_argument("--category", help="Only process specific category ID")
    parser.add_argument("--whisper", action="store_true", help="Force Whisper instead of API")
    parser.add_argument("--model", default="base", help="Whisper model size (tiny/base/small/medium/large)")
    
    args = parser.parse_args()
    
    if args.json:
        process_from_json(args.json, limit=args.limit, category_filter=args.category, use_whisper=args.whisper)
    elif args.url:
        process_video(args.url, use_whisper=args.whisper)
    else:
        parser.print_help()
