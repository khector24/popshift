import Joi from "joi";

import { AppError } from "../utils/AppError.js";

const aiComparisonSchema = Joi.object({
  geographyType: Joi.string()
    .valid("city", "metro", "state")
    .required(),

  placeIdentifiers: Joi.array()
    .items(Joi.string().trim().min(1).required())
    .min(2)
    .max(4)
    .unique()
    .required(),

  personalization: Joi.object({
    reason: Joi.string()
      .valid(
        "moving",
        "work",
        "school",
        "family",
        "travel",
        "exploring",
        "other",
      )
      .allow(null)
      .default(null),

    otherReason: Joi.string()
      .trim()
      .max(200)
      .allow(null, "")
      .default(null),

    priorities: Joi.array()
      .items(
        Joi.string().valid(
          "affordability",
          "housing",
          "jobs-income",
          "transportation",
          "climate",
          "safety",
          "education",
          "population-growth",
          "lifestyle",
        ),
      )
      .unique()
      .default([]),

    preferences: Joi.object({
      climate: Joi.string()
        .valid(
          "warmer",
          "cooler",
          "four-seasons",
          "no-preference",
        )
        .allow(null)
        .default(null),
    }).default(),
  }).default(),
});

export function validateAiComparison(req, res, next) {
  const { error, value } = aiComparisonSchema.validate(
    req.body,
    {
      abortEarly: false,
    },
  );

  if (error) {
    throw new AppError(error.message, 400);
  }

  req.body = value;

  next();
}
