import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API } from '../context/AuthContext';

const Navbar = ({ onSignInClick, onSignUpClick, onAddLeadClick, likeCount = 0, onLikesClick, user, onLogout, isDarkMode, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sliderImages, setSliderImages] = useState([
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600'
  ]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getSliderImages = async () => {
      try {
        const { data } = await API.get('/api/settings/slider');
        if (data.success && data.images && data.images.length > 0) {
          setSliderImages(data.images);
        }
      } catch (err) {
        console.error('Failed to fetch slider images', err);
      }
    };
    getSliderImages();
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header
      style={{
        width: '100%',
        height: '68px',
        backgroundColor: 'var(--nav-bg)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 16px rgba(13,27,42,0.18)',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="navbar-inner"
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 48px',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* ── Brand Logo ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '28px', color: '#c9a84c', fontVariationSettings: "'FILL' 1" }}
          >
            assured_workload
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '22px',
              fontWeight: 700,
              color: '#c9a84c',
              letterSpacing: '-0.3px',
              whiteSpace: 'nowrap',
            }}
          >
            LeadForge
          </span>
        </div>

        {/* ── Right Side ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {user && (
            <>
              {/* Add Lead Button — Desktop only */}
              <button
                id="add-lead-btn"
                className="shimmer"
                onClick={onAddLeadClick}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', backgroundColor: '#c9a84c',
                  color: 'var(--text-main)', fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em',
                  border: 'none', borderRadius: '7px', cursor: 'pointer',
                  transition: 'opacity 0.2s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                Add Lead
              </button>

              {/* Admin Panel Button */}
              {user.role === 'admin' && (
                <button
                  id="admin-btn-desktop"
                  onClick={() => navigate(location.pathname === '/admin' ? '/' : '/admin')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 18px', backgroundColor: '#0f1c2c',
                    color: '#c9a84c', fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em',
                    border: '1.5px solid rgba(201,168,76,0.3)', borderRadius: '7px', cursor: 'pointer',
                    transition: 'all 0.2s', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1a293c'; e.currentTarget.style.borderColor = '#c9a84c'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0f1c2c'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>admin_panel_settings</span>
                  {location.pathname === '/admin' ? 'Dashboard' : 'Admin Panel'}
                </button>
              )}



              {/* Likes Icon with Badge */}
              <button
                onClick={onLikesClick}
                title="Liked Leads"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '6px', display: 'flex', alignItems: 'center',
                  borderRadius: '50%', transition: 'background 0.2s', position: 'relative',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '22px',
                    color: likeCount > 0 ? '#e11d48' : '#778598',
                    fontVariationSettings: likeCount > 0 ? "'FILL' 1" : "'FILL' 0",
                    transition: 'color 0.2s',
                  }}
                >
                  favorite
                </span>
                {likeCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '2px', right: '2px',
                    backgroundColor: '#e11d48', color: '#ffffff',
                    fontSize: '10px', fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    minWidth: '16px', height: '16px', borderRadius: '999px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 3px', lineHeight: 1, border: '1.5px solid var(--nav-bg)',
                  }}>
                    {likeCount}
                  </span>
                )}
              </button>
            </>
          )}

          {/* Desktop: Auth Buttons or User Avatar */}
          <div id="desktop-auth-btns" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {user ? (
              /* Logged in: show avatar + name + logout */
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    backgroundColor: '#c9a84c', border: '2px solid rgba(201,168,76,0.4)',
                    overflow: 'hidden', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                    fontFamily: "'DM Sans', sans-serif", fontSize: '13px',
                    fontWeight: 700, color: 'var(--nav-bg)',
                  }}>
                    {user.photo ? (
                      <img src={user.photo} alt={user.name} referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>{getInitials(user.name)}</span>
                    )}
                  </div>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: '14px',
                    fontWeight: 600, color: 'var(--nav-text)', maxWidth: '120px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  style={{
                    background: 'rgba(225,29,72,0.15)', border: '1px solid rgba(225,29,72,0.3)',
                    color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif",
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    padding: '6px 12px', borderRadius: '6px', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(225,29,72,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(225,29,72,0.15)'; }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              /* Not logged in: Sign In / Sign Up */
              <>
                <button
                  onClick={onSignInClick}
                  style={{
                    background: 'none', border: 'none', color: '#c9a84c',
                    fontFamily: "'DM Sans', sans-serif", fontSize: '14px',
                    fontWeight: 600, cursor: 'pointer', padding: '8px 12px',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Sign In
                </button>
                <button
                  onClick={onSignUpClick}
                  style={{
                    backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: 'none',
                    borderRadius: '6px', fontFamily: "'DM Sans', sans-serif",
                    fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                    padding: '8px 16px', marginLeft: '4px', transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'none', alignItems: 'center' }}
            title="Menu"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '26px', color: '#c9a84c' }}>menu</span>
          </button>
        </div>
      </div>

      {/* ── Mobile Bottom Sheet Menu ── */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            backgroundColor: 'rgba(9,29,46,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsMobileMenuOpen(false); }}
        >
          <div
            style={{
              backgroundColor: '#ffffff', borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px', padding: '32px 24px 40px',
              width: '100%',
              animation: 'slideUpBottom 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              position: 'relative', boxShadow: '0 -10px 40px rgba(13,27,42,0.15)',
            }}
          >
            {/* Drag Handle */}
            <div style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '4px', backgroundColor: '#e0e0e0', borderRadius: '4px' }} />

            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                background: '#f4f4f4', border: 'none', borderRadius: '50%',
                width: '32px', height: '32px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#0f1c2c' }}>close</span>
            </button>

            {/* Menu Content */}
            {/* Auto Slider */}
            <div style={{ width: '100%', height: '120px', borderRadius: '12px', overflow: 'hidden', position: 'relative', marginBottom: '24px' }}>
              <div style={{
                display: 'flex', width: `${sliderImages.length * 100}%`, height: '100%',
                animation: `slideRightToLeft ${sliderImages.length * 3}s infinite ease-in-out`
              }}>
                {sliderImages.map((src, i) => (
                  <img
                    key={i} src={src} alt={`slide-${i}`}
                    style={{ width: `${100 / sliderImages.length}%`, height: '100%', objectFit: 'cover' }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>


              {user ? (
                /* ── LOGGED IN: show user info + Dashboard tabs + Add Lead + Signout ── */
                <>
                  {/* User Info */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 16px', backgroundColor: '#f7f9ff',
                    borderRadius: '12px', border: '1px solid rgba(201,168,76,0.2)',
                    marginBottom: '4px',
                  }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      backgroundColor: '#c9a84c', overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, fontFamily: "'DM Sans', sans-serif",
                      fontSize: '15px', fontWeight: 700, color: '#0d1b2a',
                    }}>
                      {user.photo ? (
                        <img src={user.photo} alt={user.name} referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span>{getInitials(user.name)}</span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 700, color: '#0d1b2a' }}>
                        {user.name}
                      </div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#778598' }}>
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Button */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (location.pathname === '/admin') {
                        navigate('/');
                      } else {
                        window.dispatchEvent(new CustomEvent('switchDashboardTab', { detail: 'all' }));
                      }
                    }}
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: '10px',
                      backgroundColor: '#f7f9ff', color: '#0f1c2c',
                      fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 600,
                      border: '1.5px solid rgba(15,28,44,0.15)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '10px',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#c9a84c' }}>dashboard</span>
                    {location.pathname === '/admin' ? 'Home Dashboard' : 'Dashboard'}
                  </button>

                  {/* My Dashboard Button Mobile */}
                  {location.pathname !== '/admin' && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.dispatchEvent(new CustomEvent('switchDashboardTab', { detail: 'my' }));
                      }}
                      style={{
                        width: '100%', padding: '14px 16px', borderRadius: '10px',
                        backgroundColor: '#fff', color: '#0f1c2c',
                        fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 600,
                        border: '1.5px solid rgba(15,28,44,0.15)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '10px',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#778598' }}>person</span>
                      My Dashboard
                    </button>
                  )}

                  {/* Admin Button Mobile */}
                  {user.role === 'admin' && location.pathname !== '/admin' && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/admin');
                      }}
                      style={{
                        width: '100%', padding: '14px 16px', borderRadius: '10px',
                        backgroundColor: '#0f1c2c', color: '#c9a84c',
                        fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 600,
                        border: '1.5px solid rgba(201,168,76,0.3)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '10px',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>admin_panel_settings</span>
                      Admin Panel
                    </button>
                  )}

                  {/* Add Lead */}
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onAddLeadClick(); }}
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: '10px',
                      backgroundColor: '#0d1b2a', color: '#c9a84c',
                      fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 700,
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '10px',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                    Add Lead
                  </button>

                  {/* Sign Out */}
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onLogout(); }}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '10px',
                      backgroundColor: 'rgba(225,29,72,0.08)', color: '#e11d48',
                      fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600,
                      borderTop: '1px solid var(--border-light)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      marginTop: '4px',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
                    Sign Out
                  </button>
                </>
              ) : (
                /* ── NOT LOGGED IN: Sign In + Sign Up ── */
                <>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onSignInClick(); }}
                    style={{
                      width: '100%', padding: '14px', borderRadius: '10px',
                      backgroundColor: '#f7f9ff', color: '#0f1c2c',
                      fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 600,
                      border: '1.5px solid rgba(15,28,44,0.15)', cursor: 'pointer',
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onSignUpClick(); }}
                    style={{
                      width: '100%', padding: '14px', borderRadius: '10px',
                      backgroundColor: '#fed977', color: '#0f1c2c',
                      fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 700,
                      border: 'none', cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(201,168,76,0.3)',
                    }}
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Responsive CSS ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpBottom {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @media (max-width: 767px) {
          header { padding: 0 !important; }
          .navbar-inner { padding: 0 16px !important; }
          #add-lead-btn { display: none !important; }
          #admin-btn-desktop { display: none !important; }
          #mobile-menu-btn { display: flex !important; }
          #desktop-auth-btns { display: none !important; }
        }
        @keyframes slideRightToLeft {
          0%, 25% { transform: translateX(0); }
          33%, 58% { transform: translateX(-33.3333%); }
          66%, 92% { transform: translateX(-66.6666%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
