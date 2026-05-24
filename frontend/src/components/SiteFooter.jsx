const SiteFooter = () => {
  return (
    <footer style={{
      backgroundColor: '#0d1b2a',
      color: '#ffffff',
      padding: '64px 48px 32px',
      fontFamily: "'DM Sans', sans-serif",
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '40px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '40px',
        marginBottom: '24px'
      }}>
        {/* Brand Section */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '36px', height: '36px',
              backgroundColor: '#c9a84c',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(201,168,76,0.25)'
            }}>
              <span className="material-symbols-outlined" style={{ color: '#0d1b2a', fontSize: '22px' }}>
                real_estate_agent
              </span>
            </div>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '26px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.02em',
            }}>
              LeadForge
            </span>
          </div>
          <p style={{ color: '#a0aab8', fontSize: '15px', lineHeight: 1.6, maxWidth: '340px' }}>
            A premium lead management and CRM dashboard for top-tier professionals. Organize, track, and convert your network with absolute ease.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '17px', fontWeight: 600, marginBottom: '20px', letterSpacing: '0.02em' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li><a href="#!" style={{ color: '#a0aab8', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#c9a84c'} onMouseLeave={e => e.target.style.color = '#a0aab8'}>Dashboard Overview</a></li>
              <li><a href="#!" style={{ color: '#a0aab8', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#c9a84c'} onMouseLeave={e => e.target.style.color = '#a0aab8'}>All Leads</a></li>
              <li><a href="#!" style={{ color: '#a0aab8', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#c9a84c'} onMouseLeave={e => e.target.style.color = '#a0aab8'}>Analytics & Reports</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><a href="#!" style={{ color: '#a0aab8', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#c9a84c'} onMouseLeave={e => e.target.style.color = '#a0aab8'}>Privacy Policy</a></li>
              <li><a href="#!" style={{ color: '#a0aab8', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#c9a84c'} onMouseLeave={e => e.target.style.color = '#a0aab8'}>Terms of Service</a></li>
              <li><a href="#!" style={{ color: '#a0aab8', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#c9a84c'} onMouseLeave={e => e.target.style.color = '#a0aab8'}>Contact Support</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div style={{ padding: '24px 48px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <p style={{ color: '#a0aab8', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', margin: 0 }}>
          &copy; {new Date().getFullYear()} LeadForge by MR ARHAAN. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="#!" title="Website" style={{ color: '#a0aab8', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#c9a84c'} onMouseLeave={e => e.target.style.color = '#a0aab8'}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>language</span>
          </a>
          <a href="#!" title="Email" style={{ color: '#a0aab8', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#c9a84c'} onMouseLeave={e => e.target.style.color = '#a0aab8'}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mail</span>
          </a>
          <a href="#!" title="Support" style={{ color: '#a0aab8', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#c9a84c'} onMouseLeave={e => e.target.style.color = '#a0aab8'}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>support_agent</span>
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          footer {
            padding: 40px 20px 100px 20px !important; /* extra bottom padding for mobile sticky footer/FAB */
          }
        }
      `}</style>
    </footer>
  );
};

export default SiteFooter;
