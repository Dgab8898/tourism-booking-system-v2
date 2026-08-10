
import { Router } from "express";

import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "../controllers/tour.controller.js";

import {
  authenticate,
  authorise,
} from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.js";
import { UserRole } from "../types/user.types.js";

import {
  createTourSchema,
  getToursQuerySchema,
  updateTourSchema,
} from "../validators/tour.validator.js";

const router = Router();

router.get(
  "/",
  validate(getToursQuerySchema),
  getAll,
);

router.get("/:id", getOne);

router.post(
  "/",
  authenticate,
  authorise(UserRole.ADMIN),
  validate(createTourSchema),
  create,
);

router.patch(
  "/:id",
  authenticate,
  authorise(UserRole.ADMIN),
  validate(updateTourSchema),
  update,
);

router.delete(
  "/:id",
  authenticate,
  authorise(UserRole.ADMIN),
  remove,
);

export default router;