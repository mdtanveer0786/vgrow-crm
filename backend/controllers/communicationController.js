const { prisma } = require('../config/db');

exports.getCommunications = async (req, res) => {
  try {
    const { type, contactId, leadId } = req.query;
    
    let whereClause = {
      organizationId: req.tenantId
    };

    if (type) whereClause.type = type;
    if (contactId) whereClause.contactId = contactId;
    if (leadId) whereClause.leadId = leadId;

    const communications = await prisma.communication.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: { select: { firstName: true, lastName: true, email: true } }
      }
    });
    
    res.json(communications);
  } catch (error) {
    console.error('Error fetching communications:', error);
    res.status(500).json({ error: 'Failed to fetch communications' });
  }
};

exports.getCommunicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const communication = await prisma.communication.findFirst({
      where: {
        id,
        organizationId: req.tenantId
      },
      include: {
        owner: { select: { firstName: true, lastName: true, email: true } }
      }
    });

    if (!communication) {
      return res.status(404).json({ error: 'Communication not found' });
    }

    res.json(communication);
  } catch (error) {
    console.error('Error fetching communication:', error);
    res.status(500).json({ error: 'Failed to fetch communication' });
  }
};

exports.createCommunication = async (req, res) => {
  try {
    const { contactId, leadId, type, direction, status, subject, content, metadata } = req.body;

    const communication = await prisma.communication.create({
      data: {
        organizationId: req.tenantId,
        ownerId: req.user.id,
        contactId,
        leadId,
        type,
        direction,
        status: status || 'Completed',
        subject,
        content,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null
      }
    });

    // Fetch again to include owner info for frontend
    const newCommunication = await prisma.communication.findUnique({
      where: { id: communication.id },
      include: {
        owner: { select: { firstName: true, lastName: true, email: true } }
      }
    });

    res.status(201).json(newCommunication);
  } catch (error) {
    console.error('Error creating communication:', error);
    res.status(500).json({ error: 'Failed to create communication' });
  }
};

exports.updateCommunicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const communication = await prisma.communication.findFirst({
      where: { id, organizationId: req.tenantId }
    });

    if (!communication) {
      return res.status(404).json({ error: 'Communication not found' });
    }

    const updatedCommunication = await prisma.communication.update({
      where: { id },
      data: { status }
    });

    res.json(updatedCommunication);
  } catch (error) {
    console.error('Error updating communication status:', error);
    res.status(500).json({ error: 'Failed to update communication status' });
  }
};

exports.deleteCommunication = async (req, res) => {
  try {
    const { id } = req.params;

    const communication = await prisma.communication.findFirst({
      where: { id, organizationId: req.tenantId }
    });

    if (!communication) {
      return res.status(404).json({ error: 'Communication not found' });
    }

    await prisma.communication.delete({
      where: { id }
    });

    res.json({ message: 'Communication deleted successfully' });
  } catch (error) {
    console.error('Error deleting communication:', error);
    res.status(500).json({ error: 'Failed to delete communication' });
  }
};
