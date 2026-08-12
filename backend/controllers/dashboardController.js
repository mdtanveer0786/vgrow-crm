const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');
const langchainService = require('../services/langchainService');

// GET /api/dashboard
exports.getDashboard = asyncHandler(async (req, res) => {
  const orgId = req.tenantId;

  const totalLeads = await prisma.lead.count({ where: { organizationId: orgId } });
  
  // Custom temperature thresholds based on score
  const hotLeads = await prisma.lead.count({ where: { organizationId: orgId, score: { gte: 80 } } });
  const warmLeads = await prisma.lead.count({ where: { organizationId: orgId, score: { gte: 50, lt: 80 } } });
  const coldLeads = await prisma.lead.count({ where: { organizationId: orgId, score: { lt: 50 } } });

  // Status mapping
  const convertedLeads = await prisma.lead.count({ where: { organizationId: orgId, status: 'Converted' } });
  const prospectingLeads = await prisma.lead.count({ where: { organizationId: orgId, status: 'Prospecting' } });
  const proposalLeads = await prisma.lead.count({ where: { organizationId: orgId, status: 'Proposal Sent' } });
  const contactedLeads = await prisma.lead.count({ where: { organizationId: orgId, status: 'Contacted' } });
  const qualifiedLeads = await prisma.lead.count({ where: { organizationId: orgId, status: 'Qualified' } });

  // Advanced BI & Analytics
  const totalDeals = await prisma.deal.count({ where: { organizationId: orgId } });
  const wonDeals = await prisma.deal.count({ 
    where: { 
      organizationId: orgId, 
      status: { in: ['Won', 'Closed Won'] } 
    } 
  });
  const conversionRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;

  const activeSubscriptions = await prisma.subscription.findMany({
    where: { organizationId: orgId, status: 'Active' }
  });
  let mrr = 0;
  activeSubscriptions.forEach(sub => {
    const amt = parseFloat(sub.amount) || 0;
    if (sub.interval.toLowerCase() === 'yearly') {
      mrr += amt / 12;
    } else {
      mrr += amt;
    }
  });

  const leadsBySourceRaw = await prisma.lead.groupBy({
    by: ['source'],
    _count: { id: true },
    where: { organizationId: orgId }
  });
  const leadsBySource = leadsBySourceRaw.map(item => ({
    source: item.source || 'Unknown',
    count: item._count.id
  }));

  const hygieneScore = 85;
  const profileHealthScore = 90;
  const websiteListingHealth = 95;
  const reviewsCount = 12;

  const upcomingMeetings = [
    { id: 1, leadName: 'Sonam Sharma', time: 'Tomorrow, 10:00 AM', agenda: 'Proposal Review' },
    { id: 2, leadName: 'Saksham Bhatnagar', time: 'In 2 days, 2:30 PM', agenda: 'Product Demonstration' }
  ];

  const journeyActions = [
    { id: 1, leadName: 'Pawan Tiwari', action: 'Send follow-up email', dueDate: 'Overdue (1 day)' },
    { id: 2, leadName: 'Pankaj Kumar', action: 'Call to confirm requirements', dueDate: 'Today' }
  ];

  res.json({
    stats: { totalLeads, warmLeads, hotLeads, coldLeads, convertedLeads, prospectingLeads, contactedLeads, qualifiedLeads, proposalLeads },
    advanced: { conversionRate, mrr, leadsBySource },
    scores: { hygieneScore, profileHealthScore, websiteListingHealth, reviewsCount },
    upcomingMeetings,
    journeyActions
  });
});

// GET /api/analytics/ai-forecast
exports.getAIForecast = asyncHandler(async (req, res) => {
  const orgId = req.tenantId;

  // Retrieve Deals with pipeline status
  const deals = await prisma.deal.findMany({
    where: { organizationId: orgId }
  });

  const dealContext = deals.map(d => ({
    title: d.title,
    amount: parseFloat(d.amount),
    status: d.status,
    probability: d.probability
  }));

  const query = "Analyze this deals pipeline and calculate the forecasted revenue (sum of amount * probability / 100). Identify high risk deals and provide a brief recommendation on which deals the team should focus on this month.";
  const context = { deals: dealContext };

  const forecastText = await langchainService.askCopilot(query, context, []);

  res.json({ forecast: forecastText });
});
