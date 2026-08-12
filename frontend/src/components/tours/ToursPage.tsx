import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Clock,
  MapPin,
  Users,
} from "lucide-react";

import {
  getTours,
  type Tour,
} from "../../services/tour.service";

interface ToursPageProps {
  onBookTour: (tour: Tour) => void;
}

const FILTERS = [
  "All",
  "Easy",
  "Moderate",
  "Difficult",
] as const;

export function ToursPage({
  onBookTour,
}: ToursPageProps) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [activeFilter, setActiveFilter] =
    useState<(typeof FILTERS)[number]>("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTours(): Promise<void> {
      try {
        setLoading(true);
        setError("");

        const response = await getTours();

        setTours(response.data.tours);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load tours",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadTours();
  }, []);

  const filteredTours = useMemo(() => {
    if (activeFilter === "All") {
      return tours;
    }

    return tours.filter(
      (tour) =>
        tour.difficulty.toLowerCase() ===
        activeFilter.toLowerCase(),
    );
  }, [activeFilter, tours]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-accent">
          Curated for You
        </p>

        <h1
          className="mb-4 text-5xl font-bold"
          style={{
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Travel Packages
        </h1>

        <p className="max-w-xl text-muted-foreground">
          Explore live tours available through the
          Wanderlust booking platform.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap items-center gap-3">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              activeFilter === filter
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {loading && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          Loading tours...
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700"
        >
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        filteredTours.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            No tours are currently available.
          </div>
        )}

      <div className="grid grid-cols-1 gap-8">
        {filteredTours.map((tour) => (
          <article
            key={tour._id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md md:flex-row"
          >
            <div className="relative h-56 shrink-0 overflow-hidden bg-stone-200 md:h-auto md:w-80">
              <img
                src={
                  tour.images[0] ||
                  "https://placehold.co/800x500"
                }
                alt={tour.title}
                className="h-full w-full object-cover"
              />

              <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold capitalize text-white">
                {tour.difficulty}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between p-7">
              <div>
                <div className="mb-2 flex items-start justify-between gap-6">
                  <div>
                    <h2
                      className="mb-0.5 text-2xl font-bold"
                      style={{
                        fontFamily:
                          "'Playfair Display', serif",
                      }}
                    >
                      {tour.title}
                    </h2>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin size={13} />
                      {tour.destination}
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className="text-3xl font-bold text-primary"
                      style={{
                        fontFamily:
                          "'Playfair Display', serif",
                      }}
                    >
                      ${tour.price.toLocaleString()}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      per person
                    </p>
                  </div>
                </div>

                <p className="my-4 text-sm leading-relaxed text-muted-foreground">
                  {tour.description}
                </p>

                <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock
                      size={14}
                      className="text-accent"
                    />
                    {tour.duration}{" "}
                    {tour.duration === 1
                      ? "day"
                      : "days"}
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users
                      size={14}
                      className="text-accent"
                    />
                    Up to {tour.maxGroupSize} people
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tour.includedServices.map(
                    (service) => (
                      <span
                        key={service}
                        className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                      >
                        <Check
                          size={11}
                          className="text-primary"
                        />
                        {service}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={() => onBookTour(tour)}
                  className="flex-1 rounded-xl bg-primary py-3 font-bold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Book This Tour
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Learn More
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}