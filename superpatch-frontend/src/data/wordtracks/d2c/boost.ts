import { WordTrack } from "@/types/wordtrack";

export const boostD2CWordTrack: WordTrack = {
  id: "boost-d2c",
  productId: "boost",
  productName: "Boost",
  market: "d2c",
  tagline: "Power up with clean energy. No sugar or caffeine",
  category: "Energy",
  benefits: ["Clean energy", "No caffeine crash", "Sustained vitality"],

  overview: `Boost is your daily dose of natural, sustained energy without the jitters, crash, or sugar of traditional stimulants. Designed for anyone seeking an effective and healthy way to combat fatigue, improve focus, and maintain vitality throughout their day, Boost delivers clean energy to help you perform at your best, naturally.

What makes Boost truly unique is its foundation in Super Patch's proprietary Vibrotactile Technology (VTT). Unlike supplements you ingest or topical creams, Boost uses specialized ridge patterns embedded in the patch that interact with your skin's mechanoreceptors. This interaction triggers your body's own neural responses, signaling for increased natural energy production. It's 100% drug-free, all-natural, and non-invasive, offering a revolutionary approach to sustained vitality.`,

  customerProfile: {
    demographics: {
      age: "25-65+ (Anyone needing energy)",
      lifestyle: [
        "Office workers, remote employees, entrepreneurs",
        "Healthcare workers, teachers, shift workers",
        "Parents with young children or busy schedules",
        "Athletes, fitness enthusiasts, outdoor adventurers",
        "Health-conscious individuals avoiding caffeine"
      ]
    },
    psychographics: {
      values: ["Health", "Wellness", "Natural solutions"],
      desires: [
        "Sustained energy over quick, short-lived bursts",
        "Improved focus and mental clarity without 'wired' feeling",
        "Proactive energy management"
      ],
      concerns: [
        "Long-term effects of caffeine",
        "Dependency on stimulants"
      ]
    },
    painPoints: [
      "Afternoon Slump: Losing focus and energy mid-day, leading to decreased productivity",
      "Caffeine Jitters & Crash: Anxiety, shakiness, or inevitable 'crash' after caffeine",
      "Poor Sleep: Stimulants affecting sleep quality, creating a vicious cycle of fatigue",
      "Dependency on Stimulants: Feeling reliant on coffee or energy drinks to function",
      "Lack of Motivation: Struggling to start or complete tasks due to low energy",
      "Digestive Issues: Stomach upset from certain supplements or energy drinks",
      "Desire for 'Clean' Energy: Wanting energy without artificial ingredients"
    ],
    previousSolutions: [
      "Coffee (multiple cups a day)",
      "Energy drinks (Red Bull, Monster, etc.)",
      "Caffeine pills/supplements",
      "B-vitamin complexes",
      "Herbal energy supplements (ginseng, guarana)",
      "Dietary changes",
      "Power naps"
    ]
  },

  openingScripts: [
    {
      id: "cold-approach",
      title: "Cold Approach (Stranger)",
      scenario: "Notice someone looking tired or reaching for a coffee",
      script: `Hi there! I couldn't help but notice you look like you're in need of a little pick-me-up. Happens to the best of us! I'm [Your Name]. 

What's typically your go-to when you're feeling that afternoon slump?`
    },
    {
      id: "warm-intro",
      title: "Warm Introduction",
      scenario: "Friend or family member who complains about low energy",
      script: `Hey [Friend's Name]! You know how you're always talking about feeling drained by mid-afternoon? 

I've actually been using something really interesting that's made a huge difference for my energy without any caffeine. Have you ever looked into natural ways to boost your vitality without stimulants?`
    },
    {
      id: "social-dm",
      title: "Social Media DM",
      scenario: "Responding to a post about fatigue",
      script: `Hi [Name]! I saw your post about struggling with energy lately, and I can totally relate – it's a common challenge these days. 

I've found a game-changer for clean, sustained energy that's completely drug-free. Would you be open to hearing about a unique approach that's helping a lot of people ditch the caffeine crash?`
    },
    {
      id: "referral",
      title: "Referral Introduction",
      scenario: "Introduction from a mutual connection",
      script: `Hi [Prospect Name], this is [Your Name]. [Referral Name] mentioned you recently, and knowing how much you value natural health solutions, they thought you might be interested in what I do. 

They shared that you've been looking for ways to get more sustained energy without relying on coffee or energy drinks. Is that something you're actively exploring right now?`
    },
    {
      id: "event",
      title: "Event/Party Approach",
      scenario: "Casual conversation when someone mentions being tired",
      script: `Oh, I hear you on that! It seems like everyone is looking for ways to keep their energy up these days. 

I actually work with a really cool, innovative technology that helps the body naturally produce its own clean energy. It's completely drug-free. Have you ever heard of 'vibrotactile technology' for wellness?`
    }
  ],

  discoveryQuestions: [
    { id: "typical-day", category: "opening", question: "Tell me a little about your typical day. What are your biggest energy challenges or goals right now?" },
    { id: "energy-dip", category: "pain_point", question: "When do you typically feel your energy dip, and how does that impact your productivity or mood?" },
    { id: "affect-life", category: "impact", question: "How does feeling tired or relying on stimulants affect your daily life, your family, or your ability to do the things you love?" },
    { id: "magic-wand", category: "solution", question: "If you could wave a magic wand, what would your ideal energy levels feel like throughout the day, without any negative side effects?" },
    { id: "tried-before", category: "pain_point", question: "What have you tried in the past to boost your energy, and what did you like or dislike about those solutions?" },
    { id: "long-term", category: "impact", question: "Are you concerned about the long-term effects of caffeine or energy drinks on your health?" },
    { id: "beyond-energy", category: "solution", question: "Beyond just 'more energy,' what specific improvements are you hoping to see in your focus, clarity, or overall well-being?" },
    { id: "satisfaction", category: "opening", question: "On a scale of 1 to 10, how satisfied are you with your current energy levels and how you manage them?" },
    { id: "frustration", category: "pain_point", question: "What's the biggest frustration you have with your current energy routine?" },
    { id: "clean-energy", category: "solution", question: "If you found a way to get sustained, clean energy without any stimulants, what difference would that make for you?" }
  ],

  productPresentation: {
    problem: `Have you ever found yourself hitting that dreaded afternoon slump, feeling like you need another coffee or an energy drink just to push through? Or maybe you're tired of the jitters and the inevitable crash that comes with those quick fixes? It's a common struggle – trying to keep up with life's demands while feeling constantly drained, often relying on stimulants that eventually leave you feeling worse.`,
    
    agitate: `This isn't just about feeling a bit tired; it impacts everything. Your focus at work slips, your patience with family wears thin, and you might even skip workouts or social plans because you just don't have the energy. And those stimulants? While they offer a temporary boost, they can disrupt your sleep, mess with your digestion, and create a cycle of dependency that's hard to break, ultimately hindering your long-term health and vitality.`,
    
    solve: `That's why I'm so excited about the Super Patch Boost. Imagine getting clean, sustained energy all day long, without any sugar, caffeine, or stimulants. Boost uses revolutionary Vibrotactile Technology – it's a small patch with special patterns that simply touch your skin. These patterns communicate with your body's natural systems, helping it optimize its own neural responses to produce and sustain energy naturally. No pills, no drinks, no crash. Just consistent, natural vitality so you can power through your day, stay focused, and feel your best from morning to night. It's a completely drug-free, non-invasive way to unlock your body's own energy potential.`
  },

  objections: [
    {
      id: "too-expensive",
      objection: "It's too expensive.",
      response: "I understand that price is an important factor when you're considering new wellness solutions, and you want to ensure you're making a wise investment. What aspects are most important for you in a product like this, beyond just the initial cost?",
      psychology: "Validates their financial concern while shifting focus to value"
    },
    {
      id: "think-about-it",
      objection: "I need to think about it.",
      response: "I understand this is a significant decision for your health and well-being, and you want to ensure it's the right fit for your lifestyle. What specific questions or considerations would be most helpful for you to think through as you evaluate the Boost patch?",
      psychology: "Helps identify sticking points"
    },
    {
      id: "talk-to-spouse",
      objection: "I need to talk to my spouse.",
      response: "I understand this is an important decision, and you want to involve your spouse. What specific questions or concerns do you anticipate your spouse might have, or what information would be most helpful for them to review?",
      psychology: "Helps prepare for partner conversation"
    },
    {
      id: "does-it-work",
      objection: "Does it really work? It sounds too good to be true.",
      response: "I completely understand why you might be skeptical about new technologies, and it's important to feel confident in your choices. What would you need to see, hear, or experience to truly feel that this is a credible solution for you?",
      psychology: "Empowers them to define path to belief"
    },
    {
      id: "tried-before",
      objection: "I've tried patches/products before, and they didn't work.",
      response: "I understand you've had experiences with other products in the past that didn't deliver the results you hoped for, and that can certainly be frustrating. What types of patches or products were those, and what specifically were you hoping they would achieve for you?",
      psychology: "Allows highlighting how Boost is different"
    },
    {
      id: "not-interested",
      objection: "I'm not interested.",
      response: "I understand you might not be actively looking for a new energy solution right now. Could you share what led you to say you're not interested, or what your current approach to energy management looks like?",
      psychology: "Gently probes for underlying reason"
    },
    {
      id: "no-time",
      objection: "I don't have time.",
      response: "I understand you're incredibly busy, and time is a precious commodity. What part of exploring a new energy solution feels like it would take up too much of your time, or what are your biggest time commitments right now?",
      psychology: "Offers concise info or flexible follow-up"
    },
    {
      id: "competitor",
      objection: "How is this different from [caffeine patch/energy drink]?",
      response: "I understand you're curious about how Boost stands apart from other energy solutions. Boost uses Vibrotactile Technology – it doesn't deliver any caffeine or stimulants. It works with your body's own neural responses to produce sustained energy naturally. What aspects of other solutions are you most interested in comparing?",
      psychology: "Highlights VTT and no-crash benefits"
    }
  ],

  closingScripts: [
    {
      id: "assumptive",
      title: "The Assumptive Close",
      type: "assumptive",
      script: "Great! So, based on what we've discussed, it sounds like the Boost patch is exactly what you're looking for to get that sustained, clean energy. Let's get you started today. What's the best shipping address for your first order?"
    },
    {
      id: "alternative",
      title: "The Alternative Close",
      type: "alternative",
      script: "To get you started with that clean energy, would you prefer to begin with a 30-day supply to try it out, or would the 90-day pack, which offers better value, be a better fit for you right away?"
    },
    {
      id: "urgency",
      title: "The Urgency Close",
      type: "urgency",
      script: "Just so you know, we have a special promotion running this week for new customers, which includes [mention specific benefit]. This offer ends on Friday, and I'd love for you to take advantage of it. Does it make sense to get your order placed today so you don't miss out?"
    },
    {
      id: "summary",
      title: "The Summary Close",
      type: "summary",
      script: "So, with Boost, you'll finally be able to say goodbye to that afternoon slump, avoid the caffeine jitters, and enjoy sustained, clean energy throughout your day, all thanks to our unique VTT. You'll gain improved focus and vitality, without any drugs or side effects. How does getting started with that sound to you?"
    },
    {
      id: "referral",
      title: "The Referral Close",
      type: "referral",
      script: "That's fantastic! I'm so excited for you to start experiencing the benefits of Boost. As you begin to feel that sustained energy, who else comes to mind in your network – perhaps a friend, family member, or colleague – who you know is always looking for clean energy solutions or struggling with fatigue like you used to?"
    }
  ],

  followUpSequence: [
    {
      day: "Day 1",
      title: "After Initial Conversation",
      voicemail: "Hi [Name], it's [Your Name] from Super Patch. I was calling because [Referral Name] suggested we connect, or I saw your interest in natural energy solutions. I wanted to briefly share how the Boost patch could help you get clean, sustained energy without the crash. I'll shoot you a quick text with some info. Feel free to call me back at [Your Number] when you have a moment.",
      text: "Hi [Name]! Great connecting with you today about the Boost patch. I'm excited for you to learn more about clean energy. Here's a quick link to [website/product page] for your reference. Let me know if any questions pop up!"
    },
    {
      day: "Day 3",
      title: "Check-in",
      text: "Hey [Name]! Just checking in. Did you have a chance to look at the Boost info I sent? Thinking about the afternoon slump you mentioned, I truly believe this could be a game-changer for you. Happy to answer any questions!"
    },
    {
      day: "Day 7",
      title: "Value-add",
      text: "Hi [Name]! Hope you're having a great week. I was just thinking about our conversation on energy. I came across a short article on 'the hidden dangers of energy drinks' that I thought you might find interesting. It really highlights why natural alternatives like Boost are so important. Let me know if you're still curious!"
    },
    {
      day: "Day 14",
      title: "Re-engagement",
      text: "Hey [Name], it's [Your Name]. Just one last friendly check-in about the Boost patch. Many people are surprised by how quickly they feel a difference. If getting sustained, clean energy is still a priority, I'd love to help you get started. No pressure at all, but I wanted to make sure you had all the info you need. Let me know if you're open to a quick chat!"
    }
  ],

  testimonialPrompts: [
    { id: "before-challenge", question: "Before using Boost, what was your biggest energy challenge or frustration?" },
    { id: "impact-life", question: "How did that challenge impact your daily life, work, or family?" },
    { id: "why-try", question: "What made you decide to try the Super Patch Boost?" },
    { id: "changes-noticed", question: "Since using Boost, what specific changes or improvements have you noticed in your energy levels, focus, or overall well-being?" },
    { id: "overcome-challenges", question: "How has Boost helped you overcome your previous challenges?" },
    { id: "best-part", question: "What's the best part about having clean, sustained energy without the crash?" },
    { id: "recommend", question: "Who would you recommend Boost to, and why?" },
    { id: "skeptic", question: "If you were talking to someone who was skeptical, what would you tell them about your experience?" }
  ],

  quickReference: {
    keyBenefits: [
      "Clean, Sustained Energy: No sugar, no caffeine, no jitters, no crash",
      "Drug-Free & Natural: Uses your body's own neural responses via VTT",
      "Improved Focus & Vitality: Combat fatigue, stay sharp all day"
    ],
    bestQuestions: [
      "What are your biggest energy challenges or goals right now?",
      "What have you tried in the past to boost your energy, and what did you like or dislike?",
      "If you could wave a magic wand, what would your ideal energy levels feel like?"
    ],
    topObjections: [
      { objection: "It's too expensive", response: "What aspects are most important for you beyond just the initial cost?" },
      { objection: "Does it really work?", response: "What would you need to see, hear, or experience to feel confident?" },
      { objection: "I need to think about it", response: "What specific questions or considerations would be most helpful?" }
    ],
    bestClosingLines: [
      "Let's get you started today. What's the best shipping address for your first order?",
      "Would you prefer to begin with a 30-day supply, or would the 90-day pack be a better fit?"
    ]
  }
};

