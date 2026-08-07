import express from "express";
import dotenv from "dotenv";
import statesRoutes from "./routes/states.routes.js";
import metroRoutes from "./routes/metros.routes.js";
import cors from "cors";

dotenv.config();

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;

// API routes
app.use("/api/states", statesRoutes);
app.use("/api/metros", metroRoutes);

// Catch-all 404 middleware
app.use((req, res) => {
  return res.status(404).json({
    message: `API route ${req.method} ${req.originalUrl} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
