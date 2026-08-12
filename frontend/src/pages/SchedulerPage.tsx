import React from 'react';
import { useAppContext } from '../context/AppContext';
import {
  LayoutDashboard, Users, Briefcase, PhoneCall, Calendar, MessageSquare, Mail, Sliders, DollarSign, Package,
  FileText, UserCheck, UserPlus, Plus, Trash2, Edit2, CheckCircle, FileSpreadsheet, Settings, Search, Globe,
  Bell, Clock, Sparkles, ChevronRight, ShieldCheck, Play, Layers, ArrowRightLeft, Filter, TrendingUp, Download,
  AlertCircle, X, PlusCircle, Check, CheckSquare, AlertTriangle, FolderMinus, HelpCircle, Sun, Moon, User,
  MoreHorizontal, Compass, Zap, MapPin, FileDigit, Lock, Building, Key
} from 'lucide-react';
import { Card, Button, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui';

export default function SchedulerPage() {
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

  return (
    <>
      {activeTab === 'scheduler' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="page-header">
                <div>
                  <h2 className="page-title">Scheduler</h2>
                  <p className="page-desc">Interviews and calendar booking links.</p>
                </div>
              </div>

              <Card padding="24px" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>Welcome back! 👋</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>You have {events.length} meetings scheduled.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="primary">+ Create Event</Button>
                    <Button variant="secondary">Copy Link</Button>
                  </div>
                </div>
                {events.length > 0 && (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Title</TableHeader>
                        <TableHeader>Date</TableHeader>
                        <TableHeader>Time</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {events.map(ev => (
                        <TableRow key={ev.id}>
                          <TableCell>{ev.title}</TableCell>
                          <TableCell>{new Date(ev.date).toLocaleDateString()}</TableCell>
                          <TableCell>{ev.time}</TableCell>
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

