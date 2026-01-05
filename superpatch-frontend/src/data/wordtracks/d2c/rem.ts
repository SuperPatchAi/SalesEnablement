import { WordTrack } from "@/types/wordtrack";

export const remD2CWordTrack: WordTrack = {
  id: "rem-d2c",
  productId: "rem",
  productName: "REM",
  market: "d2c",
  tagline: "Better, deeper sleep is the foundation for healthy living",
  category: "Sleep",
  benefits: ["Deeper sleep", "Better rest", "Wake refreshed"],

  overview: `The Super Patch REM is an innovative wellness solution designed to significantly improve the quality of your sleep. Utilizing cutting-edge Vibrotactile Technology (VTT), this small, non-invasive patch interacts with your skin's mechanoreceptors through specialized ridge patterns, triggering your body's natural neural responses to promote deeper, more restorative sleep. It's a 100% drug-free, all-natural, and non-invasive alternative for those seeking a healthier approach to rest.

REM is specifically formulated for individuals struggling with sleep issues, occasional insomnia, or simply those who desire better, more consistent rest. Its unique mechanism helps you fall asleep more easily, stay asleep longer, and wake up feeling truly refreshed and energized, rather than groggy. It's a foundational product for anyone looking to optimize their daily well-being by improving the most crucial aspect of health: sleep.

What makes REM truly unique is its science-backed, drug-free approach. Unlike traditional sleep aids that often come with side effects or dependency concerns, REM works *with* your body, not against it. It's discreet, easy to use, and offers a natural pathway to better, deeper sleep. The HARMONI study showed that 80% of participants stopped using their sleep medications during the 14-day trial.`,

  customerProfile: {
    demographics: {
      age: "Primarily adults aged 30-65+, though sleep issues can affect any age",
      gender: "All genders",
      lifestyle: [
        "Busy professionals",
        "Parents and caregivers",
        "Retirees",
        "Anyone with demanding schedules or high stress levels",
        "Individuals who value natural and holistic approaches to health"
      ],
      healthStatus: "Mid to upper-mid income, willing to invest in health and wellness solutions"
    },
    psychographics: {
      values: [
        "Health and wellness",
        "Natural remedies",
        "Drug-free solutions",
        "Personal well-being",
        "Quality of life",
        "Effectiveness",
        "Convenience"
      ],
      attitudes: [
        "Tired of feeling groggy",
        "Frustrated with ineffective traditional sleep aids",
        "Concerned about side effects or dependency",
        "Stressed by constant fatigue",
        "Seeking a lasting solution"
      ],
      desires: [
        "More energy",
        "Improved focus",
        "Better mood",
        "Reduced stress",
        "Enhanced physical performance",
        "A natural way to support their body",
        "A return to feeling 'normal' and refreshed"
      ],
      concerns: [
        "Long-term effects of sleep medications",
        "Dependency on sleep aids",
        "Side effects from current solutions",
        "Impact of sleep deprivation on health"
      ]
    },
    painPoints: [
      "Difficulty falling asleep or staying asleep.",
      "Waking up multiple times during the night.",
      "Waking up feeling tired, even after 7-8 hours of sleep.",
      "Relying on coffee/energy drinks throughout the day.",
      "Irritability, poor concentration, memory issues due to lack of sleep.",
      "Impact of poor sleep on relationships, work performance, and overall enjoyment of life.",
      "Anxiety or stress about bedtime and the inability to sleep.",
      "Concerns about the long-term effects of sleep deprivation."
    ],
    previousSolutions: [
      "Over-the-counter sleep aids (e.g., ZzzQuil, Unisom)",
      "Melatonin supplements (often with mixed or diminishing results)",
      "Prescription sleep medications (e.g., Ambien, Lunesta)",
      "Herbal remedies (valerian root, chamomile tea)",
      "Strict sleep hygiene practices",
      "Meditation or mindfulness apps",
      "CBD products",
      "Weighted blankets",
      "Dietary changes or exercise routines"
    ]
  },

  openingScripts: [
    {
      id: "cold-approach",
      title: "Cold Approach (Stranger)",
      scenario: "At a coffee shop, grocery store, or other public place",
      script: `Excuse me, I couldn't help but notice your [interesting book/t-shirt/accessory – e.g., 'that's a beautiful design on your bag']. My name is [Your Name]. 

I'm actually out and about today sharing some information on natural ways to boost well-being. Have you ever thought about how much good sleep can impact your day?`
    },
    {
      id: "warm-intro",
      title: "Warm Introduction",
      scenario: "To a friend or family member you know has mentioned sleep issues",
      script: `Hey [Friend's Name]! How have you been? You know, the other day when we were talking about how exhausted you've been feeling, it really stuck with me. 

I've actually started using something truly revolutionary that has completely changed my sleep, and I immediately thought of you. I'm so excited about it, I just had to share. Are you open to hearing about a natural way to finally get that deep, restorative sleep you've been craving?`
    },
    {
      id: "social-dm",
      title: "Social Media DM",
      scenario: "To someone who has engaged with a wellness post or mentioned sleep issues online",
      script: `Hi [Name], I saw your comment on [relevant post/your recent story about feeling tired], and it really resonated with me. So many people are struggling with sleep these days! 

I'm a wellness advocate with Super Patch, and we have an incredible drug-free solution called REM that's helping people finally get the deep, restorative sleep they need. I thought it might be something you'd be interested in learning about. Would you be open to a quick chat sometime this week to see if it could be a good fit for you?`
    },
    {
      id: "referral",
      title: "Referral Introduction",
      scenario: "When someone has referred a contact to you",
      script: `Hi [New Contact's Name], my name is [Your Name], and [Referrer's Name] suggested I reach out to you. 

They mentioned you've been looking into natural ways to improve your sleep, and they thought our REM Super Patch might be a perfect fit for what you're looking for. [Referrer's Name] had a great experience with it themselves! I'd love to share a bit more about how it works and answer any questions you might have. Would you be free for a brief call this week?`
    },
    {
      id: "event",
      title: "Event/Party Approach",
      scenario: "At a social gathering, networking event",
      script: `Hi [Name], great party, isn't it? I'm [Your Name]. What brings you here today? 

[Listen and respond to their answer]

You know, I'm always fascinated by how people manage their energy levels in such busy environments. I actually help people unlock better sleep and energy through a really unique, natural technology called Super Patch. Have you ever explored drug-free options for getting truly restorative sleep?`
    }
  ],

  discoveryQuestions: [
    {
      id: "typical-sleep",
      category: "opening",
      question: "So, tell me a little bit about what your typical night's sleep looks like these days?"
    },
    {
      id: "scale-rested",
      category: "opening",
      question: "On a scale of 1 to 10, with 10 being perfectly rested and energized, where would you say you typically fall after a night's sleep?"
    },
    {
      id: "biggest-challenges",
      category: "pain_point",
      question: "What are some of the biggest challenges you face when it comes to getting a good night's rest?"
    },
    {
      id: "poor-sleep-day",
      category: "pain_point",
      question: "When you don't sleep well, how does that usually show up in your day-to-day life?"
    },
    {
      id: "patterns-triggers",
      category: "pain_point",
      question: "Have you noticed any specific patterns or triggers that seem to affect your sleep?"
    },
    {
      id: "impact-energy",
      category: "impact",
      question: "How is your current sleep situation impacting your energy levels, focus, or mood during the day?"
    },
    {
      id: "effect-enjoyment",
      category: "impact",
      question: "What effect does poor sleep have on your ability to enjoy your hobbies, family time, or work?"
    },
    {
      id: "magic-wand",
      category: "impact",
      question: "If you could wave a magic wand and instantly change one thing about your sleep, what would it be?"
    },
    {
      id: "tried-past",
      category: "solution",
      question: "What, if anything, have you tried in the past to improve your sleep, and what was your experience with those solutions?"
    },
    {
      id: "better-sleep-means",
      category: "solution",
      question: "Beyond just falling asleep, what does 'better sleep' truly mean to you? What kind of results are you hoping for?"
    }
  ],

  productPresentation: {
    problem: `You know, for too long, we've accepted that waking up tired, feeling groggy, or struggling to fall asleep is just 'part of life.' We try everything – counting sheep, cutting caffeine, even relying on pills – but the fundamental problem remains: our bodies aren't getting into that deep, restorative sleep state where true healing and recovery happens.`,
    
    agitate: `And when we don't get that deep sleep, it doesn't just make us tired; it impacts everything. Our mood suffers, our focus at work or with family declines, we might feel more stressed, and our immune system can even take a hit. It's a vicious cycle that leaves us feeling constantly drained, compromising our ability to truly live a healthy, vibrant life.`,
    
    solve: `That's why I'm so excited about the Super Patch REM. Imagine a solution that works *with* your body, naturally, without drugs or side effects. The REM patch uses something called Vibrotactile Technology – it's a unique pattern on the patch that interacts with your skin to gently trigger your body's own neural responses, guiding your brain into those deeper, more regenerative sleep cycles. It's 100% drug-free, non-invasive, and all-natural. People are experiencing amazing results: falling asleep faster, staying asleep longer, and waking up feeling truly refreshed and ready to take on the day. It's about giving your body the foundational rest it needs to thrive.`,
    
    fullScript: `It sounds like you're really experiencing the struggle of not getting the rest you need, and that's something so many people can relate to.

You know, for too long, we've accepted that waking up tired, feeling groggy, or struggling to fall asleep is just 'part of life.' We try everything – counting sheep, cutting caffeine, even relying on pills – but the fundamental problem remains: our bodies aren't getting into that deep, restorative sleep state where true healing and recovery happens.

And when we don't get that deep sleep, it doesn't just make us tired; it impacts everything. Our mood suffers, our focus at work or with family declines, we might feel more stressed, and our immune system can even take a hit. It's a vicious cycle that leaves us feeling constantly drained, compromising our ability to truly live a healthy, vibrant life.

That's why I'm so excited about the Super Patch REM. Imagine a solution that works *with* your body, naturally, without drugs or side effects. The REM patch uses something called Vibrotactile Technology – it's a unique pattern on the patch that interacts with your skin to gently trigger your body's own neural responses, guiding your brain into those deeper, more regenerative sleep cycles. It's 100% drug-free, non-invasive, and all-natural. People are experiencing amazing results: falling asleep faster, staying asleep longer, and waking up feeling truly refreshed and ready to take on the day. It's about giving your body the foundational rest it needs to thrive.`
  },

  objections: [
    {
      id: "too-expensive",
      objection: "It's too expensive.",
      response: "I understand that price is an important factor when you're considering new wellness solutions, and it's natural to want to make a smart investment. What aspects are most important for you in a product like this, beyond just the initial cost?",
      psychology: "Validates their financial concern, then shifts the focus to value, benefits, and their personal health priorities"
    },
    {
      id: "think-about-it",
      objection: "I need to think about it.",
      response: "I understand this is a significant decision for your health and well-being, and you want to ensure it's the right fit for your lifestyle. What specific questions or considerations would be most helpful for you to think through as you evaluate the Super Patch?",
      psychology: "Validates their need for careful consideration. Helps identify precise sticking points or information gaps"
    },
    {
      id: "talk-to-spouse",
      objection: "I need to talk to my spouse.",
      response: "Absolutely, I understand this is a decision that often involves your partner, and it's important to get everyone on board. When you speak with your spouse, what key information or concerns do you anticipate they might have that we could address together?",
      psychology: "Respects the need for partner involvement. Helps pre-empt potential objections from the spouse"
    },
    {
      id: "does-it-work",
      objection: "Does it really work? It sounds too good to be true.",
      response: "I completely understand why you might be skeptical about new technologies, and it's important to feel confident in your choices, especially when it comes to your health. What would you need to see, hear, or experience to truly feel that this is a credible solution for you?",
      psychology: "Acknowledges skepticism without being defensive. Empowers them to define their own path to belief"
    },
    {
      id: "tried-before",
      objection: "I've tried patches/products before, and they didn't work.",
      response: "I understand you've had experiences with other products in the past that haven't delivered the results you hoped for, and that can definitely be frustrating. What specifically did you try, and what was it about those solutions that ultimately didn't meet your expectations?",
      psychology: "Validates their past negative experiences. Helps understand what didn't work so you can highlight how REM is different"
    },
    {
      id: "not-interested",
      objection: "I'm not interested.",
      response: "I understand you might not be actively looking for something new right now, and I appreciate you letting me know. Just out of curiosity, when it comes to getting a good night's sleep, what's currently working well for you, or what's your biggest challenge?",
      psychology: "Respects their stance while gently probing for underlying needs or challenges"
    },
    {
      id: "no-time",
      objection: "I don't have time.",
      response: "I completely understand, life is incredibly busy, and it often feels like there aren't enough hours in the day, especially when you're not sleeping well. What part of your day typically feels most impacted by your current energy levels?",
      psychology: "Acknowledges their time constraint and links it back to the very problem REM solves"
    },
    {
      id: "competitor",
      objection: "How is this different from [competitor - e.g., melatonin/CBD]?",
      response: "That's a great question, and I understand why you'd want to compare it to other options out there. What have you experienced with [competitor] so far, and what are you hoping to achieve with a new solution?",
      psychology: "Validates their comparison. Helps understand their experience and criteria to highlight REM's unique approach"
    }
  ],

  closingScripts: [
    {
      id: "assumptive",
      title: "The Assumptive Close",
      type: "assumptive",
      script: "Great! So, based on everything we've discussed, it sounds like the REM patch is exactly what you need to finally get that deep, restorative sleep. What's the best address to send your first month's supply to?"
    },
    {
      id: "alternative",
      title: "The Alternative Close",
      type: "alternative",
      script: "Given how important it is for you to [reiterate key benefit, e.g., 'wake up refreshed and focused'], would you prefer to start with a 30-day supply to try it out, or would the 90-day package, which offers better value, be a better fit for you today?"
    },
    {
      id: "urgency",
      title: "The Urgency Close",
      type: "urgency",
      script: "Just so you know, our current special, where you get [X benefit/discount], ends this Friday. If you're ready to start experiencing better sleep, securing your REM patches today would ensure you lock in that savings before it's gone."
    },
    {
      id: "summary",
      title: "The Summary Close",
      type: "summary",
      script: "So, to recap, with the REM patch, you'll be getting a 100% drug-free, non-invasive solution that uses cutting-edge Vibrotactile Technology to help you fall asleep faster, stay asleep longer, and wake up feeling truly refreshed – addressing your challenges with [mention 1-2 specific pain points they shared]. How does that sound as a path to finally getting the sleep you deserve?"
    },
    {
      id: "referral",
      title: "The Referral Close",
      type: "referral",
      script: "Even if the REM patch isn't the perfect fit for you right now, I truly appreciate our conversation. Who else do you know who might be struggling with sleep or looking for a natural way to improve their rest? I'd be grateful for an introduction."
    }
  ],

  followUpSequence: [
    {
      day: "Day 1",
      title: "Post-Meeting - No Answer",
      voicemail: "Hi [Customer Name], this is [Your Name] from Super Patch. I really enjoyed our conversation earlier about the REM patch and finding a natural way to improve your sleep. I'm following up to see if you had any initial thoughts or questions after our chat. I'll send you a quick text as well. Feel free to call me back at [Your Phone Number] when you have a moment. Looking forward to connecting!",
      text: "Hi [Customer Name]! Great connecting today about REM. Hope you found the info helpful! Let me know if any questions pop up. 😊 [Your Name]"
    },
    {
      day: "Day 3",
      title: "Value Add & Gentle Nudge",
      text: "Hey [Customer Name], thinking of you! Saw this article on 'The Hidden Impact of Poor Sleep' and thought you might find it interesting. [Link to article/blog post]. Still here if you want to chat more about REM! [Your Name]"
    },
    {
      day: "Day 7",
      title: "Testimonial & Benefit Reminder",
      voicemail: "Hi [Customer Name], it's [Your Name] again, just checking in. I know you're busy, but I wanted to share a quick success story I heard this week about someone who finally got off their sleep medication thanks to REM. It made me think of our conversation. No pressure at all, but if you're still curious, I'm here to answer any questions. You can reach me at [Your Phone Number]. Have a great day!",
      text: "Good morning [Customer Name]! Just wanted to share a quick testimonial from a customer who said REM helped them wake up feeling truly refreshed for the first time in years. It's amazing what good sleep can do! Still considering REM? [Your Name]"
    },
    {
      day: "Day 14",
      title: "Stronger CTA/Final Offer",
      text: "Hi [Customer Name], last check-in on the REM patch! Many people find this is the perfect time to make a decision. Remember, better sleep can transform your entire day. If you're ready to start feeling refreshed, let me know, and I can help you get set up. Plus, we have a [mention a current offer if applicable]. [Your Name]"
    }
  ],

  testimonialPrompts: [
    {
      id: "biggest-struggle",
      question: "Before you started using the REM patch, what was your biggest struggle with sleep?"
    },
    {
      id: "changed-patterns",
      question: "How has the REM patch specifically changed your sleep patterns or quality of rest?"
    },
    {
      id: "surprising-benefit",
      question: "What was the most surprising or impactful benefit you've experienced since using REM?"
    },
    {
      id: "impacted-life",
      question: "How has getting better sleep impacted your daily life, energy, or mood?"
    },
    {
      id: "tell-skeptic",
      question: "What would you tell someone who is skeptical or on the fence about trying the REM patch?"
    },
    {
      id: "feel-now",
      question: "In just a few words, how would you describe how you feel now compared to before using REM?"
    },
    {
      id: "recommend",
      question: "Would you recommend the REM patch to others, and if so, who would benefit most?"
    }
  ],

  quickReference: {
    keyBenefits: [
      "Deeper, more restorative sleep, naturally",
      "Wake up feeling refreshed and energized, not groggy",
      "100% drug-free, non-invasive, and all-natural"
    ],
    bestQuestions: [
      "What are some of the biggest challenges you face when it comes to getting a good night's rest?",
      "How is your current sleep situation impacting your energy levels, focus, or mood during the day?",
      "What kind of results are you truly hoping for when you think about 'better sleep'?"
    ],
    topObjections: [
      {
        objection: "Too expensive",
        response: "I understand price is important. What aspects are most important for you in a product like this, beyond just the initial cost?"
      },
      {
        objection: "Does it really work?",
        response: "I understand your skepticism. What would you need to see, hear, or experience to truly feel this is a credible solution for you?"
      },
      {
        objection: "Need to think about it",
        response: "I understand this is a significant decision. What specific questions or considerations would be most helpful for you to think through?"
      }
    ],
    bestClosingLines: [
      "So, based on everything we've discussed, it sounds like the REM patch is exactly what you need to finally get that deep, restorative sleep. What's the best address to send your first month's supply to?",
      "Given how important it is for you to wake up refreshed and focused, would you prefer to start with a 30-day supply, or would the 90-day package be a better fit for you today?"
    ],
    keyStats: [
      "HARMONI Study: Double-blind, placebo-controlled RCT",
      "80% of participants stopped sleep medications during trial",
      "46% faster sleep onset (69 min → 37 min)",
      "15% increase in total sleep time"
    ]
  }
};

