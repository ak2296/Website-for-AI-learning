// src/app.ts
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize, syncDatabase } from "./config/database";
import resourcesRoutes from "./routes/resources";
import homeRoutes from "./routes/home";
import aboutRoutes from "./routes/about";
import contactRoutes from "./routes/contact";
import adminRoutes from "./routes/admin";
import path from "path";
import fs from "fs";

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const uploadsPath = process.env.UPLOADS_DIR ? path.resolve(process.env.UPLOADS_DIR) : path.resolve(__dirname, "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
} else {
  // Directory already exists
  
}

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
console.log("Mounting routes...");
app.use("/admin", adminRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactRoutes);
console.log("Routes mounted.");
// Serve uploaded files statically
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith("/uploads/")) {
    const originalPath = req.path.replace(/^\/uploads\/@img\//, "/uploads/");
    req.url = originalPath;
  }
  next();
});

app.use("/uploads", express.static(uploadsPath, {
  setHeaders: (res) => {
    res.set("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:5173");
  }
}));

// Fetch file content endpoint
app.get("/api/file/:filename", (req: Request, res: Response, next: NextFunction) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsPath, filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: "Internal server error" });
});

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the AI Learning API" });
});

// Start server with database sync and authentication
app.listen(PORT, async () => {
  try {
    await syncDatabase(); // Explicit single sync
    await sequelize.authenticate();
    console.log(`Server is running on port ${PORT}`);

  } catch (error) {
    process.exit(1);
  }
});

export default app;