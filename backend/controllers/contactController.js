const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await prisma.contact.findMany({
    where: { organizationId: req.tenantId, deletedAt: null },
    include: { company: true }
  });
  res.status(200).json(contacts);
});

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private
const getContact = asyncHandler(async (req, res) => {
  const contact = await prisma.contact.findFirst({
    where: { 
      id: req.params.id,
      organizationId: req.tenantId,
      deletedAt: null
    },
    include: { company: true, owner: true, deals: true }
  });

  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  res.status(200).json(contact);
});

// @desc    Create a contact
// @route   POST /api/contacts
// @access  Private
const createContact = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, designation, companyId } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ message: 'Please provide firstName and lastName' });
  }

  const contact = await prisma.contact.create({
    data: {
      organizationId: req.tenantId,
      ownerId: req.user.id,
      firstName,
      lastName,
      email,
      phone,
      designation,
      companyId
    }
  });

  res.status(201).json(contact);
});

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = asyncHandler(async (req, res) => {
  const contactExists = await prisma.contact.findFirst({
    where: { id: req.params.id, organizationId: req.tenantId, deletedAt: null }
  });

  if (!contactExists) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  const updatedContact = await prisma.contact.update({
    where: { id: req.params.id },
    data: req.body
  });

  res.status(200).json(updatedContact);
});

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = asyncHandler(async (req, res) => {
  const contactExists = await prisma.contact.findFirst({
    where: { id: req.params.id, organizationId: req.tenantId, deletedAt: null }
  });

  if (!contactExists) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  await prisma.contact.update({
    where: { id: req.params.id },
    data: { deletedAt: new Date() }
  });

  res.status(200).json({ message: 'Contact soft-deleted' });
});

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact
};
