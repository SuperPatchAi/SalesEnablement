import { WordTrack } from "@/types/wordtrack";

export const kickItD2CWordTrack: WordTrack = {
  id: "d2c-kick-it",
  productId: "kick-it",
  marketId: "d2c",
  productOverview: `<p>The Super Patch <strong>Kick It</strong> is an innovative wellness product designed to support your willpower and help you overcome challenging bad habits. Whether it's the struggle to quit smoking, control overeating, or break other ingrained patterns, Kick It offers a unique, drug-free approach to enhance your self-control.</p>
<p>What makes Kick It truly unique is its foundation in <strong>Vibrotactile Technology (VTT)</strong>. These specialized ridge patterns on the patch interact directly with your skin's mechanoreceptors, sending signals that trigger your body's own natural neural responses. This revolutionary, non-invasive technology works with your body to provide the support you need, making Kick It a 100% drug-free and all-natural solution.</p>
<p>It's for anyone determined to break free from unwanted habits and reclaim their inner strength and discipline.</p>`,
  
  idealCustomerProfile: {
    demographics: "Primarily age 25-65, as this demographic often experiences the most significant challenges with habit formation and cessation. Mid-to-upper income, willing to invest in their health and personal development.",
    psychographics: "Deep desire for self-improvement, better health, increased self-control, freedom from dependence, and a sense of accomplishment. May feel frustration, guilt, shame, helplessness, or lack of control over certain behaviors. Values health, discipline, personal freedom, and long-term well-being.",
    painPoints: [
      "Intense, frequent cravings that lead to relapse",
      "Feeling like willpower isn't strong enough to resist temptations",
      "Having tried to quit or change habits multiple times without lasting success",
      "Experiencing physical or mental health consequences of habits",
      "The monetary cost associated with maintaining bad habits",
      "Feeling embarrassed or judged by others due to habits",
      "Diminished sense of self-worth due to perceived lack of control"
    ],
    previousSolutions: [
      "Nicotine patches, gum, vaping, cold turkey, prescription medications",
      "Numerous diets, meal plans, appetite suppressants, weight loss programs",
      "Therapy, meditation, mindfulness, accountability partners",
      "Relying purely on 'willpower' or 'motivation' that eventually wanes"
    ]
  },

  openingScripts: [
    {
      title: "Cold Approach (Stranger)",
      scenario: "Meeting someone new",
      content: `"Hi there! I couldn't help but notice [something positive about them - e.g., your amazing energy, that cool keychain, your focus]. My name is [Your Name], it's a pleasure to meet you. I actually help people boost their natural willpower to overcome things like cravings and bad habits, and you just seem like someone who's really intentional about their well-being. What brings you out today?"`
    },
    {
      title: "Warm Introduction (Friend/Family)",
      scenario: "Reaching out to someone you know",
      content: `"Hey [Friend's Name]! How have you been? You know how much I care about your well-being, and I've been thinking about you lately because I've started working with something truly incredible that I think could really help you with [mention a known struggle or just 'achieve some of those goals we talked about']. It's called Kick It, and it's all about naturally supporting your willpower. I'd love to tell you a bit more when you have a moment, no pressure at all."`
    },
    {
      title: "Social Media DM",
      scenario: "Connecting via direct message",
      content: `"Hi [Name], I've been following your journey on [Platform] and I really admire your [dedication to fitness/positive mindset/desire for self-improvement]. I help people like you discover a natural way to enhance their willpower and break free from challenging habits. I thought you might find this interesting given your [specific interest/post]. Would you be open to learning about a drug-free patch that could support your goals?"`
    },
    {
      title: "Referral Introduction",
      scenario: "When referred by a mutual contact",
      content: `"Hi [Prospect's Name], my name is [Your Name], and [Referral's Name] suggested I reach out to you. They mentioned you might be interested in a natural way to boost your willpower and tackle some of those persistent habits you've been working on. [Referral's Name] spoke very highly of you and thought you'd appreciate learning about a unique, drug-free solution called Kick It. Would you be open to a quick chat sometime this week?"`
    },
    {
      title: "Event/Party Approach",
      scenario: "At a social gathering",
      content: `"What a great event, isn't it? My name is [Your Name]. I'm curious, what's been the most interesting thing you've come across or learned tonight? [Listen and connect]. You know, I actually spend my time helping people naturally strengthen their willpower to overcome bad habits. It's fascinating how our bodies can be supported in such a simple, drug-free way. Have you ever thought about how much easier life would be with a little more natural self-control?"`
    }
  ],

  discoveryQuestions: [
    { question: "What's currently top of mind for you when it comes to your health and well-being?", category: "opening" },
    { question: "If you could wave a magic wand and instantly change one thing about your daily routine or a habit, what would it be?", category: "opening" },
    { question: "Can you tell me a bit about what challenges you've faced when trying to quit smoking/control eating/break that habit in the past?", category: "pain" },
    { question: "How often do you find yourself wishing you had more control over that specific habit?", category: "pain" },
    { question: "What does it feel like when you give in to a craving or break a commitment to yourself?", category: "pain" },
    { question: "How has this habit impacted your energy, your mood, or even your relationships?", category: "impact" },
    { question: "If you were able to successfully overcome this habit, what would that mean for your daily life and your long-term goals?", category: "impact" },
    { question: "What's the biggest cost – emotional, physical, or financial – that this habit has had on you?", category: "impact" },
    { question: "What have you tried so far to address this, and what were your experiences with those methods?", category: "solution" },
    { question: "What would be your ideal outcome or the most important thing for you in a solution that could help you gain more self-control?", category: "solution" }
  ],

  productPresentation: `<p><strong>[Problem]</strong> "We all know how frustrating it can be to try and break a bad habit. You set a goal, you're motivated, but then those intense cravings hit, or stress builds up, and suddenly, you're right back where you started. It feels like a constant battle against your own willpower, doesn't it? And every time you try and fail, it chips away at your confidence."</p>

<p><strong>[Agitate]</strong> "Think about the cycle: the guilt, the disappointment, the health consequences, the money spent on things you're trying to quit. It's exhausting, and it makes you question if you'll ever truly gain control. Many people feel like they're just not strong enough, or that they're destined to struggle with these patterns forever. It's not just about the habit itself, it's about the feeling of losing control over your own choices."</p>

<p><strong>[Solve]</strong> "That's exactly why I'm so excited about the Super Patch <strong>Kick It</strong>. Imagine having natural, consistent support for your willpower, without any drugs or invasive procedures. Kick It uses groundbreaking Vibrotactile Technology – specialized patterns on a small patch that communicate with your body's nervous system, triggering your own natural responses to enhance self-control and reduce cravings. It's 100% drug-free, all-natural, and incredibly simple to use. With Kick It, you're not fighting a battle alone; you're empowering your body to naturally support your journey to break free from habits like smoking, overeating, or anything else holding you back."</p>`,

  objectionHandling: [
    {
      objection: "It's too expensive",
      response: "I understand that money is an important factor when you're considering a new wellness solution, and you want to make a smart investment. What other criteria are most important for you in making this decision, beyond just the initial cost?",
      psychology: "Validates the concern, opens discussion about total value."
    },
    {
      objection: "I need to think about it",
      response: "I understand this is a significant decision for your health and well-being, and you want to ensure it's the right fit for your lifestyle. What specific questions or considerations would be most helpful for you to think through as you evaluate the Kick It Super Patch?",
      psychology: "Acknowledges need for reflection, uncovers specific concerns."
    },
    {
      objection: "I need to talk to my spouse",
      response: "I understand this is an important decision, and you want to get everyone involved, especially your spouse. What specific questions or concerns do you anticipate they might have, or what information would be most helpful for them to understand about the Kick It patch?",
      psychology: "Respects the partnership, helps prepare key talking points."
    },
    {
      objection: "Does it really work?",
      response: "I completely understand why you might be skeptical about new technologies, and it's important to feel confident in your choices. What would you need to see, hear, or experience to truly feel that this is a credible solution for you to support your willpower?",
      psychology: "Validates skepticism, opens door to providing proof points."
    },
    {
      objection: "I've tried patches/products before",
      response: "I understand you've had experiences with other products in the past, and it's natural to feel a bit hesitant if they didn't deliver. Can you tell me what you liked or disliked about those experiences, and what you felt was missing from them?",
      psychology: "Shows empathy, gathers info to differentiate."
    },
    {
      objection: "I'm not interested",
      response: "I understand you might not be looking for something new right now, and that's perfectly fine. Could you share what makes you say you're not interested at this moment? Is it the idea of habit breaking, or perhaps the technology itself?",
      psychology: "Respects position, gently probes for underlying concerns."
    },
    {
      objection: "I don't have time",
      response: "I understand you have a very busy schedule, and time is a precious commodity. What are your biggest priorities right now when it comes to your personal health and well-being, and how does overcoming this habit fit into those priorities?",
      psychology: "Acknowledges busy life, reconnects to their stated goals."
    },
    {
      objection: "How is this different from [competitor]?",
      response: "That's a great question, and I understand why you'd want to compare. What have you heard or experienced about [competitor], and what are you hoping for in a solution that makes it stand out for you?",
      psychology: "Shows respect for research, gathers positioning intel."
    }
  ],

  closingScripts: [
    {
      title: "The Assumptive Close",
      content: `"Fantastic! So, based on everything we've discussed and your goal to finally quit smoking/break that habit, it sounds like Kick It is exactly what you need. Which package makes the most sense for you to get started today?"`
    },
    {
      title: "The Alternative Close",
      content: `"Given your desire to overcome this habit and the benefits Kick It offers, would you prefer to start with our 30-day supply to try it out, or our 90-day package for the best value and sustained support?"`
    },
    {
      title: "The Urgency Close",
      content: `"Knowing how much you want to break free from this habit, and considering we have a special promotion ending this week that includes [specific bonus/discount], what's the best way to get this ordered for you so you can start seeing results as soon as possible?"`
    },
    {
      title: "The Summary Close",
      content: `"So, just to recap, with Kick It, you'll be getting natural willpower support, a drug-free way to reduce cravings, and a simple, non-invasive method to finally take control of your habits. This means more confidence, better health, and true freedom. Doesn't that sound like exactly what you're looking for? Are you ready to get started?"`
    },
    {
      title: "The Referral Close",
      scenario: "After they commit",
      content: `"That's wonderful, I'm so excited for you to experience the difference Kick It can make! As you start your journey, who else do you know who might be struggling with a habit like smoking or overeating, or could benefit from natural willpower support? I'd love to help them too."`
    }
  ],

  followUpSequences: [
    {
      day: "Day 1",
      title: "Post-Meeting Follow-Up",
      text: `"Hi [Prospect's Name], it was great connecting today! I enjoyed learning about your goals with [specific habit]. As promised, here's the link to learn more about Kick It: [Link]. Let me know if any questions pop up!"`,
      voicemail: `"Hi [Prospect's Name], this is [Your Name] from Super Patch. I'm calling because I truly believe the Kick It patch could be a game-changer for you in [mention specific habit]. I know you're busy, so I'll keep this brief, but I wanted to follow up on our conversation about how it naturally supports willpower. Please give me a call back at [Your Phone Number] when you have a moment."`
    },
    {
      day: "Day 3",
      title: "Value-Add Follow-Up",
      text: `"Hey [Prospect's Name], just checking in! Thought you might find this interesting: [Link to relevant article/testimonial]. Many people find it helpful when considering natural solutions like Kick It. How are things going on your end?"`
    },
    {
      day: "Day 7",
      title: "Benefit-Focused Follow-Up",
      text: `"Hi [Prospect's Name], hope you're having a good week! I was thinking about our conversation about Kick It and how it could help you overcome [specific habit]. Imagine feeling that sense of control. Are you still exploring options, or did you have any further questions for me?"`
    },
    {
      day: "Day 14",
      title: "Final Outreach",
      text: `"Hi [Prospect's Name], it's [Your Name] again. Just wanted to offer one last piece of help regarding Kick It. I truly believe it can make a difference for you. If you're still looking for a natural, drug-free way to support your willpower, let's connect for 5 minutes. What's the best time for a quick chat today or tomorrow?"`
    }
  ],

  quickReference: {
    keyBenefits: [
      "Natural Willpower Support: Enhances your body's own ability to resist cravings",
      "Drug-Free & Non-Invasive: A safe, all-natural solution without chemicals",
      "Breaks Bad Habits: Effectively supports overcoming smoking, overeating, and more"
    ],
    bestQuestions: [
      "If you could wave a magic wand and instantly change one thing about a habit, what would it be?",
      "What does it feel like when you give in to a craving or break a commitment to yourself?",
      "What would be your ideal outcome in a solution that could help you gain more self-control?"
    ],
    topObjections: [
      { objection: "Too Expensive", shortResponse: "What other criteria are most important for you in making this decision, beyond just the initial cost?" },
      { objection: "Does it really work?", shortResponse: "What would you need to see, hear, or experience to truly feel that this is a credible solution for you?" },
      { objection: "I've tried products before", shortResponse: "What did you like or dislike about those, and what did you feel was missing?" }
    ],
    bestClosingLines: [
      "Based on everything we've discussed, it sounds like Kick It is exactly what you need. Which package makes the most sense for you to get started today?",
      "Would you prefer to start with our 30-day supply, or our 90-day package for the best value?"
    ]
  }
};

