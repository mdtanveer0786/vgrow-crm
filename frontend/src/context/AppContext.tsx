import React, { createContext, useContext, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { io } from 'socket.io-client';

const AppContext = createContext<any>(null);

const API_BASE = 'http://localhost:5000/api';

export function AppProvider({ children }: { children: React.ReactNode }) {

  const [activeTab, setActiveTab] = useState('dashboard');
  const [subTab, setSubTab] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [realtimeWhatsAppMessages, setRealtimeWhatsAppMessages] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const [tenantBranding, setTenantBranding] = useState(null);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const hostname = window.location.hostname;
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
          const res = await fetch(`${API_BASE}/organizations/branding?domain=${hostname}`);
          if (res.ok) {
            const data = await res.json();
            setTenantBranding(data);
            if (data.primaryColor) {
              document.documentElement.style.setProperty('--accent-indigo', data.primaryColor);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch tenant branding:', err);
      }
    };
    fetchBranding();
  }, []);

  useEffect(() => {
    let socket;
    if (token) {
      socket = io('http://localhost:5000', {
        auth: { token }
      });
      socket.on('new_whatsapp_message', (msg) => {
        setRealtimeWhatsAppMessages(prev => [...prev, msg]);
        alert(`New WhatsApp message from ${msg.contactName || msg.phone || 'Unknown'}: ${msg.text || 'New message'}`);
      });
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [token]);

  const authFetch = async (url: string, options: any = {}) => {
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    const currentToken = token || localStorage.getItem('token');
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      handleLogout();
      throw new Error('Unauthorized');
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setUser(data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleRegister = async (firstName, lastName, email, password, companyName) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, companyName })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setUser(data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  
  // Data States
  const [leads, setLeads] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [roles, setRoles] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  
  // Custom Modules & Automations
  const [customModules, setCustomModules] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [articles, setArticles] = useState([]);
  const [settings, setSettings] = useState({
    name: 'Discover First Step Private Limited',
    domain: 'firststepedu.net',
    logo: '',
    currency: 'INR',
    email: 'info@firststepedu.net',
    website: 'https://firststepedu.net/',
    phone: '+918882408630',
    gstinEnabled: false,
    gstinProvider: '',
    gstinApiKey: '',
    defaultLandingPage: 'Dashboard',
    whatsappAutoReplyEnabled: false,
    fieldVisitTrackingEnabled: true
  });

  // UI state
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showNewQuoteEditor, setShowNewQuoteEditor] = useState(false);
  const [showNewProposalModal, setShowNewProposalModal] = useState(false);
  const [showInvoicePaymentModal, setShowInvoicePaymentModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showCopilotDrawer, setShowCopilotDrawer] = useState(false);

  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [leadDetailTab, setLeadDetailTab] = useState('overview');
  const [leadNotes, setLeadNotes] = useState({});
  const [leadTasks, setLeadTasks] = useState({});
  const [completedCalls, setCompletedCalls] = useState({});
  const [noteInput, setNoteInput] = useState('');

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showEditAccountModal, setShowEditAccountModal] = useState(false);

  // Forms
  const [newLead, setNewLead] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    status: 'New',
    temperature: 'Warm',
    score: 50,
    nextAction: 'First Contact',
    source: 'Manual'
  });

  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Staff',
    department: 'Sales',
    status: 'Active'
  });

  const [newTicket, setNewTicket] = useState({
    subject: '',
    priority: 'Medium',
    status: 'Open',
    description: '',
    category: 'Billing'
  });

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const [quickNoteText, setQuickNoteText] = useState('');
  const [quickNotes, setQuickNotes] = useState([]);

  // Fetch initial data
  useEffect(() => {
    if (token) {
      fetchLeads();
      fetchAccounts();
      fetchActivities();
      fetchCommunications();
      fetchProducts();
      fetchEmployees();
      fetchTickets();
      fetchRoles();
      fetchSettings();
      fetchQuotes();
      fetchProposals();
      fetchInvoices();
      fetchTasks();
      fetchEvents();
      fetchCustomModules();
      fetchAutomations();
      fetchArticles();
    }
  }, [token]);

  const fetchQuotes = async () => {
    try { const res = await authFetch(`${API_BASE}/quotes`); setQuotes(await res.json()); } catch (err) { console.error('Failed to fetch quotes'); }
  };
  const fetchProposals = async () => {
    try { const res = await authFetch(`${API_BASE}/proposals`); setProposals(await res.json()); } catch (err) { console.error('Failed to fetch proposals'); }
  };
  const fetchInvoices = async () => {
    try { const res = await authFetch(`${API_BASE}/invoices`); setInvoices(await res.json()); } catch (err) { setInvoices([]); }
  };
  const fetchTasks = async () => {
    try { const res = await authFetch(`${API_BASE}/tasks`); setTasks(await res.json()); } catch (err) { setTasks([]); }
  };
  const fetchEvents = async () => {
    try { const res = await authFetch(`${API_BASE}/events`); setEvents(await res.json()); } catch (err) { setEvents([]); }
  };
  const fetchCustomModules = async () => {
    try { const res = await authFetch(`${API_BASE}/custom-modules`); setCustomModules(await res.json()); } catch (err) { console.error('Failed to fetch custom modules'); }
  };
  const fetchAutomations = async () => {
    try { const res = await authFetch(`${API_BASE}/automations`); setAutomations(await res.json()); } catch (err) { console.error('Failed to fetch automations'); }
  };
  const fetchArticles = async () => {
    try { const res = await authFetch(`${API_BASE}/knowledge`); setArticles(await res.json()); } catch (err) { console.error('Failed to fetch articles'); }
  };

  const fetchLeads = async () => {
    try {
      const res = await authFetch(`${API_BASE}/leads`);
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      setLeads([]);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await authFetch(`${API_BASE}/accounts`);
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
      setAccounts([]);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await authFetch(`${API_BASE}/activities`);
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setActivities([]);
    }
  };

  const fetchCommunications = async () => {
    try {
      const res = await authFetch(`${API_BASE}/communications`);
      const data = await res.json();
      setCommunications(data);
    } catch (err) {
      console.error("Failed to fetch communications");
    }
  };

  const handleAddCommunication = async (commData) => {
    try {
      const res = await authFetch(`${API_BASE}/communications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commData)
      });
      const created = await res.json();
      setCommunications(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Failed to add communication:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await authFetch(`${API_BASE}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      const res = await authFetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const created = await res.json();
      setProducts(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      const res = await authFetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const updated = await res.json();
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      console.error("Failed to update product", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await authFetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await authFetch(`${API_BASE}/employees`);
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      setEmployees([]);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await authFetch(`${API_BASE}/tickets`);
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      setTickets([]);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await authFetch(`${API_BASE}/roles`);
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error('Failed to fetch roles:', err);
      setRoles([]);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await authFetch(`${API_BASE}/settings`);
      const data = await res.json();
      if (data && data.name) setSettings(data);
    } catch (err) {
      console.log('Settings fallback used.');
    }
  };

  const handleAddActivity = async (activityData) => {
    try {
      const res = await authFetch(`${API_BASE}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData)
      });
      const created = await res.json();
      setActivities(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Failed to add activity:', err);
    }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });
      const created = await res.json();
      setLeads([created, ...leads]);
      setShowAddLeadModal(false);
      setNewLead({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        industry: '',
        status: 'New',
        temperature: 'Warm',
        score: 50,
        nextAction: 'First Contact',
        source: 'Manual'
      });
    } catch (err) {
      console.error('Failed to add lead:', err);
      alert('Failed to create lead. Please try again.');
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(`${API_BASE}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee)
      });
      const created = await res.json();
      setEmployees([...employees, created]);
      setShowAddEmployeeModal(false);
    } catch (err) {
      console.error('Failed to add employee:', err);
      alert('Failed to create employee. Please try again.');
    }
  };

  const handleAddTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket)
      });
      const created = await res.json();
      setTickets([...tickets, created]);
      setShowAddTicketModal(false);
    } catch (err) {
      console.error('Failed to add ticket:', err);
      alert('Failed to create ticket. Please try again.');
    }
  };

  const handleAddAccount = async (accountData) => {
    try {
      const res = await authFetch(`${API_BASE}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData)
      });
      const created = await res.json();
      setAccounts(prev => [...prev, created]);
      return created;
    } catch (err) {
      console.error('Failed to add account:', err);
    }
  };

  const handleAddRole = async (roleData) => {
    try {
      const res = await authFetch(`${API_BASE}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData)
      });
      const created = await res.json();
      setRoles(prev => [...prev, created]);
      return created;
    } catch (err) {
      console.error('Failed to add role:', err);
    }
  };

  const handleAddQuote = async (quoteData) => {
    try {
      const res = await authFetch(`${API_BASE}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
      });
      const created = await res.json();
      setQuotes([created, ...quotes]);
      return created;
    } catch (err) {
      console.error('Failed to create quote');
    }
  };

  const handleUpdateQuote = async (id, quoteData) => {
    try {
      const res = await authFetch(`${API_BASE}/quotes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
      });
      const updated = await res.json();
      setQuotes(quotes.map(q => q.id === id ? updated : q));
      return updated;
    } catch (err) {
      console.error('Failed to update quote');
    }
  };

  const handleDeleteQuote = async (id) => {
    try {
      await authFetch(`${API_BASE}/quotes/${id}`, { method: 'DELETE' });
      setQuotes(quotes.filter(q => q.id !== id));
    } catch (err) {
      console.error('Failed to delete quote');
    }
  };

  const handleAddProposal = async (proposalData) => {
    try {
      const res = await authFetch(`${API_BASE}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposalData)
      });
      const created = await res.json();
      setProposals([created, ...proposals]);
      return created;
    } catch (err) {
      console.error('Failed to create proposal');
    }
  };

  const handleUpdateProposal = async (id, proposalData) => {
    try {
      const res = await authFetch(`${API_BASE}/proposals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposalData)
      });
      const updated = await res.json();
      setProposals(proposals.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      console.error('Failed to update proposal');
    }
  };

  const handleDeleteProposal = async (id) => {
    try {
      await authFetch(`${API_BASE}/proposals/${id}`, { method: 'DELETE' });
      setProposals(proposals.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete proposal');
    }
  };

  const handleAddAutomation = async (ruleData) => {
    try {
      const res = await authFetch(`${API_BASE}/automations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleData)
      });
      const created = await res.json();
      setAutomations([created, ...automations]);
      return created;
    } catch (err) {
      console.error('Failed to create automation');
    }
  };

  const handleUpdateAutomation = async (id, ruleData) => {
    try {
      const res = await authFetch(`${API_BASE}/automations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleData)
      });
      const updated = await res.json();
      setAutomations(automations.map(a => a.id === id ? updated : a));
      return updated;
    } catch (err) {
      console.error('Failed to update automation');
    }
  };

  const handleDeleteAutomation = async (id) => {
    try {
      await authFetch(`${API_BASE}/automations/${id}`, { method: 'DELETE' });
      setAutomations(automations.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to delete automation');
    }
  };

  const handleAddArticle = async (articleData) => {
    try {
      const res = await authFetch(`${API_BASE}/knowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData)
      });
      const created = await res.json();
      setArticles([created, ...articles]);
      return created;
    } catch (err) {
      console.error('Failed to create article');
    }
  };

  const handleDeleteArticle = async (id) => {
    try {
      await authFetch(`${API_BASE}/knowledge/${id}`, { method: 'DELETE' });
      setArticles(articles.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to delete article');
    }
  };

  const handleAddInvoice = async (invoiceData) => {
    try {
      const res = await authFetch(`${API_BASE}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });
      const created = await res.json();
      setInvoices([created, ...invoices]);
      return created;
    } catch (err) {
      console.error('Failed to add invoice:', err);
      alert('Failed to create invoice. Please try again.');
    }
  };

  const handleAddTaskGlobal = async (taskData) => {
    try {
      const res = await authFetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      const created = await res.json();
      setTasks([created, ...tasks]);
      return created;
    } catch (err) {
      console.error('Failed to add task:', err);
      alert('Failed to create task. Please try again.');
    }
  };

  const handleAddEvent = async (eventData) => {
    try {
      const res = await authFetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      const created = await res.json();
      setEvents([created, ...events]);
      return created;
    } catch (err) {
      console.error('Failed to add event:', err);
      alert('Failed to create event. Please try again.');
    }
  };

  const handleUpdateSettings = async (updatedFields) => {
    const nextSettings = { ...settings, ...updatedFields };
    setSettings(nextSettings);
    try {
      await authFetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextSettings)
      });
    } catch (err) {
      console.log('Offline update done.');
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await authFetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData // do not set Content-Type, browser will set it with boundary
      });
      const data = await res.json();
      if (data.success) {
        return data.url;
      }
      return null;
    } catch (err) {
      console.error('File upload failed:', err);
      return null;
    }
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    if (!selectedLead) return;
    if (selectedLead.id === 'new') {
      try {
        const res = await authFetch(`${API_BASE}/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedLead)
        });
        const created = await res.json();
        setLeads([created, ...leads]);
        setSelectedLead(null);
      } catch (err) {
        console.error('Failed to create lead:', err);
        alert('Failed to create lead. Please try again.');
      }
    } else {
      try {
        const res = await authFetch(`${API_BASE}/leads/${selectedLead.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedLead)
        });
        const updated = await res.json();
        setLeads(leads.map(l => l.id === updated.id ? updated : l));
        setSelectedLead(null);
      } catch (err) {
        setLeads(leads.map(l => l.id === selectedLead.id ? selectedLead : l));
        setSelectedLead(null);
      }
    }
  };

  const handleAdvanceStage = () => {
    if (!selectedLead) return;
    const stages = ['New', 'Prospecting', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted'];
    const currentIdx = Math.max(0, stages.indexOf(selectedLead.status || 'New'));
    const nextIdx = (currentIdx + 1) % stages.length;
    setSelectedLead({ ...selectedLead, status: stages[nextIdx] });
  };

  const handleAddNote = async (noteText) => {
    if (!selectedLead || !noteText.trim()) return;
    const leadId = selectedLead.id;
    try {
      const res = await authFetch(`${API_BASE}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Note',
          description: noteText,
          leadId
        })
      });
      const data = await res.json();
      
      const currentNotes = leadNotes[leadId] || [];
      const newNote = {
        id: data.id,
        text: data.description,
        timestamp: new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - Just now'
      };
      setLeadNotes({
        ...leadNotes,
        [leadId]: [newNote, ...currentNotes]
      });
      setNoteInput('');
    } catch (err) {
      console.error('Failed to add note:', err);
      alert('Failed to save note. Please try again.');
    }
  };

  const handleAddTask = () => {
    if (!selectedLead) return;
    const taskName = window.prompt('Enter task name:');
    if (!taskName || !taskName.trim()) return;
    const leadId = selectedLead.id;
    const currentTasks = leadTasks[leadId] || [];
    const newTask = {
      id: Math.random().toString(),
      name: taskName,
      status: 'pending'
    };
    setLeadTasks({
      ...leadTasks,
      [leadId]: [newTask, ...currentTasks]
    });
  };

  const handleMarkCallDone = () => {
    if (!selectedLead) return;
    setCompletedCalls({
      ...completedCalls,
      [selectedLead.id]: true
    });
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await authFetch(`${API_BASE}/leads/${id}`, { method: 'DELETE' });
      setLeads(leads.filter(l => l.id !== id));
      setSelectedLead(null);
    } catch (err) {
      setLeads(leads.filter(l => l.id !== id));
      setSelectedLead(null);
    }
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    if (!selectedAccount) return;
    try {
      const res = await authFetch(`${API_BASE}/accounts/${selectedAccount.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedAccount)
      });
      const updated = await res.json();
      setAccounts(accounts.map(a => a.id === updated.id ? updated : a));
      setSelectedAccount(null);
      setShowEditAccountModal(false);
    } catch (err) {
      setAccounts(accounts.map(a => a.id === selectedAccount.id ? selectedAccount : a));
      setSelectedAccount(null);
      setShowEditAccountModal(false);
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    try {
      const res = await authFetch(`${API_BASE}/employees/${selectedEmployee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedEmployee)
      });
      const updated = await res.json();
      setEmployees(employees.map(emp => emp.id === updated.id ? updated : emp));
      setSelectedEmployee(null);
    } catch (err) {
      setEmployees(employees.map(emp => emp.id === selectedEmployee.id ? selectedEmployee : emp));
      setSelectedEmployee(null);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await authFetch(`${API_BASE}/employees/${id}`, { method: 'DELETE' });
      setEmployees(employees.filter(emp => emp.id !== id));
      setSelectedEmployee(null);
    } catch (err) {
      setEmployees(employees.filter(emp => emp.id !== id));
      setSelectedEmployee(null);
    }
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    try {
      const res = await authFetch(`${API_BASE}/tickets/${selectedTicket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedTicket)
      });
      const updated = await res.json();
      setTickets(tickets.map(t => t.id === updated.id ? updated : t));
      setSelectedTicket(null);
    } catch (err) {
      setTickets(tickets.map(t => t.id === selectedTicket.id ? selectedTicket : t));
      setSelectedTicket(null);
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!window.confirm('Are you sure you want to delete this support ticket?')) return;
    try {
      await authFetch(`${API_BASE}/tickets/${id}`, { method: 'DELETE' });
      setTickets(tickets.filter(t => t.id !== id));
      setSelectedTicket(null);
    } catch (err) {
      setTickets(tickets.filter(t => t.id !== id));
      setSelectedTicket(null);
    }
  };

  const handleExportCSV = (data, filename = 'export.csv') => {
    if (!data || !data.length) return alert('No data to export!');
    const keys = Object.keys(data[0]);
    const headers = keys.join(',');
    const rows = data.map(row => 
      keys.map(key => {
        const str = String(row[key] ?? '').replace(/"/g, '""');
        return `"${str}"`;
      }).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = (title: string, data: any[], filename = 'export.pdf') => {
    if (!data || !data.length) return alert('No data to export!');
    const doc = new jsPDF();
    doc.text(title, 14, 15);
    
    const keys = Object.keys(data[0]).filter(k => k !== 'id' && k !== 'tenantId' && k !== 'ownerId');
    const head = [keys.map(k => k.toUpperCase())];
    const body = data.map(row => keys.map(k => String(row[k] ?? '')));

    autoTable(doc, {
      head,
      body,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [99, 102, 241] }
    });

    doc.save(filename);
  };

  const handleImportCSV = (e, moduleType) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length < 2) return alert('CSV must have header and at least 1 data row!');
        
        // Simple CSV parser
        const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());
        const importedItems = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.replace(/^["']|["']$/g, '').trim());
          const obj = {};
          headers.forEach((header, idx) => {
            obj[header] = values[idx] || '';
          });
          importedItems.push(obj);
        }

        // Post each item to the server
        for (const item of importedItems) {
          const endpoint = `${API_BASE}/${moduleType}`;
          try {
            const res = await authFetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item)
            });
            const created = await res.json();
            if (moduleType === 'leads') setLeads(prev => [created, ...prev]);
            else if (moduleType === 'employees') setEmployees(prev => [...prev, created]);
            else if (moduleType === 'tickets') setTickets(prev => [...prev, created]);
          } catch (err) {
            console.error(`Failed to import record:`, err);
          }
        }
        alert(`Successfully imported ${importedItems.length} records!`);
      } catch (err) {
        alert('Failed to parse CSV file.');
      }
    };
    reader.readAsText(file);
  };

  const handlePrintRecord = (title, record) => {
    const printWindow = window.open('', '_blank');
    const fieldsHtml = Object.entries(record)
      .filter(([k]) => k !== 'id' && k !== 'tenantId' && k !== 'ownerId')
      .map(([key, val]) => `
        <div style="margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
          <strong style="text-transform: capitalize; color: #555;">${key}:</strong>
          <span style="float: right; color: #111;">${val ?? 'N/A'}</span>
        </div>
      `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Preview - ${title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; }
            .card { border: 1px solid #ccc; padding: 24px; border-radius: 8px; max-width: 600px; margin: 0 auto; }
            .header { border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 24px; text-align: center; }
            .btn-print { background: #6366f1; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-bottom: 20px; }
            @media print { .btn-print { display: none; } }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <button class="btn-print" onclick="window.print()">Print Document</button>
          </div>
          <div class="card">
            <div class="header">
              <h2 style="margin: 0; color: #333;">VGROWCRM - ${title} Record</h2>
              <p style="margin: 4px 0 0 0; color: #777;">Discover First Step Private Limited</p>
            </div>
            <div>${fieldsHtml}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const globalSearch = async (query: string) => {
    try {
      const res = await authFetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
      return await res.json();
    } catch (err) {
      return { leads: [], companies: [], contacts: [] };
    }
  };

  return (
    <AppContext.Provider value={{
      API_BASE, authFetch,
      activeTab, setActiveTab,
      subTab, setSubTab,
      isDarkMode, setIsDarkMode,
      token, setToken,
      user, setUser,
      handleLogin, handleRegister, handleLogout,
      realtimeWhatsAppMessages, setRealtimeWhatsAppMessages,
      leads, setLeads, accounts, setAccounts, activities, setActivities, communications, setCommunications, products, setProducts,
      employees, setEmployees, tickets, setTickets, roles, setRoles, quotes, setQuotes,
      proposals, setProposals, invoices, setInvoices, tasks, setTasks, events, setEvents,
      settings, setSettings,
      showAddLeadModal, setShowAddLeadModal, showAddEmployeeModal, setShowAddEmployeeModal,
      showAddTicketModal, setShowAddTicketModal, showAddRoleModal, setShowAddRoleModal,
      showNewQuoteEditor, setShowNewQuoteEditor, showNewProposalModal, setShowNewProposalModal,
      showInvoicePaymentModal, setShowInvoicePaymentModal, showNotification, setShowNotification, showCopilotDrawer, setShowCopilotDrawer,
      selectedLead, setSelectedLead, selectedEmployee, setSelectedEmployee, selectedTicket, setSelectedTicket,
      leadDetailTab, setLeadDetailTab, leadNotes, setLeadNotes, leadTasks, setLeadTasks,
      completedCalls, setCompletedCalls, noteInput, setNoteInput,
      selectedAccount, setSelectedAccount, showEditAccountModal, setShowEditAccountModal,
      newLead, setNewLead, newEmployee, setNewEmployee, newTicket, setNewTicket, newRole, setNewRole,
      quickNoteText, setQuickNoteText, quickNotes, setQuickNotes,
      fetchQuotes, fetchProposals, fetchInvoices, fetchTasks, fetchEvents,
      fetchLeads, fetchAccounts, fetchActivities, fetchCommunications, fetchProducts, fetchEmployees, fetchTickets, fetchRoles, fetchSettings,
      fetchCustomModules, customModules, setCustomModules,
      automations, fetchAutomations, handleAddAutomation, handleUpdateAutomation, handleDeleteAutomation,
      articles, fetchArticles, handleAddArticle, handleDeleteArticle,
      handleAddLead, handleAddEmployee, handleAddTicket, handleUpdateSettings, handleUpdateLead, handleAddActivity, handleAddCommunication, handleAddProduct, handleUpdateProduct, handleDeleteProduct,
      handleAdvanceStage, handleAddNote, handleAddTask, handleMarkCallDone, handleDeleteLead,
      handleUpdateAccount, handleUpdateEmployee, handleDeleteEmployee, handleUpdateTicket,
      handleDeleteTicket, handleExportCSV, handleExportPDF, handleImportCSV, handlePrintRecord, handleFileUpload,
      handleAddQuote, handleUpdateQuote, handleDeleteQuote,
      handleAddProposal, handleUpdateProposal, handleDeleteProposal,
      handleAddInvoice, handleAddTaskGlobal, handleAddEvent,
      handleAddAccount, handleAddRole,
      showMobileSidebar, setShowMobileSidebar,
      globalSearch,
      tenantBranding, setTenantBranding
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
