import { Schema, model } from "mongoose";

import { TourDifficulty } from "../types/tour.types.js";

const tourSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    maxGroupSize: {
      type: Number,
      required: true,
      min: 1,
    },

    difficulty: {
      type: String,
      enum: Object.values(TourDifficulty),
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    availableDates: {
      type: [Date],
      default: [],
    },

    includedServices: {
      type: [String],
      default: [],
    },

    excludedServices: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

tourSchema.index({ destination: 1 });
tourSchema.index({ price: 1 });
tourSchema.index({ title: "text", description: "text" });

const Tour = model("Tour", tourSchema);

export default Tour;
