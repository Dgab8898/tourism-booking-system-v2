import { apiRequest } from "./api";

export type TourDifficulty =
  | "easy"
  | "moderate"
  | "difficult";

export interface Tour {
  _id: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  price: number;
  maxGroupSize: number;
  difficulty: TourDifficulty;
  images: string[];
  availableDates: string[];
  includedServices: string[];
  excludedServices: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ToursResponse {
  success: boolean;
  message: string;
  results: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: {
    tours: Tour[];
  };
}

export interface TourResponse {
  success: boolean;
  message: string;
  data: {
    tour: Tour;
  };
}

export interface CreateTourInput {
  title: string;
  description: string;
  destination: string;
  duration: number;
  price: number;
  maxGroupSize: number;
  difficulty: TourDifficulty;
  images: string[];
  availableDates: string[];
  includedServices: string[];
  excludedServices: string[];
  isActive?: boolean;
}

export type UpdateTourInput =
  Partial<CreateTourInput>;

export async function getTours(): Promise<ToursResponse> {
  return apiRequest<ToursResponse>(
    "/api/tours?page=1&limit=100",
  );
}

export async function createTour(
  input: CreateTourInput,
): Promise<TourResponse> {
  return apiRequest<TourResponse>(
    "/api/tours",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function updateTour(
  tourId: string,
  input: UpdateTourInput,
): Promise<TourResponse> {
  return apiRequest<TourResponse>(
    `/api/tours/${tourId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteTour(
  tourId: string,
): Promise<TourResponse> {
  return apiRequest<TourResponse>(
    `/api/tours/${tourId}`,
    {
      method: "DELETE",
    },
  );
}