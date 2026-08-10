import { Types } from "mongoose";

import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";
import { BookingStatus } from "../types/booking.types.js";

import type {
  CreateBookingInput,
  GetBookingsQueryInput,
  UpdateBookingInput,
} from "../validators/booking.validator.js";

export class BookingError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "BookingError";
    this.statusCode = statusCode;
  }
}

export async function createBooking(
  userId: string,
  input: CreateBookingInput,
) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new BookingError("Invalid user ID", 400);
  }

  if (!Types.ObjectId.isValid(input.tour)) {
    throw new BookingError("Invalid tour ID", 400);
  }

  const tour = await Tour.findById(input.tour);

  if (!tour) {
    throw new BookingError("Tour not found", 404);
  }

  if (!tour.isActive) {
    throw new BookingError(
      "This tour is not currently available for booking",
      400,
    );
  }

  if (input.travellers > tour.maxGroupSize) {
    throw new BookingError(
      `This tour allows a maximum of ${tour.maxGroupSize} travellers`,
      400,
    );
  }

  const requestedDate = input.travelDate.getTime();

  const dateIsAvailable = tour.availableDates.some(
    (date: Date) => date.getTime() === requestedDate,
  );

  if (!dateIsAvailable) {
    throw new BookingError(
      "The selected travel date is not available for this tour",
      400,
    );
  }

  const userObjectId = new Types.ObjectId(userId);
  const tourObjectId = new Types.ObjectId(input.tour);

  const existingBooking = await Booking.findOne({
    user: userObjectId,
    tour: tourObjectId,
    travelDate: input.travelDate,
    status: {
      $ne: BookingStatus.CANCELLED,
    },
  });

  if (existingBooking) {
    throw new BookingError(
      "You already have an active booking for this tour and date",
      409,
    );
  }

  const totalPrice = tour.price * input.travellers;

  return Booking.create({
    user: userObjectId,
    tour: tourObjectId,
    travelDate: input.travelDate,
    travellers: input.travellers,
    totalPrice,
    status: BookingStatus.PENDING,
  });
}

export async function getAllBookings(
  query: GetBookingsQueryInput,
) {
  const {
    status,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const filter: Record<string, unknown> = {};

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate("user", "firstName lastName email role")
      .populate("tour", "title destination price")
      .sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      })
      .skip(skip)
      .limit(limit),

    Booking.countDocuments(filter),
  ]);

  return {
    bookings,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getUserBookings(
  userId: string,
  query: GetBookingsQueryInput,
) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new BookingError("Invalid user ID", 400);
  }

  const {
    status,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const filter: Record<string, unknown> = {
    user: new Types.ObjectId(userId),
  };

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate("tour", "title destination price images")
      .sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      })
      .skip(skip)
      .limit(limit),

    Booking.countDocuments(filter),
  ]);

  return {
    bookings,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getBookingById(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new BookingError("Invalid booking ID", 400);
  }

  return Booking.findById(id)
    .populate("user", "firstName lastName email role")
    .populate("tour", "title destination price images");
}

export async function getUserBookingById(
  userId: string,
  bookingId: string,
) {
  if (
    !Types.ObjectId.isValid(userId) ||
    !Types.ObjectId.isValid(bookingId)
  ) {
    throw new BookingError("Invalid booking ID", 400);
  }

  return Booking.findOne({
    _id: bookingId,
    user: new Types.ObjectId(userId),
  }).populate(
    "tour",
    "title destination price images",
  );
}

export async function updateBooking(
  id: string,
  input: UpdateBookingInput,
) {
  if (!Types.ObjectId.isValid(id)) {
    throw new BookingError("Invalid booking ID", 400);
  }

  return Booking.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  });
}

export async function deleteBooking(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new BookingError("Invalid booking ID", 400);
  }

  return Booking.findByIdAndDelete(id);
}

export async function updateUserBooking(
  userId: string,
  bookingId: string,
  input: UpdateBookingInput,
) {
  if (
    !Types.ObjectId.isValid(userId) ||
    !Types.ObjectId.isValid(bookingId)
  ) {
    throw new BookingError("Invalid booking ID", 400);
  }

  return Booking.findOneAndUpdate(
    {
      _id: bookingId,
      user: new Types.ObjectId(userId),
    },
    input,
    {
      new: true,
      runValidators: true,
    },
  );
}

export async function deleteUserBooking(
  userId: string,
  bookingId: string,
) {
  if (
    !Types.ObjectId.isValid(userId) ||
    !Types.ObjectId.isValid(bookingId)
  ) {
    throw new BookingError("Invalid booking ID", 400);
  }

  return Booking.findOneAndDelete({
    _id: bookingId,
    user: new Types.ObjectId(userId),
  });
}