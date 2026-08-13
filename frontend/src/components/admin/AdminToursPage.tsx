import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  createTour,
  deleteTour,
  getTours,
  updateTour,
  type CreateTourInput,
  type Tour,
  type TourDifficulty,
} from "../../services/tour.service";

type TourFormState = {
  title: string;
  description: string;
  destination: string;
  duration: string;
  price: string;
  maxGroupSize: string;
  difficulty: TourDifficulty;
  image: string;
  availableDates: string;
  includedServices: string;
  excludedServices: string;
  isActive: boolean;
};

const EMPTY_FORM: TourFormState = {
  title: "",
  description: "",
  destination: "",
  duration: "1",
  price: "",
  maxGroupSize: "1",
  difficulty: "easy",
  image: "",
  availableDates: "",
  includedServices: "",
  excludedServices: "",
  isActive: true,
};

function toArray(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formToInput(
  form: TourFormState,
): CreateTourInput {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    destination: form.destination.trim(),
    duration: Number(form.duration),
    price: Number(form.price),
    maxGroupSize: Number(form.maxGroupSize),
    difficulty: form.difficulty,
    images: form.image.trim()
      ? [form.image.trim()]
      : [],
    availableDates: toArray(
      form.availableDates,
    ),
    includedServices: toArray(
      form.includedServices,
    ),
    excludedServices: toArray(
      form.excludedServices,
    ),
    isActive: form.isActive,
  };
}

function tourToForm(
  tour: Tour,
): TourFormState {
  return {
    title: tour.title,
    description: tour.description,
    destination: tour.destination,
    duration: String(tour.duration),
    price: String(tour.price),
    maxGroupSize: String(
      tour.maxGroupSize,
    ),
    difficulty: tour.difficulty,
    image: tour.images[0] ?? "",
    availableDates:
      tour.availableDates.join(", "),
    includedServices:
      tour.includedServices.join(", "),
    excludedServices:
      tour.excludedServices.join(", "),
    isActive: tour.isActive,
  };
}

export function AdminToursPage() {
  const [tours, setTours] = useState<
    Tour[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState<TourFormState>(EMPTY_FORM);

  const [editingTour, setEditingTour] =
    useState<Tour | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [
    deletingTourId,
    setDeletingTourId,
  ] = useState<string | null>(null);

  const formTitle = useMemo(
    () =>
      editingTour
        ? "Edit Tour"
        : "Create Tour",
    [editingTour],
  );

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

  useEffect(() => {
    void loadTours();
  }, []);

  function resetForm(): void {
    setEditingTour(null);
    setForm(EMPTY_FORM);
  }

  function startEditing(
    tour: Tour,
  ): void {
    setEditingTour(tour);
    setForm(tourToForm(tour));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const input = formToInput(form);

      if (editingTour) {
        const response =
          await updateTour(
            editingTour._id,
            input,
          );

        setTours((current) =>
          current.map((tour) =>
            tour._id === editingTour._id
              ? response.data.tour
              : tour,
          ),
        );
      } else {
        const response =
          await createTour(input);

        setTours((current) => [
          response.data.tour,
          ...current,
        ]);
      }

      resetForm();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save tour",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    tourId: string,
  ): Promise<void> {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this tour?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTourId(tourId);
      setError("");

      await deleteTour(tourId);

      setTours((current) =>
        current.filter(
          (tour) =>
            tour._id !== tourId,
        ),
      );

      if (
        editingTour?._id === tourId
      ) {
        resetForm();
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete tour",
      );
    } finally {
      setDeletingTourId(null);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-accent">
          Administration
        </p>

        <h1
          className="mb-4 text-5xl font-bold"
          style={{
            fontFamily:
              "'Playfair Display', serif",
          }}
        >
          Tour Management
        </h1>

        <p className="max-w-xl text-muted-foreground">
          Create, review, edit and delete
          Wanderlust tours.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700"
        >
          {error}
        </div>
      )}

      <section className="mb-12 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-accent">
              {editingTour
                ? "Update Existing Tour"
                : "New Tour"}
            </p>

            <h2
              className="mt-1 text-2xl font-bold"
              style={{
                fontFamily:
                  "'Playfair Display', serif",
              }}
            >
              {formTitle}
            </h2>
          </div>

          {editingTour && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
            >
              <X size={15} />
              Cancel Edit
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <input
              type="text"
              required
              placeholder="Tour title"
              value={form.title}
              onChange={(event) =>
                setForm({
                  ...form,
                  title:
                    event.target.value,
                })
              }
              className="rounded-xl border border-border bg-input-background px-4 py-3"
            />

            <input
              type="text"
              required
              placeholder="Destination"
              value={form.destination}
              onChange={(event) =>
                setForm({
                  ...form,
                  destination:
                    event.target.value,
                })
              }
              className="rounded-xl border border-border bg-input-background px-4 py-3"
            />
          </div>

          <textarea
            required
            rows={4}
            placeholder="Tour description"
            value={form.description}
            onChange={(event) =>
              setForm({
                ...form,
                description:
                  event.target.value,
              })
            }
            className="rounded-xl border border-border bg-input-background px-4 py-3"
          />

          <div className="grid gap-5 md:grid-cols-4">
            <input
              type="number"
              min="1"
              required
              placeholder="Duration"
              value={form.duration}
              onChange={(event) =>
                setForm({
                  ...form,
                  duration:
                    event.target.value,
                })
              }
              className="rounded-xl border border-border bg-input-background px-4 py-3"
            />

            <input
              type="number"
              min="0"
              required
              placeholder="Price"
              value={form.price}
              onChange={(event) =>
                setForm({
                  ...form,
                  price:
                    event.target.value,
                })
              }
              className="rounded-xl border border-border bg-input-background px-4 py-3"
            />

            <input
              type="number"
              min="1"
              required
              placeholder="Max group size"
              value={form.maxGroupSize}
              onChange={(event) =>
                setForm({
                  ...form,
                  maxGroupSize:
                    event.target.value,
                })
              }
              className="rounded-xl border border-border bg-input-background px-4 py-3"
            />

            <select
              value={form.difficulty}
              onChange={(event) =>
                setForm({
                  ...form,
                  difficulty:
                    event.target
                      .value as TourDifficulty,
                })
              }
              className="rounded-xl border border-border bg-input-background px-4 py-3"
            >
              <option value="easy">
                Easy
              </option>
              <option value="moderate">
                Moderate
              </option>
              <option value="difficult">
                Difficult
              </option>
            </select>
          </div>

          <input
            type="url"
            placeholder="Image URL"
            value={form.image}
            onChange={(event) =>
              setForm({
                ...form,
                image:
                  event.target.value,
              })
            }
            className="rounded-xl border border-border bg-input-background px-4 py-3"
          />

          <input
            type="text"
            placeholder="Available dates, comma separated"
            value={form.availableDates}
            onChange={(event) =>
              setForm({
                ...form,
                availableDates:
                  event.target.value,
              })
            }
            className="rounded-xl border border-border bg-input-background px-4 py-3"
          />

          <input
            type="text"
            placeholder="Included services, comma separated"
            value={form.includedServices}
            onChange={(event) =>
              setForm({
                ...form,
                includedServices:
                  event.target.value,
              })
            }
            className="rounded-xl border border-border bg-input-background px-4 py-3"
          />

          <input
            type="text"
            placeholder="Excluded services, comma separated"
            value={form.excludedServices}
            onChange={(event) =>
              setForm({
                ...form,
                excludedServices:
                  event.target.value,
              })
            }
            className="rounded-xl border border-border bg-input-background px-4 py-3"
          />

          <label className="flex items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm({
                  ...form,
                  isActive:
                    event.target.checked,
                })
              }
            />

            Tour is active
          </label>

          <button
            type="submit"
            disabled={saving}
            className="flex w-fit items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground disabled:opacity-50"
          >
            {saving ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : editingTour ? (
              <CheckCircle2 size={16} />
            ) : (
              <Plus size={16} />
            )}

            {saving
              ? "Saving..."
              : editingTour
                ? "Save Changes"
                : "Create Tour"}
          </button>
        </form>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2
            className="text-3xl font-bold"
            style={{
              fontFamily:
                "'Playfair Display', serif",
            }}
          >
            Existing Tours
          </h2>

          <span className="text-sm text-muted-foreground">
            {tours.length} tours
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-10 text-muted-foreground">
            <Loader2
              size={18}
              className="animate-spin"
            />
            Loading tours...
          </div>
        ) : (
          <div className="grid gap-6">
            {tours.map((tour) => (
              <article
                key={tour._id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:flex-row"
              >
                <div className="h-48 bg-stone-200 md:h-auto md:w-72">
                  <img
                    src={
                      tour.images[0] ||
                      "https://placehold.co/800x500"
                    }
                    alt={tour.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-7">
                  <div>
                    <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row">
                      <div>
                        <h3
                          className="text-2xl font-bold"
                          style={{
                            fontFamily:
                              "'Playfair Display', serif",
                          }}
                        >
                          {tour.title}
                        </h3>

                        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin size={13} />
                          {tour.destination}
                        </div>
                      </div>

                      <span
                        className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-bold ${
                          tour.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {tour.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      {tour.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <span>
                        <strong>
                          ${tour.price}
                        </strong>{" "}
                        per person
                      </span>

                      <span>
                        {tour.duration} day
                        {tour.duration === 1
                          ? ""
                          : "s"}
                      </span>

                      <span className="capitalize">
                        {tour.difficulty}
                      </span>

                      <span>
                        Up to{" "}
                        {tour.maxGroupSize}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
                    <button
                      type="button"
                      onClick={() =>
                        startEditing(tour)
                      }
                      className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted"
                    >
                      <Edit3 size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={
                        deletingTourId ===
                        tour._id
                      }
                      onClick={() =>
                        void handleDelete(
                          tour._id,
                        )
                      }
                      className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingTourId ===
                      tour._id ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={15} />
                      )}

                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}