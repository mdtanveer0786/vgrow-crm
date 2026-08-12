const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');
const DealService = require('../services/dealService');

// @desc    Get all deals
// @route   GET /api/deals
// @access  Private
const getDeals = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, sortDesc, search } = req.query;
  
  const result = await DealService.getDeals(req.tenantId, req.user, {
    page,
    limit,
    sortBy,
    sortDesc,
    search
  });
  
  res.status(200).json(result);
});

// @desc    Get single deal
// @route   GET /api/deals/:id
// @access  Private
const getDeal = asyncHandler(async (req, res) => {
  const deal = await prisma.deal.findFirst({
    where: { 
      id: req.params.id,
      organizationId: req.tenantId,
      deletedAt: null
    },
    include: {
      pipeline: true,
      stage: true,
      contact: true,
      company: true,
      owner: true
    }
  });

  if (!deal) {
    return res.status(404).json({ message: 'Deal not found' });
  }

  res.status(200).json(deal);
});

// @desc    Create a deal
// @route   POST /api/deals
// @access  Private
const createDeal = asyncHandler(async (req, res) => {
  const { title, amount, pipelineId, stageId, companyId, contactId, currency, probability, expectedClose, status } = req.body;

  if (!title || amount === undefined || !pipelineId || !stageId) {
    return res.status(400).json({ message: 'Please provide title, amount, pipelineId, and stageId' });
  }

  const deal = await prisma.deal.create({
    data: {
      organizationId: req.tenantId,
      ownerId: req.user.id,
      title,
      amount,
      pipelineId,
      stageId,
      companyId,
      contactId,
      currency,
      probability,
      expectedClose,
      status
    }
  });

  res.status(201).json(deal);
});

// @desc    Update deal
// @route   PUT /api/deals/:id
// @access  Private
const updateDeal = asyncHandler(async (req, res) => {
  const dealExists = await prisma.deal.findFirst({
    where: { id: req.params.id, organizationId: req.tenantId }
  });

  if (!dealExists) {
    return res.status(404).json({ message: 'Deal not found' });
  }

  const updatedDeal = await prisma.deal.update({
    where: { id: req.params.id },
    data: req.body
  });

  res.status(200).json(updatedDeal);
});

// @desc    Move deal stage
// @route   PUT /api/deals/:id/move-stage
// @access  Private
const moveStage = asyncHandler(async (req, res) => {
  const { stageId, probability } = req.body;

  if (!stageId || probability === undefined) {
    return res.status(400).json({ message: 'Please provide stageId and probability' });
  }

  const dealExists = await prisma.deal.findFirst({
    where: { id: req.params.id, organizationId: req.tenantId }
  });

  if (!dealExists) {
    return res.status(404).json({ message: 'Deal not found' });
  }

  const updatedDeal = await prisma.deal.update({
    where: { id: req.params.id },
    data: {
      stageId,
      probability
    }
  });

  res.status(200).json(updatedDeal);
});

// @desc    Delete deal
// @route   DELETE /api/deals/:id
// @access  Private
const deleteDeal = asyncHandler(async (req, res) => {
  const dealExists = await prisma.deal.findFirst({
    where: { id: req.params.id, organizationId: req.tenantId }
  });

  if (!dealExists) {
    return res.status(404).json({ message: 'Deal not found' });
  }

  await prisma.deal.update({
    where: { id: req.params.id },
    data: { deletedAt: new Date() }
  });

  res.status(200).json({ message: 'Deal soft-deleted' });
});

module.exports = {
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  moveStage,
  deleteDeal
};
