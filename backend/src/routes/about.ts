import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import About from '../models/about';
import { upload } from '../config/multer';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();
//console.log('About routes loaded');

interface AboutRequestBody {
  title?: string;
  content?: string;
}

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  body: AboutRequestBody;
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

// GET the first about entry
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('GET /api/about received');
    const aboutEntry = await About.findOne({
      order: [['id', 'ASC']],
    });
    res.json(aboutEntry || {});
  } catch (error: any) {
    console.error('Error fetching about entry:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch about entry' });
  }
});

// POST to update the first about entry with new image, keeping text unless updated
router.post(
  '/',
  upload.single('image') as RequestHandler,
  handleMulterError,
  async (req: MulterRequest, res: Response) => {
    try {
      console.log('POST /api/about received');
      console.log('Raw body:', req.body);
      console.log('File:', req.file);

      const { title, content } = req.body;
      const imagePath = req.file?.filename;
      if (!imagePath) {
        res.status(400).json({ error: 'Image is required' });
        return;
      }

      let aboutEntry = await About.findOne({ order: [['id', 'ASC']] });
      if (!aboutEntry) {
        aboutEntry = await About.create({
          title: title || null,
          content: content || null,
          imagePath,
        });
      } else {
        if (aboutEntry.imagePath) {
          const oldImagePath = path.join('C:/Users/gholi/Projects/ai-training-website/backend/src/uploads', aboutEntry.imagePath);
          console.log(`Attempting to delete old image at: ${oldImagePath}`);
          try {
            await fs.unlink(oldImagePath);
            console.log(`Deleted old image: ${aboutEntry.imagePath}`);
          } catch (err) {
            console.warn(`Failed to delete old image at ${oldImagePath}:`, err);
          }
        }

        await aboutEntry.update({
          title: title || null,
          content: content || null,
          imagePath,
          updatedAt: new Date(),
        });

        await aboutEntry.reload();
      }

      console.log('About entry updated:', aboutEntry.toJSON());
      res.status(200).json(aboutEntry);
    } catch (error: any) {
      if (req.file) {
        const failedImagePath = path.join('C:/Users/gholi/Projects/ai-training-website/backend/src/uploads', req.file.filename);
        try {
          await fs.unlink(failedImagePath);
          console.log(`Deleted image on error: ${req.file.filename}`);
        } catch (err) {
          console.warn(`Failed to delete image on error at ${failedImagePath}:`, err);
        }
      }
      console.error('Error updating about entry:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to update about entry' });
    }
  }
);

// PUT update about entry by ID
router.put(
  '/:id',
  upload.single('image') as RequestHandler,
  handleMulterError,
  async (req: MulterRequest, res: Response) => {
    try {
      console.log('PUT /api/about/:id received:', req.params, req.body);
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid about entry ID' });
        return;
      }

      const aboutEntry = await About.findByPk(id);
      if (!aboutEntry) {
        res.status(404).json({ error: 'About entry not found' });
        return;
      }

      const { title, content } = req.body;
      let imagePath = aboutEntry.imagePath;

      if (req.file) {
        if (imagePath) {
          const oldImagePath = path.join('C:/Users/gholi/Projects/ai-training-website/backend/src/uploads', imagePath);
          console.log(`Attempting to delete old image at: ${oldImagePath}`);
          try {
            await fs.unlink(oldImagePath);
            console.log(`Deleted old image: ${imagePath}`);
          } catch (err) {
            console.warn(`Failed to delete old image at ${oldImagePath}:`, err);
          }
        }
        imagePath = req.file.filename;
      }

      const updates: Partial<AboutRequestBody> = {};
      if (title !== undefined) updates.title = title.replace(/^"|"$/g, '');
      if (content !== undefined) updates.content = content.replace(/^"|"$/g, '');

      await aboutEntry.update({
        ...updates,
        imagePath,
        updatedAt: new Date(),
      });

      console.log('About entry updated successfully:', aboutEntry.toJSON());
      res.status(200).json(aboutEntry);
    } catch (error: any) {
      console.error('Error updating about entry:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to update about entry' });
    }
  }
);

// DELETE about entry by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    console.log(`Incoming request: DELETE /api/about/${req.params.id}`);
    const id = parseInt(req.params.id);
    const aboutEntry = await About.findByPk(id);
    if (!aboutEntry) {
      res.status(404).json({ error: 'About entry not found' });
      return;
    }

    let deletionError = null;
    if (aboutEntry.imagePath) {
      const imagePath = path.join(process.env.UPLOADS_DIR || 'C:/Users/gholi/Projects/ai-training-website/backend/src/uploads', aboutEntry.imagePath);
      console.log(`Attempting to delete image at: ${imagePath}`);
      try {
        await fs.unlink(imagePath);
        console.log(`Deleted image: ${aboutEntry.imagePath}`);
      } catch (err: any) {
        deletionError = err;
        console.warn(`Failed to delete image at ${imagePath}:`, err.message);
      }
    }

    await aboutEntry.destroy();
    if (deletionError) {
      res.status(500).json({ error: 'Failed to delete associated image', details: deletionError.message });
    } else {
      res.status(204).send();
    }
  } catch (error: any) {
    console.error('Error deleting about entry:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to delete about entry' });
  }
});

export default router;