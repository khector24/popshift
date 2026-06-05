import express from "express";
import statesData from "../data/states.js";

const router = express.Router();

// GET /api/states
router.get("/", (req, res) => {
  let data = [...statesData];

  if (req.query.region) {
    data = data.filter(
      (item) => item.region.toLowerCase() === req.query.region.toLowerCase(),
    );
  }

  if (req.query.search) {
    data = data.filter((item) =>
      item.state.toLowerCase().includes(req.query.search.toLowerCase()),
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

  res.json(data);
});

export default router;
