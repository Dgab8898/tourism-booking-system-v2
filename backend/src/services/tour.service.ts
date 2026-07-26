import Tour from "../models/Tour.js";
import type {
  CreateTourInput,
  GetToursQueryInput,
  UpdateTourInput,
} from "../validators/tour.validator.js";

export async function createTour(input: CreateTourInput) {
  return Tour.create(input);
}

export async function getAllTours(query: GetToursQueryInput) {
  const {
    search,
    destination,
    difficulty,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    isActive,
  } = query;

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { destination: { $regex: search, $options: "i" } },
    ];
  }

  if (destination) {
    filter.destination = {
      $regex: destination,
      $options: "i",
    };
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  if (typeof isActive === "boolean") {
    filter.isActive = isActive;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};

    if (minPrice !== undefined) {
      (filter.price as Record<string, number>).$gte = minPrice;
    }

    if (maxPrice !== undefined) {
      (filter.price as Record<string, number>).$lte = maxPrice;
    }
  }

  const skip = (page - 1) * limit;

  const [tours, total] = await Promise.all([
    Tour.find(filter)
      .sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      })
      .skip(skip)
      .limit(limit),

    Tour.countDocuments(filter),
  ]);

  return {
    tours,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getTourById(id: string) {
  return Tour.findById(id);
}

export async function updateTour(
  id: string,
  input: UpdateTourInput,
) {
  return Tour.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  });
}

export async function deleteTour(id: string) {
  return Tour.findByIdAndDelete(id);
}