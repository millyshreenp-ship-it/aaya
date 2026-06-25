import React, { useState, useEffect, useRef } from 'react';

/* ── NOTE: Uses Leaflet (open-source) for demo.
   Replace with Google Maps SDK by setting REACT_APP_GOOGLE_MAPS_KEY
   and swapping the MapContainer for <GoogleMap> component. ─────────── */

/* ── Mock helper & user positions (Hyderabad area) ──── */
const USER_LOCATION   = { lat: 17.3850, lng: 78.4867, label: "Ammaji's Home", icon: '🏠' };
const BRANCH_LOCATION = { lat: 17.3950, lng: 78.4950, label: 'SBI Branch, Banjara Hills', icon: '🏦' };
const ATMS = [
  { lat: 17.3820, lng: 78.4820, label: 'SBI ATM — Operational', status: 'ok'  },
  { lat: 17.3870, lng: 78.4900, label: 'HDFC ATM — Cash Low',   status: 'low' },
  { lat: 17.3900, lng: 78.4840, label: 'ICICI ATM — Offline',   status: 'off' },
];

const DISPATCH_STAGES = [
  { id: 0, label: 'Trigger Received',     sub: 'Ammaji failed FD renewal 3 times', icon: '◈', done: false },
  { id: 1, label: 'Helper Assigned',      sub: 'Priya K · ★4.9 · Background verified', icon: '◉', done: false },
  { id: 2, label: 'On the Way',           sub: 'ETA 18 minutes · GPS active',       icon: '◷', done: false },
  { id: 3, label: 'Helper Arrived',       sub: 'Task: FD renewal assistance',       icon: '◎', done: false },
  { id: 4, label: 'Task Completed',       sub: 'FD renewed · Feedback collected',   icon: '✓', done: false },
];

/* ── Simple map rendered as SVG (no external lib needed) ── */
function SimpleMap({ helperPos, stage }) {
  const W = 640, H = 340;

  // Lat/lng to SVG pixels (approx)
  const toXY = (lat, lng) => ({
    x: ((lng - 78.478) / 0.022) * W,
    y: H - ((lat - 17.380) / 0.018) * H,
  });

  const user   = toXY(USER_LOCATION.lat, USER_LOCATION.lng);
  const branch = toXY(BRANCH_LOCATION.lat, BRANCH_LOCATION.lng);
  const helper = toXY(helperPos.lat, helperPos.lng);

  const atmPoints = ATMS.map(a => ({ ...toXY(a.lat, a.lng), ...a }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', borderRadius: 3, background: '#0d0f14' }}>
      {/* Grid lines */}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 57} x2={W} y2={i * 57}
          stroke="rgba(242,239,232,0.04)" strokeWidth={1} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`v${i}`} x1={i * 80} y1={0} x2={i * 80} y2={H}
          stroke="rgba(242,239,232,0.04)" strokeWidth={1} />
      ))}

      {/* Route line */}
      {stage > 0 && (
        <line x1={helper.x} y1={helper.y} x2={user.x} y2={user.y}
          stroke="#D42B2B" strokeWidth={2} strokeDasharray="6 4" opacity={0.6} />
      )}

      {/* ATMs */}
      {atmPoints.map((a, i) => (
        <g key={i}>
          <circle cx={a.x} cy={a.y} r={7}
            fill={a.status === 'ok' ? '#4caf50' : a.status === 'low' ? '#C4A35A' : '#D42B2B'}
            opacity={0.85} />
          <text x={a.x + 10} y={a.y + 4} fill="rgba(242,239,232,0.6)" fontSize={9}>{a.label}</text>
        </g>
      ))}

      {/* Bank branch */}
      <g>
        <rect x={branch.x - 10} y={branch.y - 10} width={20} height={20}
          fill="#1a3a6e" rx={2} />
        <text x={branch.x} y={branch.y + 4} textAnchor="middle" fontSize={10}>🏦</text>
        <text x={branch.x} y={branch.y + 20} textAnchor="middle" fill="rgba(242,239,232,0.5)" fontSize={9}>
          SBI Branch
        </text>
      </g>

      {/* User home */}
      <g>
        <circle cx={user.x} cy={user.y} r={12} fill="rgba(196,163,90,0.2)"
          stroke="#C4A35A" strokeWidth={2} />
        <text x={user.x} y={user.y + 4} textAnchor="middle" fontSize={12}>🏠</text>
        <text x={user.x} y={user.y - 18} textAnchor="middle" fill="#C4A35A" fontSize={10}>Ammaji</text>
      </g>

      {/* Helper marker (animated) */}
      {stage > 0 && (
        <g>
          <circle cx={helper.x} cy={helper.y} r={16} fill="none"
            stroke="rgba(212,43,43,0.5)" strokeWidth={2}
            style={{ animation: 'pulse-ring 1.4s ease-out infinite' }} />
          <circle cx={helper.x} cy={helper.y} r={12} fill="#D42B2B" />
          <text x={helper.x} y={helper.y + 4} textAnchor="middle" fontSize={10}>👩</text>
          <text x={helper.x} y={helper.y - 18} textAnchor="middle" fill="#D42B2B" fontSize={10}>Priya K.</text>
        </g>
      )}

      {/* Labels */}
      <text x={8} y={H - 8} fill="rgba(242,239,232,0.2)" fontSize={8}>
        Hyderabad · Banjara Hills area · Demo coordinates
      </text>
    </svg>
  );
}

export default function MapTracker() {
  const [stage, setStage]         = useState(-1);
  const [stages, setStages]       = useState(DISPATCH_STAGES.map(s => ({ ...s })));
  const [helperPos, setHelperPos] = useState({ lat: 17.3950, lng: 78.4920 });
  const [eta, setEta]             = useState(18);
  const [notifications, setNotifications] = useState([]);
  const [running, setRunning]     = useState(false);
  const intervalRef = useRef(null);

  /* ── Start dispatch sequence ── */
  function startDispatch() {
    if (running) return;
    setRunning(true);
    setStage(0);
    setStages(DISPATCH_STAGES.map(s => ({ ...s })));
    setEta(18);
    setNotifications([]);

    let s = 0;
    function advance() {
      setStages(prev => prev.map((st, i) => i <= s ? { ...st, done: true } : st));
      setStage(s);

      const msgs = [
        '📱 Rahul notified: Helper dispatched to Ammaji',
        '📍 Helper Priya K. en route · GPS tracking active',
        '🔔 Family alert: Helper arrived at Ammaji\'s home',
        '✅ FD renewed successfully · Ammaji confirmed',
      ];
      if (msgs[s]) setNotifications(n => [{ msg: msgs[s], ts: new Date() }, ...n]);

      s++;
      if (s < DISPATCH_STAGES.length) {
        intervalRef.current = setTimeout(advance, 2500);
        setEta(e => Math.max(0, e - 5));
        // Move helper closer to user
        setHelperPos(prev => ({
          lat: prev.lat - 0.002,
          lng: prev.lng - 0.003,
        }));
      } else {
        setRunning(false);
        setHelperPos({ lat: USER_LOCATION.lat + 0.001, lng: USER_LOCATION.lng + 0.001 });
      }
    }
    advance();
  }

  function resetDispatch() {
    clearTimeout(intervalRef.current);
    setStage(-1);
    setStages(DISPATCH_STAGES.map(s => ({ ...s })));
    setHelperPos({ lat: 17.3950, lng: 78.4920 });
    setEta(18);
    setRunning(false);
    setNotifications([]);
  }

  useEffect(() => () => clearTimeout(intervalRef.current), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.35)', marginBottom: 6 }}>
          Maps & Location · Home Helper Dispatch
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 700, lineHeight: 1 }}>
          Helper <em style={{ color: '#C4A35A' }}>Dispatch</em> Map
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(242,239,232,0.45)', marginTop: 8 }}>
          Real-time GPS tracking · ATM locator · Home helper routing
        </p>
      </div>

      {/* Trigger scenario */}
      <div className="glass" style={{ padding: '20px 24px', borderColor: 'rgba(212,43,43,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <p style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: '#D42B2B', marginBottom: 8 }}>
              Trigger Condition Met
            </p>
            <p style={{ fontSize: 14, color: '#F2EFE8', marginBottom: 4 }}>
              Ammaji (72, Banjara Hills) attempted FD renewal 3 times and failed.
            </p>
            <p style={{ fontSize: 12, color: 'rgba(242,239,232,0.45)' }}>
              AAYA AI prompt: <em>"Kya aap chahte hain ki ek helper aapke ghar aaye?"</em>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <button onClick={startDispatch} disabled={running} style={{
              background: running ? 'rgba(212,43,43,0.4)' : '#D42B2B',
              color: '#fff', border: 'none', borderRadius: 2,
              padding: '10px 22px', cursor: running ? 'not-allowed' : 'pointer',
              fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase',
            }}>
              {running ? 'Dispatching...' : 'Dispatch Helper'}
            </button>
            <button onClick={resetDispatch} style={{
              background: 'none', border: '1px solid rgba(242,239,232,0.15)',
              color: 'rgba(242,239,232,0.5)', borderRadius: 2,
              padding: '10px 16px', cursor: 'pointer', fontSize: 12,
            }}>Reset</button>
          </div>
        </div>
      </div>

      {/* Map + stages */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Map */}
        <div className="glass" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, alignItems: 'center' }}>
            <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.4)' }}>Live Map</p>
            {stage >= 1 && stage < 4 && (
              <span style={{ fontSize: 13, color: '#D42B2B', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>
                ETA: {eta} min
              </span>
            )}
          </div>
          <SimpleMap helperPos={helperPos} stage={stage} />
          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
            {[
              { color: '#C4A35A', label: "Ammaji's Home" },
              { color: '#D42B2B', label: 'Helper (Priya K.)' },
              { color: '#4caf50', label: 'ATM Operational' },
              { color: '#C4A35A', label: 'ATM Cash Low' },
              { color: '#D42B2B', label: 'ATM Offline' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                <span style={{ fontSize: 10, color: 'rgba(242,239,232,0.45)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dispatch stages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="glass" style={{ padding: '20px' }}>
            <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 16 }}>
              Dispatch Progress
            </p>
            {stages.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', gap: 12, marginBottom: i < stages.length - 1 ? 16 : 0, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: s.done ? '#D42B2B' : 'rgba(242,239,232,0.07)',
                    border: `1px solid ${s.done ? '#D42B2B' : 'rgba(242,239,232,0.15)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, color: s.done ? '#fff' : 'rgba(242,239,232,0.3)',
                    transition: 'all .4s',
                  }}>{s.done ? '✓' : s.icon}</div>
                  {i < stages.length - 1 && (
                    <div style={{
                      width: 1, height: 24, marginTop: 4,
                      background: s.done ? '#D42B2B' : 'rgba(242,239,232,0.1)',
                      transition: 'background .4s',
                    }} />
                  )}
                </div>
                <div>
                  <p style={{ fontSize: 13, color: s.done ? '#F2EFE8' : 'rgba(242,239,232,0.4)', fontWeight: s.done ? 500 : 400 }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(242,239,232,0.3)', marginTop: 2 }}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="glass" style={{ padding: '16px' }}>
              <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 12 }}>
                Family Notifications
              </p>
              {notifications.map((n, i) => (
                <div key={i} style={{ padding: '8px 10px', background: 'rgba(242,239,232,0.04)', borderRadius: 3, marginBottom: 6 }}>
                  <p style={{ fontSize: 12, color: '#F2EFE8' }}>{n.msg}</p>
                  <p style={{ fontSize: 10, color: 'rgba(242,239,232,0.3)', marginTop: 2 }}>{n.ts.toLocaleTimeString('en-IN')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ATM status table */}
      <div className="glass" style={{ padding: '20px 24px' }}>
        <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.38)', marginBottom: 16 }}>
          Nearby ATM Status
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ATMS.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(242,239,232,0.03)', borderRadius: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: a.status === 'ok' ? '#4caf50' : a.status === 'low' ? '#C4A35A' : '#D42B2B',
                  boxShadow: `0 0 6px ${a.status === 'ok' ? '#4caf50' : a.status === 'low' ? '#C4A35A' : '#D42B2B'}`,
                }} />
                <span style={{ fontSize: 13, color: '#F2EFE8' }}>{a.label}</span>
              </div>
              <span className="badge-red" style={{
                background: a.status === 'ok' ? '#2e7d32' : a.status === 'low' ? 'rgba(196,163,90,0.3)' : 'rgba(212,43,43,0.3)',
                color: a.status === 'ok' ? '#81c784' : a.status === 'low' ? '#C4A35A' : '#e57373',
              }}>
                {a.status === 'ok' ? 'Operational' : a.status === 'low' ? 'Cash Low' : 'Offline'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
