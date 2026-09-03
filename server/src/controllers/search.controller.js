import { searchPlaces } from "../services/search.service.js";

export async function searchPlacesController(req, res) {
  const { q = "" } = req.query;

  const results = await searchPlaces(q);

  return res.json({
    data: results,
  });
}
