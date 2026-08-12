import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  LayoutDashboard, Users, Briefcase, PhoneCall, Calendar, MessageSquare, Mail, Sliders, DollarSign, Package,
  FileText, UserCheck, UserPlus, Plus, Trash2, Edit2, CheckCircle, FileSpreadsheet, Settings, Search, Globe,
  Bell, Clock, Sparkles, ChevronRight, ShieldCheck, Play, Layers, ArrowRightLeft, Filter, TrendingUp, Download,
  AlertCircle, X, PlusCircle, Check, CheckSquare, AlertTriangle, FolderMinus, HelpCircle, Sun, Moon, User,
  MoreHorizontal, Compass, Zap, MapPin, FileDigit, Lock, Building, Key, LogOut
} from 'lucide-react';

export default function Sidebar() {
  const { 
    activeTab, setActiveTab, setSubTab, user, handleLogout, 
    showMobileSidebar, setShowMobileSidebar, customModules,
    tenantBranding
  } = useAppContext();

  const navigate = useNavigate();
  const location = useLocation();

  const initials = user ? `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase() : 'VG';
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Vaibhav Gupta';
  const roleName = user ? (user.role === 'admin' ? 'Admin' : 'Sales Rep') : 'Admin';

  const navigateToTab = (tabName: string, path: string, sub?: string) => {
    setActiveTab(tabName);
    if (sub) setSubTab(sub);
    navigate(path);
  };

  const isTabActive = (tabName: string, path: string) => {
    return activeTab === tabName || location.pathname === path;
  };

  return (
    <aside className={`sidebar ${showMobileSidebar ? 'mobile-open' : ''}`} onClick={() => { if (showMobileSidebar) setShowMobileSidebar(false); }}>
        <div>
          {/* Logo */}
          <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={tenantBranding?.customLogoUrl || "/vgrow-logo.jpg"} alt="VGROW Logo" style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }} />
              <div>
                <h1 className="logo-title" style={{ fontSize: '15px' }}>{tenantBranding?.name || "VGROWCRM"}</h1>
                <p className="logo-subtitle">Discover First Step Pri...</p>
              </div>
            </div>
            <button 
              className="mobile-close-btn" 
              onClick={(e) => { e.stopPropagation(); setShowMobileSidebar(false); }}
              style={{ padding: '6px', border: 'none', cursor: 'pointer', background: 'none' }}
              title="Close Menu"
            >
              <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>

          {/* Sidebar Menu */}
          <nav className="sidebar-menu" style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
            {/* TODAY */}
            <div>
              <p className="menu-section-title">Today</p>
              <div className="menu-list">
                <button
                  onClick={() => navigateToTab('dashboard', '/dashboard', 'all')}
                  className={`menu-item ${isTabActive('dashboard', '/dashboard') ? 'active' : ''}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => navigateToTab('activities', '/activities')}
                  className={`menu-item ${isTabActive('activities', '/activities') ? 'active' : ''}`}
                >
                  <Clock className="w-4 h-4" />
                  Activities
                </button>
              </div>
            </div>

            {/* PIPELINE */}
            <div>
              <p className="menu-section-title">Pipeline</p>
              <div className="menu-list">
                <button
                  onClick={() => navigateToTab('leads', '/leads', 'all')}
                  className={`menu-item ${isTabActive('leads', '/leads') ? 'active' : ''}`}
                >
                  <Users className="w-4 h-4" />
                  Leads
                </button>
                <button
                  onClick={() => navigateToTab('accounts', '/accounts')}
                  className={`menu-item ${isTabActive('accounts', '/accounts') ? 'active' : ''}`}
                >
                  <Building className="w-4 h-4" />
                  Accounts
                </button>
                <button
                  onClick={() => navigateToTab('analytics', '/analytics')}
                  className={`menu-item ${isTabActive('analytics', '/analytics') ? 'active' : ''}`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Analytics
                </button>
                <button
                  onClick={() => navigateToTab('reports', '/reports')}
                  className={`menu-item ${isTabActive('reports', '/reports') ? 'active' : ''}`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Report Builder
                </button>
                <button
                  onClick={() => navigateToTab('prospecting', '/prospecting')}
                  className={`menu-item ${isTabActive('prospecting', '/prospecting') ? 'active' : ''}`}
                >
                  <Compass className="w-4 h-4" />
                  Prospecting
                </button>
              </div>
            </div>

            {/* COMMUNICATION */}
            <div>
              <p className="menu-section-title">Communication</p>
              <div className="menu-list">
                <button
                  onClick={() => navigateToTab('inbox', '/inbox')}
                  className={`menu-item ${isTabActive('inbox', '/inbox') ? 'active' : ''}`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Team Inbox
                </button>
                <button
                  onClick={() => navigateToTab('whatsapp', '/whatsapp')}
                  className={`menu-item ${isTabActive('whatsapp', '/whatsapp') ? 'active' : ''}`}
                >
                  <Sparkles className="w-4 h-4" style={{ color: '#25D366' }} />
                  WhatsApp
                </button>
                <button
                  onClick={() => navigateToTab('email', '/email')}
                  className={`menu-item ${isTabActive('email', '/email') ? 'active' : ''}`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button
                  onClick={() => navigateToTab('calls', '/calls')}
                  className={`menu-item ${isTabActive('calls', '/calls') ? 'active' : ''}`}
                >
                  <PhoneCall className="w-4 h-4" />
                  Calls
                </button>
              </div>
            </div>

            {/* COMMERCE */}
            <div>
              <p className="menu-section-title">Commerce</p>
              <div className="menu-list">
                <button
                  onClick={() => navigateToTab('products', '/products')}
                  className={`menu-item ${isTabActive('products', '/products') ? 'active' : ''}`}
                >
                  <Package className="w-4 h-4" />
                  Products &amp; Services
                </button>
                <button
                  onClick={() => navigateToTab('quote-requests', '/quote-requests')}
                  className={`menu-item ${isTabActive('quote-requests', '/quote-requests') ? 'active' : ''}`}
                >
                  <FileText className="w-4 h-4" />
                  Quote Requests
                </button>
                <button
                  onClick={() => navigateToTab('quotes', '/quotes')}
                  className={`menu-item ${isTabActive('quotes', '/quotes') ? 'active' : ''}`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Quotes
                </button>
                <button
                  onClick={() => navigateToTab('proposals', '/proposals')}
                  className={`menu-item ${isTabActive('proposals', '/proposals') ? 'active' : ''}`}
                >
                  <Sparkles className="w-4 h-4" />
                  AI Proposals
                </button>
                <button
                  onClick={() => navigateToTab('invoices', '/invoices')}
                  className={`menu-item ${isTabActive('invoices', '/invoices') ? 'active' : ''}`}
                >
                  <FileDigit className="w-4 h-4" />
                  Invoices
                </button>
                <button
                  onClick={() => navigateToTab('payments', '/payments')}
                  className={`menu-item ${isTabActive('payments', '/payments') ? 'active' : ''}`}
                >
                  <DollarSign className="w-4 h-4" />
                  Payments Received
                </button>
                <button
                  onClick={() => navigateToTab('payment-links', '/payment-links')}
                  className={`menu-item ${isTabActive('payment-links', '/payment-links') ? 'active' : ''}`}
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  Payment Links
                </button>
              </div>
            </div>

            {/* OPERATIONS */}
            <div>
              <p className="menu-section-title">Operations</p>
              <div className="menu-list">
                <button
                  onClick={() => navigateToTab('tasks', '/tasks')}
                  className={`menu-item ${isTabActive('tasks', '/tasks') ? 'active' : ''}`}
                >
                  <CheckSquare className="w-4 h-4" />
                  Task Boards
                </button>
                <button
                  onClick={() => navigateToTab('events', '/events')}
                  className={`menu-item ${isTabActive('events', '/events') ? 'active' : ''}`}
                >
                  <Calendar className="w-4 h-4" />
                  Events
                </button>
                <button
                  onClick={() => navigateToTab('scheduler', '/scheduler')}
                  className={`menu-item ${isTabActive('scheduler', '/scheduler') ? 'active' : ''}`}
                >
                  <Sliders className="w-4 h-4" />
                  Scheduler
                </button>
              </div>
            </div>

            {/* HR & EMPLOYEES */}
            <div>
              <p className="menu-section-title">HR &amp; Operations</p>
              <div className="menu-list">
                <button
                  onClick={() => navigateToTab('employees', '/employees')}
                  className={`menu-item ${isTabActive('employees', '/employees') ? 'active' : ''}`}
                >
                  <Users className="w-4 h-4" />
                  Employees
                </button>
                <button
                  onClick={() => navigateToTab('hierarchy', '/hierarchy')}
                  className={`menu-item ${isTabActive('hierarchy', '/hierarchy') ? 'active' : ''}`}
                >
                  <Layers className="w-4 h-4" />
                  Org Hierarchy
                </button>
                <button
                  onClick={() => navigateToTab('roles', '/roles')}
                  className={`menu-item ${isTabActive('roles', '/roles') ? 'active' : ''}`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Roles &amp; Permissions
                </button>
              </div>
            </div>

            {/* SUPPORT */}
            <div>
              <p className="menu-section-title">Customers &amp; Support</p>
              <div className="menu-list">
                <button
                  onClick={() => navigateToTab('tickets', '/tickets')}
                  className={`menu-item ${isTabActive('tickets', '/tickets') ? 'active' : ''}`}
                >
                  <AlertCircle className="w-4 h-4" />
                  Support Tickets
                </button>
                <button
                  onClick={() => navigateToTab('knowledge-base', '/knowledge-base')}
                  className={`menu-item ${isTabActive('knowledge-base', '/knowledge-base') ? 'active' : ''}`}
                >
                  <HelpCircle className="w-4 h-4" />
                  Knowledge Base
                </button>
              </div>
            </div>

            {/* IA & AUTOMATION */}
            <div>
              <p className="menu-section-title">Intelligence</p>
              <div className="menu-list">
                <button
                  onClick={() => navigateToTab('ai-inbox', '/ai-inbox')}
                  className={`menu-item ${isTabActive('ai-inbox', '/ai-inbox') ? 'active' : ''}`}
                >
                  <Sparkles className="w-4 h-4" />
                  AI Inbox
                </button>
                <button
                  onClick={() => navigateToTab('chat', '/chat')}
                  className={`menu-item ${isTabActive('chat', '/chat') ? 'active' : ''}`}
                >
                  <MessageSquare className="w-4 h-4" />
                  AI Chat
                </button>
                <button
                  onClick={() => navigateToTab('automations', '/automations')}
                  className={`menu-item ${isTabActive('automations', '/automations') ? 'active' : ''}`}
                >
                  <Zap className="w-4 h-4" />
                  Workflows
                </button>
              </div>
            </div>

            {/* CUSTOM OBJECTS */}
            {customModules && customModules.length > 0 && (
              <div>
                <p className="menu-section-title">Custom Objects</p>
                <div className="menu-list">
                  {customModules.map(mod => (
                    <button
                      key={mod.id}
                      onClick={() => navigateToTab(`custom-${mod.id}`, `/custom-module/${mod.id}`)}
                      className={`menu-item ${isTabActive(`custom-${mod.id}`, `/custom-module/${mod.id}`) ? 'active' : ''}`}
                    >
                      <Sparkles className="w-4 h-4" />
                      {mod.pluralName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS */}
            <div>
              <p className="menu-section-title">Admin &amp; Control</p>
              <div className="menu-list">
                <button
                  onClick={() => navigateToTab('module-builder', '/module-builder')}
                  className={`menu-item ${isTabActive('module-builder', '/module-builder') ? 'active' : ''}`}
                >
                  <Layers className="w-4 h-4" />
                  Module Builder
                </button>
                <button
                  onClick={() => navigateToTab('settings', '/settings', 'company')}
                  className={`menu-item ${isTabActive('settings', '/settings') ? 'active' : ''}`}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* User profile footer */}
        <div className="sidebar-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="user-avatar">{initials}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p className="user-name" style={{ margin: 0 }}>{fullName}</p>
              <span className="user-badge" style={{ alignSelf: 'flex-start' }}>{roleName}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--text-secondary)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
  );
}
