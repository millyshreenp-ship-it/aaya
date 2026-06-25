import React, { useState, useEffect, useRef, useCallback } from 'react';
import { regionalResponse, generateScamAlert } from '../utils/claudeAPI';

/* ── Supported Indian languages ─────────────────────── */
const LANGUAGES = [
  { code: 'hi-IN', label: 'Hindi',   script: 'हिन्दी',   voiceLang: 'hi-IN' },
  { code: 'te-IN', label: 'Telugu',  script: 'తెలుగు',  voiceLang: 'te-IN' },
  { code: 'ta-IN', label: 'Tamil',   script: 'தமிழ்',   voiceLang: 'ta-IN' },
  { code: 'mr-IN', label: 'Marathi', script: 'मराठी',   voiceLang: 'mr-IN' },
  { code: 'bn-IN', label: 'Bengali', script: 'বাংলা',   voiceLang: 'bn-IN' },
  { code: 'kn-IN', label: 'Kannada', script: 'ಕನ್ನಡ',  voiceLang: 'kn-IN' },
  { code: 'en-IN', label: 'English', script: 'English', voiceLang: 'en-IN' },
];

const SAMPLE_QUERIES = {
  'hi-IN': 'मेरा बैलेंस क्या है?',
  'te-IN': 'నా బ్యాలెన్స్ ఎంత?',
  'ta-IN': 'என் இருப்பு என்ன?',
  'mr-IN': 'माझी शिल्लक किती आहे?',
  'bn-IN': 'আমার ব্যালেন্স কত?',
  'kn-IN': 'ನನ್ನ ಬ್ಯಾಲೆನ್ಸ್ ಎಷ್ಟು?',
  'en-IN': 'What is my balance?',
};

const SCAM_SCENARIOS = [
  'Caller says they are from SBI and need your OTP to unlock your account',
  'Someone claims to be from RBI asking for Aadhaar number',
  'Caller offers prize money and asks for bank details',
];

/* ── Wave bars ────────────────────────────────────────── */
function WaveBars({ active }) {
  const bars = Array.from({ length: 9 });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 32 }}>
      {bars.map((_, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 3,
          background: active ? '#C4A35A' : 'rgba(242,239,232,0.2)',
          height: active ? `${6 + Math.sin((i / bars.length) * Math.PI) * 18}px` : '6px',
          transition: 'height .15s ease, background .3s',
          animation: active ? `wave-anim ${0.8 + i * 0.1}s ease-in-out infinite` : 'none',
          animationDelay: `${i * 0.08}s`,
        }} />
      ))}
    </div>
  );
}

export default function VoiceInterface() {
  const [selectedLang, setSelectedLang]   = useState(LANGUAGES[0]);
  const [listening, setListening]         = useState(false);
  const [transcript, setTranscript]       = useState('');
  const [response, setResponse]           = useState('');
  const [loading, setLoading]             = useState(false);
  const [history, setHistory]             = useState([]);
  const [scamAlert, setScamAlert]         = useState('');
  const [scamLoading, setScamLoading]     = useState(false);
  const [ttsSupported, setTtsSupported]   = useState(false);
  const [srSupported, setSrSupported]     = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setTtsSupported('speechSynthesis' in window);
    setSrSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  /* ── Text-to-speech ── */
  const speak = useCallback((text, lang) => {
    if (!ttsSupported) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.rate = 0.9;
    utt.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    if (match) utt.voice = match;
    window.speechSynthesis.speak(utt);
  }, [ttsSupported]);

  /* ── Start listening ── */
  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported in this browser. Try Chrome.'); return; }
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = selectedLang.code;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart   = () => setListening(true);
    recognition.onend     = () => setListening(false);
    recognition.onerror   = () => setListening(false);
    recognition.onresult  = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(t);
      if (e.results[e.results.length - 1].isFinal) handleQuery(t);
    };
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  /* ── Handle query ── */
  async function handleQuery(text) {
    if (!text.trim()) return;
    setLoading(true);
    setResponse('');
    try {
      const reply = await regionalResponse(text, selectedLang.label);
      setResponse(reply);
      setHistory(h => [...h, { user: text, aaya: reply, lang: selectedLang.label }]);
      speak(reply, selectedLang.voiceLang);
    } catch {
      const err = 'क्षमा करें, एक त्रुटि हुई। API key जाँचें।';
      setResponse(err);
    } finally {
      setLoading(false);
    }
  }

  /* ── Scam alert demo ── */
  async function triggerScamAlert(scenario) {
    setScamLoading(true);
    setScamAlert('');
    try {
      const alert = await generateScamAlert(scenario, selectedLang.label);
      setScamAlert(alert);
      speak(alert, selectedLang.voiceLang);
    } catch {
      setScamAlert('Yeh call fraud hai — OTP bilkul mat dena!');
    } finally {
      setScamLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.35)', marginBottom: 6 }}>
          Regional Language NLP · Voice Interface
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 700, lineHeight: 1 }}>
          Voice <em style={{ color: '#C4A35A' }}>Assistant</em>
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(242,239,232,0.45)', marginTop: 8 }}>
          22 Indian languages · Web Speech API · Bhashini NLP · Spoken responses
        </p>
      </div>

      {/* Language selector */}
      <div className="glass" style={{ padding: '20px 24px' }}>
        <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 14 }}>
          Select Language
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {LANGUAGES.map(lang => (
            <button key={lang.code} onClick={() => setSelectedLang(lang)} style={{
              padding: '8px 16px', borderRadius: 100,
              background: selectedLang.code === lang.code ? '#D42B2B' : 'rgba(242,239,232,0.06)',
              border: `1px solid ${selectedLang.code === lang.code ? '#D42B2B' : 'rgba(242,239,232,0.12)'}`,
              color: selectedLang.code === lang.code ? '#fff' : 'rgba(242,239,232,0.65)',
              cursor: 'pointer', fontSize: 13, transition: 'all .2s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <span style={{ fontFamily: selectedLang.code === lang.code ? 'inherit' : 'serif', fontSize: 15 }}>{lang.script}</span>
              <span style={{ fontSize: 10, letterSpacing: '.06em' }}>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice input area */}
      <div className="glass" style={{ padding: '32px', textAlign: 'center' }}>
        {/* Mic button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <button
            onClick={listening ? stopListening : startListening}
            disabled={!srSupported}
            style={{
              width: 90, height: 90, borderRadius: '50%',
              background: listening
                ? 'radial-gradient(circle, #D42B2B, #a01f1f)'
                : 'radial-gradient(circle, rgba(212,43,43,0.2), rgba(212,43,43,0.05))',
              border: `2px solid ${listening ? '#D42B2B' : 'rgba(212,43,43,0.3)'}`,
              cursor: srSupported ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, transition: 'all .3s',
              boxShadow: listening ? '0 0 30px rgba(212,43,43,0.4)' : 'none',
              position: 'relative',
            }}
          >
            {listening && (
              <div style={{
                position: 'absolute', inset: -10,
                border: '2px solid rgba(212,43,43,0.5)',
                borderRadius: '50%',
                animation: 'pulse-ring 1.4s ease-out infinite',
              }} />
            )}
            🎤
          </button>

          <WaveBars active={listening} />

          <p style={{ fontSize: 13, color: 'rgba(242,239,232,0.45)' }}>
            {listening ? `Listening in ${selectedLang.label}...` :
             srSupported ? `Press to speak in ${selectedLang.label}` :
             'Speech recognition not supported (use Chrome)'}
          </p>

          {/* Sample query button */}
          <button onClick={() => handleQuery(SAMPLE_QUERIES[selectedLang.code])} style={{
            background: 'rgba(242,239,232,0.06)', border: '1px solid rgba(242,239,232,0.12)',
            borderRadius: 3, padding: '8px 18px', color: 'rgba(242,239,232,0.6)',
            cursor: 'pointer', fontSize: 12, letterSpacing: '.06em',
          }}>
            Try: "{SAMPLE_QUERIES[selectedLang.code]}"
          </button>
        </div>

        {/* Transcript */}
        {transcript && (
          <div style={{ marginTop: 20, padding: '14px', background: 'rgba(242,239,232,0.05)', borderRadius: 3, textAlign: 'left' }}>
            <p style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.3)', marginBottom: 6 }}>You said</p>
            <p style={{ fontSize: 15, color: '#F2EFE8' }}>{transcript}</p>
          </div>
        )}

        {/* Response */}
        {loading && (
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {[0,1,2].map(i => <div key={i} className="wave-bar" style={{ animationDelay: `${i*0.2}s` }} />)}
            </div>
          </div>
        )}
        {response && !loading && (
          <div style={{ marginTop: 20, padding: '18px', background: 'rgba(196,163,90,0.08)', border: '1px solid rgba(196,163,90,0.2)', borderRadius: 3, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#C4A35A' }}>AAYA responds</p>
              <button onClick={() => speak(response, selectedLang.voiceLang)} style={{
                background: 'none', border: '1px solid rgba(196,163,90,0.3)', borderRadius: 100,
                padding: '3px 10px', color: '#C4A35A', fontSize: 10, cursor: 'pointer',
              }}>🔊 Replay</button>
            </div>
            <p style={{ fontSize: 16, color: '#F2EFE8', lineHeight: 1.7 }}>{response}</p>
          </div>
        )}
      </div>

      {/* Scam Alert Demo */}
      <div className="glass" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#D42B2B', boxShadow: '0 0 8px #D42B2B' }} />
          <p style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.5)' }}>
            Scam Alert — Spoken in {selectedLang.label}
          </p>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(242,239,232,0.45)', marginBottom: 16 }}>
          Simulate a vishing/fraud call. AAYA detects and announces an alert aloud in the user's language.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SCAM_SCENARIOS.map((sc, i) => (
            <button key={i} onClick={() => triggerScamAlert(sc)} style={{
              background: 'rgba(212,43,43,0.07)', border: '1px solid rgba(212,43,43,0.18)',
              borderRadius: 3, padding: '12px 16px', color: 'rgba(242,239,232,0.7)',
              cursor: 'pointer', fontSize: 12, textAlign: 'left', transition: 'all .2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,43,43,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,43,43,0.07)'}
            >⚠️ {sc}</button>
          ))}
        </div>
        {scamLoading && <p style={{ marginTop: 12, fontSize: 13, color: '#C4A35A' }}>Generating alert...</p>}
        {scamAlert && (
          <div style={{
            marginTop: 16, padding: '16px 20px',
            background: 'rgba(212,43,43,0.15)', border: '2px solid #D42B2B', borderRadius: 3,
          }}>
            <p style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#D42B2B', marginBottom: 8 }}>
              🔊 AAYA ALERT — {selectedLang.label}
            </p>
            <p style={{ fontSize: 17, color: '#F2EFE8', fontWeight: 500, lineHeight: 1.5 }}>{scamAlert}</p>
          </div>
        )}
      </div>

      {/* Conversation history */}
      {history.length > 0 && (
        <div className="glass" style={{ padding: '20px 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 16 }}>
            Session History
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {history.map((h, i) => (
              <div key={i} style={{ borderLeft: '2px solid rgba(196,163,90,0.3)', paddingLeft: 14 }}>
                <p style={{ fontSize: 12, color: 'rgba(242,239,232,0.4)', marginBottom: 4 }}>User ({h.lang}): {h.user}</p>
                <p style={{ fontSize: 13, color: '#F2EFE8' }}>AAYA: {h.aaya}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
