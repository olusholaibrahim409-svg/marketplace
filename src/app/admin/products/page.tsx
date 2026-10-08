"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: string | number;
  stockQuantity: number;
  status: string;
  sku: string | null;

  Seller: {
    id: string;
    storeName: string;
  } | null;

  Category: {
    id: string;
    name: string;
  } | null;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/products", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load products."
        );
      }

      setProducts(data.products || []);
    } catch (err) {
      console.error("LOAD ADMIN PRODUCTS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function updateProductStatus(
    id: string,
    action: "approve" | "reject"
  ) {
    const confirmed = window.confirm(
      action === "approve"
        ? "Are you sure you want to approve this product?"
        : "Are you sure you want to reject this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(id);
      setError("");
      setMessage("");

      const status =
        action === "approve" ? "APPROVED" : "REJECTED";

      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update product status."
        );
      }

      setMessage(
        action === "approve"
          ? "Product approved successfully."
          : "Product rejected successfully."
      );

      await loadProducts();
    } catch (err) {
      console.error(
        "UPDATE ADMIN PRODUCT STATUS ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update product."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link
              href="/admin"
              className="text-2xl font-black tracking-tight text-orange-600"
            >
              MARKETPLACE
            </Link>

            <p className="mt-1 text-sm text-gray-500">
              Administration
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Dashboard
            </Link>

            <Link
              href="/"
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              View Store
            </Link>

            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-orange-600">
              Admin / Products
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Products
            </h1>

            <p className="mt-2 text-gray-500">
              Manage products listed on your marketplace.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
          >
            + Add Product
          </Link>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {loading ? (
            <div className="px-6 py-16 text-center text-gray-500">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
                📦
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900">
                No products yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Products created by sellers will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Seller
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {product.name}
                          </p>

                          {product.sku && (
                            <p className="mt-1 text-xs text-gray-400">
                              SKU: {product.sku}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-700">
                        {product.Category?.name ||
                          "Uncategorized"}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-700">
                        {product.Seller?.storeName ||
                          "Unknown seller"}
                      </td>

                      <td className="px-6 py-5">
                        <span className="font-semibold text-gray-900">
                          ₦
                          {Number(
                            product.price
                          ).toLocaleString("en-NG")}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-gray-700">
                        {product.stockQuantity}
                      </td>

                      <td className="px-6 py-5">
                        {product.status === "APPROVED" && (
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                            APPROVED
                          </span>
                        )}

                        {product.status === "PENDING" && (
                          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                            PENDING
                          </span>
                        )}

                        {product.status === "REJECTED" && (
                          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                            REJECTED
                          </span>
                        )}

                        {product.status !== "APPROVED" &&
                          product.status !== "PENDING" &&
                          product.status !== "REJECTED" && (
                            <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                              {product.status}
                            </span>
                          )}
                      </td>

                      <td className="px-6 py-5 text-right">
                        {product.status === "PENDING" ? (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateProductStatus(
                                  product.id,
                                  "approve"
                                )
                              }
                              disabled={
                                updatingId === product.id
                              }
                              className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {updatingId === product.id
                                ? "..."
                                : "Approve"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateProductStatus(
                                  product.id,
                                  "reject"
                                )
                              }
                              disabled={
                                updatingId === product.id
                              }
                              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {updatingId === product.id
                                ? "..."
                                : "Reject"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            No action
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}