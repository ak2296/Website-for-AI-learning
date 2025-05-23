import express, { Request, Response, RequestHandler } from 'express';
import Resource from '../models/resource';
import { upload } from '../config/multer';

const router = express.Router();

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

router.post(
  '/',
  upload.single('file') as RequestHandler,
  async (req: MulterRequest, res: Response): Promise<void> => {
    console.log('POST /api/resources received');
    try {
      console.log('Raw body:', req.body);
      console.log('File:', req.file);
      console.log('File buffer size:', req.file?.buffer?.length || 'No buffer'); // Log buffer size if available

      const { title, description, mediaType } = req.body;
      const filePath = req.file?.path;

      console.log('Extracted data:', { title, description, mediaType, filePath });

      if (!filePath) {
        console.log('No file uploaded - Raw files:', req.files);
        res.status(400).json({ error: 'File is required' });
        return;
      }

      console.log('Attempting to create resource');
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