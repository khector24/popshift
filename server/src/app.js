import express from "express";
import dotenv from "dotenv";
import statesRoutes from "./routes/states.routes.js";
import metroRoutes from "./routes/metros.routes.js";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;

// routes
app.use("/api/states", statesRoutes);
app.use("/api/metros", metroRoutes);

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
