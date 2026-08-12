const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');
const bcrypt = require('bcryptjs');
const automationService = require('../services/automationService');

// SETTINGS
exports.getSettings = asyncHandler(async (req, res) => {
  const tenant = await prisma.organization.findUnique({ where: { id: req.tenantId } });
  if (tenant) {
    res.json(tenant);
  } else {
    res.json({ name: 'Discover First Step Private Limited', domain: 'firststepedu.net', logo: '', currency: 'INR', email: 'info@firststepedu.net', website: 'https://firststepedu.net/', phone: '+918882408630', gstinEnabled: false, gstinProvider: '', gstinApiKey: '', defaultLandingPage: 'Dashboard', whatsappAutoReplyEnabled: false, fieldVisitTrackingEnabled: true });
  }
});
exports.updateSettings = asyncHandler(async (req, res) => {
  const tenant = await prisma.organization.update({
    where: { id: req.tenantId },
    data: {
      name: req.body.name,
      timezone: req.body.timezone,
      language: req.body.language,
      currency: req.body.currency,
      status: req.body.status
    }
  });
  res.json({
    ...tenant,
    // Return parameters matching frontend settings schema checks
    email: req.body.email || 'info@vgrow.com',
    website: req.body.website || 'https://vgrow.com',
    phone: req.body.phone || '+918882408630',
    gstinEnabled: req.body.gstinEnabled ?? false,
    whatsappAutoReplyEnabled: req.body.whatsappAutoReplyEnabled ?? false,
    fieldVisitTrackingEnabled: req.body.fieldVisitTrackingEnabled ?? true
  });
});

// EMPLOYEES
exports.getEmployees = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    where: { organizationId: req.tenantId }
  });
  res.json(users.map(u => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    phone: u.phone || '+918888888888',
    role: 'Employee',
    status: u.status
  })));
});
exports.createEmployee = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password, status } = req.body;
  if (!firstName || !email || !password) {
    return res.status(400).json({ message: 'First name, email, and password are required' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      organizationId: req.tenantId,
      firstName,
      lastName: lastName || '',
      email,
      phone,
      passwordHash,
      status: status || 'Active'
    }
  });
  const { passwordHash: _, ...userData } = user;
  res.status(201).json(userData);
});
exports.updateEmployee = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, status } = req.body;
  const user = await prisma.user.update({
    where: { id: req.params.id, organizationId: req.tenantId },
    data: { firstName, lastName, email, phone, status }
  });
  const { passwordHash: _, ...userData } = user;
  res.json(userData);
});
exports.deleteEmployee = asyncHandler(async (req, res) => {
  await prisma.user.delete({
    where: { id: req.params.id, organizationId: req.tenantId }
  });
  res.json({ success: true });
});

// TICKETS
exports.getTickets = asyncHandler(async (req, res) => {
  res.json([]);
});
exports.createTicket = asyncHandler(async (req, res) => {
  const ticket = { id: Math.random().toString(), ...req.body };
  
  // Trigger automation if Priority is High
  if (ticket.priority === 'High') {
    automationService.triggerEvent(req.tenantId, 'Ticket Created (Priority = High)', ticket).catch(console.error);
  }

  res.status(201).json(ticket);
});
exports.updateTicket = asyncHandler(async (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});
exports.deleteTicket = asyncHandler(async (req, res) => {
  res.json({ success: true });
});

// ROLES
exports.getRoles = asyncHandler(async (req, res) => {
  const roles = await prisma.role.findMany({
    where: { organizationId: req.tenantId }
  });
  res.json(roles.map(r => ({
    id: r.id,
    name: r.name,
    description: r.description,
    permissions: JSON.stringify(['Dashboard', 'Leads', 'Deals', 'Contacts'])
  })));
});
exports.createRole = asyncHandler(async (req, res) => {
  const role = await prisma.role.create({
    data: {
      organizationId: req.tenantId,
      name: req.body.name,
      description: req.body.description
    }
  });
  res.status(201).json(role);
});

// INVOICES
exports.getInvoices = asyncHandler(async (req, res) => { 
  const invoices = await prisma.invoice.findMany({
    where: { organizationId: req.tenantId }
  });
  res.json(invoices); 
});
exports.createInvoice = asyncHandler(async (req, res) => { 
  const { client, clientName, amount, gstType, gstRate, dueDate } = req.body;
  const name = clientName || client || 'Quick Client';
  const baseVal = parseFloat(amount || 0);

  if (!baseVal) {
    return res.status(400).json({ message: 'Amount is required' });
  }

  const rate = parseInt(gstRate || 18);

  // Mapped calculations
  const gstVal = parseFloat(((baseVal * rate) / 100).toFixed(2));
  const grossTotal = baseVal + gstVal;

  const newInvoice = await prisma.invoice.create({
    data: {
      organizationId: req.tenantId,
      clientName: name,
      amount: grossTotal,
      status: 'Unpaid',
      dueDate: dueDate || new Date(Date.now() + 86400000 * 7).toISOString(),
      gstType: gstType || 'CGST_SGST',
      gstRate: rate,
      baseAmount: baseVal,
      gstAmount: gstVal
    }
  });

  res.status(201).json(newInvoice); 
});

// Mock endpoint for Invoice Payment webhook
exports.markInvoicePaid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const invoice = await prisma.invoice.update({
    where: { id, organizationId: req.tenantId },
    data: { status: 'Paid' }
  });

  // FIRE AUTOMATION
  automationService.triggerEvent(req.tenantId, 'Invoice Payment Received', invoice).catch(console.error);

  res.json(invoice);
});

// TASKS
exports.getTasks = asyncHandler(async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { organizationId: req.tenantId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(tasks);
});
exports.createTask = asyncHandler(async (req, res) => {
  const task = await prisma.task.create({
    data: {
      organizationId: req.tenantId,
      assignedTo: req.user.id,
      title: req.body.title,
      priority: req.body.priority || 'Medium',
      status: req.body.status || 'Pending'
    }
  });
  res.status(201).json(task);
});

// EVENTS
exports.getEvents = asyncHandler(async (req, res) => { res.json([]); });
exports.createEvent = asyncHandler(async (req, res) => { res.status(201).json({ id: Math.random().toString(), ...req.body }); });

// CUSTOM MODULES
exports.getCustomModules = asyncHandler(async (req, res) => {
  const modules = await prisma.customModule.findMany({
    where: { organizationId: req.tenantId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(modules);
});

exports.createCustomModule = asyncHandler(async (req, res) => {
  const { name, singularName, pluralName, icon, schema } = req.body;
  if (!name || !singularName || !pluralName || !schema) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const newModule = await prisma.customModule.create({
    data: {
      organizationId: req.tenantId,
      name,
      singularName,
      pluralName,
      icon: icon || 'Box',
      schema
    }
  });
  res.status(201).json(newModule);
});

// CUSTOM RECORDS
exports.getCustomRecords = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const records = await prisma.customRecord.findMany({
    where: { organizationId: req.tenantId, moduleId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(records);
});

exports.createCustomRecord = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const { data } = req.body;
  
  if (!data) {
    return res.status(400).json({ message: 'Record data is required' });
  }

  // Verify module exists
  const mod = await prisma.customModule.findFirst({ 
    where: { id: moduleId, organizationId: req.tenantId } 
  });
  
  if (!mod) return res.status(404).json({ message: 'Module not found' });

  // Validate incoming data against the module's JSON schema
  const schemaFields = Array.isArray(mod.schema) ? mod.schema : [];
  for (const field of schemaFields) {
    if (field.required && (data[field.name] === undefined || data[field.name] === null || data[field.name] === '')) {
      return res.status(400).json({ message: `Field ${field.name} is required` });
    }
  }

  const newRecord = await prisma.customRecord.create({
    data: {
      organizationId: req.tenantId,
      moduleId,
      data
    }
  });
  res.status(201).json(newRecord);
});
