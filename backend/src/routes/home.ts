// backend/src/routes/home.ts
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

// Create a router for home-related API routes
const router = express.Router();

// Define the shape of the request body for home entries
interface HomeRequestBody {
  title?: string | null;
  description?: string | null;
  content?: string | null;
  mediaType?: string | null;
}

// Extend Request type to include file and body from multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
  body: HomeRequestBody;
}

// Handle errors from multer (file upload issues)
const handleMulterError: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: `Multer error: ${err.message}` });
  } else if (err) {
    res.status(400).json({ error: `Upload error: ${err.message}` });
  } else {
    next();
  }
};

// GET the latest home entry
router.get('/', (async (req: Request<ParamsDictionary, any, any, ParsedQs>, res: Response, next: NextFunction) => {
  try {
    const homeEntry = await Home.findOne({ order: [['id', 'ASC']] });
    if (!homeEntry) {
      return res.status(404).json({});
    }
    res.status(200).json(homeEntry);
  } catch (error: any) {
    next(error);
  }
}) as RequestHandler);

// POST a new or update home entry with an image
router.post(
  '/',
  upload.single('image') as RequestHandler,
  handleMulterError,
  (async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
      const { title, description, content, mediaType } = req.body;
      const imagePath = req.file?.filename;
      if (!imagePath) {
        return res.status(400).json({ error: 'Image is required' });
      }

      const transaction = await (Home.sequelize as Sequelize).transaction({ 
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
      });
      try {
        // Clean up duplicate home entries
        const allHomes = await Home.findAll({ order: [['id', 'ASC']], transaction });
        if (allHomes.length > 1) {
          const homesToDelete = allHomes.slice(1);
          for (const homeToDelete of homesToDelete) {
            if (homeToDelete.imagePath) {
              const oldImagePath = path.join(process.env.UPLOADS_DIR || 'src/uploads', homeToDelete.imagePath);
              try {
                await fs.unlink(oldImagePath);
              } catch (err) {
                // Silent fail on old image deletion
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
            const oldImagePath = path.join(process.env.UPLOADS_DIR || 'src/uploads', home.imagePath);
            try {
              await fs.unlink(oldImagePath);
            } catch (err) {
              // Silent fail on old image deletion
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
        
        res.status(200).json(home);
      } catch (error: any) {
        await transaction.rollback();
        if (req.file) {
          const failedImagePath = path.join(process.env.UPLOADS_DIR || 'src/uploads', req.file.filename);
          try {
            await fs.unlink(failedImagePath);
          } catch (err) {
            // Silent fail on image deletion
          }
        }
        next(error);
      }
    } catch (error: any) {
      next(error);
    }
  }) as RequestHandler
);

// PUT to update a specific home entry with an optional image
router.put(
  '/:id',
  upload.single('image') as RequestHandler,
  handleMulterError,
  (async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
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
        const oldImagePath = path.join(process.env.UPLOADS_DIR || 'src/uploads', homeEntry.imagePath);
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          // Silent fail on old image deletion
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

      res.status(200).json(homeEntry);
    } catch (error: any) {
      next(error);
    }
  }) as RequestHandler
);

// DELETE a specific home entry and its image
router.delete(
  '/:id',
  (async (req: Request<ParamsDictionary, any, any, ParsedQs>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const homeEntry = await Home.findByPk(parseInt(id));
      if (!homeEntry) {
        return res.status(404).json({ error: 'Home entry not found' });
      }

      let deletionError = null;
      if (homeEntry.imagePath) {
        const imagePath = path.join(process.env.UPLOADS_DIR || 'src/uploads', homeEntry.imagePath);
        try {
          await fs.unlink(imagePath);
        } catch (err: any) {
          deletionError = err;
        }
      }

      await homeEntry.destroy();
      if (deletionError) {
        return res.status(500).json({ error: 'Failed to delete associated image', details: deletionError.message });
      }
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }) as RequestHandler
);

export default router;