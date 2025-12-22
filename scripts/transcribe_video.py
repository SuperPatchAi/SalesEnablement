#!/usr/bin/env python3
"""
YouTube Video Transcription Pipeline
Downloads audio from YouTube videos and transcribes using faster-whisper
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime

# Add local bin to path
os.environ['PATH'] = os.environ.get('PATH', '') + ':/home/ubuntu/.local/bin'

def download_audio(video_url: str, output_dir: str = "audio") -> str:
    """Download audio from YouTube video using yt-dlp"""
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Extract video ID for filename
    if "watch?v=" in video_url:
        video_id = video_url.split("watch?v=")[1].split("&")[0]
    elif "youtu.be/" in video_url:
        video_id = video_url.split("youtu.be/")[1].split("?")[0]
    else:
        video_id = video_url.split("/")[-1]
    
    output_path = f"{output_dir}/{video_id}.mp3"
    
    if os.path.exists(output_path):
        print(f"Audio already exists: {output_path}")
        return output_path
    
    print(f"Downloading audio from: {video_url}")
    
    cmd = [
        "yt-dlp",
        "-x",  # Extract audio
        "--audio-format", "mp3",
        "--audio-quality", "0",  # Best quality
        "-o", output_path,
        "--no-playlist",  # Don't download playlist
        "--quiet",
        "--no-warnings",
        video_url
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True)
        print(f"Downloaded: {output_path}")
        return output_path
    except subprocess.CalledProcessError as e:
        print(f"Error downloading: {e.stderr}")
        return None


def transcribe_audio(audio_path: str, model_size: str = "base") -> dict:
    """Transcribe audio using faster-whisper"""
    from faster_whisper import WhisperModel
    
    print(f"Loading Whisper model ({model_size})...")
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    
    print(f"Transcribing: {audio_path}")
    segments, info = model.transcribe(audio_path, beam_size=5)
    
    print(f"Detected language: {info.language} (probability: {info.language_probability:.2f})")
    
    # Collect all segments
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
        "language": info.language,
        "language_probability": info.language_probability,
        "duration": info.duration,
        "segments": transcript_segments,
        "full_text": " ".join(full_text)
    }


def process_video(video_url: str, title: str = None, category: str = None, 
                  audio_dir: str = "audio", transcript_dir: str = "transcripts",
                  model_size: str = "base") -> dict:
    """Full pipeline: download audio and transcribe"""
    
    # Download audio
    audio_path = download_audio(video_url, audio_dir)
    if not audio_path:
        return {"error": "Failed to download audio", "url": video_url}
    
    # Transcribe
    transcript = transcribe_audio(audio_path, model_size)
    
    # Add metadata
    result = {
        "url": video_url,
        "title": title,
        "category": category,
        "audio_path": audio_path,
        "transcribed_at": datetime.now().isoformat(),
        **transcript
    }
    
    # Save transcript
    Path(transcript_dir).mkdir(parents=True, exist_ok=True)
    video_id = Path(audio_path).stem
    transcript_path = f"{transcript_dir}/{video_id}.json"
    
    with open(transcript_path, 'w') as f:
        json.dump(result, f, indent=2)
    
    print(f"Saved transcript: {transcript_path}")
    print(f"Duration: {transcript['duration']:.1f}s | Words: {len(transcript['full_text'].split())}")
    
    return result


def process_videos_from_json(json_path: str, limit: int = None, category_filter: str = None):
    """Process multiple videos from the youtube_videos.json file"""
    
    with open(json_path, 'r') as f:
        data = json.load(f)
    
    results = []
    count = 0
    
    for category in data['categories']:
        if category_filter and category['id'] != category_filter:
            continue
            
        for video in category['videos']:
            if limit and count >= limit:
                break
            
            # Skip playlists and channels
            if video.get('type') in ['playlist', 'channel']:
                print(f"Skipping {video['type']}: {video['title']}")
                continue
            
            print(f"\n{'='*60}")
            print(f"Processing: {video['title']}")
            print(f"Category: {category['name']}")
            print(f"{'='*60}")
            
            result = process_video(
                video_url=video['url'],
                title=video['title'],
                category=category['name']
            )
            results.append(result)
            count += 1
            
            if limit and count >= limit:
                break
    
    return results


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Single video:  python transcribe_video.py <youtube_url>")
        print("  From JSON:     python transcribe_video.py --json youtube_videos.json [--limit N] [--category ID]")
        sys.exit(1)
    
    if sys.argv[1] == "--json":
        json_path = sys.argv[2] if len(sys.argv) > 2 else "youtube_videos.json"
        limit = None
        category = None
        
        for i, arg in enumerate(sys.argv):
            if arg == "--limit" and i + 1 < len(sys.argv):
                limit = int(sys.argv[i + 1])
            if arg == "--category" and i + 1 < len(sys.argv):
                category = sys.argv[i + 1]
        
        results = process_videos_from_json(json_path, limit=limit, category_filter=category)
        print(f"\nProcessed {len(results)} videos")
    else:
        # Single video
        video_url = sys.argv[1]
        result = process_video(video_url)
        print(f"\nTranscript preview (first 500 chars):")
        print(result.get('full_text', '')[:500])
