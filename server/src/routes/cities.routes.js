import express from "express";
import {
  getCitiesController,
  getCityBySlugController,
} from "../controllers/cities.controller.js";

const router = express.Router();

router.get("/", getCitiesController);

router.get("/:slug", getCityBySlugController);

export default router;
