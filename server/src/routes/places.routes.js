import express from "express";

import { getPublishedArticlesByPlaceIdController } from "../controllers/articles.controller.js";
import { validatePlaceId } from "../middleware/articles.validation.js";

const router = express.Router();

router.get(
  "/:placeId/articles",
  validatePlaceId,
  getPublishedArticlesByPlaceIdController,
);

export default router;
