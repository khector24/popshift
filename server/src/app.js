import express from "express";
import dotenv from "dotenv";
import statesRoutes from "./routes/states.routes.js";
import metroRoutes from "./routes/metros.routes.js";
import citiesRoutes from "./routes/cities.routes.js";
import searchRoutes from "./routes/search.routes.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import adminArticlesRoutes from "./routes/adminArticles.routes.js";
import publicArticlesRoutes from "./routes/publicArticles.routes.js";
import placesRoutes from "./routes/places.routes.js";
import comparisonRoutes from "./routes/comparison.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

// Global middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// API routes
app.use("/api/states", statesRoutes);
app.use("/api/metros", metroRoutes);
app.use("/api/cities", citiesRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/articles", adminArticlesRoutes);
app.use("/api/articles", publicArticlesRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/comparisons", comparisonRoutes);

// Catch-all 404 middleware
app.use((req, res) => {
  return res.status(404).json({
    message: `API route ${req.method} ${req.originalUrl} not found`,
  });
});

// Error middleware
app.use(errorHandler);

export { app };
