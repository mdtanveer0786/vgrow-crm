const { prisma } = require('../config/db');

exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { organizationId: req.tenantId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findFirst({
      where: { id, organizationId: req.tenantId }
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, sku, category, unitPrice, status, description } = req.body;
    
    if (!name || !sku || !category || unitPrice === undefined) {
      return res.status(400).json({ error: 'Name, sku, category, and unitPrice are required' });
    }

    const product = await prisma.product.create({
      data: {
        organizationId: req.tenantId,
        name,
        sku,
        category,
        unitPrice: parseFloat(unitPrice),
        status: status || 'Active',
        description
      }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, category, unitPrice, status, description } = req.body;

    const existingProduct = await prisma.product.findFirst({
      where: { id, organizationId: req.tenantId }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        sku,
        category,
        unitPrice: unitPrice !== undefined ? parseFloat(unitPrice) : undefined,
        status,
        description
      }
    });

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingProduct = await prisma.product.findFirst({
      where: { id, organizationId: req.tenantId }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
