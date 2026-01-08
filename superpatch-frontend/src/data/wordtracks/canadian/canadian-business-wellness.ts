import { WordTrack } from "@/types/wordtrack";

export const canadianBusinessWellnessWordTrack: WordTrack = {
  id: "canadian-business-wellness",
  productId: "wellness-program",
  market: "canadian",
  title: "Canadian Business Wellness Program Sales Word Track",
  overview: `SuperPatch offers a comprehensive, drug-free wellness solution for Canadian businesses looking to enhance employee health, reduce absenteeism, and improve workplace productivity. Our proprietary Vibrotactile Technology (VTT) delivers measurable results across multiple wellness domains without the side effects, dependency risks, or time commitments of traditional wellness programs.

Target Market: Canadian Businesses (Chamber of Commerce Network)
Opportunity: $600M-900M Annual Market | 200,000+ Businesses | 2.16M Employees

Why SuperPatch for Corporate Wellness?

For the Business:
• Reduce Absenteeism: 20-30% reduction in sick days
• Lower Benefits Costs: 25-35% reduction in pharmaceutical claims
• Improve Productivity: 15-25% gain from reduced presenteeism
• Enhance Retention: 5-10% lower turnover
• Attract Talent: Innovative benefits differentiate your employer brand

For Employees:
• Drug-Free: Zero side effects, zero dependency risk
• Self-Administered: No appointments, no time off work required
• Immediate Results: Benefits within minutes to hours
• Multi-Domain: One solution for sleep, pain, stress, and performance
• Simple: Peel, stick, and go about your day`,

  openingScripts: [
    // HR Director Scripts
    {
      id: "can-hr-cold-call",
      title: "HR Director Cold Call Opening",
      scenario: "Initial outreach to HR Directors / Benefits Managers",
      script: `"Good morning/afternoon [Name], this is [Your Name] with SuperPatch. I'm reaching out because we work with Canadian companies to reduce benefits costs and absenteeism through our drug-free wellness technology. 

Many HR leaders I speak with are dealing with rising healthcare costs and employees who aren't engaging with traditional wellness programs. Is that something you're experiencing at [Company Name]?"

[If they say yes]
"I'd love to share how companies like [similar company or industry peer] have seen 20-30% reductions in absenteeism and significant savings on pharmaceutical claims. Do you have 15 minutes this week for a brief conversation?"

[If they're busy]
"I understand you're busy. Would it be helpful if I sent you a one-page overview showing the ROI other Canadian companies have achieved? Then we could schedule a brief call if it looks relevant."`
    },
    {
      id: "can-hr-email",
      title: "HR Director Email Introduction",
      scenario: "Written introduction to HR Directors",
      script: `Subject: Reducing benefits costs at [Company Name]

Hi [Name],

I noticed [Company Name] is [growing/hiring/in a competitive industry], and I wanted to reach out about a wellness solution that's helping Canadian businesses like yours reduce costs while improving employee health.

SuperPatch is a drug-free wellness technology that helps employees with:
• Better sleep (50% faster sleep onset)
• Less pain (without medications)
• Reduced stress (33% improvement)
• Enhanced focus and energy

The business impact? Companies are seeing:
• 20-30% reduction in absenteeism
• 25-35% lower pharmaceutical claims
• 15-25% productivity improvement

Unlike traditional wellness programs that require time commitments and have low adoption, SuperPatch is self-administered and delivers immediate results.

Would you be open to a 15-minute call to explore if this could work for [Company Name]?

Best,
[Your Name]
SuperPatch Corporate Wellness`
    },
    // SMB Owner Scripts
    {
      id: "can-smb-cold-call",
      title: "Small Business Owner Cold Call",
      scenario: "Initial outreach to small business owners/CEOs",
      script: `"Hi [Name], this is [Your Name] with SuperPatch. I'm calling because we help small businesses compete with bigger companies when it comes to employee wellness - without the big company price tag.

Quick question: When your employees are dealing with poor sleep, aches and pains, or stress, how does that affect your business?"

[If they engage]
"What I hear from most business owners is that it directly hits their bottom line through sick days and lower productivity. We've developed a simple, drug-free solution that helps employees feel better and show up at their best. Companies are seeing significant reductions in sick time. Do you have 10 minutes to hear how it works?"

[If they're skeptical]
"I totally get it - you probably get pitched wellness programs all the time. What makes this different is that it actually works and employees actually use it - we're talking 60%+ adoption versus 10-20% for typical programs. Worth a quick conversation?"`
    },
    {
      id: "can-smb-email",
      title: "Small Business Owner Email",
      scenario: "Written introduction to SMB owners",
      script: `Subject: Keeping your team healthy (without breaking the budget)

Hi [Name],

When one of your employees calls in sick or shows up exhausted and stressed, you feel it directly in your business. Unlike big companies that can absorb those costs, every missed day and every drop in productivity hits your bottom line.

That's why I wanted to introduce SuperPatch - a simple, drug-free wellness solution that helps your employees:
• Sleep better (no more dragging through the day)
• Feel less pain (without popping pills)
• Handle stress (without burning out)
• Stay energized (without the caffeine crashes)

It's not another complicated wellness program. It's a patch they wear that actually works - and businesses are seeing 20-30% fewer sick days as a result.

The best part? It's affordable for businesses of any size and takes zero administrative time from you.

Interested in learning more? I can explain everything in a 10-minute call.

[Your Name]
SuperPatch`
    },
    // Chamber Scripts
    {
      id: "can-chamber-cold-call",
      title: "Chamber of Commerce Executive Cold Call",
      scenario: "Initial outreach to chamber executives",
      script: `"Good morning/afternoon [Name], this is [Your Name] with SuperPatch. I'm reaching out because we're looking to partner with chambers of commerce to bring an innovative wellness solution to their member businesses.

We've been working with businesses across Canada to reduce healthcare costs and absenteeism through our drug-free Vibrotactile Technology. I believe this could be a valuable addition to your member benefits program. 

Do you have a few minutes to discuss how a partnership might work?"`
    },
    {
      id: "can-chamber-email",
      title: "Chamber Partnership Email",
      scenario: "Written introduction to chamber executives",
      script: `Subject: Partnership opportunity for [Chamber Name] members

Dear [Name],

I'm reaching out regarding a potential partnership between SuperPatch and [Chamber Name] that could bring significant value to your member businesses.

SuperPatch has developed a drug-free wellness technology that's helping Canadian businesses:
• Reduce absenteeism by 20-30%
• Lower pharmaceutical benefit costs by 25-35%
• Improve employee productivity by 15-25%

For chambers, we offer:
• Exclusive member pricing (not available elsewhere)
• Revenue sharing on member purchases
• Co-branded marketing materials
• Educational webinars for members
• Turnkey implementation support

We're already working with chambers across [Province/Canada] and would love to explore how this could benefit [Chamber Name] members.

Would you be available for a 20-minute call to discuss partnership options?

Best regards,
[Your Name]
SuperPatch Business Development`
    }
  ],

  discoveryQuestions: [
    // HR Director Questions
    {
      id: "can-hr-q1",
      question: "Can you walk me through your current wellness program? What's working well, and where do you see gaps?",
      category: "opening"
    },
    {
      id: "can-hr-q2",
      question: "How would you describe employee engagement with your existing wellness offerings?",
      category: "opening"
    },
    {
      id: "can-hr-q3",
      question: "What are your top three priorities for employee health and benefits this year?",
      category: "opening"
    },
    {
      id: "can-hr-q4",
      question: "How significant is absenteeism at your organization? Do you track the costs associated with it?",
      category: "pain_point"
    },
    {
      id: "can-hr-q5",
      question: "What portion of your benefits claims come from pharmaceuticals like sleep aids, pain medications, or stress-related prescriptions?",
      category: "pain_point"
    },
    {
      id: "can-hr-q6",
      question: "When it comes to employee wellness, what keeps you up at night?",
      category: "pain_point"
    },
    {
      id: "can-hr-q7",
      question: "How is your current approach addressing challenges like burnout, chronic pain, or sleep issues among employees?",
      category: "pain_point"
    },
    {
      id: "can-hr-q8",
      question: "If you could wave a magic wand and solve one health-related problem affecting your workforce, what would it be?",
      category: "impact"
    },
    {
      id: "can-hr-q9",
      question: "How does your wellness program compare to your competitors when you're trying to attract talent?",
      category: "impact"
    },
    {
      id: "can-hr-q10",
      question: "When evaluating a new wellness solution, what criteria matter most to you?",
      category: "solution"
    },
    {
      id: "can-hr-q11",
      question: "Who else would be involved in a decision to add a new wellness benefit?",
      category: "solution"
    },
    {
      id: "can-hr-q12",
      question: "What does success look like for you in a wellness program - what metrics do you report on?",
      category: "solution"
    },
    // SMB Owner Questions
    {
      id: "can-smb-q1",
      question: "When it comes to employee health and wellness, what are you currently offering your team?",
      category: "opening"
    },
    {
      id: "can-smb-q2",
      question: "How does employee health - things like sick days, fatigue, or stress - impact your business day-to-day?",
      category: "opening"
    },
    {
      id: "can-smb-q3",
      question: "When employees call in sick or aren't at their best, how does that affect your operations?",
      category: "pain_point"
    },
    {
      id: "can-smb-q4",
      question: "Are you seeing issues with stress or burnout among your team?",
      category: "pain_point"
    },
    {
      id: "can-smb-q5",
      question: "How hard is it for you to compete for talent against bigger companies with more robust benefits?",
      category: "impact"
    },
    {
      id: "can-smb-q6",
      question: "If I could show you a simple solution that reduces sick days and helps employees feel better, what would you need to see to consider it?",
      category: "solution"
    },
    // Chamber Questions
    {
      id: "can-chamber-q1",
      question: "What are the top challenges your member businesses are facing right now?",
      category: "opening"
    },
    {
      id: "can-chamber-q2",
      question: "How important is workplace wellness to your members?",
      category: "opening"
    },
    {
      id: "can-chamber-q3",
      question: "What are your priorities for increasing member value this year?",
      category: "pain_point"
    },
    {
      id: "can-chamber-q4",
      question: "How do you currently generate revenue beyond membership dues?",
      category: "impact"
    },
    {
      id: "can-chamber-q5",
      question: "What would make a partnership successful from your perspective?",
      category: "solution"
    }
  ],

  productPresentation: {
    problem: `Canadian businesses lose an average of 9.3 days per employee per year to illness and health issues. That's costing approximately $3,300 per employee annually in lost productivity. Rising healthcare costs, low engagement with traditional wellness programs, and increasing mental health challenges are straining HR budgets and impacting business performance.`,
    agitate: `Traditional wellness programs have failed to deliver results - only 10-20% of employees actually engage with gym memberships, meditation apps, or nutrition programs. Meanwhile, absenteeism continues to rise, pharmaceutical claims keep climbing, and employees are burning out. The cost of doing nothing is $10,000 per employee per year in presenteeism alone.`,
    solve: `SuperPatch is a comprehensive, drug-free wellness solution that addresses the root causes of absenteeism and lost productivity: poor sleep, pain, and stress.

Here's how it works: Our Vibrotactile Technology uses specialized patterns on a patch that interact with the body's natural neural pathways. Employees simply apply the patch and go about their day - no appointments, no pills, no side effects.

The result? Employees sleep better, feel less pain, handle stress better, and show up to work ready to perform. Unlike traditional wellness programs with 10-20% engagement, we see 60%+ of employees actively using SuperPatch because it's simple and it works.`,
    fullScript: `"Based on what you've shared about [specific pain points they mentioned], let me show you how SuperPatch can deliver measurable value to [Company Name].

[PROBLEM RECAP - 30 seconds]
You mentioned that [absenteeism/rising costs/employee burnout/etc.] is a significant challenge. You're not alone - Canadian businesses lose an average of 9.3 days per employee per year to illness and health issues. That's costing you approximately $3,300 per employee annually in lost productivity.

[SOLUTION - 60 seconds]
SuperPatch is a comprehensive, drug-free wellness solution that addresses the root causes of absenteeism and lost productivity: poor sleep, pain, and stress.

Here's how it works: Our Vibrotactile Technology uses specialized patterns on a patch that interact with the body's natural neural pathways. Employees simply apply the patch and go about their day - no appointments, no pills, no side effects.

The result? Employees sleep better, feel less pain, handle stress better, and show up to work ready to perform. Unlike traditional wellness programs with 10-20% engagement, we see 60%+ of employees actively using SuperPatch because it's simple and it works.

[ROI - 60 seconds]
Let me share what this means for your bottom line:

For a company with [X] employees like yours:
- Absenteeism: A 25% reduction in sick days could save you [$X] annually
- Productivity: Even a 15% improvement in presenteeism is worth [$X]
- Pharmaceutical costs: A 30% reduction in sleep, pain, and stress medications saves [$X]
- Retention: Reducing turnover by just 5% saves [$X] in replacement costs

Companies are seeing a 3-5x return on their SuperPatch investment. And unlike complex wellness programs, this requires almost zero administrative time from you.

Does this sound like something that could help [Company Name]? I'd love to discuss how we could structure a program for your team."`
  },

  objections: [
    // Budget Objections
    {
      id: "can-obj-no-budget",
      objection: "We don't have budget for this.",
      response: `"I completely understand - every expense needs to be justified. Let me ask you this: what is absenteeism currently costing you? 

[If they don't know] Most Canadian businesses spend about $3,300 per employee per year on sick days and reduced productivity. For a company your size, that's potentially [$X]. 

SuperPatch typically delivers a 3-5x return on investment. Would it be worth exploring if we could actually save you money rather than cost you money?"`,
      psychology: "Reframe from cost to investment. Lead with their current invisible costs."
    },
    {
      id: "can-obj-too-expensive",
      objection: "It's too expensive.",
      response: `"That's fair - cost matters. Can I ask what you're comparing it to?

[Listen]

What I find is that when you look at the total cost of employee health issues - the sick days, the pharmaceutical claims, the lost productivity, the turnover - SuperPatch actually costs less than doing nothing. 

Let me run a quick ROI calculation for your specific situation. What's your current absenteeism rate?"`,
      psychology: "Ask what they're comparing to, then show total cost of ownership."
    },
    {
      id: "can-obj-cut-costs",
      objection: "We need to cut costs, not add them.",
      response: `"That makes total sense, and I wouldn't ask you to add a cost without a clear return. Here's what's interesting: companies are actually using SuperPatch to *reduce* their overall benefits spend.

When employees sleep better and have less pain, they use fewer pharmaceutical benefits. When they're less stressed, they take fewer sick days. The net result is cost savings, not a new expense.

Would you be open to seeing the math on how this could work for your budget?"`,
      psychology: "Position as cost reduction tool, not expense."
    },
    // Skepticism Objections
    {
      id: "can-obj-too-good",
      objection: "Does this really work? It sounds too good to be true.",
      response: `"I appreciate the skepticism - you should be skeptical of any wellness claim. Here's what I'd say:

First, the technology is based on Nobel Prize-winning research from 2021 on how the body's mechanoreceptors work. This is real science, not hype.

Second, we have peer-reviewed clinical studies showing measurable results - faster sleep onset, pain reduction, stress improvement.

But most importantly, I'm not asking you to take my word for it. What if we started with a small pilot - maybe 20-30 employees - and let you see the results for yourself before making any bigger commitment?"`,
      psychology: "Lead with credibility (Nobel Prize), offer proof through pilot."
    },
    {
      id: "can-obj-tried-wellness",
      objection: "We've tried wellness programs before and they didn't work.",
      response: `"That's actually really common, and there's a reason for it. Traditional wellness programs require employees to change their behavior - go to the gym, meditate, eat better. That takes time and motivation, so engagement is usually 10-20% at best.

SuperPatch is different. Employees don't have to do anything except put on a patch. It takes 5 seconds. That's why we see 60%+ engagement. And because the technology works immediately - not over weeks or months - employees actually feel the difference and keep using it.

What was the main reason your previous programs failed to get traction?"`,
      psychology: "Acknowledge past failures, differentiate on effort and immediate results."
    },
    {
      id: "can-obj-wont-use",
      objection: "Our employees won't use it.",
      response: `"That's a legitimate concern - what good is a wellness program if nobody uses it?

Here's what we've found: the #1 barrier to wellness program adoption is time and effort. SuperPatch removes that barrier entirely. It's a patch you put on in the morning - that's it. No appointments, no classes, no logging into apps.

The other barrier is results. If something works, people keep using it. When employees feel better sleep after the first night or less pain after the first day, they become advocates.

What would make your employees more likely to engage with a wellness program?"`,
      psychology: "Address adoption barriers directly with simplicity and immediate results."
    },
    // Timing Objections
    {
      id: "can-obj-not-right-time",
      objection: "This isn't the right time.",
      response: `"I understand timing is everything. Can I ask what would make it the right time?

[Listen]

Here's my thought: employee health issues don't wait for the right time. Every week you wait is another week of sick days, lost productivity, and stressed employees.

What if we structured something that could start small and scale up when timing is better? A pilot program requires minimal commitment but lets you see the value firsthand."`,
      psychology: "Explore their timing concerns, offer low-commitment pilot."
    },
    {
      id: "can-obj-enrollment",
      objection: "We're in the middle of open enrollment / benefits renewal.",
      response: `"That actually might be perfect timing. Many companies introduce SuperPatch as part of their benefits refresh - it gives employees something new and valuable to look forward to.

If you're evaluating your benefits program anyway, wouldn't this be the ideal time to consider an addition that could actually reduce your overall costs?

When is your [enrollment period / renewal decision]? We could prepare a proposal for that timeline."`,
      psychology: "Reframe as perfect timing for benefits decisions."
    },
    // Competition Objections
    {
      id: "can-obj-already-have",
      objection: "We already have a wellness program.",
      response: `"That's great - it shows you value employee health. Tell me about your current program - what's working well?

[Listen]

SuperPatch isn't meant to replace what you have. It's designed to complement existing programs by addressing the physical factors - sleep, pain, stress - that often prevent employees from benefiting from other wellness initiatives.

Think about it: if an employee isn't sleeping well, they're not going to have the energy for that gym membership or meditation app. SuperPatch helps create the foundation for everything else to work better.

Would it be worth exploring how this could enhance what you're already doing?"`,
      psychology: "Position as complement, not competitor. Sleep/pain as foundation."
    },
    {
      id: "can-obj-pharma",
      objection: "We offer pharmaceutical benefits for these issues.",
      response: `"Pharmaceutical coverage is important - I'm not suggesting you change that. The challenge is that many employees either don't want to take medications (because of side effects or dependency concerns) or are looking for non-drug alternatives.

SuperPatch gives employees another option - one that's drug-free and has no side effects. And here's the business case: when employees use SuperPatch instead of prescriptions, your pharmaceutical claims go down.

We've seen companies reduce sleep, pain, and stress medication claims by 25-35%. What would that kind of reduction mean for your benefits costs?"`,
      psychology: "Position as alternative option that reduces pharma costs."
    },
    // Canadian-Specific Objections
    {
      id: "can-obj-approved",
      objection: "Is this approved in Canada?",
      response: `"Great question. SuperPatch is a wellness technology, not a pharmaceutical or medical device, so it doesn't require Health Canada drug approval. It's similar to acupressure or other non-invasive wellness products.

That said, our technology is based on peer-reviewed clinical research and Nobel Prize-winning science. We're committed to the highest standards of safety and efficacy.

Would you like me to share the clinical studies for your review?"`,
      psychology: "Clarify regulatory status, emphasize research credibility."
    },
    {
      id: "can-obj-canadian-refs",
      objection: "Do you have Canadian references / case studies?",
      response: `"We're building our Canadian presence and working with businesses across the country. While I can share case studies from our broader portfolio, I'd also suggest this: let's create a case study together.

If we pilot SuperPatch at [Company Name] and you see the results we expect, you'd be a reference for other Canadian businesses. And frankly, that's more valuable to you than hearing about someone else - you'd have your own data.

Would a pilot be something you'd consider?"`,
      psychology: "Turn lack of references into opportunity for partnership."
    },
    // Authority Objections
    {
      id: "can-obj-discuss-ceo",
      objection: "I need to discuss this with my CEO / CFO / board.",
      response: `"Absolutely - this is an important decision. What information would be most helpful for that conversation?

[Listen]

Let me prepare a business case summary with ROI projections specific to [Company Name]. I can include case studies from similar companies and the key points that typically resonate with [CEOs/CFOs/boards].

Would it be helpful if I joined that conversation to answer any questions, or would you prefer to present it yourself first?"`,
      psychology: "Support their internal selling process."
    }
  ],

  closingScripts: [
    {
      id: "can-close-pilot",
      title: "Trial / Pilot Close",
      type: "trial",
      script: `"[Name], based on everything we've discussed, it sounds like SuperPatch could deliver real value for [Company Name]. 

Rather than asking you to commit to a full program, what if we started with a pilot? We could select [20-50] employees across different roles, run it for [60-90 days], and measure the actual results in your environment.

That way you can see the impact firsthand before making a bigger decision. How does that sound?"`
    },
    {
      id: "can-close-roi",
      title: "ROI Close",
      type: "summary",
      script: `"Let's look at the numbers we discussed:
- Your absenteeism is costing approximately [$X] per year
- Pharmaceutical claims for sleep, pain, and stress are around [$X]
- Presenteeism is likely [$X] or more

Even conservative improvements in these areas would save you [$X] - that's a [X]x return on a SuperPatch investment.

The question isn't whether you can afford SuperPatch - it's whether you can afford not to address these costs. What do you think is the right next step?"`
    },
    {
      id: "can-close-competitive",
      title: "Competitive Close",
      type: "urgency",
      script: `"You mentioned that competing for talent is a challenge. Here's the reality: candidates today expect comprehensive wellness benefits. Companies that offer innovative solutions like SuperPatch stand out in the job market.

This isn't just about current employees - it's about every hire you make going forward. What would it mean for your recruiting if you could offer something your competitors don't?"`
    },
    {
      id: "can-close-timeline",
      title: "Timeline Close",
      type: "urgency",
      script: `"We've talked about the impact poor sleep, pain, and stress are having on your team right now. Every week that continues is another week of sick days, lost productivity, and employees who aren't at their best.

If we start a pilot next month, you could have data within [60-90 days] to make a decision. If we wait until [next quarter/next year], that's [X months] of preventable costs.

What would it take to get started this month?"`
    },
    {
      id: "can-close-partnership",
      title: "Partnership Close (for Chambers)",
      type: "assumptive",
      script: `"[Name], based on our conversation, it sounds like SuperPatch could bring real value to your members while creating a new revenue stream for [Chamber Name].

Here's what I'm proposing:
- Exclusive member pricing not available elsewhere
- [X%] revenue share on all member purchases
- Co-branded marketing and educational materials
- We handle all fulfillment and support

The next step would be to present this to your board. Can we schedule a time for me to walk them through the partnership opportunity?"`
    },
    {
      id: "can-close-assumptive",
      title: "Assumptive Close",
      type: "assumptive",
      script: `"It sounds like we're aligned on the value SuperPatch can bring to [Company Name]. The typical next step is to identify a pilot group and set some baseline measurements.

Would you want to start with a specific department, or would it make sense to select employees across different functions to get a broader picture?"`
    }
  ],

  followUpSequence: [
    {
      day: "Day 1",
      title: "Post-Meeting Follow-Up",
      email: `Subject: Great connecting today - next steps for [Company Name]

Hi [Name],

Thank you for your time today. I really enjoyed learning about [something specific they shared] and discussing how SuperPatch might support [Company Name]'s wellness goals.

As promised, I've attached:
• One-page overview of the SuperPatch Corporate Wellness Program
• ROI calculator customized for your company size
• Case study from [relevant industry/company size]

Based on our conversation, the next step we discussed was [specific action - e.g., scheduling a pilot, meeting with your CFO, etc.]. I'm available [specific times] this week if you'd like to move forward.

Is there anything else you need from me?

Best,
[Your Name]`
    },
    {
      day: "Day 3-5",
      title: "Value Add Follow-Up",
      email: `Subject: Thought you'd find this interesting

Hi [Name],

I came across this [article/study/statistic] about [relevant topic - e.g., Canadian workplace absenteeism costs, employee wellness trends] and thought of our conversation.

[Brief summary of the content and why it's relevant]

It reinforces why companies are prioritizing solutions like SuperPatch. Happy to discuss how this relates to [Company Name] when you have a few minutes.

Best,
[Your Name]`
    },
    {
      day: "Day 7",
      title: "Pilot Proposal Follow-Up",
      email: `Subject: Pilot proposal for [Company Name]

Hi [Name],

Following up on our discussion about piloting SuperPatch at [Company Name]. I've put together a formal pilot proposal:

Pilot Overview:
• Participants: 25-50 employees
• Duration: 90 days
• Products: Full SuperPatch portfolio based on employee needs
• Measurements: Absenteeism, self-reported wellness, engagement

Investment: [Discounted pilot pricing]

Success Metrics:
• 60%+ employee engagement
• Measurable improvement in at least 2 wellness categories
• Positive ROI indicators

I've attached the full proposal for your review. When would be a good time to discuss and finalize the details?

Best,
[Your Name]`
    },
    {
      day: "Day 14",
      title: "Re-engagement Follow-Up",
      email: `Subject: Still interested in reducing absenteeism at [Company Name]?

Hi [Name],

I wanted to check in since we last spoke about SuperPatch for [Company Name]. I know things get busy, but I didn't want you to miss the opportunity to address [specific pain point they mentioned].

Companies that implemented SuperPatch this quarter are already seeing:
• [X]% reduction in sick days
• Positive employee feedback
• Early ROI indicators

Is this still a priority for you? If timing has changed, no problem - just let me know and I'll follow up when it makes more sense.

Best,
[Your Name]`
    }
  ],

  quickReference: {
    keyBenefits: [
      "20-30% reduction in absenteeism",
      "25-35% lower pharmaceutical claims",
      "15-25% productivity improvement from healthier employees",
      "60%+ adoption vs. 10-20% for typical wellness programs",
      "Zero administrative burden - employees just apply patches"
    ],
    bestQuestions: [
      "What's your biggest wellness challenge right now?",
      "How would you describe employee engagement with current programs?",
      "What would success look like for you in a wellness solution?",
      "How does employee health affect your bottom line?",
      "How hard is it to compete for talent against bigger companies?"
    ],
    topObjections: [
      { objection: "No budget", response: "What is absenteeism currently costing you? Let me show you the ROI..." },
      { objection: "Does it work?", response: "The tech is based on Nobel Prize research. But don't take my word - let's do a pilot..." },
      { objection: "Not the right time", response: "Employee health issues don't wait. What if we started small with a pilot?" },
      { objection: "Already have wellness", response: "Great! SuperPatch complements existing programs by addressing sleep, pain, stress..." },
      { objection: "Too expensive", response: "Companies use SuperPatch to reduce costs. Let me run the ROI numbers for you..." }
    ],
    bestClosingLines: [
      "What if we started with a pilot - 25-50 employees for 90 days?",
      "The numbers show [$X] savings - can you afford NOT to act?",
      "What would it mean for recruiting to offer this?",
      "Every week is more preventable costs - let's start this month."
    ],
    keyStats: [
      "Canadian absenteeism cost: 9.3 days/employee/year = $3,300/employee",
      "Presenteeism cost: $10,000/employee/year",
      "SuperPatch expected ROI: 300-500%+",
      "Adoption rate: 60%+ (vs. 10-20% typical programs)",
      "Sleep study: 50% faster sleep onset",
      "Pain study: 92% relief in 20 minutes",
      "Stress study: 33% stress reduction"
    ]
  }
};





