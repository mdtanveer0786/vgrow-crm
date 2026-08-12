import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Search, Globe, Bell, Sun, Moon, Menu, Users, Building, UserCheck } from 'lucide-react';

export default function Topbar() {
  const { 
    isDarkMode, setIsDarkMode, showKaranPanel, setShowKaranPanel, 
    showMobileSidebar, setShowMobileSidebar, globalSearch, setSelectedLead, setActiveTab 
  } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (val.trim().length > 1) {
      const results = await globalSearch(val);
      setSearchResults(results);
      setShowDropdown(true);
    } else {
      setSearchResults(null);
      setShowDropdown(false);
    }
  };

  const handleResultClick = (item: any) => {
    setShowDropdown(false);
    setSearchQuery('');
    
    if (item.type === 'Lead') {
      setSelectedLead(item);
      setActiveTab('leads');
    } else if (item.type === 'Company') {
      setActiveTab('accounts');
    } else if (item.type === 'Contact') {
      setActiveTab('contacts');
    }
  };

  return (
    <header className="app-header" style={{ position: 'relative' }}>
      <button 
        className="mobile-menu-toggle" 
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        style={{ padding: '8px', border: 'none', cursor: 'pointer', background: 'none', marginRight: '8px' }}
        title="Toggle Menu"
      >
        <Menu className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
      </button>

      {/* Global Search / Command Palette Container */}
      <div className="search-container" style={{ position: 'relative', width: '380px' }}>
        <Search className="search-icon" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px' }} />
        <input
          type="text"
          placeholder="Search... (Press ⌘K)"
          className="search-input"
          value={searchQuery}
          onChange={handleSearchChange}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          style={{ 
            padding: '10px 14px 10px 42px', 
            borderRadius: 'var(--radius-lg)', 
            background: 'var(--bg-card)',
            boxShadow: 'var(--shadow-sm)'
          }}
        />

        {/* Results Dropdown */}
        {showDropdown && searchResults && (
          <div className="glass-panel" style={{
            position: 'absolute',
            top: '44px',
            left: 0,
            width: '100%',
            maxHeight: '300px',
            overflowY: 'auto',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            padding: '8px'
          }}>
            {/* Leads Section */}
            {searchResults.leads && searchResults.leads.length > 0 && (
              <div>
                <p style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 8px' }}>Leads</p>
                {searchResults.leads.map((l: any) => (
                  <div 
                    key={l.id} 
                    onClick={() => handleResultClick(l)}
                    style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}
                    className="nested-menu-item"
                  >
                    <Users className="w-3.5 h-3.5" style={{ color: 'var(--accent-indigo)' }} />
                    <span>{l.firstName} {l.lastName}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Companies Section */}
            {searchResults.companies && searchResults.companies.length > 0 && (
              <div>
                <p style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 8px' }}>Companies</p>
                {searchResults.companies.map((c: any) => (
                  <div 
                    key={c.id} 
                    onClick={() => handleResultClick(c)}
                    style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}
                    className="nested-menu-item"
                  >
                    <Building className="w-3.5 h-3.5" style={{ color: 'var(--accent-emerald)' }} />
                    <span>{c.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Contacts Section */}
            {searchResults.contacts && searchResults.contacts.length > 0 && (
              <div>
                <p style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 8px' }}>Contacts</p>
                {searchResults.contacts.map((co: any) => (
                  <div 
                    key={co.id} 
                    onClick={() => handleResultClick(co)}
                    style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}
                    className="nested-menu-item"
                  >
                    <UserCheck className="w-3.5 h-3.5" style={{ color: 'var(--accent-amber)' }} />
                    <span>{co.name}</span>
                  </div>
                ))}
              </div>
            )}

            {(!searchResults.leads?.length && !searchResults.companies?.length && !searchResults.contacts?.length) && (
              <div style={{ padding: '12px', textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
                No records match query.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="header-actions">
        {/* Meet Karan Helper */}
        <button 
          onClick={() => setShowKaranPanel(!showKaranPanel)}
          className="btn-primary" 
          style={{ padding: '6px 12px', fontSize: '11px', background: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          <span style={{ fontWeight: '800', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px' }}>K</span>
          Meet Karan
        </button>

        <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
          <Bell style={{ width: '20px', height: '20px', color: 'var(--text-secondary)' }} />
          <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', background: 'var(--accent-rose)', borderRadius: '50%' }}></span>
        </button>

        <button 
          className="btn-secondary" 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          style={{ 
            padding: '8px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            cursor: 'pointer' 
          }}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Globe className="w-3.5 h-3.5" />
          EN
        </button>
      </div>
    </header>
  );
}
