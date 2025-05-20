// backend/src/routes/contact.ts
import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
  const { name, email, message } = req.body;
  // Here, you might add logic to store the contact info or send an email.
  res.status(201).json({
    message: 'Thank you for your message!',
    data: { name, email, message }
  });
});

export default router;
