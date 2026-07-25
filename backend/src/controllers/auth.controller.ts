import type { NextFunction, Request, Response } from "express";

import {
  AuthError,
  loginUser,
  registerUser,
} from "../services/auth.service.js";
import type {
  LoginInput,
  RegisterInput,
} from "../validators/auth.validator.js";

export async function register(
  req: Request<Record<string, never>, unknown, RegisterInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request<Record<string, never>, unknown, LoginInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export function handleAuthError(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (error instanceof AuthError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  next(error);
}
