import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AddLead from './components/AddLead';
import LikesDrawer from './components/LikesDrawer';
import SiteFooter from './components/SiteFooter';
import './App.css';

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [showSignIn, setShowSignIn]   = useState(false);
  const [showSignUp, setShowSignUp]   = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);
  const [showLikes, setShowLikes]     = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [leadRefreshKey, setLeadRefreshKey] = useState(0);

  // liked leads: array of lead objects
  const [likedLeads, setLikedLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('leadforge_liked_leads');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Failed to parse liked leads from local storage", err);
      return [];
    }
  });

  // Save liked leads to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('leadforge_liked_leads', JSON.stringify(likedLeads));
  }, [likedLeads]);

  // Auto-open SignIn if not logged in
  useEffect(() => {
    if (!loading && !user && !showSignUp) {
      setShowSignIn(true);
    }
  }, [loading, user, showSignUp]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-body)' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 600, color: '#0d1b2a', animation: 'pulse 1.5s ease-in-out infinite' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', verticalAlign: 'middle', marginRight: '12px', color: '#c9a84c' }}>assured_workload</span>
          LeadForge
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }`}</style>
      </div>
    );
  }

  const openSignIn  = () => { setShowSignUp(false); setShowSignIn(true); };
  const openSignUp  = () => { setShowSignIn(false); setShowSignUp(true); };
  const closeAll    = () => { setShowSignIn(false); setShowSignUp(false); };
  const openAddLead = () => {
    if (!user) {
      openSignIn();
      return;
    }
    setShowAddLead(true);
  };
  const closeAddLead = () => setShowAddLead(false);

  const handleLike = (lead) => {
    setLikedLeads((prev) => {
      const already = prev.find((l) => l._id === lead._id || l.id === lead.id);
      if (already) return prev.filter((l) => l._id !== lead._id && l.id !== lead.id);
      return [...prev, lead];
    });
  };

  const handleLeadAdded = () => {
    setLeadRefreshKey(k => k + 1);
    closeAddLead();
  };

  const likedIds = likedLeads.map((l) => l._id || l.id);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-body)',
        color: 'var(--text-main)',
        overflowX: 'hidden',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <Navbar
        onSignInClick={openSignIn}
        onSignUpClick={openSignUp}
        onAddLeadClick={openAddLead}
        likeCount={likedLeads.length}
        onLikesClick={() => setShowLikes(true)}
        user={user}
        onLogout={() => setShowLogoutConfirm(true)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!user ? (
          <div style={{ flex: 1 }} />
        ) : (
          <Routes>
            <Route path="/" element={
              <Dashboard
                likedIds={likedIds}
                onLike={handleLike}
                refreshKey={leadRefreshKey}
                user={user}
                onAddLeadClick={openAddLead}
                onSignInClick={openSignIn}
              />
            } />
          </Routes>
        )}
        <SiteFooter />
      </div>

      {/* Add Lead Modal */}
      {showAddLead && <AddLead onClose={closeAddLead} onLeadAdded={handleLeadAdded} />}

      {/* Likes Drawer */}
      {showLikes && (
        <LikesDrawer
          likedLeads={likedLeads}
          onClose={() => setShowLikes(false)}
          onUnlike={handleLike}
        />
      )}

      {/* Sign In Modal */}
      {showSignIn && (
        <SignIn onClose={closeAll} onSignUpClick={openSignUp} />
      )}

      {/* Sign Up Modal */}
      {showSignUp && (
        <SignUp onClose={closeAll} onSignInClick={openSignIn} />
      )}

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, backgroundColor: 'rgba(9,29,46,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={e => e.target === e.currentTarget && setShowLogoutConfirm(false)}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '380px', padding: '24px', boxShadow: '0 24px 64px rgba(9,29,46,0.2)', animation: 'slideUp 0.3s ease', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>logout</span>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#0d1b2a', marginBottom: '8px' }}>Sign Out?</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#44474c', marginBottom: '24px', lineHeight: 1.5 }}>
              Are you sure you want to sign out of LeadForge?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: '#f4f4f4', border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#44474c', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowLogoutConfirm(false); logout(); }} style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: '#e11d48', border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Sign Out</button>
            </div>
          </div>
          <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
