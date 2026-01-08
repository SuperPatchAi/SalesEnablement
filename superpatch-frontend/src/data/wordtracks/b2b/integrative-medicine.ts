import { WordTrack } from "@/types/wordtrack";

export const integrativeMedicineWordTrack: WordTrack = {
  id: "b2b-integrative-medicine",
  productId: "integrative-medicine",
  market: "b2b",
  title: "Integrative Medicine Practitioner Word Track",
  overview: `Integrative medicine combines conventional Western medicine with evidence-based complementary approaches, focusing on the whole person – body, mind, and spirit. Practitioners seek the most appropriate interventions from both paradigms, emphasizing the therapeutic relationship and patient-centered care.

SuperPatch bridges both worlds - clinical-grade evidence for a non-pharmaceutical approach.

Why Integrative Medicine Physicians Are Ideal Partners:
• Bridge Builders - Comfortable with both conventional and alternative modalities
• Evidence Seekers - Appreciate clinical trials and peer-reviewed research
• Multi-Modal Approach - Already integrate various treatment types
• Medication Reducers - Often looking to reduce pharmaceutical burden
• Patient Advocacy - Prioritize patient preferences and autonomy`,

  openingScripts: [
    {
      id: "im-evidence",
      title: "Evidence-Based Alternative Opening",
      scenario: "Leading with clinical evidence",
      script: `"Dr. [Name], I'm [Your Name] with SuperPatch. I'm reaching out to integrative medicine physicians who are looking for evidence-based alternatives to pharmaceuticals.

Our Vibrotactile Technology patches have completed peer-reviewed clinical trials – the Freedom patch has an RCT for pain, and the REM patch has a study showing 80% of participants stopped sleep medications.

Would you be interested in adding an evidence-based non-pharmaceutical option to your toolkit?"`
    },
    {
      id: "im-reduction",
      title: "Medication Reduction Opening",
      scenario: "Focusing on pharmaceutical reduction",
      script: `"Hi Dr. [Name], I work with several integrative medicine practices where a key goal is reducing patients' pharmaceutical burden.

SuperPatch offers drug-free support for pain, sleep, and stress – often the three areas where patients most want alternatives. The HARMONI sleep study showed 80% of participants stopped their sleep medications.

Is reducing medication reliance important in your practice?"`
    },
    {
      id: "im-bridge",
      title: "Bridge Builder Opening",
      scenario: "Positioning between conventional and complementary",
      script: `"Dr. [Name], I know integrative medicine is about bridging conventional and complementary approaches.

SuperPatch sits perfectly in that bridge – it's a technology with clinical trials, but it's completely drug-free and works through natural neural pathways.

Does combining evidence with a non-pharmaceutical approach fit what you look for?"`
    },
    {
      id: "im-conference",
      title: "Conference/Medical Meeting Approach",
      scenario: "Meeting at professional events",
      script: `"Hi Dr. [Name], I noticed you're in integrative medicine. I'm [Your Name] with SuperPatch.

We work with a lot of integrative physicians who appreciate that our technology has RCT-level evidence while being completely non-pharmaceutical.

Have you heard of Vibrotactile Technology? It's based on the same mechanoreceptor science recognized by the 2021 Nobel Prize in Medicine."`
    },
    {
      id: "im-email",
      title: "Email Outreach",
      scenario: "Written introduction",
      script: `Dr. [Name], as an integrative medicine physician, you seek evidence-based alternatives to pharmaceuticals.

SuperPatch's Vibrotactile Technology offers exactly that. Our Freedom patch completed a peer-reviewed RCT (Pain Therapeutics journal, ClinicalTrials.gov NCT06505005) showing significant pain reduction. Our REM patch showed 80% of participants stopped sleep medications.

This is drug-free technology with clinical-grade evidence – the best of both worlds for integrative practice.

Would you be interested in a brief call to explore how this fits your patient population?`
    }
  ],

  discoveryQuestions: [
    {
      id: "im-q1",
      question: "How do you typically balance conventional and complementary approaches in your practice?",
      category: "opening"
    },
    {
      id: "im-q2",
      question: "What drives your patients to seek integrative care versus conventional-only?",
      category: "opening"
    },
    {
      id: "im-q3",
      question: "How do you evaluate which complementary approaches to incorporate?",
      category: "opening"
    },
    {
      id: "im-q4",
      question: "What percentage of your patients are specifically seeking alternatives to medications?",
      category: "pain_point"
    },
    {
      id: "im-q5",
      question: "How do you currently manage chronic pain without escalating to stronger pharmaceuticals?",
      category: "pain_point"
    },
    {
      id: "im-q6",
      question: "What options do you offer patients who want to reduce their medication burden?",
      category: "pain_point"
    },
    {
      id: "im-q7",
      question: "What's the biggest gap in your current toolkit for non-pharmaceutical options?",
      category: "pain_point"
    },
    {
      id: "im-q8",
      question: "What complementary modalities do you currently integrate – acupuncture, supplements, mind-body?",
      category: "impact"
    },
    {
      id: "im-q9",
      question: "How important is published clinical evidence for the modalities you recommend?",
      category: "impact"
    },
    {
      id: "im-q10",
      question: "Do you have patients who have 'failed' conventional treatments and are looking for alternatives?",
      category: "impact"
    },
    {
      id: "im-q11",
      question: "When evaluating a new modality, what's most important – mechanism, evidence, patient acceptance, or cost?",
      category: "solution"
    },
    {
      id: "im-q12",
      question: "How do you feel about technologies versus supplements or manual therapies?",
      category: "solution"
    },
    {
      id: "im-q13",
      question: "Would you prefer to have products available in your practice or refer patients externally?",
      category: "solution"
    }
  ],

  productPresentation: {
    problem: `Your patients come to you because they want something different. They're tired of medication side effects, concerned about long-term pharmaceutical use, or simply prefer a more natural approach. But they also want credibility – they want to know what you recommend actually works.`,
    agitate: `The challenge is that many complementary options lack the level of evidence you need to recommend confidently. Supplements have variable quality. Manual therapies are hard to quantify. And 'it worked for my other patients' doesn't always satisfy the trained physician mind. You need something you can stand behind.`,
    solve: `SuperPatch's Vibrotactile Technology gives you both. Let me share the evidence:

Freedom Patch (Pain):
• Double-blind, placebo-controlled RCT
• Published in Pain Therapeutics (peer-reviewed)
• Registered on ClinicalTrials.gov (NCT06505005)
• 118 participants, 14 days
• Significant improvement in pain severity AND objective ROM

REM Patch (Sleep):
• HARMONI study with 113 participants
• 46% faster sleep onset (69 min → 37 min)
• 80% of participants stopped sleep medications
• Only 4.4% mild adverse events

Liberty Patch (Balance):
• 31% improvement in balance scores
• Statistically significant (p<0.05)
• 69 participants

This is clinical-grade evidence for a drug-free technology. The mechanism is mechanoreceptor stimulation – the same pathways recognized by the 2021 Nobel Prize in Medicine. Nothing enters the body; it works through neural pathway modulation.`,
    fullScript: `"Dr. [Name], integrative medicine is about offering patients the best of both worlds – evidence-based care that also honors their preferences for non-pharmaceutical options. I want to share a technology that embodies that bridge: clinical-grade evidence with a completely drug-free mechanism.

[PROBLEM]
Your patients come to you because they want something different. They're tired of medication side effects, concerned about long-term pharmaceutical use, or simply prefer a more natural approach. But they also want credibility – they want to know what you recommend actually works.

[AGITATE]
The challenge is that many complementary options lack the level of evidence you need to recommend confidently. Supplements have variable quality. Manual therapies are hard to quantify. And 'it worked for my other patients' doesn't always satisfy the trained physician mind. You need something you can stand behind.

[SOLVE - CLINICAL EVIDENCE]
SuperPatch's Vibrotactile Technology gives you both:

Freedom Patch (Pain):
- Double-blind, placebo-controlled RCT
- Published in Pain Therapeutics (peer-reviewed)
- Registered on ClinicalTrials.gov (NCT06505005)
- 118 participants, 14 days
- Significant improvement in pain severity AND objective ROM

REM Patch (Sleep):
- HARMONI study with 113 participants
- 46% faster sleep onset (69 min → 37 min)
- 80% of participants stopped sleep medications
- Only 4.4% mild adverse events

Liberty Patch (Balance):
- 31% improvement in balance scores
- Statistically significant (p<0.05)
- 69 participants

[CLINICAL INTEGRATION SCENARIOS]

Pain Management Protocol:
- Start with Freedom patch as first-line or adjunct
- Provides non-opioid, non-NSAID option
- Can layer with conventional if needed
- Clear patient communication: "Let's try this drug-free option first"

Sleep Medicine:
- REM patch before escalating to medications
- Transition tool for patients reducing sleep meds
- 80% success rate for medication discontinuation
- Patient-preferred alternative

Fall Prevention / Geriatrics:
- Liberty patch for balance concerns
- 31% improvement reduces fall risk
- Non-pharmacological approach for poly-pharmacy patients
- Evidence-based recommendation

Stress / Anxiety:
- Peace patch as adjunct or alternative to anxiolytics
- Nervous system support without dependence risk
- Can use alongside talk therapy"`
  },

  objections: [
    {
      id: "im-obj1",
      objection: "I've never heard of this – is it credible?",
      response: `"That's fair – it's relatively new to most physicians. What makes it credible is the evidence base. The Freedom patch has a peer-reviewed RCT published in Pain Therapeutics. The technology is based on mechanoreceptor science – the same field that won the 2021 Nobel Prize in Medicine. I'd be happy to send you the clinical study. What level of evidence would you need to feel comfortable recommending it?"`,
      psychology: "Validate concern, lead with specific evidence, offer to share studies."
    },
    {
      id: "im-obj2",
      objection: "How does this fit alongside my conventional treatments?",
      response: `"It fits as either first-line or adjunct. Because it's non-pharmaceutical with no interactions, you can layer it with conventional treatments or try it first. For pain, you might position it as 'Let's try this before escalating to medications.' For sleep, it could be part of a reduction strategy. How do you currently sequence conventional and complementary approaches?"`,
      psychology: "Show flexibility in integration, ask about their current approach."
    },
    {
      id: "im-obj3",
      objection: "My patients are already skeptical of patches.",
      response: `"That's understandable if they've tried transdermal drug patches without results. This is fundamentally different – it's not delivering a substance. The mechanism is physical pattern stimulation, not chemical delivery. For skeptical patients, framing it as 'Nobel Prize-recognized technology' or sharing the clinical trial data often helps. Would peer-reviewed evidence help your patients accept it?"`,
      psychology: "Differentiate from drug patches, use credibility anchors."
    },
    {
      id: "im-obj4",
      objection: "I need more than one study.",
      response: `"I appreciate that rigorous thinking. We have three published studies – RESTORE for pain, HARMONI for sleep, and a Balance study. Plus ongoing research. That said, sometimes the best evidence is seeing it work for your own patients. Would you be interested in a small trial with selected patients while more data accumulates?"`,
      psychology: "Acknowledge need for more evidence, suggest practical trial approach."
    },
    {
      id: "im-obj5",
      objection: "It seems too simple to work.",
      response: `"I understand – but sometimes the most elegant solutions are simple in application. The mechanism is actually sophisticated: specific ridge patterns calibrated to stimulate mechanoreceptors at precise frequencies, modulating neural signaling through established pathways. The Nobel Prize work showed how these touch pathways affect the entire nervous system. Would you like to see the mechanism documentation?"`,
      psychology: "Acknowledge simplicity concern, reveal underlying complexity."
    },
    {
      id: "im-obj6",
      objection: "What's the cost to patients?",
      response: `"About $3 per day. For many patients, that's less than a daily medication co-pay, and often less than supplements they're already taking. For patients who value drug-free options, this is a reasonable investment. How do your patients typically prioritize cost versus alignment with their values?"`,
      psychology: "Compare to familiar costs, connect to patient values."
    }
  ],

  closingScripts: [
    {
      id: "im-close1",
      title: "Evidence + Alternative Close",
      type: "summary",
      script: `"Dr. [Name], this gives you exactly what integrative medicine needs – clinical-grade evidence for a non-pharmaceutical approach. The Practitioner Kit includes samples to try and share with patients. Ready to add this to your toolkit?"`
    },
    {
      id: "im-close2",
      title: "Clinical Priority Close",
      type: "solution",
      script: `"Based on our conversation, it sounds like pain management without escalation is a priority. Starting with Freedom patches for your chronic pain patients makes sense – you have RCT evidence to share with confidence. Should I set you up with a supply?"`
    },
    {
      id: "im-close3",
      title: "Study-Based Close",
      type: "assumptive",
      script: `"Given your evidence-based approach, I'd suggest starting with the three clinically-studied patches: Freedom (pain RCT), REM (sleep study), and Liberty (balance study). That gives you defensible recommendations. Ready to get started with those?"`
    },
    {
      id: "im-close4",
      title: "Business Model Close",
      type: "alternative",
      script: `"You can purchase at 25% practitioner discount for in-office dispensing, or use an affiliate link for patients to order directly. Given your practice setup, which makes more sense?"`
    }
  ],

  followUpSequence: [
    {
      day: "Day 1",
      title: "Post-Meeting Thank You",
      email: `Dr. [Name], thank you for discussing SuperPatch today.

I appreciate your interest in evidence-based alternatives for your patients. As promised, I've attached the RESTORE study publication from Pain Therapeutics and the HARMONI sleep study summary.

I'll follow up in a few days to discuss how this might work for your patient population.`
    },
    {
      day: "Day 3-4",
      title: "Integration Example",
      email: `Dr. [Name], I wanted to share how one integrative medicine practice positioned SuperPatch:

"I introduce it as 'evidence-based, drug-free technology.' For pain patients, I say: 'This has a peer-reviewed clinical trial behind it, but it's completely non-pharmaceutical. Let's try it before we consider stronger medications.' Patients appreciate having an option that checks both boxes."

Would this framing work for your practice?`
    },
    {
      day: "Day 7",
      title: "Check-In Call",
      voicemail: `"Hi Dr. [Name], this is [Your Name] from SuperPatch. I wanted to follow up on the clinical studies I sent. I know you evaluate evidence carefully, so I'm happy to discuss the methodology or answer any questions. Let me know when you have a few minutes."`,
      email: `Dr. [Name], I wanted to check in after sending the clinical evidence.

If you have questions about the studies or want to discuss how this fits into integrative protocols, I'm happy to schedule a brief call.

What would be most helpful for you?`
    },
    {
      day: "Day 14",
      title: "Final Outreach",
      email: `Dr. [Name], I wanted to reach out once more about SuperPatch.

If adding evidence-based, non-pharmaceutical options to your toolkit is still of interest, I'm here to help. If the timing isn't right, just let me know and I'll check back in a few months.

Best regards!`
    }
  ],

  quickReference: {
    keyBenefits: [
      "Clinical-grade evidence (RCT, peer-reviewed)",
      "Completely drug-free mechanism",
      "No interactions with conventional treatments",
      "80% medication reduction success (REM sleep study)",
      "2021 Nobel Prize-recognized mechanism"
    ],
    bestQuestions: [
      "What percentage of patients seek alternatives to medications?",
      "How do you manage pain without escalating to stronger drugs?",
      "What's the biggest gap in your non-pharmaceutical toolkit?"
    ],
    topObjections: [
      { objection: "Is it credible?", response: "Peer-reviewed RCT, ClinicalTrials.gov registered" },
      { objection: "Fits alongside conventional?", response: "First-line or adjunct, no interactions" },
      { objection: "Patients skeptical", response: "Different mechanism than drug patches; share clinical data" }
    ],
    bestClosingLines: [
      "This gives you evidence-based medicine in a drug-free format.",
      "The best of both worlds for integrative practice.",
      "Ready to try it with your patients?"
    ],
    keyStats: [
      "Freedom: Pain Therapeutics journal, NCT06505005",
      "REM: 80% stopped sleep medications",
      "Liberty: 31% balance improvement, p<0.05"
    ]
  }
};





