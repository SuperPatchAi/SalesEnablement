import { WordTrack } from "@/types";

export const freedomD2CWordTrack: WordTrack = {
  id: "freedom-d2c",
  productId: "freedom",
  market: "d2c",
  title: "Freedom Patch - Sales Word Track",
  subtitle: "Take care of those minor aches and pains",
  overview: `The Super Patch Freedom is an innovative, drug-free solution designed to address minor aches, pains, and discomfort. Utilizing cutting-edge Vibrotactile Technology (VTT), each patch features specialized ridge patterns that interact with the skin's mechanoreceptors. This interaction triggers the body's own neural responses, providing natural and non-invasive pain relief without any chemicals or side effects.

Freedom is ideal for anyone seeking a safe and effective way to manage everyday physical discomfort. Whether it's a stiff neck from working at a desk, sore muscles after a workout, or general joint aches that come with an active lifestyle or aging, Freedom helps you "take care of those minor aches and pains" so you can live more comfortably.

What makes Freedom truly unique is its groundbreaking Vibrotactile Technology. Unlike creams, pills, or other patches that deliver substances into the body, Freedom works *with* your body's natural systems. It's 100% drug-free, all-natural, and non-invasive, making it a safe choice for prolonged use and for individuals who are sensitive to medications or prefer a holistic approach to wellness.`,
  
  idealCustomer: `**Demographics:**
- Age: 30-70+ (active adults, parents, seniors, professionals)
- Gender: All genders
- Lifestyle: Active individuals, office workers, manual laborers, athletes (weekend warriors), busy parents, retirees, anyone experiencing daily physical discomfort
- Health Status: Generally healthy but experiencing minor, non-chronic aches, pains, stiffness, or soreness

**Psychographics:**
- Values: Health-conscious, proactive about well-being, prefers natural or drug-free solutions, seeks convenience and ease of use, values quality of life
- Attitudes: Open to new technologies but might be skeptical if it sounds "too good to be true." Cautious about side effects from medications
- Desires: Freedom from daily discomfort, ability to perform daily tasks without pain, better sleep, increased energy, improved mood
- Concerns: Worried about long-term effects of medication, potential for addiction, inconvenience of creams

**Pain Points:**
- "My lower back always aches after a long day at work."
- "I wake up with a stiff neck and shoulders."
- "My knees get sore after walking or light exercise."
- "I have muscle soreness that lingers after my workouts."
- "General body aches that make me feel older than I am."
- "Headaches related to tension in my neck and shoulders."
- "Discomfort that prevents me from enjoying hobbies or playing with my kids/grandkids."`,

  openingScripts: [
    {
      id: "cold-approach",
      title: "Cold Approach (Stranger)",
      scenario: "Meeting someone new at an event, store, or public place",
      content: `"Hi there! I couldn't help but notice your [mention something positive and specific: e.g., 'beautiful garden,' 'interesting book,' 'energetic dog']. That's really impressive! My name is [Your Name], by the way. How's your day going so far?"

(Listen, engage, then transition naturally if appropriate)

"I'm actually out sharing a simple way people are finding relief from everyday aches, which reminds me, do you ever deal with those minor aches and pains that just pop up?"`,
    },
    {
      id: "warm-introduction",
      title: "Warm Introduction (Friend/Family)",
      scenario: "Talking to someone you know who has mentioned pain before",
      content: `"Hey [Friend/Family Member's Name]! It's so good to catch up. How have things been? I was actually thinking about you the other day because I've been helping people with something that I know you've mentioned struggling with – those annoying everyday aches and pains. Is that still something you deal with?"

(This opens the door gently, showing you care and remembered their past concerns.)`,
    },
    {
      id: "social-media-dm",
      title: "Social Media DM",
      scenario: "Responding to a general post or story",
      content: `"Hey [Name]! Loved your recent post about [mention their post]. You always seem so active/busy! I actually help people like you who are constantly on the go, but sometimes find themselves dealing with minor aches and discomfort. Have you ever wished for a natural, drug-free way to just 'turn down the volume' on those little pains so you can keep doing what you love?"`,
    },
    {
      id: "referral",
      title: "Referral Introduction",
      scenario: "Reaching out based on a recommendation",
      content: `"Hi [Prospect's Name], my name is [Your Name]. [Referral Name] suggested I reach out to you. They mentioned you might be interested in a natural way to manage some of those everyday aches and pains you've been experiencing. They thought you'd appreciate how simple and effective it is. How open are you to hearing about something new that could offer some relief?"`,
    },
    {
      id: "event-party",
      title: "Event/Party Approach",
      scenario: "Casual conversation at a social event",
      content: `"This is a great party/event, isn't it? My name is [Your Name]. What brings you here tonight? [Listen and engage]. I actually work with a wellness company that's helping people find drug-free relief from minor aches and pains. It's amazing how many people are looking for natural ways to feel better these days. Do you ever find yourself dealing with those little discomforts that just pop up?"`,
    },
  ],

  discoveryQuestions: [
    {
      id: "opening-1",
      question: "How would you describe your overall energy and comfort levels throughout a typical day?",
      category: "opening",
    },
    {
      id: "opening-2",
      question: "What does 'feeling your best' look like for you, and where do you feel you are on that scale right now?",
      category: "opening",
    },
    {
      id: "pain-1",
      question: "When you think about minor aches or discomfort, where do you typically feel it most often?",
      category: "pain",
    },
    {
      id: "pain-2",
      question: "Can you tell me a bit about how often you experience these aches, and at what times of day they tend to be most noticeable?",
      category: "pain",
    },
    {
      id: "pain-3",
      question: "On a scale of 1 to 10, with 10 being the most disruptive, how much do these minor aches impact your daily comfort?",
      category: "pain",
    },
    {
      id: "impact-1",
      question: "What activities do you find yourself holding back on, or avoiding altogether, because of these aches?",
      category: "impact",
    },
    {
      id: "impact-2",
      question: "How do these minor aches affect your sleep, mood, or overall ability to enjoy your day?",
      category: "impact",
    },
    {
      id: "impact-3",
      question: "If you could wake up tomorrow feeling completely free from those specific aches, what's the first thing you'd do?",
      category: "impact",
    },
    {
      id: "solution-1",
      question: "What have you tried in the past to manage these aches, and what was your experience with those solutions?",
      category: "solution",
    },
    {
      id: "solution-2",
      question: "When considering a solution for minor aches and pains, what are the most important factors for you – for example, is it about speed, being drug-free, ease of use, or something else entirely?",
      category: "solution",
    },
  ],

  productPresentation: `**Problem**
"Many people I speak with are just tired of constantly dealing with those nagging aches and pains that interfere with their daily activities – whether it's playing with their grandkids, enjoying a favorite sport, or even just getting a good night's sleep. They're looking for something that really works, without the side effects or the hassle of traditional remedies."

**Agitate**
"Think about what it truly costs you when you're constantly battling discomfort. It's not just the physical pain; it's the frustration, the reduced energy, the missed moments, and the feeling that you're not living life to its fullest. Relying on pills can bring worries about long-term use, and creams can be messy and temporary. You deserve a solution that empowers your body, not just masks the problem."

**Solve**
"That's exactly why I'm so excited about the Super Patch Freedom. It's a revolutionary, 100% drug-free, and non-invasive way to take care of those minor aches and pains. You simply apply this small patch to your skin, and its unique Vibrotactile Technology (VTT) gets to work.

These specialized patterns interact with your body's natural neural responses to help bring you natural, targeted pain relief. It's not putting anything *into* your body, but rather helping your body help itself.

It's discreet, easy to use, and offers a natural pathway to feeling more comfortable and free. Imagine waking up feeling less stiff, enjoying your activities more, and simply living with less discomfort – all naturally."`,

  objections: [
    {
      id: "too-expensive",
      objection: "It's too expensive.",
      response: "I understand that cost is an important factor when you're considering new wellness solutions, and you want to make a smart investment. What other criteria are most important for you when evaluating a product like this, beyond just the initial price?",
      psychology: "Conversation Aikido - acknowledge concern, then redirect to deeper motivations",
    },
    {
      id: "think-about-it",
      objection: "I need to think about it.",
      response: "I understand this is a significant decision for your health and well-being, and you want to ensure it's the right fit for your lifestyle. What specific questions or considerations would be most helpful for you to think through as you evaluate the Freedom patch?",
      psychology: "Conversation Aikido - validate, then surface hidden objections",
    },
    {
      id: "spouse",
      objection: "I need to talk to my spouse.",
      response: "I understand this is an important decision, and you want to get everyone involved. What specific questions or concerns do you anticipate your spouse might have that we could address together?",
      psychology: "Conversation Aikido - include decision-makers proactively",
    },
    {
      id: "does-it-work",
      objection: "Does it really work? It sounds too good to be true.",
      response: "I completely understand why you might be skeptical about new technologies, and it's important to feel confident in your choices. What would you need to see, hear, or experience to truly feel that this is a credible and effective solution for you?",
      psychology: "Conversation Aikido - acknowledge skepticism, offer proof options",
    },
    {
      id: "tried-before",
      objection: "I've tried patches/products before and they didn't work.",
      response: "I understand you've had experiences with other products in the past, and it's frustrating when they don't deliver. What did you like or dislike about those previous solutions, and what do you feel was missing for you?",
      psychology: "Conversation Aikido - differentiate from past failures",
    },
    {
      id: "not-interested",
      objection: "I'm not interested.",
      response: "I understand that you might not be actively looking for a new solution right now, and that's perfectly fine. Could you share what specifically about this approach doesn't align with what you're interested in, or if there's any aspect that you're curious about, even briefly?",
      psychology: "Conversation Aikido - uncover hidden interest or real objection",
    },
    {
      id: "no-time",
      objection: "I don't have time.",
      response: "I understand you have a very busy schedule, and time is precious. If you could find a simple, drug-free way to reduce minor aches and pains, even just a little, how much impact would that have on your ability to manage your time and energy more effectively?",
      psychology: "Conversation Aikido - connect to their time priority",
    },
    {
      id: "competitor",
      objection: "How is this different from [competitor - e.g., CBD patch, Salonpas]?",
      response: "I understand you're curious about how Freedom stands out, and it's smart to compare options. Unlike [competitor] which typically delivers a substance, Super Patch Freedom uses Vibrotactile Technology – it's a completely drug-free, non-invasive approach that leverages your body's own neural responses for relief. It's not about what goes *into* your body, but how your body's natural systems are activated.",
      psychology: "Comparison differentiation - focus on unique mechanism",
    },
  ],

  closingScripts: [
    {
      id: "assumptive",
      title: "The Assumptive Close",
      content: `"Great! Since the Freedom patch aligns with your desire for natural, drug-free relief for those everyday aches, how many boxes should we start you with today so you can experience the difference?"`,
    },
    {
      id: "alternative",
      title: "The Alternative Close",
      content: `"Based on what we've discussed, it sounds like the Freedom patch would be a fantastic solution for those knee pains. Would you prefer to start with a single box to try it out, or would the 3-pack be a better value for your ongoing needs?"`,
    },
    {
      id: "urgency",
      title: "The Urgency Close",
      content: `"Considering you mentioned those back aches are really impacting your sleep, and we have a special offer on the Freedom patch ending this week, it would be smart to get started now and not miss out on feeling better sooner. Shall I go ahead and process your order for the starter pack today?"`,
    },
    {
      id: "summary",
      title: "The Summary Close",
      content: `"So, to recap, the Freedom patch offers you drug-free, non-invasive relief for those nagging shoulder and neck pains you've been experiencing, allowing you to get back to enjoying your morning walks and sleeping better at night, all through a simple, discreet patch. Given all these benefits, are you ready to start experiencing the freedom from those aches?"`,
    },
    {
      id: "referral",
      title: "The Referral Close",
      content: `"That's fantastic! I'm so excited for you to experience the relief with Freedom. As you start to feel better, who else do you know – maybe a friend, family member, or colleague – who also struggles with minor aches and pains and would benefit from a natural, drug-free solution like this?"`,
    },
  ],

  followUpSequences: [
    {
      day: "Day 1",
      title: "Post-Meeting Thank You & Next Steps",
      voicemail: `"Hi [Prospect's Name], this is [Your Name] from Super Patch. It was great connecting with you today about the Freedom patch and how it can help with those minor aches and pains. I just wanted to thank you for your time and send over the information we discussed. I'll follow up with an email shortly. Feel free to call me back at [Your Phone Number] if any questions pop up. Have a great day!"`,
      text: `"Hi [Prospect's Name]! Thanks again for your time today. Excited for you to learn more about Freedom. Just sent an email with details. Let me know if you have any Qs! 😊 [Your Name]"`,
    },
    {
      day: "Day 3",
      title: "Value Add & Gentle Reminder",
      email: `Subject: Quick thought on your [specific pain point] + Freedom Patch

"Hi [Prospect's Name],

Hope your week is going well!

I was thinking about our conversation the other day regarding your [specific pain point, e.g., 'lower back discomfort'] and how it impacts your [specific activity, e.g., 'ability to relax in the evenings'].

Many people are surprised by how quickly the Freedom patch can make a difference in those everyday aches. It's truly empowering to have a drug-free option.

Have you had a chance to review the information I sent over? I'd be happy to answer any further questions you might have or share a quick testimonial from someone who had similar experiences.

Looking forward to hearing from you!

Best,
[Your Name]"`,
      text: `"Hey [Prospect's Name]! Just checking in. Any thoughts on the Freedom patch? Curious if you had any Qs after looking at the info. No pressure, just here to help! [Your Name]"`,
    },
    {
      day: "Day 7",
      title: "Testimonial & Offer More Info",
      email: `Subject: Imagine [desired outcome] with Freedom Patch

"Hi [Prospect's Name],

Just wanted to share a quick story that reminded me of our chat. One of my customers, Sarah, used to struggle daily with [similar pain point, e.g., 'stiff neck and shoulders'], much like you mentioned. After trying Freedom, she told me, 'It's incredible! I can actually turn my head without discomfort, and I'm sleeping so much better.'

It's amazing how a simple, drug-free patch can make such a big difference in daily comfort.

If you're still considering options for your minor aches, I'd love to hop on a quick call to share more about how it works, or even send you a short video. What works best for you?

Warmly,
[Your Name]"`,
      voicemail: `"Hi [Prospect's Name], it's [Your Name] again. Just wanted to share a quick story from a customer who found great relief from their daily aches with the Freedom patch, much like what we discussed. I've sent you an email with some more info, but I'd love to hear your thoughts or answer any questions you might have. My number is [Your Phone Number]. Hope you're having a comfortable week!"`,
    },
    {
      day: "Day 14",
      title: "\"Breakup\" or Re-engagement",
      email: `Subject: Checking in one last time about Freedom Patch

"Hi [Prospect's Name],

I haven't heard back from you, which tells me one of a few things:

1. You've already found a solution for your minor aches and pains (which is great!).
2. Now isn't the right time for you to explore a new wellness solution.
3. You're simply swamped and haven't had a chance to respond.

No worries at all! I totally get it. I just wanted to reach out one last time to make sure I wasn't leaving you hanging if you were still interested.

If you do decide in the future that a natural, drug-free way to manage those everyday aches is something you'd like to explore, please don't hesitate to reach out. I'm always here to help.

Wishing you all the best,
[Your Name]"`,
      text: `"Hey [Prospect's Name], just a final check-in on the Freedom patch. If you've found a solution or it's not the right time, no problem at all! If anything changes, you know where to find me. Wishing you well! [Your Name]"`,
    },
  ],

  testimonialPrompts: [
    "Before you started using the Freedom patch, what specific aches or discomforts were you experiencing, and how were they impacting your daily life?",
    "What other solutions had you tried for those aches, and what were your results?",
    "What made you decide to try the Freedom patch?",
    "After using the Freedom patch, what changes have you noticed? Can you describe how you feel now compared to before?",
    "How has the Freedom patch specifically helped you 'take care of those minor aches and pains' and improved your ability to [mention specific activity]?",
    "What do you love most about the Freedom patch – is it the drug-free aspect, the ease of use, or the consistent relief?",
    "Would you recommend the Freedom patch to others, and if so, who would benefit most from it?",
    "If you had to sum up your experience with Freedom in one sentence, what would it be?",
  ],

  quickReference: {
    keyBenefits: [
      "Drug-Free Pain Relief: Natural, non-invasive, no chemicals or side effects",
      "Simple & Discreet: Easy to apply, wear anywhere, anytime",
      "Vibrotactile Technology (VTT): Works *with* your body to trigger natural relief",
    ],
    bestQuestions: [
      "What activities do you find yourself holding back on, or avoiding altogether, because of minor aches?",
      "On a scale of 1 to 10, how much do these minor aches impact your daily comfort?",
      "What are the most important factors for you in a solution for aches – e.g., drug-free, ease of use, speed?",
    ],
    topObjections: [
      {
        objection: "Too Expensive",
        shortResponse: "What other criteria are most important for you beyond just the initial price?",
      },
      {
        objection: "Does it work?",
        shortResponse: "What would you need to see, hear, or experience to truly feel this is credible?",
      },
      {
        objection: "Need to think about it",
        shortResponse: "What specific questions would be most helpful for you to think through?",
      },
    ],
    bestClosingLines: [
      "Since Freedom aligns with your desire for natural relief, how many boxes should we start you with today?",
      "Would you prefer to start with a single box to try it out, or would the 3-pack be a better value for your needs?",
    ],
    keyStats: [
      "RESTORE Study: Peer-reviewed RCT with 118 participants",
      "Significant pain reduction vs. placebo",
      "Improved range of motion at Day 7 and Day 14",
      "100% drug-free, non-invasive",
    ],
  },
};

