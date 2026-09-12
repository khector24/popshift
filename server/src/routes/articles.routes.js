import express from "express";
import {
  getAdminArticlesController,
  getAdminArticleByIdController,
  createArticleController,
  updateArticleController,
} from "../controllers/articles.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";
import {
  validateCreateArticle,
  validateUpdateArticle,
} from "../middleware/articles.validation.js";

const router = express.Router();

router.get("/", authenticateAdmin, getAdminArticlesController);
router.get("/:id", authenticateAdmin, getAdminArticleByIdController);
router.post(
  "/",
  authenticateAdmin,
  validateCreateArticle,
  createArticleController,
);
router.patch(
  "/:id",
  authenticateAdmin,
  validateUpdateArticle,
  updateArticleController,
);

export default router;
