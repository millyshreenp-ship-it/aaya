import React, { useState, useRef, useEffect } from 'react';
import { futureSelfChat } from '../utils/claudeAPI';

const STARTER_PROMPTS = [
  "What happens if I delay my SIP by 3 more years?",
  "Should I take that personal loan at 18%?",
  "How much will my retirement corpus be if I invest ₹5000/month now?",
  "What did delaying investing at 22 cost me?",
];

const FUTURE_AVATAR_INTRO = `Yaar... I've been waiting for you to ask. I'm you — 45-year-old Rahul. 
Things turned out okay, but I need to tell you about a few decisions that cost us big. 
The clock is ticking on decisions you're making RIGHT NOW that I lived through.
Ask me anything — I'll give you the rupee-level truth.`;

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '12px 16px' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#C4A35A',
          animation: `wave-anim 1.2s ease-in-out infinite`,
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  );
}

export default function FutureSelf() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: FUTURE_AVATAR_INTRO, ts: new Date() }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setError('');

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    setMessages(prev => [...prev, { role: 'user', content: msg, ts: new Date() }]);
    setLoading(true);

    try {
      const reply = await futureSelfChat(msg, history);
      setMessages(prev => [...prev, { role: 'assistant', content: reply, ts: new Date() }]);
    } catch (e) {
      setError(e.message || 'Could not reach Claude. Check your API key in .env');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Yaar, connection lost — set REACT_APP_ANTHROPIC_API_KEY in your .env file and I'll be right back.",
        ts: new Date(), isError: true,
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: 'calc(100vh - 140px)' }}>
      {/* Header */}
      <div>
        <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.35)', marginBottom: 6 }}>
          Emotional Intelligence Layer
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 700, lineHeight: 1 }}>
          Future Self <em style={{ color: '#C4A35A' }}>Simulator</em>
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(242,239,232,0.45)', marginTop: 8 }}>
          Chat with your 45-year-old self. Powered by Claude Sonnet.
        </p>
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, flex: 1, minHeight: 0 }}>
        {/* Chat window */}
        <div className="glass" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', gap: 12, alignItems: 'flex-start' }}>
                {/* Avatar */}
                {m.role === 'assistant' && (
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #C4A35A, #8b6914)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, color: '#fff', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700,
                  }}>45</div>
                )}
                {/* Bubble */}
                <div style={{
                  maxWidth: '75%',
                  background: m.role === 'user'
                    ? 'rgba(212,43,43,0.15)'
                    : m.isError ? 'rgba(255,100,100,0.08)' : 'rgba(196,163,90,0.1)',
                  border: `1px solid ${m.role === 'user' ? 'rgba(212,43,43,0.2)' : 'rgba(196,163,90,0.2)'}`,
                  borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '2px 12px 12px 12px',
                  padding: '12px 16px',
                }}>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: '#F2EFE8', whiteSpace: 'pre-wrap' }}>{m.content}</p>
                  <p style={{ fontSize: 10, color: 'rgba(242,239,232,0.3)', marginTop: 6 }}>
                    {m.ts?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #C4A35A, #8b6914)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, color: '#fff', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700,
                }}>45</div>
                <div className="glass" style={{ borderRadius: '2px 12px 12px 12px' }}>
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(242,239,232,0.07)',
            display: 'flex', gap: 10,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask your future self anything..."
              style={{
                flex: 1, background: 'rgba(242,239,232,0.05)',
                border: '1px solid rgba(242,239,232,0.1)',
                borderRadius: 3, padding: '10px 14px',
                color: '#F2EFE8', fontSize: 13, outline: 'none',
                fontFamily: 'DM Sans, sans-serif',
              }}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              style={{
                background: input.trim() ? '#D42B2B' : 'rgba(212,43,43,0.3)',
                color: '#fff', border: 'none', borderRadius: 3,
                padding: '10px 20px', cursor: input.trim() ? 'pointer' : 'not-allowed',
                fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase',
                transition: 'background .2s',
              }}
            >Send</button>
          </div>
        </div>

        {/* Sidebar: starters + impact panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Starter prompts */}
          <div className="glass" style={{ padding: '20px' }}>
            <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 14 }}>
              Ask Your Future Self
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {STARTER_PROMPTS.map((p, i) => (
                <button key={i} onClick={() => send(p)} style={{
                  background: 'rgba(242,239,232,0.04)', border: '1px solid rgba(242,239,232,0.08)',
                  borderRadius: 3, padding: '10px 12px', color: 'rgba(242,239,232,0.65)',
                  fontSize: 12, cursor: 'pointer', textAlign: 'left', lineHeight: 1.4,
                  transition: 'all .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,163,90,0.1)'; e.currentTarget.style.color = '#F2EFE8'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(242,239,232,0.04)'; e.currentTarget.style.color = 'rgba(242,239,232,0.65)'; }}
                >{p}</button>
              ))}
            </div>
          </div>

          {/* Cost of delay calculator */}
          <div className="glass" style={{ padding: '20px' }}>
            <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 14 }}>
              Cost of Delay
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: '3-yr SIP delay', impact: '−₹34L corpus', color: '#D42B2B' },
                { label: '18% personal loan', impact: '−₹12L interest', color: '#e57373' },
                { label: 'No ELSS in 30s', impact: '−₹8.4L tax saved', color: '#C4A35A' },
              ].map(item => (
                <div key={item.label} style={{ padding: '10px 12px', background: 'rgba(212,43,43,0.07)', borderRadius: 3 }}>
                  <p style={{ fontSize: 11, color: 'rgba(242,239,232,0.45)' }}>{item.label}</p>
                  <p style={{ fontSize: 16, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, color: item.color, marginTop: 2 }}>{item.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Model indicator */}
          <div style={{ padding: '12px 16px', background: 'rgba(196,163,90,0.08)', borderRadius: 3, border: '1px solid rgba(196,163,90,0.2)' }}>
            <p style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#C4A35A', marginBottom: 4 }}>Powered By</p>
            <p style={{ fontSize: 12, color: 'rgba(242,239,232,0.6)' }}>Claude Sonnet 4.6</p>
            <p style={{ fontSize: 10, color: 'rgba(242,239,232,0.3)', marginTop: 2 }}>Anthropic · LLM Layer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
