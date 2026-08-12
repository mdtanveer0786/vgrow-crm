import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Copy, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export default function PaymentLinksPage() {
  const { activeTab, authFetch, API_BASE } = useAppContext();
  const [links, setLinks] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<any>(null);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  const fetchLinks = async () => {
    try {
      const res = await authFetch(`${API_BASE}/payments/links`);
      setLinks(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'payment-links') {
      fetchLinks();
    }
  }, [activeTab]);

  const handleCancelLink = async (id: any) => {
    if (!confirm('Are you sure you want to cancel this payment link?')) return;
    try {
      await authFetch(`${API_BASE}/payments/links/${id}/cancel`, { method: 'POST' });
      fetchLinks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !amount) return;

    try {
      const amtVal = parseFloat(amount);
      const baseAmount = amtVal / 1.18;
      const gstAmount = amtVal - baseAmount;

      await authFetch(`${API_BASE}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: desc,
          amount: amtVal,
          dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
          gstType: 'CGST_SGST',
          gstRate: 18,
          baseAmount: Number(baseAmount.toFixed(2)),
          gstAmount: Number(gstAmount.toFixed(2))
        })
      });

      setDesc('');
      setAmount('');
      fetchLinks();
    } catch (err) {
      console.error('Failed to create payment link:', err);
      alert('Failed to generate secure payment link. Please try again.');
    }
  };

  const handleCopyLink = (lnk: any) => {
    navigator.clipboard.writeText(lnk.url).catch(() => {});
    setCopiedId(lnk.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {activeTab === 'payment-links' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="page-header">
            <div>
              <h2 className="page-title">Payment Links</h2>
              <p className="page-desc">Generate single-click checkout links to collect customer payments instantly.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            
            {/* Info Panel explaining how to generate links & Quick Generator */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Card padding="20px" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '800' }}>Payment Links System</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Payment links are dynamically generated directly from unpaid GST invoices. 
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  To create a new payment link, head over to the **Invoices** module, click **Pay Invoice** on any open item, and VGrow will construct a secure checkout path.
                </p>
              </Card>

              <Card padding="20px">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '800' }}>Quick Link Generator</h3>
                  <Input 
                    label="Customer Name / Description" 
                    type="text" 
                    placeholder="e.g. Acme Corporation" 
                    value={desc} 
                    onChange={e => setDesc(e.target.value)} 
                    required 
                    style={{ fontSize: '12px' }} 
                  />
                  <Input 
                    label="Billing Amount (INR)" 
                    type="number" 
                    placeholder="e.g. 5000" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    required 
                    style={{ fontSize: '12px' }} 
                  />
                  <Button type="submit" variant="primary" style={{ width: '100%', fontSize: '12px' }}>
                    Generate Secure Link
                  </Button>
                </form>
              </Card>
            </div>

            {/* Right Column Links Listing */}
            <Card padding="20px" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '800' }}>Active Checkout Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {links.map((lnk: any) => (
                  <Card key={lnk.id} padding="12px" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>{lnk.clientName}</h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Value: <strong>₹{lnk.amount.toLocaleString('en-IN')}</strong> &bull; Status: <Badge variant={lnk.status === 'Paid' ? 'emerald' : (lnk.status === 'Expired' ? 'rose' : 'amber')}>{lnk.status}</Badge>
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Button 
                        type="button"
                        onClick={() => handleCopyLink(lnk)} 
                        variant="secondary"
                        size="sm"
                        style={{ padding: '8px', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Copy Checkout Link"
                      >
                        {copiedId === lnk.id ? <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-emerald)' }} /> : <Copy className="w-4 h-4" />}
                      </Button>
                      {lnk.status === 'Active' && (
                        <Button 
                          type="button"
                          onClick={() => handleCancelLink(lnk.id)} 
                          variant="secondary"
                          size="sm"
                          style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.2)' }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
                {links.length === 0 && (
                  <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '24px 0' }}>
                    No checkout links generated.
                  </div>
                )}
              </div>
            </Card>

          </div>

        </div>
      )}
    </>
  );
}
