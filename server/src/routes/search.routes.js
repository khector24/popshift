import express from "express";
import { searchPlacesController } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/", searchPlacesController);

export default router;
