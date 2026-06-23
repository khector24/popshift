import express from "express";
import {
  getCensusStates,
  getCensusStateByCode,
  getCensusStateHistoryByCode,
  getCensusDashboardSummary,
} from "../services/populationDataService.js";

import {
  getStateEconomics,
  getStateEconomicsByCode,
} from "../services/economicsDataService.js";

import { getStateMigrationByCode } from "../services/migrationDataService.js";

const router = express.Router();

// GET /api/states
router.get("/", (req, res) => {
  let data = getCensusStates();

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

// GET /api/states/dashboard/summary
router.get("/dashboard/summary", (req, res) => {
  const startYear = req.query.startYear || "2020";
  const endYear = req.query.endYear || "2025";

  const summary = getCensusDashboardSummary(startYear, endYear);

  res.json(summary);
});

// GET /api/states/economics
router.get("/economics", (req, res) => {
  const economics = getStateEconomics();

  if (!economics.data) {
    return res.status(404).json({
      message: "States economics data not found",
    });
  }

  res.json(economics);
});

// GET /api/states/:code/economics
router.get("/:code/economics", (req, res) => {
  const { code } = req.params;

  const stateEconomics = getStateEconomicsByCode(code);

  if (!stateEconomics.data) {
    return res.status(404).json({
      message: "State economics not found",
    });
  }

  res.json(stateEconomics);
});

// GET /api/states/:code/migration
router.get("/:code/migration", (req, res) => {
  const { code } = req.params;

  const stateMigration = getStateMigrationByCode(code);

  if (!stateMigration.data) {
    return res.status(404).json({
      message: "State migration data not found",
    });
  }

  res.json(stateMigration);
});

// GET /api/states/:code/history
router.get("/:code/history", (req, res) => {
  const history = getCensusStateHistoryByCode(req.params.code);

  if (history.length === 0) {
    return res.status(404).json({ message: "State history not found" });
  }

  res.json(history);
});

// GET /api/states/:code
router.get("/:code", (req, res) => {
  const state = getCensusStateByCode(req.params.code);

  if (!state) {
    return res.status(404).json({ message: "State code not found" });
  }

  res.json(state);
});

export default router;
