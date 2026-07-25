import { UserRole } from "../types/user.types.js";
import { Router } from "express";

import {
  login,
  register,
} from "../controllers/auth.controller.js";
import {
  authenticate,
  authorise,
} from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import {
  loginSchema,
  registerSchema,
} from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validate(registerSchema),
  register,
);

authRouter.post(
  "/login",
  validate(loginSchema),
  login,
);

authRouter.get(
  "/me",
  authenticate,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Authenticated user retrieved successfully",
      data: {
        user: req.user,
      },
    });
  },
);

authRouter.get(
  "/admin",
  authenticate,
  authorise(UserRole.ADMIN),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access granted",
      data: {
        user: req.user,
      },
    });
  },
);

export default authRouter;
