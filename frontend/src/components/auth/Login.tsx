import { useState } from "react";
import { LockKeyhole, LogIn, Mail } from "lucide-react";

import {
  login,
  type LoginResponse,
} from "../../services/auth.service";

interface LoginProps {
  onLogin: (response: LoginResponse) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await login(
        email.trim(),
        password,
      );

      localStorage.setItem(
        "token",
        response.data.token,
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user),
      );

      onLogin(response);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <section className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <LogIn
                size={22}
                className="text-primary"
              />
            </div>

            <h1
              className="text-3xl font-bold text-foreground"
              style={{
                fontFamily:
                  "'Playfair Display', serif",
              }}
            >
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage your Wanderlust
              bookings.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-input-background py-3 pl-10 pr-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-border bg-input-background py-3 pl-10 pr-4 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogIn size={16} />

              {isSubmitting
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Your credentials are sent securely to the
            Wanderlust API for authentication.
          </p>
        </div>
      </section>
    </main>
  );
}