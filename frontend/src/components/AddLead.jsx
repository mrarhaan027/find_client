import { useState, useEffect, useRef } from 'react';
import { API } from '../context/AuthContext';

const AddLead = ({ onClose, onLeadAdded }) => {
  const [form, setForm] = useState({
    clientName: '', location: '', phone: '', email: '',
    rating: '', status: 'pending', description: '', isPremium: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const sheetRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  useEffect(() => {
    const handleFocus = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
      }
    };
    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'rating') {
      const num = parseInt(value);
      if (value === '') { setForm({ ...form, rating: '' }); return; }
      if (!isNaN(num) && num >= 1 && num <= 5) setForm({ ...form, rating: String(num) });
      return;
    }
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        rating: form.rating ? Number(form.rating) : 3,
      };
      const { data } = await API.post('/api/leads', payload);
      if (data.success) {
        onLeadAdded && onLeadAdded(data.lead);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add lead. Please try again.');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: '8px',
    border: '1.5px solid rgba(196,198,204,0.5)', backgroundColor: '#f7f9ff',
    fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#0f1c2c',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  };
  const labelStyle = {
    display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
    fontWeight: 600, color: '#44474c', marginBottom: '5px',
    letterSpacing: '0.04em', textTransform: 'uppercase',
  };
  const focus = (e) => { e.target.style.borderColor = '#c9a84c'; };
  const blur  = (e) => { e.target.style.borderColor = 'rgba(196,198,204,0.5)'; };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1100, backgroundColor: 'rgba(9,29,46,0.55)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch', animation: 'fadeInBg 0.25s ease' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div ref={sheetRef} id="add-lead-sheet" style={{ backgroundColor: '#ffffff', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', width: '100%', maxHeight: '92vh', overflowY: 'auto', animation: 'slideUpForm 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)', position: 'relative', boxShadow: '0 -12px 50px rgba(13,27,42,0.2)' }}>
        <div style={{ width: '36px', height: '4px', backgroundColor: '#e0e0e0', borderRadius: '4px', margin: '12px auto 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px 14px', borderBottom: '1px solid rgba(196,198,204,0.2)' }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: '#0f1c2c', margin: 0 }}>Add New Lead</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#778598', margin: '2px 0 0' }}>Fill in the details below</p>
          </div>
          <button onClick={onClose} style={{ background: '#f4f4f4', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.background = '#e8e8e8'}
            onMouseLeave={e => e.currentTarget.style.background = '#f4f4f4'}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#0f1c2c' }}>close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {error && (
            <div style={{ padding: '10px 14px', backgroundColor: '#fee2e2', borderRadius: '8px', color: '#7f1d1d', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
              {error}
            </div>
          )}

          <div>
            <label style={labelStyle}>Client Name *</label>
            <input type="text" name="clientName" required placeholder="e.g. John Smith"
              value={form.clientName} onChange={handleChange} style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Location</label>
              <input type="text" name="location" placeholder="City, Country"
                value={form.location} onChange={handleChange} style={inputStyle} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input type="tel" name="phone" placeholder="+1 (555) 000-0000"
                value={form.phone} onChange={handleChange} style={inputStyle} onFocus={focus} onBlur={blur} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" name="email" placeholder="client@email.com"
              value={form.email} onChange={handleChange} style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Rating (1–5)</label>
              <input type="number" name="rating" min="1" max="5" step="1" placeholder="e.g. 4"
                value={form.rating} onChange={handleChange} style={inputStyle} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
                <option value="pending">Pending</option>
                <option value="interested">Interested</option>
                <option value="not_interested">Not Interested</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea name="description" rows={3} placeholder="Enter lead details..."
              value={form.description} onChange={handleChange}
              style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }} onFocus={focus} onBlur={blur} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', cursor: 'pointer', color: '#0f1c2c' }}>
            <input type="checkbox" name="isPremium" checked={form.isPremium} onChange={handleChange} />
            Mark as Premium
          </label>

          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid rgba(196,198,204,0.5)', backgroundColor: '#ffffff', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#44474c', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f7f9ff'}
              onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="shimmer"
              style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#c9a84c', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#0d1b2a', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1, transition: 'opacity 0.2s' }}
              onMouseEnter={e => !loading && (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => !loading && (e.currentTarget.style.opacity = '1')}>
              {loading ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeInBg { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpForm { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @media (min-width: 768px) {
          div[style*="z-index: 1100"] { justify-content: center !important; align-items: center !important; }
          #add-lead-sheet { width: 480px !important; border-radius: 20px !important; max-height: 88vh !important; animation: centerFadeScale 0.3s ease !important; }
        }
        @keyframes centerFadeScale { from { opacity: 0; transform: scale(0.94) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        #add-lead-sheet input[type=number]::-webkit-outer-spin-button,
        #add-lead-sheet input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        #add-lead-sheet input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
};

export default AddLead;
