// backend/src/routes/home.ts
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    title: "AI Learning Home",
    content: "Welcome to our AI Learning platform. Empower your teams and revolutionize training."
  });
});

export default router;
