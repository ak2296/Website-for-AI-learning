// backend/src/app.ts
import express, { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import homeRoutes from './routes/home';
import aboutRoutes from './routes/about';
import resourcesRoutes from './routes/resources';
import contactRoutes from './routes/contact';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount the routes
app.use('/api/home', homeRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/contact', contactRoutes);

// Basic health-check endpoint
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the AI Learning API' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
