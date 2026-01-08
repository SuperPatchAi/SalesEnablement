import { WordTrack } from "@/types/wordtrack";

export const massageTherapistsWordTrack: WordTrack = {
  id: "b2b-massage-therapists",
  productId: "massage-therapists",
  market: "b2b",
  title: "Massage Therapist (LMT/RMT) Practice Word Track",
  overview: `Massage therapists work hands-on with the body to relieve tension, reduce pain, improve circulation, and promote relaxation. They understand the power of touch and manual therapy to support wellness and are focused on holistic client care.

SuperPatch connects naturally with massage therapists because it works through the same principle - touch affecting the body's systems.

Why Massage Therapists Are Ideal Partners:
• Touch Experts - Already understand how skin stimulation affects the body
• Repeat Clients - Regular appointments create ongoing recommendation opportunities
• Wellness Focus - Clients expect wellness product recommendations
• Take-Home Gap - Clients need relief between sessions
• Retail Friendly - Many practices already offer products for home care`,

  openingScripts: [
    {
      id: "lmt-touch",
      title: "Touch Expert Opening",
      scenario: "Connecting VTT to massage principles",
      script: `"Hi [Name], I'm [Your Name] with SuperPatch. I'm reaching out because massage therapists understand something powerful – the impact of touch on the whole body.

Our Vibrotactile Technology works through that same principle. Specialized patterns stimulate touch receptors in the skin, activating neural pathways for pain relief, better sleep, or stress reduction.

It's like your work continues even after the client goes home. Sound interesting?"`
    },
    {
      id: "lmt-support",
      title: "Client Support Opening",
      scenario: "Addressing the home care question",
      script: `"Hi [Name], I'm [Your Name] from SuperPatch. Do your clients ever ask what they can do at home to maintain the benefits of their massage?

I work with massage therapists who want to give clients drug-free options for between-session support. Our patches extend your work without any chemicals or medications.

Would that be helpful for your practice?"`
    },
    {
      id: "lmt-retail",
      title: "Retail Opportunity Opening",
      scenario: "For practices interested in product sales",
      script: `"Hi [Name], I'm [Your Name] with SuperPatch. Many massage therapists I work with have been looking for professional-grade products to offer clients.

Our drug-free VTT patches are a perfect add-on recommendation after sessions – especially for pain, stress, and sleep.

Are you currently retailing any products, or is that something you'd consider?"`
    },
    {
      id: "lmt-event",
      title: "Event/Expo Approach",
      scenario: "Meeting at professional events",
      script: `"Hi! Are you a massage therapist? Great! I'm [Your Name] with SuperPatch.

You know how important touch is for healing – our patches use that same principle. They stimulate touch receptors to activate the nervous system for pain relief and relaxation.

Many LMTs recommend them to clients for home use between sessions. Have you heard of Vibrotactile Technology?"`
    },
    {
      id: "lmt-email",
      title: "Email/Social Outreach",
      scenario: "Written introduction",
      script: `Hi [Name], as a massage therapist, you already know the power of touch for healing.

SuperPatch uses Vibrotactile Technology – specialized patterns that stimulate touch receptors continuously, supporting pain relief, sleep, or stress reduction even when clients aren't on your table.

Many LMTs recommend our Freedom patch for pain clients and REM patch for those with sleep issues.

Would you be interested in learning how this could complement your practice?`
    }
  ],

  discoveryQuestions: [
    {
      id: "lmt-q1",
      question: "What types of clients do you see most often – relaxation, therapeutic, sports?",
      category: "opening"
    },
    {
      id: "lmt-q2",
      question: "How often do your regular clients come in – weekly, bi-weekly, monthly?",
      category: "opening"
    },
    {
      id: "lmt-q3",
      question: "What do you love most about your work, and what's challenging?",
      category: "opening"
    },
    {
      id: "lmt-q4",
      question: "What do you hear from clients about how they feel between appointments?",
      category: "pain_point"
    },
    {
      id: "lmt-q5",
      question: "How quickly do clients report their tension or pain returning after a session?",
      category: "pain_point"
    },
    {
      id: "lmt-q6",
      question: "What do you currently recommend clients do at home to maintain benefits?",
      category: "pain_point"
    },
    {
      id: "lmt-q7",
      question: "Do clients ever ask for product recommendations?",
      category: "pain_point"
    },
    {
      id: "lmt-q8",
      question: "Do you currently sell any products in your practice – oils, creams, tools?",
      category: "impact"
    },
    {
      id: "lmt-q9",
      question: "What's been your experience with retail – positive or challenging?",
      category: "impact"
    },
    {
      id: "lmt-q10",
      question: "Would you prefer to recommend products or have clients purchase elsewhere?",
      category: "impact"
    },
    {
      id: "lmt-q11",
      question: "When evaluating a product to recommend, what matters most – effectiveness, price, simplicity?",
      category: "solution"
    },
    {
      id: "lmt-q12",
      question: "How important is it that products are drug-free and chemical-free for your clients?",
      category: "solution"
    },
    {
      id: "lmt-q13",
      question: "What would make you confident recommending something to your clients?",
      category: "solution"
    }
  ],

  productPresentation: {
    problem: `Here's what I hear from massage therapists all the time: You do incredible work during the session. Clients leave feeling amazing. But within days – sometimes hours – they're back to square one. The stress builds back up, the tension returns, the pain creeps back in. And you can only see them so often.`,
    agitate: `This is frustrating for everyone. Clients feel like they're on a hamster wheel – constant massage sessions just to stay at baseline. They might start questioning whether the investment is worth it. Meanwhile, you know the work is effective, but you can't follow them home. What happens outside your treatment room matters, and right now, you don't have much influence over that.`,
    solve: `SuperPatch changes that. Our Vibrotactile Technology uses specialized ridge patterns that stimulate the same touch receptors you work with – mechanoreceptors in the skin. This stimulation activates neural pathways for pain relief, stress reduction, or sleep support.

Think of it as continuous, gentle touch therapy. It's not massage, but it extends the principle of touch-based healing to the other 23 hours a day when clients aren't on your table.

And because it's completely drug-free – no menthol, no lidocaine, no chemicals – it aligns with a holistic approach to care.`,
    fullScript: `"[Name], as a massage therapist, you're an expert in how touch affects the body. You understand that working with the skin and tissue creates changes throughout the system – relaxing muscles, reducing pain, calming the nervous system. I want to share a technology that continues that work when clients leave your table.

[PROBLEM]
Here's what I hear from massage therapists all the time: You do incredible work during the session. Clients leave feeling amazing. But within days – sometimes hours – they're back to square one. The stress builds back up, the tension returns, the pain creeps back in. And you can only see them so often.

[AGITATE]
This is frustrating for everyone. Clients feel like they're on a hamster wheel – constant massage sessions just to stay at baseline. They might start questioning whether the investment is worth it. Meanwhile, you know the work is effective, but you can't follow them home. What happens outside your treatment room matters, and right now, you don't have much influence over that.

[SOLVE]
SuperPatch changes that. Our Vibrotactile Technology uses specialized ridge patterns that stimulate the same touch receptors you work with – mechanoreceptors in the skin. This stimulation activates neural pathways for pain relief, stress reduction, or sleep support.

[CLIENT RECOMMENDATIONS]

After Every Session (Universal Recommendations):
- Freedom – "Wear this for the next few days to maintain pain relief"
- Peace – "Keep that relaxation going at home"

For Pain Clients:
- Freedom for ongoing pain support
- "This helps between our sessions so you don't lose all your progress"

For Stress/Relaxation Clients:
- Peace for stress reduction
- REM if sleep is an issue
- "Maintain that calm between visits"

For Athletes/Sports Massage:
- Victory for performance and recovery
- Freedom for any lingering soreness
- "Support your training between sessions"

For Sleep-Deprived Clients:
- REM for sleep support
- "Better sleep means faster recovery from our work"

For Energy/Fatigue Issues:
- Boost for natural energy
- "Help you feel more energized between appointments""`
  },

  objections: [
    {
      id: "lmt-obj1",
      objection: "I'm not a salesperson.",
      response: `"I totally get that – you became a massage therapist to help people, not to sell products. But think of it this way: when clients ask what they can do at home, you're providing a solution, not selling. It's part of comprehensive care. You probably already recommend stretches or self-massage techniques, right? This is just another tool in that toolkit."`,
      psychology: "Reframe from selling to providing comprehensive care."
    },
    {
      id: "lmt-obj2",
      objection: "My clients won't want to spend more money.",
      response: `"That's a fair concern. Here's what I've found: clients who value massage already understand investing in their wellness. At about $3 per day, it's less than their daily latte. And if it helps them maintain benefits longer, they might actually need fewer sessions – which could save them money. Which clients come to mind who really struggle between appointments?"`,
      psychology: "Compare cost to everyday spending and potential session reduction."
    },
    {
      id: "lmt-obj3",
      objection: "I've tried retail and it didn't work.",
      response: `"What happened? [Listen] I hear that a lot – usually it's because the products weren't a natural fit for the service, or they were hard to explain. Patches are different. You literally just say 'Wear this for pain relief between sessions' and hand it to them. There's nothing to explain about application or dosing. Would a simpler product make retail more appealing?"`,
      psychology: "Explore past experience and position patches as simpler alternative."
    },
    {
      id: "lmt-obj4",
      objection: "How is this different from menthol patches?",
      response: `"Great question! Menthol patches work by delivering a substance through the skin that creates a cooling sensation. SuperPatch doesn't deliver anything – it's purely the physical pattern stimulating touch receptors. No smell, no chemicals, no mess. For clients sensitive to menthol or who want something truly drug-free, this is a completely different category."`,
      psychology: "Clearly differentiate mechanism from familiar products."
    },
    {
      id: "lmt-obj5",
      objection: "I'd want to try it first.",
      response: `"Absolutely – you should experience it before recommending it. Which do you deal with yourself – pain, stress, sleep issues, low energy? Let me send you a sample of the patch that fits your needs. Once you feel it work, the recommendation to clients becomes natural."`,
      psychology: "Validate the need for personal experience and offer targeted sample."
    },
    {
      id: "lmt-obj6",
      objection: "I don't have space to stock products.",
      response: `"I hear you – space is always tight. Here's the thing: the patches are small and don't expire quickly. You could literally keep them in a drawer and just pull one out when relevant. Or we can set you up with an affiliate link – you recommend, they order online, and you earn commission without stocking anything. Which would work better for you?"`,
      psychology: "Offer flexible solutions for space constraints."
    }
  ],

  closingScripts: [
    {
      id: "lmt-close1",
      title: "Client Care Close",
      type: "solution",
      script: `"[Name], it sounds like you want to give clients better support between sessions. The Practitioner Starter Kit has samples of each patch – Freedom for pain clients, REM for sleep issues, Peace for stress. You'd be able to match the right patch to each client. Ready to get started?"`
    },
    {
      id: "lmt-close2",
      title: "Simple Add-On Close",
      type: "assumptive",
      script: `"The easiest way to start is just with Freedom patches for your pain clients. After each session, just hand them a patch and say 'Wear this for the next few days to maintain your progress.' That's it. Should I set you up with a supply of Freedom to start?"`
    },
    {
      id: "lmt-close3",
      title: "Business Model Close",
      type: "alternative",
      script: `"You can purchase wholesale at 25% off and sell directly to clients, or I can give you an affiliate link where they order online and you earn commission. Which fits better with how you want to run your practice?"`
    },
    {
      id: "lmt-close4",
      title: "Trial Close",
      type: "trial",
      script: `"What would you need to feel confident recommending this to your clients? Let's address that and get you started."`
    }
  ],

  followUpSequence: [
    {
      day: "Day 1",
      title: "Post-Meeting Thank You",
      email: `[Name], thank you for taking time to chat about SuperPatch today.

I enjoyed learning about your practice and the types of clients you work with. As promised, here's information on how the patches work and how other massage therapists are using them.

I'll follow up in a few days to see if you'd like to try a sample yourself.`
    },
    {
      day: "Day 3-4",
      title: "Simple Script",
      email: `[Name], I wanted to share a quick script that other massage therapists use:

After the session, as the client is getting ready to leave:
"I want you to wear this Freedom patch for the next few days. It's going to help maintain the pain relief from today's session. It's drug-free and works through touch, similar to massage. Let me know how it goes!"

That's it. Simple, helpful, and extends your care beyond the table.

Would you like to try it with a few clients?`
    },
    {
      day: "Day 7",
      title: "Check-In Call",
      voicemail: `"Hi [Name], this is [Your Name] from SuperPatch. I wanted to check in and see if you had any questions about using the patches with your clients. A lot of massage therapists find it's the easiest recommendation they make – just hand it over and say 'wear this between sessions.' Let me know if you'd like to try a sample."`,
      email: `[Name], just wanted to follow up on SuperPatch.

If you're interested in trying it with clients, I can send you some samples to start. Most massage therapists find the pain patch (Freedom) is the easiest recommendation to make.

Let me know how I can help!`
    },
    {
      day: "Day 14",
      title: "Final Outreach",
      email: `[Name], I wanted to reach out once more.

If giving your clients drug-free support between sessions is something you're interested in, I'm here to help. If the timing isn't right, just let me know and I'll check back in a few months.

Have a great day!`
    }
  ],

  quickReference: {
    keyBenefits: [
      "Works through touch receptors – same principle as massage",
      "Extends your work to the other 23 hours of the day",
      "Drug-free, no chemicals, no mess",
      "Simple recommendation: 'Wear this between sessions'"
    ],
    bestQuestions: [
      "How quickly does client tension return after sessions?",
      "What do you recommend for home care?",
      "Do clients ask for product recommendations?"
    ],
    topObjections: [
      { objection: "I'm not a salesperson", response: "It's not selling, it's completing care" },
      { objection: "Clients won't spend more", response: "$3/day, maintains progress longer" },
      { objection: "Different from menthol?", response: "No chemicals, no delivery, purely touch-based" }
    ],
    bestClosingLines: [
      "Wear this Freedom patch for the next few days to maintain your progress between sessions.",
      "It's drug-free and extends the pain relief from your massage.",
      "Ready to try it with a few clients?"
    ]
  }
};





