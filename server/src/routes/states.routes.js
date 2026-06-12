import express from "express";
import {
  getCensusStates,
  getCensusStateByCode,
  getCensusStateHistoryByCode,
} from "../services/censusApi.js";

const router = express.Router();

// GET /api/states
router.get("/", async (req, res) => {
  let data = await getCensusStates();

  if (req.query.region) {
    data = data.filter(
      (item) => item.region.toLowerCase() === req.query.region.toLowerCase(),
    );
  }

  if (req.query.search) {
    data = data.filter((item) =>
      item.name.toLowerCase().includes(req.query.search.toLowerCase()),
    );
  }

  const field = req.query.sortBy || req.query.sortby;
  if (field) {
    data.sort((a, b) => {
      if (req.query.order === "asc") {
        return a[field] - b[field];
      } else {
        return b[field] - a[field];
      }
    });
  }

  const total = data.length;

  const limit = parseInt(req.query.limit);
  const page = parseInt(req.query.page) || 1;

  if (!isNaN(limit) && limit > 0) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    data = data.slice(startIndex, endIndex);
  }

  const totalPages = !isNaN(limit) && limit > 0 ? Math.ceil(total / limit) : 1;

  res.json({
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  });
});

// GET /api/states/:code/history
router.get("/:code/history", async (req, res) => {
  const history = await getCensusStateHistoryByCode(req.params.code);

  if (history.length === 0) {
    return res.status(404).json({ message: "State history not found" });
  }

  res.json(history);
});

// GET /api/states/:code
router.get("/:code", async (req, res) => {
  const state = await getCensusStateByCode(req.params.code);

  if (!state) {
    return res.status(404).json({ message: "State code not found" });
  }

  res.json(state);
});

export default router;
