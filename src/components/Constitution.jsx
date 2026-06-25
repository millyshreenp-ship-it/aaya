import React, { useState } from 'react';

const RULES = [
  { id: 'min_balance', label: 'Minimum Balance Guard', desc: 'Alerts and blocks if balance drops below ₹10,000', icon: '🛡' },
  { id: 'surplus',     label: 'Surplus Auto-Invest',   desc: 'Auto-invests surplus above ₹50,000 into SIP', icon: '📈' },
  { id: 'sub_freeze',  label: 'Subscription Freeze',   desc: 'Blocks new subscriptions during low-balance months', icon: '🔒' },
  { id: 'sip_remind',  label: 'SIP Reminder',          desc: 'Sends reminder 3 days before SIP deduction date', icon: '🔔' },
  { id: 'large_alert', label: 'Large Transfer Alert',  desc: 'Flags transfers above ₹20,000 for confirmation', icon: '⚠️' },
];

const ACTIVITY_LOG = [
  { time: '09:14 AM', action: 'Auto-invested ₹12,000 surplus into HDFC Mid Cap SIP', agent: 'Surplus Agent' },
  { time: '08:52 AM', action: 'Blocked ₹299 Hotstar subscription (budget cap hit)', agent: 'Sub Freeze' },
  { time: 'Yesterday', action: 'Sent SIP reminder — ICICI Prudential deduction tomorrow', agent: 'SIP Reminder' },
  { time: 'Yesterday', action: 'Flagged ₹45,000 transfer to unknown UPI — held for review', agent: 'Transfer Guard' },
  { time: '2 days ago', action: 'Minimum balance restored after salary credit ₹1,85,000', agent: 'Balance Guard' },
];

const SUGGESTIONS = [
  'Enable Emergency Fund Rule — auto-park 10% of income into liquid fund',
  'Add Travel Budget Cap — freeze discretionary spends when abroad',
  'Turn on Gold Accumulation — buy ₹500 of digital gold every month',
];

function Toggle({ on, onChange }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
        background: on ? '#D42B2B' : 'rgba(242,239,232,0.12)',
        border: on ? '1px solid rgba(212,43,43,0.6)' : '1px solid rgba(242,239,232,0.15)',
        position: 'relative', transition: 'all .25s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: on ? 23 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: on ? '#fff' : 'rgba(242,239,232,0.5)',
        transition: 'left .25s',
        boxShadow: on ? '0 0 6px rgba(212,43,43,0.4)' : 'none',
      }} />
    </div>
  );
}

export default function Constitution() {
  const [rules, setRules] = useState({ min_balance: true, surplus: true, sub_freeze: false, sip_remind: true, large_alert: true });
  const activeCount = Object.values(rules).filter(Boolean).length;

  function toggle(id) {
    setRules(r => ({ ...r, [id]: !r[id] }));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.35)', marginBottom: 6 }}>
          Autonomous Rules Engine
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 700, lineHeight: 1 }}>
          Financial <em style={{ color: '#C4A35A' }}>Constitution</em>
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(242,239,232,0.45)', marginTop: 8 }}>
          Set your money rules once. AAYA enforces them autonomously — forever.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Rules list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {RULES.map(rule => (
            <div key={rule.id} className="glass" style={{
              padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: 16,
              borderLeft: rules[rule.id] ? '3px solid #D42B2B' : '3px solid rgba(242,239,232,0.08)',
              transition: 'border-color .25s',
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{rule.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#F2EFE8', marginBottom: 4 }}>{rule.label}</p>
                <p style={{ fontSize: 11, color: 'rgba(242,239,232,0.38)', lineHeight: 1.5 }}>{rule.desc}</p>
              </div>
              <Toggle on={rules[rule.id]} onChange={() => toggle(rule.id)} />
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Automation summary */}
          <div className="glass" style={{ padding: '20px' }}>
            <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 16 }}>
              Automation Summary
            </p>
            {[
              { label: 'Active Rules', value: `${activeCount} / ${RULES.length}`, accent: '#C4A35A' },
              { label: 'Est. Monthly Savings', value: '₹14,200', accent: '#4caf50' },
              { label: 'Auto-Invested YTD', value: '₹1,09,000', accent: '#9c27b0' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 12, color: 'rgba(242,239,232,0.45)' }}>{s.label}</span>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 700, color: s.accent }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* AAYA suggests */}
          <div className="glass" style={{ padding: '20px' }}>
            <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 14 }}>
              ✨ AAYA Suggests
            </p>
            {SUGGESTIONS.map((s, i) => (
              <div key={i} style={{
                padding: '10px 0', borderBottom: i < SUGGESTIONS.length - 1 ? '1px solid rgba(242,239,232,0.06)' : 'none',
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <span style={{ color: '#C4A35A', fontSize: 12, flexShrink: 0, marginTop: 1 }}>→</span>
                <p style={{ fontSize: 11, color: 'rgba(242,239,232,0.6)', lineHeight: 1.55 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div className="glass" style={{ padding: '24px' }}>
        <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 18 }}>
          Activity Log — AI Actions
        </p>
        {ACTIVITY_LOG.map((entry, i) => (
          <div key={i} style={{
            display: 'flex', gap: 16, padding: '12px 0',
            borderBottom: i < ACTIVITY_LOG.length - 1 ? '1px solid rgba(242,239,232,0.05)' : 'none',
          }}>
            <span style={{ fontSize: 11, color: 'rgba(242,239,232,0.3)', flexShrink: 0, minWidth: 80 }}>{entry.time}</span>
            <p style={{ fontSize: 12, color: '#F2EFE8', flex: 1, lineHeight: 1.5 }}>{entry.action}</p>
            <span style={{ fontSize: 10, color: '#C4A35A', flexShrink: 0, letterSpacing: '.06em' }}>{entry.agent}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
