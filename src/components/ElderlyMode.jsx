import React, { useState } from 'react';

const LANGUAGES = [
  { code: 'hi', label: 'Hindi',   greeting: 'नमस्ते, अम्माजी 🙏', question: 'आप क्या करना चाहती हैं?', balance_label: 'आपका बैलेंस', helper_text: 'सहायक भेजें', speak_lang: 'hi-IN' },
  { code: 'te', label: 'Telugu',  greeting: 'నమస్కారం, అమ్మగారు 🙏', question: 'మీరు ఏమి చేయాలనుకుంటున్నారు?', balance_label: 'మీ బ్యాలెన్స్', helper_text: 'సహాయకుడిని పంపండి', speak_lang: 'te-IN' },
  { code: 'ta', label: 'Tamil',   greeting: 'வணக்கம், அம்மா 🙏', question: 'நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?', balance_label: 'உங்கள் இருப்பு', helper_text: 'உதவியாளரை அனுப்பு', speak_lang: 'ta-IN' },
  { code: 'mr', label: 'Marathi', greeting: 'नमस्कार, आई 🙏', question: 'तुम्हाला काय करायचे आहे?', balance_label: 'तुमची शिल्लक', helper_text: 'मदतनीस पाठवा', speak_lang: 'mr-IN' },
];

const MOCK_BALANCE = '₹1,24,350';

function speak(text, lang = 'hi-IN') {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; u.rate = 0.82; u.pitch = 1.05;
  window.speechSynthesis.speak(u);
}

export default function ElderlyMode() {
  const [langIdx, setLangIdx] = useState(0);
  const [simplified, setSimplified] = useState(true);
  const [screen, setScreen] = useState('home');
  const [helperSent, setHelperSent] = useState(false);
  const lang = LANGUAGES[langIdx];

  const fontSize = simplified ? 22 : 14;
  const btnPad   = simplified ? '22px 28px' : '12px 18px';

  function showBalance() {
    setScreen('balance');
    speak(`${lang.balance_label}: ${MOCK_BALANCE}`, lang.speak_lang);
  }

  function dispatchHelper() {
    setHelperSent(true);
    speak('एक सहायक आपके घर आ रहे हैं। आपका परिवार सूचित कर दिया गया है।', 'hi-IN');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.35)', marginBottom: 4 }}>
            Accessibility Layer
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 700, lineHeight: 1 }}>
            Elderly <em style={{ color: '#C4A35A' }}>Mode</em>
          </h1>
        </div>
        <button onClick={() => setSimplified(s => !s)} style={{
          background: simplified ? '#D42B2B' : 'rgba(242,239,232,0.08)',
          color: '#fff', border: 'none', borderRadius: 2,
          padding: '10px 20px', cursor: 'pointer', fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase',
        }}>
          {simplified ? '⊕ Simplified ON' : '⊕ Enable Simplified'}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: simplified ? 380 : 520,
          background: '#0a0a0c',
          borderRadius: simplified ? 32 : 8,
          border: `${simplified ? 6 : 2}px solid rgba(242,239,232,0.1)`,
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          transition: 'all .4s',
          minHeight: 580,
        }}>
          {/* Language tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(242,239,232,0.08)' }}>
            {LANGUAGES.map((l, i) => (
              <button key={l.code} onClick={() => { setLangIdx(i); setScreen('home'); }} style={{
                flex: 1, padding: simplified ? '14px 8px' : '9px 4px',
                background: langIdx === i ? 'rgba(212,43,43,0.15)' : 'transparent',
                border: 'none',
                borderBottom: langIdx === i ? '2px solid #D42B2B' : '2px solid transparent',
                color: langIdx === i ? '#F2EFE8' : 'rgba(242,239,232,0.35)',
                cursor: 'pointer', fontSize: simplified ? 13 : 10,
                fontWeight: langIdx === i ? 600 : 400,
                fontFamily: 'DM Sans, sans-serif',
                transition: 'all .2s',
              }}>{l.label}</button>
            ))}
          </div>

          {/* Scam alert banner */}
          {screen === 'home' && (
            <div style={{
              background: 'rgba(212,43,43,0.15)', borderBottom: '1px solid rgba(212,43,43,0.25)',
              padding: simplified ? '12px 20px' : '8px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: simplified ? 20 : 14 }}>🚨</span>
              <p style={{ fontSize: simplified ? 13 : 10, color: '#e57373', lineHeight: 1.4 }}>
                {langIdx === 0 ? 'सावधान! बैंक कभी OTP नहीं मांगता।' :
                 langIdx === 1 ? 'జాగ్రత్త! బ్యాంక్ OTP అడగదు.' :
                 langIdx === 2 ? 'எச்சரிக்கை! வங்கி OTP கேட்காது.' :
                 'सावधान! बँक OTP मागत नाही.'}
              </p>
            </div>
          )}

          {/* Home screen */}
          {screen === 'home' && (
            <div style={{ padding: simplified ? '28px 20px' : '18px 14px', display: 'flex', flexDirection: 'column', gap: simplified ? 18 : 10 }}>
              <p style={{ fontSize: simplified ? 26 : 16, fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: '#F2EFE8', textAlign: 'center' }}>
                {lang.greeting}
              </p>
              <p style={{ fontSize: simplified ? 15 : 11, color: 'rgba(242,239,232,0.45)', textAlign: 'center', marginBottom: 4 }}>
                {lang.question}
              </p>

              {/* 3 big buttons */}
              {[
                { emoji: '💰', label: 'Check Balance',  fn: showBalance },
                { emoji: '📋', label: 'Fixed Deposit',  fn: () => setScreen('fd') },
                { emoji: '🤝', label: 'Need Help',      fn: () => setScreen('help') },
              ].map(btn => (
                <button key={btn.label} onClick={btn.fn} style={{
                  background: 'rgba(212,43,43,0.1)',
                  border: '2px solid rgba(212,43,43,0.3)',
                  borderRadius: simplified ? 16 : 6,
                  padding: btnPad, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: simplified ? 20 : 12,
                  transition: 'all .2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,43,43,0.7)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(212,43,43,0.3)'}
                >
                  <span style={{ fontSize: simplified ? 40 : 24 }}>{btn.emoji}</span>
                  <p style={{ fontSize: simplified ? 22 : 14, color: '#F2EFE8', fontWeight: 600 }}>{btn.label}</p>
                </button>
              ))}

              {/* Tap to speak */}
              <button
                onClick={() => speak(lang.greeting, lang.speak_lang)}
                style={{
                  marginTop: 8,
                  background: 'rgba(196,163,90,0.1)', border: '2px solid rgba(196,163,90,0.3)',
                  borderRadius: simplified ? 16 : 6, padding: simplified ? '16px' : '10px',
                  cursor: 'pointer', color: '#C4A35A', fontSize: simplified ? 16 : 12,
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}>
                🔊 Tap to Speak
              </button>
            </div>
          )}

          {/* Balance screen */}
          {screen === 'balance' && (
            <div style={{ padding: simplified ? '28px 20px' : '18px 14px', textAlign: 'center' }}>
              <button onClick={() => setScreen('home')} style={{
                background: 'none', border: 'none', color: 'rgba(242,239,232,0.4)',
                cursor: 'pointer', fontSize: 18, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6,
              }}>← Back</button>
              <p style={{ fontSize: simplified ? 16 : 12, color: 'rgba(242,239,232,0.5)', marginBottom: 10 }}>{lang.balance_label}</p>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: simplified ? 52 : 34, fontWeight: 700, color: '#C4A35A' }}>{MOCK_BALANCE}</p>
              <p style={{ fontSize: simplified ? 14 : 11, color: 'rgba(242,239,232,0.4)', marginTop: 8 }}>SBI Savings Account</p>
              <button onClick={() => speak(`${lang.balance_label} ${MOCK_BALANCE}`, lang.speak_lang)} style={{
                marginTop: 24, background: '#D42B2B', color: '#fff', border: 'none',
                borderRadius: 10, padding: simplified ? '16px 32px' : '10px 20px',
                cursor: 'pointer', fontSize: simplified ? 17 : 13, fontFamily: 'DM Sans, sans-serif',
              }}>🔊 Repeat</button>
            </div>
          )}

          {/* FD screen */}
          {screen === 'fd' && (
            <div style={{ padding: simplified ? '28px 20px' : '18px 14px' }}>
              <button onClick={() => setScreen('home')} style={{
                background: 'none', border: 'none', color: 'rgba(242,239,232,0.4)',
                cursor: 'pointer', fontSize: 18, marginBottom: 20,
              }}>← Back</button>
              <p style={{ fontSize: simplified ? 20 : 14, fontWeight: 600, color: '#F2EFE8', marginBottom: 16 }}>Fixed Deposit Details</p>
              <div style={{ background: 'rgba(242,239,232,0.05)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <p style={{ fontSize: simplified ? 20 : 14, color: '#C4A35A', fontWeight: 600 }}>₹3,00,000 · SBI · 7.1%</p>
                <p style={{ fontSize: simplified ? 14 : 11, color: 'rgba(242,239,232,0.5)', marginTop: 6 }}>Matures in 18 days</p>
              </div>
              <button style={{
                width: '100%', background: '#D42B2B', color: '#fff', border: 'none',
                borderRadius: 12, padding: simplified ? '20px' : '12px', cursor: 'pointer',
                fontSize: simplified ? 18 : 13, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
              }}>✓ Renew in One Tap</button>
            </div>
          )}

          {/* Help / Helper screen */}
          {screen === 'help' && (
            <div style={{ padding: simplified ? '28px 20px' : '18px 14px', textAlign: 'center' }}>
              <button onClick={() => { setScreen('home'); setHelperSent(false); }} style={{
                background: 'none', border: 'none', color: 'rgba(242,239,232,0.4)',
                cursor: 'pointer', fontSize: 18, marginBottom: 20,
              }}>← Back</button>
              {!helperSent ? (
                <>
                  <p style={{ fontSize: simplified ? 24 : 15, color: '#F2EFE8', fontWeight: 600, marginBottom: 12, lineHeight: 1.4 }}>
                    Send a bank helper to your home?
                  </p>
                  <p style={{ fontSize: simplified ? 14 : 11, color: 'rgba(242,239,232,0.5)', marginBottom: 24 }}>
                    Bank-verified, trained representative
                  </p>
                  <button onClick={dispatchHelper} style={{
                    background: '#D42B2B', color: '#fff', border: 'none',
                    borderRadius: 16, padding: simplified ? '20px 40px' : '12px 24px',
                    cursor: 'pointer', fontSize: simplified ? 20 : 14, fontWeight: 600,
                    width: '100%', fontFamily: 'DM Sans, sans-serif',
                  }}>🤝 {lang.helper_text}</button>
                </>
              ) : (
                <div>
                  <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
                  <p style={{ fontSize: simplified ? 22 : 15, color: '#4caf50', fontWeight: 600, marginBottom: 8 }}>
                    Helper is on the way!
                  </p>
                  <p style={{ fontSize: simplified ? 15 : 12, color: 'rgba(242,239,232,0.6)', lineHeight: 1.6 }}>
                    Priya Sharma is coming to you.<br />ETA: 18 minutes.
                  </p>
                  <p style={{ fontSize: simplified ? 13 : 11, color: '#C4A35A', marginTop: 12 }}>
                    Your family has been notified.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Feature callouts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { icon: '🔤', label: 'Large Fonts', sub: 'Adjustable text for easy reading' },
          { icon: '🔊', label: 'Voice First', sub: 'Responses spoken in regional language' },
          { icon: '👨‍👩‍👦', label: 'Family Mode', sub: 'Family notified on unusual activity' },
        ].map(f => (
          <div key={f.label} className="glass" style={{ padding: '18px 20px' }}>
            <span style={{ fontSize: 28, display: 'block', marginBottom: 10 }}>{f.icon}</span>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#F2EFE8', marginBottom: 4 }}>{f.label}</p>
            <p style={{ fontSize: 11, color: 'rgba(242,239,232,0.4)' }}>{f.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
