import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  MapPin,
  ShieldCheck,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";

import { apiRequest } from "../../services/api";

import {
  updateBookingStatus,
  type Booking,
  type BookingTour,
  type BookingUser,
} from "../../services/booking.service";

interface AdminBookingsResponse {
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
    bookings: Booking[];
  };
}

function getTour(
  booking: Booking,
): BookingTour | null {
  return typeof booking.tour === "string"
    ? null
    : booking.tour;
}

function getUser(
  booking: Booking,
): BookingUser | null {
  return typeof booking.user === "string"
    ? null
    : booking.user;
}

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<
    Booking[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [
    updatingBookingId,
    setUpdatingBookingId,
  ] = useState<string | null>(null);

  async function loadBookings(): Promise<void> {
    try {
      setLoading(true);
      setError("");

      const response =
        await apiRequest<AdminBookingsResponse>(
          "/api/bookings?page=1&limit=50",
        );

      setBookings(response.data.bookings);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load bookings",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBookings();
  }, []);

  async function handleStatusChange(
    bookingId: string,
    status: "confirmed" | "cancelled",
  ): Promise<void> {
    try {
      setUpdatingBookingId(bookingId);
      setError("");

      const response =
        await updateBookingStatus(
          bookingId,
          status,
        );

      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status:
                  response.data.booking.status,
                updatedAt:
                  response.data.booking.updatedAt,
              }
            : booking,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update booking",
      );
    } finally {
      setUpdatingBookingId(null);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-10 text-muted-foreground">
          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading bookings...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-2 text-accent">
          <ShieldCheck size={18} />

          <p className="text-sm font-bold uppercase tracking-widest">
            Administration
          </p>
        </div>

        <h1
          className="mb-4 text-5xl font-bold"
          style={{
            fontFamily:
              "'Playfair Display', serif",
          }}
        >
          Booking Management
        </h1>

        <p className="max-w-xl text-muted-foreground">
          Review and manage bookings across the
          Wanderlust platform.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700"
        >
          {error}
        </div>
      )}

      {!error && bookings.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
          There are currently no bookings.
        </div>
      )}

      <div className="grid gap-6">
        {bookings.map((booking) => {
          const tour = getTour(booking);
          const user = getUser(booking);

          const isUpdating =
            updatingBookingId === booking._id;

          return (
            <article
              key={booking._id}
              className="rounded-2xl border border-border bg-card p-7 shadow-sm"
            >
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h2
                    className="text-2xl font-bold"
                    style={{
                      fontFamily:
                        "'Playfair Display', serif",
                    }}
                  >
                    {tour?.title ??
                      "Tour Booking"}
                  </h2>

                  {tour && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin size={13} />
                      {tour.destination}
                    </div>
                  )}
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-bold capitalize ${
                    booking.status ===
                    "confirmed"
                      ? "bg-green-100 text-green-700"
                      : booking.status ===
                          "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              {user && (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background">
                    <UserRound
                      size={16}
                      className="text-primary"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      {user.firstName}{" "}
                      {user.lastName}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-muted p-4">
                  <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={14} />
                    Travel Date
                  </div>

                  <strong>
                    {new Date(
                      booking.travelDate,
                    ).toLocaleDateString()}
                  </strong>
                </div>

                <div className="rounded-xl bg-muted p-4">
                  <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Users size={14} />
                    Travellers
                  </div>

                  <strong>
                    {booking.travellers}
                  </strong>
                </div>

                <div className="rounded-xl bg-muted p-4">
                  <p className="mb-1 text-sm text-muted-foreground">
                    Total
                  </p>

                  <strong className="text-primary">
                    $
                    {booking.totalPrice.toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="mt-6 flex flex-col justify-between gap-4 border-t border-border pt-5 sm:flex-row sm:items-center">
                <p className="text-xs text-muted-foreground">
                  Booking ID: {booking._id}
                </p>

                <div className="flex flex-wrap gap-3">
                  {booking.status !==
                    "confirmed" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() =>
                        void handleStatusChange(
                          booking._id,
                          "confirmed",
                        )
                      }
                      className="flex items-center gap-2 rounded-xl border border-green-200 px-4 py-2.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <CheckCircle2
                          size={15}
                        />
                      )}

                      Confirm
                    </button>
                  )}

                  {booking.status !==
                    "cancelled" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() =>
                        void handleStatusChange(
                          booking._id,
                          "cancelled",
                        )
                      }
                      className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <XCircle size={15} />
                      )}

                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}