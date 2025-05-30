import express, { Request as ExpressRequest, Response as ExpressResponse, NextFunction, RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import Home from '../models/home';
import { upload } from '../config/multer';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();
console.log('Home routes loaded');
process.stdout.write(''); // Force flush logs

interface HomeRequestBody {
  title?: string;
  description?: string;
}

interface MulterRequest extends ExpressRequest {
  file?: Express.Multer.File;
  body: HomeRequestBody;
}

const handleMulterError = (err: any, req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error in Home:', err.message, err.stack);
    process.stdout.write(''); // Force flush logs
    res.status(400).json({ error: `Multer error: ${err.message}` });
  } else if (err) {
    console.error('Other upload error in Home:', err.message, err.stack);
    process.stdout.write(''); // Force flush logs
    res.status(400).json({ error: `Upload error: ${err.message}` });
  } else {
    next();
  }
};

// GET the first home entry (returns 404 if none exists)
router.get('/', (async (req: ExpressRequest<ParamsDictionary, any, any, ParsedQs>, res: ExpressResponse) => {
  try {
    console.log('GET /api/home received - Starting query');
    process.stdout.write(''); // Force flush logs
    let homeEntry = await Home.findOne({
      order: [['id', 'ASC']],
    });
    if (!homeEntry) {
      console.log('No home entry found, returning 404');
      process.stdout.write(''); // Force flush logs
      return res.status(404).json({});
    }
    console.log('Home entry fetched:', homeEntry.toJSON());
    process.stdout.write(''); // Force flush logs
    res.status(200).json(homeEntry);
  } catch (error: any) {
    console.error('Error fetching home entry - Details:', error.message, error.stack);
    process.stdout.write(''); // Force flush logs
    res.status(500).json({ error: 'Failed to fetch home entry' });
  }
}) as RequestHandler);

// POST to create or update a home entry with file upload
router.post(
  '/',
  upload.single('image') as RequestHandler,
  handleMulterError,
  async (req: MulterRequest, res: ExpressResponse) => {
    try {
      console.log('POST /api/home received');
      console.log('Raw body:', req.body);
      console.log('File:', req.file);

      const { title, description } = req.body;
      const imagePath = req.file?.filename;

      if (!imagePath) {
        res.status(400).json({ error: 'Image is required' });
        return;
      }

      let home = await Home.findOne({ order: [['id', 'ASC']] });
      if (!home) {
        home = await Home.create({
          title: title || undefined,
          description: description || undefined,
          imagePath,
        });
      } else {
        if (home.imagePath) {
          const oldImagePath = path.join('C:/Users/gholi/Projects/ai-training-website/backend/src/uploads', home.imagePath);
          try {
            await fs.unlink(oldImagePath);
            console.log(`Deleted old image: ${home.imagePath}`);
          } catch (err) {
            console.warn(`Failed to delete old image at ${oldImagePath}:`, err);
          }
        }
        await home.update({
          title: title || home.title,
          description: description || home.description,
          imagePath,
          updatedAt: new Date(),
        });
        await home.reload();
      }

      console.log('Home updated:', home.toJSON());
      res.status(200).json(home);
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
      console.error('Error updating home:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to update home' });
    }
  }
);

// PUT update home entry by ID
router.put(
  '/:id',
  upload.single('image') as RequestHandler,
  handleMulterError,
  async (req: MulterRequest, res: ExpressResponse) => {
    try {
      console.log('PUT /api/home/:id received:', req.params, req.body);
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid home entry ID' });
        return;
      }

      const homeEntry = await Home.findByPk(id);
      if (!homeEntry) {
        res.status(404).json({ error: 'Home entry not found' });
        return;
      }

      const { title, description } = req.body;
      let imagePath = req.file?.filename || homeEntry.imagePath;

      if (req.file && homeEntry.imagePath) {
        const oldImagePath = path.join('C:/Users/gholi/Projects/ai-training-website/backend/src/uploads', homeEntry.imagePath);
        console.log(`Attempting to delete old image at: ${oldImagePath}`);
        try {
          await fs.unlink(oldImagePath);
          console.log(`Deleted old image: ${homeEntry.imagePath}`);
        } catch (err) {
          console.warn(`Failed to delete old image at ${oldImagePath}:`, err);
        }
      }

      const updates: Partial<HomeRequestBody> = {};
      if (title !== undefined) updates.title = title.replace(/^"|"$/g, '');
      if (description !== undefined) updates.description = description.replace(/^"|"$/g, '');

      await homeEntry.update({
        ...updates,
        imagePath,
        updatedAt: new Date(),
      });

      console.log('Home entry updated successfully:', homeEntry.toJSON());
      res.status(200).json(homeEntry);
    } catch (error: any) {
      console.error('Error updating home entry:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to update home entry' });
    }
  }
);

// DELETE home entry by ID
router.delete('/:id', async (req: ExpressRequest<ParamsDictionary, any, any, ParsedQs>, res: ExpressResponse) => {
  try {
    console.log(`Incoming request: DELETE /api/home/${req.params.id}`);
    const id = parseInt(req.params.id);
    const homeEntry = await Home.findByPk(id);
    if (!homeEntry) {
      res.status(404).json({ error: 'Home entry not found' });
      return;
    }

    if (homeEntry.imagePath) {
      const imagePath = path.join('C:/Users/gholi/Projects/ai-training-website/backend/src/uploads', homeEntry.imagePath);
      console.log(`Attempting to delete image at: ${imagePath}`);
      try {
        await fs.unlink(imagePath);
        console.log(`Deleted image: ${homeEntry.imagePath}`);
      } catch (err) {
        console.warn(`Failed to delete image at ${imagePath}:`, err);
      }
    }

    await homeEntry.destroy();
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting home entry:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to delete home entry' });
  }
});

export default router;