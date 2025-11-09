import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";

//routes imports
import blogRoutes from "./routes/blog.routes.js";
import historyRoutes from "./routes/history.routes.js";
import userRoutes from "./routes/user.routes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Allow origins to be configured with FRONTEND_URL (comma-separated) in env
const frontendEnv = process.env.FRONTEND_URL || "http://localhost:3000";
const origins = frontendEnv.split(",").map((u) => u.trim());

app.use(
  cors({ origin: (origin, cb) => {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return cb(null, true);
    if (origins.indexOf(origin) !== -1) return cb(null, true);
    return cb(new Error('CORS: Origin not allowed'), false);
  }, credentials: true })
);

app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Blog Generator API is running",
    status: "healthy",
  });
});

// API Routes
app.use("/api/blog", blogRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/user", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

// docker compose -f docker-compose.yml up
