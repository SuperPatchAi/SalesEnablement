#!/usr/bin/env python3
"""
Bland.ai Conversational Pathway Generator for SuperPatch B2B Sales

This script parses practitioner word track markdown files and generates
Bland.ai Conversational Pathway JSON files that can be deployed via API.

Usage:
    python bland_ai_pathway_generator.py

Output:
    - JSON pathway files for each practitioner type
    - Ready to deploy via Bland.ai API
"""

import json
import os
import re
import uuid
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from pathlib import Path


# =============================================================================
# Bland.ai Pathway Data Structures
# =============================================================================

@dataclass
class PathwayEdge:
    """Edge connecting two nodes in a pathway"""
    id: str
    source: str
    target: str
    label: str = ""
    condition: str = ""
    
    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "source": self.source,
            "target": self.target,
            "label": self.label,
            "data": {
                "condition": self.condition
            } if self.condition else {}
        }


@dataclass
class PathwayNode:
    """Node in a Bland.ai Conversational Pathway"""
    id: str
    name: str
    type: str  # "Default", "End Call", "Transfer Call", "Knowledge Base", "Wait for Response", "Webhook"
    prompt: str
    is_start: bool = False
    global_node: bool = False
    static_text: bool = False
    extract_variables: List[Dict] = field(default_factory=list)
    position_x: float = 0
    position_y: float = 0
    
    def to_dict(self) -> Dict:
        node_data = {
            "id": self.id,
            "type": self.type,
            "position": {
                "x": self.position_x,
                "y": self.position_y
            },
            "data": {
                "name": self.name,
                "text": self.prompt,  # Bland.ai uses "text" not "prompt"
                "isStart": self.is_start,  # isStart goes inside data
                "globalNode": self.global_node,
            }
        }
        
        if self.static_text:
            node_data["data"]["staticText"] = True
            
        if self.extract_variables:
            node_data["data"]["extractVars"] = self.extract_variables
            
        return node_data


@dataclass
class BlandPathway:
    """Complete Bland.ai Conversational Pathway"""
    name: str
    description: str
    nodes: List[PathwayNode] = field(default_factory=list)
    edges: List[PathwayEdge] = field(default_factory=list)
    global_prompt: str = ""
    
    def to_dict(self) -> Dict:
        return {
            "name": self.name,
            "description": self.description,
            "nodes": [node.to_dict() for node in self.nodes],
            "edges": [edge.to_dict() for edge in self.edges],
            "globalPrompt": self.global_prompt
        }


# =============================================================================
# Word Track Parser
# =============================================================================

@dataclass
class ParsedWordTrack:
    """Parsed content from a word track markdown file"""
    practitioner_type: str
    title: str
    target: str
    business_models: str
    
    # Understanding section
    practice_philosophy: str = ""
    why_ideal_partners: List[str] = field(default_factory=list)
    pain_points: List[str] = field(default_factory=list)
    patient_demographics: List[str] = field(default_factory=list)
    
    # Product recommendations
    primary_recommendations: List[Dict] = field(default_factory=list)
    secondary_recommendations: List[Dict] = field(default_factory=list)
    
    # Scripts
    opening_scripts: List[Dict] = field(default_factory=list)
    discovery_questions: Dict[str, List[str]] = field(default_factory=dict)
    product_presentation: str = ""
    objections: List[Dict] = field(default_factory=list)
    closing_scripts: List[Dict] = field(default_factory=list)
    follow_up_sequences: List[Dict] = field(default_factory=list)
    
    # Quick reference
    top_products: List[str] = field(default_factory=list)
    key_talking_points: List[str] = field(default_factory=list)


def parse_word_track(file_path: str) -> ParsedWordTrack:
    """Parse a word track markdown file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract practitioner type from filename
    filename = os.path.basename(file_path)
    practitioner_type = filename.replace('_WordTrack.md', '').replace('_', ' ')
    
    word_track = ParsedWordTrack(
        practitioner_type=practitioner_type,
        title=extract_title(content),
        target=extract_target(content),
        business_models=extract_business_models(content)
    )
    
    # Parse each section
    word_track.practice_philosophy = extract_section_content(content, "Practice Philosophy")
    word_track.why_ideal_partners = extract_bullet_list(content, "Why.*Are Ideal Partners")
    word_track.pain_points = extract_bullet_list(content, "Common Practice Pain Points")
    word_track.patient_demographics = extract_bullet_list(content, "Patient Demographics")
    
    word_track.opening_scripts = extract_opening_scripts(content)
    word_track.discovery_questions = extract_discovery_questions(content)
    word_track.product_presentation = extract_product_presentation(content)
    word_track.objections = extract_objections(content)
    word_track.closing_scripts = extract_closing_scripts(content)
    word_track.follow_up_sequences = extract_follow_up_sequences(content)
    
    word_track.top_products = extract_bullet_list(content, "Top 3 Products")
    word_track.key_talking_points = extract_bullet_list(content, "Key Clinical Talking Points")
    
    return word_track


def extract_title(content: str) -> str:
    """Extract the main title from the markdown"""
    match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    return match.group(1).strip() if match else ""


def extract_target(content: str) -> str:
    """Extract the target practitioner info"""
    match = re.search(r'\*\*Target:\*\*\s*([^|]+)', content)
    return match.group(1).strip() if match else ""


def extract_business_models(content: str) -> str:
    """Extract business models info"""
    match = re.search(r'\*\*Business Models:\*\*\s*(.+)', content)
    return match.group(1).strip() if match else ""


def extract_section_content(content: str, section_name: str) -> str:
    """Extract content from a named section"""
    pattern = rf'###\s+{section_name}\s*\n(.*?)(?=\n###|\n##|\Z)'
    match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return ""


def extract_bullet_list(content: str, section_pattern: str) -> List[str]:
    """Extract bullet points from a section"""
    pattern = rf'###?\s+{section_pattern}.*?\n(.*?)(?=\n###|\n##|\Z)'
    match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
    if match:
        section_content = match.group(1)
        bullets = re.findall(r'^-\s+\*?\*?(.+?)\*?\*?\s*$', section_content, re.MULTILINE)
        return [b.strip().strip('*') for b in bullets if b.strip()]
    return []


def extract_opening_scripts(content: str) -> List[Dict]:
    """Extract opening scripts"""
    scripts = []
    pattern = r'###\s+Script\s+(\d+):\s+(.+?)\n"([^"]+)"'
    matches = re.findall(pattern, content, re.DOTALL)
    for num, title, script in matches:
        scripts.append({
            "number": int(num),
            "title": title.strip(),
            "script": script.strip()
        })
    return scripts


def extract_discovery_questions(content: str) -> Dict[str, List[str]]:
    """Extract discovery questions grouped by category"""
    questions = {
        "practice_understanding": [],
        "patient_challenges": [],
        "current_solutions": [],
        "decision_factors": [],
        "future_vision": []
    }
    
    # Find the discovery questions section
    pattern = r'##\s+\d+\.\s+DISCOVERY QUESTIONS.*?\n(.*?)(?=\n##\s+\d+\.|\Z)'
    match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
    if match:
        section_content = match.group(1)
        
        # Extract numbered questions
        q_pattern = r'^\d+\.\s+"([^"]+)"'
        all_questions = re.findall(q_pattern, section_content, re.MULTILINE)
        
        # Distribute questions into categories based on position
        for i, q in enumerate(all_questions):
            if i < 3:
                questions["practice_understanding"].append(q)
            elif i < 7:
                questions["patient_challenges"].append(q)
            elif i < 10:
                questions["current_solutions"].append(q)
            elif i < 13:
                questions["decision_factors"].append(q)
            else:
                questions["future_vision"].append(q)
    
    return questions


def extract_product_presentation(content: str) -> str:
    """Extract the product presentation (P-A-S-E framework)"""
    pattern = r'##\s+\d+\.\s+PRODUCT PRESENTATION.*?\n(.*?)(?=\n##\s+\d+\.|\Z)'
    match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
    return match.group(1).strip() if match else ""


def extract_objections(content: str) -> List[Dict]:
    """Extract objection handling scripts"""
    objections = []
    pattern = r'###\s+Objection\s+(\d+):\s+"([^"]+)"\s*\n\*\*Response:\*\*\s+"([^"]+)"'
    matches = re.findall(pattern, content, re.DOTALL)
    for num, objection, response in matches:
        objections.append({
            "number": int(num),
            "objection": objection.strip(),
            "response": response.strip()
        })
    return objections


def extract_closing_scripts(content: str) -> List[Dict]:
    """Extract closing scripts"""
    scripts = []
    pattern = r'###\s+Close\s+(\d+):\s+(.+?)\s*\n"([^"]+)"'
    matches = re.findall(pattern, content, re.DOTALL)
    for num, title, script in matches:
        scripts.append({
            "number": int(num),
            "title": title.strip(),
            "script": script.strip()
        })
    return scripts


def extract_follow_up_sequences(content: str) -> List[Dict]:
    """Extract follow-up sequences"""
    sequences = []
    pattern = r'###\s+(Day\s+\d+[^:]*?):\s+(.+?)\s*\n\*\*(\w+):\*\*\s*\n"([^"]+)"'
    matches = re.findall(pattern, content, re.DOTALL)
    for timing, title, channel, script in matches:
        sequences.append({
            "timing": timing.strip(),
            "title": title.strip(),
            "channel": channel.strip(),
            "script": script.strip()
        })
    return sequences


# =============================================================================
# Pathway Generator
# =============================================================================

def generate_node_id() -> str:
    """Generate a unique node ID"""
    return f"node_{uuid.uuid4().hex[:8]}"


def generate_edge_id() -> str:
    """Generate a unique edge ID"""
    return f"edge_{uuid.uuid4().hex[:8]}"


def create_global_prompt(word_track: ParsedWordTrack) -> str:
    """Create the global prompt for the pathway"""
    return f"""You are a professional sales representative for SuperPatch, calling {word_track.practitioner_type}.

CONTEXT:
- SuperPatch uses Vibrotactile Technology (VTT) - drug-free, non-invasive patches
- Freedom patch has peer-reviewed clinical study (RESTORE study, NCT06505005)
- REM patch has HARMONI sleep study
- Liberty patch has Balance study showing 31% improvement

KEY TALKING POINTS:
{chr(10).join(f'- {point}' for point in word_track.key_talking_points[:5])}

PRACTICE PHILOSOPHY TO ACKNOWLEDGE:
{word_track.practice_philosophy}

ALWAYS:
- Be professional and respectful of their time
- Reference clinical studies when asked about evidence
- Align messaging with their drug-free, natural approach
- Listen actively and respond to their specific concerns
- Ask permission before proceeding to the next topic

NEVER:
- Make unsubstantiated medical claims
- Be pushy or aggressive
- Interrupt the prospect
- Speak too fast or use jargon they may not understand
"""


def create_pathway_from_word_track(word_track: ParsedWordTrack) -> BlandPathway:
    """Generate a Bland.ai pathway from a parsed word track"""
    
    pathway = BlandPathway(
        name=f"SuperPatch - {word_track.practitioner_type} Sales",
        description=f"Outbound sales conversation flow for {word_track.practitioner_type}",
        global_prompt=create_global_prompt(word_track)
    )
    
    nodes = []
    edges = []
    
    # ==========================================================================
    # 1. START NODE - Introduction
    # ==========================================================================
    start_node = PathwayNode(
        id="node_start",
        name="Introduction",
        type="Default",
        is_start=True,
        position_x=400,
        position_y=50,
        prompt=f"""Start the call with a warm, professional greeting.

Use this opening script:
"{word_track.opening_scripts[0]['script'] if word_track.opening_scripts else 'Good morning, this is [Your Name] with SuperPatch. Do you have a moment to speak?'}"

After delivering the opening:
- If they say they're busy or ask to call back later → route to "Schedule Callback"
- If they ask who you are or what SuperPatch is → route to "Company Introduction"
- If they show interest or say yes → route to "Discovery Questions"
- If they say no or aren't interested → route to "Soft Objection Handler"
"""
    )
    nodes.append(start_node)
    
    # ==========================================================================
    # 2. COMPANY INTRODUCTION NODE
    # ==========================================================================
    company_intro_node = PathwayNode(
        id="node_company_intro",
        name="Company Introduction",
        type="Default",
        position_x=100,
        position_y=200,
        prompt=f"""The prospect wants to know more about SuperPatch. Give a brief introduction:

"SuperPatch is a wellness technology company that creates drug-free patches using Vibrotactile Technology. Our patches work by stimulating nerve receptors in the skin - similar to how the Nobel Prize-winning discovery of mechanoreceptors works. 

We work with healthcare practitioners like yourself who are looking for evidence-based, non-invasive options for their patients."

After explaining:
- If they seem interested → route to "Discovery Questions"
- If they have concerns → route to appropriate objection handler
- If they want to end the call → route to "Polite Exit"
"""
    )
    nodes.append(company_intro_node)
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_start",
        target="node_company_intro",
        label="Wants more info",
        condition="User asks who you are or what SuperPatch is"
    ))
    
    # ==========================================================================
    # 3. DISCOVERY QUESTIONS NODE
    # ==========================================================================
    discovery_questions = []
    for category, questions in word_track.discovery_questions.items():
        discovery_questions.extend(questions[:2])  # Take top 2 from each category
    
    discovery_node = PathwayNode(
        id="node_discovery",
        name="Discovery Questions",
        type="Default",
        position_x=400,
        position_y=200,
        prompt=f"""Now engage the prospect with discovery questions to understand their practice and needs.

Ask these questions naturally, one at a time, and listen to their responses:

{chr(10).join(f'{i+1}. "{q}"' for i, q in enumerate(discovery_questions[:5]))}

IMPORTANT: Extract key information from their responses:
- Practice size and specialty focus
- Common patient presentations
- Current product recommendations (if any)
- Pain points with existing solutions

After gathering information:
- If they mention specific patient challenges → route to "Product Presentation"
- If they seem skeptical → route to "Evidence Discussion"
- If they mention they already have solutions → route to "Differentiation"
""",
        extract_variables=[
            {"name": "practice_specialty", "description": "Their primary specialty or focus area"},
            {"name": "patient_pain_points", "description": "Common issues their patients face"},
            {"name": "current_solutions", "description": "What they currently recommend to patients"}
        ]
    )
    nodes.append(discovery_node)
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_start",
        target="node_discovery",
        label="Shows interest",
        condition="User agrees to continue or shows interest"
    ))
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_company_intro",
        target="node_discovery",
        label="Wants to learn more",
        condition="User seems interested after introduction"
    ))
    
    # ==========================================================================
    # 4. PRODUCT PRESENTATION NODE
    # ==========================================================================
    presentation_node = PathwayNode(
        id="node_presentation",
        name="Product Presentation",
        type="Default",
        position_x=400,
        position_y=350,
        prompt=f"""Present SuperPatch products using the P-A-S-E framework:

**PROBLEM** - Acknowledge their challenge:
"I hear from practitioners like you that the biggest challenge isn't what happens in the office - it's what happens when patients go home. They're making progress in your care, but between visits, they're reaching for medications or not getting the support they need."

**AGITATE** - Emphasize the impact:
"This creates a frustrating cycle. Patients feel great after treatment, then within days they're back to square one. They start to wonder if the care is working - when really, it's the home support that's missing."

**SOLVE** - Introduce SuperPatch:
"That's where SuperPatch comes in. Our Freedom patch uses Vibrotactile Technology - a drug-free approach that works with the body's own neural pathways. The RESTORE study showed significant pain reduction and improved range of motion."

**EXPAND** - Present full portfolio based on their needs:
For {word_track.practitioner_type}:
{chr(10).join(f'- {p}' for p in word_track.top_products)}

After presenting:
- If they ask about evidence → route to "Evidence Discussion"
- If they raise objections → route to "Objection Handler"
- If they seem interested → route to "Business Model Discussion"
"""
    )
    nodes.append(presentation_node)
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_discovery",
        target="node_presentation",
        label="Ready for presentation",
        condition="User has shared their challenges or shows interest"
    ))
    
    # ==========================================================================
    # 5. EVIDENCE DISCUSSION NODE
    # ==========================================================================
    evidence_node = PathwayNode(
        id="node_evidence",
        name="Evidence Discussion",
        type="Default",
        position_x=100,
        position_y=350,
        prompt="""The prospect wants to see evidence. Present the clinical backing:

"Absolutely - as a healthcare professional, you should demand evidence. Let me share what we have:

**FREEDOM PATCH (Pain Relief):**
- RESTORE Study - peer-reviewed, double-blind, placebo-controlled RCT
- Published in Pain Therapeutics journal
- 118 participants, 14-day study
- Significant improvement in pain severity AND range of motion
- Registered on ClinicalTrials.gov as NCT06505005

**REM PATCH (Sleep):**
- HARMONI Study
- 80% of participants stopped using sleep medications
- 46% faster sleep onset

**LIBERTY PATCH (Balance):**
- Balance Study
- 31% improvement in balance scores (p<0.05)

I can send you the full study abstracts after our call."

After presenting evidence:
- If they want to proceed → route to "Business Model Discussion"
- If they have more concerns → route to "Objection Handler"
- If they want the studies sent → route to "Capture Email"
"""
    )
    nodes.append(evidence_node)
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_presentation",
        target="node_evidence",
        label="Wants evidence",
        condition="User asks for research or clinical evidence"
    ))
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_discovery",
        target="node_evidence",
        label="Skeptical",
        condition="User seems skeptical or wants proof"
    ))
    
    # ==========================================================================
    # 6. OBJECTION HANDLER NODE (Global Node)
    # ==========================================================================
    objection_responses = "\n\n".join([
        f"**If they say: \"{obj['objection']}\"**\nRespond: \"{obj['response']}\""
        for obj in word_track.objections[:6]
    ])
    
    objection_node = PathwayNode(
        id="node_objection",
        name="Objection Handler",
        type="Default",
        global_node=True,
        position_x=700,
        position_y=350,
        prompt=f"""Handle objections professionally and return to the conversation flow.

COMMON OBJECTIONS AND RESPONSES:

{objection_responses}

**GENERAL APPROACH:**
1. Acknowledge their concern ("I understand...")
2. Provide relevant information or evidence
3. Ask a question to re-engage them

After handling the objection:
- If resolved positively → route back to "Product Presentation" or "Business Model Discussion"
- If they have more concerns → stay in objection handling
- If they want to end the call → route to "Polite Exit"
"""
    )
    nodes.append(objection_node)
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_presentation",
        target="node_objection",
        label="Has objection",
        condition="User raises a concern or objection"
    ))
    
    # ==========================================================================
    # 7. BUSINESS MODEL DISCUSSION NODE
    # ==========================================================================
    business_model_node = PathwayNode(
        id="node_business_model",
        name="Business Model Discussion",
        type="Default",
        position_x=400,
        position_y=500,
        prompt="""Discuss how to work together:

"Great question about how this would work for your practice. We have two options:

**OPTION A: WHOLESALE (25% Practitioner Discount)**
- Purchase patches at 25% off
- Retail directly to your patients
- Complete control over pricing and availability
- Best for practices that already retail products

**OPTION B: AFFILIATE PROGRAM**
- We provide you a unique referral link/code
- Patients order directly from us
- You earn commission on every sale
- No inventory or transactions to handle
- Best for practitioners who prefer not to manage retail

**OPTION C: HYBRID**
- Stock key products (like Freedom and REM) for immediate sale
- Use affiliate for the full product line
- Balance of margin and convenience

Which model sounds like it would fit best with how you run your practice?"

After discussing:
- If they choose an option → route to "Close"
- If they need to think → route to "Follow Up Setup"
- If they have concerns → route to "Objection Handler"
""",
        extract_variables=[
            {"name": "preferred_model", "description": "Their preferred business model (wholesale, affiliate, or hybrid)"}
        ]
    )
    nodes.append(business_model_node)
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_presentation",
        target="node_business_model",
        label="Ready to discuss options",
        condition="User seems interested and ready to move forward"
    ))
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_evidence",
        target="node_business_model",
        label="Satisfied with evidence",
        condition="User is convinced by the evidence"
    ))
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_objection",
        target="node_business_model",
        label="Objection resolved",
        condition="User's concern has been addressed"
    ))
    
    # ==========================================================================
    # 8. CLOSE NODE
    # ==========================================================================
    close_script = word_track.closing_scripts[0]['script'] if word_track.closing_scripts else \
        "Based on what we've discussed, it sounds like this could be a great fit for your practice. Should I set you up with a Practitioner Starter Kit so you can start offering this to patients?"
    
    close_node = PathwayNode(
        id="node_close",
        name="Close",
        type="Default",
        position_x=400,
        position_y=650,
        prompt=f"""Close the sale:

"{close_script}"

CLOSING TECHNIQUES TO USE:
1. **Assumptive Close**: "Most practitioners start with the Starter Kit - should I set you up with that?"
2. **Alternative Close**: "Would you prefer just Freedom patches or the full portfolio?"
3. **Urgency Close**: "We're running a practitioner special this month - let me get you started while it's available."

If they agree:
- Confirm their shipping/contact information
- Explain next steps
- Route to "Confirmation"

If they need more time:
- Offer to send information
- Schedule a follow-up call
- Route to "Follow Up Setup"
""",
        extract_variables=[
            {"name": "order_decision", "description": "Whether they want to order (yes/no/maybe later)"},
            {"name": "products_interested", "description": "Which products they're most interested in"}
        ]
    )
    nodes.append(close_node)
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_business_model",
        target="node_close",
        label="Ready to decide",
        condition="User has chosen a business model or is ready to move forward"
    ))
    
    # ==========================================================================
    # 9. CONFIRMATION NODE
    # ==========================================================================
    confirmation_node = PathwayNode(
        id="node_confirmation",
        name="Order Confirmation",
        type="Default",
        position_x=200,
        position_y=800,
        prompt="""Confirm the order and next steps:

"Excellent! Let me confirm the details:
- [Confirm product selection]
- [Confirm shipping address]
- [Confirm contact email]

You'll receive:
1. Order confirmation email within the hour
2. Tracking information when your kit ships
3. Welcome packet with patient education materials
4. My direct contact information for any questions

Is there anything else you'd like to know before we wrap up?"

After confirmation:
- Thank them for their time
- Route to "End Call - Success"
""",
        extract_variables=[
            {"name": "shipping_address", "description": "Their shipping address"},
            {"name": "email", "description": "Their email address"}
        ]
    )
    nodes.append(confirmation_node)
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_close",
        target="node_confirmation",
        label="Order confirmed",
        condition="User agrees to place an order"
    ))
    
    # ==========================================================================
    # 10. FOLLOW UP SETUP NODE
    # ==========================================================================
    follow_up_node = PathwayNode(
        id="node_follow_up",
        name="Follow Up Setup",
        type="Default",
        position_x=600,
        position_y=800,
        prompt="""Schedule follow-up if they need more time:

"I completely understand - it's an important decision. Let me suggest this:

1. I'll send you our practitioner information packet including:
   - Full study summaries
   - Product information sheets
   - Patient education materials
   - Testimonials from other practitioners

2. I'd love to schedule a brief follow-up call in a few days to answer any questions that come up.

What day works best for a 10-minute follow-up? And what's the best email address to send the information to?"

Capture:
- Follow-up date/time
- Email address
- Any specific questions they want addressed

Route to "End Call - Follow Up Scheduled"
""",
        extract_variables=[
            {"name": "follow_up_date", "description": "When to call back"},
            {"name": "email", "description": "Their email address"},
            {"name": "pending_questions", "description": "Questions they want answered"}
        ]
    )
    nodes.append(follow_up_node)
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_close",
        target="node_follow_up",
        label="Needs more time",
        condition="User wants to think about it or needs more information"
    ))
    
    # ==========================================================================
    # 11. SCHEDULE CALLBACK NODE
    # ==========================================================================
    schedule_callback_node = PathwayNode(
        id="node_schedule_callback",
        name="Schedule Callback",
        type="Default",
        position_x=700,
        position_y=200,
        prompt="""They're busy now - schedule a better time:

"No problem at all - I know you're busy. When would be a better time for a quick 10-minute call? I'm flexible and can work around your schedule."

Options to offer:
- "Would later this week work better?"
- "What time do you typically have a few minutes between patients?"
- "Would morning or afternoon work better for you?"

Capture:
- Best callback day/time
- Direct phone number if different
- Brief note of why they're interested (if mentioned)

Route to "End Call - Callback Scheduled"
""",
        extract_variables=[
            {"name": "callback_time", "description": "When to call back"},
            {"name": "phone_number", "description": "Best number to reach them"},
            {"name": "interest_noted", "description": "Any interest they expressed"}
        ]
    )
    nodes.append(schedule_callback_node)
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_start",
        target="node_schedule_callback",
        label="Busy now",
        condition="User says they're busy or asks to call back later"
    ))
    
    # ==========================================================================
    # 12. SOFT OBJECTION HANDLER NODE
    # ==========================================================================
    soft_objection_node = PathwayNode(
        id="node_soft_objection",
        name="Soft Objection Handler",
        type="Default",
        position_x=900,
        position_y=200,
        prompt="""Handle initial hesitation gently:

If they say "I'm not interested":
"I understand - you must get a lot of calls. Just so I can note this correctly, is it that you don't see a need for drug-free patient support options, or is it just the timing?"

If they ask to be removed:
"Of course, I'll remove you from our list. Before I go - since you work with patients who might benefit from evidence-based, drug-free options, would you prefer I just send you information by email that you can review when convenient?"

If they say they don't have time:
"Totally understand. What if I send you a 2-minute video overview and the study summary? You can review it when you have a moment, and I can follow up next week. What email works best?"

Based on response:
- If they soften → try to re-engage or capture email
- If they're firm → thank them and end call politely
"""
    )
    nodes.append(soft_objection_node)
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_start",
        target="node_soft_objection",
        label="Initial no",
        condition="User says they're not interested"
    ))
    
    # ==========================================================================
    # 13. CAPTURE EMAIL NODE
    # ==========================================================================
    capture_email_node = PathwayNode(
        id="node_capture_email",
        name="Capture Email",
        type="Default",
        position_x=900,
        position_y=350,
        prompt="""Capture their email to send information:

"Great - I'll send that right over. What's the best email address to reach you?"

After capturing:
"Perfect, you'll receive that within the hour. Keep an eye out for an email from SuperPatch. Is there anything specific you'd like me to highlight in that information?"

Route to "Follow Up Setup" or "End Call - Email Captured"
""",
        extract_variables=[
            {"name": "email", "description": "Their email address"},
            {"name": "specific_interests", "description": "What they want to learn more about"}
        ]
    )
    nodes.append(capture_email_node)
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_evidence",
        target="node_capture_email",
        label="Wants studies sent",
        condition="User asks for studies or information to be sent"
    ))
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_soft_objection",
        target="node_capture_email",
        label="Agrees to email",
        condition="User agrees to receive email information"
    ))
    
    # ==========================================================================
    # 14. END CALL NODES
    # ==========================================================================
    end_success_node = PathwayNode(
        id="node_end_success",
        name="End Call - Success",
        type="End Call",
        position_x=200,
        position_y=950,
        prompt="""Wrap up successfully:

"Thank you so much for your time today, Dr. [Name]. I'm excited to partner with you. You'll receive your order confirmation shortly. If you have any questions in the meantime, feel free to reach out to me directly.

Have a great rest of your day, and I look forward to hearing about the results your patients experience!"
"""
    )
    nodes.append(end_success_node)
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_confirmation",
        target="node_end_success",
        label="Order complete",
        condition="Order has been confirmed"
    ))
    
    end_follow_up_node = PathwayNode(
        id="node_end_follow_up",
        name="End Call - Follow Up Scheduled",
        type="End Call",
        position_x=600,
        position_y=950,
        prompt="""Wrap up with follow-up scheduled:

"Perfect! I'll send that information to your email right away, and I'll call you back on [day/time]. Thank you for taking the time to learn about SuperPatch. Talk to you soon!"
"""
    )
    nodes.append(end_follow_up_node)
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_follow_up",
        target="node_end_follow_up",
        label="Follow up scheduled",
        condition="Follow-up has been scheduled"
    ))
    
    end_callback_node = PathwayNode(
        id="node_end_callback",
        name="End Call - Callback Scheduled",
        type="End Call",
        position_x=700,
        position_y=350,
        prompt="""Wrap up with callback scheduled:

"Great, I've got you down for [day/time]. I'll give you a call then. Thank you for your time, and have a great day!"
"""
    )
    nodes.append(end_callback_node)
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_schedule_callback",
        target="node_end_callback",
        label="Callback scheduled",
        condition="Callback time has been set"
    ))
    
    polite_exit_node = PathwayNode(
        id="node_polite_exit",
        name="Polite Exit",
        type="End Call",
        position_x=900,
        position_y=500,
        prompt="""Exit gracefully:

"I understand completely. Thank you for your time today. If anything changes or you'd like to learn more in the future, feel free to visit superpatch.com. Have a great day!"
"""
    )
    nodes.append(polite_exit_node)
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_soft_objection",
        target="node_polite_exit",
        label="Firm no",
        condition="User firmly declines"
    ))
    edges.append(PathwayEdge(
        id=generate_edge_id(),
        source="node_objection",
        target="node_polite_exit",
        label="Wants to end",
        condition="User wants to end the call"
    ))
    
    pathway.nodes = nodes
    pathway.edges = edges
    
    return pathway


# =============================================================================
# API Client for Bland.ai
# =============================================================================

def generate_api_payload(pathway: BlandPathway) -> Dict:
    """Generate the API payload for creating a pathway in Bland.ai"""
    return {
        "name": pathway.name,
        "description": pathway.description,
        "nodes": pathway.to_dict()["nodes"],
        "edges": pathway.to_dict()["edges"],
        "global_prompt": pathway.global_prompt
    }


def generate_send_call_payload(
    phone_number: str,
    pathway_id: str,
    prospect_name: str = "",
    practice_name: str = "",
    from_number: str = ""
) -> Dict:
    """Generate payload for sending a call using the pathway"""
    return {
        "phone_number": phone_number,
        "pathway_id": pathway_id,
        "from": from_number,  # Your Bland.ai phone number
        "voice": "nat",  # Natural sounding voice
        "first_sentence": f"Hi, this is calling for {'Dr. ' + prospect_name if prospect_name else 'the practice manager'}.",
        "request_data": {
            "prospect_name": prospect_name,
            "practice_name": practice_name
        },
        "record": True,
        "webhook": ""  # Add your webhook URL here
    }


# =============================================================================
# Main Execution
# =============================================================================

def main():
    """Main execution function"""
    
    # Paths
    input_dir = Path("/Users/cbsuperpatch/Desktop/SalesEnablement/b2b_sales_enablement/wordtracks/practitioners")
    output_dir = Path("/Users/cbsuperpatch/Desktop/SalesEnablement/b2b_sales_enablement/bland_ai_pathways")
    
    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("=" * 60)
    print("Bland.ai Conversational Pathway Generator")
    print("SuperPatch B2B Sales Enablement")
    print("=" * 60)
    print()
    
    # Process each word track file
    md_files = list(input_dir.glob("*.md"))
    
    if not md_files:
        print(f"No markdown files found in {input_dir}")
        return
    
    print(f"Found {len(md_files)} word track files to process\n")
    
    all_pathways = []
    
    for md_file in md_files:
        print(f"Processing: {md_file.name}")
        
        try:
            # Parse the word track
            word_track = parse_word_track(str(md_file))
            print(f"  ✓ Parsed word track for {word_track.practitioner_type}")
            print(f"    - {len(word_track.opening_scripts)} opening scripts")
            print(f"    - {sum(len(q) for q in word_track.discovery_questions.values())} discovery questions")
            print(f"    - {len(word_track.objections)} objection handlers")
            print(f"    - {len(word_track.closing_scripts)} closing scripts")
            
            # Generate the pathway
            pathway = create_pathway_from_word_track(word_track)
            print(f"  ✓ Generated pathway with {len(pathway.nodes)} nodes and {len(pathway.edges)} edges")
            
            # Save the pathway JSON
            output_filename = md_file.stem.replace("_WordTrack", "_pathway") + ".json"
            output_path = output_dir / output_filename
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(pathway.to_dict(), f, indent=2)
            print(f"  ✓ Saved to {output_path}")
            
            # Save the API payload
            api_payload_filename = md_file.stem.replace("_WordTrack", "_api_payload") + ".json"
            api_payload_path = output_dir / api_payload_filename
            
            with open(api_payload_path, 'w', encoding='utf-8') as f:
                json.dump(generate_api_payload(pathway), f, indent=2)
            print(f"  ✓ Saved API payload to {api_payload_path}")
            
            all_pathways.append({
                "practitioner_type": word_track.practitioner_type,
                "pathway_file": str(output_path),
                "api_payload_file": str(api_payload_path),
                "node_count": len(pathway.nodes),
                "edge_count": len(pathway.edges)
            })
            
            print()
            
        except Exception as e:
            print(f"  ✗ Error processing {md_file.name}: {str(e)}")
            print()
            continue
    
    # Generate summary and deployment script
    summary_path = output_dir / "pathway_summary.json"
    with open(summary_path, 'w', encoding='utf-8') as f:
        json.dump({
            "generated_at": str(Path.cwd()),
            "total_pathways": len(all_pathways),
            "pathways": all_pathways
        }, f, indent=2)
    
    print("=" * 60)
    print("GENERATION COMPLETE")
    print("=" * 60)
    print(f"Generated {len(all_pathways)} pathways")
    print(f"Output directory: {output_dir}")
    print()
    print("NEXT STEPS:")
    print("1. Get your Bland.ai API key from https://app.bland.ai/settings")
    print("2. Use the API payloads to create pathways via POST /v1/convo_pathway")
    print("3. Use the send_call payload template to initiate calls")
    print()
    print("Example API call to create a pathway:")
    print("""
curl -X POST "https://api.bland.ai/v1/convo_pathway" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d @Chiropractors_api_payload.json
""")
    
    # Generate deployment script
    generate_deployment_script(output_dir)


def generate_deployment_script(output_dir: Path):
    """Generate a Python script for deploying pathways to Bland.ai"""
    
    script_content = '''#!/usr/bin/env python3
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
'''
    
    script_path = output_dir / "deploy_pathways.py"
    with open(script_path, 'w') as f:
        f.write(script_content)
    
    print(f"Generated deployment script: {script_path}")


if __name__ == "__main__":
    main()
