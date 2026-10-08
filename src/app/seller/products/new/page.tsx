"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type Category = {
  id: string;
  name: string;
};

type Brand = {
  id: string;
  name: string;
};

type SelectedImage = {
  id: string;
  file: File;
  preview: string;
};

export default function NewProductPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("0");

  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [selectedImages, setSelectedImages] = useState<
    SelectedImage[]
  >([]);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [productCreated, setProductCreated] = useState(false);

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoadingOptions(true);
        setError("");

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
          throw new Error(
            data.message ||
              "Unable to load product options."
          );
        }

        setCategories(data.categories || []);
        setBrands(data.brands || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load categories and brands."
        );
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  function openFileExplorer() {
    if (submitting) {
      return;
    }

    fileInputRef.current?.click();
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    setError("");

    if (selectedImages.length + files.length > 10) {
      setError(
        "You can upload a maximum of 10 images."
      );
      event.target.value = "";
      return;
    }

    const validImages: SelectedImage[] = [];

    for (const file of files) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];

      if (!allowedTypes.includes(file.type)) {
        setError(
          `"${file.name}" is not a supported image type.`
        );
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(
          `"${file.name}" is larger than 5 MB.`
        );
        continue;
      }

      validImages.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      });
    }

    setSelectedImages((current) => [
      ...current,
      ...validImages,
    ]);

    event.target.value = "";
  }

  function removeImage(id: string) {
    setSelectedImages((current) => {
      const image = current.find(
        (item) => item.id === id
      );

      if (image) {
        URL.revokeObjectURL(image.preview);
      }

      return current.filter(
        (item) => item.id !== id
      );
    });
  }

  async function uploadImages() {
    const formData = new FormData();

    selectedImages.forEach((item) => {
      formData.append("files", item.file);
    });

    const response = await fetch(
      "/api/seller/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (response.status === 401) {
      window.location.href = "/login";
      return [];
    }

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to upload images."
      );
    }

    return data.images as {
      url: string;
      path: string;
      name: string;
    }[];
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError(
        "Please enter a valid product price."
      );
      return;
    }

    if (Number(stockQuantity) < 0) {
      setError(
        "Stock quantity cannot be negative."
      );
      return;
    }

    if (
      compareAtPrice &&
      Number(compareAtPrice) < 0
    ) {
      setError(
        "Compare-at price cannot be negative."
      );
      return;
    }

    try {
      setSubmitting(true);

      let uploadedImages: {
        url: string;
        path: string;
        name: string;
      }[] = [];

      if (selectedImages.length > 0) {
        setMessage(
          "Uploading product images..."
        );

        uploadedImages =
          await uploadImages();
      }

      setMessage(
        "Images uploaded. Creating product..."
      );

      const response = await fetch(
        "/api/seller/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            description:
              description.trim() || null,
            sku: sku.trim() || null,
            price: Number(price),
            compareAtPrice:
              compareAtPrice &&
              Number(compareAtPrice) > 0
                ? Number(compareAtPrice)
                : null,
            stockQuantity:
              Number(stockQuantity),
            categoryId,
            brandId: brandId || null,
            imageUrls:
              uploadedImages.map(
                (image) => image.url
              ),
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
          data.message ||
            "Unable to create product."
        );
      }

      setMessage(
        "Product created successfully and sent for approval."
      );

      setProductCreated(true);

      setName("");
      setDescription("");
      setSku("");
      setPrice("");
      setCompareAtPrice("");
      setStockQuantity("0");
      setCategoryId("");
      setBrandId("");

      selectedImages.forEach((image) => {
        URL.revokeObjectURL(
          image.preview
        );
      });

      setSelectedImages([]);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create product."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * SUCCESS SCREEN
   */
  if (productCreated) {
    return (
      <div className="space-y-8">
        {/* Page Header */}
        <section>
          <p className="text-sm font-semibold text-orange-600">
            Seller Center
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Product Submitted
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Your product has been successfully submitted
            for administrator approval.
          </p>
        </section>

        {/* Success Card */}
        <section className="overflow-hidden rounded-3xl border border-green-200 bg-white shadow-sm">
          <div className="border-b border-green-100 bg-green-50 px-6 py-10 text-center sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
              ✓
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Product created successfully!
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
              Your product has been saved and submitted
              for approval. An administrator must approve
              it before customers can see it on the
              marketplace.
            </p>
          </div>

          {/* Status */}
          <div className="grid gap-4 border-b border-gray-100 p-6 sm:grid-cols-3 sm:p-8">
            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Product Status
              </p>

              <div className="mt-3 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                PENDING
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Next Step
              </p>

              <p className="mt-3 text-sm font-bold text-gray-900">
                Admin Approval
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Customer Visibility
              </p>

              <p className="mt-3 text-sm font-bold text-gray-900">
                After Approval
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 p-6 sm:flex-row sm:justify-center sm:p-8">
            <a
              href="/seller/products"
              className="inline-flex items-center justify-center rounded-xl bg-[#f68b1e] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              📦 View My Products
            </a>

            <button
              type="button"
              onClick={() => {
                setProductCreated(false);
                setMessage("");
                setError("");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              ➕ Add Another Product
            </button>

            <a
              href="/seller/tee-cc0a0d0f"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              🏪 View My Store
            </a>
          </div>
        </section>

        {/* Information */}
        <section className="rounded-2xl border border-orange-100 bg-orange-50 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-orange-900">
            What happens next?
          </h2>

          <div className="mt-5 space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                1
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  Product submitted
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Your product has been saved with a
                  PENDING status.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                2
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  Administrator reviews it
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  An administrator will review the
                  product information before approval.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                3
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  Product becomes available
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Once approved, customers can discover
                  and purchase your product.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
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
            Add New Product
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Add your product details, images, pricing
            and inventory.
          </p>
        </div>
      </section>

      {/* Alerts */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
          ✓ {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Product Information */}
        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-gray-100 pb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Product Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the basic information customers
              will see.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="product-name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Product Name
              </label>

              <input
                id="product-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="e.g. Samsung Galaxy S25"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
                required
              />
            </div>

            <div>
              <label
                htmlFor="product-description"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Description
              </label>

              <textarea
                id="product-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                rows={6}
                placeholder="Describe your product..."
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="product-sku"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  SKU
                </label>

                <input
                  id="product-sku"
                  type="text"
                  value={sku}
                  onChange={(event) =>
                    setSku(event.target.value)
                  }
                  placeholder="e.g. SAMSUNG-S25-001"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label
                  htmlFor="product-category"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Category
                </label>

                <select
                  id="product-category"
                  value={categoryId}
                  onChange={(event) =>
                    setCategoryId(
                      event.target.value
                    )
                  }
                  disabled={loadingOptions}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                  required
                >
                  <option value="">
                    {loadingOptions
                      ? "Loading categories..."
                      : "Select category"}
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
                value={brandId}
                onChange={(event) =>
                  setBrandId(event.target.value)
                }
                disabled={loadingOptions}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
              >
                <option value="">
                  {loadingOptions
                    ? "Loading brands..."
                    : "Select brand (optional)"}
                </option>

                {brands.map((brand) => (
                  <option
                    key={brand.id}
                    value={brand.id}
                  >
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Product Images */}
        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-gray-100 pb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Product Images
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Upload up to 10 images. JPG, PNG, WEBP
              and GIF are supported. Maximum 5 MB per
              image.
            </p>
          </div>

          <div className="mt-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={openFileExplorer}
              disabled={submitting}
              className="flex min-h-44 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition hover:border-[#f68b1e] hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="mb-3 text-4xl">
                📷
              </span>

              <span className="text-lg font-bold text-gray-900">
                Choose product images
              </span>

              <span className="mt-1 text-sm text-gray-500">
                Click here to open File Explorer
              </span>
            </button>

            {selectedImages.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">
                    Selected Images
                  </h3>

                  <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
                    {selectedImages.length}/10
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                  {selectedImages.map(
                    (image, index) => (
                      <div
                        key={image.id}
                        className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white"
                      >
                        <div className="relative">
                          <img
                            src={image.preview}
                            alt={image.file.name}
                            className="aspect-square w-full object-cover"
                          />

                          {index === 0 && (
                            <span className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                              Main Image
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                image.id
                              )
                            }
                            className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white transition hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="truncate px-3 py-2 text-xs text-gray-600">
                          {image.file.name}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {selectedImages.length <
                  10 && (
                  <button
                    type="button"
                    onClick={
                      openFileExplorer
                    }
                    disabled={submitting}
                    className="mt-4 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    + Add More Images
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Pricing & Inventory */}
        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-gray-100 pb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Pricing & Inventory
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Set your selling price and available
              stock.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div>
              <label
                htmlFor="product-price"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Price (₦)
              </label>

              <input
                id="product-price"
                type="number"
                min="0"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                placeholder="850000"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
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
                min="0"
                value={compareAtPrice}
                onChange={(event) =>
                  setCompareAtPrice(
                    event.target.value
                  )
                }
                placeholder="900000"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
              />
            </div>

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
                value={stockQuantity}
                onChange={(event) =>
                  setStockQuantity(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#f68b1e] focus:ring-2 focus:ring-orange-100"
                required
              />
            </div>
          </div>
        </section>

        {/* Marketplace Settings */}
        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-gray-100 pb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Marketplace Settings
            </h2>
          </div>

          <div className="mt-6 rounded-xl border border-orange-100 bg-orange-50 p-5 text-sm leading-6 text-orange-800">
            Your product will be submitted as{" "}
            <strong>PENDING</strong> and must be
            approved by an administrator before
            customers can see it.
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse justify-between gap-3 border-t border-gray-200 pt-6 sm:flex-row">
          <a
            href="/seller/products"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </a>

          <button
            type="submit"
            disabled={
              submitting || loadingOptions
            }
            className="inline-flex items-center justify-center rounded-xl bg-[#f68b1e] px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Processing..."
              : "Submit Product"}
          </button>
        </div>
      </form>
    </div>
  );
}