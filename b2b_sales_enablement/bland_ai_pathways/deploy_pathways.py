#!/usr/bin/env python3
"""
Bland.ai Pathway Deployment Script

Deploy the generated pathways to your Bland.ai account.

Usage:
    export BLAND_API_KEY="your-api-key"
    python deploy_pathways.py
"""

import json
import os
import requests
from pathlib import Path

BLAND_API_BASE = "https://api.bland.ai/v1"
API_KEY = os.environ.get("BLAND_API_KEY")

def create_pathway(api_payload: dict) -> dict:
    """Create a pathway in Bland.ai"""
    if not API_KEY:
        raise ValueError("BLAND_API_KEY environment variable not set")
    
    response = requests.post(
        f"{BLAND_API_BASE}/convo_pathway",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json=api_payload
    )
    
    response.raise_for_status()
    return response.json()


def send_call(phone_number: str, pathway_id: str, from_number: str, prospect_data: dict = None) -> dict:
    """Send a call using a pathway"""
    if not API_KEY:
        raise ValueError("BLAND_API_KEY environment variable not set")
    
    payload = {
        "phone_number": phone_number,
        "pathway_id": pathway_id,
        "from": from_number,
        "voice": "nat",
        "record": True
    }
    
    if prospect_data:
        payload["request_data"] = prospect_data
    
    response = requests.post(
        f"{BLAND_API_BASE}/calls",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json=payload
    )
    
    response.raise_for_status()
    return response.json()


def main():
    """Deploy all pathways"""
    current_dir = Path(__file__).parent
    
    # Find all API payload files
    payload_files = list(current_dir.glob("*_api_payload.json"))
    
    print(f"Found {len(payload_files)} pathways to deploy")
    print()
    
    deployed_pathways = {}
    
    for payload_file in payload_files:
        print(f"Deploying: {payload_file.name}")
        
        with open(payload_file, 'r') as f:
            payload = json.load(f)
        
        try:
            result = create_pathway(payload)
            pathway_id = result.get("pathway_id")
            print(f"  ✓ Created pathway ID: {pathway_id}")
            deployed_pathways[payload_file.stem] = pathway_id
        except Exception as e:
            print(f"  ✗ Error: {str(e)}")
    
    # Save deployed pathway IDs
    if deployed_pathways:
        with open(current_dir / "deployed_pathway_ids.json", 'w') as f:
            json.dump(deployed_pathways, f, indent=2)
        print()
        print(f"Saved pathway IDs to deployed_pathway_ids.json")


if __name__ == "__main__":
    main()
