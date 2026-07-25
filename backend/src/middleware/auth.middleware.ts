import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type { UserRole } from "../types/user.types.js";
import { verifyAccessToken } from "../utils/jwt.js";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authentication token is required",
    });

    return;
  }

  const token = authorizationHeader.slice(7).trim();

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication token is required",
    });

    return;
  }

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
      role: payload.role as UserRole,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
}

export function authorise(
  ...allowedRoles: UserRole[]
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication is required",
      });

      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });

      return;
    }

    next();
  };
}
