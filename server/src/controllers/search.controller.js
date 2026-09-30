import { searchPlaces } from "../services/search.service.js";

export async function searchPlacesController(req, res) {
  const { q = "", type } = req.query;

  let placeTypes = null;

  if (type === "city") {
    placeTypes = ["city"];
  }

  if (type === "metro") {
    placeTypes = ["metro"];
  }

  if (type === "state") {
    placeTypes = ["state", "federal_district"];
  }

  const results = await searchPlaces(q, placeTypes);

  return res.json({
    data: results,
  });
}
