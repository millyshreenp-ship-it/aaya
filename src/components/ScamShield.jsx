import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ALERTS = [
  { id: 1, type: 'Vishing Call', desc: '+91 98765 12340 impersonated SBI officer', time: '10:24 AM', severity: 'high' },
  { id: 2, type: 'Suspicious UPI', desc: 'UPI request from unverified merchant @pay_lucky123', time: '09:17 AM', severity: 'medium' },
  { id: 3, type: 'Phishing Link', desc: 'Link in SMS: sbi-update-kyc.xyz — flagged as phishing', time: 'Yesterday', severity: 'high' },
];

const FRAUD_DATA = [
  { name: 'Vishing',       value: 32, color: '#D42B2B' },
  { name: 'UPI Fraud',     value: 27, color: '#C4A35A' },
  { name: 'Phishing Links',value: 21, color: '#9c27b0' },
  { name: 'SIM Swap',      value: 12, color: '#2196f3' },
  { name: 'KYC Fraud',     value: 8,  color: '#4caf50' },
];

const TRANSACTIONS = [
  { id: 'TXN001', to: 'Amazon Pay',       amount: '₹2,499',   status: 'Safe',    date: 'Today 11:02' },
  { id: 'TXN002', to: 'Unknown UPI ID',   amount: '₹15,000',  status: 'Blocked', date: 'Today 10:45' },
  { id: 'TXN003', to: 'Swiggy',           amount: '₹348',     status: 'Safe',    date: 'Today 09:30' },
  { id: 'TXN004', to: 'pay_lucky_draws',  amount: '₹5,000',   status: 'Blocked', date: 'Yesterday'   },
  { id: 'TXN005', to: 'HDFC Bank EMI',    amount: '₹32,800',  status: 'Safe',    date: 'Yesterday'   },
];

const PROTECTIONS = [
  '✓ Real-time UPI monitoring active',
  '✓ Call identity verification enabled',
  '✓ Link scanner in SMS & WhatsApp',
  '✓ KYC fraud pattern detection',
  '✓ SIM swap alert configured',
  '✓ 24/7 anomaly detection running',
];

export default function ScamShield() {
  const [dismissed, setDismissed] = useState([]);
  const activeAlerts = ALERTS.filter(a => !dismissed.includes(a.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.35)', marginBottom: 6 }}>
          AI-Powered Fraud Protection
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 700, lineHeight: 1 }}>
          Scam <em style={{ color: '#D42B2B' }}>Shield</em>
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(242,239,232,0.45)', marginTop: 8 }}>
          Monitoring calls, UPI, SMS, and transactions in real-time
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Threats Blocked',   value: '41,820', accent: '#D42B2B' },
          { label: 'Alerts Today',      value: activeAlerts.length.toString(), accent: '#C4A35A' },
          { label: 'Protected Amount',  value: '₹8.4L',  accent: '#4caf50' },
          { label: 'Shield Score',      value: '98/100', accent: '#9c27b0' },
        ].map(s => (
          <div key={s.label} className="glass" style={{ padding: '20px 22px' }}>
            <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.35)', marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 30, fontWeight: 700, color: s.accent }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent alerts */}
        <div className="glass" style={{ padding: '24px' }}>
          <p style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 18 }}>
            Recent Alerts
          </p>
          {activeAlerts.length === 0 && (
            <p style={{ fontSize: 13, color: 'rgba(242,239,232,0.35)', textAlign: 'center', padding: '20px 0' }}>✓ No active alerts</p>
          )}
          {activeAlerts.map(alert => (
            <div key={alert.id} style={{
              background: alert.severity === 'high' ? 'rgba(212,43,43,0.08)' : 'rgba(196,163,90,0.08)',
              border: `1px solid ${alert.severity === 'high' ? 'rgba(212,43,43,0.25)' : 'rgba(196,163,90,0.25)'}`,
              borderRadius: 4, padding: '14px 16px', marginBottom: 10,
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{alert.severity === 'high' ? '🚨' : '⚠️'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: alert.severity === 'high' ? '#e57373' : '#C4A35A' }}>{alert.type}</span>
                  <span style={{ fontSize: 10, color: 'rgba(242,239,232,0.3)' }}>{alert.time}</span>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(242,239,232,0.6)', lineHeight: 1.5, marginBottom: 10 }}>{alert.desc}</p>
                <button
                  onClick={() => setDismissed(d => [...d, alert.id])}
                  style={{
                    background: 'none', border: '1px solid rgba(242,239,232,0.15)',
                    borderRadius: 3, padding: '4px 12px', color: 'rgba(242,239,232,0.4)',
                    cursor: 'pointer', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase',
                  }}
                >Dismiss</button>
              </div>
            </div>
          ))}
        </div>

        {/* Fraud type breakdown */}
        <div className="glass" style={{ padding: '24px' }}>
          <p style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 8 }}>
            Fraud Type Breakdown
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={FRAUD_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {FRAUD_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0f0f11', border: '1px solid rgba(242,239,232,0.1)', borderRadius: 4, fontSize: 12 }}
                formatter={(v, n) => [`${v}%`, n]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {FRAUD_DATA.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                <span style={{ fontSize: 10, color: 'rgba(242,239,232,0.5)' }}>{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction scanner */}
      <div className="glass" style={{ padding: '24px' }}>
        <p style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 18 }}>
          Transaction Scanner
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto auto', gap: '0 16px', marginBottom: 10 }}>
          {['Txn ID', 'Recipient', 'Amount', 'Status'].map(h => (
            <span key={h} style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.3)' }}>{h}</span>
          ))}
        </div>
        {TRANSACTIONS.map((t, i) => (
          <div key={t.id} style={{
            display: 'grid', gridTemplateColumns: '100px 1fr auto auto', gap: '0 16px',
            padding: '12px 0', borderTop: '1px solid rgba(242,239,232,0.05)',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: 11, color: 'rgba(242,239,232,0.35)', fontFamily: 'monospace' }}>{t.id}</span>
            <div>
              <p style={{ fontSize: 13, color: '#F2EFE8' }}>{t.to}</p>
              <p style={{ fontSize: 10, color: 'rgba(242,239,232,0.3)' }}>{t.date}</p>
            </div>
            <span style={{ fontSize: 13, color: '#C4A35A', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>{t.amount}</span>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase',
              color: t.status === 'Safe' ? '#4caf50' : '#D42B2B',
              padding: '4px 10px', borderRadius: 100,
              background: t.status === 'Safe' ? 'rgba(76,175,80,0.12)' : 'rgba(212,43,43,0.12)',
              border: `1px solid ${t.status === 'Safe' ? 'rgba(76,175,80,0.3)' : 'rgba(212,43,43,0.3)'}`,
            }}>{t.status}</span>
          </div>
        ))}
      </div>

      {/* Active protections */}
      <div className="glass" style={{ padding: '24px' }}>
        <p style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 16 }}>
          Active Protections
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {PROTECTIONS.map((p, i) => (
            <p key={i} style={{ fontSize: 12, color: '#4caf50', lineHeight: 1.5 }}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
