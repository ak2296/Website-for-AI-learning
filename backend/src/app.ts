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

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const uploadsPath = path.resolve(__dirname, "uploads");

// Verify uploads directory exists
if (!fs.existsSync(uploadsPath)) {
  console.warn("Uploads directory does not exist at:", uploadsPath);
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("Created uploads directory at:", uploadsPath);
} else {
  console.log("Uploads directory confirmed at:", uploadsPath);
}

app.use(cors({ origin: "http://localhost:5173", optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Early request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Early request detected:", req.method, req.path, req.headers);
  next();
});

// Mount routes
console.log("Mounting routes...");
app.use("/admin", adminRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactRoutes);
console.log("Routes mounted successfully");

// Serve uploaded files statically
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Checking upload path middleware:", req.path);
  if (req.path.startsWith("/uploads/")) {
    const originalPath = req.path.replace(/^\/uploads\/@img\//, "/uploads/");
    req.url = originalPath;
    console.log("Rewritten URL from:", req.path, "to:", originalPath);
  }
  next();
});

app.use("/uploads", express.static(uploadsPath, {
  setHeaders: (res, filePath) => {
    console.log("Attempting to serve file from:", filePath);
    res.set("Access-Control-Allow-Origin", "http://localhost:5173");
    if (!res.statusCode || res.statusCode === 200) {
      console.log("File served successfully:", filePath);
    } else {
      console.error("File serving failed:", filePath, "Status:", res.statusCode);
    }
  }
}));

// Fetch file content endpoint
app.get("/api/file/:filename", (req: Request, res: Response, next: NextFunction) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsPath, filename);
  console.log("Fetching file content for:", filePath);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err.message, err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the AI Learning API" });
});

// Server start with database sync and authentication
app.listen(PORT, async () => {
  try {
    console.log("Attempting database authentication and sync...");
    await syncDatabase(); // Explicit single sync
    await sequelize.authenticate();
    console.log("Database connected successfully");
    console.log("Starting server on port:", PORT);
    console.log("Uploads path set to:", uploadsPath);
  } catch (error) {
    console.error("Unable to connect to or sync the database:", error);
    process.exit(1);
  }
});

export default app;