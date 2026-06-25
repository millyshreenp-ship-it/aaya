import React, { useState, useRef, useEffect } from 'react';
import { acquisitionChat, financialCoachAdvice, productRecommendation, relationshipNudge } from '../utils/claudeAPI';

const AGENTS = [
  { id: 'goal',       name: 'Goal Agent',        icon: '🎯', color: '#C4A35A', status: 'Running',    desc: 'Tracks your financial goals and optimises savings', fn: async (msg) => financialCoachAdvice(msg) },
  { id: 'fraud',      name: 'Fraud Protection',  icon: '🛡',  color: '#D42B2B', status: 'Monitoring', desc: 'Real-time fraud and scam detection across all channels', fn: async (msg) => acquisitionChat(msg) },
  { id: 'life',       name: 'Life Event Agent',  icon: '🎉', color: '#2196f3', status: 'Monitoring', desc: 'Detects major life events and adapts your financial plan', fn: async (msg) => financialCoachAdvice(msg) },
  { id: 'rm',         name: 'Relationship Mgr',  icon: '🤝', color: '#4caf50', status: 'Running',    desc: 'Personalised nudges, reviews, and loyalty management', fn: async () => relationshipNudge({ name: 'Khanak', score: 82, topGoal: 'house', sipAmount: 16000 }) },
  { id: 'opportunity',name: 'Opportunity Hunter',icon: '🔍', color: '#ff9800', status: 'Running',    desc: 'Finds better rates, offers, and investment opportunities', fn: async (msg) => productRecommendation(msg) },
  { id: 'support',    name: 'Support Agent',     icon: '💬', color: '#9c27b0', status: 'Completed',  desc: 'Handles queries, complaints, and service requests', fn: async (msg) => acquisitionChat(msg) },
];

const QUICK = {
  goal:        ['How much more to reach my home goal?', 'Show my goal progress', 'Optimise savings for Europe trip'],
  fraud:       ['Any suspicious transactions today?', 'Check last UPI transfer', 'Enable extra protection'],
  life:        ['I just got married', 'I am expecting a baby', 'I changed jobs — update plan'],
  rm:          ['Show my portfolio review', 'What loyalty rewards do I have?', 'Schedule quarterly review'],
  opportunity: ['Best FD rate right now?', 'Any better SIP options?', 'Compare HDFC vs ICICI savings account'],
  support:     ['Raise a complaint', 'Track my loan application', 'Update my mobile number'],
};

const TIMELINE = [
  { agent: 'Goal Agent',        time: '10:32 AM', action: 'Saved ₹12,000 surplus into Home Goal fund automatically' },
  { agent: 'Fraud Protection',  time: '09:47 AM', action: 'Blocked suspicious UPI request from unverified merchant' },
  { agent: 'Opportunity Hunter',time: '09:15 AM', action: 'Found HDFC FD at 7.6% — 0.5% better than your current rate' },
  { agent: 'Relationship Mgr',  time: 'Yesterday', action: 'Financial Health Score improved by 3 points → now 82/100' },
  { agent: 'Life Event Agent',  time: 'Yesterday', action: 'Detected salary hike — updated retirement projection' },
  { agent: 'Support Agent',     time: '2 days ago', action: 'Resolved KYC query — documents verified successfully' },
];

const statusColor = s => s === 'Running' ? '#4caf50' : s === 'Monitoring' ? '#C4A35A' : '#9c27b0';

function AgentChat({ agent }) {
  const [messages, setMessages] = useState([{
    role: 'agent',
    text: `Hi! I'm the ${agent.name}. ${agent.desc}. How can I help you today?`,
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  async function send(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text: msg, time }]);
    setLoading(true);
    try {
      const reply = await agent.fn(msg, history);
      const rt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { role: 'agent', text: reply, time: rt }]);
      setHistory(h => [...h, { role: 'user', content: msg }, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'agent', text: 'API key missing — set REACT_APP_ANTHROPIC_API_KEY in .env to activate.', time }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 400 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid rgba(242,239,232,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: m.role === 'agent' ? agent.color : 'rgba(242,239,232,0.45)', fontWeight: 600 }}>
                {m.role === 'agent' ? agent.icon + ' ' + agent.name : '◉ You'}
              </span>
              <span style={{ fontSize: 10, color: 'rgba(242,239,232,0.25)' }}>{m.time}</span>
            </div>
            <p style={{ fontSize: 12, color: '#F2EFE8', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{m.text}</p>
          </div>
        ))}
        {loading && (
          <div style={{ padding: '10px 16px', display: 'flex', gap: 5 }}>
            {[0,1,2].map(i => <div key={i} className="wave-bar" style={{ animationDelay: `${i*0.2}s` }} />)}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(242,239,232,0.06)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {(QUICK[agent.id] || []).map((q, i) => (
          <button key={i} onClick={() => send(q)} style={{
            background: 'rgba(242,239,232,0.05)', border: '1px solid rgba(242,239,232,0.1)',
            borderRadius: 100, padding: '4px 10px', color: 'rgba(242,239,232,0.55)',
            cursor: 'pointer', fontSize: 10, letterSpacing: '.04em',
          }}>{q}</button>
        ))}
      </div>
      <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(242,239,232,0.07)', display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder={`Message ${agent.name}...`}
          style={{
            flex: 1, background: 'rgba(242,239,232,0.05)',
            border: '1px solid rgba(242,239,232,0.1)', borderRadius: 3,
            padding: '8px 12px', color: '#F2EFE8', fontSize: 13,
            fontFamily: 'DM Sans, sans-serif', outline: 'none',
          }} />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{
          background: input.trim() ? agent.color : 'rgba(242,239,232,0.1)',
          color: '#fff', border: 'none', borderRadius: 3,
          padding: '8px 14px', cursor: input.trim() ? 'pointer' : 'not-allowed', fontSize: 12,
        }}>→</button>
      </div>
    </div>
  );
}

export default function AgentPanel() {
  const [activeAgent, setActiveAgent] = useState(AGENTS[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.35)', marginBottom: 6 }}>Multi-Agent Architecture</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 700, lineHeight: 1 }}>
          AI <em style={{ color: '#C4A35A' }}>Agents</em>
        </h1>
      </div>

      {/* Agent cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {AGENTS.map(a => (
          <div key={a.id} onClick={() => setActiveAgent(a)} className="glass" style={{
            padding: '16px 18px', cursor: 'pointer',
            borderLeft: activeAgent.id === a.id ? `3px solid ${a.color}` : '3px solid transparent',
            background: activeAgent.id === a.id ? `rgba(15,15,17,0.9)` : 'rgba(15,15,17,0.6)',
            transition: 'all .2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>{a.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#F2EFE8' }}>{a.name}</span>
              <span style={{
                marginLeft: 'auto', fontSize: 9, fontWeight: 600, letterSpacing: '.08em',
                textTransform: 'uppercase', color: statusColor(a.status),
                padding: '2px 8px', borderRadius: 100,
                background: `${statusColor(a.status)}18`,
                border: `1px solid ${statusColor(a.status)}40`,
              }}>{a.status}</span>
            </div>
            <p style={{ fontSize: 10, color: 'rgba(242,239,232,0.4)', lineHeight: 1.5 }}>{a.desc}</p>
          </div>
        ))}
      </div>

      {/* Active agent chat */}
      <div className="glass" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid rgba(242,239,232,0.07)',
          display: 'flex', alignItems: 'center', gap: 12,
          background: `${activeAgent.color}12`,
        }}>
          <span style={{ fontSize: 22 }}>{activeAgent.icon}</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#F2EFE8' }}>{activeAgent.name}</p>
            <p style={{ fontSize: 11, color: 'rgba(242,239,232,0.4)' }}>{activeAgent.desc}</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor(activeAgent.status), boxShadow: `0 0 5px ${statusColor(activeAgent.status)}` }} />
            <span style={{ fontSize: 10, color: statusColor(activeAgent.status), letterSpacing: '.08em' }}>{activeAgent.status} · Claude Sonnet 4.6</span>
          </div>
        </div>
        <AgentChat key={activeAgent.id} agent={activeAgent} />
      </div>

      {/* Activity timeline */}
      <div className="glass" style={{ padding: '24px' }}>
        <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 18 }}>
          Agent Activity Timeline
        </p>
        {TIMELINE.map((t, i) => {
          const agent = AGENTS.find(a => a.name === t.agent);
          return (
            <div key={i} style={{
              display: 'flex', gap: 14, padding: '11px 0',
              borderBottom: i < TIMELINE.length - 1 ? '1px solid rgba(242,239,232,0.05)' : 'none',
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{agent?.icon || '◈'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 3, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: agent?.color || '#C4A35A', fontWeight: 600 }}>{t.agent}</span>
                  <span style={{ fontSize: 10, color: 'rgba(242,239,232,0.25)' }}>{t.time}</span>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(242,239,232,0.65)', lineHeight: 1.5 }}>{t.action}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
