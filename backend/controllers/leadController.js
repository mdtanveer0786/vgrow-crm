const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');
const automationService = require('../services/automationService');
const langchainService = require('../services/langchainService');
const LeadService = require('../services/leadService');

// GET /api/leads
exports.getLeads = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, sortDesc, search } = req.query;

  const result = await LeadService.getLeads(req.tenantId, req.user, {
    page,
    limit,
    sortBy,
    sortDesc,
    search
  });

  // Map fields to match legacy/frontend expects: (firstName, lastName, company instead of companyId/name combined)
  const formattedLeads = result.data.map(l => {
    const parts = l.name.split(' ');
    return {
      id: l.id,
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      email: l.email,
      phone: l.phone,
      company: l.name + ' Company', // Keep dynamic company info
      industry: l.industry || 'Other',
      status: l.status,
      source: l.source || 'Manual',
      temperature: l.score >= 80 ? 'Hot' : (l.score >= 50 ? 'Warm' : 'Cold'),
      score: l.score,
      nextAction: 'Follow-up'
    };
  });
  
  res.json({
    ...result,
    data: formattedLeads
  });
});

// POST /api/leads
exports.createLead = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, company, industry, status, score, source } = req.body;
  const leadData = {
    name: `${firstName || ''} ${lastName || ''}`.trim() || 'Unnamed Lead',
    email,
    phone,
    source: source || 'Manual',
    status: status || 'New',
    score: score ? parseInt(score) : 0,
    industry
  };

  const lead = await LeadService.createLead(req.tenantId, req.user.id, leadData);

  // FIRE AUTOMATION
  automationService.triggerEvent(req.tenantId, 'Lead Created', lead).catch(console.error);

  res.status(201).json({
    id: lead.id,
    firstName,
    lastName,
    email: lead.email,
    phone: lead.phone,
    company,
    industry: lead.industry,
    status: lead.status,
    source: lead.source,
    temperature: lead.score >= 80 ? 'Hot' : (lead.score >= 50 ? 'Warm' : 'Cold'),
    score: lead.score,
    nextAction: 'Follow-up'
  });
});

// PUT /api/leads/:id
exports.updateLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, status, score, industry, source } = req.body;
  
  const lead = await prisma.lead.update({
    where: { id, organizationId: req.tenantId },
    data: {
      name: (firstName || lastName) ? `${firstName || ''} ${lastName || ''}`.trim() : undefined,
      email,
      phone,
      status,
      score: score ? parseInt(score) : undefined,
      industry,
      source
    }
  });

  // FIRE AUTOMATION IF STATUS CHANGED
  if (status && status === 'Qualified') {
    automationService.triggerEvent(req.tenantId, 'Lead Status Changed to Qualified', lead).catch(console.error);
  } else if (status && status === 'Converted') {
    automationService.triggerEvent(req.tenantId, 'Lead Status Changed to Converted', lead).catch(console.error);
  }

  const parts = lead.name.split(' ');
  res.json({
    id: lead.id,
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
    email: lead.email,
    phone: lead.phone,
    company: lead.name + ' Company',
    industry: lead.industry,
    status: lead.status,
    source: lead.source,
    temperature: lead.score >= 80 ? 'Hot' : (lead.score >= 50 ? 'Warm' : 'Cold'),
    score: lead.score,
    nextAction: 'Follow-up'
  });
});

// DELETE /api/leads/:id
exports.deleteLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  await LeadService.deleteLead(req.tenantId, req.user.id, id);
  
  res.json({ message: 'Lead deleted successfully' });
});

// GET /api/leads/:id/ai-insights
exports.getLeadAIInsights = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const lead = await prisma.lead.findFirst({
    where: { id, organizationId: req.tenantId, deletedAt: null }
  });

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  const activities = await prisma.activity.findMany({
    where: { organizationId: req.tenantId, entityId: id, entityType: 'Lead' },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const leadContext = {
    name: lead.name,
    industry: lead.industry || 'Unknown',
    source: lead.source || 'Unknown',
    status: lead.status || 'New',
    score: lead.score || 0,
    recentActivities: activities.map(a => a.description)
  };

  const query = "Analyze this lead and generate a structured JSON summary containing key pain points, personalized email outreach hooks, and recommendations for the sales agent.";
  
  const insights = await langchainService.askCopilot(query, leadContext, []);
  
  res.json({ insights });
});
