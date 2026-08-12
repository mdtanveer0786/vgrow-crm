import React, { useState, useMemo } from 'react';
import { Card, Button } from '../components/ui';
import { useAppContext } from '../context/AppContext';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Download,
  FileQuestion,
  RefreshCw,
  TrendingUp,
  Users,
  LayoutList
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function ReportsPage() {
  const context = useAppContext();
  const {
    activeTab,
    setActiveTab,
    leads = [],
    tasks = [],
    tickets = [],
    invoices = [],
    proposals = [],
    handleExportCSV
  } = context || {};

  const [reportType, setReportType] = useState('Leads by Status');
  const [dateRange, setDateRange] = useState('All Time');
  const [layoutView, setLayoutView] = useState<'bar' | 'pie' | 'summary'>('bar');

  // Dynamically compute unique statuses present in leads context
  const availableLeadStatuses = useMemo(() => {
    const defaultStatuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted'];
    const fromLeads = leads.map((l: any) => l.status).filter(Boolean);
    return Array.from(new Set([...defaultStatuses, ...fromLeads]));
  }, [leads]);

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(availableLeadStatuses);

  // Synchronize selectedStatuses if availableLeadStatuses change
  React.useEffect(() => {
    setSelectedStatuses(prev => Array.from(new Set([...prev, ...availableLeadStatuses])));
  }, [availableLeadStatuses]);

  // Dynamic timeline date filtering
  const filterByDateRange = <T extends Record<string, any>>(items: T[]): T[] => {
    if (dateRange === 'All Time') return items;

    const now = new Date();
    return items.filter((item) => {
      const dateStr = item.createdAt || item.date || item.dueDate || item.updatedAt;
      if (!dateStr) return true;
      const itemDate = new Date(dateStr);
      if (isNaN(itemDate.getTime())) return true;

      if (dateRange === 'This Month') {
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      }
      if (dateRange === 'Last 30 Days') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return itemDate >= thirtyDaysAgo;
      }
      if (dateRange === 'This Quarter') {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const itemQuarter = Math.floor(itemDate.getMonth() / 3);
        return itemQuarter === currentQuarter && itemDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const filteredLeads = useMemo(() => filterByDateRange(leads), [leads, dateRange]);
  const filteredTasks = useMemo(() => filterByDateRange(tasks), [tasks, dateRange]);
  const filteredTickets = useMemo(() => filterByDateRange(tickets), [tickets, dateRange]);
  const filteredInvoices = useMemo(() => filterByDateRange(invoices), [invoices, dateRange]);
  const filteredProposals = useMemo(() => filterByDateRange(proposals), [proposals, dateRange]);

  // Compute aggregated report items based on reportType
  const reportData = useMemo(() => {
    if (reportType === 'Leads by Status') {
      const counts: Record<string, number> = {};
      selectedStatuses.forEach(status => { counts[status] = 0; });
      filteredLeads.forEach((l: any) => {
        const st = l.status || 'New';
        if (selectedStatuses.includes(st)) {
          counts[st] = (counts[st] || 0) + 1;
        }
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    if (reportType === 'Leads by Temperature') {
      const counts = { Hot: 0, Warm: 0, Cold: 0 };
      filteredLeads.forEach((l: any) => {
        const temp = l.temperature || (l.score >= 80 ? 'Hot' : l.score >= 50 ? 'Warm' : 'Cold');
        if (temp === 'Hot' || l.score >= 80) counts.Hot++;
        else if (temp === 'Cold' || l.score < 50) counts.Cold++;
        else counts.Warm++;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    if (reportType === 'Leads by Source') {
      const counts: Record<string, number> = {};
      filteredLeads.forEach((l: any) => {
        const src = l.source || 'Website / Direct';
        counts[src] = (counts[src] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    if (reportType === 'Tasks & Tickets Status') {
      const counts: Record<string, number> = {
        'Completed Tasks': filteredTasks.filter((t: any) => t.status === 'completed' || t.status === 'Done' || t.completed).length,
        'Pending Tasks': filteredTasks.filter((t: any) => t.status !== 'completed' && t.status !== 'Done' && !t.completed).length,
        'Open Tickets': filteredTickets.filter((t: any) => t.status === 'Open' || t.status === 'In Progress').length,
        'Resolved Tickets': filteredTickets.filter((t: any) => t.status === 'Resolved' || t.status === 'Closed').length,
      };
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    if (reportType === 'Invoices & Financials') {
      const counts: Record<string, number> = {
        'Paid Invoices': filteredInvoices.filter((i: any) => i.status === 'Paid').length,
        'Unpaid Invoices': filteredInvoices.filter((i: any) => i.status !== 'Paid').length,
        'Active Proposals': filteredProposals.filter((p: any) => p.status === 'Active' || p.status === 'Sent' || p.status === 'Draft').length,
      };
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    return [];
  }, [reportType, filteredLeads, selectedStatuses, filteredTasks, filteredTickets, filteredInvoices, filteredProposals]);

  const totalRecordCount = useMemo(() => {
    return reportData.reduce((sum, item) => sum + item.value, 0);
  }, [reportData]);

  const hasNoData = totalRecordCount === 0 || reportData.length === 0;

  const COLORS = ['var(--accent-indigo)', 'var(--accent-emerald)', 'var(--accent-amber)', 'var(--accent-rose)', 'var(--accent-purple)', 'var(--accent-blue)'];

  const handleExportReport = () => {
    if (hasNoData) {
      alert('No report data available to export!');
      return;
    }
    const exportRows = reportData.map(item => ({
      Metric: item.name,
      Count: item.value,
      Percentage: `${totalRecordCount > 0 ? Math.round((item.value / totalRecordCount) * 100) : 0}%`
    }));

    if (handleExportCSV) {
      handleExportCSV(exportRows, `VGrow_Report_${reportType.replace(/\s+/g, '_')}.csv`);
    } else {
      let csvContent = 'data:text/csv;charset=utf-8,Metric,Count,Percentage\n';
      exportRows.forEach(row => {
        csvContent += `"${row.Metric}",${row.Count},"${row.Percentage}"\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `VGrow_Report_${reportType.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleResetFilters = () => {
    setDateRange('All Time');
    setReportType('Leads by Status');
    setSelectedStatuses(availableLeadStatuses);
  };

  return (
    <>
      {activeTab === 'reports' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChartIcon className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                Analytics & Report Builder
              </h2>
              <p className="page-desc">Create custom reports, analyze real pipeline data, and export spreadsheet metrics.</p>
            </div>
            <Button
              variant="primary"
              onClick={handleExportReport}
              disabled={hasNoData}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export Report
            </Button>
          </div>

          {/* Builder Control Panel */}
          <Card style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
            <div className="form-group-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-field">
                <label className="form-label">Report Matrix Type</label>
                <select className="form-input" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                  <option value="Leads by Status">Leads by Funnel Status</option>
                  <option value="Leads by Temperature">Leads by Temperature Score</option>
                  <option value="Leads by Source">Leads by Source Channel</option>
                  <option value="Tasks & Tickets Status">Tasks & Tickets Breakdown</option>
                  <option value="Invoices & Financials">Invoices & Proposals Summary</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Timeline Range</label>
                <select className="form-input" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                  <option value="All Time">All Time</option>
                  <option value="This Month">This Month (Current)</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="This Quarter">This Quarter</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Visualization Layout</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant={layoutView === 'bar' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setLayoutView('bar')}
                    leftIcon={<BarChartIcon className="w-4 h-4" />}
                  >
                    Bar
                  </Button>
                  <Button
                    variant={layoutView === 'pie' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setLayoutView('pie')}
                    leftIcon={<PieChartIcon className="w-4 h-4" />}
                  >
                    Pie
                  </Button>
                  <Button
                    variant={layoutView === 'summary' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setLayoutView('summary')}
                    leftIcon={<LayoutList className="w-4 h-4" />}
                  >
                    Summary
                  </Button>
                </div>
              </div>
            </div>

            {reportType === 'Leads by Status' && (
              <div className="reports-filter-container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div className="form-field">
                  <label className="form-label">Select Funnel States</label>
                  <div className="filter-list-box" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    {availableLeadStatuses.map(status => (
                      <label key={status} className="filter-item-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStatuses([...selectedStatuses, status]);
                            } else {
                              setSelectedStatuses(selectedStatuses.filter(s => s !== status));
                            }
                          }}
                          style={{ accentColor: 'var(--accent-indigo)' }}
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Rendered Report Preview / Empty State */}
          {hasNoData ? (
            <Card style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px', minHeight: '300px' }}>
              <div style={{ padding: '16px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-indigo)' }}>
                <FileQuestion className="w-8 h-8" />
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  No Report Data Available
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto', lineHeight: '1.5' }}>
                  There are no records matching your selected report type ({reportType}) and timeline filter ({dateRange}). Try adjusting your matrix options or add new entries to your CRM.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <Button variant="secondary" size="sm" onClick={handleResetFilters} leftIcon={<RefreshCw className="w-4 h-4" />}>
                  Reset Filters
                </Button>
                {setActiveTab && (
                  <Button variant="primary" size="sm" onClick={() => setActiveTab('leads')} leftIcon={<Users className="w-4 h-4" />}>
                    View Leads
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent-indigo)' }} />
                  {reportType} Preview Summary ({totalRecordCount} Records Found)
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Range: {dateRange}</span>
              </div>

              {/* Graphical Layout Views */}
              {layoutView === 'bar' && (
                <div style={{ width: '100%', height: '300px', marginTop: '12px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData}>
                      <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                      <Bar dataKey="value" fill="var(--accent-indigo)" radius={[6, 6, 0, 0]}>
                        {reportData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {layoutView === 'pie' && (
                <div style={{ width: '100%', height: '300px', marginTop: '12px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData}
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {reportData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Detailed Breakdown List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                {reportData.map((item, index) => {
                  const percent = totalRecordCount > 0 ? Math.round((item.value / totalRecordCount) * 100) : 0;
                  const color = COLORS[index % COLORS.length];
                  return (
                    <div key={item.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block' }}></span>
                          {item.name}
                        </span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {item.value} {item.value === 1 ? 'record' : 'records'} ({percent}%)
                        </span>
                      </div>
                      <div style={{ height: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', background: color, borderRadius: '6px', transition: 'width 0.4s ease' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

        </div>
      )}
    </>
  );
}


