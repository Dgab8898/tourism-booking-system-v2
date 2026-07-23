import { useState } from "react";

import { Navbar, type Page } from "../components/layout/Navbar";
import { Hero } from "../components/home/Hero";
import { FeaturedDestinations } from "../components/home/FeaturedDestinations";
import { DESTINATIONS, PACKAGES, TESTIMONIALS } from "../data";
import { WhyChooseUs } from "../components/home/WhyChooseUs";
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Search,
  ChevronRight,
  X,
  Clock,
  Plane,
  Shield,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
  Heart,
  Check,
} from "lucide-react";

interface BookingModalProps {
  pkg: typeof PACKAGES[0] | null;
  onClose: () => void;
}

function BookingModal({ pkg, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    travelers: "2",
    requests: "",
  });
  const [submitted, setSubmitted] = useState(false);

  if (!pkg) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header */}
        <div className="relative h-40 bg-primary overflow-hidden">
          <img
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex items-end p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1">{pkg.category} Package</p>
              <h2 className="text-white text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                {pkg.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {!submitted ? (
          <div className="p-6">
            {/* Step indicators */}
            <div className="flex items-center gap-3 mb-6">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s ? <Check size={14} /> : s}
                  </div>
                  <span className={`text-sm ${step >= s ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {s === 1 ? "Travel Details" : "Your Info"}
                  </span>
                  {s < 2 && <ChevronRight size={14} className="text-muted-foreground" />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1">Check-in Date</label>
                      <input
                        type="date"
                        required
                        value={form.checkIn}
                        onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1">Check-out Date</label>
                      <input
                        type="date"
                        required
                        value={form.checkOut}
                        onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">Number of Travelers</label>
                    <select
                      value={form.travelers}
                      onChange={(e) => setForm({ ...form, travelers: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={String(n)}>
                          {n} {n === 1 ? "Traveler" : "Travelers"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">Special Requests</label>
                    <textarea
                      value={form.requests}
                      onChange={(e) => setForm({ ...form, requests: e.target.value })}
                      placeholder="Dietary requirements, accessibility needs, anniversaries..."
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>
                  {/* Price summary */}
                  <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total (est.)</p>
                      <p className="text-2xl font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
                        ${(pkg.price * parseInt(form.travelers)).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{form.travelers} × ${pkg.price.toLocaleString()}</p>
                      <p className="line-through">${pkg.originalPrice.toLocaleString()} per person</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        placeholder="Elena"
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        placeholder="Rossi"
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="elena@example.com"
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 555 000 0000"
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 border border-border text-foreground rounded-xl font-semibold hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-accent text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Booking Confirmed!
            </h3>
            <p className="text-muted-foreground mb-1">
              Thank you, {form.firstName}. Your inquiry for <strong>{pkg.title}</strong> has been received.
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              A confirmation has been sent to <strong>{form.email}</strong>. Our team will reach out within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchTravelers, setSearchTravelers] = useState("2");
  const [selectedPkg, setSelectedPkg] = useState<typeof PACKAGES[0] | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Luxury", "Wellness", "Cultural"];

  const filteredPackages =
    activeCategory === "All"
      ? PACKAGES
      : PACKAGES.filter((p) => p.category === activeCategory);

  const toggleWishlist = (id: number) =>
    setWishlist((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <Navbar
        currentPage={page}
        onNavigate={setPage}
      />

      {/* ───────────── HOME ───────────── */}
      {page === "home" && (
        <>
          <Hero
            searchQuery={searchQuery}
            searchDate={searchDate}
            searchTravelers={searchTravelers}
            onSearchQueryChange={setSearchQuery}
            onSearchDateChange={setSearchDate}
            onSearchTravelersChange={setSearchTravelers}
            onSearch={() => setPage("destinations")}
          />

          {/* Stats bar */}
          <section className="bg-primary text-primary-foreground py-6">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "60+", label: "Destinations" },
                { value: "12,400+", label: "Happy Travelers" },
                { value: "98%", label: "Satisfaction Rate" },
                { value: "15 yrs", label: "of Experience" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {s.value}
                  </p>
                  <p className="text-primary-foreground/70 text-sm mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Destinations */}
          <FeaturedDestinations
            destinations={DESTINATIONS}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onViewDestination={() => setPage("packages")}
            onViewAll={() => setPage("destinations")}
          />

          {/* Why Us */}
          <WhyChooseUs />

          {/* Testimonials */}
          <section className="py-20 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-bold uppercase tracking-widest mb-2">Stories from the Road</p>
              <h2 className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                What Travelers Say
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="bg-card rounded-2xl p-7 border border-border shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-muted-foreground text-xs">{t.location} · {t.trip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Banner */}
          <section className="relative py-24 bg-primary overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
            />
            <div className="relative max-w-3xl mx-auto text-center px-6">
              <h2
                className="text-primary-foreground text-4xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Ready to Start Your Journey?
              </h2>
              <p className="text-primary-foreground/70 text-lg mb-8">
                Talk to one of our travel experts and get a personalized itinerary within 48 hours — no obligation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setPage("packages")}
                  className="px-8 py-4 bg-accent text-white rounded-xl font-bold text-base hover:opacity-90 transition-opacity"
                >
                  Browse Packages
                </button>
                <button
                  onClick={() => setPage("about")}
                  className="px-8 py-4 border-2 border-primary-foreground/30 text-primary-foreground rounded-xl font-bold text-base hover:border-primary-foreground/60 transition-colors"
                >
                  Contact an Expert
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ───────────── DESTINATIONS PAGE ───────────── */}
      {page === "destinations" && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-10">
            <p className="text-accent text-sm font-bold uppercase tracking-widest mb-2">Explore</p>
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              All Destinations
            </h1>
            <p className="text-muted-foreground max-w-xl">
              From white-washed Cycladic villages to ancient Japanese temples — find the journey that speaks to you.
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 bg-card rounded-xl border border-border px-4 py-3 mb-10 max-w-lg">
            <Search size={18} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {DESTINATIONS.filter(
              (d) =>
                d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.country.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((dest) => (
              <div
                key={dest.id}
                className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setPage("packages")}
              >
                <div className="relative h-52 bg-stone-200 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={`${dest.name}, ${dest.country}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(dest.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow"
                  >
                    <Heart
                      size={14}
                      className={wishlist.includes(dest.id) ? "fill-red-400 text-red-400" : "text-muted-foreground"}
                    />
                  </button>
                  <span className="absolute bottom-3 left-3 px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">
                    {dest.tag}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {dest.name}
                      </h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin size={12} /> {dest.country}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold">{dest.rating}</span>
                      <span className="text-muted-foreground text-xs">({dest.reviews})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <span className="text-xs text-muted-foreground">From</span>
                      <p className="font-bold text-primary text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                        ${dest.startingFrom.toLocaleString()}
                      </p>
                    </div>
                    <button className="flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all">
                      View Packages <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────── PACKAGES PAGE ───────────── */}
      {page === "packages" && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-10">
            <p className="text-accent text-sm font-bold uppercase tracking-widest mb-2">Curated for You</p>
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Travel Packages
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Everything arranged, nothing left to chance. Our packages include accommodation, transfers, and expert-led experiences.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-3 mb-10 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow"
              >
                <div className="relative md:w-80 shrink-0 bg-stone-200 h-56 md:h-auto overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">
                    {pkg.category}
                  </span>
                </div>

                <div className="flex-1 p-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-2xl font-bold mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {pkg.title}
                        </h3>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <MapPin size={13} /> {pkg.destination}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground line-through">${pkg.originalPrice.toLocaleString()}</p>
                        <p className="text-3xl font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
                          ${pkg.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">per person</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed my-4">{pkg.highlights}</p>

                    <div className="flex items-center gap-4 text-sm mb-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock size={14} className="text-accent" /> {pkg.duration}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users size={14} className="text-accent" /> {pkg.groupSize} people
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{pkg.rating}</span>
                        <span className="text-muted-foreground">({pkg.reviews} reviews)</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {pkg.includes.map((item) => (
                        <span key={item} className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-xs text-foreground font-medium">
                          <Check size={11} className="text-primary" /> {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
                    <button
                      onClick={() => setSelectedPkg(pkg)}
                      className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity"
                    >
                      Book This Package
                    </button>
                    <button className="py-3 px-5 border border-border rounded-xl font-semibold text-foreground hover:bg-muted transition-colors text-sm">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────── ABOUT PAGE ───────────── */}
      {page === "about" && (
        <div>
          {/* Hero */}
          <div className="relative h-72 bg-stone-800 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1656013082096-2ba1c0c0bc10?w=1600&h=600&fit=crop&auto=format"
              alt="Rocky coastline"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div>
                <p className="text-accent text-sm font-bold uppercase tracking-widest mb-3">Our Story</p>
                <h1 className="text-white text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  About Wanderlust
                </h1>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                We Believe Travel Changes People
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded in 2009, Wanderlust has been connecting curious travelers with extraordinary destinations for over 15 years. We started as a small boutique agency in Edinburgh, and today operate across 60+ countries with a team of 120 dedicated travel experts.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Every itinerary is handcrafted — we believe in deep local connections, responsible tourism, and creating experiences that travelers carry with them for the rest of their lives.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "60+", label: "Countries covered" },
                  { value: "12,400+", label: "Trips completed" },
                  { value: "120", label: "Expert team members" },
                  { value: "98%", label: "Would book again" },
                ].map((s) => (
                  <div key={s.label} className="bg-muted rounded-xl p-4">
                    <p className="text-2xl font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {s.value}
                    </p>
                    <p className="text-muted-foreground text-sm">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Talk to a Travel Expert
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First name"
                    className="px-4 py-3 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    className="px-4 py-3 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="text"
                  placeholder="Dream destination or 'Surprise me!'"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <textarea
                  placeholder="Tell us about the trip you have in mind..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
                <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity">
                  Send Message
                </button>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-accent" /> +1 800 555 0190
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-accent" /> hello@wanderlust.com
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────── FOOTER ───────────── */}
      <footer className="bg-foreground text-background/80 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Plane size={16} className="text-white" />
                </div>
                <span className="text-background font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Wanderlust
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                Crafted journeys for curious souls. Boutique travel experiences since 2009.
              </p>
              <div className="flex gap-3">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <button key={i} className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                    <Icon size={15} className="text-background" />
                  </button>
                ))}
              </div>
            </div>

            {[
              {
                title: "Destinations",
                links: ["Europe", "Southeast Asia", "Americas", "Middle East", "Africa"],
              },
              {
                title: "Company",
                links: ["About Us", "How It Works", "Sustainability", "Press", "Careers"],
              },
              {
                title: "Support",
                links: ["Help Center", "Booking FAQs", "Travel Insurance", "Cancellation Policy", "Contact Us"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-background font-bold mb-4 text-sm uppercase tracking-widest">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <button className="text-sm hover:text-background transition-colors">{link}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-background/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/50">
            <p>© 2026 Wanderlust Travel Co. All rights reserved.</p>
            <div className="flex gap-6">
              <button className="hover:text-background/80 transition-colors">Privacy Policy</button>
              <button className="hover:text-background/80 transition-colors">Terms of Service</button>
              <button className="hover:text-background/80 transition-colors">Cookie Settings</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {selectedPkg && (
        <BookingModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
      )}
    </div>
  );
}
