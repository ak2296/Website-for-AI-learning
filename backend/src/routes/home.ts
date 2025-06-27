// src/routes/home.ts (unchanged from last valid version)
import express, { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import Home from '../models/home';
import { upload } from '../config/multer';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { Sequelize } from 'sequelize';
import { Transaction } from 'sequelize';

const router = express.Router();

interface HomeRequestBody {
  title?: string | null;
  description?: string | null;
  content?: string | null;
  mediaType?: string | null;
}

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  body: HomeRequestBody;
}

const handleMulterError: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error in Home:', err.message, err.stack);
    res.status(400).json({ error: `Multer error: ${err.message}` });
  } else if (err) {
    console.error('Other upload error in Home:', err.message, err.stack);
    res.status(400).json({ error: `Upload error: ${err.message}` });
  } else {
    next();
  }
};

router.get('/', (async (req: Request<ParamsDictionary, any, any, ParsedQs>, res: Response, next: NextFunction) => {
  try {
    const homeEntry = await Home.findOne({ order: [['id', 'ASC']] });
    if (!homeEntry) {
      console.log('No home entry found, returning 404');
      return res.status(404).json({});
    }
    res.status(200).json(homeEntry);
  } catch (error: any) {
    console.error('Error fetching home entry:', error.message, error.stack);
    next(error);
  }
}) as RequestHandler);

router.post(
  '/',
  upload.single('image') as RequestHandler,
  handleMulterError,
  (async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
      console.log('POST /api/home received');
      console.log('Raw body:', req.body);
      console.log('File:', req.file);

      const { title, description, content, mediaType } = req.body;
      const imagePath = req.file?.filename;
      if (!imagePath) {
        return res.status(400).json({ error: 'Image is required' });
      }

      const transaction = await (Home.sequelize as Sequelize).transaction({ 
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
      });
      try {
        // Fetch all home entries to clean up duplicates
        const allHomes = await Home.findAll({ order: [['id', 'ASC']], transaction });
        if (allHomes.length > 1) {
          const homesToDelete = allHomes.slice(1);
          for (const homeToDelete of homesToDelete) {
            if (homeToDelete.imagePath) {
              const oldImagePath = path.join(process.env.UPLOADS_DIR || 'C:/Users/gholi/Projects/ai-training-website/backend/src/uploads', homeToDelete.imagePath);
              try {
                await fs.unlink(oldImagePath);
                console.log(`Deleted old image: ${homeToDelete.imagePath}`);
              } catch (err) {
                console.warn(`Failed to delete old image at ${oldImagePath}:`, err);
              }
            }
            await homeToDelete.destroy({ transaction });
          }
        }

        let home = await Home.findOne({ order: [['id', 'ASC']], transaction });
        if (!home) {
          home = await Home.create({
            title: title || null,
            description: description || null,
            content: content || null,
            imagePath,
            mediaType: req.file?.mimetype || null,
            updatedAt: new Date(),
          }, { transaction });
        } else {
          if (home.imagePath && home.imagePath !== imagePath) {
            const oldImagePath = path.join(process.env.UPLOADS_DIR || 'C:/Users/gholi/Projects/ai-training-website/backend/src/uploads', home.imagePath);
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
            content: content || home.content,
            imagePath,
            mediaType: req.file?.mimetype || home.mediaType,
            updatedAt: new Date(),
          }, { transaction });
        }

        await transaction.commit();
        console.log('Home updated:', home.toJSON());
        res.status(200).json(home);
      } catch (error: any) {
        await transaction.rollback();
        if (req.file) {
          const failedImagePath = path.join(process.env.UPLOADS_DIR || 'C:/Users/gholi/Projects/ai-training-website/backend/src/uploads', req.file.filename);
          try {
            await fs.unlink(failedImagePath);
            console.log(`Deleted image on error: ${req.file.filename}`);
          } catch (err) {
            console.warn(`Failed to delete image on error at ${failedImagePath}:`, err);
          }
        }
        console.error('Error updating home:', error.message, error.stack);
        next(error);
      }
    } catch (error: any) {
      console.error('Transaction error:', error.message, error.stack);
      next(error);
    }
  }) as RequestHandler
);

router.put(
  '/:id',
  upload.single('image') as RequestHandler,
  handleMulterError,
  (async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
      console.log('PUT /api/home/:id received:', req.params, req.body);
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid home entry ID' });
      }

      const homeEntry = await Home.findByPk(id);
      if (!homeEntry) {
        return res.status(404).json({ error: 'Home entry not found' });
      }

      const { title, description, content, mediaType } = req.body;
      let imagePath = req.file?.filename || homeEntry.imagePath;

      if (req.file && homeEntry.imagePath) {
        const oldImagePath = path.join(process.env.UPLOADS_DIR || 'uploads', homeEntry.imagePath);
        try {
          await fs.unlink(oldImagePath);
          console.log(`Deleted old image: ${homeEntry.imagePath}`);
        } catch (err) {
          console.warn(`Failed to delete old image at ${oldImagePath}:`, err);
        }
      }

      const updates: Partial<HomeRequestBody> = {};
      if (title !== undefined) updates.title = title || null;
      if (description !== undefined) updates.description = description || null;
      if (content !== undefined) updates.content = content || null;
      if (mediaType !== undefined) updates.mediaType = mediaType || null;

      await homeEntry.update({
        ...updates,
        imagePath,
        updatedAt: new Date(),
      });

      console.log('Home entry updated successfully:', homeEntry.toJSON());
      res.status(200).json(homeEntry);
    } catch (error: any) {
      console.error('Error updating home entry:', error.message, error.stack);
      next(error);
    }
  }) as RequestHandler
);

router.delete(
  '/:id',
  (async (req: Request<ParamsDictionary, any, any, ParsedQs>, res: Response, next: NextFunction) => {
    try {
      console.log(`Incoming request: DELETE /api/home/${req.params.id}`);
      const { id } = req.params;
      const homeEntry = await Home.findByPk(parseInt(id));
      if (!homeEntry) {
        return res.status(404).json({ error: 'Home entry not found' });
      }

      let deletionError = null;
      if (homeEntry.imagePath) {
        const imagePath = path.join(process.env.UPLOADS_DIR || 'C:/Users/gholi/Projects/ai-training-website/backend/src/uploads', homeEntry.imagePath);
        console.log(`Attempting to delete image at: ${imagePath}`);
        try {
          await fs.unlink(imagePath);
          console.log(`Deleted image: ${homeEntry.imagePath}`);
        } catch (err: any) {
          deletionError = err;
          console.warn(`Failed to delete image at ${imagePath}:`, err.message);
        }
      }

      await homeEntry.destroy();
      if (deletionError) {
        return res.status(500).json({ error: 'Failed to delete associated image', details: deletionError.message });
      }
      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting home entry:', error.message, error.stack);
      next(error);
    }
  }) as RequestHandler
);

export default router;