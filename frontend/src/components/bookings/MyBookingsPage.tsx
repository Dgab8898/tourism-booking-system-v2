import { useEffect, useState } from "react";
import {
  Calendar,
  Loader2,
  MapPin,
  Trash2,
  Users,
} from "lucide-react";

import { apiRequest } from "../../services/api";

import {
  deleteBooking,
  type Booking,
  type BookingTour,
} from "../../services/booking.service";

interface MyBookingsResponse {
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

export function MyBookingsPage() {
  const [bookings, setBookings] = useState<
    Booking[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [
    deletingBookingId,
    setDeletingBookingId,
  ] = useState<string | null>(null);

  async function loadBookings(): Promise<void> {
    try {
      setLoading(true);
      setError("");

      const response =
        await apiRequest<MyBookingsResponse>(
          "/api/bookings/my?page=1&limit=20",
        );

      setBookings(response.data.bookings);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load your bookings",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBookings();
  }, []);

  async function handleCancelBooking(
    bookingId: string,
  ): Promise<void> {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingBookingId(bookingId);
      setError("");

      await deleteBooking(bookingId);

      setBookings((current) =>
        current.filter(
          (booking) =>
            booking._id !== bookingId,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to cancel booking",
      );
    } finally {
      setDeletingBookingId(null);
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

          Loading your bookings...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-accent">
          Your Journeys
        </p>

        <h1
          className="mb-4 text-5xl font-bold"
          style={{
            fontFamily:
              "'Playfair Display', serif",
          }}
        >
          My Bookings
        </h1>

        <p className="max-w-xl text-muted-foreground">
          Review and manage your Wanderlust
          bookings.
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
          You do not have any bookings yet.
        </div>
      )}

      <div className="grid gap-6">
        {bookings.map((booking) => {
          const tour = getTour(booking);

          return (
            <article
              key={booking._id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="flex flex-col md:flex-row">
                <div className="h-48 bg-stone-200 md:h-auto md:w-72">
                  <img
                    src={
                      tour?.images?.[0] ||
                      "https://placehold.co/800x500"
                    }
                    alt={
                      tour?.title ??
                      "Wanderlust tour"
                    }
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 p-7">
                  <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
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

                    {booking.status !==
                      "cancelled" && (
                      <button
                        type="button"
                        disabled={
                          deletingBookingId ===
                          booking._id
                        }
                        onClick={() =>
                          void handleCancelBooking(
                            booking._id,
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingBookingId ===
                        booking._id ? (
                          <>
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <Trash2 size={15} />
                            Cancel Booking
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}