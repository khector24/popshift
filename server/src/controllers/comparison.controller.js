import { buildCityComparison } from "../services/comparison.service.js";
import { AppError } from "../utils/AppError.js";

export async function getCityComparisonController(req, res, next) {
  try {
    const { slugs } = req.query;

    if (!slugs) {
      throw new AppError("City slugs are required", 400);
    }

    const citySlugs = slugs.split(",");

    const comparison = await buildCityComparison(citySlugs);

    if (!comparison) {
      throw new AppError("Invalid city comparison", 400);
    }

    res.json(comparison);
  } catch (error) {
    next(error);
  }
}
