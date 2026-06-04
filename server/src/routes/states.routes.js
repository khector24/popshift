import express from "express";
import statesData from "../data/states.js";

const router = express.Router();

// GET /api/states
router.get("/", (req, res) => {
  const data = [...statesData];

  res.json(data);
});

export default router;
