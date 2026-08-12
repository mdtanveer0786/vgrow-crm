import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';

export default function QuoteRequestsPage() {
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

  const requestedQuotes = quotes.filter((q: any) => q.status === 'Requested' || q.status === 'Draft');

  return (
    <>
      {activeTab === 'quote-requests' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="page-header">
            <div>
              <h2 className="page-title">Quote Requests</h2>
              <p className="page-desc">Manage inbound quote requests from landing pages and pipeline deals.</p>
            </div>
          </div>

          <Card padding="24px">
            {requestedQuotes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No quote requests yet.
              </div>
            ) : (
              <Table>
                <TableHead>
                  <TableHeader>Title</TableHeader>
                  <TableHeader>Amount</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Action</TableHeader>
                </TableHead>
                <TableBody>
                  {requestedQuotes.map((q: any) => (
                    <TableRow key={q.id}>
                      <TableCell><strong>{q.title}</strong></TableCell>
                      <TableCell>₹{parseFloat(q.amount || 0).toLocaleString('en-IN')}</TableCell>
                      <TableCell><Badge variant="amber">{q.status}</Badge></TableCell>
                      <TableCell>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => {
                            setActiveTab('quotes');
                          }}
                        >
                          Open Quote
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
