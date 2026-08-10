import { z } from "zod";

import { BookingStatus } from "../types/booking.types.js";

export const createBookingSchema = z.object({
  body: z.object({
    tour: z
      .string()
      .trim()
      .min(1, "Tour ID is required"),

    travelDate: z.coerce.date(),

    travellers: z
      .number()
      .int("Travellers must be a whole number")
      .positive("At least one traveller is required"),
  }),
});

export const updateBookingSchema = z.object({
  body: z.object({
    travelDate: z.coerce.date().optional(),

    travellers: z
      .number()
      .int("Travellers must be a whole number")
      .positive("At least one traveller is required")
      .optional(),

    status: z.nativeEnum(BookingStatus).optional(),
  }),
});

export const getBookingsQuerySchema = z.object({
  query: z.object({
    status: z.nativeEnum(BookingStatus).optional(),

    page: z.coerce.number().int().positive().default(1),

    limit: z.coerce
      .number()
      .int()
      .positive()
      .max(100)
      .default(10),

    sortBy: z
      .enum([
        "travelDate",
        "createdAt",
        "updatedAt",
        "totalPrice",
      ])
      .default("createdAt"),

    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});

export type CreateBookingInput =
  z.infer<typeof createBookingSchema>["body"];

export type UpdateBookingInput =
  z.infer<typeof updateBookingSchema>["body"];

export type GetBookingsQueryInput =
  z.infer<typeof getBookingsQuerySchema>["query"];