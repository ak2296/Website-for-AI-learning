// backend/src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic API Health Check
app.get('/api', (req: Request, res: Response) => {
  res.send({ message: 'Welcome to the AI Learning API' });
});

// Endpoint for Home content
app.get('/api/home', (req: Request, res: Response) => {
  res.send({
    title: "AI Learning Home",
    content: "Welcome to our AI Learning platform. Empower your teams and revolutionize training."
  });
});

// Endpoint for About content
app.get('/api/about', (req: Request, res: Response) => {
  res.send({
    title: "About AI Learning",
    content: "Learn more about our mission, vision, and values to power smarter organizations."
  });
});

// Endpoint for Resources content
app.get('/api/resources', (req: Request, res: Response) => {
  res.send({
    title: "Resources",
    resources: [
      { id: 1, title: "Cutting-Edge Tools", description: "Leverage the latest in AI technology." },
      { id: 2, title: "Expert Tutorials", description: "Step-by-step guidance from industry experts." },
      { id: 3, title: "Community Support", description: "Collaborate and grow with a vibrant community." }
    ]
  });
});

// Endpoint to handle contact form submissions
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  // Here you would process the data, store it, or send an email as needed.
  res.status(201).send({ message: 'Thank you for your message!', data: { name, email, message } });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
