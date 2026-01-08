#!/usr/bin/env python3
"""
SuperPatch Sales Call with Knowledge Base Reference

Usage:
    python3 make_call_with_kb.py --phone "+15551234567" --pathway chiropractors
    
Or import and use:
    from make_call_with_kb import make_superpatch_call
    make_superpatch_call("+15551234567", "chiropractors")
"""

import argparse
import json
import subprocess

API_KEY = "org_8e83a10723c7ccbfa480b0d015920dddd0ae52af444a7691546e51f371dda789b471c727a9faf577ca2769"
KB_ID = "b671527d-0c2d-4a21-9586-033dad3b0255"

PATHWAYS = {
    "chiropractors": "cf2233ef-7fb2-49ff-af29-0eee47204e9f",
    "massage": "d202aad7-bcb6-478c-a211-b00877545e05",
    "naturopaths": "1d07d635-147e-4f69-a4cd-c124b33b073d",
    "integrative": "1c958dd7-e1ff-4f6d-b9a3-f80a369c26aa",
    "functional": "236dbd85-c74d-4774-a7af-4b5812015c68",
    "acupuncturists": "154f93f4-54a5-4900-92e8-0fa217508127",
}

def make_superpatch_call(phone_number: str, pathway_type: str, **kwargs) -> dict:
    """
    Make a SuperPatch sales call with Knowledge Base reference.
    
    Args:
        phone_number: Phone number to call (E.164 format: +15551234567)
        pathway_type: One of: chiropractors, massage, naturopaths, integrative, functional, acupuncturists
        **kwargs: Additional call parameters (voice, record, etc.)
    
    Returns:
        API response as dict
    """
    if pathway_type not in PATHWAYS:
        raise ValueError(f"Unknown pathway: {pathway_type}. Available: {list(PATHWAYS.keys())}")
    
    payload = {
        "phone_number": phone_number,
        "pathway_id": PATHWAYS[pathway_type],
        "knowledge_base": KB_ID,  # <-- This references our SuperPatch KB!
        "voice": kwargs.get("voice", "78c8543e-e5fe-448e-8292-20a7b8c45247"),
        "first_sentence": kwargs.get("first_sentence", "Hi, this is Jennifer with SuperPatch."),
        "wait_for_greeting": kwargs.get("wait_for_greeting", True),
        "record": kwargs.get("record", True),
        "max_duration": kwargs.get("max_duration", 15),  # 15 minutes max
    }
    
    # Add any extra parameters
    for key in ["from_number", "webhook", "metadata", "transfer_phone_number"]:
        if key in kwargs:
            payload[key] = kwargs[key]
    
    cmd = f'''curl -s -X POST "https://api.bland.ai/v1/calls" \
        -H "authorization: {API_KEY}" \
        -H "Content-Type: application/json" \
        -d '{json.dumps(payload)}' '''
    
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    
    try:
        return json.loads(result.stdout)
    except:
        return {"error": result.stdout, "stderr": result.stderr}


def make_batch_calls(phone_numbers: list, pathway_type: str, **kwargs) -> list:
    """Make multiple calls using the same pathway."""
    results = []
    for phone in phone_numbers:
        result = make_superpatch_call(phone, pathway_type, **kwargs)
        results.append({"phone": phone, "result": result})
        print(f"Called {phone}: {result.get('status', result.get('error', 'unknown'))}")
    return results


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Make SuperPatch sales calls")
    parser.add_argument("--phone", required=True, help="Phone number (E.164 format)")
    parser.add_argument("--pathway", required=True, choices=PATHWAYS.keys(), help="Pathway type")
    parser.add_argument("--voice", default=78c8543e-e5fe-448e-8292-20a7b8c45247, help="Voice to use")
    parser.add_argument("--no-record", action="store_true", help="Don't record call")
    
    args = parser.parse_args()
    
    result = make_superpatch_call(
        args.phone, 
        args.pathway,
        voice=args.voice,
        record=not args.no_record
    )
    
    print(json.dumps(result, indent=2))
