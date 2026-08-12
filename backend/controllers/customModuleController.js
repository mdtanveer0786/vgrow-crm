const { prisma } = require('../config/db');

// --- MODULES ---

exports.getCustomModules = async (req, res) => {
  try {
    const modules = await prisma.customModule.findMany({
      where: { organizationId: req.tenantId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(modules);
  } catch (error) {
    console.error('Error fetching custom modules:', error);
    res.status(500).json({ error: 'Failed to fetch custom modules' });
  }
};

exports.getCustomModuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const mod = await prisma.customModule.findFirst({
      where: { id, organizationId: req.tenantId }
    });
    if (!mod) return res.status(404).json({ error: 'Module not found' });
    res.json(mod);
  } catch (error) {
    console.error('Error fetching custom module:', error);
    res.status(500).json({ error: 'Failed to fetch custom module' });
  }
};

exports.createCustomModule = async (req, res) => {
  try {
    const { name, singularName, pluralName, icon, schema } = req.body;
    if (!name || !singularName || !pluralName || !schema) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newModule = await prisma.customModule.create({
      data: {
        organizationId: req.tenantId,
        name,
        singularName,
        pluralName,
        icon: icon || 'Box',
        schema
      }
    });
    res.status(201).json(newModule);
  } catch (error) {
    console.error('Error creating custom module:', error);
    res.status(500).json({ error: 'Failed to create custom module' });
  }
};

exports.updateCustomModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, singularName, pluralName, icon, schema } = req.body;
    const existing = await prisma.customModule.findFirst({ where: { id, organizationId: req.tenantId } });
    if (!existing) return res.status(404).json({ error: 'Module not found' });
    
    const updated = await prisma.customModule.update({
      where: { id },
      data: { name, singularName, pluralName, icon, schema }
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating custom module:', error);
    res.status(500).json({ error: 'Failed to update custom module' });
  }
};

exports.deleteCustomModule = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.customModule.findFirst({ where: { id, organizationId: req.tenantId } });
    if (!existing) return res.status(404).json({ error: 'Module not found' });
    
    await prisma.customModule.delete({ where: { id } });
    res.json({ message: 'Module deleted' });
  } catch (error) {
    console.error('Error deleting custom module:', error);
    res.status(500).json({ error: 'Failed to delete custom module' });
  }
};

// --- RECORDS ---

exports.getCustomRecords = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const records = await prisma.customRecord.findMany({
      where: { organizationId: req.tenantId, moduleId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(records);
  } catch (error) {
    console.error('Error fetching custom records:', error);
    res.status(500).json({ error: 'Failed to fetch custom records' });
  }
};

exports.createCustomRecord = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { data } = req.body;
    
    // verify module exists
    const mod = await prisma.customModule.findFirst({ where: { id: moduleId, organizationId: req.tenantId } });
    if (!mod) return res.status(404).json({ error: 'Module not found' });

    const newRecord = await prisma.customRecord.create({
      data: {
        organizationId: req.tenantId,
        moduleId,
        data
      }
    });
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error creating custom record:', error);
    res.status(500).json({ error: 'Failed to create custom record' });
  }
};

exports.updateCustomRecord = async (req, res) => {
  try {
    const { moduleId, recordId } = req.params;
    const { data } = req.body;
    
    const existing = await prisma.customRecord.findFirst({ where: { id: recordId, moduleId, organizationId: req.tenantId } });
    if (!existing) return res.status(404).json({ error: 'Record not found' });

    const updated = await prisma.customRecord.update({
      where: { id: recordId },
      data: { data }
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating custom record:', error);
    res.status(500).json({ error: 'Failed to update custom record' });
  }
};

exports.deleteCustomRecord = async (req, res) => {
  try {
    const { moduleId, recordId } = req.params;
    const existing = await prisma.customRecord.findFirst({ where: { id: recordId, moduleId, organizationId: req.tenantId } });
    if (!existing) return res.status(404).json({ error: 'Record not found' });
    
    await prisma.customRecord.delete({ where: { id: recordId } });
    res.json({ message: 'Record deleted' });
  } catch (error) {
    console.error('Error deleting custom record:', error);
    res.status(500).json({ error: 'Failed to delete custom record' });
  }
};
