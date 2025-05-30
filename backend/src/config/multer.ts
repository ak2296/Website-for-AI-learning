import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/Users/gholi/Projects/ai-training-website/backend/src/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `file-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});

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

  // Get the file extension (lowercase)
  const ext = path.extname(file.originalname).toLowerCase();

  // Check if the extension is allowed
  if (ext in allowedExtensions) {
    console.log(`Accepted file with extension: ${ext} (mapped to ${allowedExtensions[ext]})`);
    cb(null, true);
  } else {
    console.log(`Rejected file - Invalid extension: ${ext}`);
    cb(new Error(`Invalid file type. Allowed extensions: ${Object.keys(allowedExtensions).join(', ')}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});