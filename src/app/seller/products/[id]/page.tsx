"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
};

type Category = {
  id: string;
  name: string;
};

type Brand = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sku: string | null;
  price: number | string;
  compareAtPrice: number | string | null;
  stockQuantity: number;
  status: string;

  isFeatured?: boolean;
  isFlashSale?: boolean;

  category?: {
    id: string;
    name: string;
  } | null;

  brand?: {
    id: string;
    name: string;
  } | null;

  images?: ProductImage[];
};

export default function SellerProductPage() {
  const params = useParams();

  const id = params?.id as string;

  const [product, setProduct] =
    useState<Product | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [brands, setBrands] =
    useState<Brand[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] =
    useState(false);

  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");
  const [uploadMessage, setUploadMessage] =
    useState("");
  const [saveMessage, setSaveMessage] =
    useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    categoryId: "",
    brandId: "",
    price: "",
    compareAtPrice: "",
    stockQuantity: "",
    description: "",
    isFeatured: false,
    isFlashSale: false,
  });

  async function loadProduct() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/seller/products/${id}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to load product."
        );
      }

      const loadedProduct: Product =
        data.product;

      setProduct(loadedProduct);

      setForm({
        name: loadedProduct.name || "",
        sku: loadedProduct.sku || "",
        categoryId:
          loadedProduct.category?.id || "",
        brandId:
          loadedProduct.brand?.id || "",
        price: String(
          loadedProduct.price ?? ""
        ),
        compareAtPrice:
          loadedProduct.compareAtPrice !==
            null &&
          loadedProduct.compareAtPrice !==
            undefined
            ? String(
                loadedProduct.compareAtPrice
              )
            : "",
        stockQuantity: String(
          loadedProduct.stockQuantity ?? 0
        ),
        description:
          loadedProduct.description || "",
        isFeatured:
          loadedProduct.isFeatured === true,
        isFlashSale:
          loadedProduct.isFlashSale === true,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load product."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadOptions() {
    try {
      const response = await fetch(
        "/api/seller/products",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        return;
      }

      setCategories(data.categories || []);
      setBrands(data.brands || []);
    } catch {
      // Product can still be viewed if options fail.
    }
  }

  useEffect(() => {
    if (id) {
      loadProduct();
      loadOptions();
    }
  }, [id]);

  function handleInputChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleCheckboxChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const { name, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: checked,
    }));
  }

  async function handleSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSaveMessage("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    const price = Number(form.price);

    const stockQuantity = Number(
      form.stockQuantity
    );

    const compareAtPrice =
      form.compareAtPrice.trim() !== ""
        ? Number(form.compareAtPrice)
        : null;

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setError(
        "Please enter a valid selling price."
      );
      return;
    }

    if (
      compareAtPrice !== null &&
      (!Number.isFinite(compareAtPrice) ||
        compareAtPrice <= 0)
    ) {
      setError(
        "Please enter a valid compare-at price."
      );
      return;
    }

    if (
      !Number.isInteger(stockQuantity) ||
      stockQuantity < 0
    ) {
      setError(
        "Please enter a valid stock quantity."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/seller/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            sku:
              form.sku.trim() || null,
            categoryId: form.categoryId,
            brandId:
              form.brandId || null,
            price,
            compareAtPrice,
            stockQuantity,
            description:
              form.description.trim(),
            isFeatured:
              form.isFeatured,
            isFlashSale:
              form.isFlashSale,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to update product."
        );
      }

      setSaveMessage(
        "Product updated successfully."
      );

      setEditing(false);

      await loadProduct();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setUploadMessage("");

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG and WEBP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image must be smaller than 5MB."
      );

      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        `/api/seller/products/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to upload image."
        );
      }

      setUploadMessage(
        "Product image uploaded successfully."
      );

      await loadProduct();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload image."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function formatPrice(
    value:
      | number
      | string
      | null
  ) {
    if (
      value === null ||
      value === undefined
    ) {
      return "₦0";
    }

    return `₦${Number(
      value
    ).toLocaleString("en-NG")}`;
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#f68b1e]" />

          <p className="font-semibold text-gray-600">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
            !
          </div>

          <h1 className="mb-3 text-2xl font-bold text-gray-900">
            Unable to load product
          </h1>

          <p className="mb-6 text-red-600">
            {error}
          </p>

          <Link
            href="/seller/products"
            className="inline-flex rounded-xl bg-[#f68b1e] px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Back to My Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            Seller Center
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            {product.name}
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage your product
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {!editing && (
            <button
              type="button"
              onClick={() => {
                setError("");
                setSaveMessage("");
                setEditing(true);
              }}
              className="rounded-xl bg-[#f68b1e] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              ✏️ Edit Product
            </button>
          )}

          <Link
            href="/seller/products"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            ← Back to Products
          </Link>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link
          href="/seller"
          className="hover:text-[#f68b1e]"
        >
          Seller Center
        </Link>

        <span className="mx-2">/</span>

        <Link
          href="/seller/products"
          className="hover:text-[#f68b1e]"
        >
          My Products
        </Link>

        <span className="mx-2">/</span>

        <span className="text-gray-800">
          {product.name}
        </span>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {saveMessage && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
          ✓ {saveMessage}
        </div>
      )}

      {uploadMessage && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
          ✓ {uploadMessage}
        </div>
      )}

      {/* Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Product Images */}
        <section className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:col-span-1">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Product Images
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your product gallery.
              </p>
            </div>

            <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
              {product.images?.length || 0}/10
            </span>
          </div>

          {product.images &&
          product.images.length > 0 ? (
            <div className="space-y-4">
              {product.images.map(
                (image, index) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-xl border border-gray-200"
                  >
                    <div className="relative">
                      <img
                        src={image.url}
                        alt={
                          image.altText ||
                          product.name
                        }
                        className="h-64 w-full object-cover"
                      />

                      {image.sortOrder ===
                        0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">
                          Main Image
                        </span>
                      )}

                      {image.sortOrder !==
                        0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                          Image {index + 1}
                        </span>
                      )}
                    </div>

                    {image.sortOrder ===
                      0 && (
                      <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600">
                        Main Product Image
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
              <div className="mb-3 text-5xl">
                📷
              </div>

              <h3 className="font-semibold text-gray-900">
                No product image
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                This product currently has no
                uploaded image.
              </p>
            </div>
          )}

          <div className="mt-6">
            {product.images &&
            product.images.length >= 10 ? (
              <div className="rounded-xl bg-gray-100 p-4 text-center text-sm text-gray-600">
                Maximum of 10 images reached.
              </div>
            ) : (
              <label
                className={`flex cursor-pointer items-center justify-center rounded-xl px-5 py-3 text-center font-semibold text-white transition ${
                  uploading
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-[#f68b1e] hover:bg-orange-600"
                }`}
              >
                {uploading
                  ? "Uploading..."
                  : "📷 Upload Product Image"}

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={
                    handleImageUpload
                  }
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}

            <p className="mt-3 text-center text-xs text-gray-500">
              JPG, PNG or WEBP · Maximum 5MB
            </p>
          </div>
        </section>

        {/* Product Information */}
        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
          <div className="mb-6 flex flex-col justify-between gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Product Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Product details, pricing and marketplace
                settings.
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                product.status ===
                "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : product.status ===
                    "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.status}
            </span>
          </div>

          {editing ? (
            <form
              onSubmit={handleSave}
              className="space-y-6"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="product-name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Product Name
                </label>

                <input
                  id="product-name"
                  name="name"
                  value={form.name}
                  onChange={
                    handleInputChange
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
                  required
                />
              </div>

              {/* SKU */}
              <div>
                <label
                  htmlFor="product-sku"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  SKU
                </label>

                <input
                  id="product-sku"
                  name="sku"
                  value={form.sku}
                  onChange={
                    handleInputChange
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Category + Brand */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="product-category"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Category
                  </label>

                  <select
                    id="product-category"
                    name="categoryId"
                    value={
                      form.categoryId
                    }
                    onChange={
                      handleInputChange
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
                    required
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={
                            category.id
                          }
                          value={
                            category.id
                          }
                        >
                          {category.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="product-brand"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Brand
                  </label>

                  <select
                    id="product-brand"
                    name="brandId"
                    value={
                      form.brandId
                    }
                    onChange={
                      handleInputChange
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
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

              {/* Pricing */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="selling-price"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Selling Price (₦)
                  </label>

                  <input
                    id="selling-price"
                    type="number"
                    min="1"
                    name="price"
                    value={form.price}
                    onChange={
                      handleInputChange
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="compare-price"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Compare-at Price (₦)
                  </label>

                  <input
                    id="compare-price"
                    type="number"
                    min="1"
                    name="compareAtPrice"
                    value={
                      form.compareAtPrice
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Optional"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="stock-quantity"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Stock Quantity
                </label>

                <input
                  id="stock-quantity"
                  type="number"
                  min="0"
                  step="1"
                  name="stockQuantity"
                  value={
                    form.stockQuantity
                  }
                  onChange={
                    handleInputChange
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="product-description"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="product-description"
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleInputChange
                  }
                  rows={6}
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Marketplace options */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="mb-4 font-bold text-gray-900">
                  Marketplace Options
                </h3>

                <label className="mb-4 flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={
                      form.isFeatured
                    }
                    onChange={
                      handleCheckboxChange
                    }
                    className="h-5 w-5 accent-[#f68b1e]"
                  />

                  <span className="text-sm font-medium text-gray-700">
                    Feature this product
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="isFlashSale"
                    checked={
                      form.isFlashSale
                    }
                    onChange={
                      handleCheckboxChange
                    }
                    className="h-5 w-5 accent-[#f68b1e]"
                  />

                  <span className="text-sm font-medium text-gray-700">
                    Include in Flash Sale
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#f68b1e] px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {saving
                    ? "Saving..."
                    : "💾 Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setError("");
                    setSaveMessage("");
                    loadProduct();
                  }}
                  disabled={saving}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">
                    Product Name
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {product.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    SKU
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {product.sku ||
                      "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Category
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {product.category
                      ?.name ||
                      "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Brand
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {product.brand
                      ?.name ||
                      "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Stock
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {product.stockQuantity}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Selling Price
                  </p>

                  <p className="mt-1 text-xl font-bold text-[#f68b1e]">
                    {formatPrice(
                      product.price
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Compare-at Price
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {product.compareAtPrice
                      ? formatPrice(
                          product.compareAtPrice
                        )
                      : "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Featured
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {product.isFeatured
                      ? "Yes"
                      : "No"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Flash Sale
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {product.isFlashSale
                      ? "Yes"
                      : "No"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="mb-3 font-bold text-gray-900">
                  Description
                </h3>

                <p className="whitespace-pre-wrap leading-7 text-gray-600">
                  {product.description ||
                    "No description provided."}
                </p>
              </div>

              {/* Status */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="mb-4 font-bold text-gray-900">
                  Product Status
                </h3>

                {product.status ===
                "APPROVED" ? (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
                    ✓ This product is approved
                    and visible on the marketplace.
                  </div>
                ) : product.status ===
                  "PENDING" ? (
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
                    This product is waiting for
                    admin approval.
                  </div>
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-700">
                    Current status:{" "}
                    {product.status}
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}