import { useState, useEffect } from 'react';

const Footer = ({
  onAddLeadClick,
  status,
  setStatus,
  rating,
  setRating,
  sort,
  setSort,
  date,
  setDate
}) => {
  const [activeFilter, setActiveFilter] = useState(null);

  // Lock body scroll when bottom sheet is open
  useEffect(() => {
    if (activeFilter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeFilter]);

  const formatStatus = s => s === 'not_interested' ? 'Not Interested' : s.charAt(0).toUpperCase() + s.slice(1);
  const formatRating = r => r === '5' ? 'Top Rating' : r === '1' ? 'Low Rating' : r;

  const filters = [
    { id: 'status', icon: 'filter_list', label: status && status !== 'all' ? `Status: ${formatStatus(status)}` : 'Status' },
    { id: 'rating', icon: 'star', label: rating && rating !== 'all' ? `Rating: ${formatRating(rating)}` : 'Rating' },
    { id: 'date', icon: 'calendar_today', label: 'Date' },
  ];

  const bottomSheetBtnStyle = (isActive) => ({
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    backgroundColor: isActive ? '#fcfbf7' : '#f7f9ff',
    color: '#0f1c2c',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    fontWeight: isActive ? 700 : 500,
    border: isActive ? '1.5px solid #c9a84c' : '1.5px solid rgba(15,28,44,0.15)',
    cursor: 'pointer',
    textAlign: 'left'
  });

  return (
    <>
      {/* ── Mobile FAB ── visible only on mobile ── */}
      <button
        className="shimmer"
        title="Add Lead"
        onClick={onAddLeadClick}
        style={{
          position: 'fixed',
          bottom: '76px',       /* above the bottom bar */
          right: '20px',
          width: '52px',
          height: '52px',
          backgroundColor: '#c9a84c',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(13,27,42,0.22)',
          zIndex: 51,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(13,27,42,0.3)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(13,27,42,0.22)';
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '24px', color: '#0d1b2a' }}
        >
          add
        </span>
      </button>

      {/* ── Mobile Bottom Filter Bar ── fixed at bottom, hidden on md+ ── */}
      <div
        id="mobile-filter-bar"
        className="scrollbar-hide"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderTop: '1px solid rgba(196,198,204,0.4)',
          padding: '10px 16px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          zIndex: 50,
          alignItems: 'center',
        }}
      >
        {/* Filter Buttons */}
        {filters.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveFilter(id)}
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '8px 13px',
              border: (id === 'status' && status) || (id === 'rating' && rating) ? '1.5px solid #c9a84c' : '1.5px solid rgba(196,198,204,0.55)',
              borderRadius: '8px',
              backgroundColor: (id === 'status' && status) || (id === 'rating' && rating) ? '#fcfbf7' : '#ffffff',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              fontWeight: 500,
              color: '#44474c',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              {icon}
            </span>
            {label}
          </button>
        ))}

        {/* Divider */}
        <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(196,198,204,0.4)', flexShrink: 0 }} />

        {/* Sort Button */}
        <button
          onClick={() => setActiveFilter('sort')}
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 13px',
            border: sort ? '1.5px solid #c9a84c' : '1.5px solid rgba(196,198,204,0.4)',
            borderRadius: '8px',
            backgroundColor: sort ? '#fcfbf7' : '#f7f9ff',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            color: '#0d1b2a',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {sort === 'a_z' ? 'Sort: A to Z' : sort === 'z_a' ? 'Sort: Z to A' : 'Sort: Default'}
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            expand_more
          </span>
        </button>
      </div>

      {/* ── Mobile Filter Bottom Sheet ── */}
      {activeFilter && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(9,29,46,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setActiveFilter(null); }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              padding: '32px 24px 40px',
              width: '100%',
              animation: 'slideUpBottom 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              position: 'relative',
              boxShadow: '0 -10px 40px rgba(13,27,42,0.15)',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            {/* Drag Handle */}
            <div style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '4px', backgroundColor: '#e0e0e0', borderRadius: '4px' }} />
            
            {/* Close Button */}
            <button
              onClick={() => setActiveFilter(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#f4f4f4',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#0f1c2c' }}>close</span>
            </button>

            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: '#0f1c2c', marginBottom: '20px', textAlign: 'center', textTransform: 'capitalize' }}>
              Select {activeFilter}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {activeFilter === 'status' && (
                <>
                  <button onClick={() => { setStatus('all'); setActiveFilter(null); }} style={bottomSheetBtnStyle(!status || status === 'all')}>All Statuses</button>
                  <button onClick={() => { setStatus('pending'); setActiveFilter(null); }} style={bottomSheetBtnStyle(status === 'pending')}>Pending</button>
                  <button onClick={() => { setStatus('interested'); setActiveFilter(null); }} style={bottomSheetBtnStyle(status === 'interested')}>Interested</button>
                  <button onClick={() => { setStatus('not_interested'); setActiveFilter(null); }} style={bottomSheetBtnStyle(status === 'not_interested')}>Not Interested</button>
                </>
              )}

              {activeFilter === 'rating' && (
                <>
                  <button onClick={() => { setRating('all'); setActiveFilter(null); }} style={bottomSheetBtnStyle(!rating || rating === 'all')}>All Ratings</button>
                  <button onClick={() => { setRating('5'); setActiveFilter(null); }} style={bottomSheetBtnStyle(rating === '5')}>Top Rating</button>
                  <button onClick={() => { setRating('1'); setActiveFilter(null); }} style={bottomSheetBtnStyle(rating === '1')}>Low Rating</button>
                </>
              )}

              {activeFilter === 'sort' && (
                <>
                  <button onClick={() => { setSort(''); setActiveFilter(null); }} style={bottomSheetBtnStyle(!sort)}>Default</button>
                  <button onClick={() => { setSort('a_z'); setActiveFilter(null); }} style={bottomSheetBtnStyle(sort === 'a_z')}>A to Z</button>
                  <button onClick={() => { setSort('z_a'); setActiveFilter(null); }} style={bottomSheetBtnStyle(sort === 'z_a')}>Z to A</button>
                </>
              )}

              {activeFilter === 'date' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input 
                    type="date"
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '10px',
                      border: '1.5px solid rgba(15,28,44,0.15)',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '15px',
                      color: '#0f1c2c',
                      outline: 'none',
                    }}
                  />
                  <button 
                    onClick={() => setActiveFilter(null)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '10px',
                      backgroundColor: '#fed977',
                      color: '#0f1c2c',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '15px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Apply Date
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Hide bottom bar on desktop via style tag ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpBottom {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @media (min-width: 768px) {
          #mobile-filter-bar { display: none !important; }
          .mobile-fab-hide { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Footer;
