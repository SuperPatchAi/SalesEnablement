#!/usr/bin/env python3
"""
Merge enrichment data with base practitioner data.

Combines:
1. enriched_first_1000.json - First 1000 clinics with enrichment
2. enriched_remaining.json - Remaining ~9800 clinics with enrichment  
3. all_practitioners_latest.json - Base data (for practitioners without websites)

Output: A single JSON file with all practitioners, enriched where possible.
"""

import json
import argparse
from datetime import datetime
from pathlib import Path


def load_json(filepath: str) -> dict:
    """Load JSON file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


def merge_enrichment_data(
    base_file: str,
    enriched_files: list[str],
    output_file: str
) -> dict:
    """
    Merge base practitioner data with enrichment data.
    
    Strategy:
    1. Load all enriched data into a dict keyed by ID
    2. Load base data
    3. For each base practitioner:
       - If enriched version exists, use it
       - Otherwise, use base version (no enrichment)
    """
    print(f"\n{'='*60}")
    print("MERGING PRACTITIONER DATA")
    print(f"{'='*60}\n")
    
    # Load enriched data from all files
    enriched_by_id = {}
    total_enriched = 0
    
    for filepath in enriched_files:
        print(f"Loading enriched data: {filepath}")
        data = load_json(filepath)
        practitioners = data.get('practitioners', [])
        
        for p in practitioners:
            pid = p.get('id')
            if pid:
                enriched_by_id[pid] = p
        
        print(f"  → Loaded {len(practitioners)} practitioners")
        total_enriched += len(practitioners)
    
    print(f"\nTotal enriched practitioners: {total_enriched}")
    print(f"Unique enriched IDs: {len(enriched_by_id)}")
    
    # Load base data
    print(f"\nLoading base data: {base_file}")
    base_data = load_json(base_file)
    base_practitioners = base_data.get('practitioners', [])
    print(f"  → Loaded {len(base_practitioners)} practitioners")
    
    # Merge: prefer enriched version, fallback to base
    merged = []
    stats = {
        'total': 0,
        'enriched': 0,
        'not_enriched': 0,
        'with_emails': 0,
        'with_practitioners': 0,
        'multilingual': 0,
        'with_services': 0
    }
    
    for base_p in base_practitioners:
        pid = base_p.get('id')
        
        if pid in enriched_by_id:
            # Use enriched version
            practitioner = enriched_by_id[pid].copy()
            stats['enriched'] += 1
            
            # Count enrichment stats and clean up data
            enrichment = practitioner.get('enrichment', {})
            if enrichment.get('success'):
                data = enrichment.get('data', {})
                
                # Remove raw_text_preview (contains URLs that trigger false positive secret detection)
                if 'raw_text_preview' in data:
                    del data['raw_text_preview']
                
                if data.get('emails'):
                    stats['with_emails'] += 1
                if data.get('practitioners'):
                    stats['with_practitioners'] += 1
                if data.get('languages') and len(data.get('languages', [])) > 1:
                    stats['multilingual'] += 1
                if data.get('services'):
                    stats['with_services'] += 1
        else:
            # Use base version (no enrichment)
            practitioner = base_p.copy()
            stats['not_enriched'] += 1
        
        # Ensure latitude/longitude are numbers (not strings)
        if practitioner.get('latitude'):
            try:
                practitioner['latitude'] = float(practitioner['latitude'])
            except (ValueError, TypeError):
                practitioner['latitude'] = None
        if practitioner.get('longitude'):
            try:
                practitioner['longitude'] = float(practitioner['longitude'])
            except (ValueError, TypeError):
                practitioner['longitude'] = None
        
        # Ensure rating is a number
        if practitioner.get('rating'):
            try:
                practitioner['rating'] = float(practitioner['rating'])
            except (ValueError, TypeError):
                practitioner['rating'] = None
        
        # Ensure review_count is a number
        if practitioner.get('review_count'):
            try:
                practitioner['review_count'] = int(practitioner['review_count'])
            except (ValueError, TypeError):
                practitioner['review_count'] = None
        
        merged.append(practitioner)
        stats['total'] += 1
    
    # Create output structure
    output = {
        'metadata': {
            'merged_at': datetime.now().isoformat(),
            'total_count': len(merged),
            'enriched_count': stats['enriched'],
            'not_enriched_count': stats['not_enriched'],
            'sources': {
                'base': base_file,
                'enriched': enriched_files
            },
            'enrichment_stats': {
                'with_emails': stats['with_emails'],
                'with_team_members': stats['with_practitioners'],
                'multilingual': stats['multilingual'],
                'with_services': stats['with_services']
            }
        },
        'practitioners': merged
    }
    
    # Save output
    print(f"\nSaving merged data to: {output_file}")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print(f"\n{'='*60}")
    print("MERGE COMPLETE")
    print(f"{'='*60}")
    print(f"Total practitioners: {stats['total']}")
    print(f"  → With enrichment: {stats['enriched']}")
    print(f"  → Without enrichment: {stats['not_enriched']}")
    print(f"\nEnrichment breakdown:")
    print(f"  → With emails: {stats['with_emails']}")
    print(f"  → With team members: {stats['with_practitioners']}")
    print(f"  → Multilingual: {stats['multilingual']}")
    print(f"  → With services: {stats['with_services']}")
    print(f"\nOutput file: {output_file}")
    print(f"File size: {Path(output_file).stat().st_size / 1024 / 1024:.2f} MB")
    print(f"{'='*60}\n")
    
    return output


def main():
    parser = argparse.ArgumentParser(description='Merge enrichment data with base practitioner data')
    parser.add_argument(
        '--base', '-b',
        default='canadian_practitioners/all_practitioners_latest.json',
        help='Base practitioner JSON file'
    )
    parser.add_argument(
        '--enriched', '-e',
        nargs='+',
        default=[
            'canadian_practitioners/enriched_first_1000.json',
            'canadian_practitioners/enriched_remaining.json'
        ],
        help='Enriched data JSON files'
    )
    parser.add_argument(
        '--output', '-o',
        default='canadian_practitioners/practitioners_merged.json',
        help='Output merged JSON file'
    )
    
    args = parser.parse_args()
    
    merge_enrichment_data(
        base_file=args.base,
        enriched_files=args.enriched,
        output_file=args.output
    )


if __name__ == '__main__':
    main()
