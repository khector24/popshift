import express from "express";
import {
  getCityComparisonController,
  getStateComparisonController,
  getMetroComparisonController,
} from "../controllers/comparison.controller.js";

const router = express.Router();

router.get("/cities", getCityComparisonController);
router.get("/states", getStateComparisonController);
router.get("/metros", getMetroComparisonController);

export default router;
