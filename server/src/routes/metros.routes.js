import express from "express";
import pool from "../db/index.js";
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

router.get("/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;

    const metro = getMetroBySlug(slug);

    if (!metro) {
      return res.status(404).json({
        message: "Metro not found",
      });
    }

    const result = await pool.query(
      `
        SELECT p.id
        FROM places p
        INNER JOIN metros m
          ON m.place_id = p.id
        WHERE p.slug = $1
        LIMIT 1
      `,
      [slug],
    );

    const place = result.rows[0];

    res.json({
      ...metro,
      id: place?.id ?? null,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
