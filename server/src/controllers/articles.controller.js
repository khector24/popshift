import { AppError } from "../utils/AppError.js";
import {
  getAdminArticles,
  getAdminArticleById,
  createArticleWithRelations,
  updateArticleWithRelations,
} from "../services/articles.service.js";

export async function getAdminArticlesController(req, res, next) {
  try {
    const articles = await getAdminArticles();

    return res.json({
      data: articles,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminArticleByIdController(req, res, next) {
  try {
    const article = await getAdminArticleById(req.params.id);

    if (!article) {
      throw new AppError("Article not found", 404);
    }

    return res.json({
      data: article,
    });
  } catch (error) {
    next(error);
  }
}

export async function createArticleController(req, res, next) {
  try {
    const article = await createArticleWithRelations(req.body);

    return res.status(201).json({
      data: article,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateArticleController(req, res, next) {
  try {
    const article = await updateArticleWithRelations(req.params.id, req.body);

    if (!article) {
      throw new AppError("Article not found", 404);
    }

    return res.json({
      data: article,
    });
  } catch (error) {
    next(error);
  }
}
