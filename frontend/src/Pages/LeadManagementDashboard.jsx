import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;
import { useNavigate, useLocation } from 'react-router-dom';
import AddLeadModal from '../Components/AddLeadModal';
import EditLeadModal from '../Components/EditLeadModal';
import { useAuth } from '../Context/AuthContext';

const LeadManagementDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  const showAddModal = location.search.includes('modal=addLead');
  const showEditModal = location.search.includes('modal=editLead');
  const editLeadId = new URLSearchParams(location.search).get('id');

  const [filterStatus, setFilterStatus] = useState('All');
  const [sortOption, setSortOption] = useState('Default');
  const [filterDate, setFilterDate] = useState('');
  const [expandedContactId, setExpandedContactId] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showSearch, setShowSearch] = useState(true);
  const lastScrollY = useRef(0);

  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads(page, filterDate, page === 1);
  }, [page, filterDate]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setShowSearch(false); // Scrolling down
      } else {
        setShowSearch(true);  // Scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchLeads = async (pageNum, dateParam = '', reset = false) => {
    setIsLoading(true);
    try {
      const url = `/api/leads?page=${pageNum}&limit=9${dateParam ? `&date=${dateParam}` : ''}`;
      const response = await axios.get(url);
      if (response.data.success) {
        if (reset) {
          setLeads(response.data.data);
        } else {
          setLeads(prev => {
            // Prevent duplicates just in case
            const existingIds = new Set(prev.map(l => l._id || l.id));
            const newLeads = response.data.data.filter(l => !existingIds.has(l._id || l.id));
            return [...prev, ...newLeads];
          });
        }
        setHasMore(response.data.pagination.page < response.data.pagination.totalPages);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Expected when user is not logged in; safely ignore to prevent console errors.
      } else {
        console.error('Error fetching leads:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLead = async (newLead) => {
    try {
      const response = await axios.post('/api/leads', newLead);
      if (response.data.success) {
        setLeads([response.data.data, ...leads]);
      }
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  const handleEditLead = async (updatedLead) => {
    try {
      const leadId = updatedLead._id || updatedLead.id;
      const response = await axios.put(`/api/leads/${leadId}`, updatedLead);
      if (response.data.success) {
        setLeads(leads.map(l => (l._id || l.id) === leadId ? response.data.data : l));
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const handleDeleteLead = async (id) => {
    try {
      const response = await axios.delete(`/api/leads/${id}`);
      if (response.data.success) {
        setLeads(leads.filter(l => (l._id || l.id) !== id));
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Done': return { bg: '#d1fae5', text: '#065f46', accent: '#10b981' };
      case 'Interested': return { bg: '#dbeafe', text: '#1e40af', accent: '#3b82f6' };
      case 'Not Interested': return { bg: '#fee2e2', text: '#991b1b', accent: '#ef4444' };
      case 'Pending':
      default:
        return { bg: '#fef3c7', text: '#92400e', accent: '#f59e0b' };
    }
  };

  const displayedLeads = leads
    .filter(lead => {
      if (!debouncedSearchQuery) return true;
      const lowerQuery = debouncedSearchQuery.toLowerCase();
      return (
        lead.name?.toLowerCase().includes(lowerQuery) ||
        lead.location?.toLowerCase().includes(lowerQuery) ||
        lead.contact?.toLowerCase().includes(lowerQuery) ||
        lead.description?.toLowerCase().includes(lowerQuery)
      );
    })
    .filter(lead => filterStatus === 'All' || lead.status === filterStatus)
    .sort((a, b) => {
      if (sortOption === 'A to Z') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'Rating') {
        return parseFloat(b.rating) - parseFloat(a.rating);
      }
      return 0;
    });

  return (
    <div className="font-body-md text-body-md text-on-surface antialiased bg-[#F4F5F7] min-h-screen flex">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen justify-start pt-8 w-full mt-16">
        {/* TopNavBar */}
        <header className="fixed top-0 left-0 right-0 max-w-container-max mx-auto w-full z-50 flex justify-between items-center px-gutter lg:px-6 h-16 bg-surface dark:bg-inverse-surface border-b border-outline-variant dark:border-outline">
          <div className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed">
            LeadFlow CRM
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center gap-2 text-on-surface-variant dark:text-surface-variant hover:text-error dark:hover:text-error transition-colors px-3 py-1.5 rounded-lg hover:bg-error-container/20" title="Logout">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="font-label-bold hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-gutter lg:p-6 pb-24 md:pb-12 mt-0 lg:mt-0 max-w-container-max mx-auto w-full">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Active Leads</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Manage and track your current pipeline.</p>
            </div>
            <button onClick={() => navigate('?modal=addLead')} className="flex items-center gap-2 bg-primary text-on-primary hover:bg-primary/90 px-4 py-2 rounded-lg font-label-bold transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              <span className="hidden sm:inline">Add Lead</span>
            </button>
          </div>
          <div className="mb-6 flex flex-col gap-4">
            <div className={`flex flex-col sm:flex-row gap-3 items-center sticky top-16 z-40 bg-[#F4F5F7] py-3 -mx-gutter px-gutter lg:-mx-6 lg:px-6 shadow-sm sm:shadow-none transition-transform duration-300 ${showSearch ? 'translate-y-0' : '-translate-y-[150%]'}`}>
              <div className="relative flex-1 w-full flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">search</span>
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md" 
                  placeholder="Search leads (name, location, phone...)" 
                  type="text" 
                />
              </div>

              <div className="hidden md:flex gap-2">
                <div className="relative">
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Interested">Interested</option>
                    <option value="Done">Done</option>
                    <option value="Not Interested">Not Interested</option>
                  </select>
                  <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-high transition-colors pointer-events-none">
                    <span className="material-symbols-outlined text-[16px]">filter_list</span>
                    <span className="font-label-bold">{filterStatus === 'All' ? 'Filter' : filterStatus}</span>
                  </button>
                </div>

                <div className="relative">
                  <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                    <option value="Default">Default</option>
                    <option value="A to Z">A to Z</option>
                    <option value="Rating">Rating</option>
                  </select>
                  <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-high transition-colors pointer-events-none">
                    <span className="material-symbols-outlined text-[16px]">sort</span>
                    <span className="font-label-bold">{sortOption === 'Default' ? 'Sort' : sortOption}</span>
                  </button>
                </div>


                <div className="relative flex items-center">
                  <input 
                    type="date" 
                    value={filterDate} 
                    onChange={(e) => {
                      setFilterDate(e.target.value);
                      setPage(1);
                    }}
                    onClick={(e) => {
                      if (e.target.showPicker) e.target.showPicker();
                    }}
                    className="px-4 py-2 border border-outline-variant rounded-lg bg-surface text-on-surface hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md font-label-bold cursor-pointer min-w-[130px]"
                  />
                  {filterDate && (
                    <button onClick={() => { setFilterDate(''); setPage(1); }} className="absolute right-1 top-1/2 -translate-y-1/2 z-10 p-0.5 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-highest flex items-center justify-center bg-surface">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="px-3 py-1.5 bg-surface-container-highest rounded-full flex items-center gap-2">
                <span className="font-label-bold text-on-surface">Total Leads:</span>
                <span className="font-body-sm font-bold">{leads.length}</span>
              </div>
              <div className="px-3 py-1.5 bg-[#fef3c7] text-[#92400e] rounded-full flex items-center gap-2">
                <span className="font-label-bold">Pending:</span>
                <span className="font-body-sm font-bold">{leads.filter(l => l.status === 'Pending').length}</span>
              </div>
              <div className="px-3 py-1.5 bg-[#dbeafe] text-[#1e40af] rounded-full flex items-center gap-2">
                <span className="font-label-bold">Interested:</span>
                <span className="font-body-sm font-bold">{leads.filter(l => l.status === 'Interested').length}</span>
              </div>
              <div className="px-3 py-1.5 bg-[#fee2e2] text-[#991b1b] rounded-full flex items-center gap-2">
                <span className="font-label-bold">Not Interested:</span>
                <span className="font-body-sm font-bold">{leads.filter(l => l.status === 'Not Interested').length}</span>
              </div>
            </div>
          </div>

          {/* Leads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {displayedLeads.length > 0 ? (
              displayedLeads.map((lead) => {
                const leadId = lead._id || lead.id;
              const styles = getStatusStyles(lead.status);
              const initials = lead.initials || (lead.name ? lead.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'XX');
              return (
                <article key={leadId} className="transition-all duration-200 ease-in-out hover:shadow-[0_4px_8px_rgba(0,0,0,0.04)] hover:border-l-[4px] hover:-translate-y-[2px] bg-surface border border-[#DFE1E6] rounded-xl p-card-padding flex flex-col gap-4 relative overflow-hidden border-l-[4px] border-l-transparent" style={{ '--tw-border-opacity': 1, borderLeftColor: styles.accent }}>
                  <div className="absolute top-0 left-0 w-1 h-full opacity-50" style={{ backgroundColor: styles.accent }}></div>
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-primary font-bold">
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface m-0 leading-tight">{lead.name}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[12px]">location_on</span>
                          <span>{lead.location}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button aria-label="Edit" onClick={() => navigate(`?modal=editLead&id=${leadId}`)} className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-low">
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                      </button>
                      <button aria-label="Delete" onClick={() => setLeadToDelete(leadId)} className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-error-container">
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                      </button>
                    </div>
                  </div>
                  {/* Body Details */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 py-2 border-y border-outline-variant/30">
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Contact</span>
                      <span className="font-body-sm text-body-sm text-on-surface font-medium truncate" title={lead.contact}>{lead.contact}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Date Added</span>
                      <span className="font-body-sm text-[12px] text-on-surface font-medium">
                        {lead.date ? new Date(lead.date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Description</span>
                      <span className="font-body-sm text-body-sm text-on-surface font-medium break-words" title={lead.description}>{lead.description}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Rating</span>
                      <div className="flex items-center text-[#f59e0b]">
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-body-sm text-body-sm text-on-surface ml-1">{lead.rating}</span>
                      </div>
                    </div>
                  </div>
                  {/* Footer / Status & Actions */}
                  <div className="flex flex-col gap-3 mt-auto">
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center px-2 py-1 rounded font-label-caps text-label-caps uppercase" style={{ backgroundColor: styles.bg, color: styles.text }}>
                        {lead.status}
                      </span>
                      <div className="flex gap-2">
                        {lead.url && (
                          <a href={lead.url} target="_blank" rel="noopener noreferrer" aria-label="Link" className="w-8 h-8 rounded bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-container/20 transition-colors">
                            <span className="material-symbols-outlined text-[12px]">link</span>
                          </a>
                        )}
                        <button aria-label="Email" className="w-8 h-8 rounded bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-container/20 transition-colors">
                          <span className="material-symbols-outlined text-[12px]">mail</span>
                        </button>
                      </div>
                    </div>
                    {expandedContactId === leadId ? (
                      <div className="flex gap-2 w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <a href={`https://wa.me/${lead.contact.replace(/[^\d+]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white hover:bg-[#128C7E] rounded-lg flex items-center justify-center gap-1 font-label-bold text-[13px] transition-colors py-2.5">
                          <span className="material-symbols-outlined text-[14px]">chat</span>
                          WhatsApp
                        </a>
                        <a href={`tel:${lead.contact.replace(/[^\d+]/g, '')}`} className="flex-1 bg-primary text-on-primary hover:bg-primary/90 rounded-lg flex items-center justify-center gap-1 font-label-bold text-[13px] transition-colors py-2.5">
                          <span className="material-symbols-outlined text-[14px]">call</span>
                          Call
                        </a>
                        <button onClick={() => setExpandedContactId(null)} aria-label="Close" className="bg-surface-container-highest text-on-surface hover:bg-surface-dim border border-outline-variant rounded-lg flex items-center justify-center px-3 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setExpandedContactId(leadId)} className="bg-surface-variant text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-label-bold text-label-bold transition-colors">
                        <span className="material-symbols-outlined text-[16px]">connect_without_contact</span>
                        Quick Contact
                      </button>
                    )}
                  </div>
                </article>
              );
            })
            ) : !isLoading ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-3">search_off</span>
                <p className="font-body-lg">No leads found.</p>
              </div>
            ) : null}

            {/* Skeleton Loaders & Intersection Observer Target */}
            {isLoading && Array.from({ length: 3 }).map((_, idx) => (
              <article key={`skeleton-${idx}`} className="bg-surface border border-[#DFE1E6] rounded-xl p-card-padding flex flex-col gap-4 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center w-full">
                    <div className="w-10 h-10 rounded-full bg-surface-variant flex-shrink-0"></div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="h-5 bg-surface-variant rounded w-3/4"></div>
                      <div className="h-3 bg-surface-variant rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 py-2 border-y border-outline-variant/30">
                  <div className="flex flex-col gap-1"><div className="h-3 bg-surface-variant rounded w-1/2"></div><div className="h-4 bg-surface-variant rounded w-3/4"></div></div>
                  <div className="flex flex-col gap-1"><div className="h-3 bg-surface-variant rounded w-1/2"></div><div className="h-4 bg-surface-variant rounded w-3/4"></div></div>
                  <div className="flex flex-col gap-1"><div className="h-3 bg-surface-variant rounded w-1/2"></div><div className="h-4 bg-surface-variant rounded w-full"></div></div>
                  <div className="flex flex-col gap-1"><div className="h-3 bg-surface-variant rounded w-1/2"></div><div className="h-4 bg-surface-variant rounded w-1/4"></div></div>
                </div>
                <div className="flex flex-col gap-3 mt-auto">
                  <div className="flex justify-between items-center">
                    <div className="w-16 h-6 bg-surface-variant rounded"></div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded bg-surface-variant"></div>
                    </div>
                  </div>
                  <div className="w-full h-10 bg-surface-variant rounded-lg"></div>
                </div>
              </article>
            ))}

            <div ref={lastElementRef} className="col-span-full h-4"></div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Fixed Nav */}
      <div className="fixed bottom-0 left-0 w-full z-50 flex gap-3 p-4 bg-surface/80 backdrop-blur-md border-t border-outline-variant md:hidden">
        <div className="relative flex-1">
          <button onClick={() => setShowMobileFilter(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[16px]">filter_list</span>
            <span className="font-label-bold">{filterStatus === 'All' ? 'Filter' : filterStatus}</span>
          </button>
        </div>
        <div className="relative flex-1">
          <button onClick={() => setShowMobileSort(true)} className="w-full flex items-center justify-center gap-2 px-2 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-high transition-colors truncate">
            <span className="material-symbols-outlined text-[16px]">sort</span>
            <span className="font-label-bold">{sortOption === 'Default' ? 'Sort' : sortOption}</span>
          </button>
        </div>
        <div className="relative flex items-center flex-shrink-0">
          <input 
            type="date" 
            value={filterDate} 
            onChange={(e) => {
              setFilterDate(e.target.value);
              setPage(1);
            }} 
            onClick={(e) => {
              if (e.target.showPicker) e.target.showPicker();
            }}
            className="w-[135px] px-2 py-2 border border-outline-variant rounded-lg bg-surface/80 text-on-surface hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md font-label-bold cursor-pointer"
          />
          {filterDate && (
            <button onClick={() => { setFilterDate(''); setPage(1); }} className="absolute right-8 top-1/2 -translate-y-1/2 z-10 p-0.5 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-highest flex items-center justify-center bg-surface/80">
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Go to Top Button (Mobile) */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
        className="md:hidden fixed bottom-20 right-4 z-[70] w-12 h-12 rounded-full shadow-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors flex items-center justify-center" 
        aria-label="Go to top"
      >
        <span className="material-symbols-outlined text-[24px]">arrow_upward</span>
      </button>

      {/* Mobile Filter Bottom Sheet */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-[60] flex items-end md:hidden">
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setShowMobileFilter(false)}></div>
          <div className="relative w-full bg-surface rounded-t-2xl p-6 animate-in slide-in-from-bottom-8 duration-300 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-sm text-on-surface font-bold">Filter Status</h3>
              <button onClick={() => setShowMobileFilter(false)} className="p-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {['All', 'Pending', 'Interested', 'Done', 'Not Interested'].map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setFilterStatus(status);
                    setShowMobileFilter(false);
                  }}
                  className={`p-4 rounded-xl text-left font-body-md transition-colors ${filterStatus === status ? 'bg-[#dbeafe] text-[#1e40af] font-bold border border-[#bfdbfe]' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high border border-transparent'}`}
                >
                  {status === 'All' ? 'All Statuses' : status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sort Bottom Sheet */}
      {showMobileSort && (
        <div className="fixed inset-0 z-[60] flex items-end md:hidden">
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setShowMobileSort(false)}></div>
          <div className="relative w-full bg-surface rounded-t-2xl p-6 animate-in slide-in-from-bottom-8 duration-300 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-sm text-on-surface font-bold">Sort By</h3>
              <button onClick={() => setShowMobileSort(false)} className="p-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {['Default', 'A to Z', 'Rating'].map(sort => (
                <button
                  key={sort}
                  onClick={() => {
                    setSortOption(sort);
                    setShowMobileSort(false);
                  }}
                  className={`p-4 rounded-xl text-left font-body-md transition-colors ${sortOption === sort ? 'bg-[#dbeafe] text-[#1e40af] font-bold border border-[#bfdbfe]' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high border border-transparent'}`}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {leadToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface w-full max-w-sm rounded-2xl shadow-xl flex flex-col p-6 animate-in zoom-in-95 duration-200">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">Delete Lead</h2>
            <p className="font-body-md text-on-surface-variant mb-6">Are you sure you want to delete this lead? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setLeadToDelete(null)} className="px-4 py-2 rounded-lg font-label-bold text-on-surface border border-outline-variant hover:bg-surface-container-high transition-colors">
                Cancel
              </button>
              <button onClick={() => { handleDeleteLead(leadToDelete); setLeadToDelete(null); }} className="px-4 py-2 rounded-lg font-label-bold text-on-error bg-error hover:bg-error/90 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface w-full max-w-sm rounded-2xl shadow-xl flex flex-col p-6 animate-in zoom-in-95 duration-200">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">Sign Out</h2>
            <p className="font-body-md text-on-surface-variant mb-6">Are you sure you want to sign out of LeadFlow CRM?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="px-4 py-2 rounded-lg font-label-bold text-on-surface border border-outline-variant hover:bg-surface-container-high transition-colors">
                Cancel
              </button>
              <button onClick={() => { setShowLogoutConfirm(false); logout(); }} className="px-4 py-2 rounded-lg font-label-bold text-on-error bg-error hover:bg-error/90 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && <AddLeadModal onAddLead={handleAddLead} />}
      {showEditModal && <EditLeadModal lead={leads.find(l => (l._id || l.id) === editLeadId)} onEditLead={handleEditLead} />}
    </div>
  );
};

export default LeadManagementDashboard;
