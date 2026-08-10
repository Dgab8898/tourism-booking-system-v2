import type { Types } from "mongoose";

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export interface IBooking {
  user: Types.ObjectId;
  tour: Types.ObjectId;

  travelDate: Date;
  travellers: number;
  totalPrice: number;

  status: BookingStatus;

  createdAt: Date;
  updatedAt: Date;
}