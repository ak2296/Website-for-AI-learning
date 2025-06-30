import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { Resource } from '../config/database';
import { upload } from '../config/multer';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// Set up the router for handling resource-related API routes
const router = express.Router();

// Define the shape of the request body for creating/updating resources
interface ResourceRequestBody {
  title?: string;
  description?: string;
}

// Extend Request type to include file and body from multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
  body: ResourceRequestBody;
}

// Handle errors from multer (file upload issues)
const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: `Multer error: ${err.message}` });
  } else if (err) {
    res.status(400).json({ error: `Upload error: ${err.message}` });
  } else {
    next();
  }
};

// GET all resources from the database
router.get('/', async (req: Request, res: Response) => {
  try {
    const resources = await Resource.findAll({ order: [['id', 'ASC']] });
    if (!Array.isArray(resources)) {
      throw new Error('Unexpected data format: resources is not an array');
    }
    res.json(resources);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// GET a specific resource by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    res.json(resource);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
});

// POST a new resource with an optional file upload
router.post(
  '/',
  upload.single('file') as RequestHandler,
  handleMulterError,
  async (req: MulterRequest, res: Response) => {
    try {
      const { title, description } = req.body;
      const filePath = req.file?.filename;
      const mediaType = req.file?.mimetype;

      if (!filePath) {
        res.status(400).json({ error: 'File is required' });
        return;
      }

      const resource = await Resource.create({
        title: title ?? undefined,
        description: description ?? undefined,
        filePath,
        mediaType: mediaType ?? undefined,
      });
      res.status(200).json(resource);
    } catch (error: any) {
      if (req.file) {
        const failedFilePath = path.join(process.env.UPLOADS_DIR || 'src/uploads', req.file.filename);
        try {
          await fs.unlink(failedFilePath);
        } catch (err) {
          // Silent fail on file deletion if it fails
        }
      }
      res.status(500).json({ error: 'Failed to create resource' });
    }
  }
);

// PUT to update a resource, with optional file replacement
router.put(
  '/:id',
  upload.single('file') as RequestHandler,
  handleMulterError,
  async (req: MulterRequest, res: Response) => {
    try {
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

      const { title, description } = req.body;
      let filePath = resource.filePath;
      let mediaType = resource.mediaType;

      if (req.file) {
        if (filePath) {
          const oldFilePath = path.join(process.env.UPLOADS_DIR || 'src/uploads', filePath);
          try {
            await fs.unlink(oldFilePath);
          } catch (err) {
            // Silent fail on old file deletion if it fails
          }
        }
        filePath = req.file.filename;
        mediaType = req.file.mimetype;
      }

      await resource.update({
        title: title ?? resource.title,
        description: description ?? resource.description,
        filePath,
        mediaType,
        updatedAt: new Date(),
      });
      res.status(200).json(resource);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update resource' });
    }
  }
);

// DELETE a resource and its associated file
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const resource = await Resource.findByPk(id);
    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    let deletionError = null;
    if (resource.filePath) {
      const filePath = path.join(process.env.UPLOADS_DIR || 'src/uploads', resource.filePath);
      try {
        await fs.unlink(filePath);
      } catch (err: any) {
        deletionError = err;
      }
    }

    await resource.destroy();
    if (deletionError) {
      res.status(500).json({ error: 'Failed to delete associated file', details: deletionError.message });
    } else {
      res.status(204).send();
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

export default router;