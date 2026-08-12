import { apiRequest } from "./api";

export interface CreateBookingInput {
  tour: string;
  travelDate: string;
  travellers: number;
}

export interface BookingTour {
  _id: string;
  title: string;
  destination: string;
  price: number;
  images?: string[];
}

export interface BookingUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "customer" | "admin";
}

export interface Booking {
  _id: string;
  user: string | BookingUser;
  tour: string | BookingTour;
  travelDate: string;
  travellers: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  data: {
    booking: Booking;
  };
}

export interface UpdateBookingResponse {
  success: boolean;
  message: string;
  data: {
    booking: Booking;
  };
}

export interface DeleteBookingResponse {
  success: boolean;
  message: string;
  data: {
    booking: Booking;
  };
}

export async function createBooking(
  input: CreateBookingInput,
): Promise<CreateBookingResponse> {
  return apiRequest<CreateBookingResponse>(
    "/api/bookings",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function updateBookingStatus(
  bookingId: string,
  status: "confirmed" | "cancelled",
): Promise<UpdateBookingResponse> {
  return apiRequest<UpdateBookingResponse>(
    `/api/bookings/${bookingId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status,
      }),
    },
  );
}

export async function deleteBooking(
  bookingId: string,
): Promise<DeleteBookingResponse> {
  return apiRequest<DeleteBookingResponse>(
    `/api/bookings/${bookingId}`,
    {
      method: "DELETE",
    },
  );
}