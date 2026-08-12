import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CreditCard, ShieldCheck, CheckCircle2, AlertCircle, Search, Landmark } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';

export default function PaymentsPage() {
  const { activeTab, authFetch, API_BASE } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  const fetchSubscriptions = async () => {
    try {
      const res = await authFetch(`${API_BASE}/payments/subscriptions`);
      setSubscriptions(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await authFetch(`${API_BASE}/payments/links`);
      setPayments(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'payments') {
      fetchSubscriptions();
      fetchPayments();
    }
  }, [activeTab]);

  const handleSubscribe = async (planName: string, interval: string, amount: number) => {
    try {
      await authFetch(`${API_BASE}/payments/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName, interval, amount })
      });
      fetchSubscriptions();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelSub = async (id: any) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;
    try {
      await authFetch(`${API_BASE}/payments/subscriptions/${id}/cancel`, { method: 'POST' });
      fetchSubscriptions();
    } catch (e) {
      console.error(e);
    }
  };

  const settledTotal = payments.filter((p: any) => p.status === 'paid').reduce((acc: number, p: any) => acc + parseFloat(p.amount || 0), 0);

  const filteredPayments = payments.filter((pay: any) =>
    (pay.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pay.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {activeTab === 'payments' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Landmark className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                Payments & Razorpay Settlements
              </h2>
              <p className="page-desc">Reconcile B2B client invoices, monitor UPI transaction success rates, and manage settlements.</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', flexShrink: 0 }}>
            <Card padding="16px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Settled via UPI/Razorpay</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px', color: 'var(--accent-emerald)' }}>₹{settledTotal.toLocaleString('en-IN')}</h4>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-80" />
            </Card>
            <Card padding="16px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Active Gateways</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>2 Enabled</h4>
              </div>
              <CreditCard className="w-8 h-8 text-indigo-400 opacity-80" />
            </Card>
          </div>

          <Card padding="20px" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ width: '320px' }}>
                <Input 
                  leftIcon={<Search className="w-3 h-3" />}
                  placeholder="Search payments by Client or Txn ID..." 
                  style={{ fontSize: '12px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure 256-bit SSL Gateway
              </span>
            </div>

            <Table>
              <TableHead>
                <TableHeader>Transaction ID</TableHeader>
                <TableHeader>Client</TableHeader>
                <TableHeader>Settle Amount</TableHeader>
                <TableHeader>Channel</TableHeader>
                <TableHeader>Gateway Status</TableHeader>
                <TableHeader>Date</TableHeader>
              </TableHead>
              <TableBody>
                {filteredPayments.map((pay: any) => (
                  <TableRow key={pay.id}>
                    <TableCell style={{ color: 'var(--text-primary)', fontWeight: '800' }}>{pay.id}</TableCell>
                    <TableCell>{pay.client}</TableCell>
                    <TableCell style={{ fontWeight: '800' }}>₹{parseFloat(String(pay.amount)).toLocaleString('en-IN')}</TableCell>
                    <TableCell>{pay.method}</TableCell>
                    <TableCell>
                      <Badge variant={pay.status === 'Success' ? 'emerald' : 'rose'} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {pay.status === 'Success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {pay.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(pay.date).toLocaleDateString('en-IN')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* SaaS Subscription Plans & Control */}
          <Card padding="24px" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>SaaS Subscription Plans</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {[
                { name: 'Growth Plan', price: 2999, desc: 'Ideal for small sales teams' },
                { name: 'Enterprise Plan', price: 9999, desc: 'Complete access to AI Copilots' }
              ].map(plan => {
                const activeSub = subscriptions.find((s: any) => s.planName === plan.name && s.status === 'Active');
                return (
                  <div key={plan.name} style={{ background: 'rgba(255,255,255,0.01)', border: activeSub ? '2px solid var(--accent-indigo)' : '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                    <div>
                      <h4 style={{ fontWeight: '800', fontSize: '16px' }}>{plan.name}</h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{plan.desc}</p>
                      <h5 style={{ fontSize: '28px', fontWeight: '800', marginTop: '12px', color: 'var(--text-primary)' }}>₹{plan.price.toLocaleString('en-IN')}<span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/mo</span></h5>
                    </div>
                    {activeSub ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Badge variant="emerald" style={{ textAlign: 'center', display: 'block' }}>Active Sub</Badge>
                        <Button variant="secondary" size="sm" onClick={() => handleCancelSub(activeSub.id)} style={{ color: 'var(--accent-rose)' }}>Cancel</Button>
                      </div>
                    ) : (
                      <Button variant="primary" onClick={() => handleSubscribe(plan.name, 'Monthly', plan.price)} style={{ width: '100%' }}>Activate Tier</Button>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

        </div>
      )}
    </>
  );
}
