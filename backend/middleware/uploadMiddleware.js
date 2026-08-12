const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vgrow_crm',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'csv', 'docx']
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
  fileFilter: (req, file, cb) => {
    // Prevent potentially dangerous extensions/MIME types
    const allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'text/csv',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('[SECURITY] Invalid file type. Only JPG, PNG, PDF, CSV, and DOCX are allowed.'), false);
    }
  }
});

module.exports = upload;
