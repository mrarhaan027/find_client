import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/signup', formData);
      if (response.data.success) {
        login(response.data.data);
        navigate('/', { replace: true });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to sign up');
    }
  };

  const goToSignin = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7] p-4">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl flex flex-col border border-outline-variant">
        <div className="flex flex-col items-center p-8 border-b border-outline-variant">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <span className="material-symbols-outlined text-[24px]">person_add</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold text-center">Create Admin Account</h2>
          <p className="font-body-md text-on-surface-variant text-center mt-2">Setup the master account for LeadFlow CRM</p>
        </div>
        <div className="p-8">
          <form id="signup-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="p-3 bg-error-container text-on-error-container rounded-lg font-body-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {error}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-on-surface-variant">Full Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} type="text" className="px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md transition-shadow" placeholder="Admin Name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-on-surface-variant">Email Address</label>
              <input required name="email" value={formData.email} onChange={handleChange} type="email" className="px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md transition-shadow" placeholder="admin@domain.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-on-surface-variant">Password</label>
              <input required name="password" value={formData.password} onChange={handleChange} type="password" className="px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md transition-shadow" placeholder="••••••••" />
            </div>
            
            <button type="submit" className="w-full mt-4 px-6 py-3 rounded-lg font-label-bold text-on-primary bg-primary hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2">
              Create Account
              <span className="material-symbols-outlined text-[18px]">person_add</span>
            </button>
          </form>
          
          <div className="mt-8 text-center pt-6 border-t border-outline-variant">
            <p className="font-body-sm text-on-surface-variant">
              Already have an account?{' '}
              <button type="button" onClick={goToSignin} className="text-primary font-label-bold hover:underline">
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
