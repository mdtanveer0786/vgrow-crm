import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Layers, Briefcase, FileText, CheckCircle, Search, CreditCard, HelpCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState('projects');
  const { user } = useAppContext();

  const clientName = user?.tenant?.name 
    || (user?.firstName ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}` : '')
    || user?.email
    || 'Valued Client';

  return (
    <div className="client-portal-wrapper" style={{ minHeight: '100vh', background: 'var(--bg-default)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <header style={{ padding: '16px 32px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers className="w-5 h-5" style={{ color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>vGrow Client Portal</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Welcome back, <strong>{clientName}</strong></span>
          <Button variant="secondary" size="sm">Logout</Button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', gap: '32px' }}>
        
        {/* Sidebar Navigation */}
        <aside style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('projects')}
            style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: activeTab === 'projects' ? 'var(--bg-hover)' : 'transparent', border: 'none', borderRadius: '8px', color: activeTab === 'projects' ? 'var(--accent-indigo)' : 'var(--text-secondary)', fontWeight: activeTab === 'projects' ? '600' : '400', cursor: 'pointer', textAlign: 'left', width: '100%' }}
          >
            <Briefcase className="w-4 h-4" /> Active Projects
          </button>
          <button 
            onClick={() => setActiveTab('invoices')}
            style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: activeTab === 'invoices' ? 'var(--bg-hover)' : 'transparent', border: 'none', borderRadius: '8px', color: activeTab === 'invoices' ? 'var(--accent-indigo)' : 'var(--text-secondary)', fontWeight: activeTab === 'invoices' ? '600' : '400', cursor: 'pointer', textAlign: 'left', width: '100%' }}
          >
            <FileText className="w-4 h-4" /> Invoices & Billing
          </button>
          <button 
            onClick={() => setActiveTab('support')}
            style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: activeTab === 'support' ? 'var(--bg-hover)' : 'transparent', border: 'none', borderRadius: '8px', color: activeTab === 'support' ? 'var(--accent-indigo)' : 'var(--text-secondary)', fontWeight: activeTab === 'support' ? '600' : '400', cursor: 'pointer', textAlign: 'left', width: '100%' }}
          >
            <HelpCircle className="w-4 h-4" /> Support Tickets
          </button>
        </aside>

        {/* Tab Content */}
        <div style={{ flex: 1 }}>
          {activeTab === 'projects' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Your Active Projects</h2>
              <Card padding="24px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>Website Redesign & SEO</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Phase 2: Frontend Development</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent-amber)', background: 'rgba(245,158,11,0.1)', padding: '4px 10px', borderRadius: '20px' }}>In Progress (45%)</span>
                  <Button variant="secondary" size="sm">View Details</Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Billing & Invoices</h2>
              <Card padding="24px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>INV-2026-089</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Due Date: Aug 25, 2026</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>₹45,000</span>
                  <Button variant="primary" size="sm" leftIcon={<CreditCard className="w-4 h-4" />}>Pay Now</Button>
                </div>
              </Card>
              <Card padding="24px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>INV-2026-042</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Paid on Jul 15, 2026</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>₹30,000</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent-emerald)', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle className="w-3 h-3" /> Paid
                  </span>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Support Tickets</h2>
                <Button variant="primary" size="sm">New Ticket</Button>
              </div>
              <Card padding="24px" style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>You have no open support tickets.</p>
              </Card>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
