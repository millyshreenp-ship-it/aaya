import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const INPUT = {
  background: 'rgba(242,239,232,0.05)',
  border: '1px solid rgba(242,239,232,0.12)',
  borderRadius: 4,
  padding: '11px 14px',
  color: '#F2EFE8',
  fontSize: 13,
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  width: '100%',
};

const BTN_PRIMARY = {
  width: '100%',
  background: '#D42B2B',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  padding: '13px',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '.06em',
  textTransform: 'uppercase',
  marginTop: 8,
};

export default function AuthModal({ onClose }) {
  const { login } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [showPwd, setShowPwd] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  // Login form
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Register form
  const [regForm, setRegForm] = useState({
    fullName: '', username: '', password: '', aadhaar: '',
  });

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  function doLogin(e) {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) {
      setError('Please fill in all fields.'); return;
    }
    setLoading(true);
    setTimeout(() => {
      login({ name: 'Khanak Aggarwal', username: loginForm.username, avatar: 'KA' });
      setLoading(false);
      onClose && onClose();
    }, 800);
  }

  function doRegister(e) {
    e.preventDefault();
    if (!regForm.fullName || !regForm.username || !regForm.password || !regForm.aadhaar) {
      setError('Please fill in all fields.'); return;
    }
    if (regForm.aadhaar.replace(/\s/g, '').length !== 12) {
      setError('Aadhaar number must be 12 digits.'); return;
    }
    setLoading(true);
    setTimeout(() => {
      login({ name: regForm.fullName, username: regForm.username, avatar: regForm.fullName.slice(0,2).toUpperCase() });
      setLoading(false);
      onClose && onClose();
    }, 900);
  }

  const tabStyle = (t) => ({
    flex: 1,
    padding: '12px',
    background: tab === t ? 'rgba(212,43,43,0.15)' : 'transparent',
    border: 'none',
    borderBottom: tab === t ? '2px solid #D42B2B' : '2px solid transparent',
    color: tab === t ? '#F2EFE8' : 'rgba(242,239,232,0.4)',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '.08em',
    textTransform: 'uppercase',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'all .2s',
  });

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(7,7,8,0.82)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        width: 420, background: '#0a0a0c',
        border: '1px solid rgba(242,239,232,0.1)',
        borderRadius: 8, overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
      }} onClick={e => e.stopPropagation()}>

        {/* Logo header */}
        <div style={{
          padding: '28px 28px 20px',
          borderBottom: '1px solid rgba(242,239,232,0.07)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: '#D42B2B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff',
          }}>₹</div>
          <div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 700, color: '#F2EFE8', lineHeight: 1 }}>AAYA आया</p>
            <p style={{ fontSize: 10, color: 'rgba(242,239,232,0.35)', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 3 }}>India's Financial Brain</p>
          </div>
          <button onClick={onClose} style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            color: 'rgba(242,239,232,0.35)', cursor: 'pointer', fontSize: 18, lineHeight: 1,
          }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(242,239,232,0.07)' }}>
          <button style={tabStyle('register')} onClick={() => { setTab('register'); setError(''); }}>Create Account</button>
          <button style={tabStyle('login')} onClick={() => { setTab('login'); setError(''); }}>Login</button>
        </div>

        <div style={{ padding: '24px 28px 28px' }}>
          {error && (
            <div style={{
              background: 'rgba(212,43,43,0.12)', border: '1px solid rgba(212,43,43,0.3)',
              borderRadius: 4, padding: '10px 14px', marginBottom: 16,
              fontSize: 12, color: '#e57373',
            }}>{error}</div>
          )}

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={doLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(242,239,232,0.45)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Username</label>
                <input
                  style={INPUT}
                  placeholder="Enter your username"
                  value={loginForm.username}
                  onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(242,239,232,0.45)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    style={{ ...INPUT, paddingRight: 44 }}
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'rgba(242,239,232,0.4)',
                    cursor: 'pointer', fontSize: 14, lineHeight: 1,
                  }}>{showPwd ? '🙈' : '👁'}</button>
                </div>
              </div>
              <button type="submit" style={BTN_PRIMARY} disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In →'}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={doRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(242,239,232,0.45)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Full Name</label>
                <input style={INPUT} placeholder="Khanak Aggarwal"
                  value={regForm.fullName}
                  onChange={e => setRegForm(f => ({ ...f, fullName: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(242,239,232,0.45)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Username</label>
                <input style={INPUT} placeholder="@khanak"
                  value={regForm.username}
                  onChange={e => setRegForm(f => ({ ...f, username: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(242,239,232,0.45)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input style={{ ...INPUT, paddingRight: 44 }}
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={regForm.password}
                    onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))} />
                  <button type="button" onClick={() => setShowPwd(v => !v)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'rgba(242,239,232,0.4)',
                    cursor: 'pointer', fontSize: 14, lineHeight: 1,
                  }}>{showPwd ? '🙈' : '👁'}</button>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(242,239,232,0.45)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Aadhaar Number</label>
                <input style={INPUT} placeholder="XXXX XXXX XXXX"
                  maxLength={14}
                  value={regForm.aadhaar}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g, '').slice(0,12);
                    v = v.replace(/(\d{4})(\d{0,4})(\d{0,4})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '));
                    setRegForm(f => ({ ...f, aadhaar: v }));
                  }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(242,239,232,0.45)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Live Photo</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: '1px dashed rgba(242,239,232,0.2)',
                    borderRadius: 4, padding: '16px',
                    cursor: 'pointer', textAlign: 'center',
                    background: photoPreview ? 'none' : 'rgba(242,239,232,0.03)',
                    transition: 'border-color .2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(196,163,90,0.5)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(242,239,232,0.2)'}
                >
                  {photoPreview
                    ? <img src={photoPreview} alt="preview" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
                    : <>
                      <p style={{ fontSize: 22, marginBottom: 6 }}>📷</p>
                      <p style={{ fontSize: 12, color: 'rgba(242,239,232,0.4)' }}>Upload live photo</p>
                    </>
                  }
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
              </div>
              <button type="submit" style={BTN_PRIMARY} disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account →'}
              </button>
            </form>
          )}

          <p style={{ fontSize: 11, color: 'rgba(242,239,232,0.25)', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
            Protected by 256-bit encryption · RBI AA compliant
          </p>
        </div>
      </div>
    </div>
  );
}
