import React from 'react';
import { Card, Button } from '../components/ui';
import { useAppContext } from '../context/AppContext';
import { Download, Layers, TrendingUp, CheckCircle, BarChart2, PieChart, Users, Sparkles, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const context = useAppContext();
  const { activeTab, leads, handleExportCSV, handleExportPDF, API_BASE, authFetch } = context;
  const [forecast, setForecast] = React.useState('');
  const [loadingForecast, setLoadingForecast] = React.useState(false);

  const [dashboardData, setDashboardData] = React.useState<any>(null);

  React.useEffect(() => {
    if (activeTab === 'analytics' && !forecast) {
      setLoadingForecast(true);
      authFetch(`${API_BASE}/analytics/ai-forecast`)
        .then(res => res.json())
        .then(data => setForecast(data.forecast || ''))
        .catch(err => console.error('Failed to get forecast', err))
        .finally(() => setLoadingForecast(false));
        
      authFetch(`${API_BASE}/dashboard`)
        .then(res => res.json())
        .then(data => setDashboardData(data))
        .catch(err => console.error('Failed to fetch dashboard', err));
    }
  }, [activeTab]);

  // Helper calculation for leads by status
  const totalLeads = leads.length || 1;
  const statusCounts = {
    New: leads.filter(l => l.status === 'New').length,
    Contacted: leads.filter(l => l.status === 'Contacted').length,
    Qualified: leads.filter(l => l.status === 'Qualified').length,
    Converted: leads.filter(l => l.status === 'Converted').length,
  };

  // Helper calculation for leads by temperature (calculate via score)
  const tempCounts = {
    Hot: leads.filter(l => l.score >= 80).length,
    Warm: leads.filter(l => l.score >= 50 && l.score < 80).length,
    Cold: leads.filter(l => l.score < 50).length,
  };

  // Calculate dynamic percentages
  const getPercentage = (count) => {
    return Math.round((count / totalLeads) * 100);
  };

  return (
    <>
      {activeTab === 'analytics' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                Interactive CRM Analytics
              </h2>
              <p className="page-desc">Real-time performance metrics and pipeline insights synced with MySQL database.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button 
                variant="secondary"
                onClick={() => handleExportCSV(leads, 'leads_analytics.csv')}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Export CSV
              </Button>
              <Button 
                variant="primary"
                onClick={() => context.handleExportPDF('vGrow CRM Analytics Report', leads, 'leads_report.pdf')}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download PDF
              </Button>
            </div>
          </div>

          {/* Core Stat Highlights Grid */}
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <Card style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-indigo)', borderRadius: '10px' }}><Users className="w-6 h-6" /></div>
              <div>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Active Leads</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px', color: 'var(--text-primary)' }}>{leads.length}</h4>
              </div>
            </Card>

            <Card style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-emerald)', borderRadius: '10px' }}><CheckCircle className="w-6 h-6" /></div>
              <div>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Converted Deals</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px', color: 'var(--text-primary)' }}>{statusCounts.Converted}</h4>
              </div>
            </Card>

            <Card style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(245,158,11,0.1)', color: 'var(--accent-amber)', borderRadius: '10px' }}><TrendingUp className="w-6 h-6" /></div>
              <div>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Conversion Rate (Deals)</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px', color: 'var(--text-primary)' }}>{dashboardData?.advanced?.conversionRate?.toFixed(1) || 0}%</h4>
              </div>
            </Card>

            <Card style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-rose)', borderRadius: '10px' }}><DollarSign className="w-6 h-6" /></div>
              <div>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Pipeline Velocity (MRR)</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px', color: 'var(--text-primary)' }}>${dashboardData?.advanced?.mrr?.toLocaleString() || 0}</h4>
              </div>
            </Card>
          </div>

          {/* AI Revenue Forecast Card */}
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-amber)' }} />
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>AI-Driven Revenue Forecast & Recommendations</h3>
            </div>
            {loadingForecast ? (
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>AI is modeling deal stages and predicting target revenue...</p>
            ) : forecast ? (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                {forecast}
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>No forecast data generated. Try adding some deals to your pipeline.</p>
            )}
          </Card>

          {/* Dynamic Interactive Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* Lead Funnel Chart Card */}
            <Card style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 className="w-4 h-4" style={{ color: 'var(--accent-indigo)' }} />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>Pipeline Funnel Breakdown</h3>
              </div>
              
              <div style={{ width: '100%', height: '250px', marginTop: '8px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(statusCounts).map(([name, value]) => ({ name, value }))}>
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', color: 'var(--text-primary)' }} />
                    <Bar dataKey="value" fill="var(--accent-indigo)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Leads Temperature Intensity Card */}
            <Card style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieChart className="w-4 h-4" style={{ color: 'var(--accent-purple)' }} />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>Prospect Temperature Distribution</h3>
              </div>

              <div style={{ width: '100%', height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={Object.entries(tempCounts).map(([name, value]) => ({ name, value }))}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell key="cell-0" fill="var(--accent-rose)" />
                      <Cell key="cell-1" fill="var(--accent-amber)" />
                      <Cell key="cell-2" fill="var(--accent-blue)" />
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', color: 'var(--text-primary)' }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Leads by Source Card */}
            <Card style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieChart className="w-4 h-4" style={{ color: 'var(--accent-emerald)' }} />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>Leads by Source</h3>
              </div>

              <div style={{ width: '100%', height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={dashboardData?.advanced?.leadsBySource?.map((item: any) => ({ name: item.source, value: item.count })) || []}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(dashboardData?.advanced?.leadsBySource || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={['var(--accent-emerald)', 'var(--accent-indigo)', 'var(--accent-amber)', 'var(--accent-rose)', 'var(--accent-purple)'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', color: 'var(--text-primary)' }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
