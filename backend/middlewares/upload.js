const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// File type + size validation BEFORE uploading to Cloudinary
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only .jpg, .jpeg, and .png files are allowed!'), false);
  }

  cb(null, true);
};

// Max file size: 5MB
const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2 MB per file
});


module.exports = upload;