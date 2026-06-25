import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const NAV_SECTIONS = [
  {
    title: 'MAIN',
    items: [
      { path: '/home',        icon: '⌂',  label: 'Home'         },
      { path: '/dashboard',   icon: '◈',  label: 'Dashboard'    },
      { path: '/future-self', icon: '◷',  label: 'Future Self'  },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      { path: '/constitution', icon: '⚖',  label: 'Constitution' },
      { path: '/scam-shield',  icon: '🛡',  label: 'Scam Shield'  },
      { path: '/elderly',      icon: '⊕',  label: 'Elderly Mode' },
    ],
  },
  {
    title: 'SERVICES',
    items: [
      { path: '/assist',      icon: '🏠', label: 'AAYA Assist'  },
      { path: '/voice',       icon: '◉',  label: 'Intelligence' },
      { path: '/agents',      icon: '◆',  label: 'AI Agents'    },
    ],
  },
  {
    title: 'OTHER',
    items: [
      { path: '/biometrics',  icon: '⊛',  label: 'Biometrics'   },
      { path: '/map',         icon: '◎',  label: 'Map & Dispatch'},
    ],
  },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex" style={{ background: '#070708', height: '100vh', overflow: 'hidden' }}>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <aside style={{
        width: collapsed ? 56 : 220,
        background: '#0a0a0c',
        borderRight: '1px solid rgba(242,239,232,0.07)',
        display: 'flex', flexDirection: 'column',
        transition: 'width .3s ease',
        flexShrink: 0, height: '100vh', overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 14px 16px',
          borderBottom: '1px solid rgba(242,239,232,0.07)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: '#D42B2B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>₹</div>
          {!collapsed && (
            <span style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 18,
              fontWeight: 600, color: '#F2EFE8', letterSpacing: '.04em', whiteSpace: 'nowrap',
            }}>AAYA आया</span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px 8px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {NAV_SECTIONS.map(sec => (
            <div key={sec.title} style={{ marginBottom: 8 }}>
              {!collapsed && (
                <p style={{
                  fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase',
                  color: 'rgba(242,239,232,0.22)', padding: '6px 8px 4px', fontWeight: 600,
                }}>{sec.title}</p>
              )}
              {sec.items.map(n => (
                <NavLink
                  key={n.path} to={n.path}
                  className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                  title={collapsed ? n.label : undefined}
                >
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{n.icon}</span>
                  {!collapsed && <span>{n.label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Financial Health score */}
        {!collapsed && (
          <div style={{
            padding: '14px 16px',
            borderTop: '1px solid rgba(242,239,232,0.07)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(76,175,80,0.15)', border: '2px solid rgba(76,175,80,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#4caf50',
              }}>82</div>
              <div>
                <p style={{ fontSize: 11, color: '#4caf50', fontWeight: 600 }}>Excellent</p>
                <p style={{ fontSize: 9, color: 'rgba(242,239,232,0.3)', letterSpacing: '.06em' }}>HEALTH SCORE</p>
              </div>
            </div>
          </div>
        )}

        {/* Back to home + collapse */}
        {!collapsed && (
          <a href="/" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 16px',
            borderTop: '1px solid rgba(242,239,232,0.07)',
            color: 'rgba(242,239,232,0.3)', fontSize: 11,
            letterSpacing: '.08em', textTransform: 'uppercase',
            textDecoration: 'none', transition: 'color .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#C4A35A'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(242,239,232,0.3)'}
          >← Landing Page</a>
        )}

        <button onClick={() => setCollapsed(c => !c)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '12px', color: 'rgba(242,239,232,0.3)',
          fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase',
          borderTop: '1px solid rgba(242,239,232,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-end',
        }}>
          {collapsed ? '→' : '← Collapse'}
        </button>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        {/* Header */}
        <header style={{
          padding: '14px 28px',
          borderBottom: '1px solid rgba(242,239,232,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(7,7,8,0.88)', backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4caf50', boxShadow: '0 0 6px #4caf50' }} />
            <span style={{ fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(242,239,232,0.35)' }}>
              AAYA · AI Dashboard
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="badge-red">Live</span>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: 'rgba(242,239,232,0.55)' }}>{user.name}</span>
                <div
                  onClick={() => { logout(); navigate('/'); }}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'rgba(196,163,90,0.15)', border: '1px solid rgba(196,163,90,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: '#C4A35A', cursor: 'pointer', fontWeight: 700,
                    title: 'Logout',
                  }}
                  title="Logout"
                >
                  {user.avatar}
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)} style={{
                background: '#D42B2B', color: '#fff', border: 'none',
                borderRadius: 3, padding: '7px 16px', cursor: 'pointer',
                fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif',
              }}>Sign In</button>
            )}
          </div>
        </header>

        <div style={{ padding: '28px 32px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
