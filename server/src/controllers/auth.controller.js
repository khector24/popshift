import jwt from "jsonwebtoken";
import { authenticateUser } from "../services/auth.service.js";
import { AppError } from "../utils/AppError.js";

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.cookie("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 8 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export function getMe(req, res) {
  return res.json({
    data: req.user,
  });
}

export function logout(req, res) {
  res.clearCookie("admin_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.json({
    message: "Logout successful",
  });
}
