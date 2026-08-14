import { useState } from "react";
import {
  BookOpen,
  LogOut,
  Menu,
  Plane,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

export type Page =
  | "home"
  | "destinations"
  | "packages"
  | "bookings"
  | "admin-bookings"
  | "admin-tours"
  | "about"
  | "login";

export interface NavbarUser {
  firstName: string;
  lastName: string;
  email: string;
  role: "customer" | "admin";
}

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: NavbarUser | null;
  onLogout: () => void;
}

const PUBLIC_NAVIGATION_ITEMS: Array<{
  label: string;
  page: Page;
}> = [
  { label: "Home", page: "home" },
  { label: "Destinations", page: "destinations" },
  { label: "Packages", page: "packages" },
  { label: "About", page: "about" },
];

export function Navbar({
  currentPage,
  onNavigate,
  user,
  onLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  function navigate(page: Page): void {
    onNavigate(page);
    setMobileMenuOpen(false);
  }

  function logout(): void {
    onLogout();
    setMobileMenuOpen(false);
  }

  function navClass(page: Page): string {
    return `text-sm font-semibold transition-colors ${
      currentPage === page
        ? "text-primary"
        : "text-muted-foreground hover:text-foreground"
    }`;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => navigate("home")}
          className="flex items-center gap-2"
          aria-label="Go to Wanderlust home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <Plane
              size={18}
              className="text-white"
            />
          </span>

          <span
            className="text-xl font-bold tracking-tight text-foreground"
            style={{
              fontFamily:
                "'Playfair Display', serif",
            }}
          >
            Wanderlust
          </span>
        </button>

        <nav
          className="hidden items-center gap-6 lg:flex"
          aria-label="Primary navigation"
        >
          {PUBLIC_NAVIGATION_ITEMS.map(
            ({ label, page }) => (
              <button
                key={page}
                type="button"
                onClick={() =>
                  navigate(page)
                }
                aria-current={
                  currentPage === page
                    ? "page"
                    : undefined
                }
                className={navClass(page)}
              >
                {label}
              </button>
            ),
          )}

          {user && (
            <button
              type="button"
              onClick={() =>
                navigate("bookings")
              }
              aria-current={
                currentPage === "bookings"
                  ? "page"
                  : undefined
              }
              className={`flex items-center gap-1.5 ${navClass(
                "bookings",
              )}`}
            >
              <BookOpen size={15} />
              My Bookings
            </button>
          )}

          {user?.role === "admin" && (
            <>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "admin-bookings",
                  )
                }
                aria-current={
                  currentPage ===
                  "admin-bookings"
                    ? "page"
                    : undefined
                }
                className={`flex items-center gap-1.5 ${navClass(
                  "admin-bookings",
                )}`}
              >
                <ShieldCheck size={15} />
                Admin Bookings
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("admin-tours")
                }
                aria-current={
                  currentPage ===
                  "admin-tours"
                    ? "page"
                    : undefined
                }
                className={`flex items-center gap-1.5 ${navClass(
                  "admin-tours",
                )}`}
              >
                <Plane size={15} />
                Admin Tours
              </button>
            </>
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <User
                    size={15}
                    className="text-primary"
                  />
                </span>

                <div className="text-left leading-tight">
                  <p className="text-sm font-semibold text-foreground">
                    {user.firstName}
                  </p>

                  <p className="text-xs capitalize text-muted-foreground">
                    {user.role}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() =>
                navigate("login")
              }
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Sign In
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              navigate("packages")
            }
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Book Now
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (open) => !open,
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted lg:hidden"
          aria-label={
            mobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={
            mobileMenuOpen
          }
        >
          {mobileMenuOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-card lg:hidden">
          <nav
            className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6"
            aria-label="Mobile navigation"
          >
            {PUBLIC_NAVIGATION_ITEMS.map(
              ({ label, page }) => (
                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    navigate(page)
                  }
                  className={`rounded-lg px-3 py-3 text-left ${navClass(
                    page,
                  )}`}
                >
                  {label}
                </button>
              ),
            )}

            {user && (
              <button
                type="button"
                onClick={() =>
                  navigate("bookings")
                }
                className={`flex items-center gap-2 rounded-lg px-3 py-3 text-left ${navClass(
                  "bookings",
                )}`}
              >
                <BookOpen size={16} />
                My Bookings
              </button>
            )}

            {user?.role === "admin" && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "admin-bookings",
                    )
                  }
                  className={`flex items-center gap-2 rounded-lg px-3 py-3 text-left ${navClass(
                    "admin-bookings",
                  )}`}
                >
                  <ShieldCheck size={16} />
                  Admin Bookings
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "admin-tours",
                    )
                  }
                  className={`flex items-center gap-2 rounded-lg px-3 py-3 text-left ${navClass(
                    "admin-tours",
                  )}`}
                >
                  <Plane size={16} />
                  Admin Tours
                </button>
              </>
            )}

            <div className="mt-3 border-t border-border pt-3">
              {user ? (
                <>
                  <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted px-3 py-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background">
                      <User
                        size={16}
                        className="text-primary"
                      />
                    </span>

                    <div>
                      <p className="text-sm font-semibold">
                        {user.firstName}{" "}
                        {user.lastName}
                      </p>

                      <p className="text-xs capitalize text-muted-foreground">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    navigate("login")
                  }
                  className="w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Sign In
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  navigate("packages")
                }
                className="mt-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Book Now
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}