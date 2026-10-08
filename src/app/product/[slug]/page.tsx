"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
};

type ProductVariant = {
  id: string;
  name: string;
  sku: string | null;
  price: string | number | null;
  stockQuantity: number;
  attributes: Record<string, unknown> | null;
};

type ProductReview = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sku: string | null;
  price: string | number;
  compareAtPrice: string | number | null;
  status: string;
  stockQuantity: number;
  isFeatured: boolean;
  isFlashSale: boolean;

  seller: {
    id: string;
    storeName: string;
    slug: string;
    description: string | null;
    logoUrl: string | null;
    phone: string | null;
    status: string;
    commissionRate: string | number;
  };

  category: {
    id: string;
    name: string;
    slug: string;
  };

  brand: {
    id: string;
    name: string;
  } | null;

  images: ProductImage[];
  variants: ProductVariant[];

  inventory: {
    quantity: number;
    reserved: number;
  } | null;

  reviews: ProductReview[];
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1200&q=80";

function formatPrice(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

/*
 * --------------------------------------------------
 * GET GENERIC VARIANT OPTION LABEL
 * --------------------------------------------------
 *
 * Examples:
 *
 * { size: "EU 42" }      -> Size
 * { color: "Black" }     -> Color
 * { storage: "256GB" }   -> Storage
 * { ram: "16GB" }        -> RAM
 * { material: "Leather"} -> Material
 *
 * If the attribute is unknown, its key is converted
 * into a readable label automatically.
 */
function getVariantOptionLabel(
  variant: ProductVariant | null
) {
  if (!variant) {
    return "Option";
  }

  const attributes =
    variant.attributes;

  if (
    attributes &&
    typeof attributes === "object"
  ) {
    const keys =
      Object.keys(attributes);

    if (keys.length > 0) {
      const key = keys[0];

      const labels: Record<
        string,
        string
      > = {
        size: "Size",
        color: "Color",
        colour: "Colour",
        storage: "Storage",
        capacity: "Capacity",
        ram: "RAM",
        memory: "Memory",
        material: "Material",
        style: "Style",
        model: "Model",
        flavor: "Flavor",
        flavour: "Flavour",
        weight: "Weight",
        length: "Length",
        width: "Width",
        voltage: "Voltage",
        power: "Power",
        pack: "Pack",
        quantity: "Quantity",
      };

      const normalizedKey =
        key.toLowerCase();

      if (
        labels[normalizedKey]
      ) {
        return labels[
          normalizedKey
        ];
      }

      return (
        key.charAt(0).toUpperCase() +
        key.slice(1)
      );
    }
  }

  return "Option";
}

/*
 * --------------------------------------------------
 * GET ATTRIBUTE DISPLAY
 * --------------------------------------------------
 *
 * Converts:
 *
 * { size: "EU 42" }
 * into:
 *
 * Size: EU 42
 */
function getVariantAttributeDisplay(
  variant: ProductVariant | null
) {
  if (!variant) {
    return "";
  }

  const attributes =
    variant.attributes;

  if (
    !attributes ||
    typeof attributes !== "object"
  ) {
    return variant.name;
  }

  const keys =
    Object.keys(attributes);

  if (keys.length === 0) {
    return variant.name;
  }

  const key = keys[0];

  const labels: Record<
    string,
    string
  > = {
    size: "Size",
    color: "Color",
    colour: "Colour",
    storage: "Storage",
    capacity: "Capacity",
    ram: "RAM",
    memory: "Memory",
    material: "Material",
    style: "Style",
    model: "Model",
    flavor: "Flavor",
    flavour: "Flavour",
    weight: "Weight",
    length: "Length",
    width: "Width",
    voltage: "Voltage",
    power: "Power",
    pack: "Pack",
    quantity: "Quantity",
  };

  const label =
    labels[key.toLowerCase()] ||
    key.charAt(0).toUpperCase() +
      key.slice(1);

  const value =
    attributes[key];

  if (
    value === null ||
    value === undefined
  ) {
    return variant.name;
  }

  if (
    typeof value === "object"
  ) {
    return `${label}: ${JSON.stringify(
      value
    )}`;
  }

  return `${label}: ${String(
    value
  )}`;
}

export default function ProductDetailPage() {
  const [slug, setSlug] =
    useState("");

  const [product, setProduct] =
    useState<Product | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(0);

  const [quantity, setQuantity] =
    useState(1);

  const [
    selectedVariant,
    setSelectedVariant,
  ] =
    useState<ProductVariant | null>(
      null
    );

  const [
    addedToCart,
    setAddedToCart,
  ] = useState(false);

  const [
    buyingNow,
    setBuyingNow,
  ] = useState(false);

  const [
    isWishlisted,
    setIsWishlisted,
  ] = useState(false);

  const [
    imageErrors,
    setImageErrors,
  ] = useState<
    Record<string, boolean>
  >({});

  // --------------------------------------------------
  // GET SLUG
  // --------------------------------------------------
  useEffect(() => {
    const pathParts =
      window.location.pathname.split(
        "/"
      );

    const currentSlug =
      pathParts[pathParts.length - 1];

    if (currentSlug) {
      setSlug(
        decodeURIComponent(
          currentSlug
        )
      );
    }
  }, []);

  // --------------------------------------------------
  // LOAD PRODUCT
  // --------------------------------------------------
  useEffect(() => {
    if (!slug) {
      return;
    }

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `/api/products/${encodeURIComponent(
              slug
            )}`,
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load product."
          );
        }

        setProduct(data.product);

        /*
         * Do not automatically select
         * the first variant.
         *
         * Customer must explicitly
         * select an option.
         */
        setSelectedVariant(null);
        setQuantity(1);

        // ------------------------------------------------
        // CHECK WISHLIST
        // ------------------------------------------------
        try {
          const savedWishlist =
            JSON.parse(
              localStorage.getItem(
                "marketplace_wishlist"
              ) || "[]"
            );

          if (
            Array.isArray(
              savedWishlist
            )
          ) {
            setIsWishlisted(
              savedWishlist.some(
                (item: {
                  productId?: string;
                }) =>
                  item.productId ===
                  data.product.id
              )
            );
          }
        } catch {
          setIsWishlisted(false);
        }
      } catch (error) {
        console.error(
          "PRODUCT LOAD ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  // --------------------------------------------------
  // WISHLIST
  // --------------------------------------------------
  function toggleWishlist() {
    if (!product) {
      return;
    }

    try {
      const savedWishlist =
        JSON.parse(
          localStorage.getItem(
            "marketplace_wishlist"
          ) || "[]"
        );

      const wishlist =
        Array.isArray(
          savedWishlist
        )
          ? savedWishlist
          : [];

      const existingIndex =
        wishlist.findIndex(
          (item: {
            productId?: string;
          }) =>
            item.productId ===
            product.id
        );

      if (existingIndex >= 0) {
        wishlist.splice(
          existingIndex,
          1
        );

        setIsWishlisted(false);
      } else {
        wishlist.push({
          productId:
            product.id,
          name: product.name,
          slug: product.slug,
          price: Number(
            product.price
          ),
          image:
            product.images[0]?.url ||
            FALLBACK_IMAGE,
          sellerName:
            product.seller.storeName,
        });

        setIsWishlisted(true);
      }

      localStorage.setItem(
        "marketplace_wishlist",
        JSON.stringify(
          wishlist
        )
      );
    } catch (error) {
      console.error(
        "WISHLIST ERROR:",
        error
      );
    }
  }

  // --------------------------------------------------
  // SELECT VARIANT
  // --------------------------------------------------
  function handleVariantSelect(
    variant: ProductVariant
  ) {
    if (
      variant.stockQuantity <= 0
    ) {
      return;
    }

    setSelectedVariant(
      variant
    );

    /*
     * Reset quantity whenever
     * customer changes option.
     */
    setQuantity(1);

    setAddedToCart(false);
    setError("");
  }

  // --------------------------------------------------
  // AVAILABLE STOCK
  // --------------------------------------------------
  const hasVariants =
    Boolean(
      product &&
        product.variants.length > 0
    );

  const availableStock =
    hasVariants
      ? selectedVariant?.stockQuantity ??
        0
      : product?.inventory
          ?.quantity ??
        product?.stockQuantity ??
        0;

  // --------------------------------------------------
  // VARIANT LABEL
  // --------------------------------------------------
  const variantOptionLabel =
    getVariantOptionLabel(
      selectedVariant
    );

  // --------------------------------------------------
  // DISPLAY PRICE
  // --------------------------------------------------
  const displayPrice =
    selectedVariant?.price !==
      null &&
    selectedVariant?.price !==
      undefined
      ? Number(
          selectedVariant.price
        )
      : Number(
          product?.price || 0
        );

  // --------------------------------------------------
  // IMAGE LIST
  // --------------------------------------------------
  const images =
    product?.images?.length
      ? product.images
      : [
          {
            id: "fallback",
            url: FALLBACK_IMAGE,
            altText:
              product?.name ||
              "Marketplace product",
            sortOrder: 0,
          },
        ];

  const currentImage =
    images[selectedImage] ||
    images[0];

  // --------------------------------------------------
  // ADD TO CART
  // --------------------------------------------------
  function addToCart() {
    if (!product) {
      return;
    }

    // -----------------------------------------------
    // REQUIRE VARIANT SELECTION
    // -----------------------------------------------
    if (
      hasVariants &&
      !selectedVariant
    ) {
      setError(
        `Please select an option before adding this product to your cart.`
      );

      return;
    }

    // -----------------------------------------------
    // CHECK STOCK
    // -----------------------------------------------
    if (
      availableStock <= 0
    ) {
      setError(
        hasVariants
          ? `The selected ${variantOptionLabel.toLowerCase()} is out of stock.`
          : "This product is currently out of stock."
      );

      return;
    }

    // -----------------------------------------------
    // CHECK QUANTITY
    // -----------------------------------------------
    if (
      quantity > availableStock
    ) {
      setError(
        `Only ${availableStock} unit${
          availableStock === 1
            ? ""
            : "s"
        } available.`
      );

      return;
    }

    setError("");

    try {
      const storedCart =
        localStorage.getItem(
          "marketplace_cart"
        );

      const existingCart: Array<{
        productId: string;
        variantId: string | null;
        name: string;
        slug: string;
        price: number;
        quantity: number;
        image: string;
        sellerName: string;
        variantName?: string | null;
        variantAttributes?: Record<
          string,
          unknown
        > | null;
      }> = storedCart
        ? JSON.parse(
            storedCart
          )
        : [];

      const variantId =
        selectedVariant?.id ??
        null;

      const variantName =
        selectedVariant?.name ??
        null;

      const variantAttributes =
        selectedVariant?.attributes ??
        null;

      const existingIndex =
        existingCart.findIndex(
          (item) =>
            item.productId ===
              product.id &&
            item.variantId ===
              variantId
        );

      if (
        existingIndex >= 0
      ) {
        const newQuantity =
          existingCart[
            existingIndex
          ].quantity +
          quantity;

        if (
          newQuantity >
          availableStock
        ) {
          setError(
            `Only ${availableStock} unit${
              availableStock ===
              1
                ? ""
                : "s"
            } available for ${
              variantName ||
              "this product"
            }.`
          );

          return;
        }

        existingCart[
          existingIndex
        ].quantity =
          newQuantity;

        /*
         * Keep latest selected
         * variant information.
         */
        existingCart[
          existingIndex
        ].variantName =
          variantName;

        existingCart[
          existingIndex
        ].variantAttributes =
          variantAttributes;

        existingCart[
          existingIndex
        ].price =
          displayPrice;
      } else {
        existingCart.push({
          productId:
            product.id,

          variantId,

          variantName,

          variantAttributes,

          name:
            product.name,

          slug:
            product.slug,

          price:
            displayPrice,

          quantity,

          image:
            product.images[0]?.url ||
            FALLBACK_IMAGE,

          sellerName:
            product.seller
              .storeName,
        });
      }

      localStorage.setItem(
        "marketplace_cart",
        JSON.stringify(
          existingCart
        )
      );

      setAddedToCart(true);

      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error
      );

      setError(
        "Unable to add this product to your cart."
      );
    }
  }

  // --------------------------------------------------
  // BUY NOW
  // --------------------------------------------------
  function buyNow() {
    if (!product) {
      return;
    }

    // -----------------------------------------------
    // REQUIRE VARIANT
    // -----------------------------------------------
    if (
      hasVariants &&
      !selectedVariant
    ) {
      setError(
        "Please select an option before continuing."
      );

      return;
    }

    // -----------------------------------------------
    // CHECK STOCK
    // -----------------------------------------------
    if (
      availableStock <= 0
    ) {
      setError(
        hasVariants
          ? `The selected ${variantOptionLabel.toLowerCase()} is out of stock.`
          : "This product is currently out of stock."
      );

      return;
    }

    if (
      quantity > availableStock
    ) {
      setError(
        `Only ${availableStock} unit${
          availableStock ===
          1
            ? ""
            : "s"
        } available.`
      );

      return;
    }

    setError("");
    setBuyingNow(true);

    /*
     * Add exact product/variant
     * to cart.
     */
    addToCart();

    setTimeout(() => {
      window.location.href =
        "/cart";
    }, 300);
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-300" />

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="h-[500px] animate-pulse rounded-2xl bg-gray-300" />

            <div className="space-y-5">
              <div className="h-8 w-3/4 animate-pulse rounded bg-gray-300" />

              <div className="h-6 w-1/3 animate-pulse rounded bg-gray-300" />

              <div className="h-24 animate-pulse rounded bg-gray-300" />

              <div className="h-12 animate-pulse rounded bg-gray-300" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------
  if (
    error &&
    !product
  ) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <div className="rounded-2xl bg-white p-10 shadow-sm">
            <div className="text-5xl">
              ⚠️
            </div>

            <h1 className="mt-5 text-2xl font-black text-gray-900">
              Product unavailable
            </h1>

            <p className="mt-3 text-gray-500">
              {error}
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-lg bg-orange-600 px-6 py-3 text-sm font-bold text-white hover:bg-orange-700"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  // --------------------------------------------------
  // DISCOUNT
  // --------------------------------------------------
  const discountPercentage =
    product.compareAtPrice &&
    Number(
      product.compareAtPrice
    ) >
      Number(product.price)
      ? Math.round(
          ((Number(
            product.compareAtPrice
          ) -
            Number(
              product.price
            )) /
            Number(
              product.compareAtPrice
            )) *
            100
        )
      : 0;

  // --------------------------------------------------
  // RATING
  // --------------------------------------------------
  const averageRating =
    product.reviews.length >
    0
      ? product.reviews.reduce(
          (sum, review) =>
            sum +
            review.rating,
          0
        ) /
        product.reviews.length
      : 0;

  // --------------------------------------------------
  // PRODUCT PAGE
  // --------------------------------------------------
  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* TOP UTILITY BAR */}

      <div className="hidden bg-gray-950 text-xs text-gray-300 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <p>
            Welcome to Marketplace
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/seller"
              className="transition hover:text-white"
            >
              Sell on Marketplace
            </Link>

            <Link
              href="/"
              className="transition hover:text-white"
            >
              Help Center
            </Link>

            <Link
              href="/account/orders"
              className="transition hover:text-white"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* HEADER */}

      <header className="sticky top-0 z-40 bg-orange-600 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex min-h-16 items-center gap-4 py-2">
            <Link
              href="/"
              className="shrink-0 text-xl font-black tracking-tight sm:text-2xl"
            >
              MARKETPLACE
            </Link>

            <div className="hidden flex-1 md:block">
              <div className="mx-auto max-w-2xl overflow-hidden rounded-md bg-white shadow-sm">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Search products, brands and categories..."
                    className="min-w-0 flex-1 px-4 py-3 text-sm text-gray-900 outline-none"
                  />

                  <button
                    type="button"
                    className="bg-orange-700 px-6 text-sm font-bold transition hover:bg-orange-800"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="hidden text-sm font-semibold transition hover:text-orange-100 sm:block"
              >
                Home
              </Link>

              <Link
                href="/account/orders"
                className="hidden text-sm font-semibold transition hover:text-orange-100 sm:block"
              >
                Orders
              </Link>

              <Link
                href="/cart"
                className="rounded-lg bg-orange-700 px-3 py-2 text-sm font-bold shadow-sm sm:px-4"
              >
                🛒 Cart
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}

      <nav className="bg-orange-700 text-white">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-3 text-sm font-semibold whitespace-nowrap">
          <Link
            href="/"
            className="transition hover:text-orange-200"
          >
            ☰ Categories
          </Link>

          <Link
            href="/flash-sales"
            className="transition hover:text-orange-200"
          >
            Flash Sales
          </Link>

          <Link
            href="/official-stores"
            className="transition hover:text-orange-200"
          >
            Official Stores
          </Link>

          <Link
            href="/deals"
            className="transition hover:text-orange-200"
          >
            Deals
          </Link>

          <Link
            href="/new-arrivals"
            className="transition hover:text-orange-200"
          >
            New Arrivals
          </Link>

          <Link
            href="/top-selling"
            className="transition hover:text-orange-200"
          >
            Top Selling
          </Link>

          <Link
            href="/seller"
            className="transition hover:text-orange-200"
          >
            Sell on Marketplace
          </Link>
        </div>
      </nav>

      {/* BREADCRUMB */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/"
              className="font-medium text-gray-500 hover:text-orange-600"
            >
              Home
            </Link>

            <span className="text-gray-400">
              /
            </span>

            <Link
              href={`/category/${product.category.slug}`}
              className="font-medium text-gray-500 hover:text-orange-600"
            >
              {
                product
                  .category
                  .name
              }
            </Link>

            <span className="text-gray-400">
              /
            </span>

            <span className="line-clamp-1 font-semibold text-gray-900">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* PRODUCT */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          {/* IMAGE SECTION */}

          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
            <div className="relative overflow-hidden rounded-2xl bg-gray-100">
              {discountPercentage >
                0 && (
                <div className="absolute left-4 top-4 z-10 rounded-full bg-red-500 px-3 py-1.5 text-xs font-black text-white">
                  -
                  {
                    discountPercentage
                  }
                  %
                </div>
              )}

              <button
                type="button"
                onClick={
                  toggleWishlist
                }
                className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-xl shadow-md transition hover:scale-105"
                aria-label={
                  isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                {isWishlisted
                  ? "❤️"
                  : "♡"}
              </button>

              <img
                src={
                  imageErrors[
                    currentImage.id
                  ]
                    ? FALLBACK_IMAGE
                    : currentImage.url
                }
                alt={
                  currentImage.altText ||
                  product.name
                }
                className="h-[420px] w-full object-cover sm:h-[520px]"
                onError={() =>
                  setImageErrors(
                    (
                      current
                    ) => ({
                      ...current,
                      [currentImage.id]:
                        true,
                    })
                  )
                }
              />
            </div>

            {/* THUMBNAILS */}

            {images.length >
              1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {images
                  .slice(0, 5)
                  .map(
                    (
                      image,
                      index
                    ) => (
                      <button
                        key={
                          image.id
                        }
                        type="button"
                        onClick={() =>
                          setSelectedImage(
                            index
                          )
                        }
                        className={`overflow-hidden rounded-xl border-2 ${
                          selectedImage ===
                          index
                            ? "border-orange-600"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={
                            image.url
                          }
                          alt={
                            image.altText ||
                            product.name
                          }
                          className="h-20 w-full object-cover"
                        />
                      </button>
                    )
                  )}
              </div>
            )}
          </div>

          {/* PRODUCT INFORMATION */}

          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              {product.isFlashSale && (
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
                  FLASH SALE
                </span>
              )}

              {product.isFeatured && (
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
                  FEATURED
                </span>
              )}

              {product.brand && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                  {
                    product
                      .brand
                      .name
                  }
                </span>
              )}
            </div>

            <h1 className="mt-4 text-2xl font-black leading-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>

            {/* RATING */}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 text-yellow-500">
                {"★★★★★"
                  .split("")
                  .map(
                    (
                      star,
                      index
                    ) => (
                      <span
                        key={
                          index
                        }
                        className={
                          index <
                          Math.round(
                            averageRating
                          )
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                      >
                        {star}
                      </span>
                    )
                  )}
              </div>

              <span className="text-sm font-semibold text-gray-600">
                {product.reviews
                  .length >
                0
                  ? `${averageRating.toFixed(
                      1
                    )} (${product.reviews.length} reviews)`
                  : "No reviews yet"}
              </span>
            </div>

            {/* PRICE */}

            <div className="mt-6">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-3xl font-black text-orange-600">
                  {formatPrice(
                    displayPrice
                  )}
                </span>

                {product.compareAtPrice &&
                  Number(
                    product.compareAtPrice
                  ) >
                    Number(
                      product.price
                    ) && (
                    <span className="text-base text-gray-400 line-through">
                      {formatPrice(
                        Number(
                          product.compareAtPrice
                        )
                      )}
                    </span>
                  )}
              </div>

              <p className="mt-1 text-xs text-gray-400">
                Price may vary by selected option.
              </p>
            </div>

            {/* DESCRIPTION */}

            {product.description && (
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h2 className="text-sm font-black uppercase tracking-wider text-gray-900">
                  Description
                </h2>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                  {
                    product
                      .description
                  }
                </p>
              </div>
            )}

            {/* VARIANTS / OPTIONS */}

            {hasVariants && (
              <div className="mt-6 border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-wider text-gray-900">
                      Select{" "}
                      {getVariantOptionLabel(
                        product
                          .variants[0]
                      )}
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Please select your{" "}
                      {getVariantOptionLabel(
                        product
                          .variants[0]
                      ).toLowerCase()}{" "}
                      before adding to cart.
                    </p>
                  </div>

                  {selectedVariant && (
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                      {
                        selectedVariant.name
                      }
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {product.variants.map(
                    (
                      variant
                    ) => {
                      const isSelected =
                        selectedVariant?.id ===
                        variant.id;

                      const isOutOfStock =
                        variant.stockQuantity <=
                        0;

                      return (
                        <button
                          key={
                            variant.id
                          }
                          type="button"
                          disabled={
                            isOutOfStock
                          }
                          onClick={() =>
                            handleVariantSelect(
                              variant
                            )
                          }
                          className={`relative rounded-xl border-2 px-4 py-4 text-sm font-black transition ${
                            isSelected
                              ? "border-orange-600 bg-orange-50 text-orange-600 shadow-sm"
                              : isOutOfStock
                              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                              : "border-gray-200 bg-white text-gray-700 hover:border-orange-400 hover:bg-orange-50"
                          }`}
                        >
                          <span className="block">
                            {
                              variant.name
                            }
                          </span>

                          {isOutOfStock ? (
                            <span className="mt-1 block text-[10px] uppercase tracking-wider">
                              Out of stock
                            </span>
                          ) : (
                            <span className="mt-1 block text-[10px] font-semibold text-gray-400">
                              {
                                variant.stockQuantity
                              }{" "}
                              available
                            </span>
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* STOCK */}

            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Availability
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {hasVariants
                      ? selectedVariant
                        ? `${availableStock} available in ${getVariantAttributeDisplay(
                            selectedVariant
                          )}`
                        : `Select a ${getVariantOptionLabel(
                            product
                              .variants[0]
                          ).toLowerCase()} to check availability`
                      : availableStock >
                        0
                      ? `${availableStock} available`
                      : "Out of stock"}
                  </p>
                </div>

                <div
                  className={`h-3 w-3 rounded-full ${
                    availableStock >
                      0 &&
                    (!hasVariants ||
                      selectedVariant)
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
              </div>
            </div>

            {/* QUANTITY */}

            <div className="mt-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                Quantity
              </p>

              <div className="flex items-center">
                <button
                  type="button"
                  disabled={
                    quantity <= 1
                  }
                  onClick={() =>
                    setQuantity(
                      Math.max(
                        1,
                        quantity -
                          1
                      )
                    )
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-l-lg border border-gray-300 bg-gray-50 text-lg font-bold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>

                <span className="flex h-11 w-16 items-center justify-center border-y border-gray-300 bg-white text-sm font-black">
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={
                    hasVariants
                      ? !selectedVariant ||
                        quantity >=
                          availableStock
                      : availableStock <=
                          0 ||
                        quantity >=
                          availableStock
                  }
                  onClick={() =>
                    setQuantity(
                      Math.min(
                        availableStock ||
                          1,
                        quantity +
                          1
                      )
                    )
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-r-lg border border-gray-300 bg-gray-50 text-lg font-bold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {addedToCart && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                ✓ Added to cart
                successfully.
                {selectedVariant && (
                  <span className="ml-1">
                    {
                      getVariantAttributeDisplay(
                        selectedVariant
                      )
                    }
                  </span>
                )}
              </div>
            )}

            {/* ACTION BUTTONS */}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={
                  addToCart
                }
                disabled={
                  buyingNow ||
                  availableStock <=
                    0 ||
                  (hasVariants &&
                    !selectedVariant)
                }
                className="rounded-xl border-2 border-orange-600 bg-white px-5 py-4 text-sm font-black text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
              >
                🛒{" "}
                {hasVariants &&
                !selectedVariant
                  ? "Select Option First"
                  : "Add to Cart"}
              </button>

              <button
                type="button"
                onClick={
                  buyNow
                }
                disabled={
                  buyingNow ||
                  availableStock <=
                    0 ||
                  (hasVariants &&
                    !selectedVariant)
                }
                className="rounded-xl bg-orange-600 px-5 py-4 text-sm font-black text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {buyingNow
                  ? "Opening Cart..."
                  : hasVariants &&
                    !selectedVariant
                  ? "Select Option First"
                  : "Buy Now"}
              </button>
            </div>

            {/* SELLER */}

            <div className="mt-6 border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Sold by
                  </p>

                  <p className="mt-1 truncate text-lg font-black text-gray-900">
                    {
                      product
                        .seller
                        .storeName
                    }
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Verified marketplace seller
                  </p>
                </div>

                <Link
                  href={`/store/${product.seller.slug}`}
                  className="shrink-0 rounded-lg border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 transition hover:border-orange-400 hover:text-orange-600"
                >
                  Visit Store
                </Link>
              </div>
            </div>

            {/* DELIVERY / PAYMENT */}

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-xl">
                  🚚
                </div>

                <p className="mt-2 text-xs font-black text-gray-900">
                  Delivery
                </p>

                <p className="mt-1 text-[11px] leading-5 text-gray-500">
                  Reliable delivery available.
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-xl">
                  🔒
                </div>

                <p className="mt-2 text-xs font-black text-gray-900">
                  Secure Payment
                </p>

                <p className="mt-1 text-[11px] leading-5 text-gray-500">
                  Pay securely with Paystack.
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-xl">
                  ↩️
                </div>

                <p className="mt-2 text-xs font-black text-gray-900">
                  Returns
                </p>

                <p className="mt-1 text-[11px] leading-5 text-gray-500">
                  Marketplace return protection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT INFORMATION */}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-black text-gray-900">
              Product Information
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Category
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {
                    product
                      .category
                      .name
                  }
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Brand
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {product.brand
                    ?.name ||
                    "Not specified"}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  SKU
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {product.sku ||
                    "Not specified"}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Product Status
                </p>

                <p className="mt-1 font-bold text-green-600">
                  {
                    product.status
                  }
                </p>
              </div>
            </div>

            {hasVariants && (
              <div className="mt-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">
                  Available{" "}
                  {getVariantOptionLabel(
                    product
                      .variants[0]
                  )}
                  s
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variants.map(
                    (
                      variant
                    ) => (
                      <span
                        key={
                          variant.id
                        }
                        className={`rounded-lg px-3 py-2 text-xs font-bold ${
                          variant.stockQuantity >
                          0
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-400 line-through"
                        }`}
                      >
                        {
                          variant.name
                        }
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </section>

          {/* REVIEWS */}

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-gray-900">
              Reviews
            </h2>

            {product.reviews
              .length ===
            0 ? (
              <div className="mt-6 rounded-xl bg-gray-50 p-6 text-center">
                <div className="text-3xl">
                  ⭐
                </div>

                <p className="mt-3 text-sm font-bold text-gray-900">
                  No reviews yet
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Be the first customer
                  to review this
                  product.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {product.reviews.map(
                  (
                    review
                  ) => (
                    <article
                      key={
                        review.id
                      }
                      className="border-b border-gray-100 pb-4 last:border-0"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-yellow-500">
                          {"★".repeat(
                            Math.min(
                              5,
                              Math.max(
                                0,
                                review.rating
                              )
                            )
                          )}
                        </div>

                        <span className="text-[11px] text-gray-400">
                          {new Date(
                            review.createdAt
                          ).toLocaleDateString(
                            "en-NG"
                          )}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {
                          review.comment ||
                          "Customer left no comment."
                        }
                      </p>
                    </article>
                  )
                )}
              </div>
            )}
          </section>
        </div>
      </section>

      {/* PROMO */}

      <section className="bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                Marketplace
              </p>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                Discover more products
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                Explore deals, new arrivals,
                official stores and top-selling
                products from trusted sellers.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/deals"
                className="rounded-lg bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
              >
                Explore Deals
              </Link>

              <Link
                href="/new-arrivals"
                className="rounded-lg border border-gray-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-900"
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-xl font-black tracking-tight">
                MARKETPLACE
              </h3>

              <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
                Your trusted online marketplace for quality
                products from verified sellers.
              </p>

              <div className="mt-6 flex gap-3">
                <Link
                  href="/"
                  className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold transition hover:bg-orange-700"
                >
                  Shop Now
                </Link>

                <Link
                  href="/seller"
                  className="rounded-lg border border-gray-700 px-4 py-2 text-xs font-bold text-gray-300 transition hover:border-gray-500 hover:text-white"
                >
                  Sell With Us
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold">
                Customer Service
              </h4>

              <div className="mt-4 space-y-3 text-sm text-gray-400">
                <Link
                  href="/"
                  className="block transition hover:text-white"
                >
                  Help Center
                </Link>

                <Link
                  href="/contact"
                  className="block transition hover:text-white"
                >
                  Contact Us
                </Link>

                <Link
                  href="/account/orders"
                  className="block transition hover:text-white"
                >
                  Track Order
                </Link>

                <Link
                  href="/"
                  className="block transition hover:text-white"
                >
                  Returns & Refunds
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold">
                Marketplace
              </h4>

              <div className="mt-4 space-y-3 text-sm text-gray-400">
                <Link
                  href="/"
                  className="block transition hover:text-white"
                >
                  Home
                </Link>

                <Link
                  href="/"
                  className="block transition hover:text-white"
                >
                  Categories
                </Link>

                <Link
                  href="/official-stores"
                  className="block transition hover:text-white"
                >
                  Official Stores
                </Link>

                <Link
                  href="/deals"
                  className="block transition hover:text-white"
                >
                  Deals
                </Link>

                <Link
                  href="/new-arrivals"
                  className="block transition hover:text-white"
                >
                  New Arrivals
                </Link>

                <Link
                  href="/top-selling"
                  className="block transition hover:text-white"
                >
                  Top Selling
                </Link>

                <Link
                  href="/flash-sales"
                  className="block transition hover:text-white"
                >
                  Flash Sales
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold">
                Shop & Sell
              </h4>

              <div className="mt-4 space-y-3 text-sm text-gray-400">
                <Link
                  href="/cart"
                  className="block transition hover:text-white"
                >
                  Shopping Cart
                </Link>

                <Link
                  href="/account/orders"
                  className="block transition hover:text-white"
                >
                  My Orders
                </Link>

                <Link
                  href="/seller"
                  className="block transition hover:text-white"
                >
                  Become a Seller
                </Link>

                <Link
                  href="/seller"
                  className="block transition hover:text-white"
                >
                  Seller Center
                </Link>

                <Link
                  href="/"
                  className="block transition hover:text-white"
                >
                  Seller Policies
                </Link>

                <Link
                  href="/"
                  className="block transition hover:text-white"
                >
                  Seller Support
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-gray-800 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              ©{" "}
              {new Date().getFullYear()}{" "}
              Marketplace. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                href="/"
                className="transition hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                href="/"
                className="transition hover:text-white"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/"
                className="transition hover:text-white"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}