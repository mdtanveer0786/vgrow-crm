const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

exports.getAutomations = asyncHandler(async (req, res) => {
  const rules = await prisma.automationRule.findMany({
    where: { organizationId: req.tenantId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(rules);
});

exports.createAutomation = asyncHandler(async (req, res) => {
  const { name, trigger, action } = req.body;
  if (!name || !trigger || !action) {
    res.status(400);
    throw new Error('Name, trigger, and action are required');
  }

  const rule = await prisma.automationRule.create({
    data: {
      organizationId: req.tenantId,
      name,
      trigger,
      action,
      active: true
    }
  });
  res.status(201).json(rule);
});

exports.updateAutomation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, trigger, action, active } = req.body;
  
  const existing = await prisma.automationRule.findFirst({
    where: { id, organizationId: req.tenantId }
  });
  
  if (!existing) {
    res.status(404);
    throw new Error('Automation rule not found');
  }

  const updated = await prisma.automationRule.update({
    where: { id },
    data: { name, trigger, action, active }
  });
  
  res.json(updated);
});

exports.deleteAutomation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.automationRule.findFirst({
    where: { id, organizationId: req.tenantId }
  });
  
  if (!existing) {
    res.status(404);
    throw new Error('Automation rule not found');
  }

  await prisma.automationRule.delete({ where: { id } });
  res.json({ message: 'Automation rule deleted' });
});
