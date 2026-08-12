const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Global Search across Leads, Companies, and Contacts
// @route   GET /api/search
// @access  Private
const globalSearch = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const orgId = req.tenantId;

  if (!query) {
    return res.json({ leads: [], companies: [], contacts: [] });
  }

  // 1. Query Leads (Excluding Archived)
  const leads = await prisma.lead.findMany({
    where: {
      organizationId: orgId,
      NOT: { status: 'Archived' },
      OR: [
        { name: { contains: query } },
        { email: { contains: query } },
        { phone: { contains: query } }
      ]
    },
    take: 10
  });

  // 2. Query Companies
  const companies = await prisma.company.findMany({
    where: {
      organizationId: orgId,
      name: { contains: query }
    },
    take: 10
  });

  // 3. Query Contacts
  const contacts = await prisma.contact.findMany({
    where: {
      organizationId: req.user.organizationId,
      OR: [
        { firstName: { contains: query } },
        { lastName: { contains: query } },
        { email: { contains: query } },
        { phone: { contains: query } }
      ]
    },
    take: 10
  });

  // Format Leads
  const formattedLeads = leads.map(l => {
    const parts = l.name.split(' ');
    return {
      id: l.id,
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      email: l.email,
      phone: l.phone,
      company: l.name + ' Company',
      status: l.status,
      type: 'Lead'
    };
  });

  // Format Companies
  const formattedCompanies = companies.map(c => ({
    id: c.id,
    name: c.name,
    industry: c.industry || 'Other',
    website: c.website || '',
    type: 'Company'
  }));

  // Format Contacts
  const formattedContacts = contacts.map(c => ({
    id: c.id,
    name: c.name,
    email: c.email || '',
    phone: c.phone || '',
    type: 'Contact'
  }));

  res.json({
    leads: formattedLeads,
    companies: formattedCompanies,
    contacts: formattedContacts
  });
});

module.exports = {
  globalSearch
};
