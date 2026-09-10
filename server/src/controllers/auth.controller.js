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

    return res.json({
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
