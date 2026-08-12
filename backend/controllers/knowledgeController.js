const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

exports.getArticles = asyncHandler(async (req, res) => {
  const articles = await prisma.article.findMany({
    where: { organizationId: req.tenantId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(articles);
});

exports.createArticle = asyncHandler(async (req, res) => {
  const { title, category, body } = req.body;
  if (!title || !category || !body) {
    res.status(400);
    throw new Error('Title, category, and body are required');
  }

  const article = await prisma.article.create({
    data: {
      organizationId: req.tenantId,
      title,
      category,
      body,
      status: 'Published'
    }
  });
  res.status(201).json(article);
});

exports.updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, category, body, status } = req.body;
  
  const existing = await prisma.article.findFirst({
    where: { id, organizationId: req.tenantId }
  });
  
  if (!existing) {
    res.status(404);
    throw new Error('Article not found');
  }

  const updated = await prisma.article.update({
    where: { id },
    data: { title, category, body, status }
  });
  
  res.json(updated);
});

exports.deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.article.findFirst({
    where: { id, organizationId: req.tenantId }
  });
  
  if (!existing) {
    res.status(404);
    throw new Error('Article not found');
  }

  await prisma.article.delete({ where: { id } });
  res.json({ message: 'Article deleted' });
});
