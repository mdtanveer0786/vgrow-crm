import React from 'react';
import { useAppContext } from '../context/AppContext';
import {
  LayoutDashboard, Users, Briefcase, PhoneCall, Calendar, MessageSquare, Mail, Sliders, DollarSign, Package,
  FileText, UserCheck, UserPlus, Plus, Trash2, Edit2, CheckCircle, FileSpreadsheet, Settings, Search, Globe,
  Bell, Clock, Sparkles, ChevronRight, ShieldCheck, Play, Layers, ArrowRightLeft, Filter, TrendingUp, Download,
  AlertCircle, X, PlusCircle, Check, CheckSquare, AlertTriangle, FolderMinus, HelpCircle, Sun, Moon, User,
  MoreHorizontal, Compass, Zap, MapPin, FileDigit, Lock, Building, Key
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';

export default function ProspectingPage() {
  const context = useAppContext();
  const {
      activeTab, setActiveTab, subTab, setSubTab, isDarkMode, setIsDarkMode,
      leads, setLeads, accounts, setAccounts, activities, setActivities, products, setProducts,
      employees, setEmployees, tickets, setTickets, roles, setRoles, quotes, setQuotes,
      proposals, setProposals, invoices, setInvoices, tasks, setTasks, events, setEvents,
      settings, setSettings, showAddLeadModal, setShowAddLeadModal, showAddEmployeeModal, setShowAddEmployeeModal,
      showAddTicketModal, setShowAddTicketModal, showAddRoleModal, setShowAddRoleModal,
      showNewQuoteEditor, setShowNewQuoteEditor, showNewProposalModal, setShowNewProposalModal,
      showInvoicePaymentModal, setShowInvoicePaymentModal, showNotification, setShowNotification,
      selectedLead, setSelectedLead, selectedEmployee, setSelectedEmployee, selectedTicket, setSelectedTicket,
      leadDetailTab, setLeadDetailTab, leadNotes, setLeadNotes, leadTasks, setLeadTasks,
      completedCalls, setCompletedCalls, noteInput, setNoteInput, selectedAccount, setSelectedAccount,
      showEditAccountModal, setShowEditAccountModal, newLead, setNewLead, newEmployee, setNewEmployee,
      newTicket, setNewTicket, newRole, setNewRole, quickNoteText, setQuickNoteText, quickNotes, setQuickNotes,
      fetchQuotes, fetchProposals, fetchInvoices, fetchTasks, fetchEvents, fetchLeads, fetchAccounts,
      fetchActivities, fetchProducts, fetchEmployees, fetchTickets, fetchRoles, fetchSettings,
      handleAddLead, handleAddEmployee, handleAddTicket, handleUpdateSettings, handleUpdateLead,
      handleAdvanceStage, handleAddNote, handleAddTask, handleMarkCallDone, handleDeleteLead,
      handleUpdateAccount, handleUpdateEmployee, handleDeleteEmployee, handleUpdateTicket,
      handleDeleteTicket, handleExportCSV, handleImportCSV, handlePrintRecord
  } = context;

  const rawRecords = leads.filter((l: any) => l.source !== 'Manual');
  const promotedCount = leads.filter((l: any) => l.status !== 'New').length;

  return (
    <>
      {activeTab === 'prospecting' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="page-header">
            <div>
              <h2 className="page-title">Prospecting Hub</h2>
              <p className="page-desc">Discover, validate, and promote third-party synced lead streams (JustDial, Sulekha, etc.) to active pipeline status.</p>
            </div>
          </div>

          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <Card padding="16px">
              <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Searches / API Polls This Month</p>
              <h4 style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px' }}>{rawRecords.length} / 100</h4>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Synched Leads Allocation</span>
            </Card>
            <Card padding="16px">
              <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Raw Synced Records</p>
              <h4 style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px' }}>{rawRecords.length}</h4>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Awaiting verification</span>
            </Card>
            <Card padding="16px">
              <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Promoted to Pipeline</p>
              <h4 style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px' }}>{promotedCount}</h4>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Leads engaged</span>
            </Card>
          </div>

          {/* List of raw leads to promote */}
          <Card padding="24px" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Raw Prospect Streams</h3>
            {rawRecords.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px', textAlign: 'center', padding: '20px 0' }}>No external lead stream synced yet. Import some leads or configure webhooks (JustDial/Sulekha) to start.</p>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Source</TableHeader>
                    <TableHeader>Email/Phone</TableHeader>
                    <TableHeader>Action</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rawRecords.map((lead: any) => (
                    <TableRow key={lead.id}>
                      <TableCell><strong>{lead.name}</strong></TableCell>
                      <TableCell><Badge variant="indigo">{lead.source}</Badge></TableCell>
                      <TableCell>{lead.email || lead.phone || '—'}</TableCell>
                      <TableCell>
                        <Button 
                          variant="primary" 
                          size="sm"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                          onClick={() => {
                            setSelectedLead(lead);
                            setLeadDetailTab('overview');
                            setActiveTab('leads');
                          }}
                        >
                          Verify & Promote
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
