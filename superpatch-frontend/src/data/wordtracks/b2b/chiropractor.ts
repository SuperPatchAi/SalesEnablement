import { WordTrack, ProductRecommendation } from "@/types/wordtrack";

export const chiropractorB2BWordTrack: WordTrack = {
  id: "chiropractor-b2b",
  practitionerType: "chiropractor",
  market: "b2b",
  tagline: "Complete Sales Guide for Selling SuperPatch to Chiropractors (DCs)",

  overview: `Chiropractors focus on the relationship between the spine and nervous system, believing that proper alignment enables the body's innate healing capacity. They favor non-invasive, drug-free interventions that support natural recovery.

SuperPatch's Vibrotactile Technology aligns perfectly with the chiropractic philosophy of working with the body's natural systems. Chiropractors are ideal partners because:
- Their patient profile includes those with acute/chronic pain seeking medication alternatives
- They're already committed to drug-free, non-invasive care
- Patients return regularly, creating ongoing product opportunity
- Patients need support between adjustment sessions
- Many DCs already retail supplements and wellness products`,

  practitionerProfile: {
    type: "chiropractor",
    practicePhilosophy: "Focus on the relationship between the spine and nervous system, believing proper alignment enables the body's innate healing capacity. Favor non-invasive, drug-free interventions.",
    whyIdealPartner: [
      "Patient profile includes those with acute/chronic pain seeking medication alternatives",
      "Already committed to drug-free, non-invasive care",
      "Patients return regularly, creating ongoing product opportunity",
      "Patients need support between adjustment sessions",
      "Many DCs already retail supplements and wellness products"
    ],
    commonPainPoints: [
      "Patients relapse between appointments",
      "Limited options for at-home pain management they can recommend",
      "Competing with pain medication for patient compliance",
      "Need for adjunct therapies that enhance adjustment results",
      "Desire to differentiate from other chiropractors"
    ],
    patientDemographics: [
      "Back pain sufferers (acute and chronic)",
      "Neck pain and tension headache patients",
      "Sports injury recovery",
      "Auto accident rehabilitation",
      "Seniors with mobility concerns",
      "Office workers with postural issues"
    ]
  },

  productRecommendations: [
    { patientPresentation: "Low back pain, sciatica", productId: "freedom", productName: "Freedom", emoji: "🔵", reason: "RESTORE study shows pain reduction + ROM improvement", isPrimary: true },
    { patientPresentation: "Neck pain, tension headaches", productId: "freedom", productName: "Freedom", emoji: "🔵", reason: "Targets minor aches, complements cervical adjustments", isPrimary: true },
    { patientPresentation: "Poor sleep affecting recovery", productId: "rem", productName: "REM", emoji: "🟣", reason: "HARMONI study: 46% faster sleep onset", isPrimary: true },
    { patientPresentation: "Balance issues, fall risk seniors", productId: "liberty", productName: "Liberty", emoji: "🟢", reason: "31% balance improvement (p<0.05)", isPrimary: true },
    { patientPresentation: "Post-adjustment muscle soreness", productId: "freedom", productName: "Freedom", emoji: "🔵", reason: "Non-invasive support between visits", isPrimary: true },
    { patientPresentation: "Athletes needing recovery", productId: "victory", productName: "Victory", emoji: "🏆", reason: "Performance and recovery support", isPrimary: true },
    { patientPresentation: "Stress affecting healing", productId: "peace", productName: "Peace", emoji: "☮️", reason: "Stress reduction supports recovery", isPrimary: false },
    { patientPresentation: "Low energy, fatigue", productId: "boost", productName: "Boost", emoji: "⚡", reason: "Natural energy without stimulants", isPrimary: false },
    { patientPresentation: "Weight management goals", productId: "ignite", productName: "Ignite", emoji: "🔥", reason: "Metabolism support", isPrimary: false },
    { patientPresentation: "Mental fog, concentration issues", productId: "focus", productName: "Focus", emoji: "🎯", reason: "Clarity and concentration", isPrimary: false },
  ] as ProductRecommendation[],

  openingScripts: [
    {
      id: "cold-call",
      title: "Cold Call Introduction",
      scenario: "First contact with a chiropractic practice",
      script: `Good morning, this is [Your Name] with SuperPatch. I'm reaching out to chiropractors who are looking for drug-free solutions to support their patients between adjustments. 

I know DCs are already committed to non-invasive care, and I wanted to share a technology that's been clinically studied for pain relief. 

Do you have two minutes, or would scheduling a brief call work better?`
    },
    {
      id: "inquiry-followup",
      title: "Following Up on Inquiry",
      scenario: "Responding to a practitioner who reached out",
      script: `Hi Dr. [Name], this is [Your Name] from SuperPatch returning your call. Thanks for your interest in our Vibrotactile Technology patches. 

I'd love to learn more about your practice and the types of patients you see most often. What's driving your interest in drug-free pain relief options?`
    },
    {
      id: "referral",
      title: "Referral Introduction",
      scenario: "Another DC referred this practitioner",
      script: `Hi Dr. [Name], I'm [Your Name] with SuperPatch. Dr. [Referral Name] suggested I reach out – they mentioned you might be interested in the Freedom patch they've been using with their patients. 

They told me you have a great practice focused on [specialty]. I'd love to share how other DCs are using our patches as take-home support for their patients.`
    },
    {
      id: "trade-show",
      title: "Trade Show/Conference Approach",
      scenario: "Meeting at a chiropractic conference",
      script: `Hi there! Are you a practicing chiropractor? Great! I'm [Your Name] with SuperPatch. 

We work with a lot of DCs who love our drug-free pain relief patches as take-home support for their patients. Have you ever heard of Vibrotactile Technology? It actually works with the same neural pathways recognized by the 2021 Nobel Prize in Medicine.`
    },
    {
      id: "linkedin",
      title: "LinkedIn/Email Outreach",
      scenario: "Digital outreach to prospects",
      script: `Dr. [Name], I noticed your practice focuses on [specialty]. Many chiropractors I work with were looking for a clinically-studied, drug-free option to recommend when patients ask about at-home pain support between adjustments. 

Our Freedom patch just completed a peer-reviewed RCT showing significant pain reduction. Would you be open to a 15-minute call to see if this could complement your practice?`
    }
  ],

  discoveryQuestions: [
    { id: "practice-length", category: "practice", question: "How long have you been in practice, and what's your primary specialty focus?" },
    { id: "acute-vs-chronic", category: "practice", question: "What percentage of your patients present with acute pain versus chronic conditions?" },
    { id: "patient-journey", category: "practice", question: "What does your typical patient journey look like from first visit to maintenance care?" },
    { id: "common-complaint", category: "patient", question: "What's the most common complaint you hear from patients between their appointments?" },
    { id: "home-management", category: "patient", question: "How do your patients typically manage discomfort at home after an adjustment?" },
    { id: "current-recommend", category: "current", question: "What do you currently recommend for patients who need pain relief between visits?" },
    { id: "patient-relapse", category: "patient", question: "Have you noticed patients relapsing or losing progress between appointments? What do you think contributes to that?" },
    { id: "retail-products", category: "current", question: "Do you currently retail any products in your practice – supplements, supports, or wellness items?" },
    { id: "product-experience", category: "current", question: "What's been your experience with the products you've tried or recommended?" },
    { id: "products-missing", category: "current", question: "Are there any products you've tried that didn't resonate with your patients? What was missing?" },
    { id: "evaluation-factors", category: "decision", question: "When evaluating a new product for your practice, what factors matter most to you – clinical evidence, patient feedback, ease of use, or something else?" },
    { id: "drug-free-importance", category: "decision", question: "How important is it that products you recommend align with your drug-free philosophy?" },
    { id: "retail-vs-affiliate", category: "decision", question: "Would you prefer to stock products for direct retail, or refer patients through an affiliate model?" },
    { id: "ideal-support", category: "future", question: "If you could give your patients one thing to accelerate their recovery at home, what would it be?" },
    { id: "better-outcomes", category: "future", question: "What would it mean for your practice if patients had better outcomes between visits?" }
  ],

  productPresentation: {
    problem: `I hear from DCs every day that their biggest challenge isn't what happens in the office – it's what happens when patients go home. They're making great progress on the table, but between visits, patients are reaching for NSAIDs, dealing with stress that tightens them back up, or simply not getting the sleep they need to recover. And let's be honest, you can't follow them home.`,
    
    agitate: `This creates a frustrating cycle. Patients feel great after an adjustment, then within days they're back to square one. They start to wonder if chiropractic is really working. Meanwhile, you know the care is solid – it's just that the home support isn't there. And recommending pain medication goes against everything your practice stands for.`,
    
    solve: `That's where SuperPatch comes in. Our Freedom patch uses Vibrotactile Technology – a drug-free, non-invasive approach that works with the same mechanoreceptors you understand from neurology. It's not a transdermal patch delivering chemicals; it's a haptic technology that stimulates neural pathways to support the body's own pain relief responses.

The RESTORE study – a double-blind, placebo-controlled RCT with 118 participants – showed significant improvement in pain severity AND objective range of motion improvement. That's the kind of evidence you can share with confidence.`,

    explain: `While Freedom is our flagship for pain, we have patches for every patient need:

**For Pain Patients:**
- Freedom – Pain relief, clinically proven in RESTORE study
- Victory – Performance and recovery for your athletes

**For Sleep Issues Affecting Recovery:**
- REM – HARMONI study showed 80% stopped sleep medications

**For Balance/Fall Risk:**
- Liberty – 31% improvement in balance scores

The best part? These are all drug-free, non-invasive, and align perfectly with your practice philosophy.`
  },

  objections: [
    {
      id: "need-research",
      objection: "I need to see more research.",
      response: "I completely understand – as a clinician, you should demand evidence. The Freedom patch has completed a peer-reviewed, double-blind, placebo-controlled RCT published in Pain Therapeutics. It's registered on ClinicalTrials.gov as NCT06505005. I'd be happy to send you the full study abstract. Beyond that, we have the HARMONI sleep study and the Balance study for our other patches. What specific outcomes would be most relevant for your patient population?",
      psychology: "Validates clinical standards, provides specific evidence"
    },
    {
      id: "patients-wont-believe",
      objection: "My patients won't believe in a patch.",
      response: "That's a fair concern. What we've found is that patients don't need to 'believe' – they just need to experience it. Many DCs start by trying it themselves, then on a few patients who are open-minded. Once patients feel the difference, the conversations get much easier. Would you like to try a sample yourself first?",
      psychology: "Overcomes belief barrier with experience-based approach"
    },
    {
      id: "already-recommend",
      objection: "I already recommend supplements/products.",
      response: "That's great – it shows your patients trust your recommendations. SuperPatch isn't competing with supplements; it's a completely different category. Supplements work internally; VTT works through neural pathways externally. Many practitioners use both. Which patients do you think could benefit from an additional drug-free option for pain relief?",
      psychology: "Positions as complementary, not competitive"
    },
    {
      id: "too-expensive",
      objection: "It's too expensive for my patients.",
      response: "I understand – value is important. At around $3 per day, many patients find it comparable to or less than their daily supplements. And unlike repeat purchases of pain relievers, the relief is consistent without building tolerance. For patients who would otherwise reach for NSAIDs daily, what's the value of avoiding those GI and cardiovascular risks?",
      psychology: "Reframes cost as value, highlights risk avoidance"
    },
    {
      id: "dont-want-to-sell",
      objection: "I don't want to seem like I'm 'selling' products.",
      response: "I hear that from a lot of practitioners. But here's another way to look at it: you're not selling – you're solving a problem patients are already asking about. When patients ask what they can do at home between visits, what do you currently tell them? This gives you an answer that aligns with your drug-free philosophy.",
      psychology: "Reframes selling as problem-solving"
    },
    {
      id: "need-to-test",
      objection: "I'd need to see it work on my own patients first.",
      response: "Absolutely – that's the best way to evaluate it. Would you like to start with a small practitioner kit to try with a few patients? We can set you up with samples and track their outcomes together. What conditions would you want to test it with first?",
      psychology: "Validates need for proof, offers low-risk trial"
    },
    {
      id: "no-time",
      objection: "I don't have time to learn a new product.",
      response: "I get it – your schedule is packed. The good news is there's almost no learning curve. It's a simple patch application, and we provide patient education materials. Most DCs just say, 'This is what I recommend for support at home between visits.' Would a quick 10-minute training call help you feel confident introducing it?",
      psychology: "Minimizes time investment, offers easy implementation"
    },
    {
      id: "different-from-salonpas",
      objection: "How is this different from other patches like Salonpas?",
      response: "Great question. Traditional patches like Salonpas work through transdermal drug delivery – they put menthol or lidocaine into your body. SuperPatch uses Vibrotactile Technology – it doesn't deliver any substance. The specialized ridge patterns stimulate mechanoreceptors in your skin, which then activate neural pathways. It's a completely different mechanism that aligns with your drug-free approach.",
      psychology: "Clear differentiation on mechanism of action"
    }
  ],

  closingScripts: [
    {
      id: "assumptive",
      title: "Assumptive Close",
      type: "assumptive",
      script: "Dr. [Name], based on what you've shared about your back pain patients, it sounds like Freedom would be a perfect take-home option for them. Most DCs start with our Practitioner Starter Kit – it includes samples of each patch plus patient education materials. Should I set you up with that so you can start offering this to patients this week?"
    },
    {
      id: "alternative",
      title: "Alternative Close",
      type: "alternative",
      script: "It sounds like you're interested in trying this with your patients. Would you prefer to start with just the Freedom patches for your pain patients, or would you like the full portfolio so you can address sleep, balance, and stress issues too?"
    },
    {
      id: "trial",
      title: "Trial Close",
      type: "trial",
      script: "Before we move forward, on a scale of 1-10, how confident are you that your pain patients would benefit from a drug-free take-home option? [Wait for response] What would it take to get you to a 10?"
    },
    {
      id: "business-model",
      title: "Business Model Close",
      type: "business_model",
      script: "We have two ways to work with practitioners. You can purchase wholesale at 25% off and retail directly to patients, or we can set you up with an affiliate link where patients order directly and you earn commission. Which model fits better with how you run your practice?"
    },
    {
      id: "urgency",
      title: "Urgency Close",
      type: "urgency",
      script: "Dr. [Name], I should mention that we're running a practitioner launch special this month with an extra discount on the starter kit. Given that you mentioned wanting something for your patients' at-home support, it makes sense to get started while this offer is available. Can I process your order today?"
    }
  ],

  followUpSequence: [
    {
      day: "Day 1",
      title: "Post-Meeting Thank You",
      email: `Dr. [Name], thank you for your time today discussing SuperPatch for your practice. As promised, I've attached the RESTORE study summary and the practitioner information sheet.

Based on our conversation, I think the Practitioner Starter Kit would be the best way to evaluate the patches with your patients. I'll follow up in a couple of days to answer any questions.

Looking forward to helping your patients achieve better outcomes!`
    },
    {
      day: "Day 3-4",
      title: "Value Add",
      email: `Dr. [Name], I was thinking about the back pain patients you mentioned – the ones who lose progress between visits.

Here's a quick case study: Dr. Sarah Mitchell, a DC in [State], started recommending Freedom patches to her chronic low back patients. She told me, "My patients used to slide back 50% between visits. Now they're maintaining 80% of their progress. It's made my adjustments more effective because we're not starting over every time."

Would you like to hear more about how other chiropractors are integrating patches into their patient care?`
    },
    {
      day: "Day 7",
      title: "Check-In",
      phone: "Hi Dr. [Name], this is [Your Name] from SuperPatch. I wanted to check in and see if you've had a chance to review the study information I sent. I'd love to answer any questions and discuss how we could set you up with a trial for your patients. Give me a call back at [number] when you have a minute."
    },
    {
      day: "Day 14",
      title: "Final Outreach",
      email: `Dr. [Name], I wanted to reach out one more time regarding SuperPatch.

I know you're busy serving your patients, so I'll keep this brief: If providing a drug-free, clinically-supported option for at-home pain management is still of interest, I'm here to help you get started.

If the timing isn't right, no problem at all. Just reply to this email whenever you're ready to explore it further.

Wishing your practice continued success!`
    }
  ],

  businessModelOptions: {
    wholesale: `**Wholesale/Retail (25% Practitioner Discount)**
- How it works: Purchase patches at 25% discount, retail directly to patients
- Pros: Higher margin per unit, immediate availability for patients, complete control
- Cons: Inventory investment, handling transactions
- Best for: Practices that already retail products`,
    affiliate: `**Affiliate/Referral Program**
- How it works: Provide patients with unique link/code, earn commission on orders
- Pros: No inventory, no transactions to handle, passive income
- Cons: Lower margin, patients order separately
- Best for: Practitioners who prefer not to handle retail`,
    hybrid: `**Hybrid Model**
- How it works: Stock key products (Freedom, REM) for immediate sale, affiliate for full portfolio
- Pros: Balance of margin and convenience
- Best for: Most practitioners starting out`
  },

  quickReference: {
    keyBenefits: [
      "Freedom 🔵 – Pain relief between adjustments (RESTORE study)",
      "REM 🟣 – Sleep support for recovery (HARMONI study)",
      "Liberty 🟢 – Balance for fall-risk patients (Balance study)"
    ],
    bestQuestions: [
      "What do you currently recommend for at-home pain support?",
      "How do patients manage between visits?",
      "What would better outcomes between visits mean for your practice?"
    ],
    topObjections: [
      { objection: "Need more research", response: "RESTORE study, ClinicalTrials.gov NCT06505005" },
      { objection: "Patients won't believe it", response: "Let them experience it; start with open-minded patients" },
      { objection: "Too expensive", response: "$3/day, less than daily NSAIDs, no side effects" }
    ],
    bestClosingLines: [
      "Most DCs start with the Practitioner Starter Kit to try with a few patients. Should I set you up so you can start offering drug-free support this week?"
    ],
    keyStats: [
      "Peer-reviewed RCT published in Pain Therapeutics",
      "118 participants, 14-day double-blind study",
      "Significant pain reduction AND ROM improvement",
      "Drug-free, non-invasive, no interactions"
    ]
  }
};

