import React, { useState, useEffect } from 'react';
import StatsBar from '../components/StatsBar';
import SearchFilterBar from '../components/SearchFilterBar';
import Cards from '../components/Cards';
import Footer from '../components/Footer';
import { API } from '../context/AuthContext';

const Dashboard = ({ likedIds, onLike, refreshKey, user, onAddLeadClick, onSignInClick }) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my'
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [sort, setSort] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [stats, setStats] = useState({ total: 0, pending: 0, interested: 0, not_interested: 0 });
  const [sliderImages, setSliderImages] = useState([
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800'
  ]);

  // Fetch Stats
  const fetchStats = React.useCallback(async () => {
    try {
      const endpoint = activeTab === 'my' ? '/api/leads/stats/my' : '/api/leads/stats/all';
      const { data } = await API.get(endpoint);
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  }, [activeTab]);

  useEffect(() => {
    // Fetch dynamic slider images
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
    // Only fetch "my" stats if user is logged in
    if (activeTab === 'my' && !user) return;
    fetchStats();
  }, [fetchStats, refreshKey, user]);

  // Listen to mobile menu tab switch events
  useEffect(() => {
    const handler = (e) => {
      if (e.detail === 'my' && !user) return; // ignore if not logged in
      setActiveTab(e.detail);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('switchDashboardTab', handler);
    return () => window.removeEventListener('switchDashboardTab', handler);
  }, [user]);

  // When user logs out, switch back to 'all'
  useEffect(() => {
    if (!user && activeTab === 'my') setActiveTab('all');
  }, [user, activeTab]);

  return (
    <>
      <main
        id="dashboard-main"
        style={{
          flex: 1, width: '100%', maxWidth: '1280px',
          margin: '0 auto', padding: '40px 0 120px 0',
          boxSizing: 'border-box',
        }}
      >
        {/* ── Header ── */}
        <div
          id="dash-header"
          style={{
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: '28px', gap: '16px', padding: '0 48px',
          }}
        >
          {/* Desktop Heading */}
          <div id="desktop-dash-heading">
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700,
                color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.2,
              }}
            >
              {user ? `Welcome Back, ${user.name.split(' ')[0]}.` : 'Welcome to LeadForge.'}
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {activeTab === 'my'
                ? 'Your personal leads — manage, edit and track.'
                : 'Here is the latest overview of your premium portfolio.'}
            </p>
          </div>

          {/* Mobile Auto Slider */}
          <div id="mobile-dash-slider" style={{ display: 'none', width: '100%', height: '140px', borderRadius: '14px', overflow: 'hidden', position: 'relative' }}>
            <div style={{
              display: 'flex', width: `${sliderImages.length * 100}%`, height: '100%',
              animation: `dashSlideRightToLeft ${sliderImages.length * 3}s infinite ease-in-out`
            }}>
              {sliderImages.map((src, i) => (
                <img
                  key={i} src={src} alt={`slide-${i}`}
                  style={{ width: `${100 / sliderImages.length}%`, height: '100%', objectFit: 'cover' }}
                />
              ))}
            </div>
          </div>

          {/* Tab Toggle */}
          <div id="tab-toggle-container" style={{ display: 'flex', gap: '4px' }}>
            {[
              { key: 'all', label: 'Dashboard' },
              { key: 'my',  label: 'My Dashboard' },
            ].map(({ key, label }) => {
              const isActive = activeTab === key;
              const isDisabled = key === 'my' && !user;
              return (
                <button
                  key={key}
                  className={`tab-button ${isActive ? 'active-tab' : ''}`}
                  onClick={() => {
                    if (isDisabled) {
                      onSignInClick && onSignInClick();
                      return;
                    }
                    setActiveTab(key);
                  }}
                  title={isDisabled ? 'Sign in to view your dashboard' : ''}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--accent-gold)' : isDisabled ? 'var(--border-color)' : 'var(--text-muted)',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    border: 'none',
                    opacity: isDisabled ? 0.7 : 1,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div id="stats-wrap" style={{ padding: '0 48px' }}>
          <StatsBar stats={stats} />
        </div>

        {/* ── Search & Filter ── */}
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          filterRating={filterRating}
          onFilterRatingChange={setFilterRating}
          sort={sort}
          onSortChange={setSort}
          filterDate={filterDate}
          onFilterDateChange={setFilterDate}
        />

        {/* ── Cards ── */}
        <div id="cards-wrap" style={{ padding: '0 48px' }}>
          {activeTab === 'my' && !user ? (
            /* Shouldn't reach here but safety net */
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', color: 'var(--text-muted)' }}>
                Please sign in to view your leads.
              </p>
            </div>
          ) : (
            <Cards
              likedIds={likedIds}
              onLike={onLike}
              activeTab={activeTab}
              search={search}
              filterStatus={filterStatus}
              filterRating={filterRating}
              sort={sort}
              filterDate={filterDate}
              refreshKey={refreshKey}
              currentUser={user}
              onLeadChange={fetchStats}
            />
          )}
        </div>
      </main>

      {/* Mobile Footer / Filters */}
      {user && (
        <Footer 
          onAddLeadClick={onAddLeadClick}
          status={filterStatus}
          setStatus={setFilterStatus}
          rating={filterRating}
          setRating={setFilterRating}
          sort={sort}
          setSort={setSort}
          date={filterDate}
          setDate={setFilterDate}
        />
      )}

      <style>{`
        #tab-toggle-container {
          background-color: white;
          border-radius: 8px;
          border: 1px solid rgba(196,198,204,0.5);
          padding: 4px;
        }
        .tab-button {
          padding: 8px 16px;
          text-align: center;
          background-color: transparent;
          border-radius: 6px;
          transition: background-color 0.2s, box-shadow 0.2s;
        }
        .tab-button.active-tab {
          background-color: #f7f9ff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        @media (max-width: 767px) {
          #desktop-dash-heading { display: none !important; }
          #mobile-dash-slider { display: block !important; }
          #dashboard-main  { padding: 24px 2px 24px 2px !important; }
          #dash-header     { padding: 0 12px 0 16px !important; }
          #stats-wrap      { padding: 0 0px !important; }
          #cards-wrap      { padding: 0 0px !important; }
          #tab-toggle-container { display: none !important; }
        }
        @keyframes dashSlideRightToLeft {
          0%, 25% { transform: translateX(0); }
          33%, 58% { transform: translateX(-33.3333%); }
          66%, 92% { transform: translateX(-66.6666%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default Dashboard;
