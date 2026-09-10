import jwt from "jsonwebtoken";
import pool from "../db/index.js";
import { AppError } from "../utils/AppError.js";

export async function authenticateAdmin(req, res, next) {
  try {
    const token = req.cookies.admin_token;

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `
        SELECT id, email, role, is_active
        FROM users
        WHERE id = $1;
      `,
      [decoded.sub],
    );

    const user = result.rows[0];

    if (!user || !user.is_active || user.role !== "admin") {
      throw new AppError("Unauthorized", 403);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new AppError("Authentication required", 401));
    }

    next(error);
  }
}
