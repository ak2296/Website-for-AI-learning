// backend/src/routes/contact.ts
import express, { Request, Response, Router } from "express";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create a router for contact-related API routes
const router: Router = express.Router();

// Set up email transporter using environment variables
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail", // Email service (default to Gmail if not set)
  auth: {
    user: process.env.EMAIL_USER, // Email account to send from
    pass: process.env.EMAIL_PASS, // Password for that account
  },
});

// Handle GET request to show a placeholder contact response
router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Contact data placeholder" });
});

// Handle POST request to send contact form email
const postHandler: express.RequestHandler = async (req: Request, res: Response) => {
  const { name, email, message } = req.body; // Get form data from the request

  // Check if all required fields are provided
  if (!name || !email || !message) {
    res.status(400).json({ error: "All fields are required" }); // Return error if data is missing
    return;
  }

  const mailOptions = {
    from: email, // User's email from the form
    to: process.env.CONTACT_EMAIL, // Owner's email from .env
    subject: `Contact Form Submission from ${name}`, // Email subject
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // Email body
  };

  try {
    await transporter.sendMail(mailOptions); // Send the email using Nodemailer
    res.status(200).json({ success: true, message: "Email sent successfully" }); // Success response
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" }); // Error response
  }
};

router.post("/", postHandler); // Route for POST requests to /api/contact

export default router;