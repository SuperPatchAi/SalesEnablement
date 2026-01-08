import { WordTrack } from "@/types/wordtrack";

export const focusD2CWordTrack: WordTrack = {
  id: "focus-d2c",
  productId: "focus",
  productName: "Focus",
  market: "d2c",
  tagline: "Bolster your mind's concentration and attention",
  category: "Focus & Attention",
  benefits: ["Better concentration", "Improved attention", "Mental clarity"],

  overview: `The Super Patch Focus is a revolutionary wellness product designed to naturally bolster your mind's concentration and attention. Utilizing our proprietary Vibrotactile Technology (VTT), this non-invasive, 100% drug-free patch interacts with your skin's mechanoreceptors through specialized ridge patterns, triggering your body's own neural responses to enhance cognitive function.

This innovative approach delivers tangible benefits, including improved concentration, enhanced attention span, and greater mental clarity, without the jitters or side effects associated with stimulants or pharmaceuticals. It's an all-natural, convenient solution for anyone seeking a mental edge.

The Focus patch is ideal for students striving for academic excellence, professionals needing to stay sharp during demanding workdays, and anyone who feels their focus wavering in a world full of distractions.`,

  customerProfile: {
    demographics: {
      age: "18-65+",
      lifestyle: [
        "College and high school students",
        "Office professionals, entrepreneurs",
        "Remote workers, creatives",
        "Parents managing multiple tasks",
        "Shift workers, demanding cognitive roles"
      ]
    },
    psychographics: {
      values: [
        "Productivity",
        "Mental clarity",
        "Natural health solutions",
        "Personal growth",
        "Efficiency",
        "Innovation"
      ],
      desires: [
        "Proactive about health",
        "Open to new technologies",
        "Seeking non-drug alternatives",
        "Optimize cognitive performance"
      ]
    },
    painPoints: [
      "Brain Fog: Feeling mentally sluggish or unclear",
      "Difficulty Concentrating: Struggling to stay on task for extended periods",
      "Easy Distraction: Getting sidetracked by internal thoughts or external stimuli",
      "Low Productivity: Not accomplishing enough due to lack of focus",
      "Mental Fatigue: Exhaustion from prolonged mental effort",
      "Reliance on Stimulants: Over-reliance on coffee or energy drinks",
      "Feeling Overwhelmed: By information overload or a long to-do list"
    ],
    previousSolutions: [
      "Caffeine/Energy Drinks – temporary boost, jitters, crashes",
      "Nootropic Supplements – expensive, inconsistent results",
      "Meditation/Mindfulness Apps – requires consistent effort",
      "Productivity Apps – don't address underlying cognitive ability",
      "Prescription Medications – concerns about side effects"
    ]
  },

  openingScripts: [
    {
      id: "cold-approach",
      title: "Cold Approach (Stranger)",
      scenario: "Meeting someone new in public",
      script: `Hi there! I couldn't help but notice [something positive about them]. That's really [impressive/cool/unique]! My name is [Your Name], great to meet you.

[After initial pleasantries]

I was just thinking about how hard it is for everyone to stay focused these days with so many distractions. Do you ever feel like your brain could use a little extra boost to stay sharp?`
    },
    {
      id: "warm-intro",
      title: "Warm Introduction",
      scenario: "Friend or family referred by someone",
      script: `Hey [Friend's Name]! It's great to catch up with you. [Mutual Friend] mentioned you've been looking for ways to really boost your productivity lately, and thought of me. 

How have things been going with that?`
    },
    {
      id: "social-dm",
      title: "Social Media DM",
      scenario: "Responding to their post about brain fog or productivity",
      script: `Hi [Name]! I saw your recent post about [struggle with brain fog/productivity tips] and it really resonated with me. 

I help people with exactly that challenge, and I immediately thought of you. Would you be open to a quick idea that might make a big difference for you?`
    },
    {
      id: "referral",
      title: "Referral Introduction",
      scenario: "After being referred",
      script: `Hi [Name]! [Referrer's Name] suggested I reach out to you. They mentioned you're a real go-getter, always looking for an edge, especially when it comes to staying sharp and focused. 

Is now a good time for a quick chat about something that could really help?`
    },
    {
      id: "event",
      title: "Event/Party Approach",
      scenario: "Social gathering",
      script: `This [event/party] is fantastic, isn't it? What brings you here tonight? I'm [Your Name], by the way. 

I was just chatting with someone about how challenging it is to maintain focus in our busy lives with so much going on. Do you ever find yourself wishing for a bit more mental clarity?`
    }
  ],

  discoveryQuestions: [
    { id: "productive-day", category: "opening", question: "What does a typical productive day look like for you, and what helps you get into that 'flow state'?" },
    { id: "biggest-challenges", category: "pain_point", question: "What are some of the biggest challenges you face when it comes to staying focused, maintaining concentration, or achieving mental clarity?" },
    { id: "impact-life", category: "impact", question: "When you're not able to focus as well as you'd like, how does that impact your work, studies, or even your personal life?" },
    { id: "tried-past", category: "solution", question: "What have you tried in the past to improve your concentration or mental performance, and what were your experiences with those solutions?" },
    { id: "perfect-focus", category: "solution", question: "If you could snap your fingers and have perfect, sustained focus, what would that enable you to achieve or change in your daily life?" },
    { id: "priorities", category: "decision", question: "When it comes to your cognitive performance and mental well-being, what's most important for you to improve right now?" },
    { id: "current-routine", category: "current", question: "What's your current routine or 'go-to' when you really need to buckle down and concentrate on a task?" },
    { id: "energy-levels", category: "pain_point", question: "How do your energy levels typically affect your ability to focus throughout the day, and do you experience any mid-day slumps?" },
    { id: "ideal-solution", category: "solution", question: "If you were to imagine an ideal solution for consistent focus and mental clarity, what would it look like or feel like for you?" },
    { id: "decision-criteria", category: "decision", question: "As you consider solutions for improving your focus, what criteria are most important to you in making that decision?" }
  ],

  productPresentation: {
    problem: `Do you ever find yourself struggling to concentrate, feeling that frustrating brain fog, or getting easily sidetracked when you really need to be sharp and productive?`,
    
    agitate: `It's incredibly frustrating, isn't it? That feeling when deadlines loom, or you're trying to study for an important exam, and your mind just won't cooperate. You end up wasting precious time, feeling less accomplished, and sometimes even a bit overwhelmed by the sheer volume of things demanding your attention. And often, the solutions out there either involve caffeine jitters and energy crashes, or they're just not natural, leaving you wondering about long-term effects and what you're actually putting into your body. It can feel like a constant uphill battle just to stay on top of your game.`,
    
    solve: `Well, what if there was a simple, elegant, and 100% drug-free way to naturally bolster your mind's concentration and attention? That's exactly what the Super Patch Focus patch is designed to do. It leverages our unique Vibrotactile Technology (VTT) – these specialized ridge patterns on the patch interact with your skin's mechanoreceptors to gently trigger your body's own neural responses, guiding your brain towards better concentration, improved attention, and profound mental clarity. 

It's like giving your brain a natural 'on' switch, helping you stay sharp and productive without any drugs, chemicals, or invasiveness. You just peel it, stick it on your skin, and start feeling the difference. Imagine tackling your day with that kind of sustained focus!`
  },

  objections: [
    {
      id: "too-expensive",
      objection: "It's too expensive.",
      response: "I understand that money is an important factor when you're considering new wellness solutions, and it's smart to be mindful of your budget. What other criteria will be used in taking this decision, beyond just the initial cost?",
      psychology: "Shifts to value conversation"
    },
    {
      id: "think-about-it",
      objection: "I need to think about it.",
      response: "I understand this is an important decision for your mental clarity and productivity, and you want to ensure it's the right fit for your lifestyle. What specific questions or considerations are on your mind as you think it over?",
      psychology: "Surfaces specific concerns"
    },
    {
      id: "talk-to-spouse",
      objection: "I need to talk to my spouse.",
      response: "I understand this is a significant decision for your household and your well-being, and you want to ensure everyone is on board. What aspects of improving your focus and productivity do you think would be most important for your spouse to understand?",
      psychology: "Prepares talking points"
    },
    {
      id: "does-it-work",
      objection: "Does it really work? It sounds too good to be true.",
      response: "I completely understand why you might be skeptical about new technologies, and it's important to feel confident in your choices. What would you need to see, hear, or experience to truly feel that this is a credible solution for you?",
      psychology: "Empowers them to define proof"
    },
    {
      id: "tried-before",
      objection: "I've tried patches/products before, and they didn't work.",
      response: "I understand you've explored different solutions in the past, and it's natural to be cautious when something hasn't delivered. What did you like or dislike about those previous patches or products, and what specific results were you hoping for?",
      psychology: "Gathers differentiation info"
    },
    {
      id: "not-interested",
      objection: "I'm not interested.",
      response: "I understand you might not be actively looking for something new right now, and that's perfectly fine. What aspects of your current focus and productivity are you most satisfied with, or what challenges, if any, do you find yourself just 'living with'?",
      psychology: "Probes for underlying needs"
    },
    {
      id: "no-time",
      objection: "I don't have time.",
      response: "I understand you have a very busy schedule, and that's completely fair. What specific challenges around time management or productivity are you facing right now that make it difficult to explore solutions to boost your focus?",
      psychology: "Connects to their pain point"
    },
    {
      id: "competitor",
      objection: "How is this different from [caffeine/nootropics]?",
      response: "I understand you're looking for the best solution out there. Focus uses Vibrotactile Technology – it's not putting anything into your body. Unlike caffeine that causes jitters and crashes, or supplements you ingest, Focus works externally through your skin's mechanoreceptors to optimize your neural responses. What aspects of other approaches are most appealing to you?",
      psychology: "Differentiates on mechanism"
    }
  ],

  closingScripts: [
    {
      id: "assumptive",
      title: "The Assumptive Close",
      type: "assumptive",
      script: "Great! So, which subscription package makes the most sense for you to get started with the Focus patches today, the monthly or the quarterly?"
    },
    {
      id: "alternative",
      title: "The Alternative Close",
      type: "alternative",
      script: "Would you prefer to start with a 30-day supply to try it out, or jump straight into the subscription for continuous benefits and savings?"
    },
    {
      id: "urgency",
      title: "The Urgency Close",
      type: "urgency",
      script: "I'm excited for you to experience this! Just so you know, we're actually running a special promotion this week for new customers, which includes a bonus pack of patches. That offer ends on Friday, so if you're ready to boost your focus, now would be the perfect time."
    },
    {
      id: "summary",
      title: "The Summary Close",
      type: "summary",
      script: "So, to recap, with the Super Patch Focus, you'll experience better concentration, improved attention, and mental clarity, all delivered through a drug-free, natural, and non-invasive technology. You mentioned how important it is for you to [reiterate their goal]. Given all that, are you ready to get started and feel the difference?"
    },
    {
      id: "next-step",
      title: "The Next Step Close",
      type: "assumptive",
      script: "I'm thrilled about the potential for you to improve your focus with these patches. What's the best email to send you the direct link to order, so you can easily get started and begin feeling more mentally clear this week?"
    }
  ],

  followUpSequence: [
    {
      day: "Day 1",
      title: "Post-Conversation",
      email: "Hi [Name], it was great connecting with you today about the Super Patch Focus! I'm really excited about how it can help you with [their specific pain point, e.g., 'overcoming that afternoon brain fog']. Here's a quick link to learn more and see how others are benefiting: [Link]. Please don't hesitate to reach out if any questions pop up!",
      text: "Hi [Name]! [Your Name] from Super Patch. Just checking in after our chat about the Focus patch. Hope you're having a productive day! Any questions come up? Let me know!"
    },
    {
      day: "Day 3",
      title: "No Response",
      voicemail: "Hi [Name], just circling back on our conversation about the Super Patch Focus. I know how busy life can get, so no worries if you haven't had a chance to look yet. Just wanted to offer myself as a resource if anything comes to mind.",
      text: "Hi [Name], just circling back on Focus. Still keen to help you get that mental edge and boost your productivity!"
    },
    {
      day: "Day 7",
      title: "Testimonial Share",
      email: "Hi [Name], hope you're having a great week! I was thinking about our chat regarding improving your focus, and I wanted to share a quick testimonial from someone who found the Focus patch incredibly helpful for [similar pain point]. Does this resonate with anything you're experiencing? Happy to chat if you have a moment.",
      text: "Hi [Name]! Quick success story: a customer told me Focus helped them power through a 3-hour meeting without losing concentration. Sound like something you'd benefit from?"
    },
    {
      day: "Day 14",
      title: "Re-engagement",
      email: "Hi [Name], just a friendly check-in. I know life gets hectic, and sometimes boosting our focus slips down the priority list. If your goal of [better concentration/mental clarity] is still something you're looking to achieve, I'm here to help. No pressure at all!",
      text: "Hi [Name], final check-in on Focus! If mental clarity is still a goal, I'm here to help. If not the right time, no problem – reach out whenever you're ready!"
    }
  ],

  testimonialPrompts: [
    { id: "before-struggle", question: "Before using the Super Patch Focus, what was your biggest struggle or frustration when it came to concentration, attention, or mental clarity?" },
    { id: "how-helped", question: "How has the Focus patch specifically helped you improve your focus, attention span, or overall mental sharpness?" },
    { id: "specific-change", question: "What's one specific task, project, or area of your daily life where you've noticed a significant positive change since incorporating the Focus patch?" },
    { id: "vs-other-methods", question: "What do you like most about using the Focus patch compared to other methods you might have tried (like coffee, supplements, etc.)?" },
    { id: "tell-skeptic", question: "If someone was skeptical about whether the Focus patch really works, what would you tell them based on your own experience?" },
    { id: "recommend", question: "Who would you recommend the Super Patch Focus to, and why do you think it would benefit them?" }
  ],

  quickReference: {
    keyBenefits: [
      "Better Concentration: Stay locked in on tasks without distraction",
      "Improved Attention: Sustain focus for longer periods",
      "Mental Clarity: Experience a sharp, fog-free mind"
    ],
    bestQuestions: [
      "What are some of the biggest challenges you face when it comes to staying focused?",
      "How does a lack of focus impact your work, studies, or daily life?",
      "What have you tried in the past to improve your concentration, and how did that work out?"
    ],
    topObjections: [
      { objection: "It's too expensive", response: "What other criteria will be used in taking this decision?" },
      { objection: "Does it really work?", response: "What would you need to see, hear, or experience to feel confident?" },
      { objection: "I need to think about it", response: "What specific questions or considerations are on your mind?" }
    ],
    bestClosingLines: [
      "Shall we go ahead and get your order placed for the Focus patches so you can start experiencing better concentration this week?",
      "Which subscription package, monthly or quarterly, makes the most sense for you to get started today?"
    ]
  }
};





