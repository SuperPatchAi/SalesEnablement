#!/usr/bin/env python3
"""
Migrate Practitioners to Supabase

This script loads practitioner data from JSON files and inserts/updates them
in Supabase. It handles enrichment data and can run incrementally.

Usage:
    # Full migration
    python migrate_to_supabase.py
    
    # Dry run (no actual inserts)
    python migrate_to_supabase.py --dry-run
    
    # Specific file
    python migrate_to_supabase.py --input /path/to/practitioners.json

Requirements:
    pip install supabase python-dotenv
"""

import argparse
import json
import os
import sys
from datetime import datetime
from typing import Optional

try:
    from supabase import create_client, Client
    from dotenv import load_dotenv
except ImportError:
    print("Required packages not installed. Run:")
    print("  pip install supabase python-dotenv")
    sys.exit(1)

# Load environment variables from multiple locations
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)

# Try loading from various .env locations
env_paths = [
    os.path.join(project_root, 'superpatch-frontend', '.env.local'),
    os.path.join(project_root, 'superpatch-frontend', '.env'),
    os.path.join(project_root, '.env.local'),
    os.path.join(project_root, '.env'),
    '.env.local',
    '.env',
]

for env_path in env_paths:
    if os.path.exists(env_path):
        load_dotenv(env_path)
        print(f"Loaded environment from: {env_path}")
        break
else:
    load_dotenv()  # Try default

# Supabase configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

BATCH_SIZE = 500  # Number of records to insert per batch


def get_supabase_client() -> Client:
    """Create and return a Supabase client."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: Supabase credentials not found.")
        print("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.")
        print("\nYou can also create a .env file with:")
        print("  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co")
        print("  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key")
        sys.exit(1)
    
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def load_practitioners(filepath: str) -> list[dict]:
    """Load practitioners from JSON file."""
    print(f"Loading practitioners from: {filepath}")
    
    with open(filepath, 'r') as f:
        data = json.load(f)
    
    if isinstance(data, dict) and 'practitioners' in data:
        practitioners = data['practitioners']
        metadata = data.get('metadata', {})
        print(f"  Metadata: {json.dumps(metadata, indent=2)}")
    else:
        practitioners = data
    
    print(f"  Loaded {len(practitioners)} practitioners")
    return practitioners


def transform_practitioner(p: dict) -> dict:
    """Transform a practitioner record for Supabase insertion."""
    # Handle enrichment data
    enrichment = p.get('enrichment')
    enrichment_status = 'pending'
    enriched_at = None
    
    if enrichment:
        if enrichment.get('success'):
            enrichment_status = 'success'
        elif enrichment.get('error') or enrichment.get('success') is False:
            enrichment_status = 'failed'
        elif enrichment.get('skipped'):
            enrichment_status = 'skipped'
        else:
            enrichment_status = 'success' if enrichment.get('data') else 'pending'
        
        enriched_at = enrichment.get('scraped_at')
    
    # Parse scraped_at timestamp
    scraped_at = p.get('scraped_at')
    if scraped_at and not scraped_at.endswith('Z'):
        # Ensure ISO format
        try:
            dt = datetime.fromisoformat(scraped_at.replace('Z', '+00:00'))
            scraped_at = dt.isoformat()
        except:
            pass
    
    # Helper to safely convert to float
    def safe_float(val):
        if val is None or val == '':
            return None
        try:
            return float(val)
        except (ValueError, TypeError):
            return None
    
    # Helper to safely convert to int
    def safe_int(val):
        if val is None or val == '':
            return None
        try:
            return int(val)
        except (ValueError, TypeError):
            return None
    
    return {
        'id': p['id'],
        'name': p['name'],
        'practitioner_type': p.get('practitioner_type', 'unknown'),
        'address': p.get('address'),
        'city': p.get('city'),
        'province': p.get('province'),
        'phone': p.get('phone'),
        'website': p.get('website'),
        'rating': safe_float(p.get('rating')),
        'review_count': safe_int(p.get('review_count')),
        'business_status': p.get('business_status'),
        'google_maps_uri': p.get('google_maps_uri'),
        'latitude': safe_float(p.get('latitude')),
        'longitude': safe_float(p.get('longitude')),
        'scraped_at': scraped_at,
        'notes': p.get('notes'),
        'enrichment': json.dumps(enrichment) if enrichment else None,
        'enrichment_status': enrichment_status,
        'enriched_at': enriched_at,
    }


def migrate_practitioners(
    supabase: Client,
    practitioners: list[dict],
    dry_run: bool = False
) -> dict:
    """
    Migrate practitioners to Supabase in batches.
    
    Returns statistics about the migration.
    """
    stats = {
        'total': len(practitioners),
        'inserted': 0,
        'updated': 0,
        'errors': 0,
        'error_details': []
    }
    
    # Transform all practitioners
    print("\nTransforming practitioner data...")
    transformed = []
    for p in practitioners:
        try:
            transformed.append(transform_practitioner(p))
        except Exception as e:
            stats['errors'] += 1
            stats['error_details'].append({
                'id': p.get('id', 'unknown'),
                'error': str(e)
            })
            if len(stats['error_details']) <= 5:
                print(f"  Error transforming {p.get('id', 'unknown')}: {e}")
    
    print(f"  Transformed {len(transformed)} practitioners")
    
    if dry_run:
        print("\n[DRY RUN] Would insert/update practitioners. Sample:")
        if transformed:
            sample = transformed[0]
            for key, value in sample.items():
                if key == 'enrichment' and value:
                    print(f"  {key}: <{len(value)} chars>")
                else:
                    print(f"  {key}: {value}")
        return stats
    
    # Batch upsert
    print(f"\nUpserting {len(transformed)} practitioners in batches of {BATCH_SIZE}...")
    
    for i in range(0, len(transformed), BATCH_SIZE):
        batch = transformed[i:i + BATCH_SIZE]
        batch_num = i // BATCH_SIZE + 1
        total_batches = (len(transformed) + BATCH_SIZE - 1) // BATCH_SIZE
        
        try:
            # Upsert - insert or update on conflict
            result = supabase.table('practitioners').upsert(
                batch,
                on_conflict='id'
            ).execute()
            
            stats['inserted'] += len(batch)
            print(f"  Batch {batch_num}/{total_batches}: {len(batch)} records ✓")
            
        except Exception as e:
            stats['errors'] += len(batch)
            error_msg = str(e)
            stats['error_details'].append({
                'batch': batch_num,
                'error': error_msg[:200]
            })
            print(f"  Batch {batch_num}/{total_batches}: ERROR - {error_msg[:100]}")
    
    return stats


def verify_migration(supabase: Client, expected_count: int) -> bool:
    """Verify the migration was successful."""
    print("\nVerifying migration...")
    
    try:
        # Count total records
        result = supabase.table('practitioners').select('id', count='exact').execute()
        actual_count = result.count
        
        print(f"  Expected: {expected_count}")
        print(f"  Actual:   {actual_count}")
        
        if actual_count >= expected_count * 0.95:  # Allow 5% tolerance
            print("  ✓ Migration verified successfully!")
            return True
        else:
            print("  ⚠ Count mismatch - some records may have failed")
            return False
            
    except Exception as e:
        print(f"  Error verifying: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Migrate practitioners to Supabase")
    parser.add_argument(
        "--input",
        default=None,
        help="Path to practitioners JSON file"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be done without making changes"
    )
    parser.add_argument(
        "--verify-only",
        action="store_true",
        help="Only verify existing data, don't migrate"
    )
    
    args = parser.parse_args()
    
    # Find input file
    if args.input:
        input_file = args.input
    else:
        # Try common locations
        possible_paths = [
            "../superpatch-frontend/public/data/practitioners.json",
            "../canadian_practitioners/all_practitioners_merged.json",
            "../canadian_practitioners/all_practitioners_latest.json",
            "superpatch-frontend/public/data/practitioners.json",
        ]
        
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        for p in possible_paths:
            full_path = os.path.join(script_dir, p)
            if os.path.exists(full_path):
                input_file = full_path
                break
        else:
            print("Error: Could not find practitioners JSON file.")
            print("Tried:", possible_paths)
            print("\nUse --input to specify the file path.")
            sys.exit(1)
    
    if not os.path.exists(input_file):
        print(f"Error: File not found: {input_file}")
        sys.exit(1)
    
    # Connect to Supabase
    print("=" * 60)
    print("MIGRATE PRACTITIONERS TO SUPABASE")
    print("=" * 60)
    print(f"\nSupabase URL: {SUPABASE_URL}")
    print(f"Input file: {input_file}")
    
    supabase = get_supabase_client()
    
    # Verify only mode
    if args.verify_only:
        practitioners = load_practitioners(input_file)
        verify_migration(supabase, len(practitioners))
        return
    
    # Load and migrate
    practitioners = load_practitioners(input_file)
    
    if not practitioners:
        print("No practitioners to migrate.")
        return
    
    # Run migration
    stats = migrate_practitioners(supabase, practitioners, dry_run=args.dry_run)
    
    # Print summary
    print("\n" + "=" * 60)
    print("MIGRATION SUMMARY")
    print("=" * 60)
    print(f"  Total practitioners: {stats['total']}")
    print(f"  Successfully upserted: {stats['inserted']}")
    print(f"  Errors: {stats['errors']}")
    
    if stats['error_details']:
        print("\n  Error samples:")
        for err in stats['error_details'][:5]:
            print(f"    - {err}")
    
    # Verify
    if not args.dry_run and stats['errors'] == 0:
        verify_migration(supabase, stats['total'])
    
    print("\n✓ Migration complete!")


if __name__ == "__main__":
    main()
