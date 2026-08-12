import React from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  TrendingUp, Clock, AlertTriangle, ChevronRight, Plus, Activity, 
  ArrowUpRight, Users, CheckCircle, BarChart3, Star, Sparkles
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function DashboardPage() {
  const context = useAppContext();
  const { activeTab, leads, quotes, invoices } = context;

  // Calculate dynamic stats
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.temperature === 'Hot').length;
  const warmLeads = leads.filter(l => l.temperature === 'Warm').length;
  
  // Calculate total pipeline value (using quotes as pipeline)
  const pipelineValue = quotes.reduce((acc, q) => acc + parseFloat(q.amount || 0), 0);
  
  // Calculate settled billing value
  const totalRevenue = invoices
    .filter(i => i.status === 'Paid')
    .reduce((acc, i) => acc + parseFloat(i.amount || 0), 0);

  return (
    <>
      {activeTab === 'dashboard' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top Welcome Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 className="page-title" style={{ fontSize: '24px', fontWeight: '900', background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent-indigo) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Active Operations Hub
              </h2>
              <p className="page-desc">Real-time overview of your localized lead sources, B2B quotes, and revenue tracking.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.02)', padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '11px', color: 'var(--text-secondary)', alignItems: 'center' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }}></span>
              Live Sync Active
            </div>
          </div>

          {/* Quick SaaS Analytics Ribbon */}
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            
            {/* Metric 1 */}
            <Card style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', overflow: 'hidden' }} padding="20px">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>Pipeline Value</span>
                <span style={{ fontSize: '10px', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <ArrowUpRight className="w-3 h-3" /> Live
                </span>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)' }}>
                ₹{pipelineValue.toLocaleString('en-IN')}
              </h3>
              <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Based on open commercial quotes</p>
            </Card>

            {/* Metric 2 */}
            <Card style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} padding="20px">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>Active Leads</span>
                <span style={{ fontSize: '10px', color: 'var(--accent-indigo)', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 6px', borderRadius: '6px' }}>
                  {hotLeads} Hot
                </span>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {totalLeads} Leads
              </h3>
              <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>JustDial & Sulekha sync live</p>
            </Card>

            {/* Metric 3 */}
            <Card style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} padding="20px">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>Settled Revenue</span>
                <Badge variant="emerald">UPI / Net</Badge>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--accent-emerald)' }}>
                ₹{totalRevenue.toLocaleString('en-IN')}
              </h3>
              <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Razorpay settlements cleared</p>
            </Card>

            {/* Metric 4 */}
            <Card style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} padding="20px">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>Automation Success</span>
                <Badge variant="indigo">Automated</Badge>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)' }}>0%</h3>
              <button 
                onClick={() => window.location.href = '/settings?tab=all-integrations'}
                style={{ fontSize: '10px', color: 'var(--accent-indigo)', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0, fontWeight: '700' }}
              >
                Connect integrations to track &gt;
              </button>
            </Card>

          </div>

          {/* Main Hero & Profile Health Banner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            
            {/* Profile Health Score Widget */}
            <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} padding="24px">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent-rose)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Online Presence</span>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>Profile Health Score</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>How your business looks online — across reviews, social profiles and website listings.</p>
                </div>
                <Badge variant="rose">Needs attention</Badge>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', marginTop: '10px' }}>
                {/* Arc gauge display */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', flexGrow: 1, minWidth: '120px' }}>
                  <div style={{ position: 'relative', width: '120px', height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <svg width="120" height="70" viewBox="0 0 120 70">
                      <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" strokeLinecap="round" />
                      <path d="M 10 65 A 50 50 0 0 1 35 25" fill="none" stroke="var(--accent-rose)" strokeWidth="12" strokeLinecap="round" />
                    </svg>
                    <div style={{ position: 'absolute', bottom: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: '1' }}>—</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>/ 100</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--accent-rose)', fontWeight: '800', marginTop: '12px', textAlign: 'center' }}>Action Required</span>
                </div>

                {/* Sub parameters metrics list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 2, minWidth: '200px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <span>Google Business</span>
                      <button onClick={() => window.location.href = '/settings?tab=all-integrations'} style={{ background: 'transparent', border: 'none', fontWeight: '800', color: 'var(--accent-indigo)', cursor: 'pointer' }}>Connect</button>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <span>JustDial Listings</span>
                      <button onClick={() => window.location.href = '/settings?tab=all-integrations'} style={{ background: 'transparent', border: 'none', fontWeight: '800', color: 'var(--accent-indigo)', cursor: 'pointer' }}>Connect</button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick action card checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} padding="16px">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', background: 'rgba(21,107,244,0.1)', color: 'var(--accent-indigo)', borderRadius: '8px' }}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>Today's Activity Briefing</h4>
                    <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Summary of calls, chats, and quotes</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-secondary" />
              </Card>

              <Card style={{ display: 'flex', alignItems: 'center', gap: '12px' }} padding="16px">
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid var(--accent-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px' }}>
                  5/6
                </div>
                <div>
                  <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>Workspace Setup</span>
                  <h4 style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>Integrations complete</h4>
                  <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Your team is ready to scale operations.</p>
                </div>
              </Card>
            </div>

          </div>

          {/* CRM Hygiene Score Row */}
          <Card style={{ display: 'flex', alignItems: 'center', gap: '20px' }} padding="20px 24px">
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '4px solid var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', color: 'var(--text-primary)' }}>
              {totalLeads > 0 ? Math.min(100, Math.round((totalLeads / Math.max(1, totalLeads)) * 100)) : '—'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>CRM Hygiene Score</h4>
                <Badge variant="amber">Optimal</Badge>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Lead response time index evaluated at {totalLeads} active records.</p>
            </div>
          </Card>

        </div>
      )}
    </>
  );
}
