const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');
const langchainService = require('../services/langchainService');

// @desc    Process AI Copilot context queries using LangChain + RAG
// @route   POST /api/ai/copilot
// @access  Private
const processCopilotQuery = asyncHandler(async (req, res) => {
  const { query } = req.body;
  const orgId = req.tenantId;
  const userId = req.user.id;

  if (!query) {
    res.status(400);
    throw new Error('Please enter a query');
  }

  // 1. Gather dynamic Database Context
  const totalLeads = await prisma.lead.count({ where: { organizationId: orgId, NOT: { status: 'Archived' } } });
  const hotLeads = await prisma.lead.count({ where: { organizationId: orgId, score: { gte: 80 }, NOT: { status: 'Archived' } } });
  const warmLeads = await prisma.lead.count({ where: { organizationId: orgId, score: { gte: 50, lt: 80 }, NOT: { status: 'Archived' } } });
  
  const recentActivities = await prisma.activity.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const latestLead = await prisma.lead.findFirst({
    where: { organizationId: orgId, NOT: { status: 'Archived' } },
    orderBy: { createdAt: 'desc' }
  });

  const dbContext = {
    leadsData: {
      total: totalLeads,
      hot: hotLeads,
      warm: warmLeads
    },
    recentActivities: recentActivities.map(a => ({ type: a.activityType, desc: a.description })),
    sampleLeadName: latestLead ? latestLead.name : 'Valued Client'
  };

  // 2. Fetch Knowledge Base articles for semantic matching (RAG)
  const articles = await prisma.article.findMany({
    where: { organizationId: orgId, status: 'Published' }
  });

  // 3. Invoke LangChain Service with articles list
  const copilotResponse = await langchainService.askCopilot(query, dbContext, articles, orgId, userId);

  res.json({
    reply: copilotResponse.reply,
    actions: copilotResponse.actions,
    model: 'langchain-vgrow-rag-copilot'
  });
});

// @desc    Generate a custom email response based on tone and context
// @route   POST /api/ai/draft-reply
// @access  Private
const generateDraftReply = asyncHandler(async (req, res) => {
  const { leadName, lastMessage, tone } = req.body;
  const orgId = req.tenantId;
  const userId = req.user.id;

  if (!lastMessage) {
    res.status(400);
    throw new Error('Please enter the last message to reply to');
  }

  const query = `Draft an email response to: "${lastMessage}" representing client "${leadName || 'Client'}". Use a ${tone || 'Professional'} tone. Keep it highly relevant, warm, and concise.`;
  const context = { system: "VGrow Email Assistant" };

  const copilotResponse = await langchainService.askCopilot(query, context, [], orgId, userId);

  res.json({ draft: copilotResponse.reply });
});

// @desc    Calculate Lead Predictive Score threshold dynamically
// @route   POST /api/ai/predictive-score
// @access  Private
const calculatePredictiveScore = asyncHandler(async (req, res) => {
  const { leadId } = req.body;
  const orgId = req.tenantId;

  if (!leadId) {
    res.status(400);
    throw new Error('Please specify a leadId');
  }

  const activitiesCount = await prisma.activity.count({
    where: { organizationId: orgId, entityId: leadId }
  });

  const scoreVal = Math.min(50 + activitiesCount * 10, 95);

  const updatedLead = await prisma.lead.update({
    where: { id: leadId, organizationId: orgId },
    data: { score: scoreVal }
  });

  res.json({
    leadId: updatedLead.id,
    newScore: updatedLead.score,
    temperature: updatedLead.score >= 80 ? 'Hot' : (updatedLead.score >= 50 ? 'Warm' : 'Cold')
  });
});

module.exports = {
  processCopilotQuery,
  calculatePredictiveScore,
  generateDraftReply
};
