import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import resourcesRoutes from './routes/resources';
import homeRoutes from './routes/home';
import aboutRoutes from './routes/about';
import contactRoutes from './routes/contact';
import { upload } from './config/multer';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json()); // Parse JSON bodies
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Serve uploaded files statically
app.use('/uploads', express.static('src/uploads'));

// Routes
app.use('/api/home', homeRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/contact', contactRoutes);

// Health-check endpoint
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the AI Learning API' });
});

// Sync database
sequelize.sync({ force: true }).then(() => {
  console.log('Database synced');
}).catch((err) => {
  console.error('Database sync failed:', err);
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});