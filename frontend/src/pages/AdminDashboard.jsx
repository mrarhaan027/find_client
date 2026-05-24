import { useState, useEffect } from 'react';
import { useAuth, API } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sliderImages, setSliderImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [addingImage, setAddingImage] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data } = await API.get('/api/auth/admin/users');
        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.message || 'Failed to fetch users');
        }
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    const fetchSliderImages = async () => {
      try {
        const { data } = await API.get('/api/settings/slider');
        if (data.success && data.data) {
          setSliderImages(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch slider images', err);
      }
    };

    if (user?.role === 'admin') {
      fetchUsers();
      fetchSliderImages();
    }
  }, [user, navigate]);

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!newImageUrl) return;
    setAddingImage(true);
    try {
      const { data } = await API.post('/api/settings/slider', { url: newImageUrl });
      if (data.success) {
        setSliderImages(data.images);
        setNewImageUrl('');
      } else {
        alert(data.message || 'Failed to add image');
      }
    } catch (err) {
      alert('Error adding image');
    } finally {
      setAddingImage(false);
    }
  };

  const handleRemoveImage = async (imageId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this slider image?");
    if (!isConfirmed) return;

    try {
      const { data } = await API.delete(`/api/settings/slider/${imageId}`);
      if (data.success) {
        setSliderImages(data.images);
      }
    } catch (err) {
      alert('Error removing image');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '40px' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '18px', color: '#c9a84c' }}>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '18px', color: '#e11d48' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#0d1b2a', marginBottom: '24px' }}>
        Admin Dashboard
      </h2>
      
      {/* ── Users Table ── */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(13,27,42,0.05)', overflowX: 'auto', marginBottom: '40px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f7f9ff', borderBottom: '2px solid rgba(15,28,44,0.1)' }}>
              <th style={{ padding: '16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#0f1c2c' }}>User</th>
              <th style={{ padding: '16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#0f1c2c' }}>Email</th>
              <th style={{ padding: '16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#0f1c2c' }}>Phone</th>
              <th style={{ padding: '16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#0f1c2c' }}>Provider</th>
              <th style={{ padding: '16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#0f1c2c' }}>Role</th>
              <th style={{ padding: '16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#0f1c2c' }}>Last Active</th>
              <th style={{ padding: '16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#0f1c2c' }}>Daily Logins</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid rgba(15,28,44,0.05)' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#c9a84c', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                      {u.photo ? (
                        <img src={u.photo} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                      ) : (
                        u.name ? u.name[0].toUpperCase() : 'U'
                      )}
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 600, color: '#0d1b2a' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#44474c' }}>{u.email}</td>
                <td style={{ padding: '16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#44474c' }}>{u.mobile || '-'}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                    backgroundColor: u.provider === 'google' ? 'rgba(234, 67, 53, 0.1)' : 'rgba(201, 168, 76, 0.1)',
                    color: u.provider === 'google' ? '#ea4335' : '#b45309'
                  }}>
                    {u.provider === 'google' ? 'Google' : 'Manual'}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                    backgroundColor: u.role === 'admin' ? '#0f1c2c' : '#f4f4f4',
                    color: u.role === 'admin' ? '#c9a84c' : '#44474c'
                  }}>
                    {u.role ? u.role.toUpperCase() : 'USER'}
                  </span>
                </td>
                <td style={{ padding: '16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#44474c' }}>
                  {u.lastActive ? new Date(u.lastActive).toLocaleString() : '-'}
                </td>
                <td style={{ padding: '16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#0f1c2c' }}>
                  {u.loginStats?.dailyCount || 0}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '24px', textAlign: 'center', fontFamily: "'DM Sans', sans-serif", color: '#778598' }}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Slider Images Manager ── */}
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#0d1b2a', marginBottom: '16px' }}>
        Slider Image Management
      </h3>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(13,27,42,0.05)', padding: '24px' }}>
        
        {/* Add new image form */}
        <form onSubmit={handleAddImage} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <input
            type="url"
            placeholder="Enter image URL (e.g., https://unsplash.com/...)"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #c4c6cc',
              fontFamily: "'DM Sans', sans-serif", fontSize: '15px'
            }}
            required
          />
          <button
            type="submit"
            disabled={addingImage}
            style={{
              padding: '12px 24px', backgroundColor: '#0f1c2c', color: '#c9a84c',
              border: 'none', borderRadius: '8px', fontFamily: "'DM Sans', sans-serif",
              fontSize: '15px', fontWeight: 700, cursor: addingImage ? 'not-allowed' : 'pointer',
              opacity: addingImage ? 0.7 : 1
            }}
          >
            {addingImage ? 'Adding...' : 'Add Image'}
          </button>
        </form>

        {/* Existing Images Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {sliderImages.map((img) => (
            <div key={img._id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '140px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <img src={img.url} alt="slider" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                onClick={() => handleRemoveImage(img._id)}
                style={{
                  position: 'absolute', top: '8px', right: '8px', backgroundColor: '#e11d48',
                  color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
                title="Delete Image"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
              </button>
            </div>
          ))}
          {sliderImages.length === 0 && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#778598' }}>No custom images added yet. Showing defaults.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
