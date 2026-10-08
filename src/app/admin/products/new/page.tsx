"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Seller = {
  id: string;
  storeName: string;
  status: string;
};

type Category = {
  id: string;
  name: string;
};

type Brand = {
  id: string;
  name: string;
};

export default function AdminNewProductPage() {
  const router = useRouter();

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [loadingOptions, setLoadingOptions] =
    useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    sku: "",
    sellerId: "",
    categoryId: "",
    brandId: "",
    stockQuantity: "0",
    isFeatured: false,
    isFlashSale: false,
    status: "APPROVED",
  });

  async function loadOptions() {
    try {
      setLoadingOptions(true);
      setError("");

      const [
        sellersResponse,
        categoriesResponse,
        brandsResponse,
      ] = await Promise.all([
        fetch("/api/admin/sellers", {
          cache: "no-store",
        }),

        fetch("/api/admin/categories", {
          cache: "no-store",
        }),

        fetch("/api/admin/brands", {
          cache: "no-store",
        }),
      ]);

      const sellersData =
        await sellersResponse.json();

      const categoriesData =
        await categoriesResponse.json();

      const brandsData =
        await brandsResponse.json();

      if (!sellersResponse.ok) {
        throw new Error(
          sellersData.message ||
            "Unable to load sellers."
        );
      }

      if (!categoriesResponse.ok) {
        throw new Error(
          categoriesData.message ||
            "Unable to load categories."
        );
      }

      if (!brandsResponse.ok) {
        throw new Error(
          brandsData.message ||
            "Unable to load brands."
        );
      }

      setSellers(
        sellersData.sellers ||
          sellersData.data ||
          []
      );

      setCategories(
        categoriesData.categories ||
          categoriesData.data ||
          []
      );

      setBrands(
        brandsData.brands ||
          brandsData.data ||
          []
      );
    } catch (err) {
      console.error(
        "LOAD ADMIN PRODUCT OPTIONS ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load product options."
      );
    } finally {
      setLoadingOptions(false);
    }
  }

  useEffect(() => {
    loadOptions();
  }, []);

  function updateField(
    field: string,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError(
        "Product price must be greater than zero."
      );
      return;
    }

    if (!form.sellerId) {
      setError("Please select a seller.");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    if (
      form.stockQuantity === "" ||
      Number(form.stockQuantity) < 0
    ) {
      setError(
        "Stock quantity cannot be negative."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/admin/products",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: form.name.trim(),

            description:
              form.description.trim(),

            price: Number(form.price),

            compareAtPrice:
              form.compareAtPrice
                ? Number(
                    form.compareAtPrice
                  )
                : null,

            sku:
              form.sku.trim() || null,

            sellerId:
              form.sellerId,

            categoryId:
              form.categoryId,

            brandId:
              form.brandId || null,

            stockQuantity:
              Number(
                form.stockQuantity
              ),

            isFeatured:
              form.isFeatured,

            isFlashSale:
              form.isFlashSale,

            status:
              form.status,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create product."
        );
      }

      setMessage(
        "Product created successfully."
      );

      setTimeout(() => {
        router.push(
          "/admin/products"
        );
      }, 800);
    } catch (err) {
      console.error(
        "ADMIN CREATE PRODUCT ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create product."
      );
    } finally {
      setSaving(false);
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
              href="/admin/products"
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Products
            </Link>

            <Link
              href="/"
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              View Store
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-orange-600">
            Admin / Products / New
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Add Product
          </h1>

          <p className="mt-2 text-gray-500">
            Create a new product for the marketplace.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Basic Information
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Product Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Wireless Bluetooth Headphones"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Describe the product..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Pricing & Inventory
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Price (₦)
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) =>
                    updateField(
                      "price",
                      event.target.value
                    )
                  }
                  placeholder="50000"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Compare-at Price (₦)
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.compareAtPrice}
                  onChange={(event) =>
                    updateField(
                      "compareAtPrice",
                      event.target.value
                    )
                  }
                  placeholder="65000"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.stockQuantity}
                  onChange={(event) =>
                    updateField(
                      "stockQuantity",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                SKU
              </label>

              <input
                type="text"
                value={form.sku}
                onChange={(event) =>
                  updateField(
                    "sku",
                    event.target.value
                  )
                }
                placeholder="PRODUCT-SKU-001"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Marketplace Information
            </h2>

            {loadingOptions ? (
              <div className="mt-6 rounded-xl bg-gray-50 px-5 py-8 text-center text-sm text-gray-500">
                Loading sellers, categories and brands...
              </div>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Seller
                  </label>

                  <select
                    value={form.sellerId}
                    onChange={(event) =>
                      updateField(
                        "sellerId",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="">
                      Select seller
                    </option>

                    {sellers.map(
                      (seller) => (
                        <option
                          key={seller.id}
                          value={seller.id}
                        >
                          {seller.storeName}
                          {" — "}
                          {seller.status}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Category
                  </label>

                  <select
                    value={form.categoryId}
                    onChange={(event) =>
                      updateField(
                        "categoryId",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Brand
                  </label>

                  <select
                    value={form.brandId}
                    onChange={(event) =>
                      updateField(
                        "brandId",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="">
                      No brand
                    </option>

                    {brands.map(
                      (brand) => (
                        <option
                          key={brand.id}
                          value={brand.id}
                        >
                          {brand.name}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Marketplace Settings
            </h2>

            <div className="mt-6 space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) =>
                    updateField(
                      "isFeatured",
                      event.target.checked
                    )
                  }
                  className="h-5 w-5 rounded border-gray-300 text-orange-600"
                />

                <span className="text-sm font-medium text-gray-700">
                  Feature this product
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isFlashSale}
                  onChange={(event) =>
                    updateField(
                      "isFlashSale",
                      event.target.checked
                    )
                  }
                  className="h-5 w-5 rounded border-gray-300 text-orange-600"
                />

                <span className="text-sm font-medium text-gray-700">
                  Mark as Flash Sale
                </span>
              </label>

              <div className="pt-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Product Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 md:max-w-sm"
                >
                  <option value="APPROVED">
                    Approved
                  </option>

                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="REJECTED">
                    Rejected
                  </option>
                </select>
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/products"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                saving ||
                loadingOptions
              }
              className="rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Creating Product..."
                : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}