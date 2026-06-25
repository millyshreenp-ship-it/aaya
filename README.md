# AAYA — Member A · Product Intelligence & Experience

> India's First Autonomous Financial Brain  
> **paisa aaya · future aaya**

---

## How It Works — Two Layers

```
/ (root)              → LandingPage.jsx   ← Full animated landing (GSAP, red card, scroll reveals)
/app/dashboard        → Dashboard.jsx     ← Multi-bank financial overview
/app/future-self      → FutureSelf.jsx    ← Claude-powered Future Self Simulator
/app/elderly          → ElderlyMode.jsx   ← Simplified UI + Hindi/Telugu voice
/app/voice            → VoiceInterface.jsx← Regional NLP + scam alerts
/app/biometrics       → Biometrics.jsx    ← Keystroke/scroll anomaly scoring
/app/map              → MapTracker.jsx    ← Helper dispatch map + ATM locator
/app/agents           → AgentPanel.jsx    ← All 4 Member A agents with Claude chat
```

**Landing page (`index.html`) is also kept as a standalone HTML file** — works independently without React.

---

## Quick Start

```bash
npm install
cp .env.example .env    # add REACT_APP_ANTHROPIC_API_KEY
npm start               # opens at http://localhost:3000
```

- `http://localhost:3000/`              → Animated landing page
- `http://localhost:3000/app/dashboard` → Dashboard (direct link)

---

## Files

```
aaya/
├── index.html                    ← Standalone landing page (unchanged, works without React)
├── src/
│   ├── App.jsx                   ← Router: / = landing, /app/* = dashboard
│   ├── index.js
│   ├── styles/global.css
│   ├── utils/claudeAPI.js        ← All Claude API functions
│   └── components/
│       ├── LandingPage.jsx       ← React port of index.html with GSAP animations
│       ├── Layout.jsx            ← Sidebar + top bar (← back to landing link)
│       ├── Dashboard.jsx
│       ├── FutureSelf.jsx
│       ├── ElderlyMode.jsx
│       ├── VoiceInterface.jsx
│       ├── Biometrics.jsx
│       ├── MapTracker.jsx
│       └── AgentPanel.jsx
└── public/index.html             ← React app shell
```

---

## Member A Tech Layers

| Layer | File | Status |
|---|---|---|
| Frontend (React + Tailwind) | App.jsx, Layout.jsx | ✅ |
| LLM Layer (Claude Sonnet) | claudeAPI.js | ✅ 7 functions |
| Regional NLP | VoiceInterface.jsx | ✅ 7 languages |
| Voice Interface | VoiceInterface.jsx | ✅ Web Speech API |
| Real-time Data | Dashboard.jsx | ✅ Live updates |
| Behavioural Biometrics | Biometrics.jsx | ✅ Anomaly scoring |
| Maps & Location | MapTracker.jsx | ✅ Dispatch + ATM |
| Landing Page (GSAP) | LandingPage.jsx | ✅ Full animations |

*AAYA Hackathon 2025 · Member A*
