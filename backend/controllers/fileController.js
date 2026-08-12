const { asyncHandler } = require('../middleware/errorHandler');
const { prisma } = require('../config/db');

// @desc    Upload generic file/image and save reference to attachment
// @route   POST /api/files/upload
// @access  Private
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const { entityId, entityType } = req.body;

  if (!entityId || !entityType) {
    res.status(400);
    throw new Error('entityId and entityType are required');
  }

  // Create attachment record
  const attachment = await prisma.attachment.create({
    data: {
      organizationId: req.tenantId,
      entityId,
      entityType,
      fileName: req.file.originalname || 'upload_file',
      fileUrl: req.file.path, // Multer/Cloudinary uploads url
      fileSize: req.file.size || 0
    }
  });

  res.status(200).json(attachment);
});

// @desc    Get all attachments for a specific lead or account
// @route   GET /api/files/:entityType/:entityId
// @access  Private
const getAttachments = asyncHandler(async (req, res) => {
  const { entityType, entityId } = req.params;

  const attachments = await prisma.attachment.findMany({
    where: {
      organizationId: req.tenantId,
      entityType,
      entityId
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json(attachments);
});

// @desc    Update User Avatar
// @route   POST /api/users/:id/avatar
// @access  Private
const updateUserAvatar = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const avatarUrl = req.file.path;

  const user = await prisma.user.update({
    where: { id },
    data: { avatar: avatarUrl }
  });

  res.status(200).json({
    success: true,
    avatar: user.avatar
  });
});

// @desc    Update Company Logo
// @route   POST /api/companies/:id/logo
// @access  Private
const updateCompanyLogo = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    logo: req.file ? req.file.path : ''
  });
});

module.exports = {
  uploadFile,
  getAttachments,
  updateUserAvatar,
  updateCompanyLogo
};
