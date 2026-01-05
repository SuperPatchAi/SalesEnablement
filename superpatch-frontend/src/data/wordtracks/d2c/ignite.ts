import { WordTrack } from "@/types/wordtrack";

export const igniteD2CWordTrack: WordTrack = {
  id: "d2c-ignite",
  productId: "ignite",
  marketId: "d2c",
  productOverview: `<p><strong>Super Patch Ignite</strong> is a revolutionary wellness product designed to naturally boost your body's metabolism and support healthy weight management.</p>
<p>Utilizing our proprietary <strong>Vibrotactile Technology (VTT)</strong>, Ignite features specialized ridge patterns that gently interact with your skin's mechanoreceptors. This interaction triggers your body's innate neural responses, signaling your system to "Fire up your metabolism" and "Burn calories even while at rest."</p>
<p>Ignite is for anyone looking to optimize their metabolic health, enhance calorie burning, or seeking effective, natural support for their weight management journey. What makes Ignite truly unique is its 100% drug-free, all-natural, and non-invasive approach. There are no pills to swallow, no stimulants, and no chemicals entering your bloodstream – just your body's own incredible intelligence activated through a simple, comfortable patch.</p>`,
  
  idealCustomerProfile: {
    demographics: "Age 25-65+, middle to upper-middle class, busy professionals, parents, or individuals who prioritize their health but struggle to find time for extensive routines. May be physically active or aspiring to be.",
    psychographics: "Values health, vitality, confidence, convenience, natural solutions, and innovation. Often health-conscious but may feel frustrated or stuck in their weight loss or energy goals. Skeptical of 'magic pills' but open to scientific, natural approaches.",
    painPoints: [
      "Feeling like body isn't burning calories efficiently even with diet and exercise",
      "Struggling to lose those last few pounds or seeing no progress despite effort",
      "Feeling sluggish, especially in the afternoon, impacting productivity",
      "Tired of restrictive diets or intense workouts that don't yield results",
      "Lack of time to incorporate complex wellness routines",
      "Wary of quick fixes or products with unsubstantiated claims"
    ],
    previousSolutions: [
      "Various diets (Keto, Paleo, Intermittent Fasting, calorie counting)",
      "Gym memberships and personal trainers",
      "Dietary supplements (fat burners, metabolism boosters, detox teas)",
      "Meal replacement shakes or bars",
      "Trying to 'just eat less and move more' without seeing significant change"
    ]
  },

  openingScripts: [
    {
      title: "Cold Approach (Stranger)",
      scenario: "At a coffee shop, gym, or public place",
      content: `"Excuse me, I couldn't help but notice your awesome running shoes/cool t-shirt. I love that! My name is [Your Name], it's great to meet you! What brings you out today?" [Listen for cues to gently transition to health/wellness]`
    },
    {
      title: "Warm Introduction (Friend/Family)",
      scenario: "Talking to someone who's looking to improve their health",
      content: `"Hey [Friend's Name]! How have you been? I was actually thinking about you the other day because you mentioned you were feeling a bit sluggish/trying to get back into shape. I recently started using something that's been a game-changer for my own metabolism and energy, and I immediately thought of you. Would you be open to hearing about it for a minute?"`
    },
    {
      title: "Social Media DM",
      scenario: "Noticed someone's post about fitness or energy",
      content: `"Hey [Name]! Loved your recent post about hitting the gym/struggling with afternoon energy dips. It really resonated with me because I used to feel the same way. I've found something truly innovative that's been helping me naturally boost my metabolism and energy, and I thought it might be exactly what you're looking for. Would you be open to a quick chat? No pressure at all!"`
    },
    {
      title: "Referral Introduction",
      scenario: "A mutual contact suggested you connect",
      content: `"Hi [Prospect's Name], my name is [Your Name]. [Referrer's Name] suggested I reach out to you. They mentioned you might be interested in boosting your metabolism or finding natural ways to manage your weight. They spoke very highly of you! Would now be a good time for a quick chat to see if what I do could be a good fit?"`
    },
    {
      title: "Event/Party Approach",
      scenario: "At a social gathering",
      content: `"It's a great party, isn't it? So, what do you do when you're not at events like this? [Listen and respond genuinely]. That's really interesting! I actually help people feel more energetic and get their metabolism firing naturally, which makes a huge difference in how they tackle their day. Have you ever felt like your metabolism could use a little boost?"`
    }
  ],

  discoveryQuestions: [
    { question: "What does 'feeling truly healthy and energetic' look like for you right now?", category: "opening" },
    { question: "What are some of your top health and wellness goals for the next 3-6 months?", category: "opening" },
    { question: "When it comes to your energy and metabolism, what's been your biggest frustration lately?", category: "pain" },
    { question: "Have you ever felt like you're doing all the right things – eating well, exercising – but still not seeing the weight loss or energy results you expect?", category: "pain" },
    { question: "What impact does slow metabolism or low energy have on your daily life or your confidence?", category: "impact" },
    { question: "If you could wave a magic wand and instantly improve one thing about your current metabolic health, what would it be and why?", category: "impact" },
    { question: "How would having more consistent energy or a more active metabolism impact your ability to achieve your goals?", category: "impact" },
    { question: "What's the cost to you, both personally and emotionally, of not addressing these challenges?", category: "impact" },
    { question: "What kind of solutions have you explored in the past to address your metabolism or weight management, and what was your experience with them?", category: "solution" },
    { question: "What's most important to you when considering a new wellness product or approach?", category: "solution" }
  ],

  productPresentation: `<p><strong>[Problem]</strong> "Many people I talk to feel exactly like you do. They're doing their best, eating well, maybe even working out, but they still struggle with feeling sluggish, hitting a weight loss plateau, or just wishing their metabolism was more efficient. It's incredibly frustrating when you put in the effort and don't see the results you deserve, right?"</p>

<p><strong>[Agitate]</strong> "It can really impact your energy, your confidence, and how you feel about yourself every single day. That feeling of trying so hard but not seeing the needle move – it's exhausting and discouraging."</p>

<p><strong>[Solve]</strong> "That's exactly why I'm so excited about the <strong>Super Patch Ignite</strong>. Imagine a way to naturally 'fire up your metabolism' and help your body 'burn calories even while at rest' – all without pills, stimulants, or anything invasive. Ignite uses our unique Vibrotactile Technology, specialized ridge patterns that gently interact with your skin. This interaction signals your body's own neural responses to naturally boost your metabolism and support calorie burning. It's 100% drug-free, all-natural, and incredibly simple to use. Just place it on your skin, and let your body do the rest. People are experiencing amazing results with their energy, feeling lighter, and finally seeing progress in their weight management journeys."</p>`,

  objectionHandling: [
    {
      objection: "It's too expensive",
      response: "I understand that price is an important factor when you're considering new wellness solutions, and it's natural to want to ensure you're making a wise investment. What other criteria are most important for you in a product like this, beyond just the initial cost?",
      psychology: "Validates the concern, opens discussion about total value and other decision factors."
    },
    {
      objection: "I need to think about it",
      response: "I completely understand this is an important decision for your health and well-being, and you want to ensure it's the right fit. What specific questions or considerations are on your mind that you need to think about further?",
      psychology: "Acknowledges need for reflection, uncovers specific barriers to address."
    },
    {
      objection: "I need to talk to my spouse",
      response: "I understand this is a significant decision, and you want to involve your spouse in the conversation. What aspects of Ignite do you think they'd be most interested in discussing, or what questions might they have?",
      psychology: "Respects the partnership, helps prepare them for the conversation."
    },
    {
      objection: "Does it really work?",
      response: "I completely understand why you'd want to be sure a new technology like this truly delivers results; it's important to feel confident in your choices. What would you need to see, hear, or experience to truly feel that Ignite is a credible solution for you?",
      psychology: "Validates skepticism, opens door to providing specific evidence."
    },
    {
      objection: "I've tried patches/products before",
      response: "I understand you've tried other things in the past, and it can be frustrating when they don't deliver on their promises. What was your experience with those, and what makes you hesitant about trying something new like Ignite?",
      psychology: "Shows empathy, gathers intel to differentiate Ignite."
    },
    {
      objection: "I'm not interested",
      response: "I understand you might not be actively looking for new solutions right now, and that's perfectly fine. Is there anything specific that makes you feel it's not a fit, or have you just not heard enough about how Ignite works?",
      psychology: "Respects their position, gently probes for hidden interest."
    },
    {
      objection: "I don't have time",
      response: "I completely understand you have a very busy schedule – many of my clients do! If Ignite could help you feel more energetic and efficient, allowing you to get more out of your day, how much of a priority would finding a few moments to discuss it be for you?",
      psychology: "Reframes time as an investment, connects to their desire for more energy."
    },
    {
      objection: "How is this different from [competitor]?",
      response: "That's a great question, and I understand you're curious about how Ignite stands out. What have you heard or experienced about [competitor] that you're comparing it to, and what specifically are you looking for in a solution?",
      psychology: "Shows respect for their research, gathers info to position effectively."
    }
  ],

  closingScripts: [
    {
      title: "The Assumptive Close",
      content: `"Based on everything we've discussed and your goal to boost your metabolism and manage your weight, the Ignite patch sounds like the perfect fit for you. So, are we ready to get you started with a 30-day supply today?"`
    },
    {
      title: "The Alternative Close",
      content: `"Would you prefer to start with our popular 30-day supply, or would the 90-day package that offers even better value be a better option for you today?"`
    },
    {
      title: "The Urgency Close",
      content: `"Just so you know, our special introductory offer for the Ignite patch, which includes [specific bonus/discount], is ending this week. If you're ready to start feeling those metabolic benefits, now would be the ideal time to lock that in. Shall we get your order placed?"`
    },
    {
      title: "The Summary Close",
      content: `"So, to recap, with Ignite, you'll be naturally boosting your metabolism, supporting calorie burning even at rest, and using a 100% drug-free, non-invasive solution to help you reach your weight management goals. You mentioned how important feeling more energetic is to you. Given all that, are you ready to experience the power of Ignite for yourself?"`
    },
    {
      title: "The Referral Close",
      scenario: "After a successful sale",
      content: `"That's fantastic, [Customer's Name]! I'm so excited for you to start feeling the difference with Ignite. As you begin your journey, who else do you know who might be looking to boost their metabolism, manage their weight, or just feel more energetic naturally? I'd love to help them too."`
    }
  ],

  followUpSequences: [
    {
      day: "Day 1",
      title: "After Initial Conversation",
      text: `"Hi [Customer's Name]! It was great connecting with you today. I'm really excited for you to experience the natural metabolic boost of Ignite! Here's a quick link to our info page for reference: [Link]. Let me know if any questions pop up!"`
    },
    {
      day: "Day 3",
      title: "Value-Add Follow-Up",
      text: `"Hey [Prospect's Name]! Just thinking about our chat regarding how Ignite can help with those afternoon energy dips. I wanted to share a quick testimonial from someone who had a similar experience. Still open to a quick 5-min chat to answer any lingering questions?"`
    },
    {
      day: "Day 7",
      title: "Check-In",
      text: `"Hi [Prospect's Name]! Hope you're having a great week. Just wanted to check in about the Ignite patch – any thoughts on how boosting your metabolism could impact your fitness routine? Happy to answer any questions you might have!"`,
      voicemail: `"Hi [Prospect's Name], it's [Your Name]. Just wanted to quickly follow up on my last message. I know life gets busy, but I genuinely believe the Super Patch Ignite could make a real difference for your energy levels and weight management goals. If you're curious, let's connect for a quick chat. My number is [Your Phone Number]. Have a great day!"`
    },
    {
      day: "Day 14",
      title: "Final Outreach",
      text: `"Hey [Prospect's Name], I know you mentioned wanting to boost your metabolism. Many people find that Ignite is the missing piece to naturally getting their metabolism in gear. This week we have a special bundle offer. Would it be worth a quick call to see if it makes sense for you now?"`
    }
  ],

  quickReference: {
    keyBenefits: [
      "Boosted Metabolism: Fire up your body's natural calorie-burning engine",
      "Calorie Burning: Support your body in burning calories, even at rest",
      "Weight Management: A natural, non-invasive aid for your weight goals"
    ],
    bestQuestions: [
      "What's been your biggest frustration lately when it comes to your energy or metabolism?",
      "If you could instantly improve one thing about your metabolic health, what would it be and why?",
      "What kind of solutions have you explored in the past, and what was your experience?"
    ],
    topObjections: [
      { objection: "Too expensive", shortResponse: "What other criteria are most important for you in a product like this, beyond just the initial cost?" },
      { objection: "Does it really work?", shortResponse: "What would you need to see, hear, or experience to truly feel confident this is a credible solution for you?" },
      { objection: "I need to think about it", shortResponse: "What specific questions or considerations are on your mind that you need to think about further?" }
    ],
    bestClosingLines: [
      "Based on everything we've discussed, Ignite sounds like the perfect fit. Are we ready to get you started with a 30-day supply today?",
      "Would you prefer to start with our popular 30-day supply, or would the 90-day package that offers even better value be a better option for you today?"
    ]
  }
};

