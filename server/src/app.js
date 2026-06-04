import express from "express";
import dotenv from "dotenv";
import statesRoutes from "./routes/states.routes.js";

dotenv.config();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;

// routes
app.use("/api/states", statesRoutes);

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
