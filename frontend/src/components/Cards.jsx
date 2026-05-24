import { useState, useRef, useEffect, useCallback } from 'react';
import { API } from '../context/AuthContext';

/* ── Star Rating ── */
const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
    {[1, 2, 3, 4, 5].map(star => (
      <span key={star} className="material-symbols-outlined"
        style={{ fontSize: '16px', color: '#c9a84c', fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}>
        star
      </span>
    ))}
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 700, color: '#0d1b2a', marginLeft: '6px' }}>
      {rating}.0
    </span>
  </div>
);

/* ── Edit Modal ── */
const EditModal = ({ lead, onClose, onSaved }) => {
  const [form, setForm] = useState({
    clientName: lead.clientName || lead.name || '',
    location: lead.location || '',
    phone: lead.phone || '',
    email: lead.email || '',
    rating: lead.rating || 3,
    status: lead.status || 'pending',
    description: lead.description || '',
    isPremium: lead.isPremium || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1.5px solid rgba(196,198,204,0.5)', backgroundColor: '#f7f9ff',
    fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#0f1c2c',
    outline: 'none', boxSizing: 'border-box',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.put(`/api/leads/${lead._id}`, form);
      if (data.success) { onSaved(data.lead); onClose(); }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update lead.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, backgroundColor: 'rgba(9,29,46,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '460px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(9,29,46,0.2)', animation: 'slideUp 0.3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid rgba(196,198,204,0.2)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: '#0f1c2c', margin: 0 }}>Edit Lead</h2>
          <button onClick={onClose} style={{ background: '#f4f4f4', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {error && <div style={{ padding: '10px 12px', backgroundColor: '#fee2e2', borderRadius: '8px', color: '#7f1d1d', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>{error}</div>}
          <div>
            <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#44474c', marginBottom: '5px', textTransform: 'uppercase' }}>Client Name *</label>
            <input type="text" required value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#44474c', marginBottom: '5px', textTransform: 'uppercase' }}>Location</label>
              <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#44474c', marginBottom: '5px', textTransform: 'uppercase' }}>Phone</label>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#44474c', marginBottom: '5px', textTransform: 'uppercase' }}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#44474c', marginBottom: '5px', textTransform: 'uppercase' }}>Rating (1-5)</label>
              <input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#44474c', marginBottom: '5px', textTransform: 'uppercase' }}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="pending">Pending</option>
                <option value="interested">Interested</option>
                <option value="not_interested">Not Interested</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#44474c', marginBottom: '5px', textTransform: 'uppercase' }}>Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isPremium} onChange={e => setForm({ ...form, isPremium: e.target.checked })} />
            Mark as Premium
          </label>
          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1.5px solid rgba(196,198,204,0.5)', backgroundColor: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#44474c', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: '11px', borderRadius: '10px', border: 'none', backgroundColor: '#c9a84c', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#0d1b2a', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
        <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>
    </div>
  );
};

/* ── Lead Card ── */
const LeadCard = ({ lead, isLiked, onLike, currentUser, onDeleted, onEdited }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef(null);

  const isOwner = currentUser && lead.createdBy &&
    (lead.createdBy === currentUser._id || lead.createdBy?._id === currentUser._id ||
     lead.createdBy?.toString() === currentUser._id?.toString());

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (!showMenu) return;
    const close = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [showMenu]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/api/leads/${lead._id}`);
      onDeleted(lead._id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete.');
    } finally { setDeleting(false); setShowConfirmDelete(false); setShowMenu(false); }
  };

  return (
    <>
      {showEdit && <EditModal lead={lead} onClose={() => setShowEdit(false)} onSaved={onEdited} />}
      {showConfirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, backgroundColor: 'rgba(9,29,46,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={e => e.target === e.currentTarget && setShowConfirmDelete(false)}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '380px', padding: '24px', boxShadow: '0 24px 64px rgba(9,29,46,0.2)', animation: 'slideUp 0.3s ease', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fee2e2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>warning</span>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#0d1b2a', marginBottom: '8px' }}>Delete Lead?</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#44474c', marginBottom: '24px', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>{lead.clientName || lead.name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowConfirmDelete(false)} disabled={deleting} style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: '#f4f4f4', border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#44474c', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: '#e11d48', border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#fff', cursor: 'pointer', opacity: deleting ? 0.7 : 1 }}>{deleting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
      <div
        style={{ backgroundColor: '#f9f9f9', borderRadius: '14px', border: '1px solid rgba(196,198,204,0.25)', boxShadow: '0 4px 20px rgba(13,27,42,0.07)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', transition: 'transform 0.25s ease' }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        {lead.isPremium && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: '#c9a84c', borderRadius: '14px 0 0 14px' }} />}

        <div style={{ padding: '24px', paddingLeft: lead.isPremium ? '28px' : '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: '#0d1b2a', marginBottom: '4px' }}>
                {lead.clientName || lead.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#44474c' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500 }}>{lead.location || 'N/A'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ backgroundColor: lead.badgeBg || '#d1e4fb', color: lead.badgeColor || '#0d1b2a', padding: '4px 12px', borderRadius: '999px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                {lead.badge || lead.status}
              </span>
              <button title={isLiked ? 'Unlike' : 'Like'} onClick={onLike}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', transition: 'transform 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: isLiked ? '#e11d48' : '#0d1b2a', fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0", transition: 'color 0.2s' }}>favorite</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', lineHeight: 1.6, color: '#44474c', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {lead.description || 'No description provided.'}
          </p>

          {/* Phone */}
          {lead.phone && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#44474c' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#755b00' }}>phone</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500 }}>
                  {isOwner ? (
                    lead.phone
                  ) : (
                    <>
                      <span style={{ filter: 'blur(4px)', userSelect: 'none' }}>{lead.phone.slice(0, 6)}</span>
                      {lead.phone.slice(6)}
                    </>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Rating + Date */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <StarRating rating={lead.rating || 3} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#74777d' }}>
              {lead.date} {lead.createdAt ? `at ${new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
            </span>
          </div>

          {/* Contact Button */}
          {isOwner ? (
            <a href={`tel:${lead.phone}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '14px' }}>
              <button style={{ width: '100%', padding: '10px', backgroundColor: '#0d1b2a', color: '#c9a84c', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                Call Lead
              </button>
            </a>
          ) : (
            <button disabled style={{ width: '100%', padding: '10px', backgroundColor: '#f4f5f7', color: '#aab0b8', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', border: '1px solid #e0e4e8', borderRadius: '8px', cursor: 'not-allowed', marginBottom: '14px' }}>
              Private Contact
            </button>
          )}

          {/* Footer: Added By Info + Context Menu */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(196,198,204,0.25)', paddingTop: '14px', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* User Avatar */}
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#d1e4fb', border: '1.5px solid rgba(196,198,204,0.4)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 700, color: '#0d1b2a' }}>
                {lead.avatar ? (
                  <img src={lead.avatar} alt={lead.addedByName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{lead.initials || 'U'}</span>
                )}
              </div>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 700, color: '#0d1b2a' }}>{lead.addedByName}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#44474c', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.addedByEmail}</div>
              </div>
            </div>

            {/* Context Menu (only for owner) */}
            {isOwner && (
              <div style={{ position: 'relative' }} ref={menuRef}>
                <button title="More options" onClick={() => setShowMenu(!showMenu)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#74777d' }}>more_horiz</span>
                </button>
                {showMenu && (
                  <div style={{ position: 'absolute', right: 0, bottom: '100%', marginBottom: '4px', backgroundColor: '#fff', border: '1px solid rgba(196,198,204,0.3)', borderRadius: '8px', boxShadow: '0 4px 16px rgba(13,27,42,0.12)', padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '130px', zIndex: 10 }}>
                    <button onClick={() => { setShowMenu(false); setShowEdit(true); }}
                      style={{ background: 'none', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#0d1b2a', transition: 'background 0.2s', textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f7f9ff'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#c9a84c' }}>edit</span>
                      Edit Lead
                    </button>
                    <button onClick={() => { setShowMenu(false); setShowConfirmDelete(true); }} disabled={deleting}
                      style={{ background: 'none', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#e11d48', transition: 'background 0.2s', textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(225,29,72,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#e11d48' }}>delete</span>
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/* ── Skeleton Card ── */
const SkeletonCard = () => (
  <div style={{ backgroundColor: '#f9f9f9', borderRadius: '14px', border: '1px solid rgba(196,198,204,0.25)', padding: '24px', animation: 'pulse 1.5s ease-in-out infinite' }}>
    {[80, 50, 100, 60, 40].map((w, i) => (
      <div key={i} style={{ height: i === 0 ? '22px' : '14px', width: `${w}%`, backgroundColor: '#e0e0e0', borderRadius: '6px', marginBottom: '14px' }} />
    ))}
    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
  </div>
);

/* ── Cards Grid ── */
const Cards = ({ likedIds, onLike, activeTab, search, filterStatus, filterRating, sort, filterDate, refreshKey, currentUser, onLeadChange }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (filterStatus && filterStatus !== 'all') params.status = filterStatus;
      if (filterRating && filterRating !== 'all') params.rating = filterRating;
      if (sort) params.sort = sort;
      if (filterDate) params.date = filterDate;

      const endpoint = activeTab === 'my' ? '/api/leads/my' : '/api/leads';
      const { data } = await API.get(endpoint, { params });
      if (data.success) setLeads(data.leads);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please sign in to view your leads.');
      } else {
        setError('Failed to load leads. Is the backend running?');
      }
    } finally { setLoading(false); }
  }, [activeTab, search, filterStatus, filterRating, sort, filterDate, refreshKey]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleDeleted = (id) => {
    setLeads(prev => prev.filter(l => l._id !== id));
    if (onLeadChange) onLeadChange();
  };
  const handleEdited = (updated) => {
    setLeads(prev => prev.map(l => l._id === updated._id ? updated : l));
    if (onLeadChange) onLeadChange();
  };

  if (loading) {
    const skeletonCount = leads.length > 0 ? leads.length : 3;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px', paddingBottom: '24px' }}>
        {Array.from({ length: skeletonCount }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (error) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#e11d48', display: 'block', marginBottom: '12px' }}>error</span>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', color: '#44474c' }}>{error}</p>
    </div>
  );

  if (!leads.length) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#c9a84c', display: 'block', marginBottom: '12px' }}>folder_open</span>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: '#0d1b2a', marginBottom: '8px' }}>No leads found</p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#44474c' }}>
        {activeTab === 'my' ? 'Add your first lead!' : 'Try adjusting your search or filters.'}
      </p>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px', paddingBottom: '24px' }}>
      {leads.map(lead => (
        <LeadCard
          key={lead._id}
          lead={lead}
          isLiked={likedIds.includes(lead._id)}
          onLike={() => onLike(lead)}
          currentUser={currentUser}
          onDeleted={handleDeleted}
          onEdited={handleEdited}
        />
      ))}
    </div>
  );
};

export default Cards;
