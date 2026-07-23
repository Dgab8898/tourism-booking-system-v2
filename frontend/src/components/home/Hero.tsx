import {
  Calendar,
  MapPin,
  Search,
  Users,
} from "lucide-react";

interface HeroProps {
  searchQuery: string;
  searchDate: string;
  searchTravelers: string;
  onSearchQueryChange: (value: string) => void;
  onSearchDateChange: (value: string) => void;
  onSearchTravelersChange: (value: string) => void;
  onSearch: () => void;
}

export function Hero({
  searchQuery,
  searchDate,
  searchTravelers,
  onSearchQueryChange,
  onSearchDateChange,
  onSearchTravelersChange,
  onSearch,
}: HeroProps) {
  return (
    <section className="relative h-[88vh] min-h-[560px] overflow-hidden bg-stone-800">
      <img
        src="https://images.unsplash.com/photo-1732808460864-b8e5eb489a52?w=1920&h=1080&fit=crop&auto=format"
        alt="Stunning sunset over a tranquil sea"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <span className="mb-6 inline-block rounded-full bg-accent/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
          Crafted Journeys Since 2009
        </span>

        <h1
          className="mb-4 max-w-3xl text-5xl font-bold leading-tight text-white md:text-7xl"
          style={{
            fontFamily: "'Playfair Display', serif",
          }}
        >
          The World Is{" "}
          <em className="italic text-accent">Waiting</em>
          <br />
          for You
        </h1>

        <p className="mb-10 max-w-xl text-lg text-white/80 md:text-xl">
          Curated travel experiences across 60+ destinations — from
          barefoot luxury to cultural immersion.
        </p>

        <div className="flex w-full max-w-3xl flex-col gap-2 rounded-2xl bg-card p-2 shadow-2xl md:flex-row">
          <label className="flex flex-1 items-center gap-3 rounded-xl px-4 py-2 transition-colors hover:bg-muted">
            <MapPin
              size={18}
              className="shrink-0 text-accent"
              aria-hidden="true"
            />

            <span className="sr-only">Destination</span>

            <input
              type="text"
              placeholder="Where do you want to go?"
              value={searchQuery}
              onChange={(event) =>
                onSearchQueryChange(event.target.value)
              }
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </label>

          <div className="hidden w-px self-stretch bg-border md:block" />

          <label className="flex items-center gap-3 rounded-xl px-4 py-2 transition-colors hover:bg-muted">
            <Calendar
              size={18}
              className="shrink-0 text-accent"
              aria-hidden="true"
            />

            <span className="sr-only">Travel date</span>

            <input
              type="date"
              value={searchDate}
              onChange={(event) =>
                onSearchDateChange(event.target.value)
              }
              className="bg-transparent text-sm text-foreground focus:outline-none"
            />
          </label>

          <div className="hidden w-px self-stretch bg-border md:block" />

          <label className="flex items-center gap-3 rounded-xl px-4 py-2 transition-colors hover:bg-muted">
            <Users
              size={18}
              className="shrink-0 text-accent"
              aria-hidden="true"
            />

            <span className="sr-only">
              Number of travelers
            </span>

            <select
              value={searchTravelers}
              onChange={(event) =>
                onSearchTravelersChange(event.target.value)
              }
              className="bg-transparent text-sm text-foreground focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map(
                (travelerCount) => (
                  <option
                    key={travelerCount}
                    value={String(travelerCount)}
                  >
                    {travelerCount}{" "}
                    {travelerCount === 1
                      ? "Traveler"
                      : "Travelers"}
                  </option>
                ),
              )}
            </select>
          </label>

          <button
            type="button"
            onClick={onSearch}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Search size={16} aria-hidden="true" />
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
