import Joi from "joi";

import { AppError } from "../utils/AppError.js";

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(1).required(),
});

export function validateLogin(req, res, next) {
  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw new AppError(error.message, 400);
  }

  req.body = value;

  next();
}
