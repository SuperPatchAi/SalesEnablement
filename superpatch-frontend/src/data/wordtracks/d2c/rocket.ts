import { WordTrack } from "@/types/wordtrack";

export const rocketD2CWordTrack: WordTrack = {
  id: "d2c-rocket",
  productId: "rocket",
  marketId: "d2c",
  productOverview: `<p>The <strong>Super Patch Rocket</strong> is a revolutionary wellness solution specifically designed for men seeking to enhance their inner energy and overall well-being.</p>
<p>Utilizing our proprietary <strong>Vibrotactile Technology (VTT)</strong>, Rocket interacts with the skin's mechanoreceptors through specialized ridge patterns, gently stimulating the body's natural neural responses.</p>
<p>Rocket is for men who are looking to reclaim their vitality, boost their energy levels, and improve their general sense of well-being. Whether it's to power through a busy day, reignite passion, or simply feel more like their best self, Rocket offers a natural, non-invasive path to enhanced performance and confidence.</p>
<p>What makes Rocket truly unique is its 100% drug-free, all-natural, and non-invasive approach. Unlike pills, injections, or synthetic supplements, Rocket works <em>with</em> your body, leveraging its innate capabilities without introducing any chemicals or foreign substances.</p>`,
  
  idealCustomerProfile: {
    demographics: "Age 35-65+ years old, middle to upper-middle class with disposable income for health and wellness products. Married, single, or divorced; often has family responsibilities. Professionals, business owners, active retirees, those with demanding jobs or lifestyles.",
    psychographics: "Health-conscious, proactive about well-being, values natural solutions, wants to maintain youthful vigor, believes in self-improvement. Active or aspiring to be active, busy, potentially stressed. Open to innovative wellness technologies, but values proven results. Skeptical of 'quick fixes' but drawn to natural, non-invasive methods.",
    painPoints: [
      "Feeling tired even after a full night's sleep, struggling to get through the day",
      "Feeling less enthusiastic about activities they once enjoyed, 'stuck in a rut'",
      "Not feeling as 'sharp' or 'on' as they used to, perceived dip in overall male performance",
      "Difficulty concentrating, feeling overwhelmed, impacting productivity",
      "Worries about natural decline in energy, stamina, and vitality with aging",
      "Unhappy with side effects, inconvenience, or ineffectiveness of existing solutions"
    ],
    previousSolutions: [
      "Energy drinks, coffee, excessive caffeine",
      "Over-the-counter vitamins and general supplements",
      "'Male enhancement' pills or supplements from various brands",
      "Dietary changes, increased exercise (sometimes without desired results)",
      "Lifestyle adjustments to reduce stress"
    ]
  },

  openingScripts: [
    {
      title: "Cold Approach (Stranger)",
      scenario: "Noticing something positive about someone",
      content: `"Hi there! I couldn't help but notice [something specific and positive about them – e.g., 'your fantastic energy,' 'that cool shirt,' 'how focused you look']. My name is [Your Name], just wanted to say hello! How's your day going so far?"`
    },
    {
      title: "Warm Introduction (Friend/Family)",
      scenario: "Reaching out to someone you know",
      content: `"Hey [Friend/Family Name]! So good to see you/connect with you. I was just thinking about you and wanted to check in. How have things been lately? You know, I've been really excited about something new I'm involved with that's been making a huge difference for people, and I immediately thought of you. But honestly, I just wanted to see how you're doing first."`
    },
    {
      title: "Social Media DM",
      scenario: "Connecting via direct message",
      content: `"Hey [Their Name]! I've been following your posts about [fitness/entrepreneurship/etc.] for a while, and I really admire your dedication/positive outlook. I was actually wondering, have you ever looked into natural ways to boost your overall energy and vitality, especially with such an active lifestyle? No pressure at all, just thought it might resonate given what you share!"`
    },
    {
      title: "Referral Introduction",
      scenario: "When referred by a mutual contact",
      content: `"Hi [Their Name], my name is [Your Name]. [Referral Name] suggested I reach out to you, and they spoke so highly of you! They mentioned you're someone who really values staying active and optimizing your health. I help people like you discover innovative, natural ways to enhance their energy and well-being, and [Referral Name] thought you might be interested in learning more. Would you be open to a brief chat sometime this week?"`
    },
    {
      title: "Event/Party Approach",
      scenario: "At a social gathering",
      content: `"Hey, I'm [Your Name]! What a great event/party this is, isn't it? Are you enjoying yourself? [Listen and respond]. You know, I often meet people at events like these who are really driven and active. I'm curious, what do you do to keep your energy levels up and stay on top of your game?"`
    }
  ],

  discoveryQuestions: [
    { question: "What does 'feeling your best' look like for you right now?", category: "opening" },
    { question: "When you think about your energy levels throughout the day, how would you describe them on a scale of 1 to 10?", category: "opening" },
    { question: "What are some of the biggest challenges you face when it comes to maintaining your energy and vitality?", category: "pain" },
    { question: "How does feeling tired/low energy/less vital impact your daily life, your work, or even your hobbies?", category: "pain" },
    { question: "Have you noticed any changes in your overall drive or enthusiasm recently?", category: "pain" },
    { question: "If you could significantly boost your energy and vitality, how do you imagine that would change your day-to-day experience?", category: "impact" },
    { question: "What opportunities or activities do you feel you might be missing out on because of your current energy levels?", category: "impact" },
    { question: "How important is it for you to find a natural, non-invasive way to support your well-being?", category: "impact" },
    { question: "What have you tried in the past to address these challenges, and what were your experiences with those solutions?", category: "solution" },
    { question: "If you were to find an ideal solution, what would be the most important outcomes or benefits you'd be looking for?", category: "solution" }
  ],

  productPresentation: `<p><strong>[Problem]</strong> "You know, a lot of men I talk to, especially those who are driven and want to stay at the top of their game, often tell me they struggle with a few common things. They feel that afternoon slump, a general lack of energy that makes it hard to stay focused, or maybe they just don't feel that same spark of vitality they once had."</p>

<p><strong>[Agitate]</strong> "It's frustrating when you want to be fully present for your family, excel at work, or simply enjoy your passions, but your body isn't quite keeping up. You end up feeling drained, less motivated, and like you're missing out on living life to its fullest."</p>

<p><strong>[Solve]</strong> "That's exactly why I'm so excited about the <strong>Super Patch Rocket</strong>. Imagine a completely natural, drug-free way to tap into your body's own power to enhance your vitality, boost your energy, and elevate your overall well-being. Rocket uses our unique Vibrotactile Technology – it's a small patch with specialized patterns that gently interact with your skin to trigger your body's natural neural responses. It's like a silent, supportive signal to your system. With Rocket, men are reporting feeling more energized, mentally clearer, and experiencing a renewed sense of drive and confidence. It's non-invasive, incredibly easy to use, and works with your body, not against it. So instead of just getting by, you can start thriving and feeling like the best version of yourself again."</p>`,

  objectionHandling: [
    {
      objection: "It's too expensive",
      response: "I understand that money is an important factor when you're considering new wellness solutions. What other criteria will be used in taking this decision, beyond just the initial cost?",
      psychology: "Validates concern, opens discussion about total value and decision factors."
    },
    {
      objection: "I need to think about it",
      response: "I understand this is a significant decision for your health and well-being, and you want to ensure it's the right fit. What specific questions or considerations are on your mind as you think it over?",
      psychology: "Acknowledges need for reflection, uncovers specific concerns."
    },
    {
      objection: "I need to talk to my spouse",
      response: "I understand this is an important decision, and you want to get everyone involved. What specific aspects about Rocket do you think your spouse would be most interested in discussing, or what concerns might they have?",
      psychology: "Respects partnership, helps prepare key talking points."
    },
    {
      objection: "Does it really work? It sounds too good to be true",
      response: "I completely understand why you might be skeptical about new technologies, and it's important to feel confident in your choices. What would you need to see, hear, or experience to truly feel that this is a credible solution for you?",
      psychology: "Validates skepticism, opens door to providing specific evidence."
    },
    {
      objection: "I've tried patches/products before, and they didn't work",
      response: "I understand you've had experiences with other products in the past that didn't deliver the results you hoped for, and that can be frustrating. What specifically didn't you like or what was missing from those other solutions you tried?",
      psychology: "Shows empathy, gathers info to differentiate Rocket."
    },
    {
      objection: "I'm not interested",
      response: "I understand that you might not be looking for something new right now, and that's perfectly fine. Could you share what led you to that conclusion, or what aspects of your current well-being you feel are already perfectly managed?",
      psychology: "Respects position, gently probes for underlying concerns."
    },
    {
      objection: "I don't have time",
      response: "I understand that you have a busy schedule, and time is incredibly valuable. What's currently taking up most of your time, and what would it mean for you if you had more consistent energy to tackle everything on your plate?",
      psychology: "Acknowledges busy life, reframes energy as a time-multiplier."
    },
    {
      objection: "How is this different from [competitor]?",
      response: "I understand you're looking for clarity on how Rocket stands out, and it's smart to compare options. What have you learned or experienced about [competitor] that you found appealing or noteworthy?",
      psychology: "Shows respect for research, gathers positioning intel."
    }
  ],

  closingScripts: [
    {
      title: "The Assumptive Close",
      content: `"Great! Since Rocket aligns perfectly with your goal of boosting your energy and feeling more vital, we can get you started right away. Which pack would you prefer, the 30-day supply or the 90-day value pack?"`
    },
    {
      title: "The Alternative Close",
      content: `"So, based on what we've discussed, it sounds like Rocket is exactly what you need to boost your energy and vitality. Would you like to start with the foundational 30-day program to experience the benefits, or jump straight to the 90-day pack for the best value and sustained results?"`
    },
    {
      title: "The Urgency Close",
      content: `"This week, we actually have a special promotion where you get [bonus/discount] when you start with Rocket today. This offer ends [Date/Time], and it's a fantastic opportunity to experience these benefits while saving some money. Shall we go ahead and secure that for you now?"`
    },
    {
      title: "The Summary Close",
      content: `"Alright, so we've talked about how Rocket can help you overcome low energy and boost your vitality, address that afternoon slump, and all through a natural, non-invasive technology. You mentioned how important it is for you to feel more energized and confident. Given all that, are you ready to start feeling more energized and vital with Rocket?"`
    },
    {
      title: "The Referral Close",
      scenario: "After the sale is closed",
      content: `"Congratulations on making this investment in your well-being! I'm genuinely excited for you to experience the Rocket difference. As you start feeling these amazing benefits, who else do you know – perhaps a friend, family member, or colleague – who could also benefit from enhanced energy and vitality?"`
    }
  ],

  followUpSequences: [
    {
      day: "Day 1",
      title: "Post-Purchase/Initial Interest",
      voicemail: `"Hi [Name], this is [Your Name] from Super Patch. Just wanted to say thank you again for your interest/order in Rocket! I'm really excited for you to experience the benefits. I've sent you a quick email with some helpful tips to get started. If you have any questions at all, please don't hesitate to call or text me back. Have a fantastic day!"`,
      text: `"Hey [Name]! Thanks for connecting/your order. Just sent you an email with some quick tips for Rocket. Let me know if you have any Qs! 😊"`
    },
    {
      day: "Day 3",
      title: "First Check-in",
      voicemail: `"Hi [Name], it's [Your Name] again. Just wanted to do a quick check-in to see how you're doing with your Rocket patches/what your initial thoughts are. Many people start noticing subtle shifts around now. No need to call back if everything's great, but if anything's on your mind, I'm here to help!"`,
      text: `"Hey [Name]! Quick check-in – how are things going with your Rocket patches so far? Any initial thoughts or Qs? Hope you're feeling great!"`
    },
    {
      day: "Day 7",
      title: "Deeper Check-in",
      voicemail: `"Hi [Name], [Your Name] here. Hope you've been having a great week! By now, many Rocket users are really starting to feel that boost in energy and vitality. How are you experiencing the difference? I'd love to hear about any specific changes you've noticed. Feel free to reply to my text or give me a call!"`,
      text: `"Hey [Name]! Happy to check in again. How's Rocket treating you this week? Are you feeling that enhanced energy and vitality we talked about? I'd love to hear your personal experience!"`
    },
    {
      day: "Day 14",
      title: "Results Check & Referral Opportunity",
      voicemail: `"Hi [Name], [Your Name] here. Just following up to see how Rocket has continued to support your energy and well-being over the past two weeks. Most of my customers are experiencing significant improvements by now. If you're loving the results, I'd be grateful if you'd consider sharing your experience with others who might benefit. Give me a call if you have a moment!"`,
      text: `"Hey [Name]! Two weeks in with Rocket! How are you feeling now? If you're loving the boost in energy & vitality, who else do you know that might benefit? I'd love to help them too! 😊"`
    }
  ],

  quickReference: {
    keyBenefits: [
      "Enhanced Male Vitality: Feel more vibrant and 'on' your game",
      "Increased Energy Levels: Conquer your day without the slump",
      "Overall Well-being: Support your body's natural balance, drug-free"
    ],
    bestQuestions: [
      "What does 'feeling your best' look like for you right now?",
      "What are some of the biggest challenges you face with your energy and vitality?",
      "What have you tried in the past, and what were your experiences?"
    ],
    topObjections: [
      { objection: "Too expensive", shortResponse: "What other criteria are key for this decision?" },
      { objection: "Need to think", shortResponse: "What specific questions are on your mind?" },
      { objection: "Does it work?", shortResponse: "What would you need to see or experience to feel confident?" }
    ],
    bestClosingLines: [
      "Since Rocket aligns perfectly with your goal of boosting your energy, shall we get you started with the 30-day supply?",
      "Given all we've discussed, are you ready to start feeling more energized and vital with Rocket?"
    ]
  }
};





