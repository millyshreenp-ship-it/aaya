import React, { useState, useEffect } from 'react';

const STEPS = [
  { label: 'Task Detected',    done: true,  active: false },
  { label: 'Helper Assigned',  done: true,  active: false },
  { label: 'En Route',         done: false, active: true  },
  { label: 'Completed',        done: false, active: false },
];

const SERVICES = [
  { icon: '💳', label: 'EMI Payment',  desc: 'Pay your home loan EMI in person' },
  { icon: '🪪', label: 'KYC Update',   desc: 'Update Aadhaar-linked KYC documents' },
  { icon: '📋', label: 'FD Booking',   desc: 'Open a new fixed deposit' },
  { icon: '📈', label: 'SIP Setup',    desc: 'Start or modify your SIP investments' },
];

// Animated simple map SVG
function MapSVG({ eta }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => p >= 90 ? p : p + 0.5);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Route: branch(x=80,y=200) → home(x=520,y=120)
  const pathLen = Math.sqrt(Math.pow(520-80, 2) + Math.pow(120-200, 2));
  const carX = 80 + (440 * progress / 100);
  const carY = 200 + (-80 * progress / 100);

  return (
    <svg viewBox="0 0 600 280" style={{ width: '100%', borderRadius: 6, background: '#0d1117' }}>
      {/* Road network */}
      <line x1="0" y1="200" x2="600" y2="200" stroke="rgba(242,239,232,0.08)" strokeWidth="16" />
      <line x1="300" y1="0" x2="300" y2="280" stroke="rgba(242,239,232,0.08)" strokeWidth="12" />
      <line x1="80" y1="0" x2="80" y2="280" stroke="rgba(242,239,232,0.08)" strokeWidth="8" />
      <line x1="520" y1="0" x2="520" y2="280" stroke="rgba(242,239,232,0.08)" strokeWidth="8" />
      <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(242,239,232,0.06)" strokeWidth="8" />

      {/* Dotted route */}
      <line x1="80" y1="200" x2="520" y2="120"
        stroke="#D42B2B" strokeWidth="2.5" strokeDasharray="8,5" opacity="0.7" />

      {/* Branch (start) */}
      <circle cx="80" cy="200" r="14" fill="rgba(196,163,90,0.2)" stroke="#C4A35A" strokeWidth="2" />
      <text x="80" y="205" textAnchor="middle" fill="#C4A35A" style={{ fontSize: 10 }}>🏦</text>
      <text x="80" y="225" textAnchor="middle" fill="rgba(242,239,232,0.45)" style={{ fontSize: 8 }}>Branch</text>

      {/* Home (end) */}
      <circle cx="520" cy="120" r="14" fill="rgba(76,175,80,0.2)" stroke="#4caf50" strokeWidth="2" />
      <text x="520" y="125" textAnchor="middle" fill="#4caf50" style={{ fontSize: 10 }}>🏠</text>
      <text x="520" y="142" textAnchor="middle" fill="rgba(242,239,232,0.45)" style={{ fontSize: 8 }}>Your Home</text>

      {/* Moving car */}
      <g transform={`translate(${carX}, ${carY})`}>
        <circle r="14" fill="#D42B2B" opacity="0.25" />
        <circle r="9" fill="#D42B2B" stroke="#fff" strokeWidth="2" />
        <text textAnchor="middle" dominantBaseline="central" style={{ fontSize: 10 }}>🚗</text>
        <circle r="18" fill="none" stroke="rgba(212,43,43,0.4)" strokeWidth="2">
          <animate attributeName="r" values="14;22;14" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* ETA label */}
      <rect x="250" y="10" width="100" height="28" rx="4" fill="rgba(212,43,43,0.2)" stroke="rgba(212,43,43,0.5)" strokeWidth="1" />
      <text x="300" y="28" textAnchor="middle" fill="#F2EFE8" style={{ fontSize: 11, fontWeight: 600 }}>ETA: {eta} min</text>
    </svg>
  );
}

export default function AAYAAssist() {
  const [eta, setEta] = useState(4);

  useEffect(() => {
    const t = setInterval(() => {
      setEta(e => e > 1 ? e - 1 : 1);
    }, 15000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.35)', marginBottom: 6 }}>
          Physical-Digital Bridge
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 700, lineHeight: 1 }}>
          AAYA <em style={{ color: '#C4A35A' }}>Assist</em>
        </h1>
      </div>

      {/* Trigger reason */}
      <div className="glass" style={{
        padding: '16px 20px',
        borderLeft: '3px solid #C4A35A',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <span style={{ fontSize: 22 }}>🤖</span>
        <div>
          <p style={{ fontSize: 12, color: 'rgba(242,239,232,0.45)', marginBottom: 3 }}>Trigger Reason</p>
          <p style={{ fontSize: 13, color: '#F2EFE8' }}>3 failed attempts on Home Loan EMI payment — AAYA dispatched a home helper</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Map */}
        <div className="glass" style={{ padding: '20px' }}>
          <p style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 14 }}>
            Live Tracking — Bandra Branch → Your Home
          </p>
          <MapSVG eta={eta} />
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Dispatch progress */}
          <div className="glass" style={{ padding: '20px' }}>
            <p style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 16 }}>
              Dispatch Progress
            </p>
            {STEPS.map((step, i) => (
              <div key={step.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: i < STEPS.length - 1 ? 12 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: step.done ? '#4caf50' : step.active ? '#C4A35A' : 'rgba(242,239,232,0.1)',
                    border: `2px solid ${step.done ? '#4caf50' : step.active ? '#C4A35A' : 'rgba(242,239,232,0.15)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10,
                  }}>
                    {step.done ? '✓' : step.active ? '⏳' : ''}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ width: 1, height: 16, background: step.done ? 'rgba(76,175,80,0.4)' : 'rgba(242,239,232,0.1)', marginTop: 2 }} />
                  )}
                </div>
                <p style={{ fontSize: 12, color: step.done ? '#4caf50' : step.active ? '#C4A35A' : 'rgba(242,239,232,0.3)', paddingTop: 3 }}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>

          {/* Representative card */}
          <div className="glass" style={{ padding: '18px' }}>
            <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 14 }}>
              Your Representative
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(196,163,90,0.15)', border: '2px solid rgba(196,163,90,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
              }}>👩</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#F2EFE8' }}>Priya Sharma</p>
                <p style={{ fontSize: 11, color: '#C4A35A' }}>★ 4.8 · Verified · 3 yrs exp</p>
              </div>
            </div>
            <button style={{
              width: '100%', background: 'rgba(76,175,80,0.12)',
              border: '1px solid rgba(76,175,80,0.3)', borderRadius: 4,
              padding: '10px', cursor: 'pointer', color: '#4caf50',
              fontSize: 12, fontWeight: 600, letterSpacing: '.06em',
            }}>📞 Call Priya</button>
          </div>

          {/* ETA */}
          <div className="glass" style={{ padding: '18px', textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: 'rgba(242,239,232,0.38)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 }}>Estimated Arrival</p>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 48, fontWeight: 700, color: '#D42B2B', lineHeight: 1 }}>{eta}</p>
            <p style={{ fontSize: 12, color: 'rgba(242,239,232,0.4)', marginTop: 4 }}>minutes away</p>
          </div>
        </div>
      </div>

      {/* Home services */}
      <div className="glass" style={{ padding: '24px' }}>
        <p style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 18 }}>
          Home Services Available
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {SERVICES.map(s => (
            <div key={s.label} className="glass" style={{
              padding: '18px 16px', textAlign: 'center', cursor: 'pointer',
              transition: 'border-color .2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(196,163,90,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(242,239,232,0.08)'}
            >
              <span style={{ fontSize: 28, display: 'block', marginBottom: 10 }}>{s.icon}</span>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#F2EFE8', marginBottom: 4 }}>{s.label}</p>
              <p style={{ fontSize: 10, color: 'rgba(242,239,232,0.38)', lineHeight: 1.4 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
