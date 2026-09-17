import {
  buildCityComparison,
  buildStateComparison,
  buildMetroComparison,
} from "../services/comparison.service.js";
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

export function getStateComparisonController(req, res, next) {
  try {
    const { codes } = req.query;

    if (!codes) {
      throw new AppError("State codes are required", 400);
    }

    const stateCodes = codes.split(",");

    const comparison = buildStateComparison(stateCodes);

    if (!comparison) {
      throw new AppError("Invalid state comparison", 400);
    }

    res.json(comparison);
  } catch (error) {
    next(error);
  }
}

export function getMetroComparisonController(req, res, next) {
  try {
    const { slugs } = req.query;

    if (!slugs) {
      throw new AppError("Metro slugs are required", 400);
    }

    const metroSlugs = slugs.split(",");

    const comparison = buildMetroComparison(metroSlugs);

    if (!comparison) {
      throw new AppError("Invalid metro comparison", 400);
    }

    res.json(comparison);
  } catch (error) {
    next(error);
  }
}
