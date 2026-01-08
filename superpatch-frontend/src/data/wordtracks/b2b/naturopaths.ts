import { WordTrack } from "@/types/wordtrack";

export const naturopathsWordTrack: WordTrack = {
  id: "b2b-naturopaths",
  productId: "naturopaths",
  market: "b2b",
  title: "Naturopathic Doctor (ND) Practice Word Track",
  overview: `Naturopathic doctors operate on six foundational principles: First Do No Harm (Primum Non Nocere), The Healing Power of Nature (Vis Medicatrix Naturae), Identify and Treat the Cause (Tolle Causam), Doctor as Teacher (Docere), Treat the Whole Person, and Prevention. They seek to stimulate the body's inherent self-healing process using natural, minimally invasive interventions.

SuperPatch's Vibrotactile Technology aligns perfectly with naturopathic philosophy - it's drug-free, non-invasive, works with the body's innate healing ability, and honors "First Do No Harm."

Why NDs Are Ideal Partners:
• Philosophy Alignment - Drug-free, non-invasive technology is core to their practice
• Patient Expectations - Patients specifically seek natural alternatives
• Holistic Approach - Interested in addressing multiple wellness dimensions
• Evidence-Based - Modern NDs appreciate clinical research
• Product Retail - Many NDs already have dispensaries for supplements and natural products`,

  openingScripts: [
    {
      id: "nd-cold-call",
      title: "Cold Call Introduction",
      scenario: "First contact with a naturopathic doctor",
      script: `"Good morning Dr. [Name], this is [Your Name] with SuperPatch. I'm reaching out to naturopathic doctors who are looking for drug-free technologies that work with the body's innate healing ability.

We've developed a Vibrotactile Technology that stimulates mechanoreceptors to activate neural pathways – essentially helping the body help itself.

Does that align with what you look for in patient solutions?"`
    },
    {
      id: "nd-philosophy",
      title: "Philosophy Alignment Approach",
      scenario: "Leading with naturopathic principles",
      script: `"Hi Dr. [Name], I know as a naturopath, you focus on the vis medicatrix naturae – the healing power of nature.

I wanted to share a technology that truly embodies 'First Do No Harm.' Our patches don't introduce any substances into the body. They work through haptic patterns that stimulate the same neural pathways recognized by the 2021 Nobel Prize in Medicine.

Would you be open to learning more about how this could support your patients?"`
    },
    {
      id: "nd-referral",
      title: "Referral Introduction",
      scenario: "Coming from another ND's recommendation",
      script: `"Hi Dr. [Name], I'm [Your Name] with SuperPatch. Dr. [Referral Name] suggested I reach out – they've been using our VTT patches with their patients and thought you'd appreciate the drug-free, evidence-based approach.

They mentioned you have a strong focus on [specialty]. I'd love to share how other NDs are integrating this technology."`
    },
    {
      id: "nd-conference",
      title: "Conference/Trade Show Approach",
      scenario: "Meeting at professional events",
      script: `"Hi! I noticed your badge says you're a naturopathic doctor – I love connecting with NDs because your philosophy aligns so perfectly with our technology.

I'm [Your Name] with SuperPatch. Our patches use Vibrotactile Technology to stimulate the body's own neural responses. No chemicals, no transdermal delivery – just working with the body's innate systems.

Sound like something your patients might appreciate?"`
    },
    {
      id: "nd-email",
      title: "Email Outreach",
      scenario: "Written introduction",
      script: `Dr. [Name], as a naturopathic doctor committed to 'First Do No Harm,' you carefully evaluate every intervention you recommend.

I wanted to introduce SuperPatch – a Vibrotactile Technology that works through mechanoreceptor stimulation, not chemical intervention. Our Freedom patch just completed a peer-reviewed RCT showing significant pain reduction without any systemic effects.

For patients who prefer non-oral interventions or are sensitive to supplements, this offers a completely different approach.

Would you be open to a brief call to explore if this fits your practice?`
    }
  ],

  discoveryQuestions: [
    {
      id: "nd-q1",
      question: "What drew you to naturopathic medicine, and how does that influence what you recommend to patients?",
      category: "opening"
    },
    {
      id: "nd-q2",
      question: "How do you typically approach symptom management while working on root causes?",
      category: "opening"
    },
    {
      id: "nd-q3",
      question: "What percentage of your patients come to you specifically seeking alternatives to conventional medications?",
      category: "opening"
    },
    {
      id: "nd-q4",
      question: "What are the most common reasons patients feel frustrated with their progress?",
      category: "pain_point"
    },
    {
      id: "nd-q5",
      question: "For patients dealing with chronic pain, what do you currently recommend between visits?",
      category: "pain_point"
    },
    {
      id: "nd-q6",
      question: "How do you address patients who have 'supplement fatigue' but still need support?",
      category: "pain_point"
    },
    {
      id: "nd-q7",
      question: "Do you have patients who struggle with oral supplements due to GI issues?",
      category: "pain_point"
    },
    {
      id: "nd-q8",
      question: "What non-oral therapies do you currently incorporate in your practice?",
      category: "impact"
    },
    {
      id: "nd-q9",
      question: "Do you offer any products for at-home support between appointments?",
      category: "impact"
    },
    {
      id: "nd-q10",
      question: "What's your experience been with wearable or topical therapies?",
      category: "impact"
    },
    {
      id: "nd-q11",
      question: "When evaluating a new therapy, what criteria matter most – mechanism of action, clinical evidence, patient experience, or something else?",
      category: "solution"
    },
    {
      id: "nd-q12",
      question: "How important is it that you understand exactly how a therapy works before recommending it?",
      category: "solution"
    },
    {
      id: "nd-q13",
      question: "Would you prefer to have products available in-office or refer patients to order directly?",
      category: "solution"
    },
    {
      id: "nd-q14",
      question: "If you could add one new modality to your toolkit that truly works with the body's innate healing, what would it address?",
      category: "solution"
    },
    {
      id: "nd-q15",
      question: "What would it mean for your practice if you had a completely non-invasive option for pain management?",
      category: "solution"
    }
  ],

  productPresentation: {
    problem: `Many of your patients come to you after exhausting conventional options. They're tired of medications with side effects, they're taking handfuls of supplements, and they're still struggling – especially with pain, sleep, or stress. And while you're working on root causes, they need symptomatic support that doesn't compromise their healing.`,
    agitate: `Here's the challenge: Most symptomatic options either introduce substances into the body or only provide temporary relief. Your patients want something different – something that actually works *with* their biology instead of forcing a chemical change. They trust you to find those solutions, but the options have been limited.`,
    solve: `That's where SuperPatch's Vibrotactile Technology comes in. These patches don't deliver any substance into the body. They work through specialized ridge patterns that stimulate mechanoreceptors in the skin – the same touch receptors recognized by the 2021 Nobel Prize in Medicine.

This stimulation activates neural pathways that support pain relief, sleep regulation, or stress response – depending on the specific patch pattern. It's essentially helping the body's own nervous system do what it's designed to do.

The Freedom patch completed a peer-reviewed, double-blind RCT showing significant pain reduction and improved range of motion. This is evidence you can share with confidence.`,
    fullScript: `"Dr. [Name], I know as a naturopath, every therapy you recommend goes through a filter: Does it align with the healing power of nature? Does it honor 'First Do No Harm'? Does it support the body's own processes? I want to show you a technology that passes all three tests.

[PROBLEM]
Many of your patients come to you after exhausting conventional options. They're tired of medications with side effects, they're taking handfuls of supplements, and they're still struggling – especially with pain, sleep, or stress. And while you're working on root causes, they need symptomatic support that doesn't compromise their healing.

[AGITATE]
Here's the challenge: Most symptomatic options either introduce substances into the body or only provide temporary relief. Your patients want something different – something that actually works with their biology instead of forcing a chemical change. They trust you to find those solutions, but the options have been limited.

[SOLVE]
That's where SuperPatch's Vibrotactile Technology comes in. These patches don't deliver any substance into the body. They work through specialized ridge patterns that stimulate mechanoreceptors in the skin – the same touch receptors recognized by the 2021 Nobel Prize in Medicine.

This stimulation activates neural pathways that support pain relief, sleep regulation, or stress response – depending on the specific patch pattern. It's essentially helping the body's own nervous system do what it's designed to do.

[PORTFOLIO OVERVIEW]
Let me share how the portfolio aligns with naturopathic practice:

For Pain & Inflammation:
- Freedom – Pain relief, RESTORE study evidence, great for chronic pain patients

For Sleep & Circadian Rhythm:
- REM – HARMONI study: 46% faster sleep, 80% stopped sleep meds
- Lumi – Circadian rhythm support, jet lag

For Nervous System & Stress:
- Peace – Stress and nervous system regulation
- Joy – Mood and emotional well-being

For Energy & Metabolism:
- Boost – Natural energy without stimulants
- Ignite – Metabolism and weight management

For Cognitive Function:
- Focus – Mental clarity and concentration

For Immune Support:
- Defend – Immune system support

For Balance & Mobility:
- Liberty – 31% balance improvement, great for seniors

For Specific Populations:
- Victory – Athletes and performance
- Kick It – Addiction recovery and cravings
- Rocket – Men's vitality"`
  },

  objections: [
    {
      id: "nd-obj1",
      objection: "I need to understand the mechanism better.",
      response: `"Absolutely – understanding mechanism of action is essential for NDs. The patches stimulate mechanoreceptors, specifically Meissner's corpuscles and Merkel cells. This activates Piezo1 and Piezo2 ion channels, which modulate neural signaling through Gate Control Theory principles. The specific ridge patterns are engineered to create different neural responses. Would you like me to send you our technical mechanism document?"`,
      psychology: "NDs value understanding how things work at a fundamental level. Providing scientific detail builds credibility."
    },
    {
      id: "nd-obj2",
      objection: "My patients prefer supplements they can take internally.",
      response: `"Many patients do prefer oral supplements, and this isn't meant to replace those. But you likely have patients who have GI sensitivities, are on too many supplements already, or want non-oral options. For those patients, this offers a completely different delivery mechanism that doesn't require digestion or metabolism. Which patients come to mind who might benefit from a non-oral option?"`,
      psychology: "Position as complementary, not competitive. Redirect to specific patient types who need alternatives."
    },
    {
      id: "nd-obj3",
      objection: "How does this fit with my root-cause approach?",
      response: `"I love that question. This is symptomatic support while you work on root causes. The beauty is it doesn't interfere with any of your other therapies – no interactions, no metabolic load. It simply supports the body's own regulatory mechanisms while your deeper work takes effect. How do you currently provide symptomatic support while addressing root causes?"`,
      psychology: "Acknowledge their philosophy and position VTT as supportive, not replacing root-cause work."
    },
    {
      id: "nd-obj4",
      objection: "I'd want to see more long-term studies.",
      response: `"That's a thoughtful concern. While we have completed RCTs demonstrating efficacy and safety, you're right that this technology is relatively new. What I can tell you is that because it's non-pharmaceutical and doesn't introduce substances, the safety profile is fundamentally different from drugs or even supplements. Would you feel comfortable trying it with a few patients while longer-term data accumulates?"`,
      psychology: "Validate the concern, emphasize safety profile, suggest a low-risk trial approach."
    },
    {
      id: "nd-obj5",
      objection: "It seems too simple to work.",
      response: `"I understand that concern – but sometimes the most elegant solutions are the simplest. Think about acupuncture or homeopathy – they work with subtle mechanisms. VTT works through the same touch pathways your patients experience during hands-on therapies, just in a consistent, wearable form. Would you be open to trying it yourself to experience the effect?"`,
      psychology: "Use analogy to other subtle therapies NDs already accept. Offer personal experience."
    },
    {
      id: "nd-obj6",
      objection: "My patients are skeptical of patches – they've tried things that didn't work.",
      response: `"That skepticism makes sense, especially if they've tried drug-delivery patches without results. This is fundamentally different – it's not putting anything into the body. The conversation shifts from 'trust this substance' to 'let's see how your body responds.' Many NDs find that the drug-free aspect actually makes it easier to recommend to skeptical patients. What would you need to feel confident recommending it?"`,
      psychology: "Differentiate from failed past experiences. Emphasize the drug-free difference."
    }
  ],

  closingScripts: [
    {
      id: "nd-close1",
      title: "Philosophy Close",
      type: "assumptive",
      script: `"Dr. [Name], based on our conversation, it sounds like this aligns well with your naturopathic principles – it works with the body, not against it, and honors 'First Do No Harm.' The Practitioner Starter Kit would let you experience each patch yourself and try them with select patients. Ready to get started?"`
    },
    {
      id: "nd-close2",
      title: "Patient-Need Close",
      type: "solution",
      script: `"You mentioned those chronic pain patients who are frustrated with their progress. The Freedom patch could give them symptomatic support while your root-cause work takes effect. Would you like to start with a focus on pain, or would the full portfolio give you more flexibility?"`
    },
    {
      id: "nd-close3",
      title: "Trial Close",
      type: "trial",
      script: `"On a scale of 1-10, how well does this align with what you look for in patient solutions? [Wait] What would move that to a 10? Let's address that and get you started."`
    },
    {
      id: "nd-close4",
      title: "Business Model Close",
      type: "alternative",
      script: `"We can set you up to dispense directly from your practice at a 25% discount, or through an affiliate program where patients order directly. Given that you already have a dispensary, which model fits your practice better?"`
    }
  ],

  followUpSequence: [
    {
      day: "Day 1",
      title: "Post-Meeting Thank You",
      email: `Dr. [Name], thank you for discussing SuperPatch today. I appreciate your thoughtful questions about mechanism of action – it's clear you carefully evaluate everything you recommend.

As promised, I've attached the RESTORE study abstract and our technical mechanism overview. I think you'll find the mechanoreceptor pathway aligns well with your naturopathic approach.

I'll follow up in a few days to see if you'd like to try a Practitioner Kit.`
    },
    {
      day: "Day 3-4",
      title: "Value-Add Follow-Up",
      email: `Dr. [Name], I was thinking about our conversation and your focus on 'First Do No Harm.'

One of the NDs I work with, Dr. Jennifer Walsh, told me this: 'I was skeptical at first because it seemed too simple. But when I tried Freedom on my own shoulder pain, I felt the difference within an hour. Now it's my go-to for patients who need pain support without adding more to their supplement regimen.'

Would you be interested in trying a sample yourself?`
    },
    {
      day: "Day 7",
      title: "Check-In Call",
      voicemail: `"Hi Dr. [Name], this is [Your Name] from SuperPatch. I wanted to follow up on the information I sent about our Vibrotactile Technology. I know you evaluate things thoroughly, so I wanted to offer a quick call to answer any questions about the mechanism or clinical evidence. When would be a good time?"`,
      email: `Dr. [Name], I wanted to follow up on the SuperPatch information I sent.

I know naturopathic doctors evaluate every therapy carefully before recommending it. If you have any questions about the mechanism of action, clinical evidence, or how other NDs are using it, I'm happy to schedule a brief call.

Let me know what would be helpful.`
    },
    {
      day: "Day 14",
      title: "Final Outreach",
      email: `Dr. [Name], I wanted to reach out once more about SuperPatch.

If providing a truly drug-free, non-invasive option for your patients is still of interest, I'm here to help you get started. If the timing isn't right, just let me know and I'll check back in a few months.

Wishing you and your patients well!`
    }
  ],

  quickReference: {
    keyBenefits: [
      "Works WITH the body's innate healing mechanisms",
      "100% drug-free, no substances introduced",
      "No metabolic load, no liver processing required",
      "No interactions with supplements or medications",
      "Non-invasive, honors 'First Do No Harm'"
    ],
    bestQuestions: [
      "How do you provide symptomatic support while working on root causes?",
      "Do you have patients who struggle with oral supplements?",
      "What would it mean to have a non-invasive option for pain patients?"
    ],
    topObjections: [
      { objection: "Need to understand mechanism", response: "Mechanoreceptor stimulation, Piezo channels, Gate Control Theory" },
      { objection: "Patients prefer supplements", response: "Complementary, not competitive; great for GI-sensitive patients" },
      { objection: "Too simple", response: "Elegant solutions work with the body's own systems" }
    ],
    bestClosingLines: [
      "This aligns with your naturopathic principles – works with the body, honors 'First Do No Harm.'",
      "Ready to try the Practitioner Kit?",
      "Which model fits your practice better – dispensing or affiliate?"
    ],
    keyStats: [
      "Freedom: RCT in Pain Therapeutics",
      "REM: 80% stopped sleep medications",
      "Liberty: 31% balance improvement"
    ]
  }
};





