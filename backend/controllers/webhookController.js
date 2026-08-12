const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');
const socketService = require('../services/socketService');

// Round robin assignment logic
const getNextAvailableUser = async (tenantId) => {
  const activeUsers = await prisma.user.findMany({
    where: { organizationId: tenantId, status: 'Active' },
    orderBy: { id: 'asc' }
  });

  if (activeUsers.length === 0) {
    return null;
  }

  const lastLead = await prisma.lead.findFirst({
    where: { organizationId: tenantId },
    orderBy: { createdAt: 'desc' }
  });

  let assignedUserId = activeUsers[0].id;

  if (lastLead && lastLead.ownerId) {
    const lastUserIndex = activeUsers.findIndex(u => u.id === lastLead.ownerId);
    if (lastUserIndex !== -1 && lastUserIndex < activeUsers.length - 1) {
      assignedUserId = activeUsers[lastUserIndex + 1].id;
    }
  }

  return assignedUserId;
};

// IndiaMART Webhook
exports.indiamartWebhook = asyncHandler(async (req, res) => {
  const tenantId = req.tenantId || req.query.tenantId;
  
  if (!tenantId) {
    return res.status(400).json({ success: false, message: 'tenantId is required' });
  }

  // Parse IndiaMART payload
  // Usually IndiaMART sends form data or JSON with keys like SENDERNAME, SENDERMOBILE
  const name = req.body.SENDERNAME || req.body.senderName || req.body.name || 'Unknown IndiaMART Lead';
  const phone = req.body.SENDERMOBILE || req.body.senderMobile || req.body.mobile || '';
  const email = req.body.SENDEREMAIL || req.body.senderEmail || req.body.email || null;
  const company = req.body.GLUSR_USR_COMPANYNAME || req.body.company || null;
  
  const assignedUserId = await getNextAvailableUser(tenantId);
  
  if (!assignedUserId) {
    return res.status(400).json({ success: false, message: 'No active users found to assign the lead' });
  }

  const newLead = await prisma.lead.create({
    data: {
      organizationId: tenantId,
      ownerId: assignedUserId,
      name,
      phone,
      email,
      source: 'IndiaMART',
      status: 'New'
    }
  });

  // Emit socket event for real-time notification
  socketService.emitToOrganization(tenantId, 'new_lead', newLead);

  return res.status(201).json({ success: true, lead: newLead });
});

// JustDial Webhook
exports.justdialWebhook = asyncHandler(async (req, res) => {
  const tenantId = req.tenantId || req.query.tenantId;
  
  if (!tenantId) {
    return res.status(400).json({ success: false, message: 'tenantId is required' });
  }

  // Parse JustDial payload
  const name = req.body.name || req.body.lead_name || 'Unknown JustDial Lead';
  const phone = req.body.mobile || req.body.phone || req.body.lead_contact || '';
  const email = req.body.email || req.body.lead_email || null;
  const city = req.body.city || req.body.lead_city || null;
  
  const assignedUserId = await getNextAvailableUser(tenantId);
  
  if (!assignedUserId) {
    return res.status(400).json({ success: false, message: 'No active users found to assign the lead' });
  }

  const newLead = await prisma.lead.create({
    data: {
      organizationId: tenantId,
      ownerId: assignedUserId,
      name,
      phone,
      email,
      city,
      source: 'JustDial',
      status: 'New'
    }
  });

  // Emit socket event for real-time notification
  socketService.emitToOrganization(tenantId, 'new_lead', newLead);

  return res.status(201).json({ success: true, lead: newLead });
});
