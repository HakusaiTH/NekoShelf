const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists in public/uploads
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'cover-' + uniqueSuffix + ext);
  },
});

// File filter to allow images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, gif, webp) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: fileFilter,
});

// Middleware wrapper to gracefully catch Multer upload errors
const handleUpload = (req, res, next) => {
  upload.single('cover_image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      req.uploadError = `Upload error: ${err.message}`;
    } else if (err) {
      req.uploadError = err.message;
    }
    next();
  });
};

module.exports = handleUpload;
