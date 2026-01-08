import { WordTrack } from "@/types/wordtrack";

export const libertyD2CWordTrack: WordTrack = {
  id: "liberty-d2c",
  productId: "liberty",
  productName: "Liberty",
  market: "d2c",
  tagline: "Healthy living relies on better balance and mobility",
  category: "Mobility",
  benefits: ["Improved balance", "Better mobility", "Enhanced stability"],

  overview: `The Super Patch Liberty is a revolutionary wellness product engineered to significantly improve balance, enhance mobility, and boost overall stability. Utilizing cutting-edge Vibrotactile Technology (VTT), the Liberty patch features specialized ridge patterns that interact with the skin's mechanoreceptors, gently triggering the body's own neural responses to optimize movement and steadiness.

Liberty is ideal for a diverse audience, from seniors looking to reduce the risk of falls and maintain an active, independent lifestyle, to athletes aiming to refine their agility and performance, and even individuals recovering from injuries or simply desiring better control and stability in their daily activities.

What sets Liberty apart is its intelligent design and natural efficacy. The Balance Study showed a 31% improvement in balance scores (p<0.05). Unlike temporary fixes or invasive treatments, Liberty leverages the body's innate capabilities, offering a sustainable way to achieve lasting improvements in balance and mobility.`,

  customerProfile: {
    demographics: {
      age: "Primarily 50+ (seniors), but also athletes of all ages, and adults 30-60",
      gender: "All genders",
      lifestyle: [
        "Active individuals",
        "Those who value independence",
        "People interested in natural health solutions",
        "Individuals recovering from injuries",
        "Those seeking preventative wellness"
      ],
      healthStatus: "Mid to upper-mid income, willing to invest in their health"
    },
    psychographics: {
      values: [
        "Independence",
        "Health",
        "Safety",
        "Active living",
        "Self-sufficiency",
        "Natural solutions",
        "Quality of life",
        "Longevity"
      ],
      desires: [
        "Maintain or regain an active lifestyle",
        "Feel confident and secure in their movements",
        "Reduce the risk of falls",
        "Improve athletic performance",
        "Enjoy hobbies without limitation",
        "Age gracefully"
      ]
    },
    painPoints: [
      "Fear of falling – a primary concern for seniors, leading to reduced activity and social isolation",
      "Reduced mobility/stiffness – difficulty with daily tasks like walking, climbing stairs",
      "Lack of confidence – feeling unsteady, hesitant to move quickly",
      "Decreased athletic performance – slight imbalances, slower reaction times",
      "Reliance on others – frustration over needing assistance",
      "Frustration with existing solutions – disappointment with physical therapy plateaus"
    ],
    previousSolutions: [
      "Physical therapy or balance exercises",
      "Mobility aids (canes, walkers)",
      "Supplements aimed at joint health",
      "Pain relief creams or medications",
      "Traditional medical interventions",
      "Other patches or wearable tech"
    ]
  },

  openingScripts: [
    {
      id: "cold-approach",
      title: "Cold Approach (Stranger)",
      scenario: "Public setting like a park or health store",
      script: `Hi there! I couldn't help but notice your [active wear/energetic pace/focused look]. My name is [Your Name], and I specialize in helping people enhance their natural balance and mobility. What brings you out today?

[Listen intently and find common ground]

That's fantastic! You know, it's amazing how much better we feel when our balance and stability are optimized for those activities. Have you ever really thought about how important your balance is to your daily life or performance?`
    },
    {
      id: "warm-intro",
      title: "Warm Introduction",
      scenario: "Speaking with a friend or family member",
      script: `Hey [Friend's Name], it's so good to catch up! How have things been? 

I've actually been really excited to chat with you about something that's been making a huge difference for people, and it immediately made me think of you because of your [interest in health/active lifestyle/mention of previous balance concern]. 

Are you open to hearing about a natural, drug-free way to boost your balance and mobility?`
    },
    {
      id: "social-dm",
      title: "Social Media DM",
      scenario: "Responding to their fitness or health posts",
      script: `Hi [Name], I've been following your [fitness journey/healthy living posts/adventures] and I'm genuinely impressed by your dedication! 

I help people like you optimize their natural balance and mobility, and I truly believe the Super Patch Liberty could be a game-changer for your [specific activity/goals, e.g., hiking, yoga, staying agile]. 

Would you be open to a quick chat to see if it's a good fit?`
    },
    {
      id: "referral",
      title: "Referral Introduction",
      scenario: "Following up on a referral",
      script: `Hi [Prospect Name], my name is [Your Name], and [Referral Name] suggested I reach out to you. 

They mentioned you were looking for ways to [improve your balance/stay active/address specific concern like feeling unsteady]. I work with a natural, non-invasive technology that helps with balance and mobility, and [Referral Name] thought you might find it really beneficial, as they have. 

I'd love to share a bit more about it and see if it might be helpful for you. Are you free for a brief call this week?`
    },
    {
      id: "event",
      title: "Event/Party Approach",
      scenario: "Networking or social gathering",
      script: `Hey [Name], enjoying the [event/party]? I'm [Your Name]. What brings you here tonight? 

[Listen and engage naturally]

I actually help people improve their balance and mobility naturally. It's amazing how many people are looking for ways to stay active and confident, especially as they get older or if they're athletes. Have you ever thought about how important your balance is to your daily life?`
    }
  ],

  discoveryQuestions: [
    {
      id: "ideal-day",
      category: "opening",
      question: "What does an ideal day look like for you when it comes to your physical activity or daily routines?"
    },
    {
      id: "wellness-priorities",
      category: "opening",
      question: "What are your biggest health and wellness priorities right now?"
    },
    {
      id: "balance-challenges",
      category: "pain_point",
      question: "Can you tell me about any challenges you've been experiencing recently with your balance or overall mobility?"
    },
    {
      id: "less-steady",
      category: "pain_point",
      question: "Have you noticed any situations where you feel less steady or confident in your movements?"
    },
    {
      id: "impact-activities",
      category: "impact",
      question: "How has [specific challenge they mentioned] impacted your ability to do the things you love, or even just your daily tasks?"
    },
    {
      id: "worries-falls",
      category: "impact",
      question: "What worries you most about potential falls or losing your stability as you get older/continue your sport?"
    },
    {
      id: "independence",
      category: "impact",
      question: "How does not being able to [activity they love] affect your overall independence or confidence?"
    },
    {
      id: "tried-past",
      category: "solution",
      question: "What solutions or approaches have you tried in the past to address these issues, and what was your experience with them?"
    },
    {
      id: "magic-wand",
      category: "solution",
      question: "If you could wave a magic wand, what would improved balance and mobility allow you to do more of, or feel more confident doing?"
    },
    {
      id: "important-factors",
      category: "decision",
      question: "What's most important to you when considering a new wellness product – is it ease of use, natural ingredients, proven results, or something else?"
    }
  ],

  productPresentation: {
    problem: `Many people, especially as they age or push their bodies in sports, start to notice little wobbles, a bit less confidence in their steps, or even a fear of falling. It can really limit what you feel comfortable doing, whether it's playing with grandkids, enjoying a hike, or just navigating your home without a second thought. It's a common concern that can creep up on us.`,
    
    agitate: `Think about what that feeling of unsteadiness or limited mobility does to your daily life. It might mean you avoid certain activities you once loved, rely more on others, or constantly worry about taking a tumble. That loss of independence, the inability to participate fully, or even just the nagging concern about your next step can be incredibly frustrating and even isolating. It can really diminish your quality of life and that feeling of freedom.`,
    
    solve: `That's why I'm so excited to share the Liberty Super Patch with you. It's a completely natural, drug-free, and non-invasive way to tap into your body's own ability to improve balance and mobility. Using our unique Vibrotactile Technology, the Liberty patch interacts with your skin's mechanoreceptors, sending signals to your brain to enhance your natural stability. 

Our Balance Study showed a 31% improvement in balance scores (p<0.05). People experience better balance, more confident movement, and a renewed sense of freedom. It's about getting back to healthy living, relying on better balance and mobility, without any drugs or complicated routines.`
  },

  objections: [
    {
      id: "too-expensive",
      objection: "It's too expensive.",
      response: "I understand that cost is an important consideration when investing in your health, and you want to make a smart decision. Beyond the initial price, what other criteria are most important to you when evaluating a solution like this for your balance and mobility?",
      psychology: "Validates financial concern, redirects to value criteria"
    },
    {
      id: "think-about-it",
      objection: "I need to think about it.",
      response: "I understand this is a significant decision for your well-being, and it's important to feel completely confident. What specific aspects are you hoping to think more deeply about, or what questions might still be lingering for you after our conversation?",
      psychology: "Acknowledges need for consideration, uncovers specific concerns"
    },
    {
      id: "talk-to-spouse",
      objection: "I need to talk to my spouse.",
      response: "I understand you want to involve your spouse in such an important health decision, and that's completely natural. What specific information or benefits do you think would be most important for them to understand about how the Liberty patch could help you?",
      psychology: "Validates partner involvement, helps prepare talking points"
    },
    {
      id: "does-it-work",
      objection: "Does it really work? It sounds too good to be true.",
      response: "I completely understand why you might be skeptical about new wellness technologies. Our Balance Study showed a 31% improvement in balance scores – that's peer-reviewed clinical evidence. What would you need to see, hear, or experience to truly feel confident that this could help you?",
      psychology: "Validates skepticism, provides clinical backing"
    },
    {
      id: "tried-before",
      objection: "I've tried patches/products before, and they didn't work.",
      response: "I understand you've explored other solutions in the past, and it sounds like you're looking for something that truly delivers. Can you tell me a bit about what you've tried and what your experience was with those products, so I can understand what you're hoping for?",
      psychology: "Validates past experience, gathers differentiation info"
    },
    {
      id: "not-interested",
      objection: "I'm not interested.",
      response: "I understand you might not be actively looking for new solutions right now, and that's perfectly fine. Could you share what led you to that feeling, or what your current approach to maintaining your balance and mobility looks like?",
      psychology: "Respects decision, probes for underlying needs"
    },
    {
      id: "no-time",
      objection: "I don't have time.",
      response: "I understand you have a very busy schedule, and your time is incredibly valuable. What would an ideal solution look like for you that could easily fit into your current routine without adding stress or requiring a lot of effort?",
      psychology: "Validates time constraint, positions product as easy solution"
    },
    {
      id: "competitor",
      objection: "How is this different from [competitor/traditional solution]?",
      response: "I understand you're looking for clarity on how the Liberty patch stands out. Unlike braces or physical therapy alone, Liberty uses Vibrotactile Technology to work WITH your nervous system, enhancing your body's natural balance capabilities. What have you found appealing about other solutions, and what's been missing?",
      psychology: "Differentiates on mechanism, gathers comparison criteria"
    }
  ],

  closingScripts: [
    {
      id: "assumptive",
      title: "The Assumptive Close",
      type: "assumptive",
      script: "So, based on everything we've discussed today – how Liberty can help you improve your balance, boost your confidence, and allow you to get back to doing the activities you love, all naturally – it sounds like this is exactly what you're looking for. What's the best address to send your first order to?"
    },
    {
      id: "alternative",
      title: "The Alternative Close",
      type: "alternative",
      script: "Would you prefer to start with a 30-day supply to experience the initial benefits, or are you ready to commit to the 90-day package for the best value and sustained, long-term results?"
    },
    {
      id: "urgency",
      title: "The Urgency Close",
      type: "urgency",
      script: "Given how important regaining your confidence and stability is to you, and the fact that we have a special offer running this month, now's a perfect time to start. Shall I go ahead and set you up with the starter package?"
    },
    {
      id: "summary",
      title: "The Summary Close",
      type: "summary",
      script: "So to recap: Liberty offers you a 31% clinically-proven improvement in balance, drug-free and non-invasive technology, and the freedom to get back to [their specific activity]. Given all these benefits align perfectly with what you're looking for, are you ready to take that first step toward better balance today?"
    },
    {
      id: "referral",
      title: "The Referral Close",
      type: "referral",
      script: "I'm so glad you're excited about Liberty! As you start experiencing the benefits, who else do you know – perhaps a family member or friend – who could also benefit from improved balance and mobility?"
    }
  ],

  followUpSequence: [
    {
      day: "Day 1",
      title: "Post-Meeting Thank You",
      voicemail: "Hi [Name], this is [Your Name] from Super Patch. I really enjoyed our conversation about the Liberty patch and how it can help with your balance goals. I'll send over the study information we discussed. Feel free to call me back at [Your Phone Number] if any questions come up. Talk soon!",
      text: "Hi [Name]! Great connecting today about Liberty. Sending you the Balance Study info now. Let me know if any questions pop up! 😊 [Your Name]"
    },
    {
      day: "Day 3",
      title: "Value Add",
      email: `Subject: Quick tip for improving your daily balance

Hi [Name],

Hope your week is going great! 

I was thinking about our conversation regarding your [specific balance concern]. Did you know that even small improvements in balance can significantly reduce fall risk and boost confidence in daily activities?

Our clinical study showed 31% improvement in balance scores – that's the kind of change that makes a real difference in quality of life.

Have you had a chance to think more about trying Liberty? I'd love to help you get started.

Best,
[Your Name]`,
      text: "Hey [Name]! Thinking of you. Any more questions about the Liberty patch? Happy to chat whenever works for you! [Your Name]"
    },
    {
      day: "Day 7",
      title: "Testimonial Share",
      voicemail: "Hi [Name], it's [Your Name] again. I wanted to share a quick story from a customer who was hesitant at first but decided to try Liberty. Within two weeks, she told me she felt more confident walking her dog and even started taking those stairs she'd been avoiding. It made me think of you! Give me a call if you'd like to hear more.",
      text: "Good morning [Name]! Wanted to share – a customer told me Liberty helped her feel confident enough to take up hiking again after years of avoiding it. Reminded me of our chat! Still interested? [Your Name]"
    },
    {
      day: "Day 14",
      title: "Final Check-In",
      email: `Subject: Checking in one last time

Hi [Name],

I wanted to reach out one more time about the Liberty patch.

I know you mentioned wanting to improve your balance and get back to [their activity]. If that's still a priority for you, I'm here to help you get started.

If the timing isn't right, no worries at all – just let me know, and I'll follow up when it makes more sense for you.

Wishing you all the best,
[Your Name]`,
      text: "Hey [Name], final check-in on Liberty! If improving your balance is still a goal, I'm here to help. If not the right time, just say the word. Take care! [Your Name]"
    }
  ],

  testimonialPrompts: [
    {
      id: "before-balance",
      question: "Before using the Liberty patch, what was your biggest challenge with balance or mobility?"
    },
    {
      id: "first-noticed",
      question: "When did you first notice an improvement in your balance after starting Liberty?"
    },
    {
      id: "activities-resumed",
      question: "What activities have you been able to resume or enjoy more since using Liberty?"
    },
    {
      id: "confidence-change",
      question: "How has your confidence in your physical movements changed?"
    },
    {
      id: "recommend",
      question: "Would you recommend Liberty to others, and who would benefit most?"
    },
    {
      id: "one-word",
      question: "If you could describe your experience with Liberty in one word, what would it be?"
    }
  ],

  quickReference: {
    keyBenefits: [
      "31% improvement in balance scores (clinical study)",
      "100% drug-free and non-invasive",
      "Works with your body's natural systems"
    ],
    bestQuestions: [
      "Have you noticed situations where you feel less steady or confident?",
      "What worries you most about potential falls?",
      "If improved balance allowed you to do one thing, what would it be?"
    ],
    topObjections: [
      {
        objection: "Too expensive",
        response: "Beyond the price, what factors are most important for your balance solution?"
      },
      {
        objection: "Does it really work?",
        response: "Our Balance Study showed 31% improvement. What would help you feel confident trying it?"
      },
      {
        objection: "I've tried things before",
        response: "What was missing from those solutions that you're hoping to find?"
      }
    ],
    bestClosingLines: [
      "Based on what you've shared, Liberty sounds perfect for you. What's the best address for your first order?",
      "Would you prefer the 30-day trial or the 90-day package for better value?"
    ],
    keyStats: [
      "Balance Study: 31% improvement in balance scores",
      "p<0.05 (statistically significant)",
      "Reduced sway velocity during standing tasks",
      "Improved confidence in balance-challenging activities"
    ]
  }
};





