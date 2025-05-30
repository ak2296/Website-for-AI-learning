import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { Resource } from '../config/database';
import { upload } from '../config/multer';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// Initialize the Express router for handling resource-related routes
const router = express.Router();

// Define the shape of the request body for resources
interface ResourceRequestBody {
  title?: string;
  description?: string;
}

// Extend the Express Request type to include Multer file property
interface MulterRequest extends Request {
  file?: Express.Multer.File;
  body: ResourceRequestBody;
}

// Middleware to handle Multer errors during file uploads
const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    // Log Multer-specific errors (e.g., file size limit, unexpected field)
    console.error('Multer error:', err.message, err.stack);
    res.status(400).json({ error: `Multer error: ${err.message}` });
  } else if (err) {
    // Log other upload-related errors (e.g., invalid file type)
    console.error('Other upload error:', err.message, err.stack);
    res.status(400).json({ error: `Upload error: ${err.message}` });
  } else {
    // If no error, proceed to the next middleware
    next();
  }
};

// GET all resources from the database
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('GET /api/resources received');
    // Fetch all resources, ordered by ID in ascending order
    const resources = await Resource.findAll({ order: [['id', 'ASC']] });
    res.json(resources);
  } catch (error: any) {
    console.error('Error fetching resources:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// GET a specific resource by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    console.log('GET /api/resources/:id received');
    // Find the resource by primary key (ID)
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

// POST to create a new resource with file upload (no overwriting)
router.post(
  '/',
  upload.single('file') as RequestHandler, // Expect a single file under the 'file' field
  handleMulterError,
  async (req: MulterRequest, res: Response) => {
    try {
      console.log('POST /api/resources received');
      console.log('Raw body:', req.body);
      console.log('File:', req.file);

      // Extract title, description, and file details from the request
      const { title, description } = req.body;
      const filePath = req.file?.filename;
      const mediaType = req.file?.mimetype;

      // Validate that a file was uploaded
      if (!filePath) {
        res.status(400).json({ error: 'File is required' });
        return;
      }

      // Create a new resource entry in the database (no update logic)
      const resource = await Resource.create({
        title: title ?? undefined, // Use nullish coalescing to handle undefined
        description: description ?? undefined,
        filePath,
        mediaType: mediaType ?? undefined,
      });

      console.log('Resource created:', resource.toJSON());
      res.status(200).json(resource);
    } catch (error: any) {
      // Clean up the uploaded file if the database operation fails
      if (req.file) {
        const failedFilePath = path.join('C:/Users/gholi/Projects/ai-training-website/backend/src/uploads', req.file.filename);
        try {
          await fs.unlink(failedFilePath);
          console.log(`Deleted file on error: ${req.file.filename}`);
        } catch (err) {
          console.warn(`Failed to delete file on error at ${failedFilePath}:`, err);
        }
      }
      console.error('Error creating resource:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to create resource' });
    }
  }
);

// PUT to update an existing resource by ID
router.put(
  '/:id',
  upload.single('file') as RequestHandler,
  handleMulterError,
  async (req: MulterRequest, res: Response) => {
    try {
      console.log('PUT /api/resources/:id received:', req.params, req.body);
      // Parse the resource ID from the URL parameter
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid resource ID' });
        return;
      }

      // Find the resource by ID
      const resource = await Resource.findByPk(id);
      if (!resource) {
        res.status(404).json({ error: 'Resource not found' });
        return;
      }

      // Extract updated fields from the request
      const { title, description } = req.body;
      let filePath = resource.filePath;
      let mediaType = resource.mediaType;

      // If a new file is uploaded, replace the old one
      if (req.file) {
        if (filePath) {
          const oldFilePath = path.join('C:/Users/gholi/Projects/ai-training-website/backend/src/uploads', filePath);
          console.log(`Attempting to delete old file at: ${oldFilePath}`);
          try {
            await fs.unlink(oldFilePath);
            console.log(`Deleted old file: ${filePath}`);
          } catch (err) {
            console.warn(`Failed to delete old file at ${oldFilePath}:`, err);
          }
        }
        filePath = req.file.filename;
        mediaType = req.file.mimetype;
      }

      // Update the resource with new values
      await resource.update({
        title: title ?? resource.title,
        description: description ?? resource.description,
        filePath,
        mediaType,
        updatedAt: new Date(),
      });

      console.log('Resource updated successfully:', resource.toJSON());
      res.status(200).json(resource);
    } catch (error: any) {
      console.error('Error updating resource:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to update resource' });
    }
  }
);

// DELETE a resource by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    console.log(`Incoming request: DELETE /api/resources/${req.params.id}`);
    // Parse the resource ID from the URL parameter
    const id = parseInt(req.params.id);
    const resource = await Resource.findByPk(id);
    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    // Delete the associated file from the uploads directory
    if (resource.filePath) {
      const filePath = path.join('C:/Users/gholi/Projects/ai-training-website/backend/src/uploads', resource.filePath);
      console.log(`Attempting to delete file at: ${filePath}`);
      try {
        await fs.unlink(filePath);
        console.log(`Deleted file: ${resource.filePath}`);
      } catch (err) {
        console.warn(`Failed to delete file at ${filePath}:`, err);
      }
    }

    // Remove the resource from the database
    await resource.destroy();
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting resource:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

export default router;