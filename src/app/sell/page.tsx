"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    storeName: "",
    businessName: "",
    phone: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/seller/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to submit seller application."
        );
        return;
      }

      setSuccess(
        "Your seller application has been submitted successfully."
      );

      setForm({
        storeName: "",
        businessName: "",
        phone: "",
        description: "",
      });

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-extrabold text-orange-500"
          >
            MARKETPLACE
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-orange-500"
          >
            Back to Marketplace
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
            Sell on Marketplace
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Start selling your products
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Create your seller application and reach customers
            across the marketplace.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Store Name
              </label>

              <input
                name="storeName"
                value={form.storeName}
                onChange={handleChange}
                placeholder="Example: Tech World Store"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                This is the name customers will see on your
                marketplace store.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Business Name
              </label>

              <input
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="Optional registered business name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Phone Number
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="08012345678"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Store Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                placeholder="Tell customers about the products you intend to sell..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
              <h2 className="font-semibold text-gray-900">
                What happens next?
              </h2>

              <ol className="mt-3 space-y-2 text-sm text-gray-600">
                <li>
                  1. Submit your seller application.
                </li>

                <li>
                  2. Our marketplace administrator reviews it.
                </li>

                <li>
                  3. Once approved, your seller account becomes
                  active.
                </li>

                <li>
                  4. You can then create products and manage
                  your store.
                </li>
              </ol>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Submitting..."
                  : "Submit Seller Application"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}