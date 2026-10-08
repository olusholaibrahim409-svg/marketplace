"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
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

type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
};

type FlashSale = {
  id: string;
  salePrice: number;
  stockLimit: number | null;
  soldQuantity: number;
  flashSaleId: string;
  name: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  status: string;
  isFeatured: boolean;
  isFlashSale: boolean;

  category: Category | null;
  brand: Brand | null;

  images: ProductImage[];

  inventory: {
    quantity: number;
    reserved: number;
  } | null;

  flashSale: FlashSale | null;
};

function formatDateTimeLocal(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();

  const localDate = new Date(
    date.getTime() - offset * 60 * 1000
  );

  return localDate
    .toISOString()
    .slice(0, 16);
}

export default function EditProductPage() {
  const params = useParams();

  const productId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [product, setProduct] =
    useState<Product | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [brands, setBrands] =
    useState<Brand[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [deletingImageId, setDeletingImageId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [sku, setSku] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [brandId, setBrandId] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [compareAtPrice, setCompareAtPrice] =
    useState("");

  const [stockQuantity, setStockQuantity] =
    useState("");

  const [isFeatured, setIsFeatured] =
    useState(false);

  const [isFlashSale, setIsFlashSale] =
    useState(false);

  const [flashSalePrice, setFlashSalePrice] =
    useState("");

  const [flashSaleStart, setFlashSaleStart] =
    useState("");

  const [flashSaleEnd, setFlashSaleEnd] =
    useState("");

  const [flashSaleStockLimit, setFlashSaleStockLimit] =
    useState("");

  /*
   * LOAD PRODUCT
   */
  useEffect(() => {
    if (!productId) {
      setError("Product ID is missing.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/seller/products/${productId}`,
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to load product."
          );
        }

        if (cancelled) {
          return;
        }

        const loadedProduct =
          data.product as Product;

        setProduct(loadedProduct);

        setCategories(
          Array.isArray(data.categories)
            ? data.categories
            : []
        );

        setBrands(
          Array.isArray(data.brands)
            ? data.brands
            : []
        );

        setName(
          loadedProduct.name || ""
        );

        setDescription(
          loadedProduct.description || ""
        );

        setSku(
          loadedProduct.sku || ""
        );

        setCategoryId(
          loadedProduct.category?.id || ""
        );

        setBrandId(
          loadedProduct.brand?.id || ""
        );

        setPrice(
          String(
            loadedProduct.price ?? ""
          )
        );

        setCompareAtPrice(
          loadedProduct.compareAtPrice !==
            null
            ? String(
                loadedProduct.compareAtPrice
              )
            : ""
        );

        setStockQuantity(
          String(
            loadedProduct.stockQuantity ?? ""
          )
        );

        setIsFeatured(
          loadedProduct.isFeatured === true
        );

        const saleEnabled =
          loadedProduct.isFlashSale === true;

        setIsFlashSale(
          saleEnabled
        );

        if (
          saleEnabled &&
          loadedProduct.flashSale
        ) {
          setFlashSalePrice(
            String(
              loadedProduct.flashSale
                .salePrice ?? ""
            )
          );

          setFlashSaleStockLimit(
            loadedProduct.flashSale
              .stockLimit !== null
              ? String(
                  loadedProduct.flashSale
                    .stockLimit
                )
              : ""
          );

          setFlashSaleStart(
            formatDateTimeLocal(
              loadedProduct.flashSale
                .startsAt
            )
          );

          setFlashSaleEnd(
            formatDateTimeLocal(
              loadedProduct.flashSale
                .endsAt
            )
          );
        } else {
          setFlashSalePrice("");
          setFlashSaleStart("");
          setFlashSaleEnd("");
          setFlashSaleStockLimit("");
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "LOAD EDIT PRODUCT ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load product."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  /*
   * FLASH SALE TOGGLE
   */
  function handleFlashSaleToggle(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const checked =
      event.target.checked;

    setIsFlashSale(checked);

    setError("");
    setSuccess("");

    if (!checked) {
      setFlashSalePrice("");
      setFlashSaleStart("");
      setFlashSaleEnd("");
      setFlashSaleStockLimit("");
    }
  }

  /*
   * SAVE PRODUCT
   */
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!productId) {
      setError("Product ID is missing.");
      return;
    }

    const trimmedName =
      name.trim();

    const trimmedCategoryId =
      categoryId.trim();

    const numericPrice =
      Number(price);

    const numericCompareAtPrice =
      compareAtPrice.trim() === ""
        ? null
        : Number(compareAtPrice);

    const numericStock =
      Number(stockQuantity);

    if (!trimmedName) {
      setError(
        "Product name is required."
      );
      return;
    }

    if (!trimmedCategoryId) {
      setError(
        "Category is required."
      );
      return;
    }

    if (
      !Number.isFinite(
        numericPrice
      ) ||
      numericPrice <= 0
    ) {
      setError(
        "Enter a valid product price."
      );
      return;
    }

    if (
      numericCompareAtPrice !==
        null &&
      (!Number.isFinite(
        numericCompareAtPrice
      ) ||
        numericCompareAtPrice <= 0)
    ) {
      setError(
        "Enter a valid compare-at price."
      );
      return;
    }

    if (
      !Number.isInteger(
        numericStock
      ) ||
      numericStock < 0
    ) {
      setError(
        "Enter a valid stock quantity."
      );
      return;
    }

    /*
     * FLASH SALE VALIDATION
     */
    if (isFlashSale === true) {
      const numericFlashSalePrice =
        Number(
          flashSalePrice
        );

      const numericFlashSaleStockLimit =
        Number(
          flashSaleStockLimit
        );

      if (
        flashSalePrice.trim() ===
          "" ||
        !Number.isFinite(
          numericFlashSalePrice
        ) ||
        numericFlashSalePrice <= 0
      ) {
        setError(
          "Enter a valid Flash Sale price."
        );
        return;
      }

      if (
        numericFlashSalePrice >=
        numericPrice
      ) {
        setError(
          "Flash Sale price must be lower than the normal product price."
        );
        return;
      }

      if (!flashSaleStart) {
        setError(
          "Flash Sale start date and time are required."
        );
        return;
      }

      if (!flashSaleEnd) {
        setError(
          "Flash Sale end date and time are required."
        );
        return;
      }

      const startDate =
        new Date(
          flashSaleStart
        );

      const endDate =
        new Date(
          flashSaleEnd
        );

      if (
        Number.isNaN(
          startDate.getTime()
        )
      ) {
        setError(
          "Flash Sale start date is invalid."
        );
        return;
      }

      if (
        Number.isNaN(
          endDate.getTime()
        )
      ) {
        setError(
          "Flash Sale end date is invalid."
        );
        return;
      }

      if (
        endDate <=
        startDate
      ) {
        setError(
          "Flash Sale end time must be after the start time."
        );
        return;
      }

      if (
        flashSaleStockLimit.trim() ===
          "" ||
        !Number.isInteger(
          numericFlashSaleStockLimit
        ) ||
        numericFlashSaleStockLimit <= 0
      ) {
        setError(
          "Enter a valid Flash Sale stock limit."
        );
        return;
      }

      if (
        numericFlashSaleStockLimit >
        numericStock
      ) {
        setError(
          "Flash Sale stock limit cannot be greater than the available product stock."
        );
        return;
      }
    }

    const payload = {
      name:
        trimmedName,

      description:
        description.trim(),

      sku:
        sku.trim() || null,

      categoryId:
        trimmedCategoryId,

      brandId:
        brandId.trim() || null,

      price:
        numericPrice,

      compareAtPrice:
        numericCompareAtPrice,

      stockQuantity:
        numericStock,

      isFeatured,

      isFlashSale:
        isFlashSale === true,

      flashSalePrice:
        isFlashSale === true
          ? Number(
              flashSalePrice
            )
          : null,

      flashSaleStart:
        isFlashSale === true
          ? flashSaleStart
          : null,

      flashSaleEnd:
        isFlashSale === true
          ? flashSaleEnd
          : null,

      flashSaleStockLimit:
        isFlashSale === true
          ? Number(
              flashSaleStockLimit
            )
          : null,
    };

    try {
      setSaving(true);

      const response =
        await fetch(
          `/api/seller/products/${productId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to update product."
        );
      }

      setProduct(
        data.product
      );

      setIsFlashSale(
        data.product.isFlashSale === true
      );

      if (
        data.product.isFlashSale ===
          true &&
        data.product.flashSale
      ) {
        setFlashSalePrice(
          String(
            data.product.flashSale
              .salePrice
          )
        );

        setFlashSaleStockLimit(
          data.product.flashSale
            .stockLimit !== null
            ? String(
                data.product.flashSale
                  .stockLimit
              )
            : ""
        );

        setFlashSaleStart(
          formatDateTimeLocal(
            data.product.flashSale
              .startsAt
          )
        );

        setFlashSaleEnd(
          formatDateTimeLocal(
            data.product.flashSale
              .endsAt
          )
        );
      } else {
        setFlashSalePrice("");
        setFlashSaleStart("");
        setFlashSaleEnd("");
        setFlashSaleStockLimit("");
      }

      setSuccess(
        "Product updated successfully."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * UPLOAD IMAGE
   */
  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (
      ![
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      setError(
        "Only JPG, PNG and WEBP images are allowed."
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image must be smaller than 5MB."
      );
      return;
    }

    if (
      (product?.images?.length || 0) >=
      10
    ) {
      setError(
        "You can have a maximum of 10 images per product."
      );
      return;
    }

    try {
      setUploadingImage(true);
      setError("");
      setSuccess("");

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          `/api/seller/products/${productId}`,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to upload image."
        );
      }

      setProduct(
        (current) =>
          current
            ? {
                ...current,
                images: [
                  ...current.images,
                  data.image,
                ],
              }
            : current
      );

      setSuccess(
        "Product image uploaded successfully."
      );
    } catch (err) {
      console.error(
        "UPLOAD PRODUCT IMAGE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload image."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  /*
   * DELETE IMAGE
   */
  async function handleDeleteImage(
    image: ProductImage
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product image?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingImageId(
        image.id
      );

      setError("");
      setSuccess("");

      const response =
        await fetch(
          `/api/seller/products/${productId}?imageId=${encodeURIComponent(
            image.id
          )}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to delete image."
        );
      }

      setProduct(
        (current) =>
          current
            ? {
                ...current,
                images:
                  current.images.filter(
                    (item) =>
                      item.id !==
                      image.id
                  ),
              }
            : current
      );

      setSuccess(
        "Product image deleted successfully."
      );
    } catch (err) {
      console.error(
        "DELETE PRODUCT IMAGE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete image."
      );
    } finally {
      setDeletingImageId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f5f5] p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-gray-500">
              Loading product...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f5f5f5] p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Product not found
            </h1>

            <p className="mt-2 text-gray-500">
              {error ||
                "Unable to load this product."}
            </p>

            <Link
              href="/seller/products"
              className="mt-6 inline-flex rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/seller/products"
              className="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              ← Back to Products
            </Link>

            <h1 className="mt-2 text-2xl font-bold text-gray-900">
              Edit Product
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Update your product information,
              inventory and Flash Sale settings.
            </p>
          </div>

          <Link
            href={`/seller/products/${product.id}`}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            View Product
          </Link>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* BASIC INFORMATION */}

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Basic Information
            </h2>

            <div className="mt-5 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Product Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  placeholder="Enter product name"
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
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  placeholder="Describe your product"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Category
                  </label>

                  <select
                    value={categoryId}
                    onChange={(event) =>
                      setCategoryId(
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Brand
                  </label>

                  <select
                    value={brandId}
                    onChange={(event) =>
                      setBrandId(
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  SKU
                </label>

                <input
                  type="text"
                  value={sku}
                  onChange={(event) =>
                    setSku(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  placeholder="Optional SKU"
                />
              </div>
            </div>
          </section>

          {/* PRICING */}

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Pricing & Inventory
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(event) =>
                    setPrice(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Compare-at Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={compareAtPrice}
                  onChange={(event) =>
                    setCompareAtPrice(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(event) =>
                    setStockQuantity(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            <label className="mt-5 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(event) =>
                  setIsFeatured(
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />

              <span className="text-sm font-medium text-gray-700">
                Feature this product
              </span>
            </label>
          </section>

          {/* FLASH SALE */}

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Flash Sale
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Put this product on a limited-time
                  promotional sale.
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={
                    isFlashSale === true
                  }
                  onChange={
                    handleFlashSaleToggle
                  }
                  className="h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />

                <span className="text-sm font-semibold text-gray-700">
                  Enable Flash Sale
                </span>
              </label>
            </div>

            {isFlashSale === true && (
              <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Flash Sale Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        flashSalePrice
                      }
                      onChange={(event) =>
                        setFlashSalePrice(
                          event.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      placeholder="e.g. 450000"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Flash Sale Stock Limit
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={
                        flashSaleStockLimit
                      }
                      onChange={(event) =>
                        setFlashSaleStockLimit(
                          event.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      placeholder="e.g. 10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Start Date & Time
                    </label>

                    <input
                      type="datetime-local"
                      value={
                        flashSaleStart
                      }
                      onChange={(event) =>
                        setFlashSaleStart(
                          event.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      End Date & Time
                    </label>

                    <input
                      type="datetime-local"
                      value={
                        flashSaleEnd
                      }
                      onChange={(event) =>
                        setFlashSaleEnd(
                          event.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* PRODUCT IMAGES */}

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Product Images
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Upload up to 10 product images.
                </p>
              </div>

              <label className="cursor-pointer rounded-lg bg-orange-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-orange-600">
                {uploadingImage
                  ? "Uploading..."
                  : "Add Image"}

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={
                    handleImageUpload
                  }
                  disabled={
                    uploadingImage ||
                    product.images.length >=
                      10
                  }
                  className="hidden"
                />
              </label>
            </div>

            {product.images.length > 0 ? (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {product.images.map(
                  (image, index) => (
                    <div
                      key={image.id}
                      className="group overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <div className="relative">
                        <img
                          src={image.url}
                          alt={
                            image.altText ||
                            product.name
                          }
                          className="aspect-square w-full object-cover"
                        />

                        {index === 0 && (
                          <span className="absolute left-2 top-2 rounded-md bg-orange-500 px-2 py-1 text-[11px] font-bold text-white shadow">
                            Main Image
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteImage(
                              image
                            )
                          }
                          disabled={
                            deletingImageId ===
                            image.id
                          }
                          className="absolute right-2 top-2 rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow transition group-hover:opacity-100 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {deletingImageId ===
                          image.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 px-3 py-2">
                        <span className="text-xs font-medium text-gray-500">
                          Image {index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteImage(
                              image
                            )
                          }
                          disabled={
                            deletingImageId ===
                            image.id
                          }
                          className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50 sm:hidden"
                        >
                          {deletingImageId ===
                          image.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                No product images yet.
              </div>
            )}
          </section>

          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/seller/products"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}