import express from "express";
import { login, getMe, logout } from "../controllers/auth.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", authenticateAdmin, getMe);
router.post("/logout", logout);

export default router;
