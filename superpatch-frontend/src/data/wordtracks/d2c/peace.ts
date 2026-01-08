import { WordTrack } from "@/types/wordtrack";

export const peaceD2CWordTrack: WordTrack = {
  id: "d2c-peace",
  productId: "peace",
  marketId: "d2c",
  productOverview: `<p>The <strong>Super Patch Peace</strong> is a revolutionary, 100% drug-free, and non-invasive wellness solution designed to help individuals manage stress and experience greater calm and clarity.</p>
<p>Utilizing our patented <strong>Vibrotactile Technology (VTT)</strong>, the Peace patch features specialized ridge patterns that interact with the skin's mechanoreceptors. This interaction gently triggers the body's own natural neural responses, guiding your system towards a state of relaxation and mental tranquility.</p>
<p>This innovative patch is ideal for anyone experiencing the daily pressures of stress, anxiety, or simply seeking a more profound sense of calm. Whether it's work deadlines, family demands, or the general hustle of modern life, Peace offers a natural path to finding your center.</p>`,
  
  idealCustomerProfile: {
    demographics: "Age 25-65, mid to upper-mid income, comfortable investing in personal wellness products. Busy professionals, parents, caregivers, students, entrepreneurs – generally active individuals with demanding schedules.",
    psychographics: "Health-conscious, prioritizes well-being, seeks natural and holistic solutions. Open-minded to new technologies. Proactive about improving quality of life. Values efficacy, safety, and ease of use. May be frustrated having tried multiple solutions without lasting relief.",
    painPoints: [
      "Feeling constantly stressed, mentally exhausted, and unable to switch off",
      "Persistent feelings of unease, nervousness, or dread",
      "Difficulty falling asleep or staying asleep due to racing thoughts",
      "Short temper, feeling easily agitated, affecting relationships",
      "Brain fog, inability to concentrate, decreased productivity",
      "Headaches, muscle aches, digestive issues linked to stress",
      "Feeling muddled, unable to make decisions effectively"
    ],
    previousSolutions: [
      "Meditation apps (Headspace, Calm)",
      "Herbal supplements (Ashwagandha, Magnesium, CBD)",
      "Therapy or counseling",
      "Exercise and yoga",
      "Dietary changes (reducing caffeine, sugar)",
      "Prescription medications – often seeking natural alternatives due to side effects"
    ]
  },

  openingScripts: [
    {
      title: "Cold Approach (Stranger)",
      scenario: "Noticing something about them in a casual setting",
      content: `"Hi there! I couldn't help but notice your [cool t-shirt/interesting book]. My name is [Your Name], I'm a local wellness advocate. How's your day going so far?" [After brief, friendly chat] "You know, a lot of people I meet these days are always looking for ways to feel a little more centered amidst the daily hustle. Have you ever felt like you could use a secret weapon for calm?"`
    },
    {
      title: "Warm Introduction (Friend/Family)",
      scenario: "Reaching out to someone you know",
      content: `"Hey [Friend's Name]! It's so good to see you. How have things been? I was actually thinking about you the other day because you mentioned how busy/stressed you've been lately. I've discovered something really incredible that I think could genuinely help you feel a lot more relaxed and clear-headed. Are you open to hearing about it for a couple of minutes?"`
    },
    {
      title: "Social Media DM",
      scenario: "Connecting via direct message",
      content: `"Hi [Name], I've been following your posts and really admire how you juggle your work and family. I also noticed you sometimes share about stress/wellness/self-care. I recently started using something that has been a game-changer for my own stress levels, and I thought of you. It's called the Peace Super Patch, and it's completely natural and non-invasive. Would you be open to a quick chat?"`
    },
    {
      title: "Referral Introduction",
      scenario: "When referred by a mutual contact",
      content: `"Hi [Name], my name is [Your Name]. [Referral Name] suggested I reach out to you. They mentioned you were looking for a natural way to manage stress, and they thought you might find what I do really interesting. I help people find calm and clarity naturally using a unique technology. Are you free for a quick call sometime this week?"`
    },
    {
      title: "Event/Party Approach",
      scenario: "At a social gathering",
      content: `"It's been great chatting with you, [Name]! You know, I was just thinking about how much energy everyone has here, but also how easy it is to feel drained with everything going on in life. What do you do to keep yourself feeling balanced and calm when things get hectic?" [Listen, then pivot] "I actually work with a fantastic product that helps people naturally tap into their body's own ability to find calm and focus. Have you ever explored non-pharmaceutical ways to manage stress?"`
    }
  ],

  discoveryQuestions: [
    { question: "What does a 'perfectly calm and clear day' look like for you?", category: "opening" },
    { question: "On a typical day, what's one thing that really helps you feel centered and focused?", category: "opening" },
    { question: "When you think about stress or feeling overwhelmed, what's the biggest challenge it presents in your daily life?", category: "pain" },
    { question: "Can you describe a recent time when stress really got the better of you? What did that feel like?", category: "pain" },
    { question: "On a scale of 1 to 10, with 10 being completely overwhelmed, how would you rate your typical stress level?", category: "pain" },
    { question: "How is this stress impacting your sleep/relationships/productivity/enjoyment of life?", category: "impact" },
    { question: "What's the cost of not addressing this stress for you right now?", category: "impact" },
    { question: "If you could wave a magic wand and instantly feel more calm and clear, what would that enable you to do or experience differently?", category: "impact" },
    { question: "What have you tried in the past to manage your stress or anxiety, and what was your experience with those solutions?", category: "solution" },
    { question: "What are you ultimately hoping to achieve with a solution for greater calm and clarity?", category: "solution" }
  ],

  productPresentation: `<p><strong>[Problem]</strong> "It sounds like you're really looking for a way to break free from that feeling of constant overwhelm. You're not alone. In today's fast-paced world, the problem is that stress has become a constant companion for so many of us. We're juggling responsibilities, battling information overload, and often find ourselves feeling perpetually on edge, struggling to focus, and losing out on quality sleep."</p>

<p><strong>[Agitate]</strong> "And when that stress isn't managed, it really agitates our entire system. It drains our energy, makes us irritable with loved ones, clouds our judgment, and can even take a toll on our physical health. It leaves us feeling drained, frustrated, and unable to fully enjoy the moments that matter most. You mentioned how it impacts your ability to be present with your family, and that's exactly what we want to change."</p>

<p><strong>[Solve]</strong> "That's where the <strong>Peace Super Patch</strong> comes in as the solution. Imagine having a simple, natural way to tap into your body's own ability to find calm. Peace uses our unique Vibrotactile Technology – it's a small, discreet patch with specialized patterns that interact with your skin. This gentle interaction sends signals to your brain, helping to rebalance your neural pathways and guide your body into a state of deep relaxation and mental clarity. It's 100% drug-free, non-invasive, and incredibly easy to use – just peel and stick! It's about harnessing your body's innate power to help you manage stress and experience greater calm and clarity."</p>`,

  objectionHandling: [
    {
      objection: "It's too expensive",
      response: "I understand that price is an important factor when you're considering new wellness solutions, and you want to make a smart investment. What other criteria will be most important for you in making this decision, beyond just the initial cost?",
      psychology: "Validates concern, opens discussion about total value and decision factors."
    },
    {
      objection: "I need to think about it",
      response: "I understand this is a significant decision for your health and well-being, and you want to ensure it's the right fit. What specific questions or considerations would be most helpful for you to think through as you evaluate the Peace patch?",
      psychology: "Acknowledges need for reflection, uncovers specific concerns."
    },
    {
      objection: "I need to talk to my spouse",
      response: "I understand this is an important decision, and you want to get everyone involved, especially your spouse. What specific questions or concerns do you anticipate they might have, or what information would be most helpful for you to discuss with them?",
      psychology: "Respects partnership, helps prepare talking points."
    },
    {
      objection: "Does it really work? It sounds too good to be true",
      response: "I completely understand why you might be skeptical about new technologies, and it's important to feel confident in your choices. What would you need to see, hear, or experience to truly feel that this is a credible solution for you?",
      psychology: "Validates skepticism, opens door to providing specific evidence."
    },
    {
      objection: "I've tried patches/products before, and they didn't work",
      response: "I understand you've explored other options, and it can be frustrating when something doesn't meet your expectations. What was your experience with those products, and what were you hoping they would achieve for you that they didn't?",
      psychology: "Shows empathy, gathers info to differentiate Peace."
    },
    {
      objection: "I'm not interested",
      response: "I understand you might not be actively looking for something new right now, and that's perfectly fine. What, if anything, has held you back from addressing stress in the past, or what makes you feel like this isn't a priority for you right now?",
      psychology: "Respects position, gently probes for underlying concerns."
    },
    {
      objection: "I don't have time for this",
      response: "I understand your schedule is busy, and time is precious, especially when you're already feeling stressed. What's the biggest impact unmanaged stress has on your ability to manage your time effectively, or what would an extra sense of calm allow you to make time for?",
      psychology: "Reframes time as connected to their stress problem."
    },
    {
      objection: "How is this different from [competitor/other stress product]?",
      response: "I understand you're looking for the best solution, and it's smart to compare options. What aspects of [competitor/other product] are most appealing to you, and what are you hoping for that might be different or more effective?",
      psychology: "Shows respect for research, gathers positioning intel."
    }
  ],

  closingScripts: [
    {
      title: "The Assumptive Close",
      content: `"Great! Since the Peace patch directly addresses your need for better sleep and less overwhelm, what quantity would you like to start with to ensure you experience the full benefits?"`
    },
    {
      title: "The Alternative Close",
      content: `"Excellent! To get started on your journey to greater calm, would you prefer to begin with a 30-day supply to really feel the difference, or would the 90-day bundle be a better fit for you today?"`
    },
    {
      title: "The Urgency Close",
      content: `"Fantastic! Just so you know, our current promotion for free shipping ends this Friday. If you're ready to start experiencing more calm and clarity, now would be the perfect time to take advantage of that. Shall we get your order placed today?"`
    },
    {
      title: "The Summary Close",
      content: `"So, just to recap, with the Peace patch, you'll be able to reduce your daily stress, improve your focus, and finally get that restful sleep you've been craving, all without drugs or side effects. Given all that, are you ready to start feeling more peaceful and clear-headed?"`
    },
    {
      title: "The Referral Close",
      scenario: "After a successful close",
      content: `"That's wonderful! I'm so excited for you to start experiencing the calm and clarity the Peace patch brings. As you think about how this will help you, who else in your life comes to mind – a friend, family member, or colleague – who could really benefit from managing their stress and finding more peace?"`
    }
  ],

  followUpSequences: [
    {
      day: "Day 1",
      title: "Immediate Value",
      email: `Subject: Excited for your journey to Peace!\n\nHi [Customer Name], So great connecting with you today! I'm really excited for you to experience the calm and clarity the Peace patch can bring. Here's a quick link to our explainer video so you can dive deeper. Let me know if any questions pop up as you explore!`,
      text: `"Hi [Customer Name]! Great connecting today. Here's a quick link to learn more about Peace. Let me know if you have any Qs! 😊"`
    },
    {
      day: "Day 3",
      title: "Check-in, Offer Support",
      text: `"Hi [Customer Name]! Just wanted to quickly check in. How are you feeling about starting your Peace journey? Remember, I'm here to support you if you have any questions or need tips on getting the most out of your patch!"`,
      voicemail: `"Hi [Customer Name], it's [Your Name]. Just wanted to leave a quick message and see how you're doing. I'm really looking forward to hearing about your experience with the Peace patch. If anything comes up, feel free to give me a call back. Hope you're having a calm day!"`
    },
    {
      day: "Day 7",
      title: "Gentle Nudge, Social Proof",
      email: `Subject: A Week of Calm: What Others Are Saying About Peace\n\nHi [Customer Name], Hope you're having a wonderful week! I was thinking about you and wanted to share a quick story from another customer who found incredible calm with Peace. Many people start feeling subtle shifts within the first week. Have you started experiencing any moments of greater calm or clarity yourself? I'd love to hear about it!`
    },
    {
      day: "Day 14",
      title: "Stronger Value Proposition",
      email: `Subject: Ready for Consistent Calm?\n\nHi [Customer Name], It's been a couple of weeks since we last chatted. I know life gets busy, and stress can creep back in. If you're still looking for a consistent, natural way to manage stress and embrace more calm, the Peace patch is here to help. I'm offering a complimentary 15-minute 'Peace Plan' session this week to walk you through how to maximize your results. Are you free [suggest 2 specific times]?`
    }
  ],

  quickReference: {
    keyBenefits: [
      "Stress Management: Naturally reduces feelings of overwhelm and tension",
      "Calm & Clarity: Enhances focus and promotes mental tranquility",
      "Relaxation: Supports a deeper sense of peace, aiding better sleep"
    ],
    bestQuestions: [
      "When you think about stress, what's the biggest challenge it presents in your daily life?",
      "What have you tried in the past, and what was your experience?",
      "If you could wave a magic wand and instantly feel more calm, what would that enable you to do differently?"
    ],
    topObjections: [
      { objection: "Too expensive", shortResponse: "What other criteria are most important for you in a wellness solution?" },
      { objection: "Does it work?", shortResponse: "What would you need to see or experience to feel confident?" },
      { objection: "Need to think about it", shortResponse: "What specific questions or considerations would be most helpful for you to think through?" }
    ],
    bestClosingLines: [
      "Since Peace addresses your need for better sleep and less overwhelm, what quantity would you like to start with today?",
      "Given all these benefits, are you ready to start feeling more peaceful and clear-headed?"
    ]
  }
};





