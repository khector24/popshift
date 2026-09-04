import {
  getCities,
  getCityBySlug,
  getCityPopulationHistory,
  getCityAcsProfile,
  getCityClimate,
  getCityMetro,
  getCityState,
} from "../services/cities.service.js";
import { AppError } from "../utils/AppError.js";

export async function getCitiesController(req, res) {
  const cities = await getCities();

  return res.json({
    data: cities,
  });
}

export async function getCityBySlugController(req, res) {
  const { slug } = req.params;

  const city = await getCityBySlug(slug);

  if (!city) {
    throw new AppError("City not found", 404);
  }

  const [state, metro, populationHistory, acsProfile, climate] =
    await Promise.all([
      getCityState(city.id),
      getCityMetro(city.id),
      getCityPopulationHistory(city.id),
      getCityAcsProfile(city.id),
      getCityClimate(city.id),
    ]);

  return res.json({
    city,
    state,
    metro,
    populationHistory,
    acsProfile,
    climate,
  });
}
