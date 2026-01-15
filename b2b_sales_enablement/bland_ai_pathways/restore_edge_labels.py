#!/usr/bin/env python3
"""
Restore edge labels to Chiropractors_contextual.json from Chiropractors_expanded.json
"""

import json
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent

def main():
    # Load both files
    with open(SCRIPT_DIR / "Chiropractors_expanded.json") as f:
        expanded = json.load(f)
    
    with open(SCRIPT_DIR / "Chiropractors_contextual.json") as f:
        contextual = json.load(f)
    
    # Create label map from expanded: (source, target) -> label
    label_map = {}
    for edge in expanded.get("edges", []):
        key = (edge["source"], edge["target"])
        label = edge.get("data", {}).get("label")
        if label:
            label_map[key] = label
    
    print(f"Found {len(label_map)} edge labels in expanded version")
    
    # Apply labels to contextual edges
    labels_applied = 0
    for edge in contextual.get("edges", []):
        key = (edge["source"], edge["target"])
        if key in label_map:
            if "data" not in edge:
                edge["data"] = {}
            edge["data"]["label"] = label_map[key]
            labels_applied += 1
    
    print(f"Applied {labels_applied} labels to contextual edges (out of {len(contextual['edges'])} total)")
    
    # Save backup
    backup_path = SCRIPT_DIR / "backups" / "Chiropractors_contextual_before_labels.json"
    with open(backup_path, 'w') as f:
        json.dump(contextual, f, indent=2)
    print(f"Backup saved to: {backup_path}")
    
    # Save updated contextual file
    with open(SCRIPT_DIR / "Chiropractors_contextual.json", 'w') as f:
        json.dump(contextual, f, indent=2)
    print(f"Updated Chiropractors_contextual.json with edge labels")
    
    # Show sample
    print("\nSample of updated edges:")
    for edge in contextual["edges"][:5]:
        label = edge.get("data", {}).get("label", "(no label)")
        print(f"  {edge['source']} -> {edge['target']}: {label}")


if __name__ == "__main__":
    main()
