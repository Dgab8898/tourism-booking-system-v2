import mongoose, {
  type Model,
  Schema,
  model,
} from "mongoose";

import {
  BookingStatus,
  type IBooking,
} from "../types/booking.types.js";

type BookingModel = Model<IBooking>;

const bookingSchema = new Schema<IBooking, BookingModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
      index: true,
    },

    travelDate: {
      type: Date,
      required: true,
    },

    travellers: {
      type: Number,
      required: true,
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

bookingSchema.index({
  user: 1,
  tour: 1,
  travelDate: 1,
});

const Booking =
  (mongoose.models.Booking as BookingModel | undefined) ||
  model<IBooking, BookingModel>("Booking", bookingSchema);

export default Booking;
