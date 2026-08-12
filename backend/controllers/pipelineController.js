const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all pipelines with stages
// @route   GET /api/pipelines
// @access  Private
const getPipelines = asyncHandler(async (req, res) => {
  const pipelines = await prisma.pipeline.findMany({
    where: { organizationId: req.tenantId },
    include: {
      stages: {
        orderBy: { position: 'asc' }
      }
    }
  });
  res.status(200).json(pipelines);
});

// @desc    Create a pipeline with default stages
// @route   POST /api/pipelines
// @access  Private
const createPipeline = asyncHandler(async (req, res) => {
  const { name, isDefault } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Please provide pipeline name' });
  }

  const defaultStages = [
    { name: 'Lead In', position: 1, probability: 10 },
    { name: 'Qualified', position: 2, probability: 30 },
    { name: 'Proposal', position: 3, probability: 50 },
    { name: 'Negotiation', position: 4, probability: 80 },
    { name: 'Won', position: 5, probability: 100 },
    { name: 'Lost', position: 6, probability: 0 }
  ];

  const pipeline = await prisma.pipeline.create({
    data: {
      organizationId: req.tenantId,
      name,
      isDefault: isDefault || false,
      stages: {
        create: defaultStages
      }
    },
    include: {
      stages: {
        orderBy: { position: 'asc' }
      }
    }
  });

  res.status(201).json(pipeline);
});

// @desc    Add stage to pipeline
// @route   POST /api/pipelines/:pipelineId/stages
// @access  Private
const createStage = asyncHandler(async (req, res) => {
  const { name, position, probability } = req.body;
  const { pipelineId } = req.params;

  if (!name || position === undefined || probability === undefined) {
    return res.status(400).json({ message: 'Please provide name, position, and probability' });
  }

  const pipelineExists = await prisma.pipeline.findFirst({
    where: { id: pipelineId, organizationId: req.tenantId }
  });

  if (!pipelineExists) {
    return res.status(404).json({ message: 'Pipeline not found' });
  }

  const stage = await prisma.stage.create({
    data: {
      pipelineId,
      name,
      position,
      probability
    }
  });

  res.status(201).json(stage);
});

// @desc    Update stage
// @route   PUT /api/stages/:id
// @access  Private
const updateStage = asyncHandler(async (req, res) => {
  const stage = await prisma.stage.findFirst({
    where: { id: req.params.id },
    include: { pipeline: true }
  });

  if (!stage || stage.pipeline.organizationId !== req.tenantId) {
    return res.status(404).json({ message: 'Stage not found' });
  }

  const updatedStage = await prisma.stage.update({
    where: { id: req.params.id },
    data: req.body
  });

  res.status(200).json(updatedStage);
});

// @desc    Delete stage
// @route   DELETE /api/stages/:id
// @access  Private
const deleteStage = asyncHandler(async (req, res) => {
  const stage = await prisma.stage.findFirst({
    where: { id: req.params.id },
    include: { pipeline: true }
  });

  if (!stage || stage.pipeline.organizationId !== req.tenantId) {
    return res.status(404).json({ message: 'Stage not found' });
  }

  await prisma.stage.delete({
    where: { id: req.params.id }
  });

  res.status(200).json({ message: 'Stage removed' });
});

module.exports = {
  getPipelines,
  createPipeline,
  createStage,
  updateStage,
  deleteStage
};
