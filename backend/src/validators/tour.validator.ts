import { z } from "zod";

import { TourDifficulty } from "../types/tour.types.js";

const tourFieldsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must contain at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must contain at least 10 characters"),

  destination: z
    .string()
    .trim()
    .min(2, "Destination must contain at least 2 characters")
    .max(100, "Destination must not exceed 100 characters"),

  duration: z
    .number()
    .int("Duration must be a whole number")
    .positive("Duration must be greater than zero"),

  price: z
    .number()
    .nonnegative("Price cannot be negative"),

  maxGroupSize: z
    .number()
    .int("Maximum group size must be a whole number")
    .positive("Maximum group size must be greater than zero"),

  difficulty: z.nativeEnum(TourDifficulty),

  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .default([]),

  availableDates: z.array(z.coerce.date()).default([]),

  includedServices: z.array(z.string()).default([]),

  excludedServices: z.array(z.string()).default([]),

  isActive: z.boolean().optional(),
});

export const createTourSchema = z.object({
  body: tourFieldsSchema,
});

export const updateTourSchema = z.object({
  body: tourFieldsSchema.partial(),
});

export const getToursQuerySchema = z.object({
  query: z
    .object({
      search: z.string().trim().min(1).optional(),

      destination: z.string().trim().min(1).optional(),

      difficulty: z.nativeEnum(TourDifficulty).optional(),

      minPrice: z.coerce.number().nonnegative().optional(),

      maxPrice: z.coerce.number().nonnegative().optional(),

      page: z.coerce.number().int().positive().default(1),

      limit: z.coerce.number().int().positive().max(100).default(10),

      sortBy: z
        .enum([
          "title",
          "destination",
          "price",
          "duration",
          "createdAt",
          "updatedAt",
        ])
        .default("createdAt"),

      sortOrder: z.enum(["asc", "desc"]).default("desc"),

      isActive: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
    })
    .refine(
      (query) =>
        query.minPrice === undefined ||
        query.maxPrice === undefined ||
        query.minPrice <= query.maxPrice,
      {
        message: "Minimum price cannot be greater than maximum price",
        path: ["minPrice"],
      },
    ),
});

export type CreateTourInput =
  z.infer<typeof createTourSchema>["body"];

export type UpdateTourInput =
  z.infer<typeof updateTourSchema>["body"];

export type GetToursQueryInput =
  z.infer<typeof getToursQuerySchema>["query"];