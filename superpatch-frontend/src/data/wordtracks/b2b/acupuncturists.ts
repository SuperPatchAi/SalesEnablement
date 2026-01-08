import { WordTrack } from "@/types/wordtrack";

export const acupuncturistsWordTrack: WordTrack = {
  id: "b2b-acupuncturists",
  productId: "acupuncturists",
  market: "b2b",
  title: "Acupuncturist (L.Ac) Practice Word Track",
  overview: `Acupuncturists work with Qi (vital energy) flow through meridians to restore balance and support the body's self-healing. They understand that subtle interventions can produce significant physiological effects and are comfortable with non-pharmaceutical approaches to health.

SuperPatch's Vibrotactile Technology resonates with acupuncturists because it works through similar principles - skin stimulation affecting the whole body through neural pathways.

Why Acupuncturists Are Ideal Partners:
• Meridian Understanding - Already work with energy pathways and neural signaling
• Touch-Based Therapy - Understand how skin stimulation affects the whole body
• Patient Profile - Patients seeking alternatives to Western medicine
• Session Gaps - Patients need support between acupuncture appointments
• Open to Innovation - Willing to explore new modalities that complement their practice`,

  openingScripts: [
    {
      id: "acu-meridian",
      title: "Meridian Bridge Opening",
      scenario: "Connecting VTT to acupuncture principles",
      script: `"Hi, this is [Your Name] with SuperPatch. I'm reaching out to acupuncturists because you already understand something Western medicine is just discovering – that stimulating specific points on the skin can have profound effects throughout the body.

Our Vibrotactile Technology works through mechanoreceptors to activate neural pathways. It's a different modality, but the principle of skin-to-system connection is similar.

Would you be interested in learning more?"`
    },
    {
      id: "acu-takehome",
      title: "Take-Home Support Opening",
      scenario: "Addressing the gap between sessions",
      script: `"Hi [Name], I'm [Your Name] with SuperPatch. Many acupuncturists I work with tell me their patients need support between sessions. They're not going to needle themselves at home, but they want to maintain their progress.

Our drug-free patches give patients something to use between treatments that works through similar neural pathways.

Is take-home patient support something you think about?"`
    },
    {
      id: "acu-referral",
      title: "Referral Introduction",
      scenario: "Coming from another practitioner's recommendation",
      script: `"Hi [Name], I'm calling because [Referral Name] suggested you might be interested in SuperPatch. They've been recommending our patches to their patients for at-home support and thought you'd appreciate the technology.

They mentioned you specialize in [pain/stress/sleep] – we have specific patches for each of those concerns."`
    },
    {
      id: "acu-conference",
      title: "Conference Approach",
      scenario: "Meeting at professional events",
      script: `"Hi! I saw your badge – are you a licensed acupuncturist? Great to meet you!

I'm [Your Name] with SuperPatch. We work with a lot of acupuncturists because our technology has an interesting parallel to your work. We stimulate mechanoreceptors in the skin to affect neural pathways throughout the body.

Sound familiar? It's like acupuncture without the needles – for home use between sessions."`
    },
    {
      id: "acu-email",
      title: "Email Outreach",
      scenario: "Written introduction",
      script: `[Name], as an acupuncturist, you understand that subtle stimulation can produce significant effects.

SuperPatch uses Vibrotactile Technology – specialized patterns that stimulate mechanoreceptors, activating neural pathways for pain relief, sleep support, or stress reduction. It's a different mechanism than acupuncture, but the principle of skin stimulation affecting the whole body resonates with many practitioners.

Our Freedom patch completed a peer-reviewed RCT showing significant pain reduction.

Would you be interested in exploring how this could support your patients between sessions?`
    }
  ],

  discoveryQuestions: [
    {
      id: "acu-q1",
      question: "What conditions do you most commonly treat in your practice?",
      category: "opening"
    },
    {
      id: "acu-q2",
      question: "How do you typically structure patient treatment plans – frequency of visits, duration?",
      category: "opening"
    },
    {
      id: "acu-q3",
      question: "What happens for your patients between acupuncture sessions?",
      category: "opening"
    },
    {
      id: "acu-q4",
      question: "Do your patients ever express frustration that they 'lose' the benefits before their next appointment?",
      category: "pain_point"
    },
    {
      id: "acu-q5",
      question: "What do you currently recommend for patients to do at home to support their treatment?",
      category: "pain_point"
    },
    {
      id: "acu-q6",
      question: "How do your pain patients manage discomfort between sessions?",
      category: "pain_point"
    },
    {
      id: "acu-q7",
      question: "What percentage of your patients are specifically seeking alternatives to medication?",
      category: "pain_point"
    },
    {
      id: "acu-q8",
      question: "Are you open to incorporating complementary tools or products that patients can use at home?",
      category: "impact"
    },
    {
      id: "acu-q9",
      question: "What's been your experience with other take-home recommendations – auricular seeds, magnets, or similar?",
      category: "impact"
    },
    {
      id: "acu-q10",
      question: "How important is it that anything you recommend aligns with your philosophy of supporting the body's self-healing?",
      category: "impact"
    },
    {
      id: "acu-q11",
      question: "When evaluating something new, what matters most – mechanism, patient feedback, simplicity, or evidence?",
      category: "solution"
    },
    {
      id: "acu-q12",
      question: "Would you prefer to have products available for immediate patient purchase, or refer them to order?",
      category: "solution"
    },
    {
      id: "acu-q13",
      question: "How do you feel about recommending products versus focusing purely on your treatments?",
      category: "solution"
    }
  ],

  productPresentation: {
    problem: `Your patients come to you because acupuncture works. But between appointments, they're struggling. Pain returns, stress builds back up, sleep deteriorates. They can't needle themselves at home. So they either reach for medications – which goes against why they came to you in the first place – or they just wait and lose progress.`,
    agitate: `This is frustrating for both you and your patients. You're doing excellent work in the treatment room, but you can only control what happens during those 45-60 minutes. What happens the other 23 hours of the day matters too. And right now, your patients don't have many drug-free options for home support.`,
    solve: `That's why SuperPatch works so well with acupuncture practices. Our Vibrotactile Technology uses specialized patterns that stimulate mechanoreceptors – the touch sensors in the skin. This activates neural pathways throughout the body.

It's not acupuncture – it's a different mechanism. But the principle is similar: skin stimulation creating systemic effects. And because it's completely drug-free, it aligns with why your patients chose you in the first place.

The Freedom patch completed a peer-reviewed clinical trial showing significant pain reduction and improved range of motion. The REM patch showed 46% faster sleep onset in the HARMONI study.`,
    fullScript: `"[Name], as an acupuncturist, you work with the understanding that the body is an interconnected system. Stimulating one point affects the whole. You also know that patients need support between sessions to maintain their progress. I want to share a technology that gives your patients something to use at home – not acupuncture, but working through similar principles of skin stimulation affecting deeper systems.

[PROBLEM]
Your patients come to you because acupuncture works. But between appointments, they're struggling. Pain returns, stress builds back up, sleep deteriorates. They can't needle themselves at home. So they either reach for medications – which goes against why they came to you in the first place – or they just wait and lose progress.

[AGITATE]
This is frustrating for both you and your patients. You're doing excellent work in the treatment room, but you can only control what happens during those 45-60 minutes. What happens the other 23 hours of the day matters too. And right now, your patients don't have many drug-free options for home support.

[SOLVE]
That's why SuperPatch works so well with acupuncture practices. Our Vibrotactile Technology uses specialized patterns that stimulate mechanoreceptors – the touch sensors in the skin. This activates neural pathways throughout the body.

[TCM ALIGNMENT]
Let me share how practitioners think about our patches in TCM terms:

Freedom (Pain Relief):
Think of it as supporting Qi flow where there's stagnation. For patients with pain – whether from stuck Qi or blood stagnation – this provides continuous support for movement and relief.

REM (Sleep Support):
Supports the Heart-Kidney axis and calms the Shen. For patients whose sleep issues stem from Yin deficiency or Heart fire, this supports natural sleep patterns.

Peace (Stress Relief):
Soothes Liver Qi stagnation and calms the mind. Great for patients with stress, frustration, or emotional tension.

Boost (Energy):
Supports Spleen Qi and overall energy. For patients with fatigue or Qi deficiency presentations.

Liberty (Balance):
Stabilizes and grounds. Supports Kidney essence for patients with balance or stability concerns.

The full portfolio addresses energy, immunity, metabolism, focus, mood, habits – there's a patch for every pattern."`
  },

  objections: [
    {
      id: "acu-obj1",
      objection: "This isn't real acupuncture.",
      response: `"You're absolutely right – it's not acupuncture, and we'd never claim that. It's a complementary technology that works through a different mechanism – mechanoreceptor stimulation versus needle insertion. Many acupuncturists see it as a take-home bridge between sessions, not a replacement for treatment. How do your patients currently maintain benefits between appointments?"`,
      psychology: "Acknowledge the difference clearly, then reposition as complementary support."
    },
    {
      id: "acu-obj2",
      objection: "My patients come to me for natural therapy, not patches.",
      response: `"That makes sense – and this is about as natural as it gets. There are no chemicals, no drugs, nothing entering the body. It's purely a physical pattern that stimulates nerve receptors. Think of it like a continuous, gentle pressure rather than a substance. Would your patients appreciate having a drug-free option for home support?"`,
      psychology: "Emphasize the drug-free, natural aspect to align with their patients' values."
    },
    {
      id: "acu-obj3",
      objection: "I don't want to seem like I'm selling products.",
      response: `"I understand that concern. Many acupuncturists position this as patient support, not a sales pitch. When patients ask what they can do at home between sessions, this gives you an answer that aligns with your drug-free approach. It's about comprehensive patient care, not retail. Would framing it as 'homework' for patients feel more comfortable?"`,
      psychology: "Reframe from selling to supporting patient care."
    },
    {
      id: "acu-obj4",
      objection: "How does this work in TCM terms?",
      response: `"That's a great question. While VTT is a Western technology, many practitioners frame it in TCM language for patients. Freedom supports Qi flow for pain; REM calms the Shen for sleep; Peace soothes Liver Qi for stress. The mechanism is neural pathway activation, but the effects map well to TCM patterns. Would that framing resonate with your patients?"`,
      psychology: "Bridge Western mechanism to TCM concepts they already understand."
    },
    {
      id: "acu-obj5",
      objection: "My patients can't afford acupuncture and products.",
      response: `"That's a valid concern. At about $3 per day, many patients find it's less than their daily coffee. And for some patients, having effective home support could mean they need fewer sessions – which might actually save them money overall. Which patients would benefit most from maintaining treatment progress at home?"`,
      psychology: "Address cost concern with value comparison and potential session reduction."
    },
    {
      id: "acu-obj6",
      objection: "I'd need to try it myself first.",
      response: `"Absolutely – I'd want the same thing. Would you like to start with a personal sample of Freedom or whichever patch aligns with something you're experiencing? That way you can feel it before recommending it."`,
      psychology: "Validate the need for personal experience and offer a sample."
    }
  ],

  closingScripts: [
    {
      id: "acu-close1",
      title: "Treatment Support Close",
      type: "solution",
      script: `"Based on what you've shared, your patients need better support between sessions. The Practitioner Starter Kit would let you try each patch and recommend the right one for different patient patterns. Should I set you up with that?"`
    },
    {
      id: "acu-close2",
      title: "TCM Alignment Close",
      type: "assumptive",
      script: `"It sounds like this could fit nicely into your practice – drug-free, works with the body's own systems, and gives patients something to maintain treatment benefits. Would you like to start with just Freedom for pain patients, or the full portfolio for different patterns?"`
    },
    {
      id: "acu-close3",
      title: "Trial Close",
      type: "trial",
      script: `"Before we move forward, what concerns do you still have about recommending this to patients? Let's address those and get you started."`
    },
    {
      id: "acu-close4",
      title: "Business Model Close",
      type: "alternative",
      script: `"You can stock patches at 25% off for immediate patient purchase, or use an affiliate link for patients to order directly. Which fits better with how you run your practice?"`
    }
  ],

  followUpSequence: [
    {
      day: "Day 1",
      title: "Post-Meeting Thank You",
      email: `[Name], thank you for taking time to discuss SuperPatch today.

I enjoyed learning about your practice and how you help patients between acupuncture sessions. As promised, I've attached information on how the patches work and how other acupuncturists are integrating them.

I'll follow up in a few days to see if you'd like to try a sample yourself.`
    },
    {
      day: "Day 3-4",
      title: "Practitioner Testimonial",
      email: `[Name], I wanted to share what another acupuncturist told me recently:

"I was hesitant at first because I wanted to keep my practice focused on traditional methods. But when patients kept asking what they could do at home, I realized they needed support I couldn't provide in the treatment room. Now I recommend Freedom for pain patients and REM for sleep issues. It extends my work without compromising my philosophy."

Would you like to try a sample to experience it yourself?`
    },
    {
      day: "Day 7",
      title: "Check-In Call",
      voicemail: `"Hi [Name], this is [Your Name] from SuperPatch. I wanted to follow up on our conversation about supporting your patients between sessions. I know you want to make sure anything you recommend aligns with your practice philosophy, so I'd love to answer any questions. When would be a good time to chat?"`,
      email: `[Name], I wanted to check in after our conversation.

If you have any questions about how the patches work or how other acupuncturists are using them, I'm happy to help.

Would you like to schedule a quick call, or would a sample be more helpful?`
    },
    {
      day: "Day 14",
      title: "Final Outreach",
      email: `[Name], I wanted to reach out once more about SuperPatch.

If giving your patients drug-free support between sessions is still of interest, I'm here to help you get started. If the timing isn't right, just let me know and I'll check back in a few months.

Wishing you well!`
    }
  ],

  quickReference: {
    keyBenefits: [
      "Works through skin stimulation affecting whole body",
      "Drug-free, no substances entering the system",
      "Supports the body's own healing mechanisms",
      "Maintains treatment benefits between sessions"
    ],
    bestQuestions: [
      "Do patients lose benefits between appointments?",
      "What do you recommend for home support?",
      "How do pain patients manage between sessions?"
    ],
    topObjections: [
      { objection: "Not real acupuncture", response: "Different mechanism, complementary take-home support" },
      { objection: "Patients want natural", response: "No chemicals, no drugs – purely physical stimulation" },
      { objection: "TCM terms?", response: "Freedom = Qi flow, REM = calms Shen, Peace = soothes Liver Qi" }
    ],
    bestClosingLines: [
      "This gives your patients drug-free support between sessions.",
      "Ready to try the Practitioner Kit?",
      "Which business model fits better – stocking or affiliate?"
    ]
  }
};





