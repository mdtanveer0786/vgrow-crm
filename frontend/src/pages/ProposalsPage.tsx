import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, Search, PenTool } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import SignatureCanvas from 'react-signature-canvas';

export default function ProposalsPage() {
  const context = useAppContext();
  const {
      activeTab, showNewProposalModal, setShowNewProposalModal, proposals, handleAddProposal,
      API_BASE, authFetch, fetchProposals
  } = context;

  const [title, setTitle] = useState('');
  const [leadName, setLeadName] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('Draft');
  const [searchTerm, setSearchTerm] = useState('');

  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedProposalForSign, setSelectedProposalForSign] = useState<any>(null);
  const sigCanvas = useRef<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !value) return;
    
    // Call standard handleAddProposal context helper
    await handleAddProposal({ title, amount: parseFloat(value), status });
    setTitle('');
    setLeadName('');
    setValue('');
    setStatus('Draft');
    setShowNewProposalModal(false);
  };

  const handleSignClick = (proposal: any) => {
    setSelectedProposalForSign(proposal);
    setShowSignModal(true);
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const submitSignature = async () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }
    
    const signatureBase64 = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    
    try {
      const res = await authFetch(`${API_BASE}/proposals/${selectedProposalForSign.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureBase64,
          ipAddress: '192.168.1.1', // Mocked IP as requested
          userAgent: navigator.userAgent
        })
      });
      
      if (res.ok) {
         setShowSignModal(false);
         alert('Proposal signed successfully!');
         if (fetchProposals) fetchProposals();
      } else {
         alert('Failed to sign proposal.');
      }
    } catch (error) {
      console.error(error);
      alert('Error signing proposal.');
    }
  };

  const filteredProposals = proposals.filter((p: any) => 
    (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.leadName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {activeTab === 'proposals' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                AI Proposal Builder & Contracts
              </h2>
              <p className="page-desc">Generate commercial proposals automatically using templates and track client review status.</p>
            </div>
            {!showNewProposalModal && (
              <Button variant="primary" onClick={() => setShowNewProposalModal(true)}>+ New Proposal</Button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', flexShrink: 0 }}>
            <Card padding="16px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Pending Proposals Value</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>
                  ₹{proposals.reduce((acc: number, p: any) => acc + parseFloat(p.amount || 0), 0).toLocaleString('en-IN')}
                </h4>
              </div>
              <FileText className="w-8 h-8 text-indigo-400 opacity-80" />
            </Card>
          </div>

          {showNewProposalModal ? (
            <Card padding="24px" style={{ maxWidth: '600px' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  New Sales Proposal
                </h3>
                
                <Input 
                  label="Proposal Title *" 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Premium Support Contract - Year 2026" 
                  required
                />

                <Input 
                  label="Lead / Company Name" 
                  type="text" 
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Pankaj Kumar"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Input 
                    label="Contract Value (₹) *" 
                    type="number" 
                    step="0.01"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="e.g. 500000.00" 
                    required
                  />

                  <div className="form-field">
                    <label className="form-label">Workflow Status</label>
                    <select 
                      className="form-input" 
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <Button type="submit" variant="primary">Save Proposal</Button>
                  <Button type="button" variant="secondary" onClick={() => setShowNewProposalModal(false)}>Cancel</Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card padding="20px" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Sales Proposals Register</h3>
                <div style={{ width: '240px' }}>
                  <Input 
                    leftIcon={<Search className="w-3 h-3" />}
                    type="text" 
                    placeholder="Search proposals..." 
                    style={{ fontSize: '12px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredProposals.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableHeader>Proposal Title</TableHeader>
                    <TableHeader>Lead Partner</TableHeader>
                    <TableHeader>Contract Value (₹)</TableHeader>
                    <TableHeader>Status State</TableHeader>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableHead>
                  <TableBody>
                    {filteredProposals.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell style={{ fontWeight: '700' }}>{p.title}</TableCell>
                        <TableCell>{p.leadName || 'N/A'}</TableCell>
                        <TableCell style={{ fontWeight: '800' }}>₹{parseFloat(p.amount || 0).toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                          <Badge variant={
                            p.status === 'Accepted' || p.status === 'Signed' ? 'emerald' : 
                            p.status === 'Rejected' ? 'rose' : 
                            p.status === 'Pending Review' ? 'amber' : 'default'
                          }>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : (p.date ? new Date(p.date).toLocaleDateString('en-IN') : 'Just now')}</TableCell>
                        <TableCell>
                          {p.status !== 'Signed' && (
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              onClick={() => handleSignClick(p)}
                              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <PenTool className="w-3 h-3" /> Sign
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No proposals generated yet.</div>
              )}
            </Card>
          )}

          {/* Signature Modal */}
          {showSignModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Card padding="24px" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-primary)' }}>
                  Sign Proposal: {selectedProposalForSign?.title}
                </h3>
                
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px', backgroundColor: '#fff' }}>
                  <SignatureCanvas 
                    ref={sigCanvas} 
                    penColor="black"
                    canvasProps={{ width: 450, height: 200, className: 'sigCanvas' }} 
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="secondary" onClick={clearSignature}>Clear Signature</Button>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="secondary" onClick={() => setShowSignModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={submitSignature}>Submit Signature</Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

        </div>
      )}
    </>
  );
}
