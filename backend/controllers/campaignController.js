const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');
const { processCampaignQueue } = require('../services/mailQueueService');

exports.getCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await prisma.campaign.findMany({
    where: { organizationId: req.tenantId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(campaigns);
});

exports.createCampaign = asyncHandler(async (req, res) => {
  const { name, subject, category } = req.body;
  if (!name || !subject || !category) {
    res.status(400);
    throw new Error('Name, subject, and category are required');
  }

  const campaign = await prisma.campaign.create({
    data: {
      organizationId: req.tenantId,
      name,
      subject,
      category,
      status: 'Pending'
    }
  });

  // Trigger background job queue processing (non-blocking)
  processCampaignQueue(campaign.id, req.tenantId).catch(console.error);

  res.status(201).json(campaign);
});
