import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database";
import resourcesRoutes from "./routes/resources";
import homeRoutes from "./routes/home";
import aboutRoutes from "./routes/about";
import contactRoutes from "./routes/contact"; // Import contact router

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json()); // Ensure JSON parsing

// Very early logging to catch all requests
// app.use((req: Request, res: Response, next: NextFunction) => {
//console.log("Early request detected:", req.method, req.path);
//process.stdout.write(""); // Force flush logs
//next();
//});

console.log("Mounting routes...");
app.use("/api/resources", resourcesRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactRoutes); // Mount contact router
//console.log("Routes mounted successfully");
//process.stdout.write(""); // Force flush logs

// Serve uploaded files statically with absolute path
app.use("/uploads", express.static("C:/Users/gholi/Projects/ai-training-website/backend/src/uploads"));

// Global error handler to catch unhandled exceptions
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err.message, err.stack);
  //process.stdout.write(""); // Force flush logs
  res.status(500).json({ error: "Internal server error" });
});

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the AI Learning API" });
});

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
    console.log(`Server running on port ${PORT}`);
    
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    
  }
});

export default app;