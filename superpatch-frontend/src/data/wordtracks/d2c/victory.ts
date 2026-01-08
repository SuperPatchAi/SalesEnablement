import { WordTrack } from "@/types/wordtrack";

export const victoryD2CWordTrack: WordTrack = {
  id: "victory-d2c",
  productId: "victory",
  productName: "Victory",
  market: "d2c",
  tagline: "Get stronger, faster, and more agile. Smash your personal bests",
  category: "Athletic Performance",
  benefits: ["Enhanced strength", "Improved endurance", "Better agility"],

  overview: `The Super Patch Victory is an innovative athletic performance patch designed to help individuals get stronger, faster, and more agile, enabling them to smash their personal bests. It's a game-changer for anyone serious about their fitness and athletic pursuits.

Victory works by leveraging cutting-edge Vibrotactile Technology (VTT). This isn't a drug or a supplement; it's a specialized pattern on the patch that interacts with your skin's mechanoreceptors. This interaction triggers your body's own neural responses, optimizing your natural capabilities for enhanced strength, improved endurance, and better agility. It's 100% drug-free, all-natural, and non-invasive, offering a safe and effective way to unlock your full athletic potential.`,

  customerProfile: {
    demographics: {
      age: "20-55 years old (prime athletic and competitive years)",
      lifestyle: [
        "Professional, amateur, recreational athletes",
        "Fitness enthusiasts, gym-goers",
        "Runners, cyclists, cross-fitters",
        "Weekend warriors"
      ]
    },
    psychographics: {
      values: [
        "Goal-oriented – driven by personal bests",
        "Health-conscious – seeks natural solutions",
        "Early adopters – willing to try new technologies",
        "Performance-driven – optimizing capabilities"
      ],
      concerns: [
        "Performance plateaus",
        "Slow recovery times",
        "Finding a safe, legal competitive edge"
      ]
    },
    painPoints: [
      "Performance Plateaus: Struggling to break through current limits in strength, speed, or endurance",
      "Slow Recovery: Prolonged muscle soreness, fatigue, or needing more rest between workouts",
      "Lack of Energy/Stamina: Running out of gas during workouts or competitions",
      "Injury Concerns: Wanting to optimize body mechanics to prevent injuries",
      "Desire for a Competitive Edge: Seeking a safe, legal advantage over competitors",
      "Frustration with Traditional Supplements: Disappointed with results or side effects of pills and powders"
    ],
    previousSolutions: [
      "Pre-workout supplements, protein powders, creatine, BCAAs",
      "Specific training programs, strength & conditioning coaches",
      "Recovery tools like foam rollers, massage guns, cryotherapy",
      "Topical creams or patches for muscle soreness",
      "Strict diets and hydration protocols"
    ]
  },

  openingScripts: [
    {
      id: "cold-approach",
      title: "Cold Approach (Gym/Event)",
      scenario: "At a gym or athletic event",
      script: `Hey there! I couldn't help but notice your incredible focus/intensity on that last set/run. It's inspiring! What kind of training are you into these days?

[Wait for response]

Awesome! I'm [Your Name], and I actually help athletes like yourself unlock even more of their potential. Have you ever explored innovative, drug-free ways to boost your strength and endurance?`
    },
    {
      id: "warm-intro",
      title: "Warm Introduction",
      scenario: "Friend or family member who's into fitness",
      script: `Hey [Friend's Name]! How's your [running/gym routine/sport] going? I've been so excited to tell you about something I've started using that's totally changed my game. You know how much you're always pushing yourself, and I immediately thought of you.

It's called Victory, a Super Patch designed to help you get stronger, faster, and more agile – completely naturally. I think you'd be really impressed with what it could do for your [specific goal].`
    },
    {
      id: "social-dm",
      title: "Social Media DM",
      scenario: "Responding to their workout or achievement post",
      script: `Hey [Name]! Loved seeing your recent post about [their workout/race/achievement] – super impressive! 💪 

I noticed you're really dedicated to your fitness. I work with a lot of athletes who are looking for that extra edge to smash their personal bests, naturally. Have you ever considered drug-free, non-invasive tech to enhance your strength, endurance, and agility?`
    },
    {
      id: "referral",
      title: "Referral Introduction",
      scenario: "After being introduced by a mutual connection",
      script: `Hi [Prospect's Name], it's [Your Name]. [Referral Name] mentioned you're really committed to your [sport/fitness goals] and always looking for ways to improve. 

They thought you'd be interested in what I do, which is helping athletes enhance their performance naturally with our Super Patch Victory. What are some of your biggest goals or challenges in your training right now?`
    },
    {
      id: "event",
      title: "Event/Party Approach",
      scenario: "Casual setting, noticing athletic gear",
      script: `That's a great [watch/shirt/piece of gear]! Are you into [running/cycling/fitness] by any chance? I'm [Your Name]. 

I meet a lot of people who are passionate about pushing their limits, and I'm really excited about a new way to help them do that. What's one area of your fitness you're really focused on improving this year?`
    }
  ],

  discoveryQuestions: [
    { id: "fitness-journey", category: "opening", question: "Tell me a little about your current fitness journey. What are you most passionate about when it comes to your physical performance?" },
    { id: "peak-performance", category: "opening", question: "What does 'peak performance' mean to you in your [sport/activity]?" },
    { id: "biggest-goals", category: "opening", question: "What are some of your biggest goals you're working towards right now in your training?" },
    { id: "challenges", category: "pain_point", question: "What are some of the challenges or frustrations you've encountered when trying to reach those goals?" },
    { id: "plateau", category: "pain_point", question: "Have you ever felt like you've hit a plateau in your training, where progress seems to slow down?" },
    { id: "recovery", category: "pain_point", question: "How quickly do you typically recover after an intense workout or competition? Is there anything you wish was faster?" },
    { id: "impact", category: "impact", question: "When you experience [pain point, e.g., slow recovery], how does that impact your next training session or overall motivation?" },
    { id: "cost-not-achieving", category: "impact", question: "What's the cost of *not* achieving those performance goals you mentioned? How does that make you feel?" },
    { id: "magic-wand", category: "solution", question: "If you could wave a magic wand and instantly improve one aspect of your athletic performance, what would it be?" },
    { id: "tried-past", category: "solution", question: "What kind of solutions have you tried in the past to address these challenges, and what were your experiences with them?" }
  ],

  productPresentation: {
    problem: `A lot of dedicated athletes and fitness enthusiasts I talk to share similar frustrations. They're pushing hard, putting in the hours, but they often hit plateaus, feel like their recovery is too slow, or just wish they had that extra burst of strength or stamina when it really counts. It's incredibly frustrating to know you have more in you, but your body just isn't quite keeping up, isn't it? It can feel like you're leaving potential on the table, missing out on those personal bests you're working so hard for.`,
    
    agitate: `Think about what that means: missed PRs, slower recovery keeping you from training consistently, and that nagging feeling that you could be performing better. Traditional supplements might help a bit, but they come with concerns about what you're putting in your body, and they don't always deliver the breakthrough results you're looking for.`,
    
    solve: `That's exactly why I'm so excited about the Super Patch Victory. Imagine being able to unlock more of your body's *own* natural power. Victory isn't a drug or a supplement; it uses something called Vibrotactile Technology – specialized patterns that simply interact with your skin. This interaction gently signals your body to optimize its neural responses, helping you naturally enhance your strength, boost your endurance, and improve your agility.

It's 100% drug-free, all-natural, and completely non-invasive. So instead of feeling held back, you're experiencing faster recovery, more explosive power, and the stamina to go stronger for longer. It's about giving your body the subtle nudge it needs to perform at its absolute best, consistently smashing your personal bests.`
  },

  objections: [
    {
      id: "too-expensive",
      objection: "It's too expensive.",
      response: "I understand that cost is an important factor when you're investing in your health and performance, and you want to ensure you're getting true value. What other criteria are most important for you when deciding on a solution that helps you reach your fitness goals?",
      psychology: "Validates concern, shifts to value criteria"
    },
    {
      id: "think-about-it",
      objection: "I need to think about it.",
      response: "I understand this is a significant decision for your health and performance, and you want to ensure it's the right fit. What specific questions or considerations are on your mind that would be most helpful for you to think through?",
      psychology: "Surfaces specific concerns"
    },
    {
      id: "talk-to-spouse",
      objection: "I need to talk to my spouse.",
      response: "I understand this is an important decision for your well-being, and you want to get everyone involved. What specific questions or concerns do you anticipate your spouse might have that we could address together now?",
      psychology: "Prepares for partner conversation"
    },
    {
      id: "does-it-work",
      objection: "Does it really work? It sounds too good to be true.",
      response: "I completely understand why you might be skeptical about new technologies, and it's important to feel confident in your choices. What would you need to see, hear, or experience to truly feel that this is a credible solution for you?",
      psychology: "Empowers them to define proof"
    },
    {
      id: "tried-before",
      objection: "I've tried patches/products before and they didn't work.",
      response: "I understand you've had experiences with other products in the past, and it's frustrating when they don't deliver. What specifically about those past experiences left you feeling disappointed, and what kind of results were you hoping for?",
      psychology: "Gathers differentiation info"
    },
    {
      id: "not-interested",
      objection: "I'm not interested.",
      response: "I understand you might not be actively looking for new solutions right now, and that's perfectly fine. Could you share what led you to that conclusion, or what aspects of your current routine are working really well for you?",
      psychology: "Probes for underlying reasons"
    },
    {
      id: "no-time",
      objection: "I don't have time.",
      response: "I understand your schedule is packed, and you're busy with your training and other commitments. What part of your routine or day feels most constrained right now, and what kind of time commitment are you thinking this might require?",
      psychology: "Positions Victory as time-efficient"
    },
    {
      id: "competitor",
      objection: "How is this different from [other supplements/patches]?",
      response: "I understand you're curious about how Victory stands out. Victory uses Vibrotactile Technology – it's not delivering any substance into your body. It works with your skin's mechanoreceptors to optimize your body's own neural responses. What aspects of other approaches are you most familiar with?",
      psychology: "Differentiates on mechanism"
    }
  ],

  closingScripts: [
    {
      id: "assumptive",
      title: "The Assumptive Close",
      type: "assumptive",
      script: "Great! So, based on what we've discussed, it sounds like the Victory patch is exactly what you need to boost your endurance and smash those personal bests. Shall we get you started with the 30-day performance pack today?"
    },
    {
      id: "alternative",
      title: "The Alternative Close",
      type: "alternative",
      script: "Considering your goals to improve both strength and agility, would you prefer to start with the single pack to try it out, or go with the triple pack for a full two-month supply and better value?"
    },
    {
      id: "urgency",
      title: "The Urgency Close",
      type: "urgency",
      script: "This week, we have a special promotion where new customers receive a bonus recovery guide with their first order, which is perfect for pairing with Victory. This offer wraps up on Friday. Does getting started by then work for you?"
    },
    {
      id: "summary",
      title: "The Summary Close",
      type: "summary",
      script: "So, we've talked about how Victory can help you overcome those plateaus, significantly improve your recovery, and give you that extra edge in strength and agility – all naturally and drug-free. Considering all these benefits, are you ready to experience the difference?"
    },
    {
      id: "benefit",
      title: "The Benefit Close",
      type: "assumptive",
      script: "Imagine hitting your next personal best in just a few weeks, feeling stronger and recovering faster. If starting today means you're on track to achieve that, does it make sense to move forward?"
    }
  ],

  followUpSequence: [
    {
      day: "Day 1",
      title: "After Initial Meeting",
      voicemail: "Hi [Prospect's Name], just wanted to say thank you again for your time today. I really enjoyed learning about your fitness goals. I'm confident Victory can make a real difference for you. If any questions popped up after our chat, please don't hesitate to reach out.",
      text: "Hi [Prospect's Name], thanks again for your time today! Really enjoyed our chat about your goals for [strength/endurance/agility]. Here's a quick link to a success story from an athlete similar to you who crushed their goals with Victory: [Link]. Let me know if you have any questions!"
    },
    {
      day: "Day 3",
      title: "Value-add Nudge",
      voicemail: "Hey [Prospect's Name], just checking in. I was thinking about your desire to [specific goal] and wanted to share a quick thought – imagine how much more consistent your training could be with faster recovery.",
      text: "Morning [Prospect's Name]! Hope your week's going well. Just a quick thought: many athletes find that the improved endurance from Victory helps them power through those challenging mid-week workouts. Still pondering? Happy to answer any questions! 😊"
    },
    {
      day: "Day 7",
      title: "Social Proof",
      voicemail: "Hi [Prospect's Name], it's [Your Name]. Just wanted to share a quick testimonial from a Victory user who said 'I broke my personal best by 15% after just 2 weeks!' People are truly seeing incredible results.",
      text: "Hey [Prospect's Name]! Quick thought for your weekend training: 'I broke my personal best by 15% after just 2 weeks!' - That's what one athlete said about Victory. Ready to see what it can do for you?"
    },
    {
      day: "Day 14",
      title: "Re-engage",
      voicemail: "Hi [Prospect's Name], checking in one last time on the Victory patch. My goal is to help you smash your personal bests, and I truly believe this is the tool to do it. If now isn't the right time, that's okay, but if you're still thinking about those goals, let's reconnect.",
      text: "Hey [Prospect's Name], it's [Your Name]. Just circling back on the Victory patch. How are your [strength/endurance/agility] goals progressing? If you're still looking for that extra edge, I'm here to help you get started."
    }
  ],

  testimonialPrompts: [
    { id: "before-frustration", question: "Before using Victory, what was your biggest frustration or challenge with your athletic performance or recovery?" },
    { id: "impact-training", question: "How did those challenges make you feel, or what impact did they have on your training/competitions?" },
    { id: "specific-benefits", question: "What specific benefits have you experienced since you started using the Victory patch?" },
    { id: "aha-moment", question: "Can you share a specific 'aha!' moment where you noticed Victory making a significant difference? (e.g., 'I lifted X more,' 'I recovered in Y less time')" },
    { id: "vs-others", question: "What do you like most about the Victory patch compared to other solutions you might have tried?" },
    { id: "recommend", question: "Who would you recommend the Victory patch to, and why?" },
    { id: "tell-skeptic", question: "If you were talking to someone who's skeptical, what would you tell them about your experience?" }
  ],

  quickReference: {
    keyBenefits: [
      "Enhanced Strength: Lift heavier, push harder",
      "Improved Endurance: Go longer, without fatigue",
      "Better Agility: Faster, more responsive movements"
    ],
    bestQuestions: [
      "What are some of the biggest challenges you've encountered when trying to reach your fitness goals?",
      "If you could instantly improve one aspect of your athletic performance, what would it be?",
      "What solutions have you tried in the past, and what were your experiences?"
    ],
    topObjections: [
      { objection: "Too expensive", response: "What other criteria are most important for you when deciding on a fitness solution?" },
      { objection: "Need to think about it", response: "What specific questions or considerations are on your mind?" },
      { objection: "Does it really work?", response: "What would you need to see, hear, or experience to feel confident?" }
    ],
    bestClosingLines: [
      "It sounds like Victory is exactly what you need. Shall we get you started with the 30-day performance pack today?",
      "If starting today means you're on track to achieve your goals, does it make sense to move forward?"
    ]
  }
};





