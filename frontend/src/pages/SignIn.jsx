import { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

const SignIn = ({ onClose, onSignUpClick }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/api/auth/signin', form);
      if (data.success) {
        login(data.user);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleGoogleSignIn = () => {
    setError('');
    setGoogleLoading(true);
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      setError('Google Client ID not configured. Please add it to frontend .env');
      setGoogleLoading(false);
      return;
    }
    if (!window.google?.accounts?.id) {
      setError('Google Sign-In is still loading. Please try again.');
      setGoogleLoading(false);
      return;
    }
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          const { data } = await API.post('/api/auth/google', { credential: response.credential });
          if (data.success) {
            login(data.user);
            onClose();
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Google sign-in failed.');
        } finally {
          setGoogleLoading(false);
        }
      },
    });
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback: use renderButton in a hidden div to trigger popup
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);
        window.google.accounts.id.renderButton(tempDiv, { type: 'standard' });
        tempDiv.querySelector('div[role=button]')?.click();
        setTimeout(() => document.body.removeChild(tempDiv), 1000);
      }
    });
  };

  const inputBase = {
    width: '100%', padding: '12px 16px', borderRadius: '8px',
    border: '1.5px solid rgba(15,28,44,0.2)', backgroundColor: '#F9F9F9',
    fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#0f1c2c',
    outline: 'none', transition: 'all 0.25s ease', boxSizing: 'border-box',
  };
  const onFocus = (e) => { e.target.style.borderColor = '#c9a84c'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.2)'; e.target.style.backgroundColor = '#ffffff'; };
  const onBlur = (e) => { e.target.style.borderColor = 'rgba(15,28,44,0.2)'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#F9F9F9'; };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(9,29,46,0.6)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div id="signin-modal-container" style={{ display: 'flex', width: '100%', maxWidth: '900px', minHeight: '540px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(9,29,46,0.25)', margin: '16px', animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', position: 'relative' }}>

        {/* Left Panel */}
        <div id="signin-left-panel" style={{ flex: '0 0 45%', position: 'relative', backgroundColor: '#0f1c2c', display: 'none', overflow: 'hidden' }}>
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrG0MzPzrNM7DcLaWBWg2RVQP2YDvsVqxeouFm8onvAxI4e677iLNV51siUQtIhJL9eyuABVybpyf8_OEa3TG9XR9UqKwu0T_7HqIdWrSXg-IimKUrjOvPtrF7Qe9n_3VW8Xt6PnQlTM9Wuxg8NCk3ZRep2wZt6RlQssj2Zez3H7j0T0UwdOoBXrnU52C6krT__nWpb9-8ujn8mZM7-IsVxV_JekAjAgOMS7nTSmAfo6ayqWS6IgsbW-nHhLUUl6w7K-tTnPyt6BXq" alt="Luxury office"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,28,44,0.5)' }} />
          <div style={{ position: 'absolute', bottom: '40px', left: '36px', zIndex: 2, maxWidth: '280px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, marginBottom: '12px' }}>Elevate Your Pipeline.</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>The premium lead management engine for high-tier consultants.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div id="signin-right-panel" style={{ flex: 1, backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 40px', overflowY: 'auto', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f4f4f4', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}
            onMouseEnter={e => e.currentTarget.style.background = '#e8e8e8'}
            onMouseLeave={e => e.currentTarget.style.background = '#f4f4f4'}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#0f1c2c' }}>close</span>
          </button>

          <div style={{ maxWidth: '360px', margin: '0 auto', width: '100%' }}>
            {/* Brand */}
            <div style={{ marginBottom: '36px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '30px', color: '#0f1c2c', fontVariationSettings: "'FILL' 1" }}>assured_workload</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#0f1c2c' }}>LeadForge</span>
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: '#0f1c2c', marginBottom: '8px' }}>Welcome Back</h1>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#44474c' }}>Sign in to manage your premium leads.</p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: '#fee2e2', borderRadius: '8px', color: '#7f1d1d', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', flexShrink: 0 }}>error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label htmlFor="si-email" style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#0f1c2c', marginBottom: '8px', letterSpacing: '0.04em' }}>Email</label>
                <input id="si-email" type="email" placeholder="name@company.com" required
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputBase} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label htmlFor="si-password" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#0f1c2c', letterSpacing: '0.04em' }}>Password</label>
                  <a href="#!" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#44474c', textDecoration: 'none' }}>Forgot password?</a>
                </div>
                <input id="si-password" type="password" placeholder="••••••••" required
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  style={inputBase} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <button type="submit" disabled={loading} className="shimmer"
                style={{ width: '100%', padding: '13px', borderRadius: '8px', backgroundColor: '#fed977', color: '#0f1c2c', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1, boxShadow: '0 4px 14px rgba(201,168,76,0.3)', transition: 'all 0.25s ease' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#e6c364')}
                onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#fed977')}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(15,28,44,0.1)' }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#44474c' }}>Or continue with</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(15,28,44,0.1)' }} />
            </div>

            <button type="button" onClick={handleGoogleSignIn} disabled={googleLoading}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '8px', backgroundColor: '#F9F9F9', border: '1.5px solid rgba(15,28,44,0.15)', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#0f1c2c', cursor: googleLoading ? 'not-allowed' : 'pointer', opacity: googleLoading ? 0.7 : 1 }}
              onMouseEnter={e => !googleLoading && (e.currentTarget.style.backgroundColor = '#f0f0f0')}
              onMouseLeave={e => !googleLoading && (e.currentTarget.style.backgroundColor = '#F9F9F9')}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {googleLoading ? 'Connecting...' : 'Sign in with Google'}
            </button>

            <p style={{ marginTop: '24px', textAlign: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#44474c' }}>
              Don't have an account?{' '}
              <button onClick={onSignUpClick} style={{ fontWeight: 700, color: '#0f1c2c', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}
                onMouseEnter={e => e.target.style.color = '#755b00'}
                onMouseLeave={e => e.target.style.color = '#0f1c2c'}>
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (min-width: 768px) { #signin-left-panel { display: block !important; } }
        @media (max-width: 767px) {
          #signin-modal-container { min-height: auto !important; height: 90vh !important; }
          #signin-right-panel { padding: 24px 20px !important; }
        }
      `}</style>
    </div>
  );
};

export default SignIn;
