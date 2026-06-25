import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ── Anomaly scoring model ─────────────────────────── */
function computeAnomalyScore(sessions) {
  if (sessions.length < 2) return 0;
  const current  = sessions[sessions.length - 1];
  const baseline = sessions.slice(0, -1);

  const avgTypingSpeed = baseline.reduce((s, b) => s + b.typingSpeed, 0) / baseline.length;
  const avgScrollSpeed = baseline.reduce((s, b) => s + b.scrollSpeed, 0) / baseline.length;
  const avgClickPrecision = baseline.reduce((s, b) => s + b.clickPrecision, 0) / baseline.length;

  const typingDev  = Math.abs(current.typingSpeed   - avgTypingSpeed)   / (avgTypingSpeed  || 1);
  const scrollDev  = Math.abs(current.scrollSpeed   - avgScrollSpeed)   / (avgScrollSpeed  || 1);
  const clickDev   = Math.abs(current.clickPrecision - avgClickPrecision) / (avgClickPrecision || 1);

  return Math.min(100, Math.round((typingDev * 40 + scrollDev * 30 + clickDev * 30)));
}

function getRiskLevel(score) {
  if (score < 20) return { label: 'Low Risk', color: '#4caf50', icon: '●' };
  if (score < 50) return { label: 'Moderate', color: '#C4A35A', icon: '◉' };
  return { label: 'High Risk', color: '#D42B2B', icon: '⊗' };
}

/* ── Heatmap dot ─────────────────────────────────────── */
function HeatDot({ x, y, age }) {
  const opacity = Math.max(0, 1 - age / 40);
  const size    = 24 + (1 - opacity) * 30;
  return (
    <div style={{
      position: 'absolute',
      left: x - size / 2, top: y - size / 2,
      width: size, height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, rgba(212,43,43,${0.5 * opacity}) 0%, transparent 70%)`,
      pointerEvents: 'none',
    }} />
  );
}

/* ── Gauge ───────────────────────────────────────────── */
function ScoreGauge({ score }) {
  const risk = getRiskLevel(score);
  const r = 55, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={130} height={130} viewBox="0 0 130 130">
        <circle cx={65} cy={65} r={r} fill="none" stroke="rgba(242,239,232,0.07)" strokeWidth={8} />
        <circle cx={65} cy={65} r={r} fill="none"
          stroke={risk.color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dashoffset .6s ease, stroke .4s' }}
        />
        <text x={65} y={61} textAnchor="middle" fill="#F2EFE8"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 700 }}>{score}</text>
        <text x={65} y={78} textAnchor="middle" fill="rgba(242,239,232,0.38)"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, letterSpacing: 1 }}>ANOMALY</text>
      </svg>
      <span style={{ fontSize: 12, color: risk.color, letterSpacing: '.08em', textTransform: 'uppercase' }}>
        {risk.icon} {risk.label}
      </span>
    </div>
  );
}

export default function Biometrics() {
  const [keyEvents, setKeyEvents]         = useState([]);
  const [scrollEvents, setScrollEvents]   = useState([]);
  const [clickDots, setClickDots]         = useState([]);
  const [sessions, setSessions]           = useState([
    { typingSpeed: 4.2, scrollSpeed: 120, clickPrecision: 92, ts: Date.now() - 300000 },
    { typingSpeed: 4.5, scrollSpeed: 115, clickPrecision: 90, ts: Date.now() - 200000 },
    { typingSpeed: 4.1, scrollSpeed: 125, clickPrecision: 94, ts: Date.now() - 100000 },
  ]);
  const [currentSession, setCurrentSession] = useState({ typingSpeed: 0, scrollSpeed: 0, clickPrecision: 0 });
  const [anomalyScore, setAnomalyScore]   = useState(0);
  const [frameCount, setFrameCount]       = useState(0);
  const [alerts, setAlerts]               = useState([]);
  const heatmapRef = useRef(null);
  const keyTimesRef = useRef([]);
  const scrollRef   = useRef({ last: 0, speed: 0 });
  const clicksRef   = useRef([]);

  /* ── Frame ticker for heatmap aging ── */
  useEffect(() => {
    const id = setInterval(() => setFrameCount(f => f + 1), 500);
    return () => clearInterval(id);
  }, []);

  /* ── Purge old dots ── */
  useEffect(() => {
    setClickDots(d => d.map(dd => ({ ...dd, age: dd.age + 1 })).filter(dd => dd.age < 40));
  }, [frameCount]);

  /* ── Update anomaly score when sessions change ── */
  useEffect(() => {
    const score = computeAnomalyScore([...sessions, currentSession]);
    setAnomalyScore(score);
    if (score >= 50 && sessions.length > 2) {
      setAlerts(a => [
        { ts: new Date(), score, msg: 'Unusual interaction pattern detected. Verify identity.' },
        ...a.slice(0, 4),
      ]);
    }
  }, [sessions, currentSession]);

  /* ── Keyboard listener ── */
  const handleKeyDown = useCallback((e) => {
    const now = performance.now();
    keyTimesRef.current.push(now);
    if (keyTimesRef.current.length > 10) keyTimesRef.current.shift();

    const intervals = keyTimesRef.current.slice(1).map((t, i) => t - keyTimesRef.current[i]);
    const avgInterval = intervals.length ? intervals.reduce((s, v) => s + v, 0) / intervals.length : 200;
    const keysPerSec  = avgInterval > 0 ? 1000 / avgInterval : 4;

    setKeyEvents(k => [{ char: e.key === ' ' ? '·' : e.key.length === 1 ? e.key : '⌫', ts: now }, ...k.slice(0, 14)]);
    setCurrentSession(cs => ({ ...cs, typingSpeed: parseFloat(keysPerSec.toFixed(2)) }));
  }, []);

  /* ── Scroll listener ── */
  const handleScroll = useCallback(() => {
    const now = performance.now();
    const dy  = Math.abs(window.scrollY - scrollRef.current.last);
    const dt  = now - (scrollRef.current.lastTime || now);
    const speed = dt > 0 ? (dy / dt) * 1000 : 0;
    scrollRef.current = { last: window.scrollY, lastTime: now, speed };

    setScrollEvents(s => [{ speed: Math.round(speed), ts: now }, ...s.slice(0, 9)]);
    setCurrentSession(cs => ({ ...cs, scrollSpeed: Math.round(speed) }));
  }, []);

  /* ── Click listener on heatmap ── */
  function handleHeatmapClick(e) {
    const rect = heatmapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    clicksRef.current.push({ x, y, ts: performance.now() });

    const centre = { x: rect.width / 2, y: rect.height / 2 };
    const dist   = Math.sqrt((x - centre.x) ** 2 + (y - centre.y) ** 2);
    const maxDist = Math.sqrt(centre.x ** 2 + centre.y ** 2);
    const precision = Math.round(100 - (dist / maxDist) * 60);

    setClickDots(d => [...d, { x, y, age: 0 }]);
    setCurrentSession(cs => ({ ...cs, clickPrecision: precision }));
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll',  handleScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll',  handleScroll);
    };
  }, [handleKeyDown, handleScroll]);

  /* ── Snapshot session every 15s ── */
  useEffect(() => {
    const id = setInterval(() => {
      if (currentSession.typingSpeed > 0) {
        setSessions(s => [...s.slice(-9), { ...currentSession, ts: Date.now() }]);
      }
    }, 15000);
    return () => clearInterval(id);
  }, [currentSession]);

  /* ── Simulate anomaly ── */
  function simulateAnomaly() {
    setSessions(s => [...s, { typingSpeed: 9.8, scrollSpeed: 560, clickPrecision: 32, ts: Date.now() }]);
  }
  function resetNormal() {
    setSessions([
      { typingSpeed: 4.2, scrollSpeed: 120, clickPrecision: 92, ts: Date.now() - 5000 },
      { typingSpeed: 4.5, scrollSpeed: 115, clickPrecision: 90, ts: Date.now() - 3000 },
      { typingSpeed: 4.1, scrollSpeed: 125, clickPrecision: 94, ts: Date.now() - 1000 },
    ]);
    setAlerts([]);
  }

  const risk = getRiskLevel(anomalyScore);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.35)', marginBottom: 6 }}>
          Trust & Security Layer
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 700, lineHeight: 1 }}>
          Behavioural <em style={{ color: '#C4A35A' }}>Biometrics</em>
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(242,239,232,0.45)', marginTop: 8 }}>
          Real-time typing · scroll · click pattern analysis · anomaly scoring
        </p>
      </div>

      {/* Top row */}
      <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: 16, alignItems: 'start' }}>
        {/* Score gauge */}
        <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <ScoreGauge score={anomalyScore} />
          <button onClick={simulateAnomaly} style={{
            background: '#D42B2B', color: '#fff', border: 'none', borderRadius: 2,
            padding: '7px 12px', cursor: 'pointer', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase',
          }}>Simulate Anomaly</button>
          <button onClick={resetNormal} style={{
            background: 'none', color: 'rgba(242,239,232,0.4)', border: '1px solid rgba(242,239,232,0.12)',
            borderRadius: 2, padding: '7px 12px', cursor: 'pointer', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase',
          }}>Reset Normal</button>
        </div>

        {/* Keystroke dynamics */}
        <div className="glass" style={{ padding: '20px 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 14 }}>
            Keystroke Dynamics — Type Below
          </p>
          <textarea
            placeholder="Type anything to analyse your keystroke pattern..."
            style={{
              width: '100%', minHeight: 80, background: 'rgba(242,239,232,0.04)',
              border: '1px solid rgba(242,239,232,0.1)', borderRadius: 3,
              padding: '10px 12px', color: '#F2EFE8', fontSize: 13,
              fontFamily: 'DM Sans, sans-serif', resize: 'vertical', outline: 'none',
            }}
          />
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: 'rgba(242,239,232,0.4)' }}>Typing Speed</span>
              <span style={{ fontSize: 13, color: '#C4A35A', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>
                {currentSession.typingSpeed} keys/sec
              </span>
            </div>
            <div style={{ height: 4, background: 'rgba(242,239,232,0.07)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                width: `${Math.min(100, currentSession.typingSpeed / 10 * 100)}%`,
                background: '#C4A35A', transition: 'width .4s',
              }} />
            </div>
          </div>
          {/* Recent keys */}
          <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {keyEvents.map((k, i) => (
              <span key={i} style={{
                padding: '3px 8px', background: 'rgba(242,239,232,0.07)',
                borderRadius: 3, fontSize: 11, color: 'rgba(242,239,232,0.6)',
                fontFamily: 'monospace', opacity: 1 - i * 0.06,
              }}>{k.char}</span>
            ))}
          </div>
        </div>

        {/* Scroll & click metrics */}
        <div className="glass" style={{ padding: '20px 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 14 }}>
            Scroll & Click Metrics
          </p>
          {[
            { label: 'Scroll Speed', value: `${currentSession.scrollSpeed} px/sec`, pct: Math.min(100, currentSession.scrollSpeed / 600 * 100), color: '#4caf50' },
            { label: 'Click Precision', value: `${currentSession.clickPrecision}%`, pct: currentSession.clickPrecision, color: '#C4A35A' },
          ].map(m => (
            <div key={m.label} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'rgba(242,239,232,0.4)' }}>{m.label}</span>
                <span style={{ fontSize: 13, color: m.color, fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>{m.value}</span>
              </div>
              <div style={{ height: 4, background: 'rgba(242,239,232,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, width: `${m.pct}%`, background: m.color, transition: 'width .4s' }} />
              </div>
            </div>
          ))}
          <p style={{ fontSize: 11, color: 'rgba(242,239,232,0.35)', marginTop: 4 }}>
            Session snapshots: {sessions.length} · Click heatmap below
          </p>
        </div>
      </div>

      {/* Click heatmap */}
      <div className="glass" style={{ padding: '20px 24px' }}>
        <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 14 }}>
          Click Heatmap — Click Anywhere in Box
        </p>
        <div
          ref={heatmapRef}
          onClick={handleHeatmapClick}
          style={{
            width: '100%', height: 220, position: 'relative',
            background: 'rgba(242,239,232,0.03)', border: '1px dashed rgba(242,239,232,0.12)',
            borderRadius: 3, cursor: 'crosshair', overflow: 'hidden',
          }}
        >
          {clickDots.map((d, i) => <HeatDot key={i} x={d.x} y={d.y} age={d.age} />)}
          <p style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(242,239,232,0.12)', fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase',
            pointerEvents: 'none',
          }}>Click to generate heatmap · mouse move tracked</p>
        </div>
      </div>

      {/* Anomaly alerts */}
      {alerts.length > 0 && (
        <div className="glass" style={{ padding: '20px 24px', borderColor: 'rgba(212,43,43,0.3)' }}>
          <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#D42B2B', marginBottom: 14 }}>
            ⊗ Anomaly Alerts
          </p>
          {alerts.map((a, i) => (
            <div key={i} style={{ padding: '10px 14px', background: 'rgba(212,43,43,0.08)', borderRadius: 3, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 13, color: '#F2EFE8' }}>{a.msg}</p>
                <span className="badge-red">Score: {a.score}</span>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(242,239,232,0.35)', marginTop: 4 }}>{a.ts.toLocaleTimeString('en-IN')}</p>
            </div>
          ))}
        </div>
      )}

      {/* Session history table */}
      <div className="glass" style={{ padding: '20px 24px' }}>
        <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 14 }}>
          Session Baseline History
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {['Typing (k/s)', 'Scroll (px/s)', 'Click Prec.', 'Time'].map(h => (
            <span key={h} style={{ fontSize: 10, color: 'rgba(242,239,232,0.3)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{h}</span>
          ))}
          {sessions.slice(-5).reverse().map((s, i) => (
            <React.Fragment key={i}>
              <span style={{ fontSize: 13, color: '#F2EFE8' }}>{s.typingSpeed}</span>
              <span style={{ fontSize: 13, color: '#F2EFE8' }}>{s.scrollSpeed}</span>
              <span style={{ fontSize: 13, color: '#F2EFE8' }}>{s.clickPrecision}%</span>
              <span style={{ fontSize: 11, color: 'rgba(242,239,232,0.35)' }}>{new Date(s.ts).toLocaleTimeString('en-IN')}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
