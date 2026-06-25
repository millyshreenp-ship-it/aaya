/**
 * AAYA — LLM Layer
 * Claude Sonnet API integration for:
 *  - Future Self Simulator
 *  - Financial Coach Agent
 *  - Acquisition Agent
 *  - Regional language translation
 *  - Scam alert generation
 */

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL          = 'claude-sonnet-4-6';
const MAX_TOKENS     = 1024;

// NOTE: In production, proxy through your backend to protect the API key.
// For hackathon demo, set REACT_APP_ANTHROPIC_API_KEY in your .env file.
const API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY || '';

/**
 * Core Claude call
 */
async function callClaude(systemPrompt, userMessage, history = []) {
  const messages = [
    ...history,
    { role: 'user', content: userMessage },
  ];

  const res = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Claude API error ${res.status}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || '';
}

/* ─────────────────────────────────────────────────── */
/*  FUTURE SELF SIMULATOR                              */
/* ─────────────────────────────────────────────────── */
const FUTURE_SELF_SYSTEM = `You are "45-year-old Rahul", the user's future financial self powered by AAYA AI.
You speak in first person as the future self. You have lived through the consequences of financial decisions made at age 25.
You reference exact rupee amounts (use ₹ symbol), calculate compound interest, SIP corpus, and loan cost impacts.
Keep responses conversational, emotionally resonant, and under 120 words. Speak in English but naturally drop Hindi phrases (yaar, sach mein, beta).
Always end with one concrete, urgent action the user can take RIGHT NOW.
Reference real Indian financial products: SIPs, FDs, ELSS, PPF, home loans, LIC.`;

export async function futureSelfChat(userMessage, history = []) {
  return callClaude(FUTURE_SELF_SYSTEM, userMessage, history);
}

/* ─────────────────────────────────────────────────── */
/*  FINANCIAL COACH AGENT                              */
/* ─────────────────────────────────────────────────── */
const COACH_SYSTEM = `You are AAYA's Financial Coach Agent for Indian users.
Provide personalized financial advice based on the user's portfolio:
- Salary: ₹85,000/month
- SBI balance: ₹1,24,580 | HDFC: ₹67,230 | ICICI: ₹23,410
- FDs: ₹4,50,000 | SIPs: ₹16,000/month | Home loan EMI: ₹32,800
- Financial Health Score: 74/100
Give actionable, India-specific advice. Reference SEBI guidelines, RBI rates, Income Tax sections (80C, 80D).
Be concise — 3-4 bullet points max. Use ₹ for amounts.`;

export async function financialCoachAdvice(query) {
  return callClaude(COACH_SYSTEM, query);
}

/* ─────────────────────────────────────────────────── */
/*  ACQUISITION AGENT — Onboarding & KYC chat         */
/* ─────────────────────────────────────────────────── */
const ACQUISITION_SYSTEM = `You are AAYA's Acquisition Agent, guiding a new user through onboarding.
Your job: make digital banking onboarding feel warm, personal, and effortless.
Steps: (1) Greet and gather name & phone, (2) Ask about primary goal (savings/loan/investment), 
(3) Quick risk profiling (3 questions), (4) Confirm PAN/Aadhaar for KYC, (5) Link first bank account.
Keep each message short (2-3 sentences). Be warm, encouraging. Speak in simple English + occasional Hindi.
Never ask for OTP or full Aadhaar number — just the last 4 digits for verification display.`;

export async function acquisitionChat(userMessage, history = []) {
  return callClaude(ACQUISITION_SYSTEM, userMessage, history);
}

/* ─────────────────────────────────────────────────── */
/*  PRODUCT AGENT — Recommend financial products       */
/* ─────────────────────────────────────────────────── */
const PRODUCT_SYSTEM = `You are AAYA's Product Agent. Recommend the best financial products across Indian banks.
Compare FD rates, SIP options, insurance, credit cards, home loans.
Current RBI repo rate: 6.5%. Top FD rates: SBI 7.1%, HDFC 7.25%, ICICI 7.3%, Axis 7.35%.
Format: Lead with ONE best recommendation with a ₹ impact figure, then 2 alternatives.
Always include estimated returns and lock-in period.`;

export async function productRecommendation(query) {
  return callClaude(PRODUCT_SYSTEM, query);
}

/* ─────────────────────────────────────────────────── */
/*  REGIONAL LANGUAGE — Translate + respond in Indian  */
/* ─────────────────────────────────────────────────── */
export async function regionalResponse(userMessage, targetLanguage = 'Hindi') {
  const system = `You are AAYA's regional language assistant. 
The user speaks ${targetLanguage}. Respond ONLY in ${targetLanguage} (use the script of that language).
For financial terms, use simple everyday words, not technical jargon.
Keep answers very short — elderly users prefer 1-2 sentences.
If the user seems confused, offer to send a helper to their home.`;
  return callClaude(system, userMessage);
}

/* ─────────────────────────────────────────────────── */
/*  SCAM ALERT GENERATOR                               */
/* ─────────────────────────────────────────────────── */
export async function generateScamAlert(callDescription, language = 'Hindi') {
  const system = `You are AAYA's Security Agent. Generate a spoken fraud alert in ${language}.
The alert must be SHORT (1 sentence), urgent, and tell the user NOT to share OTP/PIN/Aadhaar.
Use the local language naturally. Example in Hindi: "Yeh call ek fraud hai — OTP bilkul mat dena!"
Return ONLY the alert sentence, nothing else.`;
  return callClaude(system, `Suspicious call: ${callDescription}`);
}

/* ─────────────────────────────────────────────────── */
/*  RELATIONSHIP MANAGER AGENT                         */
/* ─────────────────────────────────────────────────── */
export async function relationshipNudge(userContext) {
  const system = `You are AAYA's Relationship Manager Agent. Generate a personalized financial nudge.
Context about the user: ${JSON.stringify(userContext)}.
Create a warm, encouraging nudge (2 sentences max) that feels personal — not robotic.
Reference their actual numbers. Use their name "Rahul".`;
  return callClaude(system, 'Generate today\'s nudge');
}
