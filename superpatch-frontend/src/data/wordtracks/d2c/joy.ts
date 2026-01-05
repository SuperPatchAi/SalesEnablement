import { WordTrack } from "@/types/wordtrack";

export const joyD2CWordTrack: WordTrack = {
  id: "d2c-joy",
  productId: "joy",
  marketId: "d2c",
  productOverview: `<p>The Super Patch <strong>Joy</strong> is an innovative wellness solution designed to naturally enhance mood, foster emotional well-being, and cultivate a positive outlook. In a world where stress and daily pressures can dim our spirits, Joy offers a simple, non-invasive way to support your emotional state without drugs or chemicals.</p>
<p>Joy is for anyone seeking to improve their mood, manage daily emotional fluctuations, or simply desire a more optimistic perspective on life. Whether you're feeling overwhelmed, a bit down, or just want to maintain a consistent sense of happiness, Joy provides a gentle yet powerful boost.</p>
<p>What makes Joy truly unique is its foundation in <strong>Vibrotactile Technology (VTT)</strong>. This proprietary science involves specialized ridge patterns on the patch that interact with your skin's mechanoreceptors. This interaction triggers your body's own neural responses, promoting natural mood enhancement. It's 100% drug-free, all-natural, and completely non-invasive.</p>`,
  
  idealCustomerProfile: {
    demographics: "Age 25-65+ (broad appeal, but particularly those facing career/family stress or age-related emotional changes). Mid to upper-middle class, willing to invest in personal well-being and natural health solutions. Active individuals, busy professionals, parents, students, retirees, anyone prioritizing self-care.",
    psychographics: "Health-conscious, values natural and holistic approaches. Open-minded to innovative technologies. Self-improvers actively seeking ways to optimize mental and emotional state. Solution-oriented, tired of traditional methods with side effects. Values convenience and easy-to-use wellness tools.",
    painPoints: [
      "Feeling stressed, overwhelmed, or anxious about daily life",
      "Struggling with low mood, irritability, or persistent lack of motivation",
      "Difficulty maintaining a positive outlook or bouncing back from challenges",
      "Reliance on temporary fixes like caffeine or sugar for mood boosts",
      "Concern about side effects or long-term impacts of pharmaceutical solutions",
      "Feeling emotionally drained or experiencing burnout"
    ],
    previousSolutions: [
      "Dietary supplements (St. John's Wort, 5-HTP, adaptogens)",
      "Meditation apps, mindfulness practices, yoga",
      "Regular exercise and outdoor activities",
      "Therapy or counseling",
      "Essential oils or aromatherapy",
      "Other 'mood-boosting' products (energy drinks, special teas)"
    ]
  },

  openingScripts: [
    {
      title: "Cold Approach (Stranger)",
      scenario: "At a coffee shop, gym, or casual setting",
      content: `"Hi there! I couldn't help but notice your [interesting item, e.g., unique phone case, t-shirt, book]. That's really cool! My name is [Your Name], it's great to meet you. I'm actually curious, how do you usually keep your spirits up with such a busy schedule?"`
    },
    {
      title: "Warm Introduction (Friend/Family)",
      scenario: "Reaching out to someone you know",
      content: `"Hey [Friend/Family Name]! How have you been? I was thinking about you the other day and wanted to share something I'm really excited about. You know how important emotional well-being is to me, and I've found something that's truly been a game-changer for my mood. Have you ever looked into natural ways to boost your emotional state?"`
    },
    {
      title: "Social Media DM",
      scenario: "Connecting via direct message",
      content: `"Hi [Name]! I've been following your posts and really appreciate your [positive attribute, e.g., inspiring content, dedication to wellness]. I saw your story about feeling overwhelmed/seeking balance and it resonated with me. I work with a natural wellness technology that's helping people enhance their mood and emotional well-being. Would you be open to learning a little more about it?"`
    },
    {
      title: "Referral Introduction",
      scenario: "When referred by a mutual contact",
      content: `"Hi [Name]! My name is [Your Name], and Sarah suggested I connect with you. She mentioned you're someone who really values natural health solutions and a positive outlook, and she thought you might be interested in something that's made a big difference for her emotional well-being. How open are you to exploring new ways to support your mood?"`
    },
    {
      title: "Event/Party Approach",
      scenario: "At a social gathering",
      content: `"What a great party, isn't it? My name's [Your Name]. I was just chatting with someone about how important it is to stay positive, especially with everything going on these days. What are your go-to strategies for keeping a positive mindset?"`
    }
  ],

  discoveryQuestions: [
    { question: "How are things generally going for you these days, especially when it comes to your overall well-being and mood?", category: "opening" },
    { question: "What does 'feeling your best' emotionally look like for you?", category: "opening" },
    { question: "What's been your biggest challenge lately in maintaining a consistently positive mood or emotional balance?", category: "pain" },
    { question: "Are there specific times or situations where you find your mood could use a little boost?", category: "pain" },
    { question: "On a scale of 1 to 10, how satisfied are you currently with your emotional state and outlook?", category: "pain" },
    { question: "How does [their stated pain point, e.g., stress, low mood] impact your daily activities, your relationships, or your productivity?", category: "impact" },
    { question: "What would it mean for you if you could consistently feel more uplifted and positive?", category: "impact" },
    { question: "What have you tried in the past to improve your mood or emotional well-being, and what results did you experience?", category: "solution" },
    { question: "What's most important to you when considering a solution for emotional support – natural ingredients, ease of use, or fast-acting results?", category: "solution" },
    { question: "If you could wave a magic wand and instantly improve one aspect of your emotional state, what would it be?", category: "solution" }
  ],

  productPresentation: `<p><strong>[Problem]</strong> "It sounds like you're really looking for a way to consistently feel more positive and manage daily stress better. Many people I speak with feel the same way. In today's fast-paced world, it's incredibly common to feel overwhelmed, stressed, or just a bit 'off' emotionally. We're constantly bombarded, and it can be really tough to maintain that sense of inner calm and a positive outlook."</p>

<p><strong>[Agitate]</strong> "And when our mood dips, it doesn't just affect us; it spills over into our relationships, our work, and our ability to enjoy the simple things in life. It can leave us feeling drained, unmotivated, and searching for answers, often leading to temporary fixes that don't truly address the root cause, or even come with unwanted side effects."</p>

<p><strong>[Solve]</strong> "That's exactly why I'm so excited about the <strong>Super Patch Joy</strong>. Imagine a natural, drug-free, and incredibly simple way to tap into your body's own ability to feel happier and more balanced. The Joy patch uses something called Vibrotactile Technology – it's a specialized pattern on the patch that interacts with your skin, sending a signal to your brain to naturally enhance your mood, promote emotional well-being, and give you a more positive outlook. You just place it on your skin, and it works with your body, not against it. It's truly a game-changer for anyone wanting to reclaim their emotional peace and joy, without any chemicals or invasiveness."</p>`,

  objectionHandling: [
    {
      objection: "It's too expensive",
      response: "I understand that price is an important factor when you're considering new wellness solutions, and you want to make a smart investment. What other criteria are most important for you in a product like this, beyond just the initial cost?",
      psychology: "Validates concern, opens discussion about total value."
    },
    {
      objection: "I need to think about it",
      response: "I completely understand that this is a significant decision for your health and well-being, and you want to ensure it's the right fit for your lifestyle. What specific questions or considerations are on your mind that you'd like to think through?",
      psychology: "Acknowledges need for reflection, uncovers specific concerns."
    },
    {
      objection: "I need to talk to my spouse",
      response: "Hey, this is an important decision, and I understand you want to get everyone involved in your household. What specific questions or concerns do you anticipate your spouse might have that we could address now, or what information would be most helpful for you to share with them?",
      psychology: "Respects partnership, helps prepare key talking points."
    },
    {
      objection: "Does it really work? It sounds too good to be true",
      response: "I totally get why you might be skeptical about new technologies, and it's important to feel confident in your choices. What would you need to see, hear, or experience to truly feel that this is a credible solution for you?",
      psychology: "Validates skepticism, opens door to providing evidence."
    },
    {
      objection: "I've tried patches/products before and they didn't work",
      response: "I understand you've explored other options in the past, and it can be frustrating when something doesn't meet your expectations. What did you like or dislike about those previous products, and what were you truly hoping for when you tried them?",
      psychology: "Shows empathy, gathers info to differentiate Joy."
    },
    {
      objection: "I'm not interested",
      response: "I understand you might be busy or perhaps you feel your current approach to well-being is working well. What aspects of your current routine for emotional balance are you most satisfied with?",
      psychology: "Respects position, gently probes for hidden needs."
    },
    {
      objection: "I don't have time to deal with this right now",
      response: "I completely understand your schedule is packed, and time is precious. What's the biggest priority for you right now when it comes to your personal well-being, even with all the demands on your time?",
      psychology: "Acknowledges busy life, reconnects to their priorities."
    },
    {
      objection: "How is this different from [competitor/other mood product]?",
      response: "That's a great question, and I understand you're looking for the best fit for your needs. What have you learned about [competitor] that you find appealing, and what are you hoping for in a solution that you might not be getting from other options?",
      psychology: "Shows respect for research, gathers positioning intel."
    }
  ],

  closingScripts: [
    {
      title: "The Assumptive Close",
      content: `"Great! So, which Super Patch Joy package would you like to start with today to begin experiencing those mood-boosting benefits?"`
    },
    {
      title: "The Alternative Close",
      content: `"Would you prefer to start with a monthly subscription for continuous support and savings, or a one-time purchase to try it out first?"`
    },
    {
      title: "The Urgency Close",
      scenario: "Only use if there's a genuine, time-bound offer",
      content: `"We have a special 'New Customer Joy Pack' promotion that includes [bonus item/discount] ending this Friday. This is a great way to maximize your benefits right from the start. Is that something you'd like to take advantage of today?"`
    },
    {
      title: "The Summary Close",
      content: `"So, just to recap, based on what we've discussed, the Joy patch will help you manage daily stress more effectively, maintain a more positive outlook, and feel more emotionally balanced, all naturally and drug-free. Does that sound like what you're looking for? If so, shall we get you started?"`
    },
    {
      title: "The Referral-Oriented Close",
      content: `"Many of my happiest customers, who now experience consistent joy and emotional balance, were often referred by a friend who found great value in the Super Patch. Knowing what you know now about Joy, if you were to recommend this to someone you care about who's looking for emotional support, what would you tell them? [Pause] That's fantastic! So, are you ready to experience that for yourself and share your own positive story?"`
    }
  ],

  followUpSequences: [
    {
      day: "Day 1",
      title: "Initial Follow-Up",
      voicemail: `"Hi [Prospect's Name], this is [Your Name] from Super Patch. I really enjoyed our conversation earlier about how the Joy patch could help you improve your mood. I wanted to quickly follow up and see if you had any other questions that popped up. I'll send a quick text too. Give me a call back at [Your Number] when you have a moment. Hope you're having a great day!"`,
      text: `"Hi [Prospect's Name]! It was great connecting today/earlier. Just wanted to send a quick text to follow up on our chat about the Joy patch and how it can help you feel more positive. Let me know if you have any questions! 😊"`
    },
    {
      day: "Day 3",
      title: "Value-Add Follow-Up",
      text: `"Hey [Prospect's Name]! Hope you're having a good week. I came across a thought about boosting mood naturally that reminded me of our conversation. Still thinking about the Joy patch?"`
    },
    {
      day: "Day 7",
      title: "Gentle Nudge",
      voicemail: `"Hi [Prospect's Name], it's [Your Name]. Just circling back on our chat from last week regarding the Super Patch Joy. I was thinking about how you mentioned wanting to feel more positive, and how the patch could really make a difference there. No pressure at all, just wanted to see if now might be a better time to connect. My number is [Your Number]. Thanks!"`,
      text: `"Hi [Prospect's Name], checking in! Any thoughts on the Super Patch Joy since we last spoke? I'm here if any questions came up or if you just want to chat through anything. No pressure, just wanted to offer my support!"`
    },
    {
      day: "Day 14",
      title: "Final Check-In",
      text: `"Hey [Prospect's Name], last check-in on the Super Patch Joy! I truly believe this could be a great fit for you to feel more positive and emotionally balanced. Our special offer on the starter pack is wrapping up soon. If you're still considering it, let's connect today! If not, completely understand. Wishing you all the best!"`
    }
  ],

  quickReference: {
    keyBenefits: [
      "Mood Enhancement: Naturally uplifts your spirits",
      "Emotional Well-being: Promotes balance and calm",
      "Positive Outlook: Fosters optimism for daily life (All 100% drug-free & non-invasive!)"
    ],
    bestQuestions: [
      "What's been your biggest challenge lately in maintaining a consistently positive mood or emotional balance?",
      "How does your current emotional state impact your daily activities or relationships?",
      "What's most important to you when considering a solution for emotional support?"
    ],
    topObjections: [
      { objection: "It's too expensive", shortResponse: "What other criteria are most important for you in a product like this, beyond just the initial cost?" },
      { objection: "Does it really work?", shortResponse: "What would you need to see, hear, or experience to truly feel that this is a credible solution for you?" },
      { objection: "I need to think about it", shortResponse: "What specific questions or considerations are on your mind that you'd like to think through?" }
    ],
    bestClosingLines: [
      "So, which Super Patch Joy package would you like to start with today to begin experiencing those mood-boosting benefits?",
      "Would you prefer to start with a monthly subscription for continuous support and savings, or a one-time purchase to try it out first?"
    ]
  }
};

