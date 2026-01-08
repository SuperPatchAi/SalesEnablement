import { WordTrack } from "@/types/wordtrack";

export const defendD2CWordTrack: WordTrack = {
  id: "d2c-defend",
  productId: "defend",
  marketId: "d2c",
  productOverview: `<p><strong>Defend</strong> is your daily ally in supporting a robust immune system and promoting overall wellness. In a world where maintaining health is paramount, Defend offers a convenient, innovative, and natural way to help your body stay resilient.</p>
<p>What makes Defend truly unique is its foundation in <strong>Vibrotactile Technology (VTT)</strong>. Unlike traditional supplements that you ingest, Defend utilizes specialized ridge patterns on the patch that interact with your skin's mechanoreceptors. This interaction triggers your body's own neural responses, providing targeted support without drugs or chemicals.</p>
<p>It's 100% drug-free, all-natural, non-invasive, and incredibly easy to incorporate into any health and wellness routine.</p>`,
  
  idealCustomerProfile: {
    demographics: "Age 25-65+, mid to upper-middle class, health-conscious individuals with active lifestyles, parents, professionals in public-facing roles, or seniors looking to maintain vitality.",
    psychographics: "Values health and wellness, seeks natural and non-invasive solutions, values convenience, open to innovative technologies, desires peace of mind regarding their health. Proactive rather than reactive about health.",
    painPoints: [
      "Prone to catching colds, flu, or feeling run down during seasonal changes",
      "Low energy and fatigue from immune system working overtime",
      "Recognizes that stress compromises their immune system",
      "Tired of taking multiple pills or unpleasant liquid supplements",
      "Concerned about synthetic ingredients or side effects",
      "Worried about their own or family's susceptibility to illness"
    ],
    previousSolutions: [
      "Daily vitamin regimens (Vitamin C, D, Zinc)",
      "Herbal supplements (Elderberry, Echinacea)",
      "Probiotics for gut health",
      "Lifestyle adjustments (diet, exercise, sleep hygiene)",
      "Over-the-counter cold and flu remedies"
    ]
  },

  openingScripts: [
    {
      title: "Cold Approach (Stranger)",
      scenario: "Meeting someone new in a casual setting",
      content: `"Hi there! I couldn't help but notice [something positive about them - e.g., your vibrant energy, that cool item you're wearing]. I'm [Your Name], it's a pleasure to meet you. I help people discover natural ways to boost their wellness, and your energy just made me think of it. How's your day going so far?"`
    },
    {
      title: "Warm Introduction (Friend/Family)",
      scenario: "Reaching out to someone you know",
      content: `"Hey [Friend's Name]! It's so good to see you. I was just thinking about you the other day and how you mentioned [previous health concern or goal, e.g., wanting to stay healthy during flu season]. I've recently started using something really exciting that's been a game-changer for my own immune support, and I immediately thought of you. Do you have a quick moment to hear about it?"`
    },
    {
      title: "Social Media DM",
      scenario: "Connecting via direct message",
      content: `"Hi [Name]! I've been following your posts for a while and always admire [their positive outlook/commitment to fitness/etc.]. I also noticed you've been interested in [related topic like natural health/wellness]. I help people find simple, natural ways to support their immune system, and I thought you might find what I do interesting. Would you be open to learning more?"`
    },
    {
      title: "Referral Introduction",
      scenario: "When referred by a mutual contact",
      content: `"Hi [Name], my name is [Your Name]. [Referral's Name] suggested I reach out to you; they mentioned you were looking for ways to naturally support your immune system. They spoke very highly of you! I specialize in helping people find simple, drug-free solutions for their wellness. Would you be open to a quick chat sometime this week?"`
    },
    {
      title: "Event/Party Approach",
      scenario: "At a social gathering",
      content: `"This is a great party, isn't it? I'm [Your Name]. How do you know [Host's Name]? [Listen to their answer, find common ground]. You know, I was just chatting with someone earlier about how challenging it can be to stay healthy, especially with everything going on. What kind of things do you usually do to keep your immune system strong?"`
    }
  ],

  discoveryQuestions: [
    { question: "What does 'feeling truly well' mean to you on a day-to-day basis?", category: "opening" },
    { question: "What are your top priorities when it comes to your personal health and wellness right now?", category: "opening" },
    { question: "Thinking about your immune system, what's been your biggest challenge or concern recently?", category: "pain" },
    { question: "Have you noticed any times of the year or situations where you feel more vulnerable to getting sick or run down?", category: "pain" },
    { question: "How does it impact your daily life, work, or family when you're not feeling 100%?", category: "impact" },
    { question: "If you could wave a magic wand and improve one aspect of your immune health, what would that be and why is that important to you?", category: "impact" },
    { question: "What's the cost, both financially and emotionally, of dealing with those health challenges?", category: "impact" },
    { question: "When you think about staying healthy and energetic, what worries you most about what might happen if you don't find a good solution?", category: "impact" },
    { question: "What kind of solutions have you explored in the past to support your immune system, and what did you like or dislike about them?", category: "solution" },
    { question: "If you were to find an ideal solution for immune support, what would be the most important qualities or benefits it would need to have for you?", category: "solution" }
  ],

  productPresentation: `<p><strong>[Problem]</strong> "Many people I speak with feel a constant battle to keep their immune system strong. It's often inconvenient to remember daily pills, or you worry about what you're putting into your body. You might feel that even with your best efforts, you're still susceptible to feeling run down, especially during busy or stressful times."</p>

<p><strong>[Agitate]</strong> "This constant worry, or the frustration of catching every little bug, really impacts your energy, your productivity, and frankly, your ability to truly enjoy life with your family and friends. Imagine missing out on important moments, feeling sluggish at work, or just not having the energy for the things you love."</p>

<p><strong>[Solve]</strong> "That's exactly why I'm excited to share <strong>Defend Super Patch</strong> with you. Instead of pills or liquids, Defend uses our unique, patented Vibrotactile Technology. You simply place a small patch on your skin, and its specialized patterns interact with your body's natural systems to trigger a neural response that supports your immune function. It's 100% drug-free, non-invasive, and incredibly simple to use. With Defend, you're giving your body the continuous, natural support it needs to stay strong, vibrant, and resilient."</p>`,

  objectionHandling: [
    {
      objection: "It's too expensive",
      response: "I understand that cost is an important factor when you're considering new wellness solutions, and you want to make a smart investment in your health. What aspects are most important for you in a product like this, beyond just the initial price?",
      psychology: "Validates concern, shifts focus to value and total criteria for decision-making."
    },
    {
      objection: "I need to think about it",
      response: "I understand this is a significant decision for your health and well-being, and you want to ensure it's the right fit for your lifestyle. What specific questions or considerations are on your mind as you evaluate the Defend patch?",
      psychology: "Acknowledges their need for reflection, uncovers specific concerns to address."
    },
    {
      objection: "I need to talk to my spouse",
      response: "I understand this is an important decision that affects your household, and it's great that you involve your spouse in these choices. What specific information or benefits do you think would be most important for your spouse to understand about how Defend could help your family?",
      psychology: "Respects the partnership dynamic, prepares them with key talking points."
    },
    {
      objection: "Does it really work?",
      response: "I completely understand why you might be skeptical about new technologies, and it's important to feel confident in your choices. What would you need to see, hear, or experience to truly feel that this is a credible solution for you and your immune health?",
      psychology: "Validates skepticism, opens door to providing specific proof points."
    },
    {
      objection: "I've tried patches/products before",
      response: "I understand you've had experiences with other products in the past, and it's natural to wonder if this is different. What was it about those previous solutions that didn't quite meet your expectations or left you feeling unsatisfied?",
      psychology: "Shows empathy for past disappointments, gathers info to differentiate."
    },
    {
      objection: "I'm not interested",
      response: "I understand you might not be actively looking for a new solution right now, and that's perfectly fine. Could you share what makes you feel like this isn't a fit for you at this moment?",
      psychology: "Respects their position while gently probing for underlying concerns."
    },
    {
      objection: "I don't have time",
      response: "I completely understand you have a busy schedule, and your time is valuable. What is it specifically about finding a new immune support solution that feels time-consuming for you right now?",
      psychology: "Acknowledges busy lifestyle, uncovers the real barrier."
    },
    {
      objection: "How is this different from [competitor]?",
      response: "I understand you're looking for clarity on how Defend stands out, and it's smart to compare options. What aspects of [competitor product] are you most familiar with, or what do you like about it, that you're looking to compare?",
      psychology: "Shows respect for their research, gathers intel to position effectively."
    }
  ],

  closingScripts: [
    {
      title: "The Assumptive Close",
      content: `"Based on what we've discussed and your desire for consistent immune support without pills, the Defend patch seems like a perfect fit. Shall we get you started with the recommended package today so you can begin feeling the difference?"`
    },
    {
      title: "The Alternative Close",
      content: `"So, for your immune support, would you prefer to start with our 30-day supply to try it out, or would our 90-day wellness package, which offers the best value, be a better option for you?"`
    },
    {
      title: "The Urgency Close",
      content: `"Just so you know, our current special offer for the Defend starter kit ends on [Date], and it includes [bonus feature]. If you're ready to boost your immune system naturally, now would be the perfect time to take advantage of that. Shall I help you place your order?"`
    },
    {
      title: "The Summary Close",
      content: `"So, to recap, with Defend, you'll be getting a truly innovative, drug-free way to support your immune system, boost your overall wellness, and maintain your health naturally, without the hassle of pills. You mentioned how important staying healthy for your family was to you. Are you ready to move forward and experience these benefits for yourself?"`
    },
    {
      title: "The Referral Close",
      scenario: "After a positive close",
      content: `"That's fantastic! I'm so excited for you to start experiencing the benefits of Defend. Who else do you know, perhaps a friend or family member, who might also benefit from natural immune support and wellness, and would appreciate learning about Super Patch?"`
    }
  ],

  followUpSequences: [
    {
      day: "Day 1",
      title: "Immediate Follow-Up",
      voicemail: `"Hi [Name], it's [Your Name] from Super Patch. I really enjoyed our conversation today about Defend and how it can help you with consistent immune support. I've sent over an email with a quick recap and the details we discussed. Please let me know if you have any questions. I'm here to help! Looking forward to connecting soon."`,
      text: `"Hi [Name]! Great connecting today. Just sent over an email with info on Defend. Let me know if you have any Qs! 😊"`
    },
    {
      day: "Day 3",
      title: "Value-Add Follow-Up",
      voicemail: `"Hi [Name], it's [Your Name]. Just wanted to share a quick thought. I was reading an article about the importance of daily immune support and immediately thought of you. I've sent a link to it in an email, along with a quick success story from another Defend user. No pressure at all, just wanted to share. Let me know if you'd like to chat!"`,
      text: `"Hey [Name]! Hope you're having a great week. Thought you might find this article on immune support interesting. It reminded me of our chat! Let me know what you think. 👍"`
    },
    {
      day: "Day 7",
      title: "Benefit-Focused Follow-Up",
      voicemail: `"Hi [Name], it's [Your Name]. Checking in again regarding the Defend patch. Many people I work with tell me the biggest benefit is feeling consistently more resilient without the daily hassle of pills. I'm curious if you've had any further thoughts on how that might impact your day-to-day life. I'm available for a quick chat if you have a moment."`,
      text: `"Hi [Name]! Quick check-in on Defend. Many find the consistent, effortless immune support a game-changer. Any thoughts on how that could benefit you? Happy to answer any questions! 😊"`
    },
    {
      day: "Day 14",
      title: "Action-Oriented Follow-Up",
      voicemail: `"Hi [Name], it's [Your Name]. Just wanted to follow up one last time on our discussion about the Defend patch. We currently have a free shipping offer ending soon that I wanted to make sure you were aware of. If you're still considering boosting your immune wellness, now would be a great time. Otherwise, no worries at all, but please do reach out if you change your mind down the road. Wishing you well!"`,
      text: `"Hi [Name]! Last check-in on Defend. Just a heads up, we have free shipping ending soon. If you're ready to naturally boost your immune system, let me know! No pressure either way. 😊"`
    }
  ],

  quickReference: {
    keyBenefits: [
      "Effortless Immune Support: Continuous, natural boost for your body's defenses",
      "Drug-Free Wellness: 100% natural, non-invasive, no pills or chemicals",
      "Convenient Health Maintenance: Simple patch application fits any lifestyle"
    ],
    bestQuestions: [
      "What are your top priorities when it comes to your personal health and wellness right now?",
      "How does it impact your daily life, work, or family when you're not feeling 100%?",
      "If you were to find an ideal solution for immune support, what would be the most important qualities or benefits it would need to have for you?"
    ],
    topObjections: [
      { objection: "It's too expensive", shortResponse: "What aspects are most important for you in a product like this, beyond just the initial price?" },
      { objection: "Does it really work?", shortResponse: "What would you need to see, hear, or experience to truly feel this is a credible solution for you?" },
      { objection: "I need to think about it", shortResponse: "What specific questions or considerations are on your mind as you evaluate the Defend patch?" }
    ],
    bestClosingLines: [
      "Based on what we've discussed, the Defend patch seems like a perfect fit. Shall we get you started today so you can begin feeling the difference?",
      "Would you prefer to start with our 30-day supply to try it out, or would our 90-day wellness package, which offers the best value, be a better option for you?"
    ]
  }
};





