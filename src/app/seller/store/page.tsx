"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Seller = {
  id: string;
  storeName: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  phone: string | null;
  status: string;
};

export default function SellerStoreSettingsPage() {
  const [seller, setSeller] = useState<Seller | null>(null);

  const [storeName, setStoreName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStore() {
      try {
        const response = await fetch("/api/seller/store", {
          cache: "no-store",
        });

        const data = await response.json();

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load store settings."
          );
        }

        const store = data.seller as Seller;

        setSeller(store);
        setStoreName(store.storeName || "");
        setSlug(store.slug || "");
        setDescription(store.description || "");
        setPhone(store.phone || "");
        setLogoUrl(store.logoUrl || "");
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load store settings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStore();
  }, []);

  async function handleLogoUpload() {
    if (!logoFile) {
      setError("Please select a logo image first.");
      return;
    }

    setUploadingLogo(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", logoFile);

      const response = await fetch("/api/seller/store/logo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to upload store logo."
        );
      }

      setSeller(data.seller);

      setLogoUrl(data.seller.logoUrl || "");
      setLogoFile(null);

      const fileInput = document.getElementById(
        "logoFile"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      setMessage(
        data.message || "Store logo uploaded successfully."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload store logo."
      );
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/seller/store", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeName,
          slug,
          description,
          phone,
          logoUrl,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update store."
        );
      }

      setSeller(data.seller);

      setStoreName(data.seller.storeName || "");
      setSlug(data.seller.slug || "");
      setDescription(data.seller.description || "");
      setPhone(data.seller.phone || "");
      setLogoUrl(data.seller.logoUrl || "");

      setMessage(
        data.message ||
          "Store settings updated successfully."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update store."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#f68b1e]" />

          <p className="text-lg font-semibold text-gray-600">
            Loading store settings...
          </p>
        </div>
      </div>
    );
  }

  if (error && !seller) {
    return (
      <div className="mx-auto max-w-2xl py-16">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl">
            !
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Unable to load store
          </h1>

          <p className="mt-3 text-gray-500">
            {error}
          </p>

          <Link
            href="/seller"
            className="mt-6 inline-flex rounded-xl bg-[#f68b1e] px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Back to Seller Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            Seller Center
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Store Settings
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage how your store appears to customers.
          </p>
        </div>

        <Link
          href={`/seller/${slug}`}
          target="_blank"
          className="inline-flex items-center justify-center rounded-xl bg-[#f68b1e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          🌐 View Store
        </Link>
      </section>

      {/* SUCCESS */}
      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
          ✓ {message}
        </div>
      )}

      {/* ERROR */}
      {error && seller && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="border-b border-gray-100 pb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Store Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the information customers see on your
              storefront.
            </p>
          </div>

          {/* STORE NAME */}
          <div className="mt-6">
            <label
              htmlFor="storeName"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Store Name
            </label>

            <input
              id="storeName"
              type="text"
              value={storeName}
              onChange={(event) =>
                setStoreName(event.target.value)
              }
              placeholder="Enter your store name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
              required
            />
          </div>

          {/* SLUG */}
          <div className="mt-5">
            <label
              htmlFor="slug"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Store URL
            </label>

            <div className="flex overflow-hidden rounded-xl border border-gray-300 focus-within:border-[#f68b1e] focus-within:ring-2 focus-within:ring-orange-100">
              <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500">
                /seller/
              </span>

              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(event) =>
                  setSlug(
                    event.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                  )
                }
                placeholder="your-store"
                className="min-w-0 flex-1 px-3 py-3 outline-none"
                required
              />
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Use lowercase letters, numbers, and hyphens.
            </p>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-5">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Store Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Tell customers about your store..."
              rows={5}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
            />

            <p className="mt-2 text-xs text-gray-500">
              A short description helps customers understand
              what your store sells.
            </p>
          </div>

          {/* PHONE */}
          <div className="mt-5">
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              placeholder="Enter your phone number"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* STORE LOGO */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Store Logo
            </label>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f68b1e] text-3xl font-bold text-white">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Store logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  storeName.charAt(0).toUpperCase() || "M"
                )}
              </div>

              <div className="min-w-0 flex-1">
                <input
                  id="logoFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) =>
                    setLogoFile(
                      event.target.files?.[0] || null
                    )
                  }
                  className="block w-full cursor-pointer rounded-xl border border-gray-300 bg-white text-sm text-gray-600 file:mr-4 file:border-0 file:bg-[#f68b1e] file:px-4 file:py-3 file:font-semibold file:text-white hover:file:bg-orange-600"
                />

                <p className="mt-2 text-xs text-gray-500">
                  JPG, PNG, or WEBP. Maximum size: 5MB.
                </p>

                <button
                  type="button"
                  onClick={handleLogoUpload}
                  disabled={!logoFile || uploadingLogo}
                  className="mt-3 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploadingLogo
                    ? "Uploading..."
                    : "Upload Logo"}
                </button>
              </div>
            </div>
          </div>

          {/* SAVE */}
          <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#f68b1e] px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Save Store Settings"}
            </button>

            <Link
              href="/seller"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* PREVIEW */}
        <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Store Preview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                This is how your store information will appear.
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
              LIVE
            </span>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
            <div className="h-20 bg-gradient-to-r from-orange-500 to-orange-400" />

            <div className="px-5 pb-5">
              <div className="-mt-10 flex items-end justify-between">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#f68b1e] text-2xl font-bold text-white shadow-sm">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Store logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    storeName.charAt(0).toUpperCase() || "M"
                  )}
                </div>

                <Link
                  href={`/seller/${slug}`}
                  target="_blank"
                  className="mb-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  View Store →
                </Link>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {storeName || "Your Store"}
                </h3>

                <span className="mt-2 inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                  ✓ Verified Store
                </span>
              </div>

              <p className="mt-5 text-sm leading-6 text-gray-600">
                {description ||
                  "Your store description will appear here."}
              </p>

              <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-500">
                <p>
                  <strong className="text-gray-700">
                    Phone:
                  </strong>{" "}
                  {phone || "Not provided"}
                </p>

                <p>
                  <strong className="text-gray-700">
                    Store URL:
                  </strong>{" "}
                  /seller/{slug || "your-store"}
                </p>

                <p>
                  <strong className="text-gray-700">
                    Status:
                  </strong>{" "}
                  {seller?.status || "APPROVED"}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}