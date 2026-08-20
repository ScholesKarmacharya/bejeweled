"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =====================================================
     LOGIN
  ====================================================== */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (
      !email.trim() ||
      !password
    ) {
      setError(
        "Please enter your email and password."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/admin/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email:
                email
                  .trim()
                  .toLowerCase(),

              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to log in."
        );
      }

      /* ===============================================
         SUCCESS
         ALWAYS GO TO DASHBOARD
      =============================================== */

      router.replace("/admin");

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to log in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f0e4] px-4 py-12">

      <div className="w-full max-w-md">

        {/* =================================================
            BRAND
        ================================================= */}

        <div className="text-center">

          <Link
            href="/"
            className="inline-flex items-center justify-center"
          >
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[#b9975b]/25 bg-white shadow-sm">

              <img
                src="/logo.jpeg"
                alt="Bejeweled"
                className="h-24 w-24 max-w-none object-cover"
              />

            </div>
          </Link>

          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#9a7a45]">
            Administration
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#211d18]">
            Welcome Back
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#746a5d]">
            Sign in to manage Bejeweled orders,
            products, fulfilment, and customer
            messages.
          </p>

        </div>

        {/* =================================================
            LOGIN CARD
        ================================================= */}

        <div className="mt-9 rounded-3xl border border-[#c9b07a]/25 bg-[#fffaf2] p-6 shadow-[0_18px_45px_rgba(74,52,20,0.08)] sm:p-8">

          <form
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div>

              <label
                htmlFor="email"
                className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#786b5b]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(
                    event.target.value
                  );

                  if (error) {
                    setError("");
                  }
                }}
                autoComplete="username"
                placeholder="admin@example.com"
                className="mt-2 w-full rounded-xl border border-[#d8c8a8] bg-white px-4 py-3.5 text-sm text-[#211d18] outline-none transition placeholder:text-gray-300 focus:border-[#9a7a45] focus:ring-2 focus:ring-[#9a7a45]/10"
              />

            </div>

            {/* PASSWORD */}

            <div className="mt-6">

              <label
                htmlFor="password"
                className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#786b5b]"
              >
                Password
              </label>

              <div className="relative mt-2">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) => {
                    setPassword(
                      event.target.value
                    );

                    if (error) {
                      setError("");
                    }
                  }}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#d8c8a8] bg-white px-4 py-3.5 pr-16 text-sm text-[#211d18] outline-none transition placeholder:text-gray-300 focus:border-[#9a7a45] focus:ring-2 focus:ring-[#9a7a45]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#8f826f] transition hover:text-[#9a7a45]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            {/* ERROR */}

            {error && (

              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                <div className="flex items-start gap-3">

                  <div className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                    !
                  </div>

                  <p className="text-sm leading-5 text-red-600">
                    {error}
                  </p>

                </div>

              </div>

            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center rounded-xl bg-[#211d18] py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#9a7a45] disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-gray-400"
            >
              {loading ? (

                <div className="flex items-center gap-3">

                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  <span>
                    Signing in...
                  </span>

                </div>

              ) : (

                "Sign In"

              )}
            </button>

          </form>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="mt-7 text-center">

          <p className="text-xs text-[#8c8174]">
            Authorized Bejeweled personnel only.
          </p>

          <Link
            href="/"
            className="mt-4 inline-block text-xs font-medium text-[#786a57] transition hover:text-[#9a7a45]"
          >
            ← Back to Store
          </Link>

        </div>

      </div>

    </main>
  );
}