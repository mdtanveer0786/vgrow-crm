const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');
const langchainService = require('../services/langchainService');

exports.getCallLogs = asyncHandler(async (req, res) => {
  const calls = await prisma.callLog.findMany({
    where: { organizationId: req.tenantId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(calls);
});

exports.createCallLog = asyncHandler(async (req, res) => {
  const { clientName, duration, notes } = req.body;
  if (!clientName) {
    res.status(400);
    throw new Error('Client name is required');
  }

  const call = await prisma.callLog.create({
    data: {
      organizationId: req.tenantId,
      clientName,
      duration: duration ? parseInt(duration) : 0,
      notes
    }
  });

  res.status(201).json(call);
});

exports.summarizeCall = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const call = await prisma.callLog.findFirst({
    where: { id, organizationId: req.tenantId }
  });

  if (!call) {
    res.status(404);
    throw new Error('Call log not found');
  }

  if (!call.notes) {
    return res.json({ summary: 'No call transcript notes available to summarize.' });
  }

  const query = "Summarize the key takeaways, action items, and mood of this sales call based on the provided notes/transcript. Output clear bullet points.";
  const context = { transcript: call.notes, client: call.clientName };

  const summaryText = await langchainService.askCopilot(query, context, []);

  const updated = await prisma.callLog.update({
    where: { id },
    data: { summary: summaryText }
  });

  res.json({ summary: updated.summary });
});
