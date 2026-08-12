import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, Search } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';

export default function QuotesPage() {
  const context = useAppContext();
  const {
      activeTab, showNewQuoteEditor, setShowNewQuoteEditor, quotes, handleAddQuote
  } = context;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Draft');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;
    
    // Call standard handleAddQuote context helper
    await handleAddQuote({ title, amount: parseFloat(amount), status });
    setTitle('');
    setAmount('');
    setStatus('Draft');
    setShowNewQuoteEditor(false);
  };

  const filteredQuotes = quotes.filter((q: any) => 
    (q.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {activeTab === 'quotes' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                Sales Quotes & Estimates
              </h2>
              <p className="page-desc">Create custom pricing quotes, download estimates, and track approvals.</p>
            </div>
            {!showNewQuoteEditor && (
              <Button variant="primary" onClick={() => setShowNewQuoteEditor(true)}>+ Create Quote</Button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', flexShrink: 0 }}>
            <Card padding="16px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Total Quotes Value</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>
                  ₹{quotes.reduce((acc: number, q: any) => acc + parseFloat(q.amount || 0), 0).toLocaleString('en-IN')}
                </h4>
              </div>
              <FileText className="w-8 h-8 text-indigo-400 opacity-80" />
            </Card>
          </div>

          {showNewQuoteEditor ? (
            <Card padding="24px" style={{ maxWidth: '600px' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  New Sales Estimate / Quote
                </h3>
                
                <Input 
                  label="Estimate / Quote Title *" 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. VGrow CRM 50 Premium License Estimate" 
                  required
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Input 
                    label="Estimate Amount (₹) *" 
                    type="number" 
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 150000.00" 
                    required
                  />

                  <div className="form-field">
                    <label className="form-label">Quote Status</label>
                    <select 
                      className="form-input" 
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <Button type="submit" variant="primary">Save Quote</Button>
                  <Button type="button" variant="secondary" onClick={() => setShowNewQuoteEditor(false)}>Cancel</Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card padding="20px" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Sales Estimates Register</h3>
                <div style={{ width: '240px' }}>
                  <Input 
                    leftIcon={<Search className="w-3 h-3" />}
                    type="text" 
                    placeholder="Search quotes..." 
                    style={{ fontSize: '12px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredQuotes.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableHeader>Title Description</TableHeader>
                    <TableHeader>Est. Value (₹)</TableHeader>
                    <TableHeader>Status State</TableHeader>
                    <TableHeader>Date</TableHeader>
                  </TableHead>
                  <TableBody>
                    {filteredQuotes.map((q: any) => (
                      <TableRow key={q.id}>
                        <TableCell style={{ fontWeight: '700' }}>{q.title}</TableCell>
                        <TableCell style={{ fontWeight: '800' }}>₹{parseFloat(q.amount).toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                          <Badge variant={
                            q.status === 'Accepted' ? 'emerald' : 
                            q.status === 'Rejected' ? 'rose' : 
                            q.status === 'Sent' ? 'indigo' : 'default'
                          }>
                            {q.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{q.date ? new Date(q.date).toLocaleDateString('en-IN') : 'Just now'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No quotes generated yet.</div>
              )}
            </Card>
          )}
        </div>
      )}
    </>
  );
}
