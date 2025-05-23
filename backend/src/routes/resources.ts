import express, { Request, Response, RequestHandler, NextFunction } from 'express';
import Resource from '../models/resource';
import { upload } from '../config/multer';
import multer from 'multer';
const router = express.Router();

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err.message, err.stack);
    res.status(400).json({ error: `Multer error: ${err.message}` });
  } else if (err) {
    console.error('Other upload error:', err.message, err.stack);
    res.status(400).json({ error: `Upload error: ${err.message}` });
  } else {
    next();
  }
};

router.post(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    console.log('POST /api/resources received - before Multer');
    next();
  },
  upload.single('file') as RequestHandler,
  handleMulterError,
  async (req: MulterRequest, res: Response): Promise<void> => {
    console.log('POST /api/resources received - after Multer');
    try {
      console.log('Raw body:', req.body);
      console.log('File:', req.file);

      const { title, description, mediaType } = req.body;
      const filePath = req.file?.path;

      console.log('Extracted data:', { title, description, mediaType, filePath });

      if (!filePath) {
        console.log('No file uploaded - Raw files:', req.files);
        res.status(400).json({ error: 'File is required' });
        return;
      }

      const resource = await Resource.create({
        title,
        description,
        filePath,
        mediaType,
      });

      console.log('Resource created:', resource);
      res.status(201).json(resource);
    } catch (error: any) {
      console.error('Error uploading resource:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to upload resource' });
    }
  }
);

// Other routes (GET /, GET /:id) remain unchanged
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('GET /api/resources received');
    const resources = await Resource.findAll();
    res.json(resources);
  } catch (error: any) {
    console.error('Error fetching resources:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(`GET /api/resources/${req.params.id} received`);
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    res.json(resource);
  } catch (error: any) {
    console.error('Error fetching resource:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
});

export default router;