#!/usr/bin/env python3
"""
Restore edge labels to all contextual JSON files from backups that have full labels.
"""

import json
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent

# Map of contextual files to their backup source with full labels
RESTORE_MAP = {
    "Acupuncturists_contextual.json": "backups/Acupuncturists_backup_20260114_184300.json",
    "Chiropractors_contextual.json": "backups/Chiropractors_backup_20260114_184249.json",
    "Functional_Medicine_contextual.json": "backups/Functional_Medicine_backup_20260114_184257.json",
    "Integrative_Medicine_contextual.json": "backups/Integrative_Medicine_backup_20260114_184257.json",
}

def restore_labels(contextual_file: str, backup_file: str):
    """Restore edge labels from backup to contextual file."""
    print(f"\n=== {contextual_file} ===")
    
    contextual_path = SCRIPT_DIR / contextual_file
    backup_path = SCRIPT_DIR / backup_file
    
    # Load both files
    with open(backup_path) as f:
        backup = json.load(f)
    
    with open(contextual_path) as f:
        contextual = json.load(f)
    
    # Create label map from backup: (source, target) -> label
    label_map = {}
    for edge in backup.get("edges", []):
        key = (edge["source"], edge["target"])
        label = edge.get("data", {}).get("label")
        if label:
            label_map[key] = label
    
    print(f"  Found {len(label_map)} edge labels in backup")
    
    # Apply labels to contextual edges
    labels_applied = 0
    for edge in contextual.get("edges", []):
        key = (edge["source"], edge["target"])
        if key in label_map:
            if "data" not in edge:
                edge["data"] = {}
            edge["data"]["label"] = label_map[key]
            labels_applied += 1
    
    print(f"  Applied {labels_applied} labels to {len(contextual['edges'])} edges")
    
    # Save updated contextual file
    with open(contextual_path, 'w') as f:
        json.dump(contextual, f, indent=2)
    print(f"  Saved: {contextual_file}")
    
    return labels_applied


def main():
    print("=" * 60)
    print("Restoring edge labels from backups")
    print("=" * 60)
    
    total_restored = 0
    for contextual, backup in RESTORE_MAP.items():
        restored = restore_labels(contextual, backup)
        total_restored += restored
    
    print("\n" + "=" * 60)
    print(f"COMPLETE: Restored {total_restored} total edge labels")
    print("=" * 60)
    
    # Verify all files
    print("\nVerification:")
    for file in ["Acupuncturists_contextual.json", "Chiropractors_contextual.json", 
                 "Functional_Medicine_contextual.json", "Integrative_Medicine_contextual.json",
                 "Massage_Therapists_contextual.json", "Naturopaths_contextual.json"]:
        path = SCRIPT_DIR / file
        with open(path) as f:
            data = json.load(f)
        total = len(data.get("edges", []))
        with_labels = len([e for e in data.get("edges", []) if e.get("data", {}).get("label")])
        status = "✓" if with_labels == total else "✗"
        print(f"  {status} {file}: {with_labels}/{total} edges with labels")


if __name__ == "__main__":
    main()
