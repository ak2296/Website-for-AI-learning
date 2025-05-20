// backend/src/routes/resources.ts
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    title: "Resources",
    resources: [
      {
        id: 1,
        title: "Cutting-Edge Tools",
        description: "Leverage the latest AI technology to stay ahead in your field."
      },
      {
        id: 2,
        title: "Expert Tutorials",
        description: "Step-by-step guidance crafted by industry experts."
      },
      {
        id: 3,
        title: "Community Support",
        description: "Collaborate and grow with a vibrant network of peers."
      }
    ]
  });
});

export default router;
