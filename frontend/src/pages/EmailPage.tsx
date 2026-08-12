import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  Mail, Send, Sparkles, Search, Plus, Eye, CheckCircle2,
  AlertCircle, Edit, Trash2, ArrowRight, Layout, Info
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';

export default function EmailPage() {
  const context = useAppContext();
  const { activeTab } = context;

  const [searchQuery, setSearchQuery] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('Marketing');
  const [showToast, setShowToast] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  
  const { authFetch, API_BASE } = useAppContext();

  // Email Templates (dynamic, user-generated)
  const [templates, setTemplates] = useState([]);

  const [campaigns, setCampaigns] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const fetchCampaigns = async () => {
    setLoadingList(true);
    try {
      const res = await authFetch(`${API_BASE}/campaigns`);
      setCampaigns(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingList(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'email') {
      fetchCampaigns();
    }
  }, [activeTab]);

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    try {
      await authFetch(`${API_BASE}/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: subject.substring(0, 30) + '...',
          subject,
          category
        })
      });
      setSubject('');
      setBody('');
      setShowEditor(false);
      setShowToast(true);
      fetchCampaigns();
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {activeTab === 'email' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                HelloMail Workspace
              </h2>
              <p className="page-desc">Design premium sales email campaigns, manage layouts, and monitor delivery analytics.</p>
            </div>
            {!showEditor && (
              <Button variant="primary" onClick={() => setShowEditor(true)}>+ Create Template</Button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', flexShrink: 0 }}>
            <Card padding="16px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Avg Open Rate</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px', color: 'var(--accent-emerald)' }}>75.2%</h4>
              </div>
              <Eye className="w-8 h-8 text-emerald-400 opacity-80" />
            </Card>
            <Card padding="16px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Active Delivery Templates</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>{campaigns.length}</h4>
              </div>
              <Layout className="w-8 h-8 text-indigo-400 opacity-80" />
            </Card>
          </div>

          {showEditor ? (
            <Card padding="24px" style={{ maxWidth: '700px' }}>
              <form onSubmit={handleCreateTemplate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  Create Delivery Template
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-field">
                    <label className="form-label">Email Subject Header *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Schedule your onboarding call"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Category Group</label>
                    <select
                      className="form-input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Sales">Sales Campaign</option>
                      <option value="Marketing">Marketing Outreach</option>
                      <option value="Finance">Billing & Invoicing</option>
                      <option value="Product">Product Updates</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Email Body (HTML/Text) *</span>
                    <span 
                      onClick={async () => {
                        if (!subject) {
                          alert('Please fill in the subject first to give the AI context!');
                          return;
                        }
                        setLoadingAi(true);
                        try {
                          const res = await authFetch(`${API_BASE}/ai/draft-reply`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              leadName: 'Client',
                              lastMessage: subject,
                              tone: 'Professional'
                            })
                          });
                          const data = await res.json();
                          setBody(data.draft || '');
                        } catch (err) {
                          console.error('Failed to generate draft', err);
                        } finally {
                          setLoadingAi(false);
                        }
                      }}
                      style={{ fontSize: '10px', color: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> 
                      {loadingAi ? 'Drafting...' : 'Auto-suggest via AI Copilot'}
                    </span>
                  </label>
                  <textarea
                    className="form-input"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={loadingAi ? 'AI is drafting your email template...' : 'Type email body content here...'}
                    style={{ minHeight: '180px', fontFamily: 'sans-serif', resize: 'vertical' }}
                    required
                    disabled={loadingAi}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="primary" type="submit">Save Campaign Template</Button>
                  <Button variant="secondary" type="button" onClick={() => setShowEditor(false)}>Cancel</Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card padding="20px" style={{ overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Saved Templates & Performance</h3>
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search style={{ position: 'absolute', left: '8px', top: '8px', width: '12px', height: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    className="form-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '26px', fontSize: '11px', height: '28px' }}
                  />
                </div>
              </div>

              <Table style={{ width: '100%', minWidth: '600px' }}>
                <TableHead>
                  <TableRow>
                    <TableHeader>Template Name</TableHeader>
                    <TableHeader>Email Subject</TableHeader>
                    <TableHeader>Category</TableHeader>
                    <TableHeader>Open Rate</TableHeader>
                    <TableHeader>Click Rate</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {campaigns.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).map(camp => (
                    <TableRow key={camp.id}>
                      <TableCell><span style={{ fontWeight: '700' }}>{camp.name}</span></TableCell>
                      <TableCell><span style={{ color: 'var(--text-secondary)' }}>{camp.subject}</span></TableCell>
                      <TableCell>
                        <Badge variant="indigo">{camp.category}</Badge>
                      </TableCell>
                      <TableCell><span style={{ fontWeight: '700', color: 'var(--accent-emerald)' }}>{camp.opens}</span></TableCell>
                      <TableCell><span style={{ fontWeight: '700', color: 'var(--accent-indigo)' }}>{camp.clicks}</span></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {campaigns.length === 0 && !loadingList && (
                <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '24px 0' }}>
                  No campaigns active. Click "+ Create Template" to launch one!
                </div>
              )}
            </Card>
          )}

          {/* Toast Notification */}
          {showToast && (
            <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--accent-emerald)', color: 'white', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1000 }}>
              <CheckCircle2 className="w-5 h-5" />
              <span style={{ fontSize: '12px', fontWeight: '800' }}>Template Saved Successfully!</span>
            </div>
          )}

        </div>
      )}
    </>
  );
}
