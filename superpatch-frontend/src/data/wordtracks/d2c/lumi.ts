import { WordTrack } from "@/types/wordtrack";

export const lumiD2CWordTrack: WordTrack = {
  id: "d2c-lumi",
  productId: "lumi",
  marketId: "d2c",
  productOverview: `<p><strong>Lumi</strong> is a revolutionary beauty patch designed to help individuals achieve healthier, more radiant skin naturally. It's not a topical cream or a supplement; instead, Lumi utilizes Super Patch's innovative <strong>Vibrotactile Technology (VTT)</strong>.</p>
<p>This means specialized ridge patterns on the patch interact gently with the skin's mechanoreceptors, triggering the body's own neural responses to support skin appearance, enhance complexion, and provide overall beauty support.</p>
<p>For anyone seeking to complement their healthy lifestyle with enhanced skin care, Lumi offers a unique, non-invasive, 100% drug-free, and all-natural solution. It's for those who want to feel more confident and vibrant in their skin without relying on harsh chemicals or complex routines.</p>`,
  
  idealCustomerProfile: {
    demographics: "Age 30-65 (though can appeal to younger or older depending on specific concerns). Middle to upper-middle class with disposable income for wellness and beauty products. Primarily female, but also increasingly appealing to men who prioritize skin health.",
    psychographics: "Values health, wellness, natural solutions, self-care, looking good, confidence, efficacy, convenience, and innovation. Often proactive about health and appearance. Open to new technologies, skeptical of 'quick fixes' but hopeful for genuine solutions. Prefers natural over synthetic.",
    painPoints: [
      "Dull, lackluster skin",
      "Uneven skin tone or texture",
      "Lack of radiance or 'glow'",
      "Feeling less confident about skin's appearance",
      "Concern about visible signs of aging (fine lines, sagging)",
      "Sensitivity or adverse reactions to topical creams and serums",
      "Lack of time for elaborate skincare routines",
      "Frustration with products that promise much but deliver little",
      "Desire for a 'healthy glow' that comes from within"
    ],
    previousSolutions: [
      "Various topical creams, serums, and moisturizers",
      "Dietary supplements for skin health (collagen, vitamins)",
      "Facials, microdermabrasion, or other salon treatments",
      "Prescription skincare products",
      "DIY home remedies"
    ]
  },

  openingScripts: [
    {
      title: "Cold Approach (Stranger)",
      scenario: "At a coffee shop, gym, or public place",
      content: `"Hi there! I couldn't help but notice your [unique accessory/shirt/positive energy]. I'm [Your Name], it's great to meet you. I actually work with a really cool wellness technology that helps people boost their natural radiance and skin appearance, and something about your vibe/style made me think of it. If you're open to it, I'd love to share a little more sometime."`
    },
    {
      title: "Warm Introduction (Friend/Family)",
      scenario: "Reaching out to someone you know",
      content: `"Hey [Friend/Family Member's Name]! How have you been? You know, I've been really excited about something new I'm involved with that I genuinely think could be a game-changer for you, especially knowing how much you care about natural health and looking your best. It's a non-invasive way to support your skin's natural radiance. Are you open to hearing a bit about it?"`
    },
    {
      title: "Social Media DM",
      scenario: "Connecting via direct message",
      content: `"Hi [Name]! I've been following your posts for a while and really admire your commitment to wellness and healthy lifestyle. I work with a unique beauty technology called Lumi that helps people enhance their natural skin radiance, and I immediately thought of you. It's 100% natural and drug-free. Would you be open to a quick chat to see if it might be a fit for what you're looking for?"`
    },
    {
      title: "Referral Introduction",
      scenario: "When referred by a mutual contact",
      content: `"Hi [Name], my name is [Your Name]. [Referral Source] suggested I reach out to you; they mentioned you're someone who really values natural wellness and a healthy lifestyle. I'm introducing people to Lumi, a revolutionary patch that uses your body's own signals to support radiant skin. [Referral Source] thought you'd be really interested in how it works. Are you free for a quick call sometime this week?"`
    },
    {
      title: "Event/Party Approach",
      scenario: "At a social gathering",
      content: `"What a great event, isn't it? Hi, I'm [Your Name]. I'm curious, what brings you here tonight? [Listen and engage]. You know, as we're chatting, I'm reminded of the work I do. I help people tap into their body's natural ability to achieve healthier, more radiant skin, completely non-invasively. Have you ever explored solutions that work with your body for beauty support?"`
    }
  ],

  discoveryQuestions: [
    { question: "When it comes to your overall wellness, what aspects are you currently most focused on or interested in improving?", category: "opening" },
    { question: "How do you currently approach caring for your skin and maintaining your beauty routine?", category: "opening" },
    { question: "What does 'healthy, radiant skin' mean to you personally?", category: "opening" },
    { question: "What are some of the biggest challenges or frustrations you've experienced with your skin lately?", category: "pain" },
    { question: "If you could magically improve one thing about your skin's appearance right now, what would it be?", category: "pain" },
    { question: "Are there any aspects of your current skincare routine that you find complicated, time-consuming, or just not giving you the results you hoped for?", category: "pain" },
    { question: "How does the current state of your skin make you feel on a day-to-day basis?", category: "impact" },
    { question: "If you had the radiant, healthy skin you truly desired, how do you imagine that would impact your confidence or daily life?", category: "impact" },
    { question: "When you're considering new products or solutions for your skin, what are the most important criteria for you? (e.g., natural, effective, easy to use, gentle)", category: "solution" },
    { question: "What would truly excite you in a beauty solution right now?", category: "solution" }
  ],

  productPresentation: `<p><strong>[Problem]</strong> "Many people I speak with are looking for that natural, healthy glow, but they're often frustrated. They've tried countless creams, serums, and even supplements, only to find their skin still looks dull, uneven, or just not as vibrant as they'd like. Some are even sensitive to all the chemicals in topical products, or they just don't have the time for complex routines."</p>

<p><strong>[Agitate]</strong> "It's disheartening when you invest time and money into products that don't deliver. That feeling of looking in the mirror and not seeing the radiant skin you want can really impact your confidence, making you feel less vibrant and sometimes even self-conscious. You deserve a solution that genuinely supports your natural beauty, without adding more complexity or worry to your life."</p>

<p><strong>[Solve]</strong> "That's exactly why I'm so excited about <strong>Lumi</strong>. It's a completely different approach. Instead of putting things on or in your body, Lumi uses our unique Vibrotactile Technology – specialized patterns on a small patch that gently interact with your skin. This naturally triggers your body's own neural responses to support skin appearance, enhance your radiant complexion, and provide overall beauty support. It's 100% drug-free, all-natural, and non-invasive. Think of it as activating your body's inherent intelligence for beauty, giving you that healthy, luminous glow from within. It's simple, effective, and works with your body, not against it."</p>`,

  objectionHandling: [
    {
      objection: "It's too expensive",
      response: "I understand that cost is an important factor when you're considering new wellness solutions, and you want to make a smart investment. What other criteria are most important for you when evaluating the value of a product that supports your skin's health and appearance?",
      psychology: "Validates concern, opens discussion about total value."
    },
    {
      objection: "I need to think about it",
      response: "I completely understand that this is a decision you want to feel good about, and it's important to take your time. What specific questions or considerations are coming up for you as you think it over that I might be able to help clarify?",
      psychology: "Acknowledges need for reflection, uncovers specific concerns."
    },
    {
      objection: "I need to talk to my spouse",
      response: "I understand this is a significant decision for your health and well-being, and you want to ensure it's the right fit for your household. What specific questions or concerns do you anticipate your spouse might have that we could address together?",
      psychology: "Respects partnership, helps prepare key talking points."
    },
    {
      objection: "Does it really work? It sounds too good to be true",
      response: "I completely understand why you might be skeptical about new technologies, and it's important to feel confident in your choices. What would you need to see, hear, or experience to truly feel that Lumi is a credible solution for you?",
      psychology: "Validates skepticism, opens door to providing evidence."
    },
    {
      objection: "I've tried patches/products before, and they haven't worked",
      response: "I understand you've had experiences with other products in the past, and it can be frustrating when they don't deliver. What did you like or dislike about those previous products, and what were you hoping they would achieve for your skin?",
      psychology: "Shows empathy, gathers info to differentiate Lumi."
    },
    {
      objection: "I'm not interested",
      response: "I understand that you might not be actively looking for new solutions right now, and I respect that. Just out of curiosity, what has led you to feel that way about beauty and wellness products in general?",
      psychology: "Respects position, gently probes for underlying concerns."
    },
    {
      objection: "I don't have time",
      response: "I completely understand, life can get incredibly busy, and adding another thing to your routine might seem daunting. What aspects of your current skincare or wellness routine do you find most time-consuming, and what kind of time commitment would make a new solution truly appealing to you?",
      psychology: "Acknowledges busy life, positions Lumi as time-saving."
    },
    {
      objection: "How is this different from [competitor/topical cream]?",
      response: "That's a great question, and I understand you're looking for what makes Lumi unique. What have you found most appealing or effective about [competitor/topical cream], and what, if anything, are you hoping to find that it might not be providing?",
      psychology: "Shows respect for research, gathers positioning intel."
    }
  ],

  closingScripts: [
    {
      title: "The Assumptive Close",
      content: `"Great! So, based on what we've discussed, it sounds like the Lumi patches are exactly what you've been looking for to enhance your natural radiance. Which package would you like to start with today to begin your journey to healthier, more vibrant skin?"`
    },
    {
      title: "The Alternative Close",
      content: `"Considering your desire for more radiant skin with a natural approach, would you prefer to get started with our 30-day supply to experience the benefits, or would the 90-day package be a better fit for a more sustained transformation?"`
    },
    {
      title: "The Urgency Close",
      content: `"Many people are seeing incredible results with Lumi, and right now, we have a special offer for new customers that includes [specific bonus/discount] if you get started this week. Given how excited you are about achieving radiant skin, it would be a shame to miss out on that. Shall we go ahead and secure that for you today?"`
    },
    {
      title: "The Summary Close",
      content: `"So, we've talked about how Lumi can help you achieve that radiant complexion, support your skin's appearance, and integrate seamlessly into your healthy lifestyle, all through a non-invasive, drug-free technology. You mentioned how important feeling confident in your skin is to you. Given all of that, are you ready to start experiencing the Lumi difference?"`
    },
    {
      title: "The Comfort Close",
      content: `"Based on everything we've discussed, and how Lumi aligns with your goals for healthier, more radiant skin, how comfortable are you with moving forward and giving this a try? I'm here to make sure you feel completely confident in your decision."`
    }
  ],

  followUpSequences: [
    {
      day: "Day 1",
      title: "Initial Follow-Up",
      voicemail: `"Hi [Name], this is [Your Name] from Super Patch. I really enjoyed our conversation today about Lumi and how it can help you achieve that radiant skin you're looking for. I wanted to follow up and see if any new questions have come up for you. My number is [Your Number]. Looking forward to connecting again soon!"`,
      text: `"Hi [Name]! Great connecting today about Lumi. Hope you're having a fantastic day! Let me know if any questions pop up. 😊"`
    },
    {
      day: "Day 3",
      title: "Value-Add Follow-Up",
      voicemail: `"Hi [Name], it's [Your Name] again. Just wanted to quickly share a link to a short video about how our Vibrotactile Technology works – it really helps explain the science behind Lumi's beauty benefits. I'll send it in a text. Give me a call if you have any questions after watching it."`,
      text: `"Hey [Name]! Just checking in to see if you had a chance to think about Lumi. I'm happy to answer any questions that might have come up since we last spoke! ✨"`
    },
    {
      day: "Day 7",
      title: "Social Proof Follow-Up",
      text: `"Hi [Name], wanted to share a quick testimonial from someone who absolutely loves their Lumi patches for a radiant glow! [Link to testimonial]. Just a thought! What are your thoughts on it so far?"`
    },
    {
      day: "Day 14",
      title: "Final Outreach",
      text: `"Hey [Name], wanted to circle back on Lumi. I know you mentioned wanting more radiant skin naturally. I truly believe Lumi could make a significant difference for you. If now isn't the right time, that's perfectly fine, but if you're still curious, I'm here to help. What's the best way to move forward for you?"`
    }
  ],

  quickReference: {
    keyBenefits: [
      "Radiant Complexion: Enhances natural glow and vibrancy",
      "Improved Skin Appearance: Supports overall skin health and texture",
      "Effortless Beauty Support: Non-invasive, drug-free, and easy to use"
    ],
    bestQuestions: [
      "What are some of the biggest challenges or frustrations you've experienced with your skin lately?",
      "If you could magically improve one thing about your skin's appearance right now, what would it be?",
      "When you're considering new products for your skin, what are the most important criteria for you?"
    ],
    topObjections: [
      { objection: "Too expensive", shortResponse: "What other criteria are most important for you when evaluating value?" },
      { objection: "Does it really work?", shortResponse: "What would you need to see, hear, or experience to feel confident?" },
      { objection: "I need to think about it", shortResponse: "What specific questions or considerations are coming up for you?" }
    ],
    bestClosingLines: [
      "Which package would you like to start with today to begin your journey to healthier, more vibrant skin?",
      "Based on everything we've discussed, how comfortable are you with moving forward and giving Lumi a try?"
    ]
  }
};

