import { useState, useEffect, useRef } from 'react';

const CustomDropdown = ({ label, options, selected, onSelect, minWidth = '140px', bgColor = '#ffffff' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minWidth,
          padding: '10px 14px',
          border: isOpen ? '1.5px solid #c9a84c' : '1.5px solid rgba(196,198,204,0.5)',
          borderRadius: '8px',
          backgroundColor: isOpen ? '#fcfbf7' : bgColor,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '13px',
          fontWeight: 500,
          color: '#0d1b2a',
          cursor: 'pointer',
          outline: 'none',
          transition: 'all 0.2s ease',
          boxShadow: isOpen ? '0 0 0 3px rgba(201,168,76,0.15)' : 'none',
        }}
      >
        <span>
          {selected && selected !== 'all' ? options.find(o => o.value === selected)?.label || label : label}
        </span>
        <span 
          className="material-symbols-outlined" 
          style={{ 
            fontSize: '18px', 
            color: '#74777d',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            marginLeft: '8px'
          }}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown Menu */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          minWidth: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid rgba(196,198,204,0.3)',
          boxShadow: '0 10px 25px rgba(13,27,42,0.1)',
          zIndex: 100,
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          padding: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        <button
           onClick={() => { onSelect(''); setIsOpen(false); }}
           style={{
             padding: '8px 12px',
             textAlign: 'left',
             background: !selected ? '#f7f9ff' : 'none',
             border: 'none',
             borderRadius: '6px',
             cursor: 'pointer',
             fontFamily: "'DM Sans', sans-serif",
             fontSize: '13px',
             color: !selected ? '#0d1b2a' : '#44474c',
             fontWeight: !selected ? 600 : 400,
             transition: 'background 0.2s',
             whiteSpace: 'nowrap',
           }}
           onMouseEnter={e => !selected && (e.currentTarget.style.background = '#f7f9ff')}
           onMouseLeave={e => !selected && (e.currentTarget.style.background = 'none')}
        >
          {label}
        </button>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { onSelect(opt.value); setIsOpen(false); }}
            style={{
              padding: '8px 12px',
              textAlign: 'left',
              background: selected === opt.value ? '#f7f9ff' : 'none',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              color: selected === opt.value ? '#0d1b2a' : '#44474c',
              fontWeight: selected === opt.value ? 600 : 400,
              transition: 'background 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => selected !== opt.value && (e.currentTarget.style.background = '#fafafa')}
            onMouseLeave={e => selected !== opt.value && (e.currentTarget.style.background = 'none')}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const SearchFilterBar = ({ search = '', onSearchChange, filterStatus = '', onFilterStatusChange, filterRating = '', onFilterRatingChange, sort = '', onSortChange, filterDate = '', onFilterDateChange }) => {
  const [isSticky, setIsSticky] = useState(false);
  
  // Debounce search input
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearchChange && localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 2000); // 2000ms (2 seconds) delay
    return () => clearTimeout(handler);
  }, [localSearch, onSearchChange, search]);
  
  const sentinelRef = useRef(null);

  /* ── Sticky on scroll (mobile only) ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // when sentinel goes out of view → bar is sticky
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-68px 0px 0px 0px' } // 68px = navbar height
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);


  return (
    <>
      {/* Invisible sentinel — tells us when bar should become sticky */}
      <div ref={sentinelRef} style={{ height: '1px', marginBottom: '-1px' }} />

      {/* ── Search Bar Wrapper ── */}
      <div
        id="search-bar-wrapper"
        style={{
          /* on desktop: normal flow with padding */
          padding: '0 48px',
          marginBottom: '24px',
          /* sticky state applied via class below */
        }}
        className={isSticky ? 'search-sticky' : ''}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            flexWrap: 'wrap',
            boxShadow: '0 2px 10px rgba(15,28,44,0.07)',
            border: '1px solid rgba(196,198,204,0.3)',
            alignItems: 'center',
          }}
        >
          {/* ── Search Input ── always visible ── */}
          <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
            <span
              className="material-symbols-outlined"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '20px',
                color: '#74777d',
                pointerEvents: 'none',
              }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Search premium leads..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '42px',
                paddingRight: '14px',
                paddingTop: '10px',
                paddingBottom: '10px',
                borderRadius: '8px',
                border: '1.5px solid rgba(196,198,204,0.5)',
                backgroundColor: '#f7f9ff',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                color: '#091d2e',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.target.style.borderColor = '#755b00')}
              onBlur={e => (e.target.style.borderColor = 'rgba(196,198,204,0.5)')}
            />
          </div>

          {/* ── Filter Dropdowns — Desktop only ── */}
          <div id="filter-btns" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            
            <CustomDropdown 
              label="Status" 
              selected={filterStatus} 
              onSelect={v => onFilterStatusChange && onFilterStatusChange(v || 'all')} 
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'interested', label: 'Interested' },
                { value: 'not_interested', label: 'Not Interested' }
              ]} 
            />

            <CustomDropdown 
              label="Rating" 
              selected={filterRating} 
              onSelect={v => onFilterRatingChange && onFilterRatingChange(v || 'all')} 
              options={[
                { value: '5', label: '5 Stars' },
                { value: '4', label: '4 Stars' },
                { value: '3', label: '3 Stars' },
                { value: '2', label: '2 Stars' },
                { value: '1', label: '1 Star' },
              ]} 
            />

            {/* Date Picker */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => onFilterDateChange && onFilterDateChange(e.target.value)}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                style={{
                  padding: '9px 14px',
                  border: '1.5px solid rgba(196,198,204,0.5)',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#44474c',
                  cursor: 'pointer',
                  outline: 'none',
                }} 
              />
            </div>

            <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(196,198,204,0.4)' }} />

            <CustomDropdown 
              label="Sort: Default" 
              selected={sort} 
              onSelect={v => onSortChange && onSortChange(v)} 
              bgColor="#f7f9ff"
              options={[
                { value: 'a_z', label: 'A to Z' },
                { value: 'z_a', label: 'Z to A' }
              ]} 
            />
          </div>
        </div>
      </div>

      {/* ── Responsive + Sticky CSS ── */}
      <style>{`
        /* Mobile: hide filter buttons, keep only search */
        @media (max-width: 767px) {
          #filter-btns { display: none !important; }

          #search-bar-wrapper {
            padding: 0 0px !important;
          }

          /* When sticky on mobile: fix below navbar */
          #search-bar-wrapper.search-sticky {
            position: fixed !important;
            top: 0px !important;
            left: 0 !important;
            right: 0 !important;
            padding: 8px 0px !important;
            background: #FAF3E0 !important;
            z-index: 90 !important;
            box-shadow: 0 4px 12px rgba(13,27,42,0.10) !important;
            margin-bottom: 0 !important;
          }
        }

        /* Desktop & Tablet: Sticky below navbar */
        @media (min-width: 768px) {
          #search-bar-wrapper {
            transition: all 0.2s ease;
          }
          #search-bar-wrapper.search-sticky {
            position: fixed !important;
            top: 0px !important; /* Fixed exactly at the top */
            left: 0 !important;
            right: 0 !important;
            z-index: 110 !important; /* Higher than Navbar (100) to ensure visibility */
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(8px) !important;
            box-shadow: 0 4px 16px rgba(13,27,42,0.06) !important;
            border-bottom: 1px solid rgba(196,198,204,0.3) !important;
            margin-bottom: 0 !important;
            padding-left: max(48px, calc((100vw - 1280px) / 2 + 48px)) !important;
            padding-right: max(48px, calc((100vw - 1280px) / 2 + 48px)) !important;
            padding-top: 16px !important;
            padding-bottom: 16px !important;
          }
        }
      `}</style>
    </>
  );
};

export default SearchFilterBar;
