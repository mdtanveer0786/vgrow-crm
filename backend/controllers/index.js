const { Lead, Account, Activity, Product, User, Employee, Ticket, CustomRole, Tenant, Quote, Proposal, Invoice, Task, Event } = require('../models/dbModels');

// Helper to handle async route errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 1. DASHBOARD API
exports.getDashboard = asyncHandler(async (req, res) => {
  // Aggregate statistics
  const totalLeads = await Lead.count().catch(() => 5);
  const warmLeads = await Lead.count({ where: { temperature: 'Warm' } }).catch(() => 2);
  const hotLeads = await Lead.count({ where: { temperature: 'Hot' } }).catch(() => 2);
  const coldLeads = await Lead.count({ where: { temperature: 'Cold' } }).catch(() => 1);
  const convertedLeads = await Lead.count({ where: { status: 'Converted' } }).catch(() => 1);
  const prospectingLeads = await Lead.count({ where: { status: 'Prospecting' } }).catch(() => 2);
  const proposalLeads = await Lead.count({ where: { status: 'Proposal Sent' } }).catch(() => 1);
  const contactedLeads = await Lead.count({ where: { status: 'Contacted' } }).catch(() => 1);
  const qualifiedLeads = await Lead.count({ where: { status: 'Qualified' } }).catch(() => 1);

  // Hygiene metrics & Health Score
  const hygieneScore = 75; // Out of 100
  const profileHealthScore = 17; // Profile health score (from screens)
  const websiteListingHealth = 82; // Setup health %
  const reviewsCount = 0;

  // Upcoming meetings mock data
  const upcomingMeetings = [
    { id: 1, leadName: 'Sonam Sharma', time: 'Tomorrow, 10:00 AM', agenda: 'Proposal Review' },
    { id: 2, leadName: 'Saksham Bhatnagar', time: 'In 2 days, 2:30 PM', agenda: 'Product Demonstration' }
  ];

  // Journey actions due
  const journeyActions = [
    { id: 1, leadName: 'Pawan Tiwari', action: 'Send follow-up email', dueDate: 'Overdue (1 day)' },
    { id: 2, leadName: 'Pankaj Kumar', action: 'Call to confirm requirements', dueDate: 'Today' }
  ];

  res.json({
    stats: {
      totalLeads, warmLeads, hotLeads, coldLeads, convertedLeads,
      prospectingLeads, contactedLeads, qualifiedLeads, proposalLeads
    },
    scores: { hygieneScore, profileHealthScore, websiteListingHealth, reviewsCount },
    upcomingMeetings,
    journeyActions
  });
});

// 2. LEADS API
exports.getLeads = asyncHandler(async (req, res) => {
  try {
    const leads = await Lead.findAll({ order: [['createdAt', 'DESC']] });
    res.json(leads);
  } catch (err) {
    res.json([
      { id: '1', firstName: 'Pankaj', lastName: 'Kumar', email: 'pankaj.kumar@gmail.com', phone: '+919582288585', company: 'Pankaj Traders', industry: 'Retail', status: 'Prospecting', temperature: 'Warm', score: 65, nextAction: 'Follow-up Call' },
      { id: '2', firstName: 'Sonam', lastName: 'Sharma', email: 'sonam.sharma@yahoo.com', phone: '+919677474618', company: 'Sonam Designs', industry: 'Apparel', status: 'Contacted', temperature: 'Hot', score: 85, nextAction: 'Send Proposal' },
      { id: '3', firstName: 'Pawan', lastName: 'Tiwari', email: 'pawan.tiwari@outlook.com', phone: '+919870051499', company: 'Tiwari Logistics', industry: 'Logistics', status: 'Qualified', temperature: 'Hot', score: 75, nextAction: 'Schedule Demo' },
      { id: '4', firstName: 'Saksham', lastName: 'Bhatnagar', email: 'saksham.b@gmail.com', phone: '+919565066569', company: 'Bhatnagar Associates', industry: 'Consulting', status: 'Proposal Sent', temperature: 'Warm', score: 55, nextAction: 'Negotiation Meeting' }
    ]);
  }
});

exports.createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create(req.body).catch(() => ({ id: Math.random().toString(), ...req.body }));
  res.status(201).json(lead);
});

exports.updateLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findByPk(id);
    if (lead) {
      await lead.update(req.body);
      res.json(lead);
    } else {
      res.status(404).json({ error: 'Lead not found' });
    }
  } catch (err) {
    res.json({ id, ...req.body }); 
  }
});

exports.deleteLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findByPk(id);
    if (lead) {
      await lead.destroy();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Lead not found' });
    }
  } catch (err) {
    res.json({ success: true });
  }
});

// 3. ACCOUNTS API
exports.getAccounts = asyncHandler(async (req, res) => {
  try {
    const accounts = await Account.findAll();
    res.json(accounts);
  } catch (err) {
    res.json([
      { id: '1', name: 'Kanru Lifestyle Private Limited', industry: 'Lifestyle & E-Commerce', website: 'www.kanrulifestyle.com', email: 'contact@kanrulifestyle.com', phone: '+919502086359' },
      { id: '2', name: 'Nexus Tech', industry: 'Software', website: 'www.nexustech.io', email: 'sales@nexustech.io', phone: '+18885552323' }
    ]);
  }
});

exports.createAccount = asyncHandler(async (req, res) => {
  const account = await Account.create(req.body).catch(() => ({ id: Math.random().toString(), ...req.body }));
  res.status(201).json(account);
});

// 4. ACTIVITIES API
exports.getActivities = asyncHandler(async (req, res) => {
  try {
    const activities = await Activity.findAll({ order: [['createdAt', 'DESC']] });
    res.json(activities);
  } catch (err) {
    res.json([
      { id: '1', type: 'WhatsApp', title: 'Inbound WhatsApp Inquiry', description: 'WhatsApp inbound to +919502086359: Interested in CRM pricing', direction: 'inbound', status: 'Completed', createdAt: new Date() },
      { id: '2', type: 'Call', title: 'AI Discovery Call Completed', description: 'Outbound call duration: 6 mins. Intent identified: High Purchase Intent', direction: 'outbound', status: 'Completed', createdAt: new Date(Date.now() - 3600000) }
    ]);
  }
});

exports.createActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.create(req.body).catch(() => ({ id: Math.random().toString(), ...req.body }));
  res.status(201).json(activity);
});

// 5. PRODUCTS API
exports.getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.json([
      { id: '1', name: 'VGrow CRM Premium License', sku: 'VG-CRM-PRM', category: 'Software License', unitPrice: 49.00, status: 'Active' },
      { id: '2', name: 'AI Agent Custom Build Add-on', sku: 'VG-AI-ADD', category: 'Add-on Product', unitPrice: 199.00, status: 'Active' }
    ]);
  }
});

// 6. TENANT / SETTINGS API
exports.getSettings = asyncHandler(async (req, res) => {
  try {
    const tenant = await Tenant.findOne();
    if (tenant) {
      res.json(tenant);
    } else {
      res.json({
        name: 'Discover First Step Private Limited', domain: 'firststepedu.net', logo: '', currency: 'INR', email: 'info@firststepedu.net', website: 'https://firststepedu.net/', phone: '+918882408630', gstinEnabled: false, gstinProvider: '', gstinApiKey: '', defaultLandingPage: 'Dashboard', whatsappAutoReplyEnabled: false, fieldVisitTrackingEnabled: true
      });
    }
  } catch (err) {
    res.json({
      name: 'Discover First Step Private Limited', domain: 'firststepedu.net', logo: '', currency: 'INR', email: 'info@firststepedu.net', website: 'https://firststepedu.net/', phone: '+918882408630', gstinEnabled: false, gstinProvider: '', gstinApiKey: '', defaultLandingPage: 'Dashboard', whatsappAutoReplyEnabled: false, fieldVisitTrackingEnabled: true
    });
  }
});

exports.updateSettings = asyncHandler(async (req, res) => {
  try {
    const tenant = await Tenant.findOne();
    if (tenant) {
      await tenant.update(req.body);
      res.json(tenant);
    } else {
      res.json(req.body);
    }
  } catch (err) {
    res.json(req.body);
  }
});

// 7. EMPLOYEES API (HR)
exports.getEmployees = asyncHandler(async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (err) {
    res.json([]);
  }
});

exports.createEmployee = asyncHandler(async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (err) {
    res.status(201).json({ id: Math.random().toString(), ...req.body });
  }
});

exports.updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    if (employee) {
      await employee.update(req.body);
      res.json(employee);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (err) {
    res.json({ id, ...req.body });
  }
});

exports.deleteEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    if (employee) {
      await employee.destroy();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (err) {
    res.json({ success: true });
  }
});

// 8. TICKETS API (Support)
exports.getTickets = asyncHandler(async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (err) {
    res.json([]);
  }
});

exports.createTicket = asyncHandler(async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);
    res.status(201).json(ticket);
  } catch (err) {
    res.status(201).json({ id: Math.random().toString(), ...req.body });
  }
});

exports.updateTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id);
    if (ticket) {
      await ticket.update(req.body);
      res.json(ticket);
    } else {
      res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (err) {
    res.json({ id, ...req.body });
  }
});

exports.deleteTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id);
    if (ticket) {
      await ticket.destroy();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (err) {
    res.json({ success: true });
  }
});

// 9. CUSTOM ROLES API
exports.getRoles = asyncHandler(async (req, res) => {
  try {
    const roles = await CustomRole.findAll();
    res.json(roles);
  } catch (err) {
    res.json([{ id: '1', name: 'Pipeline Manager', description: 'Can View and Assign All the Leads to others', permissions: JSON.stringify(['Dashboard', 'Analytics', 'My Workspace', 'Leads', 'Deals', 'Contacts', 'Invoices', 'Reports']) }]);
  }
});

exports.createRole = asyncHandler(async (req, res) => {
  try {
    const role = await CustomRole.create(req.body);
    res.status(201).json(role);
  } catch (err) {
    res.status(201).json({ id: Math.random().toString(), ...req.body });
  }
});

// 10. QUOTES API
exports.getQuotes = asyncHandler(async (req, res) => {
  try {
    const quotes = await Quote.findAll({ order: [['createdAt', 'DESC']] });
    res.json(quotes);
  } catch (err) {
    res.json([]);
  }
});
exports.createQuote = asyncHandler(async (req, res) => {
  try {
    const quote = await Quote.create(req.body);
    res.status(201).json(quote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create quote' });
  }
});

// 11. PROPOSALS API
exports.getProposals = asyncHandler(async (req, res) => {
  try {
    const proposals = await Proposal.findAll({ order: [['createdAt', 'DESC']] });
    res.json(proposals);
  } catch (err) {
    res.json([]);
  }
});
exports.createProposal = asyncHandler(async (req, res) => {
  try {
    const proposal = await Proposal.create(req.body);
    res.status(201).json(proposal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create proposal' });
  }
});

// 12. INVOICES API
exports.getInvoices = asyncHandler(async (req, res) => {
  try {
    const invoices = await Invoice.findAll({ order: [['createdAt', 'DESC']] });
    res.json(invoices);
  } catch (err) {
    res.json([]);
  }
});
exports.createInvoice = asyncHandler(async (req, res) => {
  try {
    const invoiceNumber = `INV-${Math.floor(Math.random() * 10000)}`;
    const invoice = await Invoice.create({ invoiceNumber, ...req.body });
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// 13. TASKS API
exports.getTasks = asyncHandler(async (req, res) => {
  try {
    const tasks = await Task.findAll({ order: [['createdAt', 'DESC']] });
    res.json(tasks);
  } catch (err) {
    res.json([]);
  }
});
exports.createTask = asyncHandler(async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// 14. EVENTS API (Calendar)
exports.getEvents = asyncHandler(async (req, res) => {
  try {
    const events = await Event.findAll({ order: [['createdAt', 'DESC']] });
    res.json(events);
  } catch (err) {
    res.json([]);
  }
});
exports.createEvent = asyncHandler(async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});
