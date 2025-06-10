import express, { Request, Response, Router } from "express";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config(); // Loads .env variables into process.env

const router: Router = express.Router();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Uses Gmail's SMTP service
  auth: {
    user: process.env.EMAIL_USER, // Email account to send from
    pass: process.env.EMAIL_PASS, // Password for that account
  },
});

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Contact data placeholder" });
});

const postHandler: express.RequestHandler = async (req: Request, res: Response) => {
  const { name, email, message } = req.body; // Extracts form data from the request

  // Validate input
  if (!name || !email || !message) {
    res.status(400).json({ error: "All fields are required" }); // Returns 400 if data is missing
    return;
  }

  const mailOptions = {
    from: email, // User's email from the form
    to: process.env.CONTACT_EMAIL, // Owner's email from .env
    subject: `Contact Form Submission from ${name}`, // Email subject
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // Email body
  };

  try {
    await transporter.sendMail(mailOptions); // Sends the email using Nodemailer
    res.status(200).json({ success: true, message: "Email sent successfully" }); // Success response
  } catch (error) {
    console.error("Email sending failed:", error); // Logs error for debugging
    res.status(500).json({ error: "Failed to send email" }); // Error response
  }
};

router.post("/", postHandler); // Handles POST requests to /api/contact

export default router;