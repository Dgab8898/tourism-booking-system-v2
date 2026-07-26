import type { NextFunction, Request, Response } from "express";

import {
  createTour,
  deleteTour,
  getAllTours,
  getTourById,
  updateTour,
} from "../services/tour.service.js";

import type {
  CreateTourInput,
  GetToursQueryInput,
  UpdateTourInput,
} from "../validators/tour.validator.js";

export async function create(
  req: Request<Record<string, never>, unknown, CreateTourInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const tour = await createTour(req.body);

    res.status(201).json({
      success: true,
      message: "Tour created successfully",
      data: {
        tour,
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
    const validated = res.locals.validated as
      | {
          query?: GetToursQueryInput;
        }
      | undefined;

    const query =
      validated?.query ??
      (req.query as unknown as GetToursQueryInput);

    const result = await getAllTours(query);

    res.status(200).json({
      success: true,
      message: "Tours retrieved successfully",
      results: result.tours.length,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
      data: {
        tours: result.tours,
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
    const tour = await getTourById(req.params.id);

    if (!tour) {
      res.status(404).json({
        success: false,
        message: "Tour not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Tour retrieved successfully",
      data: {
        tour,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function update(
  req: Request<{ id: string }, unknown, UpdateTourInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const tour = await updateTour(req.params.id, req.body);

    if (!tour) {
      res.status(404).json({
        success: false,
        message: "Tour not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Tour updated successfully",
      data: {
        tour,
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
    const tour = await deleteTour(req.params.id);

    if (!tour) {
      res.status(404).json({
        success: false,
        message: "Tour not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Tour deleted successfully",
      data: {
        tour,
      },
    });
  } catch (error) {
    next(error);
  }
}