const KEY = "incomeos.v1";
const STAGES = ["Lead", "Pitched", "Won", "Delivering", "Paid"];
const DAYS = [
  { mode: "Hunt", title: "Pipeline creation", ships: ["10 personalized outreaches", "2 follow-ups on old leads", "Log every send in Pipeline"] },
  { mode: "Make", title: "Delivery and product", ships: ["Finish one paid or sample deliverable", "Turn a repeat task into a template", "Ask one client or contact for a testimonial"] },
  { mode: "Ship", title: "Content that sells", ships: ["Publish 1 proof post naming the offer", "5 more outreaches", "Queue 3 content ideas"] },
  { mode: "Close", title: "Conversations to cash", ships: ["Send or chase 2 proposals", "Follow up every pitched deal", "Offer a small yes: paid pilot"] },
  { mode: "Collect", title: "Money and review", ships: ["Invoice or request payment", "Write the weekly numbers", "Pick next week’s single offer"] },
  { mode: "Batch", title: "Leverage", ships: ["Draft 7 short posts or 1 product page", "Build one reusable SOP", "Clean the pipeline"] },
  { mode: "Plan", title: "Next week design", ships: ["Set a cash target for the week", "Book work blocks on a calendar", "Rewrite the flagship offer in 8 lines"] }
];

const JOBS = [
  ["Offer architect", "Rewrite my flagship offer so a busy owner understands it in 20 seconds. Include: who it is for, painful before, result after, 3 deliverables, price, 14-day guarantee, and a first-step CTA. No hype."],
  ["Lead list builder", "Give me 20 specific lead targets in or near my city. For each: business type, why they feel the pain this week, where to find them, and a one-line angle. No generic national brands."],
  ["Outreach writer", "Write 8 outreach variants: 3 email, 3 Facebook/Nextdoor, 2 LinkedIn. 80–130 words. One ask. Mention a concrete local detail. No 'I hope this finds you well'."],
  ["Proposal factory", "Turn this conversation into a one-page proposal: restated problem, scope in 5 bullets, timeline, price, what is not included, next step. Leave placeholders for the client name."],
  ["Delivery engine", "Create the exact first-delivery pack for my flagship offer: checklist, client questions, finished example, and a 60-minute work script I can follow."],
  ["Product mill", "Design one $19–$49 digital product that is a byproduct of my service. Title, contents, outline of every page, sales blurb, and Gumroad description."],
  ["Content that closes", "Write 5 posts for my best channel. Each must include a belief, a proof or example, and a soft CTA to the flagship offer. Platform-native length."],
  ["Price and package", "Pressure-test my price. Show local comparables, a good/better/best ladder, a retainer version, and what to cut if a buyer hesitates."],
  ["Objection killer", "List the 10 objections I will actually hear and a short reply for each. Then a 3-email follow-up sequence over 10 days."],
  ["Weekly review", "Using my pipeline and ledger snapshot, tell me the constraint: traffic, conversion, delivery, or collection. Give one move for the next 7 days."]
];

const PLAYBOOKS = [
  { t: "Local AI retainer — fastest cash near you", b: "Sell a monthly pack to dentists, HVAC, law offices, gyms, and independent restaurants: Google Business posts, review replies, missed-call text script, and a weekly 4-post pack. Price $199–$399/mo. Find 30 businesses on Google Maps, walk in or email the owner, offer a $99 first-week pilot. Assistant writes every asset. You send and collect." },
  { t: "Productized freelance — 7-day first payment", b: "Pick one artifact people already buy: resumes, real-estate listings, SOPs, grant blurbs, church newsletters, ecom product pages. Sell a fixed pack at a fixed price. Post the offer in 3 Facebook groups and on one gig platform. Assistant drafts; you edit 10 minutes and deliver as PDF/Docs." },
  { t: "Digital product from the service", b: "After two paid jobs, extract the checklist you already used. Turn it into a 12–20 page template pack. Gumroad at $19 or $29. The assistant writes the pack and the sales page. You record nothing. One proof post a day pointing at the pack." },
  { t: "Content to inbound (month 2+, not month 1)", b: "Do not start here if you need rent. Once you have an offer that has sold at least once, publish 3 times a week in one place the buyer already is. Every post ends with the offer. Assistant drafts a week on Saturday. You spend 25 minutes publishing and answering comments." },
  { t: "B2B micro-tool later", b: "Only after 5 conversations about the same painful step. Then a simple page + Stripe + a spreadsheet or this HTML app is enough. Do not build software to avoid talking to buyers." },
  { t: "Rules that keep this free", b: "Grok or Gemini for all drafting. Google Docs or Markdown for delivery. Gumroad or PayPal.Me for payment. GitHub Pages if you want a public page. Canva free for simple graphics. Buy software only after a stranger has paid you more than the yearly cost." }
];
