import { ArrowRight, Heart, MapPin, Star } from "lucide-react";

import type { Destination } from "../../types/travel";

interface FeaturedDestinationsProps {
  destinations: Destination[];
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onViewDestination: () => void;
  onViewAll: () => void;
}

export function FeaturedDestinations({
  destinations,
  wishlist,
  onToggleWishlist,
  onViewDestination,
  onViewAll,
}: FeaturedDestinationsProps) {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-accent text-sm font-bold uppercase tracking-widest mb-2">
            Explore the Globe
          </p>

          <h2
            className="text-4xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Top Destinations
          </h2>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.slice(0, 6).map((destination) => (
          <article
            key={destination.id}
            onClick={onViewDestination}
            className="group relative rounded-2xl overflow-hidden bg-stone-200 cursor-pointer"
            style={{ aspectRatio: "4/3" }}
          >
            <img
              src={destination.image}
              alt={`${destination.name}, ${destination.country}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <button
              type="button"
              aria-label={`Toggle ${destination.name} wishlist`}
              onClick={(event) => {
                event.stopPropagation();
                onToggleWishlist(destination.id);
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
            >
              <Heart
                size={16}
                className={
                  wishlist.includes(destination.id)
                    ? "fill-red-400 text-red-400"
                    : "text-white"
                }
              />
            </button>

            <div className="absolute inset-x-0 bottom-0 p-6">
              <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                {destination.tag}
              </span>

              <div className="mt-3 flex items-end justify-between">
                <div>
                  <h3
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {destination.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-1 text-white/80 text-sm">
                    <MapPin size={13} />
                    {destination.country}
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Star
                      size={13}
                      className="fill-amber-400 text-amber-400"
                    />

                    <span className="text-sm font-semibold text-white">
                      {destination.rating}
                    </span>
                  </div>

                  <p className="text-xs text-white/70">
                    From ${destination.startingFrom.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
