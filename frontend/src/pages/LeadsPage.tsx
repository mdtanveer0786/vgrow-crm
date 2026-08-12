import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  LayoutDashboard, Users, Briefcase, PhoneCall, Calendar, MessageSquare, Mail, Sliders, DollarSign, Package,
  FileText, UserCheck, UserPlus, Plus, Trash2, Edit2, CheckCircle, FileSpreadsheet, Settings, Search, Globe,
  Bell, Clock, Sparkles, ChevronRight, ShieldCheck, Play, Layers, ArrowRightLeft, Filter, TrendingUp, Download,
  AlertCircle, X, PlusCircle, Check, CheckSquare, AlertTriangle, FolderMinus, HelpCircle, Sun, Moon, User,
  MoreHorizontal, Compass, Zap, MapPin, FileDigit, Lock, Building, Key
} from 'lucide-react';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Button } from '../components/ui/Button';

export default function LeadsPage() {
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
      handleDeleteTicket, handleExportCSV, handleImportCSV, handlePrintRecord,
      authFetch, API_BASE
  } = context;

  const [aiInsightsText, setAiInsightsText] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tempFilter, setTempFilter] = useState('All');
  const [sortField, setSortField] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredLeads = leads
    .filter(lead => {
      const matchSearch = 
        `${lead.firstName || ''} ${lead.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'All' || lead.status === statusFilter;
      const matchTemp = tempFilter === 'All' || lead.temperature === tempFilter;
      
      return matchSearch && matchStatus && matchTemp;
    })
    .sort((a, b) => {
      let valA = a[sortField] ?? '';
      let valB = b[sortField] ?? '';
      
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      {activeTab === 'leads' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              {selectedLead ? (
                // Modern Split-Pane View
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                  
                  {/* Setup Health Checklist Banner */}
                  <div style={{ background: 'rgba(16, 185, 129, 0.05)', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <div>
                      <span style={{ fontWeight: '800' }}>Active Workflow:</span> VIP Customer Onboarding
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '120px', height: '6px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '82%', height: '100%', background: 'var(--accent-emerald)' }}></div>
                      </div>
                      <span style={{ fontWeight: '800' }}>82%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <button onClick={() => setActiveTab('settings')} style={{ background: 'transparent', border: 'none', color: 'var(--accent-emerald)', fontWeight: '800', cursor: 'pointer' }}>Open Setup Hub &gt;</button>
                      <button onClick={() => setSelectedLead(null)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-emerald)', cursor: 'pointer', fontSize: '16px' }}>&times;</button>
                    </div>
                  </div>

                  {/* Header Actions Navigation Bar */}
                  <div className="detail-top-nav">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <button onClick={() => setSelectedLead(null)} className="btn-secondary" style={{ padding: '6px 12px' }}>&larr;</button>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>&lt; 1 / 12 &gt;</span>
                      <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}><Clock className="w-4 h-4" /></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--text-primary)', fontSize: '12px' }}>
                        {selectedLead.firstName ? selectedLead.firstName.substring(0, 1) + (selectedLead.lastName ? selectedLead.lastName.substring(0, 1) : '') : 'VG'}
                      </div>
                      <div>
                        <h4 style={{ color: 'var(--text-primary)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {selectedLead.company || 'DFS'} 
                          <span className="badge badge-indigo" style={{ fontSize: '9px' }}>{selectedLead.status || 'New'}</span>
                          <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>No next step</span>
                          <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>Manually Added</span>
                        </h4>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedLead.firstName} {selectedLead.lastName}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="badge badge-amber" style={{ fontSize: '11px' }}>65% Quality</span>
                      {selectedLead.id !== 'new' && (
                        <button type="button" onClick={() => handleDeleteLead(selectedLead.id)} className="btn-secondary" style={{ color: 'var(--accent-rose)' }}>Archive</button>
                      )}
                      <button type="button" onClick={() => setSelectedLead(null)} className="btn-secondary">Cancel</button>
                      <Button variant="primary" type="button" onClick={handleUpdateLead} style={{ padding: '8px 20px' }}>Save</Button>
                    </div>
                  </div>

                  {/* Sub-actions toolbar */}
                  <div className="detail-actions-bar">
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-secondary">Call</button>
                      <button className="btn-secondary">Prep Brief</button>
                      <button className="btn-secondary">Send Email</button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="primary">Convert to Application</Button>
                      <button className="btn-secondary">Convert to Account</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Owner:</span>
                      <select className="form-input" style={{ padding: '4px 8px', fontSize: '12px' }}>
                        <option>Parul Yadav</option>
                        <option>Vaibhav Gupta</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-secondary">Log Activity</button>
                      <button className="btn-secondary">Create Task</button>
                      <button className="btn-secondary">Book Appointment</button>
                    </div>
                  </div>

                  {/* Warning banner */}
                  <div className="detail-alert-box">
                    <AlertTriangle className="w-4 h-4" />
                    <span>No next action set</span>
                  </div>

                  {/* Tabs bar */}
                  <div className="detail-tabs-bar">
                    <button onClick={() => setLeadDetailTab('overview')} className={`detail-tab-btn ${leadDetailTab === 'overview' ? 'active' : ''}`}>Overview</button>
                    <button onClick={() => setLeadDetailTab('ai-intelligence')} className={`detail-tab-btn ${leadDetailTab === 'ai-intelligence' ? 'active' : ''}`}>AI Intelligence</button>
                    <button onClick={() => setLeadDetailTab('timeline')} className={`detail-tab-btn ${leadDetailTab === 'timeline' ? 'active' : ''}`}>Timeline</button>
                    <button onClick={() => setLeadDetailTab('journey')} className={`detail-tab-btn ${leadDetailTab === 'journey' ? 'active' : ''}`}>Journey</button>
                    <button onClick={() => setLeadDetailTab('cadence')} className={`detail-tab-btn ${leadDetailTab === 'cadence' ? 'active' : ''}`}>Cadence</button>
                    <button onClick={() => setLeadDetailTab('tasks')} className={`detail-tab-btn ${leadDetailTab === 'tasks' ? 'active' : ''}`}>Tasks</button>
                    <button 
                      onClick={async () => {
                        setLeadDetailTab('files');
                        try {
                          const res = await authFetch(`${API_BASE}/files/Lead/${selectedLead.id}`);
                          setAttachments(await res.json());
                        } catch (e) {
                          console.error(e);
                        }
                      }} 
                      className={`detail-tab-btn ${leadDetailTab === 'files' ? 'active' : ''}`}
                    >
                      Files
                    </button>
                    <button onClick={() => setLeadDetailTab('consent')} className={`detail-tab-btn ${leadDetailTab === 'consent' ? 'active' : ''}`}>Consent</button>
                  </div>

                  {/* Split Pane Details Content Grid */}
                  <div className="lead-detail-split-pane">
                    
                    {/* Left Column Forms */}
                    <div className="detail-left-col">
                      
                      {leadDetailTab === 'overview' && (
                        <>
                          {/* Basic Info Card */}
                          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px' }}>Basic Information</h3>
                            
                            <div className="form-group-grid">
                              <div className="form-field">
                                <label className="form-label">Company Name (Optional)</label>
                                <input type="text" className="form-input" value={selectedLead.company || ''} onChange={(e)=>setSelectedLead({...selectedLead, company: e.target.value})} />
                              </div>
                              <div className="form-field">
                                <label className="form-label">Lead Name *</label>
                                <input type="text" className="form-input" required value={`${selectedLead.firstName || ''} ${selectedLead.lastName || ''}`.trim()} onChange={(e)=>{
                                  const parts = e.target.value.split(' ');
                                  setSelectedLead({...selectedLead, firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || ''});
                                }} />
                              </div>
                            </div>

                            <div className="form-group-grid">
                              <div className="form-field">
                                <label className="form-label">Phone (At least one required)</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <select className="form-input" style={{ width: '90px' }}><option>IN +91</option></select>
                                  <input type="text" className="form-input" style={{ flexGrow: 1 }} value={selectedLead.phone || ''} onChange={(e)=>setSelectedLead({...selectedLead, phone: e.target.value})} />
                                </div>
                              </div>
                              <div className="form-field">
                                <label className="form-label">Email (At least one required)</label>
                                <input type="email" className="form-input" value={selectedLead.email || ''} onChange={(e)=>setSelectedLead({...selectedLead, email: e.target.value})} />
                              </div>
                            </div>

                            <div className="form-group-grid">
                              <div className="form-field">
                                <label className="form-label">Industry</label>
                                <select className="form-input" value={selectedLead.industry || 'Other'} onChange={(e)=>setSelectedLead({...selectedLead, industry: e.target.value})}>
                                  <option>Other</option>
                                  <option>Retail</option>
                                  <option>Technology</option>
                                  <option>Finance</option>
                                  <option>Apparel</option>
                                </select>
                              </div>
                              <div className="form-field">
                                <label className="form-label">Lead Stage</label>
                                <select className="form-input" value={selectedLead.status || 'New'} onChange={(e)=>setSelectedLead({...selectedLead, status: e.target.value})}>
                                  <option>New</option>
                                  <option>Prospecting</option>
                                  <option>Contacted</option>
                                  <option>Qualified</option>
                                  <option>Proposal Sent</option>
                                  <option>Converted</option>
                                </select>
                              </div>
                            </div>

                             <div className="form-field">
                              <label className="form-label">Lead Source</label>
                              <select 
                                className="form-input" 
                                value={selectedLead.source || 'Manual'} 
                                onChange={(e) => setSelectedLead({...selectedLead, source: e.target.value})}
                              >
                                <option value="Manual">Manual</option>
                                <option value="WhatsApp">WhatsApp Hub</option>
                                <option value="Website">Website Form</option>
                                <option value="JustDial">JustDial India</option>
                                <option value="Sulekha">Sulekha Classifieds</option>
                                <option value="Indiamart">IndiaMART</option>
                                <option value="Facebook">Facebook Ads</option>
                              </select>
                            </div>
                          </div>

                          {/* Action Taken Card */}
                          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>Action Taken</h3>
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Record what happened and what to do next</p>

                            <div className="form-group-grid">
                              <div className="form-field">
                                <label className="form-label">Action Taken</label>
                                <select className="form-input"><option>New</option><option>Call Attempted</option><option>Meeting Scheduled</option></select>
                              </div>
                              <div className="form-field">
                                <label className="form-label">Name of Action</label>
                                <select className="form-input"><option>Select action</option></select>
                              </div>
                            </div>

                            <div className="form-group-grid">
                              <div className="form-field">
                                <label className="form-label">Follow-up Date</label>
                                <input type="date" className="form-input" />
                              </div>
                              <div className="form-field">
                                <label className="form-label">Person Working</label>
                                <select className="form-input"><option>Parul Yadav</option></select>
                              </div>
                            </div>

                            <div className="form-field">
                              <label className="form-label">Action Comment</label>
                              <textarea className="form-input" style={{ height: '80px' }} placeholder="Describe what action was taken..."></textarea>
                            </div>
                          </div>

                          {/* Action Comment History */}
                          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>Action Comment History</h3>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span className="badge badge-amber" style={{ cursor: 'pointer' }}>What should I do next?</span>
                              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                                <span className="toggle-switch-input">
                                  <input type="checkbox" />
                                  <span className="toggle-slider"></span>
                                </span>
                                Email Sent
                              </label>
                              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)' }}>
                                <span className="toggle-switch-input">
                                  <input type="checkbox" />
                                  <span className="toggle-slider"></span>
                                </span>
                                WhatsApp
                              </label>
                            </div>
                            <Button variant="primary" type="button" style={{ width: '100%', marginTop: '8px' }}>Save Action</Button>
                          </div>

                          {/* Contact Details Card */}
                          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>Contact Details</h3>
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Job title, alternate phone, web profiles, location &amp; DNC.</p>

                            <div className="form-group-grid">
                              <div className="form-field">
                                <label className="form-label">Designation</label>
                                <input type="text" className="form-input" placeholder="e.g. VP Sales" />
                              </div>
                              <div className="form-field">
                                <label className="form-label">Secondary Phone</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <select className="form-input" style={{ width: '90px' }}><option>IN +91</option></select>
                                  <input type="text" className="form-input" style={{ flexGrow: 1 }} placeholder="Alternate number" />
                                </div>
                              </div>
                            </div>

                            <div className="form-group-grid">
                              <div className="form-field">
                                <label className="form-label">Website</label>
                                <input type="text" className="form-input" placeholder="https://example.com" />
                              </div>
                              <div className="form-field">
                                <label className="form-label">LinkedIn URL</label>
                                <input type="text" className="form-input" placeholder="https://linkedin.com/in/..." />
                              </div>
                            </div>

                        <div className="form-group-grid">
                          <div className="form-field">
                            <label className="form-label">City</label>
                            <input type="text" className="form-input" placeholder="e.g. Mumbai" />
                          </div>
                          <div className="form-field">
                            <label className="form-label">GST Number (Optional)</label>
                            <input type="text" className="form-input" placeholder="E.G. 27AAPFU0939F1ZV" />
                          </div>
                        </div>

                            <div className="flex-between">
                              <div>
                                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Do Not Call</h4>
                                <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Compliance flag - hides the dial button.</p>
                              </div>
                              <span className="toggle-switch-input">
                                <input type="checkbox" />
                                <span className="toggle-slider"></span>
                              </span>
                            </div>
                          </div>

                          {/* Notes Card */}
                          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="flex-between">
                              <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>Notes</h3>
                              <button type="button" className="btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }}>Draft call notes</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px' }}>
                              <textarea className="form-input" style={{ border: 'none', background: 'transparent', height: '80px', padding: 0 }} placeholder="Write a note... use @ to mention a teammate" value={noteInput} onChange={(e) => setNoteInput(e.target.value)}></textarea>
                              <div className="flex-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '8px' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>B I U list link @</span>
                                <Button variant="primary" type="button" onClick={() => handleAddNote(noteInput)} style={{ padding: '4px 12px', fontSize: '11px' }}>Add note</Button>
                              </div>
                            </div>
                            {leadNotes[selectedLead.id] && leadNotes[selectedLead.id].length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {leadNotes[selectedLead.id].map(note => (
                                  <div key={note.id} style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                                    <p style={{ color: 'var(--text-primary)', fontSize: '12px' }}>{note.text}</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '10px', marginTop: '4px' }}>{note.timestamp}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px', padding: '20px 0' }}>No notes yet</p>
                            )}
                          </div>
                        </>
                      )}

                      {leadDetailTab === 'timeline' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div className="flex-between">
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                              {(leadNotes[selectedLead.id] ? leadNotes[selectedLead.id].length : 0) + 3} of {(leadNotes[selectedLead.id] ? leadNotes[selectedLead.id].length : 0) + 3} events
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => {
                                const noteText = window.prompt('Enter note content:');
                                if (noteText) handleAddNote(noteText);
                              }} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>Add note</button>
                              <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>Summarize client</button>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {[`All (${(leadNotes[selectedLead.id] ? leadNotes[selectedLead.id].length : 0) + 3})`, 'Calls (0)', 'Emails (0)', 'WhatsApp (0)', 'SMS (0)', `Notes (${leadNotes[selectedLead.id] ? leadNotes[selectedLead.id].length : 0})`, 'Tasks (0)', 'Journey (2)'].map(pill => (
                              <span key={pill} style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>{pill}</span>
                            ))}
                          </div>

                          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                            {leadNotes[selectedLead.id] && leadNotes[selectedLead.id].map(note => (
                              <div key={note.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                                <div>
                                  <h4 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '13px' }}>Note Added <span className="badge badge-indigo" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-indigo)', marginLeft: '8px' }}>Created</span></h4>
                                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{note.text}</p>
                                </div>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{note.timestamp}</span>
                              </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                              <div>
                                <h4 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '13px' }}>Journey: Standard B2B Sale <span className="badge badge-indigo" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent-emerald)', marginLeft: '8px' }}>Performed</span></h4>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Wait</p>
                              </div>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>31 Jul 2026, 1:34 PM &bull; 1 day ago</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <h4 style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '13px' }}>Journey: Standard B2B Sale <span className="badge badge-rose" style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--accent-rose)', marginLeft: '8px' }}>Skipped</span></h4>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>WhatsApp</p>
                              </div>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>30 Jul 2026, 3:34 PM &bull; 2 days ago</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {leadDetailTab === 'journey' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>Standard B2B Sale</h3>
                              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>A balanced 5-stage playbook for typical B2B sales cycles &mdash; first contact through close.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }}>Pause</button>
                              <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }}>Skip rest of stage</button>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '8px 0' }}>
                            {['New', 'Prospecting', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted'].map((step) => {
                              const isActive = (selectedLead.status || 'New') === step;
                              return (
                                <span key={step} style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '12px', background: isActive ? 'var(--accent-indigo)' : 'rgba(255,255,255,0.03)', color: isActive ? 'white' : 'var(--text-secondary)', border: isActive ? '1px solid var(--accent-indigo)' : '1px solid var(--border-color)', fontWeight: isActive ? '800' : '400' }}>{step}</span>
                              );
                            })}
                          </div>

                          <div className="glass-panel">
                            <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>Scheduled actions (3)</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '700' }}>Call (Manual)</span>
                                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    {completedCalls[selectedLead.id] ? 'Completed just now' : 'Was scheduled 2 days ago'}
                                  </p>
                                </div>
                                {completedCalls[selectedLead.id] ? (
                                  <span className="badge badge-indigo" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent-emerald)' }}>Completed</span>
                                ) : (
                                  <Button variant="primary" onClick={handleMarkCallDone} style={{ padding: '6px 12px', fontSize: '11px' }}>Mark call done</Button>
                                )}
                              </div>
                              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: '0.6' }}>
                                <div>
                                  <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '700' }}>WhatsApp (Skipped)</span>
                                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Hi, just tried calling &mdash; happy to chat when you have a minute.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {leadDetailTab === 'cadence' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                          <div className="glass-panel">
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Cross-channel cadence</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No active cadences. Create one under Cadences.</p>
                          </div>
                          <div className="glass-panel" style={{ padding: '40px 0', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Cadence timeline</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No cadence touches yet. Enroll this lead to start the sequence.</p>
                          </div>
                        </div>
                      )}

                      {leadDetailTab === 'tasks' && (
                        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>Tasks</h3>
                            <Button variant="primary" onClick={handleAddTask} style={{ padding: '4px 12px', fontSize: '11px' }}>+ Add Task</Button>
                          </div>
                          {leadTasks[selectedLead.id] && leadTasks[selectedLead.id].length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {leadTasks[selectedLead.id].map(task => (
                                <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                                  <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{task.name}</span>
                                  <span className="badge badge-indigo" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-indigo)' }}>Pending</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>No tasks yet &bull; Tasks created here also appear on your Task Boards.</p>
                              <button onClick={handleAddTask} className="btn-secondary" style={{ padding: '6px 16px', fontSize: '12px' }}>+ Add the first task</button>
                            </div>
                          )}
                        </div>
                      )}

                      {leadDetailTab === 'files' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                              <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>Attachments</h3>
                              <input 
                                type="file" 
                                id="crm-file-uploader" 
                                style={{ display: 'none' }}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setUploadingFile(true);
                                  
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  formData.append('entityId', selectedLead.id);
                                  formData.append('entityType', 'Lead');
                                  
                                  try {
                                    // Custom authFetch override for multipart/form-data (exclude headers block to let fetch auto-assign boundary)
                                    const res = await fetch(`${API_BASE}/upload`, {
                                      method: 'POST',
                                      headers: {
                                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                                      },
                                      body: formData
                                    });
                                    const attachment = await res.json();
                                    setAttachments([attachment, ...attachments]);
                                  } catch (err) {
                                    console.error(err);
                                  } finally {
                                    setUploadingFile(false);
                                  }
                                }}
                              />
                              <Button 
                                variant="primary"
                                onClick={() => document.getElementById('crm-file-uploader')?.click()}
                                style={{ padding: '4px 12px', fontSize: '11px' }}
                                disabled={uploadingFile}
                              >
                                {uploadingFile ? 'Uploading...' : 'Upload'}
                              </Button>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {attachments.map(att => (
                                <div key={att.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                                  <div>
                                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>{att.fileName}</span>
                                    <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                      Size: {(att.fileSize / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                  <a href={att.fileUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '4px 10px', fontSize: '11px', textDecoration: 'none' }}>
                                    Download
                                  </a>
                                </div>
                              ))}
                              {attachments.length === 0 && !uploadingFile && (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', padding: '20px 0' }}>No files attached yet.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {leadDetailTab === 'ai-intelligence' && (
                        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div className="flex-between">
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>AI Intelligence Insights</h3>
                            <Button 
                              variant="primary"
                              type="button" 
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '11px' }}
                              disabled={loadingInsights}
                              onClick={async () => {
                                setLoadingInsights(true);
                                try {
                                  const res = await authFetch(`${API_BASE}/leads/${selectedLead.id}/ai-insights`);
                                  const data = await res.json();
                                  setAiInsightsText(data.insights || 'No insights returned.');
                                } catch (e) {
                                  console.error('Insights generation failed', e);
                                  setAiInsightsText('Failed to generate insights.');
                                } finally {
                                  setLoadingInsights(false);
                                }
                              }}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              {loadingInsights ? 'Analyzing...' : 'Generate insights'}
                            </Button>
                          </div>
                          
                          {loadingInsights ? (
                            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                              AI is scanning lead history and generating recommendations...
                            </div>
                          ) : aiInsightsText ? (
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                              {aiInsightsText}
                            </div>
                          ) : (
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              Click "Generate insights" to analyze the prospect's profile, calculate buying probability, and output custom pitches.
                            </p>
                          )}
                        </div>
                      )}

                      {leadDetailTab === 'consent' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-indigo)' }}></span>
                              Governing regulation: India - DPDP
                            </h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>India (DPDP): prior consent is honoured; explicit opt-out always blocks. Double opt-in not required.</p>
                          </div>

                          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>Channel consent</h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {['Email', 'SMS', 'WhatsApp'].map(channel => (
                                <div key={channel} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                                  <div>
                                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{channel}</h4>
                                    <p style={{ fontSize: '11px', color: 'var(--accent-emerald)', marginTop: '4px', fontWeight: '700' }}>Marketing sends allowed</p>
                                  </div>
                                  <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>No consent on record</button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Right Column Metrics */}
                    <div className="detail-right-col">
                      
                      {/* Lead Score Circular Gauge */}
                      <div className="glass-panel" style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', textAlign: 'left', marginBottom: '16px' }}>Lead Score</h3>
                        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '50%', border: '4px solid var(--accent-amber)' }}>
                          <h4 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-amber)' }}>{selectedLead.score || 24}</h4>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/ 100</span>
                        </div>
                        <span className="badge badge-amber" style={{ fontSize: '10px', display: 'inline-block', marginBottom: '12px' }}>Cool</span>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>Auto-scored based on contact info, engagement &amp; deal activity. Run AI Analysis for a deeper score.</p>
                      </div>

                       {/* Cadence Steps */}
                       <div className="glass-panel">
                         <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>Standard B2B Sale</h3>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                           <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                             <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-indigo)', marginTop: '6px' }}></div>
                             <div>
                               <h4 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>Current Stage: {selectedLead.status || 'New'}</h4>
                               <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Day 2 of -1 &bull; Active</p>
                             </div>
                           </div>
                         </div>
                         <Button variant="primary" type="button" onClick={handleAdvanceStage} style={{ width: '100%', marginTop: '20px' }}>Advance Stage</Button>
                       </div>

                      {/* Related Applications */}
                      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Related Applications</h3>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>No applications linked yet</p>
                        <button className="btn-secondary" style={{ width: '100%' }}>+ Create Application</button>
                      </div>

                      {/* WhatsApp / Assist Composer */}
                      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>WhatsApp Assist</h3>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No messages yet</p>
                        <button className="btn-secondary" style={{ width: '100%' }}>Open full composer</button>
                      </div>

                      {/* History Logs */}
                      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>History</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '1px solid var(--border-color)', paddingLeft: '16px', marginLeft: '6px' }}>
                          <div>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>30 Jul 2026, 1:33 PM</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: '600' }}>Lead was created</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ) : (
                // Directory list view
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                  <div className="page-header">
                    <div>
                      <h2 className="page-title">Leads Directory</h2>
                      <p className="page-desc">Manage and convert sales prospects</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button onClick={() => handleExportCSV(leads, 'leads.csv')} className="btn-secondary">Export CSV</button>
                      <label className="btn-secondary" style={{ cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        Import CSV
                        <input type="file" accept=".csv" onChange={(e) => handleImportCSV(e, 'leads')} style={{ display: 'none' }} />
                      </label>
                      <Button variant="primary" onClick={() => setSelectedLead({ id: 'new', firstName: '', lastName: '', company: '', email: '', phone: '', status: 'New', temperature: 'Warm', score: 24 })}>+ New Lead</Button>
                    </div>
                  </div>

                  {/* Search, Filter and Grid Control Panel */}
                  <div className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '16px' }}>
                    <div style={{ flexGrow: 1, minWidth: '200px', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0 12px' }}>
                      <Search className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                      <input 
                        type="text" 
                        placeholder="Search leads by name, company, email..." 
                        style={{ background: 'none', border: 'none', color: 'var(--text-primary)', width: '100%', padding: '8px', outline: 'none', fontSize: '12px' }}
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select 
                        className="form-input" 
                        style={{ padding: '6px 12px', fontSize: '11px', width: '130px' }}
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                      >
                        <option value="All">All Stages</option>
                        <option value="New">New</option>
                        <option value="Prospecting">Prospecting</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Converted">Converted</option>
                      </select>

                      <select 
                        className="form-input" 
                        style={{ padding: '6px 12px', fontSize: '11px', width: '130px' }}
                        value={tempFilter}
                        onChange={(e) => { setTempFilter(e.target.value); setCurrentPage(1); }}
                      >
                        <option value="All">All Temperatures</option>
                        <option value="Warm">Warm</option>
                        <option value="Hot">Hot</option>
                        <option value="Cold">Cold</option>
                      </select>
                    </div>
                  </div>

                  <Table>
                    <TableHead>
                        <TableHeader onClick={() => toggleSort('firstName')} style={{ cursor: 'pointer' }}>
                          Name {sortField === 'firstName' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                        </TableHeader>
                        <TableHeader onClick={() => toggleSort('company')} style={{ cursor: 'pointer' }}>
                          Company {sortField === 'company' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                        </TableHeader>
                        <TableHeader>Industry</TableHeader>
                        <TableHeader onClick={() => toggleSort('status')} style={{ cursor: 'pointer' }}>
                          Status {sortField === 'status' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                        </TableHeader>
                        <TableHeader onClick={() => toggleSort('score')} style={{ cursor: 'pointer' }}>
                          Score {sortField === 'score' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                        </TableHeader>
                        <TableHeader>Next Action</TableHeader>
                    </TableHead>
                    <TableBody>
                      {paginatedLeads.length > 0 ? paginatedLeads.map((lead) => (
                        <TableRow key={lead.id} onClick={() => setSelectedLead(lead)}>
                          <TableCell style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{lead.firstName} {lead.lastName}</TableCell>
                          <TableCell>{lead.company}</TableCell>
                          <TableCell>{lead.industry}</TableCell>
                          <TableCell>
                            <span className={`badge ${
                              lead.status === 'Converted' ? 'badge-green' :
                              lead.status === 'New' ? 'badge-blue' : 'badge-indigo'
                            }`}>{lead.status}</span>
                          </TableCell>
                          <TableCell>{lead.score || 50}</TableCell>
                          <TableCell>{lead.nextAction || 'None'}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
                              <Search className="w-12 h-12" style={{ color: 'var(--text-muted)' }} />
                              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>No leads found</h3>
                              <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or filters.</p>
                              <Button variant="ghost" onClick={() => { setSearchTerm(''); setStatusFilter('All'); setTempFilter('All'); }}>Clear Filters</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Page {currentPage} of {totalPages} &bull; Total {filteredLeads.length} leads
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '11px', opacity: currentPage === 1 ? 0.5 : 1 }}
                        >
                          Previous
                        </button>
                        <button 
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '11px', opacity: currentPage === totalPages ? 0.5 : 1 }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
    </>
  );
}
