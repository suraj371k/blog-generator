import express from "express";
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
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());
// Connect to MongoDB
connectDB();
// Health check route
app.get("/", (req, res) => {
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
