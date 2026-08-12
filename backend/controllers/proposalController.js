const { prisma } = require('../config/db');

exports.getProposals = async (req, res) => {
  try {
    const proposals = await prisma.proposal.findMany({
      where: { organizationId: req.tenantId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
};

exports.getProposalById = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await prisma.proposal.findFirst({
      where: { id, organizationId: req.tenantId }
    });
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
    res.json(proposal);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
};

exports.createProposal = async (req, res) => {
  try {
    const { title, amount, status, dealId } = req.body;
    if (!title || amount === undefined) {
      return res.status(400).json({ error: 'Title and amount are required' });
    }
    const proposal = await prisma.proposal.create({
      data: {
        organizationId: req.tenantId,
        ownerId: req.user.id,
        title,
        amount: parseFloat(amount),
        status: status || 'Draft',
        dealId
      }
    });
    res.status(201).json(proposal);
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ error: 'Failed to create proposal' });
  }
};

exports.updateProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, status, dealId } = req.body;
    
    const existing = await prisma.proposal.findFirst({
      where: { id, organizationId: req.tenantId }
    });
    if (!existing) return res.status(404).json({ error: 'Proposal not found' });

    const updated = await prisma.proposal.update({
      where: { id },
      data: {
        title,
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        status,
        dealId
      }
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating proposal:', error);
    res.status(500).json({ error: 'Failed to update proposal' });
  }
};

exports.deleteProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.proposal.findFirst({
      where: { id, organizationId: req.tenantId }
    });
    if (!existing) return res.status(404).json({ error: 'Proposal not found' });

    await prisma.proposal.delete({ where: { id } });
    res.json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    res.status(500).json({ error: 'Failed to delete proposal' });
  }
};

exports.signProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { signatureBase64, ipAddress, userAgent } = req.body;
    
    const existing = await prisma.proposal.findFirst({
      where: { id, organizationId: req.tenantId }
    });
    if (!existing) return res.status(404).json({ error: 'Proposal not found' });

    const crypto = require('crypto');
    const cryptographicHash = crypto.createHash('sha256').update(signatureBase64).digest('hex');

    const signature = await prisma.signature.create({
      data: {
        proposalId: id,
        ipAddress: ipAddress || req.ip,
        userAgent: userAgent || req.headers['user-agent'],
        cryptographicHash,
        signatureData: signatureBase64
      }
    });

    const updated = await prisma.proposal.update({
      where: { id },
      data: { status: 'Signed' }
    });

    res.json({ message: 'Proposal signed successfully', signature, proposal: updated });
  } catch (error) {
    console.error('Error signing proposal:', error);
    res.status(500).json({ error: 'Failed to sign proposal' });
  }
};
