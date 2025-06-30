import multer from 'multer';
import path from 'path';

// Ensure the uploads directory exists
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOADS_DIR || 'src/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `file-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});

// File filter to validate file types based on extensions
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log(`Detected MIME type: ${file.mimetype}`);
  console.log(`Original filename: ${file.originalname}`);

  // Define allowed file extensions and their corresponding MIME types
  const allowedExtensions: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.txt': 'text/plain',
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ogg': 'video/ogg',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
  };

  // Normalize the extension to lowercase
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext in allowedExtensions) {
    console.log(`Accepted file with extension: ${ext} (mapped to ${allowedExtensions[ext]})`);
    cb(null, true);
  } else {
    console.log(`Rejected file - Invalid extension: ${ext}`);
    cb(new Error(`Invalid file type. Allowed extensions: ${Object.keys(allowedExtensions).join(', ')}`));
  }
};

// Export the upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 50MB limit
  },
});