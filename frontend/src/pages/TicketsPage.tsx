import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { HelpCircle, Search, Download, Upload, Plus } from 'lucide-react';
import { Card, Button, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui';

export default function TicketsPage() {
  const context = useAppContext();
  const {
      activeTab, tickets, handleExportCSV, handleImportCSV, setShowAddTicketModal, setSelectedTicket
  } = context;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = tickets.filter(t =>
    (t.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {activeTab === 'tickets' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                Support Tickets & Desk
              </h2>
              <p className="page-desc">Track client requests, technical tickets, and resolve onboarding queries.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={() => handleExportCSV(tickets, 'tickets.csv')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <label className="btn-secondary" style={{ cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Upload className="w-4 h-4" /> Import CSV
                <input type="file" accept=".csv" onChange={(e) => handleImportCSV(e, 'tickets')} style={{ display: 'none' }} />
              </label>
              <Button variant="primary" onClick={() => setShowAddTicketModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus className="w-4 h-4" /> New Ticket
              </Button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <Card style={{ padding: '16px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Tickets</p>
              <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px' }}>{tickets.length} Tickets</h4>
            </Card>
            <Card style={{ padding: '16px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Open</p>
              <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px', color: 'var(--accent-indigo)' }}>
                {tickets.filter(t => t.status === 'Open').length} Open
              </h4>
            </Card>
            <Card style={{ padding: '16px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Resolved</p>
              <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '8px', color: 'var(--accent-emerald)' }}>0</h4>
            </Card>
          </div>

          {tickets.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <HelpCircle className="w-12 h-12 text-indigo-400" />
              <p style={{ color: 'var(--text-secondary)' }}>No support tickets found. Create your first support ticket to get started.</p>
              <Button variant="primary" onClick={() => setShowAddTicketModal(true)}>+ Create Ticket</Button>
            </Card>
          ) : (
            <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Customer Support Tickets Register</h3>
                <div style={{ position: 'relative', width: '240px' }}>
                  <Search style={{ position: 'absolute', left: '8px', top: '8px', width: '12px', height: '12px', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Search tickets by subject..." 
                    style={{ paddingLeft: '26px', fontSize: '12px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Table>
                <TableHead>
                  <TableHeader>Subject Description</TableHeader>
                  <TableHeader>Priority Level</TableHeader>
                  <TableHeader>Category Type</TableHeader>
                  <TableHeader>Status State</TableHeader>
                </TableHead>
                <TableBody>
                  {filteredTickets.map(t => (
                    <TableRow key={t.id} onClick={() => setSelectedTicket(t)}>
                      <TableCell style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{t.subject}</TableCell>
                      <TableCell>
                        <span className="badge badge-rose" style={{ padding: '4px 8px', fontSize: '10px' }}>{t.priority}</span>
                      </TableCell>
                      <TableCell>{t.category}</TableCell>
                      <TableCell>
                        <span className="badge badge-indigo" style={{ padding: '4px 8px', fontSize: '10px' }}>{t.status}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
