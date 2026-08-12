const { prisma } = require('../config/db');

exports.getQuotes = async (req, res) => {
  try {
    const quotes = await prisma.quote.findMany({
      where: { organizationId: req.tenantId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
};

exports.getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const quote = await prisma.quote.findFirst({
      where: { id, organizationId: req.tenantId }
    });
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json(quote);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
};

exports.createQuote = async (req, res) => {
  try {
    const { title, amount, status, dealId } = req.body;
    if (!title || amount === undefined) {
      return res.status(400).json({ error: 'Title and amount are required' });
    }
    const quote = await prisma.quote.create({
      data: {
        organizationId: req.tenantId,
        ownerId: req.user.id,
        title,
        amount: parseFloat(amount),
        status: status || 'Draft',
        dealId
      }
    });
    res.status(201).json(quote);
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({ error: 'Failed to create quote' });
  }
};

exports.updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, status, dealId } = req.body;
    
    const existing = await prisma.quote.findFirst({
      where: { id, organizationId: req.tenantId }
    });
    if (!existing) return res.status(404).json({ error: 'Quote not found' });

    const updated = await prisma.quote.update({
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
    console.error('Error updating quote:', error);
    res.status(500).json({ error: 'Failed to update quote' });
  }
};

exports.deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.quote.findFirst({
      where: { id, organizationId: req.tenantId }
    });
    if (!existing) return res.status(404).json({ error: 'Quote not found' });

    await prisma.quote.delete({ where: { id } });
    res.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ error: 'Failed to delete quote' });
  }
};
