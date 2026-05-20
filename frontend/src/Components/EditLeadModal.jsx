import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EditLeadModal = ({ lead, onEditLead }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    url: '',
    contact: '',
    rating: '',
    date: '',
    description: '',
    status: 'Pending'
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        location: lead.location || '',
        url: lead.url || '',
        contact: lead.contact || '',
        rating: lead.rating || '',
        date: lead.date ? new Date(lead.date).toISOString().split('T')[0] : '',
        description: lead.description || '',
        status: lead.status || 'Pending'
      });
    }
  }, [lead]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditLead({
      ...lead,
      ...formData,
      initials: formData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'XX'
    });
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-outline-variant">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Edit Lead</h2>
          <button type="button" onClick={() => navigate(-1)} className="text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <form id="edit-lead-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface-variant">Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} type="text" className="px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md" placeholder="e.g. Rahul Sharma" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface-variant">Location</label>
              <input required name="location" value={formData.location} onChange={handleChange} type="text" className="px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md" placeholder="e.g. Mumbai, MH" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface-variant">Contact</label>
              <input required name="contact" value={formData.contact} onChange={handleChange} type="text" className="px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md" placeholder="e.g. +91 98765 43210" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface-variant">URL</label>
              <input name="url" value={formData.url} onChange={handleChange} type="url" className="px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md" placeholder="e.g. https://linkedin.com/..." />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface-variant">Rating (1-5)</label>
              <input required name="rating" value={formData.rating} onChange={handleChange} type="number" min="1" max="5" step="0.1" className="px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md" placeholder="e.g. 4.5" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface-variant">Date</label>
              <input required name="date" value={formData.date} onChange={handleChange} type="date" className="px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md" />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="font-label-md text-on-surface-variant">Status</label>
              <select required name="status" value={formData.status} onChange={handleChange} className="px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md">
                <option value="Pending">Pending</option>
                <option value="Interested">Interested</option>
                <option value="Done">Done</option>
                <option value="Not Interested">Not Interested</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="font-label-md text-on-surface-variant">Description</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md resize-none" placeholder="Add some notes about the lead..."></textarea>
            </div>
          </form>
        </div>
        <div className="p-6 border-t border-outline-variant flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 rounded-lg font-label-bold text-on-surface border border-outline-variant hover:bg-surface-container-high transition-colors">
            Cancel
          </button>
          <button type="submit" form="edit-lead-form" className="px-6 py-2 rounded-lg font-label-bold text-on-primary bg-primary hover:bg-primary/90 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLeadModal;
