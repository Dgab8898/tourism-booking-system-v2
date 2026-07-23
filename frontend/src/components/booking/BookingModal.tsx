import { type FormEvent, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  X,
} from "lucide-react";

import type { TravelPackage } from "../../types/travel";

interface BookingModalProps {
  pkg: TravelPackage | null;
  onClose: () => void;
}

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  travelers: string;
  requests: string;
}

const INITIAL_FORM: BookingFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  checkIn: "",
  checkOut: "",
  travelers: "2",
  requests: "",
};

export function BookingModal({
  pkg,
  onClose,
}: BookingModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] =
    useState<BookingFormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  if (!pkg) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const updateForm = (
    field: keyof BookingFormData,
    value: string,
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const totalPrice =
    pkg.price * Number.parseInt(form.travelers, 10);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <button
        type="button"
        aria-label="Close booking modal"
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-card shadow-2xl"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        <header className="relative h-40 overflow-hidden bg-primary">
          <img
            src={pkg.image}
            alt={pkg.title}
            className="h-full w-full object-cover opacity-40"
          />

          <div className="absolute inset-0 flex items-end p-6">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
                {pkg.category} Package
              </p>

              <h2
                id="booking-modal-title"
                className="text-2xl font-bold text-white"
                style={{
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {pkg.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking modal"
            className="absolute right-4 top-4 rounded-full bg-white/20 p-1.5 text-white transition-colors hover:bg-white/30"
          >
            <X size={18} />
          </button>
        </header>

        {!submitted ? (
          <div className="p-6">
            <div className="mb-6 flex items-center gap-3">
              {[1, 2].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className="flex items-center gap-2"
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      step >= stepNumber
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > stepNumber ? (
                      <Check size={14} />
                    ) : (
                      stepNumber
                    )}
                  </div>

                  <span
                    className={`text-sm ${
                      step >= stepNumber
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {stepNumber === 1
                      ? "Travel Details"
                      : "Your Info"}
                  </span>

                  {stepNumber < 2 && (
                    <ChevronRight
                      size={14}
                      className="text-muted-foreground"
                    />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="booking-check-in"
                        className="mb-1 block text-sm font-semibold text-foreground"
                      >
                        Check-in Date
                      </label>

                      <input
                        id="booking-check-in"
                        type="date"
                        required
                        value={form.checkIn}
                        onChange={(event) =>
                          updateForm(
                            "checkIn",
                            event.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-border bg-input-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="booking-check-out"
                        className="mb-1 block text-sm font-semibold text-foreground"
                      >
                        Check-out Date
                      </label>

                      <input
                        id="booking-check-out"
                        type="date"
                        required
                        value={form.checkOut}
                        onChange={(event) =>
                          updateForm(
                            "checkOut",
                            event.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-border bg-input-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-travelers"
                      className="mb-1 block text-sm font-semibold text-foreground"
                    >
                      Number of Travelers
                    </label>

                    <select
                      id="booking-travelers"
                      value={form.travelers}
                      onChange={(event) =>
                        updateForm(
                          "travelers",
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border border-border bg-input-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(
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
                  </div>

                  <div>
                    <label
                      htmlFor="booking-requests"
                      className="mb-1 block text-sm font-semibold text-foreground"
                    >
                      Special Requests
                    </label>

                    <textarea
                      id="booking-requests"
                      value={form.requests}
                      onChange={(event) =>
                        updateForm(
                          "requests",
                          event.target.value,
                        )
                      }
                      placeholder="Dietary requirements, accessibility needs, anniversaries..."
                      rows={3}
                      className="w-full resize-none rounded-lg border border-border bg-input-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-muted p-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Total (est.)
                      </p>

                      <p
                        className="text-2xl font-bold text-primary"
                        style={{
                          fontFamily:
                            "'Playfair Display', serif",
                        }}
                      >
                        ${totalPrice.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right text-sm text-muted-foreground">
                      <p>
                        {form.travelers} × $
                        {pkg.price.toLocaleString()}
                      </p>

                      <p className="line-through">
                        $
                        {pkg.originalPrice.toLocaleString()}{" "}
                        per person
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Continue
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="booking-first-name"
                        className="mb-1 block text-sm font-semibold text-foreground"
                      >
                        First Name
                      </label>

                      <input
                        id="booking-first-name"
                        type="text"
                        required
                        value={form.firstName}
                        onChange={(event) =>
                          updateForm(
                            "firstName",
                            event.target.value,
                          )
                        }
                        placeholder="Elena"
                        className="w-full rounded-lg border border-border bg-input-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="booking-last-name"
                        className="mb-1 block text-sm font-semibold text-foreground"
                      >
                        Last Name
                      </label>

                      <input
                        id="booking-last-name"
                        type="text"
                        required
                        value={form.lastName}
                        onChange={(event) =>
                          updateForm(
                            "lastName",
                            event.target.value,
                          )
                        }
                        placeholder="Rossi"
                        className="w-full rounded-lg border border-border bg-input-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-email"
                      className="mb-1 block text-sm font-semibold text-foreground"
                    >
                      Email Address
                    </label>

                    <input
                      id="booking-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(event) =>
                        updateForm(
                          "email",
                          event.target.value,
                        )
                      }
                      placeholder="elena@example.com"
                      className="w-full rounded-lg border border-border bg-input-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="booking-phone"
                      className="mb-1 block text-sm font-semibold text-foreground"
                    >
                      Phone Number
                    </label>

                    <input
                      id="booking-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateForm(
                          "phone",
                          event.target.value,
                        )
                      }
                      placeholder="+1 555 000 0000"
                      className="w-full rounded-lg border border-border bg-input-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-xl border border-border py-3 font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-accent py-3 font-semibold text-white transition-opacity hover:opacity-90"
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Check
                size={32}
                className="text-primary"
              />
            </div>

            <h3
              className="mb-2 text-2xl font-bold text-foreground"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Booking Confirmed!
            </h3>

            <p className="mb-1 text-muted-foreground">
              Thank you, {form.firstName}. Your inquiry
              for <strong>{pkg.title}</strong> has been
              received.
            </p>

            <p className="mb-6 text-sm text-muted-foreground">
              A confirmation has been sent to{" "}
              <strong>{form.email}</strong>. Our team will
              reach out within 24 hours.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
