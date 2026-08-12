const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

exports.getAccounts = asyncHandler(async (req, res) => {
  const companies = await prisma.company.findMany({
    where: { organizationId: req.tenantId, deletedAt: null }
  });
  // Map companies to "accounts" payload structure expected by frontend
  res.json(companies.map(c => ({
    id: c.id,
    name: c.name,
    industry: c.industry || 'Other',
    website: c.website || '',
    email: '',
    phone: ''
  })));
});

exports.createAccount = asyncHandler(async (req, res) => {
  const { name, industry, website } = req.body;
  const company = await prisma.company.create({
    data: {
      organizationId: req.tenantId,
      name,
      industry,
      website
    }
  });
  res.status(201).json({
    id: company.id,
    name: company.name,
    industry: company.industry,
    website: company.website,
    email: '',
    phone: ''
  });
});

exports.getBranding = asyncHandler(async (req, res) => {
  const { domain } = req.query;
  if (!domain) return res.status(400).json({ message: 'Domain required' });
  const org = await prisma.organization.findFirst({
    where: { customDomain: domain }
  });
  if (!org) return res.status(404).json({ message: 'Organization not found' });
  res.json({
    primaryColor: org.primaryColor,
    customLogoUrl: org.customLogoUrl,
    name: org.name
  });
});
