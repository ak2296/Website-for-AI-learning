import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import Resource from '../models/resource';
import { upload } from '../config/multer';
import multer from 'multer';

const router = express.Router();

// Define the shape of req.body for this route
interface ResourceRequestBody {
  title?: string;
  description?: string;
  mediaType?: string;
}

// Extend the Request type to include Multer's file and the custom body
interface MulterRequest extends Request {
  file?: Express.Multer.File;
  body: ResourceRequestBody;
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
  async (req: MulterRequest, res: Response) => {
    console.log('POST /api/resources received - after Multer');
    try {
      console.log('Raw body:', req.body);
      console.log('File:', req.file);

      const filePath = req.file?.path;

      if (!filePath) {
        console.log('No file uploaded - Raw files:', req.files);
        res.status(400).json({ error: 'File is required' });
        return;
      }

      const { title = '', description = '', mediaType = req.file?.mimetype || 'application/octet-stream' } = req.body;
      const cleanedTitle = title.replace(/^"|"$/g, '');
      const cleanedDescription = description.replace(/^"|"$/g, '');
      const cleanedMediaType = mediaType.replace(/^"|"$/g, '');

      console.log('Extracted data:', { title: cleanedTitle, description: cleanedDescription, mediaType: cleanedMediaType, filePath });

      const resource = await Resource.create({
        title: cleanedTitle,
        description: cleanedDescription,
        filePath,
        mediaType: cleanedMediaType,
      });

      console.log('Resource created:', resource);
      res.status(201).json(resource);
    } catch (error: any) {
      console.error('Error uploading resource:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to upload resource' });
    }
  }
);

// GET all resources
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('GET /api/resources received');
    const resources = await Resource.findAll();
    res.json(resources);
  } catch (error: any) {
    console.error('Error fetching resources:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// GET resource by ID
router.get('/:id', async (req: Request, res: Response) => {
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

// PUT update resource by ID
router.put('/:id', async (req: Request, res: Response) => {
  try {
    console.log('PUT /api/resources/:id received:', req.params, req.body);
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid resource ID' });
      return;
    }

    const resource = await Resource.findByPk(id);
    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    const { title, description, mediaType } = req.body;

    // Validate and clean input
    const updates: Partial<ResourceRequestBody> = {};
    if (title !== undefined) updates.title = title.replace(/^"|"$/g, '');
    if (description !== undefined) updates.description = description.replace(/^"|"$/g, '');
    if (mediaType !== undefined) updates.mediaType = mediaType.replace(/^"|"$/g, '');

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: 'No updates provided' });
      return;
    }

    // Explicitly update updatedAt
    await resource.update({ ...updates, updatedAt: new Date() });
    console.log('Resource updated successfully:', resource.toJSON());
    res.status(200).json(resource);
  } catch (error: any) {
    console.error('Error updating resource:', error.message, error.stack);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else if (error.name === 'SequelizeDatabaseError') {
      res.status(500).json({ error: 'Database error', details: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update resource', details: error.message });
    }
  }
});

// DELETE resource by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const resource = await Resource.findByPk(id);
    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    await resource.destroy();
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting resource:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

export default router;