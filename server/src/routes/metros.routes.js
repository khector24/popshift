import express from "express";
import { getMetros, getMetroBySlug } from "../services/metroDataService.js";

const router = express.Router();

router.get("/", (req, res) => {
  const metros = getMetros();

  if (!metros) {
    return res.status(404).json({
      message: "Metros not found",
    });
  }

  res.json(metros);
});

router.get("/:slug", (req, res) => {
  const { slug } = req.params;

  const metro = getMetroBySlug(slug);

  if (!metro) {
    return res.status(404).json({
      message: "Metro not found",
    });
  }

  res.json(metro);
});

export default router;
