import express from "express";
import {
  getCityComparisonController,
  getStateComparisonController,
  getMetroComparisonController,
  postAiComparisonController,
} from "../controllers/comparison.controller.js";
import { validateAiComparison } from "../middleware/comparison.validation.js";

const router = express.Router();

router.get("/cities", getCityComparisonController);
router.get("/states", getStateComparisonController);
router.get("/metros", getMetroComparisonController);

router.post(
  "/ai",
  validateAiComparison,
  postAiComparisonController,
);

export default router;
