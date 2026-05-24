import { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

const SignUp = ({ onClose, onSignInClick }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/api/auth/signup', {
        name: form.name, email: form.email,
        password: form.password, mobile: form.mobile,
      });
      if (data.success) {
        // Automatically switch to sign-in modal after successful signup
        onSignInClick();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed. Please try again.');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '8px',
    border: '1.5px solid rgba(15,28,44,0.2)', backgroundColor: '#F9F9F9',
    fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#0f1c2c',
    outline: 'none', transition: 'all 0.25s ease', boxSizing: 'border-box',
  };
  const handleFocus = (e) => { e.target.style.borderColor = '#c9a84c'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.2)'; e.target.style.backgroundColor = '#ffffff'; };
  const handleBlur  = (e) => { e.target.style.borderColor = 'rgba(15,28,44,0.2)'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#F9F9F9'; };
  const labelStyle = { display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#0f1c2c', marginBottom: '8px', letterSpacing: '0.04em' };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(9,29,46,0.6)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div id="signup-modal-container" style={{ display: 'flex', width: '100%', maxWidth: '1000px', minHeight: '600px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(9,29,46,0.25)', margin: '16px', animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', position: 'relative' }}>

        {/* Left Panel */}
        <div id="signup-left-panel" style={{ flex: '0 0 45%', position: 'relative', backgroundColor: '#0f1c2c', display: 'none', overflow: 'hidden' }}>
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKRFnBtWdGmQK8N-TXUB_mZlLBb77H0yH3KyLhDm1N_fLKb3Td2kxQxVx_tRpkAYMWAa3YHbqNT9-M3U_nU6kM_zqSCHNjJAbcSZtVPSTU8M3XFdW62MuqMXCBGFl-2kh29HtPIIiuaLi4sHPpuFx7E6qDd2ysIXM9G4MSZW9rAhANbFQHbhCUaX5d6e6LI9WS0JlV3ueK0PZ9XAfvHJJBt0qK5YVXkXzXN4mBSGYfGUfKbGg-v43-H0pPZ7Tm_dZBjCFMjYWe" alt="Premium networking"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,28,44,0.55)' }} />
          <div style={{ position: 'absolute', bottom: '40px', left: '36px', zIndex: 2, maxWidth: '280px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, marginBottom: '12px' }}>Start Your Journey.</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>Join thousands of consultants managing premium leads with LeadForge.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div id="signup-right-panel" style={{ flex: 1, backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 40px', overflowY: 'auto', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f4f4f4', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}
            onMouseEnter={e => e.currentTarget.style.background = '#e8e8e8'}
            onMouseLeave={e => e.currentTarget.style.background = '#f4f4f4'}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#0f1c2c' }}>close</span>
          </button>

          <div style={{ maxWidth: '360px', margin: '0 auto', width: '100%' }}>
            {/* Brand */}
            <div style={{ marginBottom: '28px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '30px', color: '#0f1c2c', fontVariationSettings: "'FILL' 1" }}>assured_workload</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#0f1c2c' }}>LeadForge</span>
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 700, color: '#0f1c2c', marginBottom: '6px' }}>Create Account</h1>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#44474c' }}>Set up your premium lead management account.</p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: '#fee2e2', borderRadius: '8px', color: '#7f1d1d', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', flexShrink: 0 }}>error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="su-name" style={labelStyle}>Full Name</label>
                <input id="su-name" type="text" placeholder="John Smith" required
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
              <div>
                <label htmlFor="su-mobile" style={labelStyle}>Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#74777d', pointerEvents: 'none' }}>phone</span>
                  <input id="su-mobile" type="tel" placeholder="+91 98765 43210"
                    value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })}
                    style={{ ...inputStyle, paddingLeft: '40px' }} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
              </div>
              <div>
                <label htmlFor="su-email" style={labelStyle}>Email</label>
                <input id="su-email" type="email" placeholder="name@company.com" required
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
              <div>
                <label htmlFor="su-password" style={labelStyle}>Password</label>
                <input id="su-password" type="password" placeholder="Min. 6 characters" required
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
              <div>
                <label htmlFor="su-confirm" style={labelStyle}>Confirm Password</label>
                <input id="su-confirm" type="password" placeholder="Re-enter your password" required
                  value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
              <button type="submit" disabled={loading} className="shimmer"
                style={{ marginTop: '4px', width: '100%', padding: '13px', borderRadius: '8px', backgroundColor: '#fed977', color: '#0f1c2c', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1, boxShadow: '0 4px 14px rgba(201,168,76,0.3)', transition: 'all 0.25s ease' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#e6c364')}
                onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#fed977')}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>



            <p style={{ marginTop: '20px', textAlign: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#44474c' }}>
              Already have an account?{' '}
              <button onClick={onSignInClick} style={{ fontWeight: 700, color: '#0f1c2c', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}
                onMouseEnter={e => e.target.style.color = '#755b00'}
                onMouseLeave={e => e.target.style.color = '#0f1c2c'}>
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (min-width: 768px) { #signup-left-panel { display: block !important; } }
        @media (max-width: 767px) {
          #signup-modal-container { min-height: auto !important; height: 90vh !important; }
          #signup-right-panel { padding: 24px 20px !important; }
        }
      `}</style>
    </div>
  );
};

export default SignUp;
