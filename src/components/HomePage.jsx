import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function useCounter(target, duration = 2000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const protected_ = useCounter(2_84_139, 2200);
  const blocked    = useCounter(41_820,  2000);
  const savings    = useCounter(18_400,  2500);

  return (
    <div style={{ minHeight: '100vh', background: '#070708', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      {/* Tagline */}
      <p style={{
        fontSize: 11, letterSpacing: '.35em', textTransform: 'uppercase',
        color: 'rgba(242,239,232,0.35)', marginBottom: 24,
      }}>NAMASTE · NAVIGATE · NURTURE</p>

      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(42px, 8vw, 80px)',
          fontWeight: 700, lineHeight: 1.05, color: '#F2EFE8',
          marginBottom: 16,
        }}>
          Welcome back,<br />
          <em style={{ color: '#C4A35A' }}>{user?.name?.split(' ')[0] || 'Friend'}!</em>
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(242,239,232,0.45)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
          Your autonomous financial brain is active and monitoring your wealth 24/7.
        </p>
      </div>

      {/* Live counters */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
        marginBottom: 52, width: '100%', maxWidth: 680,
      }}>
        {[
          { label: 'Customers Protected', value: protected_.toLocaleString('en-IN'), accent: '#C4A35A' },
          { label: 'Fraud Blocked', value: blocked.toLocaleString('en-IN'), accent: '#D42B2B' },
          { label: 'Avg. Savings/Year', value: `₹${savings.toLocaleString('en-IN')}`, accent: '#4caf50' },
        ].map(c => (
          <div key={c.label} style={{
            background: 'rgba(15,15,17,0.72)',
            border: '1px solid rgba(242,239,232,0.08)',
            borderRadius: 6, padding: '28px 24px', textAlign: 'center',
            backdropFilter: 'blur(12px)',
          }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 38, fontWeight: 700, color: c.accent, lineHeight: 1 }}>{c.value}</p>
            <p style={{ fontSize: 11, color: 'rgba(242,239,232,0.38)', marginTop: 8, letterSpacing: '.1em', textTransform: 'uppercase' }}>{c.label}</p>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: '#D42B2B', color: '#fff', border: 'none',
            borderRadius: 4, padding: '16px 40px', cursor: 'pointer',
            fontSize: 14, fontWeight: 600, letterSpacing: '.06em',
            textTransform: 'uppercase', boxShadow: '0 0 30px rgba(212,43,43,0.3)',
            transition: 'all .2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}
        >
          Launch Dashboard →
        </button>
        <button
          onClick={() => navigate('/future-self')}
          style={{
            background: 'transparent', color: '#C4A35A',
            border: '1px solid rgba(196,163,90,0.4)',
            borderRadius: 4, padding: '16px 40px', cursor: 'pointer',
            fontSize: 14, fontWeight: 600, letterSpacing: '.06em',
            textTransform: 'uppercase', transition: 'all .2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,163,90,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none'; }}
        >
          Try Future Self
        </button>
      </div>

      {/* Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 40 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4caf50', boxShadow: '0 0 8px #4caf50' }} />
        <span style={{ fontSize: 11, color: 'rgba(242,239,232,0.35)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
          AI agents running · All systems nominal
        </span>
      </div>
    </div>
  );
}
