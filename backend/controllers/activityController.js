const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

exports.getActivities = asyncHandler(async (req, res) => {
  const { entityId } = req.query;
  const whereClause = {
    organizationId: req.tenantId,
    ...(entityId ? { entityId } : {})
  };

  const activities = await prisma.activity.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  });
  // Map fields to match legacy/frontend expects: (type instead of activityType)
  res.json(activities.map(a => ({
    id: a.id,
    type: a.activityType,
    title: `${a.activityType} activity logged`,
    description: a.description,
    direction: 'outbound',
    status: 'Completed',
    createdAt: a.createdAt
  })));
});

exports.createActivity = asyncHandler(async (req, res) => {
  const { type, description, leadId } = req.body;
  const activity = await prisma.activity.create({
    data: {
      organizationId: req.tenantId,
      userId: req.user.id,
      entityType: 'Lead',
      entityId: leadId || 'unassigned',
      activityType: type || 'Note',
      description: description || ''
    }
  });
  res.status(201).json({
    id: activity.id,
    type: activity.activityType,
    title: `${activity.activityType} activity logged`,
    description: activity.description,
    direction: 'outbound',
    status: 'Completed',
    createdAt: activity.createdAt
  });
});
