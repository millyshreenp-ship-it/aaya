import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';

/* ─── Data ─────────────────────────────────── */
const SPENDING_DATA = [
  { month: 'Jan', spent: 62000, budget: 75000 },
  { month: 'Feb', spent: 71000, budget: 75000 },
  { month: 'Mar', spent: 58000, budget: 75000 },
  { month: 'Apr', spent: 79000, budget: 75000 },
  { month: 'May', spent: 69000, budget: 75000 },
  { month: 'Jun', spent: 73000, budget: 75000 },
  { month: 'Jul', spent: 45000, budget: 75000 },
];

const INVESTMENT_PIE = [
  { name: 'Mutual Funds',   value: 38, color: '#C4A35A' },
  { name: 'Fixed Deposits', value: 28, color: '#2196f3' },
  { name: 'Equities',       value: 22, color: '#4caf50' },
  { name: 'Gold',           value: 12, color: '#ff9800' },
];

const WEALTH_GROWTH = [
  { year: '2022', value: 18 },
  { year: '2023', value: 24 },
  { year: '2024', value: 34 },
  { year: '2025', value: 41 },
  { year: '2026', value: 48.6 },
  { year: '2027', value: 58, projected: true },
  { year: '2028', value: 71, projected: true },
];

const SPARKLINE = [32, 35, 33, 40, 38, 44, 43, 48.6];

const GOALS = [
  { label: 'Home Down Payment', target: 500000, saved: 310000, color: '#C4A35A' },
  { label: 'Europe Trip',       target: 150000, saved: 87000,  color: '#4caf50' },
  { label: 'MacBook Pro',       target: 200000, saved: 42000,  color: '#9c27b0' },
];

const AGENTS_STATUS = [
  { name: 'Goal Agent',       status: 'Running',    icon: '🎯', color: '#4caf50' },
  { name: 'Fraud Protection', status: 'Monitoring', icon: '🛡',  color: '#C4A35A' },
  { name: 'Life Event Agent', status: 'Monitoring', icon: '🎉', color: '#2196f3' },
  { name: 'Relationship Mgr', status: 'Running',    icon: '🤝', color: '#4caf50' },
  { name: 'Opportunity Hunter',status:'Running',    icon: '🔍', color: '#4caf50' },
  { name: 'Support Agent',    status: 'Completed',  icon: '💬', color: '#9c27b0' },
];

const AI_RECS = [
  { icon: '📈', text: 'Increase SIP by ₹2,000/mo — could add ₹8.4L to retirement corpus by 2040' },
  { icon: '🔁', text: 'FD maturing in 18 days — HDFC is offering 7.6% (0.5% higher than current)' },
  { icon: '💸', text: 'You overspent ₹4,000 in dining this month. Enable Dining Budget Cap?' },
];

/* ─── Sub-components ───────────────────────── */
function MiniSparkline() {
  const pts = SPARKLINE.map((v, i) => ({ x: i, y: v }));
  const max = Math.max(...SPARKLINE), min = Math.min(...SPARKLINE);
  const W = 120, H = 40;
  const px = i => (i / (pts.length - 1)) * W;
  const py = v => H - ((v - min) / (max - min)) * H;
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${px(i)},${py(p.y)}`).join(' ');
  return (
    <svg width={W} height={H} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C4A35A" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#C4A35A" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`${d} L${W},${H} L0,${H} Z`} fill="url(#spark)" />
      <path d={d} fill="none" stroke="#C4A35A" strokeWidth={2} />
      <circle cx={px(pts.length-1)} cy={py(pts[pts.length-1].y)} r={3} fill="#C4A35A" />
    </svg>
  );
}

function GoalBar({ goal }) {
  const pct = Math.round((goal.saved / goal.target) * 100);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: '#F2EFE8' }}>{goal.label}</span>
        <span style={{ fontSize: 12, color: goal.color, fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: 'rgba(242,239,232,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: goal.color, borderRadius: 3, transition: 'width 1s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 10, color: 'rgba(242,239,232,0.3)' }}>₹{goal.saved.toLocaleString('en-IN')}</span>
        <span style={{ fontSize: 10, color: 'rgba(242,239,232,0.3)' }}>₹{goal.target.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}

/* ─── Main ─────────────────────────────────── */
export default function Dashboard() {
  const [liveTime, setLiveTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.35)', marginBottom: 6 }}>
            Welcome back, Khanak!
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 34, fontWeight: 700, lineHeight: 1 }}>
            Financial Overview
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 11, color: 'rgba(242,239,232,0.35)' }}>
            {liveTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <p style={{ fontSize: 17, fontFamily: 'Cormorant Garamond, serif', color: '#C4A35A', fontWeight: 600 }}>
            {liveTime.toLocaleTimeString('en-IN')}
          </p>
        </div>
      </div>

      {/* Top KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {/* Net Worth with sparkline */}
        <div className="glass" style={{ padding: '18px 20px', gridColumn: '1' }}>
          <p style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 6 }}>Net Worth</p>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 30, fontWeight: 700, color: '#C4A35A', lineHeight: 1, marginBottom: 10 }}>₹48.6L</p>
          <MiniSparkline />
        </div>
        <div className="glass" style={{ padding: '18px 20px' }}>
          <p style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 6 }}>Monthly Inflow</p>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 30, fontWeight: 700, color: '#4caf50', lineHeight: 1 }}>₹1,85,000</p>
          <p style={{ fontSize: 11, color: 'rgba(242,239,232,0.35)', marginTop: 8 }}>↑ 8% vs last month</p>
        </div>
        <div className="glass" style={{ padding: '18px 20px' }}>
          <p style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 6 }}>Predicted Cash Flow</p>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 30, fontWeight: 700, color: '#F2EFE8', lineHeight: 1 }}>₹42,300</p>
          <p style={{ fontSize: 11, color: 'rgba(242,239,232,0.35)', marginTop: 8 }}>After all commitments</p>
        </div>
        <div className="glass" style={{ padding: '18px 20px' }}>
          <p style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 6 }}>FD Maturity</p>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 30, fontWeight: 700, color: '#D42B2B', lineHeight: 1 }}>18 days</p>
          <p style={{ fontSize: 11, color: 'rgba(242,239,232,0.35)', marginTop: 8 }}>SBI · ₹3,00,000 · 7.1%</p>
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Spending vs Budget bar chart */}
        <div className="glass" style={{ padding: '22px' }}>
          <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 18 }}>
            Monthly Spending vs Budget
          </p>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={SPENDING_DATA} barGap={4}>
              <XAxis dataKey="month" tick={{ fill: 'rgba(242,239,232,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(242,239,232,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip contentStyle={{ background: '#0f0f11', border: '1px solid rgba(242,239,232,0.1)', fontSize: 11 }}
                formatter={v => `₹${v.toLocaleString('en-IN')}`} />
              <Bar dataKey="budget" fill="rgba(242,239,232,0.06)" radius={[2,2,0,0]} name="Budget" />
              <Bar dataKey="spent"  fill="#C4A35A" radius={[2,2,0,0]} name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Investment allocation donut */}
        <div className="glass" style={{ padding: '22px' }}>
          <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 6 }}>
            Investment Allocation
          </p>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: '#C4A35A', marginBottom: 8 }}>₹22.4L total</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={INVESTMENT_PIE} cx="50%" cy="50%" innerRadius={38} outerRadius={58} dataKey="value" paddingAngle={3}>
                  {INVESTMENT_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {INVESTMENT_PIE.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'rgba(242,239,232,0.6)', flex: 1 }}>{d.name}</span>
                  <span style={{ fontSize: 11, color: '#F2EFE8', fontWeight: 600 }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Third row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
        {/* Savings goals */}
        <div className="glass" style={{ padding: '22px' }}>
          <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 18 }}>
            Savings Goals
          </p>
          {GOALS.map(g => <GoalBar key={g.label} goal={g} />)}
        </div>

        {/* Wealth growth chart */}
        <div className="glass" style={{ padding: '22px' }}>
          <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 18 }}>
            Wealth Growth (₹L)
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={WEALTH_GROWTH}>
              <defs>
                <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C4A35A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C4A35A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fill: 'rgba(242,239,232,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(242,239,232,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0f0f11', border: '1px solid rgba(242,239,232,0.1)', fontSize: 11 }}
                formatter={v => [`₹${v}L`, 'Net Worth']} />
              <Area type="monotone" dataKey="value" stroke="#C4A35A" strokeWidth={2} fill="url(#wealthGrad)"
                strokeDasharray={(d) => d?.projected ? '5,4' : '0'} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Recommendations */}
        <div className="glass" style={{ padding: '22px' }}>
          <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 16 }}>
            ✨ AI Recommendations
          </p>
          {AI_RECS.map((r, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '12px 0',
              borderBottom: i < AI_RECS.length - 1 ? '1px solid rgba(242,239,232,0.06)' : 'none',
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{r.icon}</span>
              <p style={{ fontSize: 11, color: 'rgba(242,239,232,0.65)', lineHeight: 1.55 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Agent Network */}
      <div className="glass" style={{ padding: '22px' }}>
        <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 18 }}>
          AI Agent Network
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {AGENTS_STATUS.map(a => (
            <div key={a.name} style={{
              background: 'rgba(242,239,232,0.03)', border: '1px solid rgba(242,239,232,0.07)',
              borderRadius: 4, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{a.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, color: '#F2EFE8', fontWeight: 500, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: a.color,
                    boxShadow: a.status === 'Running' ? `0 0 5px ${a.color}` : 'none' }} />
                  <span style={{ fontSize: 9, color: a.color, letterSpacing: '.08em', textTransform: 'uppercase' }}>{a.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
