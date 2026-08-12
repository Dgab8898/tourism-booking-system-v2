import {
  BookOpen,
  LogOut,
  Plane,
  ShieldCheck,
  User,
} from "lucide-react";

export type Page =
  | "home"
  | "destinations"
  | "packages"
  | "bookings"
  | "admin-bookings"
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
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2"
          aria-label="Go to Wanderlust home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <Plane size={18} className="text-white" />
          </span>

          <span
            className="text-xl font-bold tracking-tight text-foreground"
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Wanderlust
          </span>
        </button>

        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label="Primary navigation"
        >
          {PUBLIC_NAVIGATION_ITEMS.map(
            ({ label, page }) => {
              const isActive =
                currentPage === page;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => onNavigate(page)}
                  aria-current={
                    isActive ? "page" : undefined
                  }
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              );
            },
          )}

          {user && (
            <button
              type="button"
              onClick={() =>
                onNavigate("bookings")
              }
              aria-current={
                currentPage === "bookings"
                  ? "page"
                  : undefined
              }
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                currentPage === "bookings"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen size={15} />
              My Bookings
            </button>
          )}

          {user?.role === "admin" && (
            <button
              type="button"
              onClick={() =>
                onNavigate("admin-bookings")
              }
              aria-current={
                currentPage === "admin-bookings"
                  ? "page"
                  : undefined
              }
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                currentPage === "admin-bookings"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck size={15} />
              Admin Bookings
            </button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden items-center gap-2 md:flex">
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
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">
                  Logout
                </span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() =>
                onNavigate("login")
              }
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Sign In
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              onNavigate("packages")
            }
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Book Now
          </button>
        </div>
      </div>
    </header>
  );
}