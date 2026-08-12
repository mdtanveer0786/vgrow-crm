import React from 'react';
import { useAppContext } from '../context/AppContext';
import {
  Globe, ShieldCheck, Settings, Sparkles, Database, Laptop, Info,
  Smartphone, BellRing, UserCheck, Key, Fingerprint, Lock
} from 'lucide-react';
import { Card, Button } from '../components/ui';

export default function SettingsPage() {
  const context = useAppContext();
  const {
      activeTab, subTab, setSubTab, settings, handleUpdateSettings
  } = context;

  return (
    <>
      {activeTab === 'settings' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                Workspace Settings Hub
              </h2>
              <p className="page-desc">Manage tenant configurations, developer APIs, custom tax rules, and local search integrations.</p>
            </div>
          </div>

          <div className="settings-layout-grid">
            {/* Settings Left sub-sidebar */}
            <Card style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px', height: 'fit-content' }}>
              <div>
                <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>PROFILE &amp; COMPANY</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {['Company', 'Date & Time Format', 'Default Landing Page', 'Billing & Plans'].map(op => (
                    <button
                      key={op}
                      onClick={() => setSubTab(op.toLowerCase().replace(/ /g, '-').replace('&-', ''))}
                      className={`nested-menu-item ${subTab === op.toLowerCase().replace(/ /g, '-').replace('&-', '') ? 'active' : ''}`}
                      style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '12px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '6px' }}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>AI &amp; INTEGRATIONS</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {['WhatsApp AI Auto-reply', 'All Integrations', 'Developer APIs', 'Field Operations'].map(op => (
                    <button
                      key={op}
                      onClick={() => setSubTab(op.toLowerCase().replace(/ /g, '-'))}
                      className={`nested-menu-item ${subTab === op.toLowerCase().replace(/ /g, '-') ? 'active' : ''}`}
                      style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '12px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '6px' }}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Settings Middle Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Sub-view: Company Profile */}
              {subTab === 'company' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>Company Profile & Tax Details</h3>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Configure your organization's legal parameters. Logo and company metadata automatically apply to sales quotes and GST invoices.</p>
                    
                    <div className="form-field" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                      {settings.logoUrl ? (
                        <img src={settings.logoUrl} alt="Company Logo" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'contain', backgroundColor: 'var(--surface-sunken)' }} />
                      ) : (
                        <div style={{ width: '64px', height: '64px', borderRadius: '8px', backgroundColor: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>No Logo</span>
                        </div>
                      )}
                      <div>
                        <label className="btn btn-secondary" style={{ cursor: 'pointer', fontSize: '12px' }}>
                          Upload Logo
                          <input 
                            type="file" 
                            style={{ display: 'none' }} 
                            accept="image/*"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const url = await context.handleFileUpload(e.target.files[0]);
                                if (url) {
                                  context.handleUpdateSettings({ logoUrl: url });
                                }
                              }
                            }} 
                          />
                        </label>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Recommended size: 256x256px (PNG/JPG)</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-field">
                        <label className="form-label">Legal Entity Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={settings.name}
                          onChange={(e) => handleUpdateSettings({ name: e.target.value })}
                        />
                      </div>

                      <div className="form-field">
                        <label className="form-label">Billing Support Email</label>
                        <input
                          type="text"
                          className="form-input"
                          value={settings.email}
                          onChange={(e) => handleUpdateSettings({ email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-field">
                        <label className="form-label">Website Domain</label>
                        <input
                          type="text"
                          className="form-input"
                          value={settings.website}
                          onChange={(e) => handleUpdateSettings({ website: e.target.value })}
                        />
                      </div>

                      <div className="form-field">
                        <label className="form-label">Corporate Hotline</label>
                        <input
                          type="text"
                          className="form-input"
                          value={settings.phone}
                          onChange={(e) => handleUpdateSettings({ phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>GSTIN Registration details</h4>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Enable automated GST tax itemization for Indian B2B invoicing.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settings.gstinEnabled} 
                        onChange={(e)=>handleUpdateSettings({ gstinEnabled: e.target.checked })} 
                        style={{ width: '16px', height: '16px', accentColor: 'var(--accent-indigo)' }}
                      />
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-view: Billing & Plans */}
              {subTab === 'billing-plans' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <Card style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>SaaS Subscriptions</h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Manage your active billing cycle and feature access tiers.</p>
                      </div>
                      <Button variant="ghost" onClick={async () => {
                        try {
                          const res = await fetch('/api/billing/stripe/portal', {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${context.token}` }
                          });
                          const data = await res.json();
                          if (data.url) window.location.href = data.url;
                        } catch (err) {
                          console.error('Failed to open billing portal');
                        }
                      }}>
                        Manage Billing Portal
                      </Button>
                    </div>

                    <div className="pricing-grid">
                      {['Free', 'Pro', 'Enterprise'].map(tier => (
                        <Card key={tier} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', border: tier === 'Pro' ? '2px solid var(--accent-indigo)' : '' }}>
                          <h4 style={{ fontSize: '16px', fontWeight: '700' }}>{tier}</h4>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{tier === 'Free' ? 'Basic CRM features' : tier === 'Pro' ? 'Advanced AI & Reporting' : 'Unlimited Everything'}</p>
                          <h2 style={{ fontSize: '32px', fontWeight: '800' }}>{tier === 'Free' ? '$0' : tier === 'Pro' ? '$49' : '$199'}<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/mo</span></h2>
                          
                          <Button 
                            variant={tier === 'Pro' ? 'primary' : 'ghost'} 
                            style={{ width: '100%', marginTop: 'auto' }}
                            onClick={async () => {
                              try {
                                const priceMap: Record<string, string> = { 'Pro': 'price_pro', 'Enterprise': 'price_ent' };
                                if (tier === 'Free') return;
                                const res = await fetch('/api/billing/stripe/checkout', {
                                  method: 'POST',
                                  headers: { 
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${context.token}` 
                                  },
                                  body: JSON.stringify({ planName: tier, interval: 'Monthly', priceId: priceMap[tier] })
                                });
                                const data = await res.json();
                                if (data.url) window.location.href = data.url;
                              } catch (err) {
                                console.error('Failed to start checkout');
                              }
                            }}
                          >
                            Upgrade to {tier}
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-view: WhatsApp AI Auto-reply */}
              {subTab === 'whatsapp-ai-auto-reply' && (
                <Card style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>WhatsApp AI Auto-reply Engine</h3>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Train model using active guide documentation to resolve client inquiries automatically.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.whatsappAutoReplyEnabled}
                      onChange={(e) => handleUpdateSettings({ whatsappAutoReplyEnabled: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--accent-indigo)' }}
                    />
                  </div>
                  <div className="knowledge-base-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Knowledge Base Completeness</span>
                      <span style={{ fontWeight: '800', color: 'var(--accent-indigo)' }}>88% Ready</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' }}>
                      <div style={{ width: '88%', height: '100%', background: 'var(--accent-indigo)' }}></div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Sub-view: Developer APIs */}
              {subTab === 'developer-apis' && (
                <Card style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    Developer APIs & Credentials
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="form-field">
                      <label className="form-label">Secure Webhook Callback URL</label>
                      <input 
                        type="text" 
                        readOnly 
                        className="form-input" 
                        value="https://api.vgrow.com/v1/webhooks/whatsapp" 
                        style={{ background: 'rgba(255,255,255,0.02)', fontFamily: 'monospace', fontSize: '11px' }}
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Client Access Token (Bearer)</label>
                      <input 
                        type="password" 
                        readOnly 
                        className="form-input" 
                        value="vgrow_live_sk_781190226cdae34746b4dedf0b4dfa0" 
                        style={{ background: 'rgba(255,255,255,0.02)', fontFamily: 'monospace', fontSize: '11px' }}
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* Sub-view: All Integrations */}
              {subTab === 'all-integrations' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <Card style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px' }}>
                      <Globe className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '13px' }}>JustDial Integration Gateway</h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Capture leads automatically from local search email notifications.</p>
                    </div>
                    <Button variant="primary">Enable Gateway</Button>
                  </Card>

                  <Card style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px' }}>
                      <Globe className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '13px' }}>Sulekha Partner API Connection</h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Synchronize premium local search leads to dashboard queue instantly.</p>
                    </div>
                    <Button variant="primary">Connect Partner</Button>
                  </Card>
                </div>
              )}

              {/* Sub-view: Field Operations */}
              {subTab === 'field-operations' && (
                <Card style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>GPS Field Visit Tracking</h3>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Monitor location metrics and check-in timelines for out-of-office sales activities.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.fieldVisitTrackingEnabled}
                      onChange={(e) => handleUpdateSettings({ fieldVisitTrackingEnabled: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--accent-indigo)' }}
                    />
                  </div>
                </Card>
              )}

              {/* Other fallbacks */}
              {subTab !== 'company' && subTab !== 'whatsapp-ai-auto-reply' && subTab !== 'developer-apis' && subTab !== 'all-integrations' && subTab !== 'field-operations' && (
                <Card style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Settings sub-module configurator. Details are saved securely.
                </Card>
              )}

            </div>
          </div>

        </div>
      )}
    </>
  );
}
