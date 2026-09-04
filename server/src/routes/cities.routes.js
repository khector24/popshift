import express from "express";
import {
  getCitiesController,
  getCityBySlugController,
  getCityWeatherController,
} from "../controllers/cities.controller.js";

const router = express.Router();

router.get("/", getCitiesController);

router.get("/:slug/weather", getCityWeatherController);

router.get("/:slug", getCityBySlugController);

export default router;
