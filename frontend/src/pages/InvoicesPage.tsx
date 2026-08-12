import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, Clock, Landmark } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';

export default function InvoicesPage() {
  const context = useAppContext();
  const {
      activeTab, invoices, handleAddInvoice, authFetch, API_BASE
  } = context;

  const [showForm, setShowForm] = useState(false);
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Unpaid');
  const [dueDate, setDueDate] = useState('');

  // GST configurations for Indian market
  const [gstType, setGstType] = useState('CGST_SGST'); // CGST_SGST (Intra-state) or IGST (Inter-state)
  const [gstRate, setGstRate] = useState(18); // Default 18% GST

  const baseAmount = parseFloat(amount || '0');
  
  // Real calculation backend simulation / matching formula
  const gstAmount = (baseAmount * gstRate) / 100;
  const totalAmount = baseAmount + gstAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.trim() || !amount || !dueDate) return;
    
    // Call the context helper which fires to POST /api/invoices
    await handleAddInvoice({ 
      client, 
      amount: totalAmount, 
      status, 
      dueDate,
      metadata: {
        baseAmount,
        gstRate,
        gstType,
        gstAmount
      }
    });

    setClient('');
    setAmount('');
    setStatus('Unpaid');
    setDueDate('');
    setShowForm(false);
  };

  return (
    <>
      {activeTab === 'invoices' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                GST Invoices & Billing
              </h2>
              <p className="page-desc">Track and generate compliant GST invoices with automatic CGST, SGST, and IGST breakdowns.</p>
            </div>
            {!showForm && (
              <Button variant="primary" onClick={() => setShowForm(true)}>+ Create Invoice</Button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', flexShrink: 0 }}>
            <Card padding="16px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Total Billed (with GST)</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>
                  ₹{invoices.reduce((acc: number, inv: any) => acc + parseFloat(inv.amount || 0), 0).toLocaleString('en-IN')}
                </h4>
              </div>
              <Landmark className="w-8 h-8 text-emerald-400 opacity-80" />
            </Card>
            <Card padding="16px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Outstanding Payments</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px', color: 'var(--accent-amber)' }}>
                  ₹{invoices.filter((i: any) => i.status !== 'Paid').reduce((acc: number, inv: any) => acc + parseFloat(inv.amount || 0), 0).toLocaleString('en-IN')}
                </h4>
              </div>
              <Clock className="w-8 h-8 text-amber-400 opacity-80" />
            </Card>
          </div>

          {showForm ? (
            <Card padding="24px" style={{ maxWidth: '600px' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  New GST Invoice
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Input 
                    label="Client / Company Name *" 
                    type="text" 
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="e.g. Nexus Tech Private Limited" 
                    required
                  />

                  <Input 
                    label="Base Taxable Amount (₹) *" 
                    type="number" 
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 100000.00" 
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-field">
                    <label className="form-label">GST Tax Model</label>
                    <select 
                      className="form-input" 
                      value={gstType}
                      onChange={(e) => setGstType(e.target.value)}
                    >
                      <option value="CGST_SGST">Intra-State (CGST + SGST)</option>
                      <option value="IGST">Inter-State (IGST)</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="form-label">GST Slab Rate (%)</label>
                    <select 
                      className="form-input" 
                      value={gstRate}
                      onChange={(e) => setGstRate(parseInt(e.target.value))}
                    >
                      <option value="0">0% (Exempted)</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18% (Standard Services)</option>
                      <option value="28">28%</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Input 
                    label="Invoice Due Date *" 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />

                  <div className="form-field">
                    <label className="form-label">Billing Status</label>
                    <select 
                      className="form-input" 
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Unpaid">Unpaid / Draft</option>
                      <option value="Paid">Paid / Settled</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </div>

                {/* Live GST Calculations preview panel */}
                <div style={{ background: 'rgba(21, 107, 244, 0.04)', border: '1px dashed var(--accent-indigo)', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>Live Tax Summary Preview</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span>Taxable Base Value:</span>
                    <span style={{ fontWeight: '700' }}>₹{baseAmount.toLocaleString('en-IN')}</span>
                  </div>
                  {gstType === 'CGST_SGST' ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span>CGST ({(gstRate / 2)}%):</span>
                        <span>₹{(gstAmount / 2).toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span>SGST ({(gstRate / 2)}%):</span>
                        <span>₹{(gstAmount / 2).toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span>IGST ({gstRate}%):</span>
                      <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div style={{ borderTop: '1px solid var(--border-color)', margin: '4px 0', padding: '4px 0', display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '800', color: 'var(--accent-indigo)' }}>
                    <span>Total Amount (Incl. Taxes):</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <Button type="submit" variant="primary">Save Invoice</Button>
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card padding="20px">
              {invoices.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableHeader>Invoice Target</TableHeader>
                    <TableHeader>Gross Amount (₹)</TableHeader>
                    <TableHeader>Tax Model Summary</TableHeader>
                    <TableHeader>Due Date</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader style={{ width: '180px', textAlign: 'center' }}>Payment Actions</TableHeader>
                  </TableHead>
                  <TableBody>
                    {invoices.map((inv: any) => {
                      const meta = inv.metadata || {};
                      return (
                        <TableRow key={inv.id}>
                          <TableCell style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{inv.client}</TableCell>
                          <TableCell style={{ fontWeight: '800' }}>₹{parseFloat(inv.amount || 0).toLocaleString('en-IN')}</TableCell>
                          <TableCell>
                            {meta.gstRate ? `${meta.gstRate}% ${meta.gstType === 'IGST' ? 'IGST' : 'CGST+SGST'}` : '18% GST (Standard)'}
                          </TableCell>
                          <TableCell>{inv.dueDate}</TableCell>
                          <TableCell>
                            <Badge variant={
                              inv.status === 'Paid' ? 'emerald' : 
                              inv.status === 'Overdue' ? 'rose' : 'amber'
                            }>
                              {inv.status}
                            </Badge>
                          </TableCell>
                          <TableCell style={{ textAlign: 'center' }}>
                            {inv.status !== 'Paid' ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    const res = await authFetch(`${API_BASE}/invoices/${inv.id}/payment-link`, {
                                      method: 'POST'
                                    });
                                    const data = await res.json();
                                    if (data.paymentLink) {
                                      window.open(data.paymentLink, '_blank');
                                    }
                                  } catch (e) {
                                    console.error('Failed to create payment link', e);
                                  }
                                }}
                              >
                                Pay Invoice
                              </Button>
                            ) : (
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Settled</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0' }}>
                  No invoices generated yet. Click "+ Create Invoice" to generate one.
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </>
  );
}
