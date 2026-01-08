import { WordTrack } from "@/types/wordtrack";

export const functionalMedicineWordTrack: WordTrack = {
  id: "b2b-functional-medicine",
  productId: "functional-medicine",
  market: "b2b",
  title: "Functional Medicine Practitioner Word Track",
  overview: `Functional medicine focuses on identifying and addressing root causes of disease through a systems biology approach. Practitioners look at the interconnected web of factors affecting health and create personalized treatment plans. They prioritize understanding why disease occurs and addressing underlying dysfunction rather than just treating symptoms.

SuperPatch provides symptomatic support while root-cause work takes effect - no metabolic load, no interactions, no compliance burden.

Why Functional Medicine Practitioners Are Ideal Partners:
• Root Cause Focus - Appreciate technologies that work with natural systems
• Systems Thinking - Understand how interventions affect multiple pathways
• Patient Investment - Patients are committed to comprehensive wellness protocols
• Evidence-Based - Demand clinical evidence for recommendations
• Protocol-Oriented - Comfortable integrating multiple modalities`,

  openingScripts: [
    {
      id: "fm-systems",
      title: "Systems Approach Opening",
      scenario: "Leading with systems biology language",
      script: `"Dr. [Name], I'm [Your Name] with SuperPatch. I'm reaching out to functional medicine practitioners because you understand systems biology – how one intervention can affect multiple pathways.

Our Vibrotactile Technology works through mechanoreceptor activation to modulate neural signaling. It's a non-pharmaceutical approach that doesn't compete with your root-cause work.

Would you be interested in learning how other FM practitioners are integrating this?"`
    },
    {
      id: "fm-rootcause",
      title: "Root Cause Support Opening",
      scenario: "Positioning as bridge during treatment",
      script: `"Hi Dr. [Name], I know functional medicine focuses on root causes, and rightly so. But while that foundational work is happening, patients often struggle with symptoms – pain, sleep issues, stress.

SuperPatch offers drug-free symptomatic support that works through neural pathways, not chemistry. It bridges the gap without adding metabolic load.

Does that fit a gap in your patient care?"`
    },
    {
      id: "fm-evidence",
      title: "Evidence-Based Opening",
      scenario: "Leading with clinical evidence",
      script: `"Dr. [Name], as a functional medicine practitioner, you demand evidence. I wanted to share that our Freedom patch just completed a peer-reviewed, double-blind, placebo-controlled RCT showing significant pain reduction and improved ROM.

It's registered on ClinicalTrials.gov.

Would clinical-level evidence make this worth exploring?"`
    },
    {
      id: "fm-protocol",
      title: "Protocol Integration Opening",
      scenario: "Discussing protocol integration",
      script: `"Hi Dr. [Name], I work with several functional medicine practices who have integrated SuperPatch into their patient protocols.

They use it as symptomatic support while addressing root causes – for example, Freedom for pain while working up inflammation, or REM for sleep while optimizing circadian biology.

Would you be interested in seeing how this fits into comprehensive protocols?"`
    },
    {
      id: "fm-email",
      title: "Email Outreach",
      scenario: "Written introduction",
      script: `Dr. [Name], functional medicine's strength is addressing root causes. But patients need support during the journey.

SuperPatch offers drug-free, non-oral symptomatic support through Vibrotactile Technology – mechanoreceptor stimulation that modulates neural pathways. No metabolic load, no interactions, no compliance burden.

Our Freedom patch completed a peer-reviewed RCT (NCT06505005). Our REM patch showed 80% of participants stopped sleep medications.

Would you be open to discussing how this could support your protocols?`
    }
  ],

  discoveryQuestions: [
    {
      id: "fm-q1",
      question: "How do you typically structure your approach – what's your framework for root-cause investigation?",
      category: "opening"
    },
    {
      id: "fm-q2",
      question: "What percentage of your patients present with multiple overlapping conditions?",
      category: "opening"
    },
    {
      id: "fm-q3",
      question: "How long do patients typically work with you before seeing meaningful improvement?",
      category: "opening"
    },
    {
      id: "fm-q4",
      question: "What's the biggest challenge for patients during the foundational phase of treatment?",
      category: "pain_point"
    },
    {
      id: "fm-q5",
      question: "How do you currently provide symptomatic support while root-cause work is underway?",
      category: "pain_point"
    },
    {
      id: "fm-q6",
      question: "Do you have patients who are sensitive to oral supplements or have absorption issues?",
      category: "pain_point"
    },
    {
      id: "fm-q7",
      question: "What do you tell patients who are frustrated waiting for results?",
      category: "pain_point"
    },
    {
      id: "fm-q8",
      question: "How many supplements or interventions are your patients typically on?",
      category: "impact"
    },
    {
      id: "fm-q9",
      question: "How do you think about adding versus simplifying patient protocols?",
      category: "impact"
    },
    {
      id: "fm-q10",
      question: "What non-oral modalities do you currently incorporate – IV therapy, injections, wearables?",
      category: "impact"
    },
    {
      id: "fm-q11",
      question: "When evaluating a new modality, what's most important – mechanism, evidence, patient tolerance, or cost?",
      category: "solution"
    },
    {
      id: "fm-q12",
      question: "How do you feel about technologies that address symptoms versus root causes?",
      category: "solution"
    },
    {
      id: "fm-q13",
      question: "Would you prefer to dispense directly or refer patients to purchase?",
      category: "solution"
    }
  ],

  productPresentation: {
    problem: `Here's the reality: root-cause treatment takes time. You're running labs, optimizing the gut, addressing hormones, supporting detox – and that work is essential. But meanwhile, patients are suffering. They have pain that won't wait for their GI protocol to work. They have sleep issues that compound their fatigue. And they're asking for relief.`,
    agitate: `So what are the options? Pharmaceuticals – which often create new problems and don't align with your philosophy. More supplements – adding to an already complex protocol and straining compliance. Or telling patients to just wait. None of these are ideal.`,
    solve: `SuperPatch offers a different approach. Vibrotactile Technology works through mechanoreceptor activation – the same touch pathways recognized by the 2021 Nobel Prize in Medicine. The specialized ridge patterns stimulate neural signaling for pain relief, sleep support, or stress response modulation.

Here's why this fits functional medicine:
• Non-pharmaceutical - No drugs, no chemical intervention
• No metabolic load - Nothing to absorb, metabolize, or detoxify
• No interactions - Can't compete with your other interventions
• No compliance burden - It's one simple patch

It provides symptomatic support while your root-cause work takes effect.`,
    fullScript: `"Dr. [Name], I know functional medicine is about finding and fixing root causes – not just suppressing symptoms. I'm not here to suggest abandoning that approach. What I want to share is a tool for symptomatic support that doesn't compromise your foundational work.

[PROBLEM]
Here's the reality: root-cause treatment takes time. You're running labs, optimizing the gut, addressing hormones, supporting detox – and that work is essential. But meanwhile, patients are suffering. They have pain that won't wait for their GI protocol to work. They have sleep issues that compound their fatigue. And they're asking for relief.

[AGITATE]
So what are the options? Pharmaceuticals – which often create new problems and don't align with your philosophy. More supplements – adding to an already complex protocol and straining compliance. Or telling patients to just wait. None of these are ideal.

[SOLVE]
SuperPatch offers a different approach. Vibrotactile Technology works through mechanoreceptor activation – the same touch pathways recognized by the 2021 Nobel Prize in Medicine. The specialized ridge patterns stimulate neural signaling for pain relief, sleep support, or stress response modulation.

[PROTOCOL INTEGRATION EXAMPLES]

For Pain Patients (While Addressing Inflammation):
- Freedom patch for symptomatic relief
- Continue anti-inflammatory protocol
- Reassess as root causes resolve

For Sleep Patients (While Optimizing Circadian Biology):
- REM patch for immediate sleep support
- Continue HPA axis, melatonin, cortisol work
- HARMONI study: 80% stopped sleep medications

For Stress/Anxiety (While Supporting HPA Axis):
- Peace patch for nervous system calming
- Continue adrenal, neurotransmitter protocols
- Reduces need for GABAergics

For Fatigue (While Addressing Mitochondria):
- Boost patch for energy support
- Continue CoQ10, B vitamins, mitochondrial work
- Drug-free energy without stimulant stress

Full Portfolio for Comprehensive Care:
- Focus – Cognitive support while addressing neuroinflammation
- Defend – Immune support while optimizing gut
- Ignite – Metabolic support while working on thyroid
- Joy – Mood support while balancing neurotransmitters"`
  },

  objections: [
    {
      id: "fm-obj1",
      objection: "I focus on root causes, not symptom suppression.",
      response: `"I completely respect that – it's the foundation of FM. But consider this: symptomatic support doesn't have to mean suppression. VTT works with neural pathways, not against them. It's supporting the nervous system's own regulation while you address root causes. And unlike drugs, when the root cause is resolved, you can discontinue without rebound or dependency. How do you currently support patients symptomatically during treatment?"`,
      psychology: "Acknowledge their philosophy, reframe symptomatic support as supportive, not suppressive."
    },
    {
      id: "fm-obj2",
      objection: "My patients are already on too many things.",
      response: `"That's exactly why this might help. Unlike another supplement to take, process, and interact with everything else, this is a simple patch that works through skin receptors. No pills to time, no absorption to optimize, no interactions to worry about. For patients with protocol fatigue, this is one intervention that doesn't add complexity. What would simplification mean for patient compliance?"`,
      psychology: "Position as simplification, not addition."
    },
    {
      id: "fm-obj3",
      objection: "I need to understand the mechanism better.",
      response: `"Of course – that's the FM approach. The mechanism is mechanoreceptor activation, primarily through Meissner's corpuscles and Merkel cells. This stimulates Piezo1/Piezo2 ion channels, which modulate neural signaling through established pathways like Gate Control Theory. There's no chemical transduction – it's purely physical signal modulation. Would you like our technical mechanism paper?"`,
      psychology: "Provide scientific detail to satisfy the evidence-based mindset."
    },
    {
      id: "fm-obj4",
      objection: "How does this fit with my evidence-based approach?",
      response: `"The Freedom patch completed a peer-reviewed, double-blind, placebo-controlled RCT published in Pain Therapeutics, registered on ClinicalTrials.gov as NCT06505005. The REM patch has the HARMONI study. The Liberty patch has a balance study with p<0.05 significance. This is clinical-grade evidence, not just anecdote. Which study would be most relevant for your practice?"`,
      psychology: "Lead with specific clinical evidence and trial registration."
    },
    {
      id: "fm-obj5",
      objection: "This seems like symptom Band-Aiding.",
      response: `"I understand that concern. Here's how to think about it: when a patient breaks their leg, you set the bone AND manage pain. The pain management doesn't prevent healing – it supports it. Similarly, VTT provides symptomatic support while your root-cause work addresses the underlying dysfunction. And because it's non-pharmaceutical, it doesn't create new problems to solve. Does that framing resonate?"`,
      psychology: "Use medical analogy to validate symptomatic support alongside treatment."
    },
    {
      id: "fm-obj6",
      objection: "My patients can't afford more expenses.",
      response: `"That's valid – FM patients often invest significantly in their care. At $3 per day, this is less than most supplements. And for some patients, effective symptomatic support could reduce reliance on more expensive interventions. Which patients are struggling most with symptoms while waiting for foundational work to take effect?"`,
      psychology: "Compare cost to existing expenses and potential savings."
    }
  ],

  closingScripts: [
    {
      id: "fm-close1",
      title: "Protocol Integration Close",
      type: "assumptive",
      script: `"Dr. [Name], it sounds like this could fit into your protocols as symptomatic support while root-cause work progresses. The Practitioner Kit includes all 13 patches so you can match the right one to each patient's presentation. Ready to integrate this into your practice?"`
    },
    {
      id: "fm-close2",
      title: "Evidence-Based Close",
      type: "solution",
      script: `"Given your evidence-based approach, I think starting with the clinically-studied patches makes sense – Freedom, REM, and Liberty all have published research. Would you like to start with those and see patient outcomes?"`
    },
    {
      id: "fm-close3",
      title: "Trial Close",
      type: "trial",
      script: `"On a scale of 1-10, how relevant is non-pharmaceutical symptomatic support for your patient population? [Wait] What would make it a 10? Let's address that."`
    },
    {
      id: "fm-close4",
      title: "Business Model Close",
      type: "alternative",
      script: `"You can stock patches at 25% off and dispense directly, or use an affiliate link. Given that you already have a dispensary, which model fits better?"`
    }
  ],

  followUpSequence: [
    {
      day: "Day 1",
      title: "Post-Meeting Thank You",
      email: `Dr. [Name], thank you for discussing SuperPatch today.

I appreciate your thoughtful questions about mechanism and evidence – it's clear you evaluate every intervention carefully. As promised, I've attached the RESTORE study publication and our mechanism documentation.

I'll follow up in a few days to discuss how this might fit into your patient protocols.`
    },
    {
      day: "Day 3-4",
      title: "Protocol Example",
      email: `Dr. [Name], I wanted to share how one functional medicine practice integrated SuperPatch:

"For patients in the early phases of treatment, I now add Freedom or REM as symptomatic support. It bridges the gap while we work on root causes – without adding more pills to their already complex protocols. The best part? When the underlying issues resolve, we just discontinue the patch. No tapering, no rebound."

Would you like to discuss how this could work for your patient population?`
    },
    {
      day: "Day 7",
      title: "Check-In Call",
      voicemail: `"Hi Dr. [Name], this is [Your Name] from SuperPatch. I wanted to follow up on the clinical evidence I sent. I know functional medicine practitioners demand rigorous evidence, so I'd be happy to walk through the studies in detail or discuss mechanism. Let me know when you have a few minutes."`,
      email: `Dr. [Name], I wanted to check in after sending the clinical evidence.

If you have questions about the studies or want to discuss how other FM practices are integrating this into protocols, I'm happy to schedule a brief call.

What would be most helpful?`
    },
    {
      day: "Day 14",
      title: "Final Outreach",
      email: `Dr. [Name], I wanted to reach out once more about SuperPatch.

If non-pharmaceutical symptomatic support for your patients is still of interest, I'm here to help you get started. If the timing isn't right, just let me know and I'll check back in a few months.

Best regards!`
    }
  ],

  quickReference: {
    keyBenefits: [
      "Symptomatic support while root-cause work progresses",
      "No metabolic load, no interactions, no compliance burden",
      "Works through neural pathways, not chemistry",
      "Can discontinue without rebound when root causes resolved",
      "Peer-reviewed clinical evidence available"
    ],
    bestQuestions: [
      "How do you support patients symptomatically during foundational work?",
      "Do you have patients with protocol fatigue or absorption issues?",
      "What would non-pharmaceutical symptomatic support mean for your practice?"
    ],
    topObjections: [
      { objection: "Root causes, not symptoms", response: "Supports while you address causes; no rebound" },
      { objection: "Too many things already", response: "No pills, no interactions, simplifies protocol" },
      { objection: "Evidence-based?", response: "RCT in Pain Therapeutics, ClinicalTrials.gov registered" }
    ],
    bestClosingLines: [
      "This provides symptomatic support while your root-cause work takes effect.",
      "No metabolic load, no interactions.",
      "Ready to try the Practitioner Kit?"
    ],
    keyStats: [
      "Freedom: Peer-reviewed RCT (NCT06505005)",
      "REM: 80% stopped sleep medications",
      "No interactions, no compliance burden"
    ]
  }
};





