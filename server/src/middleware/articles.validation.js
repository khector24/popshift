import Joi from "joi";

import { AppError } from "../utils/AppError.js";
import { slugify } from "../utils/slugify.js";

const articleIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const placeIdSchema = Joi.object({
  placeId: Joi.number().integer().positive().required(),
});

const createArticleSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .custom((value, helpers) => {
      if (!slugify(value)) {
        return helpers.message({
          custom: "Title must contain letters or numbers",
        });
      }

      return value;
    }),
  body: Joi.string().trim().min(1).required(),
  status: Joi.string().valid("draft", "published", "archived").default("draft"),
  tags: Joi.array().items(Joi.string().trim().min(1).max(100)).default([]),
  placeIds: Joi.array().items(Joi.number().integer().positive()).default([]),
});

const updateArticleSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .custom((value, helpers) => {
      if (!slugify(value)) {
        return helpers.message({
          custom: "Title must contain letters or numbers",
        });
      }

      return value;
    }),
  body: Joi.string().trim().min(1),
  status: Joi.string().valid("draft", "published", "archived"),
  tags: Joi.array().items(Joi.string().trim().min(1).max(100)),
  placeIds: Joi.array().items(Joi.number().integer().positive()),
}).min(1);

export function validateArticleId(req, res, next) {
  const { error } = articleIdSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error) {
    throw new AppError(error.message, 400);
  }

  next();
}

export function validatePlaceId(req, res, next) {
  const { error } = placeIdSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error) {
    throw new AppError(error.message, 400);
  }

  next();
}

export function validateCreateArticle(req, res, next) {
  const { error, value } = createArticleSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw new AppError(error.message, 400);
  }

  req.body = value;

  next();
}

export function validateUpdateArticle(req, res, next) {
  const { error, value } = updateArticleSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw new AppError(error.message, 400);
  }

  req.body = value;

  next();
}
