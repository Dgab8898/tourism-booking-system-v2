import type { NextFunction, Request, Response } from "express";

import {
  BookingError,
  createBooking,
  deleteBooking,
  deleteUserBooking,
  getAllBookings,
  getBookingById,
  getUserBookingById,
  getUserBookings,
  updateBooking,
  updateUserBooking,
} from "../services/booking.service.js";

import type {
  CreateBookingInput,
  GetBookingsQueryInput,
  UpdateBookingInput,
} from "../validators/booking.validator.js";

function getValidatedQuery(
  req: Request,
  res: Response,
): GetBookingsQueryInput {
  const validated = res.locals.validated as
    | {
        query?: GetBookingsQueryInput;
      }
    | undefined;

  return (
    validated?.query ??
    (req.query as unknown as GetBookingsQueryInput)
  );
}

export async function create(
  req: Request<Record<string, never>, unknown, CreateBookingInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication is required",
      });

      return;
    }

    const booking = await createBooking(
      req.user.userId,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMine(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication is required",
      });

      return;
    }

    const query = getValidatedQuery(req, res);

    const result = await getUserBookings(
      req.user.userId,
      query,
    );

    res.status(200).json({
      success: true,
      message: "Your bookings were retrieved successfully",
      results: result.bookings.length,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
      data: {
        bookings: result.bookings,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query = getValidatedQuery(req, res);
    const result = await getAllBookings(query);

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      results: result.bookings.length,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
      data: {
        bookings: result.bookings,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getOne(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication is required",
      });

      return;
    }

    const booking =
      req.user.role === "admin"
        ? await getBookingById(req.params.id)
        : await getUserBookingById(
            req.user.userId,
            req.params.id,
          );

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function update(
  req: Request<{ id: string }, unknown, UpdateBookingInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication is required",
      });

      return;
    }

    const booking =
      req.user.role === "admin"
        ? await updateBooking(req.params.id, req.body)
        : await updateUserBooking(
            req.user.userId,
            req.params.id,
            req.body,
          );

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication is required",
      });

      return;
    }

    const booking =
      req.user.role === "admin"
        ? await deleteBooking(req.params.id)
        : await deleteUserBooking(
            req.user.userId,
            req.params.id,
          );

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
}

export function handleBookingError(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (error instanceof BookingError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  next(error);
}