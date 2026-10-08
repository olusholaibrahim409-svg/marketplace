"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to login.");
        return;
      }

      setSuccess("Login successful! Welcome back.");

      const redirectTo = data.redirectTo || "/";

      setTimeout(() => {
        router.push(redirectTo);
      }, 500);
    } catch {
      setError(
        "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-orange-500 px-6 py-5 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-wide"
          >
            MARKETPLACE
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-orange-500 transition hover:bg-gray-100"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Login */}
      <section className="flex min-h-[calc(100vh-76px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Login to your Marketplace account.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm font-medium text-orange-500 hover:text-orange-600"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-500 hover:text-orange-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-orange-500 px-5 py-3.5 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Register */}
            <div className="mt-7 border-t border-gray-200 pt-6 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-orange-500 hover:text-orange-600"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}