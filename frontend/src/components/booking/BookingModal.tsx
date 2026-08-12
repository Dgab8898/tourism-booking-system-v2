import { useMemo, useState } from "react";
import {
  Calendar,
  Check,
  Loader2,
  Users,
  X,
} from "lucide-react";

import {
  createBooking,
  type Booking,
} from "../../services/booking.service";

import type { Tour } from "../../services/tour.service";

interface BookingModalProps {
  tour: Tour;
  onClose: () => void;
  onBooked: (booking: Booking) => void;
}

export function BookingModal({
  tour,
  onClose,
  onBooked,
}: BookingModalProps) {
  const [travelDate, setTravelDate] = useState(
    tour.availableDates[0] ?? "",
  );

  const [travellers, setTravellers] =
    useState(1);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  const totalPrice = useMemo(
    () => tour.price * travellers,
    [tour.price, travellers],
  );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const response = await createBooking({
        tour: tour._id,
        travelDate,
        travellers,
      });

      onBooked(response.data.booking);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create booking",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close booking modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <section className="relative z-10 w-full max-w-lg rounded-2xl bg-card p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
        >
          <X size={18} />
        </button>

        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-accent">
          Complete Booking
        </p>

        <h2
          className="mb-2 text-3xl font-bold"
          style={{
            fontFamily:
              "'Playfair Display', serif",
          }}
        >
          {tour.title}
        </h2>

        <p className="mb-6 text-muted-foreground">
          {tour.destination}
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-1.5 block text-sm font-semibold">
              Travel Date
            </label>

            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <select
                required
                value={travelDate}
                onChange={(event) =>
                  setTravelDate(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-border bg-input-background py-3 pl-10 pr-4 text-sm"
              >
                {tour.availableDates.map(
                  (date) => (
                    <option
                      key={date}
                      value={date}
                    >
                      {new Date(
                        date,
                      ).toLocaleDateString()}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">
              Travellers
            </label>

            <div className="relative">
              <Users
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <select
                value={travellers}
                onChange={(event) =>
                  setTravellers(
                    Number(event.target.value),
                  )
                }
                className="w-full rounded-xl border border-border bg-input-background py-3 pl-10 pr-4 text-sm"
              >
                {Array.from(
                  {
                    length:
                      tour.maxGroupSize,
                  },
                  (_, index) =>
                    index + 1,
                ).map((count) => (
                  <option
                    key={count}
                    value={count}
                  >
                    {count}{" "}
                    {count === 1
                      ? "Traveller"
                      : "Travellers"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl bg-muted p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total
              </span>

              <strong
                className="text-2xl text-primary"
                style={{
                  fontFamily:
                    "'Playfair Display', serif",
                }}
              >
                $
                {totalPrice.toLocaleString()}
              </strong>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {travellers} × $
              {tour.price.toLocaleString()}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              submitting ||
              !travelDate
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Creating Booking...
              </>
            ) : (
              <>
                <Check size={16} />
                Confirm Booking
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
}