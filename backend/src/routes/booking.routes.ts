import { Router } from "express";

import {
  create,
  getAll,
  getMine,
  getOne,
  remove,
  update,
} from "../controllers/booking.controller.js";

import {
  authenticate,
  authorise,
} from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.js";
import { UserRole } from "../types/user.types.js";

import {
  createBookingSchema,
  getBookingsQuerySchema,
  updateBookingSchema,
} from "../validators/booking.validator.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  validate(createBookingSchema),
  create,
);

router.get(
  "/",
  authorise(UserRole.ADMIN),
  validate(getBookingsQuerySchema),
  getAll,
);

router.get(
  "/my",
  validate(getBookingsQuerySchema),
  getMine,
);

router.get(
  "/:id",
  authenticate,
  getOne,
);

router.patch(
  "/:id",
  validate(updateBookingSchema),
  update,
);

router.delete(
  "/:id",
  remove,
);
router.delete(
  "/:id",
  authorise(UserRole.ADMIN),
  remove,
);

export default router;