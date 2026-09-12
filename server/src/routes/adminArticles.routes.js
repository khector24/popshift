import express from "express";
import {
  getAdminArticlesController,
  getAdminArticleByIdController,
  createArticleController,
  updateArticleController,
  deleteArticleController,
} from "../controllers/articles.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";
import {
  validateArticleId,
  validateCreateArticle,
  validateUpdateArticle,
} from "../middleware/articles.validation.js";

const router = express.Router();

router.get("/", authenticateAdmin, getAdminArticlesController);
router.get(
  "/:id",
  authenticateAdmin,
  validateArticleId,
  getAdminArticleByIdController,
);
router.post(
  "/",
  authenticateAdmin,
  validateCreateArticle,
  createArticleController,
);
router.patch(
  "/:id",
  authenticateAdmin,
  validateArticleId,
  validateUpdateArticle,
  updateArticleController,
);
router.delete(
  "/:id",
  authenticateAdmin,
  validateArticleId,
  deleteArticleController,
);

export default router;
