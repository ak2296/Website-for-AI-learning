import { Router, Request, Response, NextFunction } from "express"; // Explicitly import types
import Admin from "../models/admin";
import { TextEntry, Home, About, Resource } from "../config/database";
import multer from "multer";
import path from "path";
import fs from "fs"; // Added for directory creation

const router = Router();

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOADS_DIR || path.resolve(__dirname, "../uploads");
    console.log("Resolved upload directory:", uploadDir); // Added debug log
    // Ensure the directory exists
    if (!path.isAbsolute(uploadDir)) {
      console.warn("Upload directory path is not absolute:", uploadDir);
    }
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("Created uploads directory at:", uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});
const upload = multer({ storage });

// Admin login
router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Admin login required" });
});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { username } });
    if (admin) {
      const isValid = await admin.validPassword(password);
      if (isValid) {
        // Replace with actual token generation (e.g., using jsonwebtoken)
        const token = process.env.JWT_SECRET ? require('jsonwebtoken').sign({ username }, process.env.JWT_SECRET) : "dummy-token";
        res.json({ success: true, token });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    next(error); // Pass error to global handler
  }
});

// Protected routes (synchronous middleware)
router.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Authorization header:", req.headers.authorization); // Debug log
  if (!req.headers.authorization) {
    res.status(401).json({ message: "Unauthorized" });
    return; // Exit without calling next
  }
  next(); // Proceed if authorized
});

router.post("/upload", upload.single("file"), async (req: Request, res: Response, next: NextFunction) => {
  console.log("Received upload request:", req.body, req.file); // Debug log
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const { type, title, description } = req.body;
  const filename = req.file.filename; // Use raw filename
  console.log(`Saving ${type} with filename: ${filename}`); // Debug filename

  try {
    switch (type) {
      case "resources":
        await Resource.create({
          filePath: filename,
          title,
          description,
          mediaType: req.file.mimetype,
        });
        break;
      case "home":
        await Home.create({
          imagePath: filename,
          title,
          description,
          mediaType: req.file.mimetype,
        });
        break;
      case "about":
        await About.create({
          imagePath: filename,
          title,
          mediaType: req.file.mimetype,
        }); // Omit description for about
        break;
    }
    console.log(`Successfully saved ${type} to database with path: ${filename}`); // Debug log
    res.json({ message: "File uploaded successfully", filename });
  } catch (error: unknown) {
    const err = error as Error; // Cast to Error for logging
    console.error("Database save error details:", {
      error: err.message,
      stack: err.stack,
      type,
      title,
      description,
      filename,
    }); // Detailed error log
    next(err); // Pass error to global handler
  }
});

// New endpoint to fetch file metadata
router.get("/api/files", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const homes = await Home.findAll({ attributes: ["id", "imagePath", "title", "description", "mediaType"] });
    const abouts = await About.findAll({ attributes: ["id", "imagePath", "title", "mediaType"] }); // Omit description
    const resources = await Resource.findAll({ attributes: ["id", "filePath", "title", "description", "mediaType"] });
    console.log("Fetched files:", { homes, abouts, resources }); // Debug fetched data
    res.json({ homes, abouts, resources });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error fetching files:", err);
    next(err); // Pass error to global handler
  }
});

// Update /api/about endpoint to match About component
router.get("/api/about", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const about = await About.findOne({ attributes: ["id", "title", "content", "imagePath", "mediaType"] });
    if (!about) {
      res.status(404).json({ message: "About data not found" });
      return;
    }
    console.log("Fetched about:", about); // Debug fetched data
    res.json(about);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error fetching about:", err);
    next(err); // Pass error to global handler
  }
});

router.post("/text", async (req: Request, res: Response, next: NextFunction) => {
  const { content } = req.body;
  if (!content) {
    res.status(400).json({ message: "Content is required" });
    return;
  }
  try {
    await TextEntry.create({ content });
    res.json({ message: "Text saved successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    next(err); // Pass error to global handler
  }
});

export default router;