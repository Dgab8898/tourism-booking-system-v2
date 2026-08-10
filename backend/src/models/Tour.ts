import mongoose, {
  type Model,
  Schema,
  model,
} from "mongoose";

import {
  type ITour,
  TourDifficulty,
} from "../types/tour.types.js";

type TourModel = Model<ITour>;

const tourSchema = new Schema<ITour, TourModel>(
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

const Tour =
  (mongoose.models.Tour as TourModel | undefined) ||
  model<ITour, TourModel>("Tour", tourSchema);

export default Tour;