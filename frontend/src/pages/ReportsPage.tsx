import React, { useState } from 'react';
import { Card, Button } from '../components/ui';
import { useAppContext } from '../context/AppContext';
import { BarChart, Download, PieChart } from 'lucide-react';

export default function ReportsPage() {
  const context = useAppContext();
  const { activeTab, leads } = context;

  const [reportType, setReportType] = useState('Leads by Status');
  const [dateRange, setDateRange] = useState('This Month');
  const [selectedStatuses, setSelectedStatuses] = useState(['New', 'Contacted', 'Qualified', 'Proposal Sent']);

  const statusCounts = selectedStatuses.reduce((acc: Record<string, number>, status) => {
    acc[status] = leads.filter((l: any) => l.status === status).length;
    return acc;
  }, {});

  const totalLeadsInReport = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  const handleExportReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric / Status,Lead Count\n";
    Object.entries(statusCounts).forEach(([status, count]) => {
      csvContent += `${status},${count}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `VGrow_Report_${reportType.replace(/ /g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {activeTab === 'reports' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                Analytics & Report Builder
              </h2>
              <p className="page-desc">Create custom reports, analyze lead distribution, and export data spreadsheets.</p>
            </div>
            <Button variant="primary" onClick={handleExportReport} leftIcon={<Download className="w-4 h-4" />}>
              Export Report
            </Button>
          </div>

          {/* Builder Panel */}
          <Card style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
            <div className="form-group-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-field">
                <label className="form-label">Report Matrix Type</label>
                <select className="form-input" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                  <option value="Leads by Status">Leads by Funnel Status</option>
                  <option value="Leads by Temperature">Leads by Temperature Score</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Timeline Range</label>
                <select className="form-input" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                  <option value="This Month">This Month (Current)</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="This Quarter">This Quarter</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Visualization Layout</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="primary" size="sm" leftIcon={<BarChart className="w-4 h-4" />}>
                    Bar
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<PieChart className="w-4 h-4" />}>
                    Pie
                  </Button>
                </div>
              </div>
            </div>

            <div className="reports-filter-container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <div className="form-field">
                <label className="form-label">Select Funnel States</label>
                <div className="filter-list-box" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted'].map(status => (
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
          </Card>

          {/* Rendered report preview */}
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Report Preview Summary ({totalLeadsInReport} Leads Found)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(statusCounts).map(([status, count]) => {
                const percent = totalLeadsInReport > 0 ? Math.round((count / totalLeadsInReport) * 100) : 0;
                return (
                  <div key={status} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ fontWeight: '700' }}>{status}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{count} leads ({percent}%)</span>
                    </div>
                    <div style={{ height: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: 'var(--accent-indigo)', borderRadius: '6px' }}></div>
                    </div>
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

