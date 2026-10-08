"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  parentId: string | null;
  parent: {
    id: string;
    name: string;
  } | null;
  productCount: number;
  childrenCount: number;
};

type Brand = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  productCount: number;
};

type Tab = "categories" | "brands";

export default function AdminCategoriesPage() {
  const [activeTab, setActiveTab] =
    useState<Tab>("categories");

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [brands, setBrands] =
    useState<Brand[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [showCategoryModal, setShowCategoryModal] =
    useState(false);

  const [showBrandModal, setShowBrandModal] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [editingBrand, setEditingBrand] =
    useState<Brand | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [
        categoriesResponse,
        brandsResponse,
      ] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/brands"),
      ]);

      const categoriesData =
        await categoriesResponse.json();

      const brandsData =
        await brandsResponse.json();

      if (!categoriesResponse.ok) {
        throw new Error(
          categoriesData.error ||
            "Failed to load categories"
        );
      }

      if (!brandsResponse.ok) {
        throw new Error(
          brandsData.error ||
            "Failed to load brands"
        );
      }

      setCategories(
        categoriesData.categories || []
      );

      setBrands(
        brandsData.brands || []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load data"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredCategories =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      if (!value) {
        return categories;
      }

      return categories.filter(
        (category) =>
          category.name
            .toLowerCase()
            .includes(value) ||
          category.slug
            .toLowerCase()
            .includes(value) ||
          (
            category.description || ""
          )
            .toLowerCase()
            .includes(value)
      );
    }, [categories, search]);

  const filteredBrands =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      if (!value) {
        return brands;
      }

      return brands.filter(
        (brand) =>
          brand.name
            .toLowerCase()
            .includes(value) ||
          brand.slug
            .toLowerCase()
            .includes(value) ||
          (
            brand.description || ""
          )
            .toLowerCase()
            .includes(value)
      );
    }, [brands, search]);

  function openAddCategory() {
    setEditingCategory(null);
    setShowCategoryModal(true);
  }

  function openEditCategory(
    category: Category
  ) {
    setEditingCategory(category);
    setShowCategoryModal(true);
  }

  function openAddBrand() {
    setEditingBrand(null);
    setShowBrandModal(true);
  }

  function openEditBrand(
    brand: Brand
  ) {
    setEditingBrand(brand);
    setShowBrandModal(true);
  }

  async function deleteCategory(
    category: Category
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/categories?id=${category.id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Failed to delete category"
        );
        return;
      }

      await loadData();
    } catch {
      alert(
        "Something went wrong while deleting the category."
      );
    }
  }

  async function deleteBrand(
    brand: Brand
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${brand.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/brands?id=${brand.id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Failed to delete brand"
        );
        return;
      }

      await loadData();
    } catch {
      alert(
        "Something went wrong while deleting the brand."
      );
    }
  }

  const totalCategoryProducts =
    categories.reduce(
      (total, category) =>
        total + category.productCount,
      0
    );

  const totalBrandProducts =
    brands.reduce(
      (total, brand) =>
        total + brand.productCount,
      0
    );

  return (
    <main className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <Link
              href="/"
              className="text-2xl font-extrabold text-orange-500"
            >
              MARKETPLACE
            </Link>

            <p className="mt-1 text-sm text-gray-500">
              Categories & Brands Management
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm font-medium text-gray-600 hover:text-orange-500"
            >
              Dashboard
            </Link>

            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-orange-500"
            >
              View Store
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* TITLE */}
        <div className="mb-8">
          <div className="mb-4">
            <span className="text-sm font-medium text-orange-500">
              Administration
            </span>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Categories & Brands
            </h1>

            <p className="mt-2 text-gray-500">
              Organize marketplace products and manage brands.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* STATS */}
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Categories
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {categories.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                🗂️
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Product categories available in the marketplace.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Brands
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {brands.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                🏷️
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Brands currently available for products.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Products Assigned
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalCategoryProducts}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                📦
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Products currently assigned to categories.
            </p>
          </div>
        </div>

        {/* TABS + SEARCH */}
        <div className="mt-8 rounded-2xl bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div className="flex rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("categories");
                  setSearch("");
                }}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                  activeTab === "categories"
                    ? "bg-white text-orange-500 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Categories
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("brands");
                  setSearch("");
                }}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                  activeTab === "brands"
                    ? "bg-white text-orange-500 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Brands
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder={
                  activeTab === "categories"
                    ? "Search categories..."
                    : "Search brands..."
                }
                className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 sm:w-72"
              />

              {activeTab ===
                "categories" ? (
                <button
                  type="button"
                  onClick={openAddCategory}
                  className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  + Add Category
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openAddBrand}
                  className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  + Add Brand
                </button>
              )}
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="m-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="px-6 py-16 text-center text-gray-500">
              Loading...
            </div>
          ) : activeTab ===
            "categories" ? (
            <>
              {filteredCategories.length ===
              0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="text-4xl">
                    🗂️
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-gray-900">
                    No categories found
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Create your first category.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead>
                      <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                        <th className="px-6 py-4">
                          Category
                        </th>

                        <th className="px-6 py-4">
                          Parent
                        </th>

                        <th className="px-6 py-4">
                          Products
                        </th>

                        <th className="px-6 py-4">
                          Children
                        </th>

                        <th className="px-6 py-4">
                          Created
                        </th>

                        <th className="px-6 py-4 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredCategories.map(
                        (category) => (
                          <tr
                            key={category.id}
                            className="border-b last:border-0 hover:bg-gray-50"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-lg">
                                  🗂️
                                </div>

                                <div>
                                  <p className="font-bold text-gray-900">
                                    {category.name}
                                  </p>

                                  <p className="mt-1 text-xs text-orange-500">
                                    /{category.slug}
                                  </p>

                                  {category.description && (
                                    <p className="mt-1 max-w-md text-sm text-gray-500">
                                      {category.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5 text-sm text-gray-600">
                              {category.parent
                                ?.name || (
                                <span className="text-gray-400">
                                  Main category
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-5">
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
                                {
                                  category.productCount
                                }
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <span className="rounded-full bg-purple-50 px-3 py-1 text-sm font-semibold text-purple-600">
                                {
                                  category.childrenCount
                                }
                              </span>
                            </td>

                            <td className="px-6 py-5 text-sm text-gray-500">
                              {new Date(
                                category.createdAt
                              ).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditCategory(
                                      category
                                    )
                                  }
                                  className="rounded-lg border px-3 py-2 text-sm font-semibold text-gray-700 hover:border-orange-300 hover:text-orange-500"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteCategory(
                                      category
                                    )
                                  }
                                  className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <>
              {filteredBrands.length ===
              0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="text-4xl">
                    🏷️
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-gray-900">
                    No brands found
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Add your first brand to the marketplace.
                  </p>

                  <button
                    type="button"
                    onClick={openAddBrand}
                    className="mt-5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
                  >
                    + Add Brand
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                        <th className="px-6 py-4">
                          Brand
                        </th>

                        <th className="px-6 py-4">
                          Products
                        </th>

                        <th className="px-6 py-4">
                          Created
                        </th>

                        <th className="px-6 py-4 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredBrands.map(
                        (brand) => (
                          <tr
                            key={brand.id}
                            className="border-b last:border-0 hover:bg-gray-50"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-purple-50 text-lg">
                                  {brand.logoUrl ? (
                                    <img
                                      src={
                                        brand.logoUrl
                                      }
                                      alt={
                                        brand.name
                                      }
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    "🏷️"
                                  )}
                                </div>

                                <div>
                                  <p className="font-bold text-gray-900">
                                    {brand.name}
                                  </p>

                                  <p className="mt-1 text-xs text-orange-500">
                                    /{brand.slug}
                                  </p>

                                  {brand.description && (
                                    <p className="mt-1 max-w-md text-sm text-gray-500">
                                      {brand.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
                                {
                                  brand.productCount
                                }
                              </span>
                            </td>

                            <td className="px-6 py-5 text-sm text-gray-500">
                              {new Date(
                                brand.createdAt
                              ).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditBrand(
                                      brand
                                    )
                                  }
                                  className="rounded-lg border px-3 py-2 text-sm font-semibold text-gray-700 hover:border-orange-300 hover:text-orange-500"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteBrand(
                                      brand
                                    )
                                  }
                                  className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          categories={categories}
          onClose={() =>
            setShowCategoryModal(false)
          }
          onSaved={async () => {
            setShowCategoryModal(false);
            setEditingCategory(null);
            await loadData();
          }}
        />
      )}

      {/* BRAND MODAL */}
      {showBrandModal && (
        <BrandModal
          brand={editingBrand}
          onClose={() =>
            setShowBrandModal(false)
          }
          onSaved={async () => {
            setShowBrandModal(false);
            setEditingBrand(null);
            await loadData();
          }}
        />
      )}
    </main>
  );
}

/* CATEGORY MODAL */
function CategoryModal({
  category,
  categories,
  onClose,
  onSaved,
}: {
  category: Category | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [name, setName] =
    useState(category?.name || "");

  const [description, setDescription] =
    useState(category?.description || "");

  const [imageUrl, setImageUrl] =
    useState(category?.imageUrl || "");

  const [parentId, setParentId] =
    useState(category?.parentId || "");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const availableParents =
    categories.filter(
      (item) =>
        item.id !== category?.id
    );

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        "/api/admin/categories",
        {
          method: category
            ? "PATCH"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...(category
              ? {
                  id: category.id,
                }
              : {}),
            name,
            description,
            imageUrl,
            parentId: parentId || null,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save category"
        );
      }

      await onSaved();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save category"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {category
                ? "Edit Category"
                : "Add Category"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure your marketplace category.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Category Name
            </label>

            <input
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="e.g. Electronics"
              required
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Parent Category
            </label>

            <select
              value={parentId}
              onChange={(event) =>
                setParentId(
                  event.target.value
                )
              }
              className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            >
              <option value="">
                Main Category
              </option>

              {availableParents.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              rows={4}
              placeholder="Describe this category..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Image URL
            </label>

            <input
              value={imageUrl}
              onChange={(event) =>
                setImageUrl(
                  event.target.value
                )
              }
              placeholder="https://..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : category
                ? "Save Changes"
                : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* BRAND MODAL */
function BrandModal({
  brand,
  onClose,
  onSaved,
}: {
  brand: Brand | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [name, setName] =
    useState(brand?.name || "");

  const [description, setDescription] =
    useState(brand?.description || "");

  const [logoUrl, setLogoUrl] =
    useState(brand?.logoUrl || "");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        "/api/admin/brands",
        {
          method: brand
            ? "PATCH"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...(brand
              ? {
                  id: brand.id,
                }
              : {}),
            name,
            description,
            logoUrl,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save brand"
        );
      }

      await onSaved();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save brand"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {brand
                ? "Edit Brand"
                : "Add Brand"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure a marketplace brand.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Brand Name
            </label>

            <input
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="e.g. Samsung"
              required
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              rows={4}
              placeholder="Describe this brand..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Logo URL
            </label>

            <input
              value={logoUrl}
              onChange={(event) =>
                setLogoUrl(
                  event.target.value
                )
              }
              placeholder="https://..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : brand
                ? "Save Changes"
                : "Create Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}