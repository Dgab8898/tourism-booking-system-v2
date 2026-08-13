import { AdminToursPage } from "../components/admin/AdminToursPage";
import { AdminBookingsPage } from "../components/admin/AdminBookingsPage";
import { MyBookingsPage } from "../components/bookings/MyBookingsPage";

import { BookingModal } from "../components/booking/BookingModal";

import type { Booking } from "../services/booking.service";


import { useState } from "react";
import {
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Plane,
  Search,
  Star,
  Twitter,
} from "lucide-react";

import { Login } from "../components/auth/Login";
import { CallToAction } from "../components/home/CallToAction";
import { FeaturedDestinations } from "../components/home/FeaturedDestinations";
import { Hero } from "../components/home/Hero";
import { StatsBar } from "../components/home/StatsBar";
import { Testimonials } from "../components/home/Testimonials";
import { WhyChooseUs } from "../components/home/WhyChooseUs";

import {
  Navbar,
  type NavbarUser,
  type Page,
} from "../components/layout/Navbar";

import { ToursPage } from "../components/tours/ToursPage";

import {
  DESTINATIONS,
  TESTIMONIALS,
} from "../data";

import type { LoginResponse } from "../services/auth.service";
import type { Tour } from "../services/tour.service";

function readStoredUser(): NavbarUser | null {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as NavbarUser;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return null;
  }
}

export default function App() {
  const [page, setPage] =
    useState<Page>("home");

  const [currentUser, setCurrentUser] =
    useState<NavbarUser | null>(
      readStoredUser,
    );

  const [searchQuery, setSearchQuery] =
    useState("");

  const [searchDate, setSearchDate] =
    useState("");

  const [
    searchTravelers,
    setSearchTravelers,
  ] = useState("2");

  const [wishlist, setWishlist] = useState<
    number[]
  >([]);

  const [selectedTour, setSelectedTour] =
    useState<Tour | null>(null);

  const [completedBooking, setCompletedBooking] =
  useState<Booking | null>(null);

  function toggleWishlist(id: number): void {
    setWishlist((previous) =>
      previous.includes(id)
        ? previous.filter(
            (item) => item !== id,
          )
        : [...previous, id],
    );
  }

  function handleLogin(
    response: LoginResponse,
  ): void {
    setCurrentUser(response.data.user);
    setPage("home");
  }
function handleLogout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setCurrentUser(null);
  setSelectedTour(null);
  setCompletedBooking(null);
  setPage("home");
}

  function handleBookTour(tour: Tour): void {
    if (!currentUser) {
      setPage("login");
      return;
    }

    setSelectedTour(tour);
  }

  function closeSelectedTour(): void {
    setSelectedTour(null);
  }

  function handleBookingCreated(
  booking: Booking,
): void {
  setCompletedBooking(booking);
  setSelectedTour(null);
}

function closeBookingSuccess(): void {
  setCompletedBooking(null);
}

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <Navbar
        currentPage={page}
        onNavigate={setPage}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* LOGIN */}
      {page === "login" && (
        <Login onLogin={handleLogin} />
      )}

      {/* HOME */}
      {page === "home" && (
        <>
          <Hero
            searchQuery={searchQuery}
            searchDate={searchDate}
            searchTravelers={
              searchTravelers
            }
            onSearchQueryChange={
              setSearchQuery
            }
            onSearchDateChange={
              setSearchDate
            }
            onSearchTravelersChange={
              setSearchTravelers
            }
            onSearch={() =>
              setPage("destinations")
            }
          />

          <StatsBar />

          <FeaturedDestinations
            destinations={DESTINATIONS}
            wishlist={wishlist}
            onToggleWishlist={
              toggleWishlist
            }
            onViewDestination={() =>
              setPage("packages")
            }
            onViewAll={() =>
              setPage("destinations")
            }
          />

          <WhyChooseUs />

          <Testimonials
            testimonials={TESTIMONIALS}
          />

          <CallToAction
            onBrowsePackages={() =>
              setPage("packages")
            }
            onContactExpert={() =>
              setPage("about")
            }
          />
        </>
      )}

      {/* DESTINATIONS */}
      {page === "destinations" && (
        <main className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-accent">
              Explore
            </p>

            <h1
              className="mb-4 text-5xl font-bold"
              style={{
                fontFamily:
                  "'Playfair Display', serif",
              }}
            >
              All Destinations
            </h1>

            <p className="max-w-xl text-muted-foreground">
              Explore remarkable destinations
              and discover your next journey.
            </p>
          </div>

          <div className="mb-10 flex max-w-lg items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <Search
              size={18}
              className="shrink-0 text-muted-foreground"
            />

            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value,
                )
              }
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {DESTINATIONS.filter(
              (destination) =>
                destination.name
                  .toLowerCase()
                  .includes(
                    searchQuery.toLowerCase(),
                  ) ||
                destination.country
                  .toLowerCase()
                  .includes(
                    searchQuery.toLowerCase(),
                  ),
            ).map((destination) => (
              <article
                key={destination.id}
                onClick={() =>
                  setPage("packages")
                }
                className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-52 overflow-hidden bg-stone-200">
                  <img
                    src={destination.image}
                    alt={`${destination.name}, ${destination.country}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      toggleWishlist(
                        destination.id,
                      );
                    }}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition-colors hover:bg-white"
                    aria-label={`Toggle ${destination.name} wishlist`}
                  >
                    <Heart
                      size={14}
                      className={
                        wishlist.includes(
                          destination.id,
                        )
                          ? "fill-red-400 text-red-400"
                          : "text-muted-foreground"
                      }
                    />
                  </button>

                  <span className="absolute bottom-3 left-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                    {destination.tag}
                  </span>
                </div>

                <div className="p-5">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h2
                        className="text-lg font-bold"
                        style={{
                          fontFamily:
                            "'Playfair Display', serif",
                        }}
                      >
                        {destination.name}
                      </h2>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin size={12} />
                        {destination.country}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star
                        size={13}
                        className="fill-amber-400 text-amber-400"
                      />

                      <span className="text-sm font-semibold">
                        {destination.rating}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        ({destination.reviews})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        From
                      </span>

                      <p
                        className="text-lg font-bold text-primary"
                        style={{
                          fontFamily:
                            "'Playfair Display', serif",
                        }}
                      >
                        $
                        {destination.startingFrom.toLocaleString()}
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-primary">
                      View Tours
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
      )}

      {/* LIVE TOURS */}
      {page === "packages" && (
        <ToursPage
          onBookTour={handleBookTour}
        />
      )}

      {/* MY BOOKINGS */}
{page === "bookings" && currentUser && (
  <MyBookingsPage />
)}

{page === "admin-bookings" &&
  currentUser?.role === "admin" && (
    <AdminBookingsPage />
  )}

  {page === "admin-tours" &&
  currentUser?.role === "admin" && (
    <AdminToursPage />
  )}

      {/* ABOUT */}
      {page === "about" && (
        <main>
          <section className="relative h-72 overflow-hidden bg-stone-800">
            <img
              src="https://images.unsplash.com/photo-1656013082096-2ba1c0c0bc10?w=1600&h=600&fit=crop&auto=format"
              alt="Rocky coastline"
              className="h-full w-full object-cover opacity-60"
            />

            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">
                  Our Story
                </p>

                <h1
                  className="text-5xl font-bold text-white"
                  style={{
                    fontFamily:
                      "'Playfair Display', serif",
                  }}
                >
                  About Wanderlust
                </h1>
              </div>
            </div>
          </section>

          <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-16 md:grid-cols-2">
            <div>
              <h2
                className="mb-4 text-3xl font-bold"
                style={{
                  fontFamily:
                    "'Playfair Display', serif",
                }}
              >
                We Believe Travel Changes People
              </h2>

              <p className="mb-4 leading-relaxed text-muted-foreground">
                Wanderlust connects curious
                travellers with extraordinary
                destinations and carefully
                curated experiences.
              </p>

              <p className="leading-relaxed text-muted-foreground">
                We believe in authentic local
                connections, responsible
                tourism, and journeys that stay
                with travellers long after they
                return home.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h3
                className="mb-6 text-xl font-bold"
                style={{
                  fontFamily:
                    "'Playfair Display', serif",
                }}
              >
                Talk to a Travel Expert
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First name"
                    className="rounded-xl border border-border bg-input-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />

                  <input
                    type="text"
                    placeholder="Last name"
                    className="rounded-xl border border-border bg-input-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full rounded-xl border border-border bg-input-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />

                <textarea
                  placeholder="Tell us about the trip you have in mind..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border bg-input-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />

                <button
                  type="button"
                  className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Send Message
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone
                    size={14}
                    className="text-accent"
                  />
                  +1 800 555 0190
                </div>

                <div className="flex items-center gap-2">
                  <Mail
                    size={14}
                    className="text-accent"
                  />
                  hello@wanderlust.com
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

     {/* BOOKING */}
{selectedTour && (
  <BookingModal
    tour={selectedTour}
    onClose={() => setSelectedTour(null)}
    onBooked={handleBookingCreated}
  />
)}

{/* BOOKING SUCCESS */}
{completedBooking && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <button
      type="button"
      aria-label="Close booking confirmation"
      onClick={closeBookingSuccess}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
    />

    <section className="relative z-10 w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-2xl">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <span className="text-3xl text-primary">
          ✓
        </span>
      </div>

      <p className="mb-2 text-sm font-bold uppercase tracking-widest text-accent">
        Booking Received
      </p>

      <h2
        className="mb-3 text-3xl font-bold text-foreground"
        style={{
          fontFamily:
            "'Playfair Display', serif",
        }}
      >
        Your Journey Is Reserved
      </h2>

      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        Your booking has been created successfully
        and is currently awaiting confirmation.
      </p>

      <div className="mb-6 space-y-3 rounded-xl bg-muted p-5 text-left">
        <div className="flex justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            Travellers
          </span>

          <strong>
            {completedBooking.travellers}
          </strong>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            Travel date
          </span>

          <strong>
            {new Date(
              completedBooking.travelDate,
            ).toLocaleDateString()}
          </strong>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            Total
          </span>

          <strong className="text-primary">
            $
            {completedBooking.totalPrice.toLocaleString()}
          </strong>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            Status
          </span>

          <strong className="capitalize">
            {completedBooking.status}
          </strong>
        </div>
      </div>

      <button
        type="button"
        onClick={closeBookingSuccess}
        className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Continue Exploring
      </button>
    </section>
  </div>
)}

      {/* FOOTER */}
      <footer className="mt-auto bg-foreground text-background/80">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                  <Plane
                    size={16}
                    className="text-white"
                  />
                </div>

                <span
                  className="text-xl font-bold text-background"
                  style={{
                    fontFamily:
                      "'Playfair Display', serif",
                  }}
                >
                  Wanderlust
                </span>
              </div>

              <p className="mb-4 text-sm leading-relaxed">
                Crafted journeys for curious
                souls.
              </p>

              <div className="flex gap-3">
                {[
                  Instagram,
                  Facebook,
                  Twitter,
                ].map((Icon, index) => (
                  <button
                    key={index}
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 transition-colors hover:bg-background/20"
                  >
                    <Icon
                      size={15}
                      className="text-background"
                    />
                  </button>
                ))}
              </div>
            </div>

            {[
              {
                title: "Destinations",
                links: [
                  "Europe",
                  "Southeast Asia",
                  "Americas",
                  "Middle East",
                  "Africa",
                ],
              },
              {
                title: "Company",
                links: [
                  "About Us",
                  "How It Works",
                  "Sustainability",
                  "Press",
                  "Careers",
                ],
              },
              {
                title: "Support",
                links: [
                  "Help Center",
                  "Booking FAQs",
                  "Travel Insurance",
                  "Cancellation Policy",
                  "Contact Us",
                ],
              },
            ].map((column) => (
              <div key={column.title}>
                <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-background">
                  {column.title}
                </h4>

                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <button
                        type="button"
                        className="text-sm transition-colors hover:text-background"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-6 text-xs text-background/50 md:flex-row">
            <p>
              © 2026 Wanderlust Travel Co. All
              rights reserved.
            </p>

            <div className="flex gap-6">
              <button type="button">
                Privacy Policy
              </button>

              <button type="button">
                Terms of Service
              </button>

              <button type="button">
                Cookie Settings
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}