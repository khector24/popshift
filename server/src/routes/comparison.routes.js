import express from "express";
import { getCityComparisonController } from "../controllers/comparison.controller.js";

const router = express.Router();

router.get("/cities", getCityComparisonController);

export default router;
