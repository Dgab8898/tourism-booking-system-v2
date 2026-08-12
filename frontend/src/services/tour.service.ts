import { apiRequest } from "./api";

export interface Tour {
  _id: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  price: number;
  maxGroupSize: number;
  difficulty: "easy" | "moderate" | "difficult";
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

export async function getTours(): Promise<ToursResponse> {
  return apiRequest<ToursResponse>("/api/tours");
}