#!/usr/bin/env python3
"""
Fix extractVars format in all pathway JSON files.

Converts:
- Plain strings: "varName" → ["varName", "string", "Extracted variable"]
- Objects: {"name": "varName", "description": "desc"} → ["varName", "string", "desc"]

To the Bland.ai expected format: [["varName", "varType", "varDescription"], ...]
"""

import json
from pathlib import Path
from datetime import datetime

# Default descriptions for common variables
DEFAULT_DESCRIPTIONS = {
    "appointment_time": "Scheduled appointment time",
    "appointment_type": "Type of appointment scheduled",
    "best_phone": "Best phone number to reach them",
    "callback_time": "Preferred callback time",
    "decision_maker_email": "Email of the decision maker",
    "decision_maker_name": "Name of the decision maker",
    "decision_maker_phone": "Phone number of the decision maker",
    "decision_maker_role": "Role/title of the decision maker",
    "dietary_notes": "Any dietary restrictions or notes",
    "expected_attendees": "Expected number of attendees",
    "has_manager": "Whether the practice has a manager",
    "hold_time_seconds": "Time spent on hold in seconds",
    "ivr_selections_made": "IVR menu selections made",
    "practice_address": "Address of the practice",
    "practice_name": "Name of the practice",
    "practitioner_email": "Email of the practitioner",
    "practitioner_name": "Name of the practitioner",
    "products_interested": "Products they showed interest in",
    "reached_human": "Whether we reached a human",
    "team_size": "Size of the practice team",
    "transferred_to": "Person/department transferred to",
    "wants_demo": "Whether they want a demo",
    "contact_name": "Name of the person we're speaking with",
    "contact_role": "Role of the person we're speaking with",
}


def convert_extractvars(extract_vars):
    """Convert extractVars to Bland.ai expected format."""
    if not extract_vars:
        return None
    
    converted = []
    for var in extract_vars:
        if isinstance(var, str):
            # Plain string: "varName" → ["varName", "string", "description"]
            description = DEFAULT_DESCRIPTIONS.get(var, f"Extracted {var.replace('_', ' ')}")
            converted.append([var, "string", description])
        elif isinstance(var, dict):
            # Object: {"name": "varName", "description": "desc"} → ["varName", "string", "desc"]
            name = var.get("name", "unknown")
            description = var.get("description", DEFAULT_DESCRIPTIONS.get(name, f"Extracted {name}"))
            var_type = var.get("type", "string")
            converted.append([name, var_type, description])
        elif isinstance(var, list) and len(var) >= 3:
            # Already in correct format
            converted.append(var)
        else:
            print(f"  WARNING: Unknown extractVars format: {var}")
    
    return converted if converted else None


def fix_pathway_file(file_path: Path) -> dict:
    """Fix extractVars in a single pathway JSON file."""
    print(f"\nProcessing: {file_path.name}")
    
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    nodes_fixed = 0
    total_vars_converted = 0
    
    for node in data.get('nodes', []):
        node_data = node.get('data', {})
        if 'extractVars' in node_data and node_data['extractVars']:
            old_vars = node_data['extractVars']
            new_vars = convert_extractvars(old_vars)
            if new_vars != old_vars:
                node_data['extractVars'] = new_vars
                nodes_fixed += 1
                total_vars_converted += len(new_vars) if new_vars else 0
                print(f"  Fixed node '{node_data.get('name', node['id'])}': {len(old_vars)} vars → {len(new_vars) if new_vars else 0} vars")
    
    # Create backup
    backup_dir = file_path.parent / "backups"
    backup_dir.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = backup_dir / f"{file_path.stem}_extractvars_backup_{timestamp}.json"
    
    with open(backup_path, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"  Backup saved: {backup_path.name}")
    
    # Save fixed file
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)
    
    return {
        "file": file_path.name,
        "nodes_fixed": nodes_fixed,
        "total_vars": total_vars_converted
    }


def main():
    script_dir = Path(__file__).parent
    files = list(script_dir.glob("*_contextual.json"))
    
    print("=" * 60)
    print("Fixing extractVars format in pathway JSON files")
    print("=" * 60)
    print(f"Found {len(files)} files to process")
    
    results = []
    for file_path in sorted(files):
        result = fix_pathway_file(file_path)
        results.append(result)
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    total_nodes = sum(r['nodes_fixed'] for r in results)
    total_vars = sum(r['total_vars'] for r in results)
    print(f"Files processed: {len(results)}")
    print(f"Total nodes fixed: {total_nodes}")
    print(f"Total variables converted: {total_vars}")
    
    # Verify format
    print("\n" + "=" * 60)
    print("VERIFICATION - Sample extractVars after fix:")
    print("=" * 60)
    sample_file = files[0] if files else None
    if sample_file:
        with open(sample_file, 'r') as f:
            data = json.load(f)
        for node in data.get('nodes', []):
            if node.get('data', {}).get('extractVars'):
                print(f"\nNode: {node['data'].get('name', node['id'])}")
                print(json.dumps(node['data']['extractVars'][:3], indent=2))
                print("...")
                break


if __name__ == "__main__":
    main()
