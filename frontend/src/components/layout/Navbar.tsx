import { Plane } from "lucide-react";

export type Page =
  | "home"
  | "destinations"
  | "packages"
  | "about";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAVIGATION_ITEMS: Page[] = [
  "home",
  "destinations",
  "packages",
  "about",
];

export function Navbar({
  currentPage,
  onNavigate,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="group flex items-center gap-2"
          aria-label="Go to the Wanderlust home page"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Plane
              size={16}
              className="text-primary-foreground"
              aria-hidden="true"
            />
          </span>

          <span
            className="text-xl font-bold tracking-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Wanderlust
          </span>
        </button>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary navigation"
        >
          {NAVIGATION_ITEMS.map((page) => {
            const isActive = currentPage === page;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onNavigate(page)}
                aria-current={isActive ? "page" : undefined}
                className={`text-sm font-semibold capitalize transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {page}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground md:block"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => onNavigate("packages")}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Book Now
          </button>
        </div>
      </div>
    </header>
  );
}
