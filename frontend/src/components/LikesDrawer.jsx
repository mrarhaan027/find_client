import { useEffect } from 'react';

const LikesDrawer = ({ likedLeads, onClose, onUnlike }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1200,
          backgroundColor: 'rgba(9,29,46,0.45)',
          backdropFilter: 'blur(3px)',
          animation: 'drawerFade 0.22s ease',
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '320px', maxWidth: '90vw',
          backgroundColor: '#ffffff',
          zIndex: 1300,
          display: 'flex', flexDirection: 'column',
          boxShadow: '-8px 0 40px rgba(13,27,42,0.18)',
          animation: 'slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(196,198,204,0.25)',
        }}>
          <div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px', fontWeight: 700,
              color: '#0f1c2c', margin: 0,
            }}>Liked Leads</h3>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px', color: '#778598', margin: '3px 0 0',
            }}>
              {likedLeads.length} lead{likedLeads.length !== 1 ? 's' : ''} liked
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f4f4f4', border: 'none', borderRadius: '50%',
              width: '34px', height: '34px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e8e8e8'}
            onMouseLeave={e => e.currentTarget.style.background = '#f4f4f4'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#0f1c2c' }}>close</span>
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {likedLeads.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: '100%', gap: '12px', opacity: 0.5,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#c9a84c' }}>favorite</span>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#44474c', textAlign: 'center' }}>
                No liked leads yet.<br />Click the heart on any lead card.
              </p>
            </div>
          ) : (
            likedLeads.map((lead) => (
              <div
                key={lead.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', borderRadius: '12px',
                  marginBottom: '8px',
                  border: '1px solid rgba(196,198,204,0.2)',
                  backgroundColor: '#f9f9f9',
                  transition: 'background 0.18s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f6ff'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f9f9f9'}
              >
                {/* Avatar */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  backgroundColor: '#d1e4fb',
                  border: '2px solid rgba(201,168,76,0.3)',
                  overflow: 'hidden', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px', fontWeight: 700, color: '#0d1b2a',
                }}>
                  {lead.avatar ? (
                    <img src={lead.avatar} alt={lead.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>{lead.initials || lead.name?.charAt(0)}</span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '14px', fontWeight: 700, color: '#0f1c2c',
                    marginBottom: '2px',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {lead.name}
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '12px', color: '#778598',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {lead.email}
                  </div>
                </div>

                {/* Remove button */}
                <button
                  title="Remove your like"
                  onClick={() => onUnlike(lead)}
                  style={{
                    background: 'rgba(225, 29, 72, 0.08)',
                    border: '1px solid rgba(225, 29, 72, 0.2)',
                    cursor: 'pointer',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(225, 29, 72, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(225, 29, 72, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.2)';
                  }}
                >
                  <span className="material-symbols-outlined" style={{
                    fontSize: '15px', color: '#e11d48',
                    fontVariationSettings: "'FILL' 0",
                  }}>heart_broken</span>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#e11d48',
                    letterSpacing: '0.02em',
                  }}>Remove</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes drawerFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default LikesDrawer;
