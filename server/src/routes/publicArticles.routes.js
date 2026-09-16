import express from "express";
import {
  getPublishedArticlesController,
  getPublishedArticleBySlugController,
} from "../controllers/articles.controller.js";

const router = express.Router();

router.get("/", getPublishedArticlesController);
router.get("/:slug", getPublishedArticleBySlugController);

export default router;
