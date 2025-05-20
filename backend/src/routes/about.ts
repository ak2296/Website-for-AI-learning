// backend/src/routes/about.ts
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    title: "About AI Learning",
    content: "Learn more about our mission, vision, and values to power smarter organizations."
  });
});

export default router;
