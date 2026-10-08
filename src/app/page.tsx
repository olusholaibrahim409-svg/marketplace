"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=700&q=85";

const categories = [
  { name: "Phones & Tablets", icon: "📱" },
  { name: "Appliances", icon: "🔌" },
  { name: "Electronics", icon: "💻" },
  { name: "Health & Beauty", icon: "🧴" },
  { name: "Home & Office", icon: "🏠" },
  { name: "Fashion", icon: "👕" },
  { name: "Supermarket", icon: "🛒" },
  { name: "Computing", icon: "🖥️" },
  { name: "Baby Products", icon: "🍼" },
  { name: "Gaming", icon: "🎮" },
  { name: "Sports & Fitness", icon: "⚽" },
  { name: "Other Categories", icon: "•••" },
];

const stores = [
  {
    name: "TechHub Store",
    description: "Phones, laptops & accessories",
    icon: "📱",
  },
  {
    name: "HomeStyle",
    description: "Home & office essentials",
    icon: "🏠",
  },
  {
    name: "Fashion Avenue",
    description: "Fashion for everyone",
    icon: "👟",
  },
  {
    name: "Beauty House",
    description: "Beauty & personal care",
    icon: "✨",
  },
  {
    name: "GameZone",
    description: "Gaming & entertainment",
    icon: "🎮",
  },
  {
    name: "Everyday Market",
    description: "Groceries & essentials",
    icon: "🛒",
  },
];

type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string | number;
  compareAtPrice: string | number | null;
  stockQuantity: number;
  status: string;
  isFeatured: boolean;
  isFlashSale: boolean;

  brand: {
    id: string;
    name: string;
  } | null;

  seller: {
    id: string;
    storeName: string;
  };

  category: {
    id: string;
    name: string;
    slug: string;
  };

  images: {
    id: string;
    url: string;
    altText: string | null;
  }[];
};

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  sellerScore: number;
  official: boolean;
  image: string;
  sellerName: string;
  stockQuantity: number;
  isFeatured: boolean;
  isFlashSale: boolean;
};

type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  sellerName: string;
  variantId: string | null;
  variantName: string | null;
};

function formatPrice(price: number) {
  const naira = String.fromCharCode(0x20a6);

  return `${naira}${price.toLocaleString("en-NG")}`;
}

function mapApiProduct(product: ApiProduct): Product {
  const price = Number(product.price);

  const oldPrice = product.compareAtPrice
    ? Number(product.compareAtPrice)
    : price;

  const discount =
    oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  const image =
    product.images?.length > 0 && product.images[0]?.url
      ? product.images[0].url
      : FALLBACK_IMAGE;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category.name,
    brand: product.brand?.name || "Other",
    price,
    oldPrice,
    discount,
    rating: 0,
    reviews: 0,
    sellerScore: 0,
    official: false,
    image,
    sellerName: product.seller.storeName,
    stockQuantity: product.stockQuantity,
    isFeatured: product.isFeatured,
    isFlashSale: product.isFlashSale,
  };
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [officialOnly, setOfficialOnly] = useState(false);
  const [minimumRating, setMinimumRating] = useState("All");
  const [sort, setSort] = useState("featured");

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true);
        setProductsError("");

        const response = await fetch("/api/products");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load products."
          );
        }

        const mappedProducts = Array.isArray(data.products)
          ? data.products.map(mapApiProduct)
          : [];

        setProducts(mappedProducts);
      } catch (error) {
        console.error("HOME PRODUCTS ERROR:", error);

        setProductsError(
          error instanceof Error
            ? error.message
            : "Unable to load products."
        );
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  const availableBrands = useMemo(() => {
    const databaseBrands = products
      .map((product) => product.brand)
      .filter(
        (brand) =>
          brand &&
          brand !== "Other"
      );

    return Array.from(new Set(databaseBrands));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.sellerName.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          product.category === selectedCategory
      );
    }

    if (selectedBrand !== "All") {
      result = result.filter(
        (product) =>
          product.brand === selectedBrand
      );
    }

    if (officialOnly) {
      result = result.filter(
        (product) => product.official
      );
    }

    if (minimumRating !== "All") {
      result = result.filter(
        (product) =>
          product.rating >= Number(minimumRating)
      );
    }

    if (sort === "price-low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sort === "discount") {
      result.sort(
        (a, b) => b.discount - a.discount
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) => b.rating - a.rating
      );
    }

    if (sort === "featured") {
      result.sort(
        (a, b) =>
          Number(b.isFeatured) -
          Number(a.isFeatured)
      );
    }

    return result;
  }, [
    products,
    search,
    selectedCategory,
    selectedBrand,
    officialOnly,
    minimumRating,
    sort,
  ]);

  const flashSaleProducts = products.filter(
    (product) => product.isFlashSale
  );

  function scrollToProducts() {
    document
      .getElementById("products")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }

  function addProductToCart(product: Product) {
    if (product.stockQuantity <= 0) {
      setCartMessage(
        `${product.name} is out of stock.`
      );

      setTimeout(() => {
        setCartMessage("");
      }, 2500);

      return;
    }

    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      image: product.image,
      sellerName: product.sellerName,
      variantId: null,
      variantName: null,
    };

    try {
      const existingCart = JSON.parse(
        localStorage.getItem(
          "marketplace_cart"
        ) || "[]"
      );

      const cart = Array.isArray(existingCart)
        ? existingCart
        : [];

      const existingIndex = cart.findIndex(
        (item: CartItem) =>
          item.productId === cartItem.productId &&
          item.variantId === cartItem.variantId
      );

      if (existingIndex >= 0) {
        const currentQuantity = Number(
          cart[existingIndex].quantity || 0
        );

        cart[existingIndex].quantity = Math.min(
          currentQuantity + 1,
          product.stockQuantity
        );
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem(
        "marketplace_cart",
        JSON.stringify(cart)
      );

      setCartMessage(
        `${product.name} added to cart`
      );

      setTimeout(() => {
        setCartMessage("");
      }, 2500);
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error
      );

      setCartMessage(
        "Unable to add product to cart."
      );

      setTimeout(() => {
        setCartMessage("");
      }, 2500);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">

      {/* TOP BAR */}
      <div className="hidden bg-gray-900 text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">
          <span>
            Welcome to Marketplace
          </span>

          <div className="flex items-center gap-5">

            {/* CHANGED: SELLER APPLICATION */}
            <Link
              href="/seller/apply"
              className="hover:text-orange-400"
            >
              Sell on Marketplace
            </Link>

            <Link
              href="/help"
              className="hover:text-orange-400"
            >
              Help Center
            </Link>

            <Link
              href="/track-order"
              className="hover:text-orange-400"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header className="sticky top-0 z-40 bg-orange-600 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">

          <Link
            href="/"
            className="shrink-0 text-xl font-black tracking-tight md:text-2xl"
          >
            MARKETPLACE
          </Link>

          <div className="hidden flex-1 md:flex">
            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  scrollToProducts();
                }
              }}
              type="search"
              placeholder="Search products, brands and categories"
              className="w-full rounded-l-md bg-white px-4 py-3 text-sm text-gray-900 outline-none"
            />

            <button
              onClick={scrollToProducts}
              className="rounded-r-md bg-gray-900 px-7 font-semibold transition hover:bg-gray-800"
            >
              Search
            </button>
          </div>

          <Link
            href="/account"
            className="hidden rounded-md px-3 py-2 text-sm font-semibold hover:bg-orange-700 md:block"
          >
            Account
          </Link>

          <Link
            href="/account/orders"
            className="hidden rounded-md px-3 py-2 text-sm font-semibold hover:bg-orange-700 md:block"
          >
            Orders
          </Link>

          <Link
            href="/cart"
            className="rounded-md px-3 py-2 text-lg hover:bg-orange-700"
            aria-label="Shopping cart"
          >
            🛒
          </Link>
        </div>

        {/* MOBILE SEARCH */}
        <div className="px-4 pb-3 md:hidden">
          <div className="flex">
            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  scrollToProducts();
                }
              }}
              type="search"
              placeholder="Search products, brands and categories"
              className="w-full rounded-l-md bg-white px-3 py-2.5 text-sm text-gray-900 outline-none"
            />

            <button
              onClick={scrollToProducts}
              className="rounded-r-md bg-gray-900 px-4 text-sm font-semibold"
            >
              Search
            </button>
          </div>
        </div>

        {/* CATEGORY NAV */}
        <nav className="bg-orange-700">
          <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-4 py-3 text-sm font-medium">

            <button
              onClick={() => {
                setSelectedCategory("All");
                scrollToProducts();
              }}
              className="whitespace-nowrap hover:text-orange-200"
            >
              ☰ Categories
            </button>

            <Link
              href="/flash-sales"
              className="whitespace-nowrap hover:text-orange-200"
            >
              Flash Sales
            </Link>

            <Link
              href="/official-stores"
              className="whitespace-nowrap hover:text-orange-200"
            >
              Official Stores
            </Link>

            <Link
              href="/deals"
              className="whitespace-nowrap hover:text-orange-200"
            >
              Deals
            </Link>

            <Link
              href="/new-arrivals"
              className="whitespace-nowrap hover:text-orange-200"
            >
              New Arrivals
            </Link>

            <Link
              href="/top-selling"
              className="whitespace-nowrap hover:text-orange-200"
            >
              Top Selling
            </Link>

            {/* CHANGED */}
            <Link
              href="/seller/apply"
              className="whitespace-nowrap hover:text-orange-200"
            >
              Sell on Marketplace
            </Link>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-5">

        {/* HERO */}
        <section className="grid gap-4 lg:grid-cols-3">

          <div className="relative flex min-h-[360px] flex-col justify-center overflow-hidden rounded-xl bg-gray-950 p-7 text-white md:p-10 lg:col-span-2">

            <div className="absolute right-[-70px] top-[-70px] h-64 w-64 rounded-full bg-orange-600/30 blur-3xl" />

            <div className="relative z-10">

              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
                Marketplace Deals
              </p>

              <h1 className="max-w-2xl text-4xl font-black leading-tight md:text-5xl">
                Discover products you love at prices you&apos;ll love.
              </h1>

              <p className="mt-5 max-w-xl text-gray-300">
                Shop electronics, fashion, beauty,
                groceries, computing, appliances and
                thousands of products from trusted sellers.
              </p>

              <button
                onClick={scrollToProducts}
                className="mt-7 rounded-md bg-orange-500 px-7 py-3 font-bold transition hover:bg-orange-400"
              >
                Start Shopping
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <div className="mb-4 flex items-center justify-between">

              <h2 className="text-lg font-bold">
                Popular Categories
              </h2>

              <button
                onClick={() =>
                  document
                    .getElementById("categories")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="text-sm font-semibold text-orange-600"
              >
                View all
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">

              {categories
                .slice(0, 6)
                .map((category) => (
                  <button
                    key={category.name}
                    onClick={() => {
                      setSelectedCategory(
                        category.name
                      );

                      scrollToProducts();
                    }}
                    className="rounded-lg border p-3 text-center transition hover:border-orange-500 hover:bg-orange-50"
                  >
                    <div className="text-3xl">
                      {category.icon}
                    </div>

                    <p className="mt-2 text-xs font-semibold">
                      {category.name}
                    </p>
                  </button>
                ))}
            </div>
          </div>
        </section>

        {/* TRUST FEATURES */}
        <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">

          {[
            [
              "🚚",
              "Fast Delivery",
              "Across selected locations",
            ],
            [
              "🔒",
              "Secure Payments",
              "Protected checkout",
            ],
            [
              "✓",
              "Verified Sellers",
              "Trusted marketplace sellers",
            ],
            [
              "↩",
              "Easy Returns",
              "Simple return process",
            ],
          ].map(([icon, title, text]) => (
            <div
              key={title}
              className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm"
            >
              <div className="text-2xl">
                {icon}
              </div>

              <div>
                <p className="text-sm font-bold">
                  {title}
                </p>

                <p className="text-xs text-gray-500">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* STORES */}
        <section className="mt-8">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-black">
                Trusted Stores
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Shop from selected marketplace stores
              </p>
            </div>

            <Link
              href="/official-stores"
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              Explore Stores →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

            {stores.map((store) => (
              <button
                key={store.name}
                className="rounded-xl bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-3xl">
                  {store.icon}
                </div>

                <h3 className="mt-3 text-sm font-bold">
                  {store.name}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {store.description}
                </p>
              </button>
            ))}

          </div>
        </section>

        {/* CATEGORIES */}
        <section
          id="categories"
          className="mt-8"
        >
          <div className="mb-4">

            <h2 className="text-2xl font-black">
              Shop by Category
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Find everything you need in one place
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">

            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  setSelectedCategory(
                    category.name
                  );

                  scrollToProducts();
                }}
                className={`rounded-xl bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                  selectedCategory === category.name
                    ? "ring-2 ring-orange-500"
                    : ""
                }`}
              >
                <div className="text-4xl">
                  {category.icon}
                </div>

                <p className="mt-3 text-sm font-semibold">
                  {category.name}
                </p>
              </button>
            ))}

          </div>
        </section>

        {/* FLASH SALES */}
        <section
          id="flash-sales"
          className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm"
        >
          <div className="flex items-center justify-between border-b px-5 py-4">

            <div>
              <h2 className="text-xl font-black">
                🔥 Flash Sales
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Limited-time offers
              </p>
            </div>

            <Link
              href="/flash-sales"
              className="rounded-md bg-gray-900 px-3 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              View All
            </Link>
          </div>

          {loadingProducts ? (
            <div className="p-10 text-center text-sm text-gray-500">
              Loading products...
            </div>
          ) : flashSaleProducts.length === 0 ? (
            <div className="p-10 text-center">

              <p className="text-sm text-gray-500">
                No flash sale products available right now.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 lg:grid-cols-4">

              {flashSaleProducts
                .slice(0, 4)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addProductToCart}
                  />
                ))}

            </div>
          )}
        </section>

        {/* PRODUCT CATALOGUE */}
        <section
          id="products"
          className="mt-10"
        >

          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div>
              <h2 className="text-2xl font-black">
                Explore Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {loadingProducts
                  ? "Loading products..."
                  : `${filteredProducts.length} products available`}
              </p>
            </div>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
              className="rounded-md border bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500"
            >
              <option value="featured">
                Sort: Featured
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="discount">
                Highest Discount
              </option>

              <option value="rating">
                Highest Rated
              </option>
            </select>

          </div>

          {productsError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              {productsError}
            </div>
          )}

          <div className="grid gap-5 lg:grid-cols-[240px_1fr]">

            {/* FILTER SIDEBAR */}
            <aside className="h-fit rounded-xl bg-white p-5 shadow-sm">

              <div className="mb-5 flex items-center justify-between">

                <h3 className="font-black">
                  Filters
                </h3>

                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedBrand("All");
                    setOfficialOnly(false);
                    setMinimumRating("All");
                  }}
                  className="text-xs font-semibold text-orange-600"
                >
                  Clear
                </button>
              </div>

              <div className="border-b pb-5">

                <h4 className="mb-3 text-sm font-bold">
                  Category
                </h4>

                <div className="space-y-2">

                  <button
                    onClick={() =>
                      setSelectedCategory("All")
                    }
                    className={`block text-sm ${
                      selectedCategory === "All"
                        ? "font-bold text-orange-600"
                        : "text-gray-600"
                    }`}
                  >
                    All Categories
                  </button>

                  {categories
                    .slice(0, 8)
                    .map((category) => (
                      <button
                        key={category.name}
                        onClick={() =>
                          setSelectedCategory(
                            category.name
                          )
                        }
                        className={`block text-left text-sm ${
                          selectedCategory ===
                          category.name
                            ? "font-bold text-orange-600"
                            : "text-gray-600"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}

                </div>
              </div>

              <div className="border-b py-5">

                <h4 className="mb-3 text-sm font-bold">
                  Brand
                </h4>

                <select
                  value={selectedBrand}
                  onChange={(event) =>
                    setSelectedBrand(
                      event.target.value
                    )
                  }
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                >
                  <option value="All">
                    All Brands
                  </option>

                  {availableBrands.map(
                    (brand) => (
                      <option
                        key={brand}
                        value={brand}
                      >
                        {brand}
                      </option>
                    )
                  )}
                </select>

              </div>

              <div className="border-b py-5">

                <h4 className="mb-3 text-sm font-bold">
                  Price Range
                </h4>

                <div className="grid grid-cols-2 gap-2">

                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full rounded border px-2 py-2 text-sm outline-none"
                  />

                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full rounded border px-2 py-2 text-sm outline-none"
                  />

                </div>
              </div>

              <div className="border-b py-5">

                <h4 className="mb-3 text-sm font-bold">
                  Discount
                </h4>

                {[10, 20, 30, 40].map(
                  (discount) => (
                    <label
                      key={discount}
                      className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-gray-600"
                    >
                      <input type="checkbox" />

                      {discount}% or more
                    </label>
                  )
                )}

              </div>

              <div className="border-b py-5">

                <h4 className="mb-3 text-sm font-bold">
                  Rating
                </h4>

                {[
                  "4.5",
                  "4",
                  "3.5",
                ].map((rating) => (
                  <button
                    key={rating}
                    onClick={() =>
                      setMinimumRating(
                        rating
                      )
                    }
                    className={`mb-2 block text-sm ${
                      minimumRating === rating
                        ? "font-bold text-orange-600"
                        : "text-gray-600"
                    }`}
                  >
                    ⭐ {rating} & above
                  </button>
                ))}

                <button
                  onClick={() =>
                    setMinimumRating("All")
                  }
                  className="text-xs text-gray-400"
                >
                  Any rating
                </button>

              </div>

              <div className="pt-5">

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    checked={officialOnly}
                    onChange={(event) =>
                      setOfficialOnly(
                        event.target.checked
                      )
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-semibold">
                    Official Stores
                  </span>

                </label>

              </div>

            </aside>

            {/* PRODUCTS */}
            <div>

              {loadingProducts ? (
                <div className="rounded-xl bg-white p-12 text-center">

                  <div className="text-4xl">
                    📦
                  </div>

                  <h3 className="mt-4 text-lg font-bold">
                    Loading products...
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Getting the latest products from the marketplace.
                  </p>

                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="rounded-xl bg-white p-12 text-center">

                  <div className="text-5xl">
                    🔎
                  </div>

                  <h3 className="mt-4 text-lg font-bold">
                    No products found
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Try changing your search or filters.
                  </p>

                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">

                  {filteredProducts.map(
                    (product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={
                          addProductToCart
                        }
                      />
                    )
                  )}

                </div>
              )}

            </div>
          </div>
        </section>

        {/* PAGINATION */}
        <div className="mt-8 flex items-center justify-center gap-2">

          <button className="rounded border bg-white px-4 py-2 text-sm">
            ←
          </button>

          <button className="rounded bg-orange-600 px-4 py-2 text-sm font-bold text-white">
            1
          </button>

          <button className="rounded border bg-white px-4 py-2 text-sm">
            2
          </button>

          <button className="rounded border bg-white px-4 py-2 text-sm">
            3
          </button>

          <button className="rounded border bg-white px-4 py-2 text-sm">
            →
          </button>

        </div>

        {/* APP SECTION */}
        <section className="mt-12 overflow-hidden rounded-xl bg-gray-950 p-7 text-white md:p-10">

          <div className="flex flex-col items-center justify-between gap-7 md:flex-row">

            <div>

              <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
                Marketplace App
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Shop wherever you are.
              </h2>

              <p className="mt-3 max-w-xl text-sm text-gray-400">
                Install Marketplace on your phone for a faster shopping
                experience and quick access to your orders and wishlist.
              </p>

            </div>

            <div className="flex gap-3">

              <button className="rounded-lg bg-white px-5 py-3 text-sm font-bold text-gray-900">
                📱 Install App
              </button>

              <button className="rounded-lg border border-gray-700 px-5 py-3 text-sm font-bold">
                Learn More
              </button>

            </div>

          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="mt-12 bg-gray-950 text-white">

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}
          <div>

            <h3 className="text-2xl font-black">
              MARKETPLACE
            </h3>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Your trusted online marketplace connecting
              customers with verified sellers and quality
              products.
            </p>

          </div>

          {/* CUSTOMER SERVICE */}
          <div>

            <h3 className="font-bold">
              Customer Service
            </h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">

              <Link
                href="/help"
                className="block transition hover:text-orange-400"
              >
                Help Center
              </Link>

              <Link
                href="/contact"
                className="block transition hover:text-orange-400"
              >
                Contact Us
              </Link>

              <Link
                href="/track-order"
                className="block transition hover:text-orange-400"
              >
                Track Order
              </Link>

              <Link
                href="/returns"
                className="block transition hover:text-orange-400"
              >
                Returns & Refunds
              </Link>

            </div>
          </div>

          {/* MARKETPLACE */}
          <div>

            <h3 className="font-bold">
              Marketplace
            </h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">

              <Link
                href="/"
                className="block transition hover:text-orange-400"
              >
                Home
              </Link>

              <Link
                href="/category"
                className="block transition hover:text-orange-400"
              >
                Categories
              </Link>

              <Link
                href="/official-stores"
                className="block transition hover:text-orange-400"
              >
                Official Stores
              </Link>

              <Link
                href="/deals"
                className="block transition hover:text-orange-400"
              >
                Deals
              </Link>

              <Link
                href="/new-arrivals"
                className="block transition hover:text-orange-400"
              >
                New Arrivals
              </Link>

              <Link
                href="/top-selling"
                className="block transition hover:text-orange-400"
              >
                Top Selling
              </Link>

              <Link
                href="/flash-sales"
                className="block transition hover:text-orange-400"
              >
                Flash Sales
              </Link>

            </div>
          </div>

          {/* SHOP & SELL */}
          <div>

            <h3 className="font-bold">
              Shop & Sell
            </h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">

              <Link
                href="/cart"
                className="block transition hover:text-orange-400"
              >
                Shopping Cart
              </Link>

              <Link
                href="/account/orders"
                className="block transition hover:text-orange-400"
              >
                My Orders
              </Link>

              {/* CHANGED */}
              <Link
                href="/seller/apply"
                className="block transition hover:text-orange-400"
              >
                Become a Seller
              </Link>

              <Link
                href="/seller"
                className="block transition hover:text-orange-400"
              >
                Seller Center
              </Link>

              <Link
                href="/seller/policies"
                className="block transition hover:text-orange-400"
              >
                Seller Policies
              </Link>

              <Link
                href="/seller/support"
                className="block transition hover:text-orange-400"
              >
                Seller Support
              </Link>

            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="border-t border-gray-800">

          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-4 py-5 text-xs text-gray-500 md:flex-row">

            <p>
              © 2026 Marketplace. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-5">

              <Link
                href="/privacy"
                className="transition hover:text-orange-400"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="transition hover:text-orange-400"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/cookies"
                className="transition hover:text-orange-400"
              >
                Cookie Policy
              </Link>

            </div>
          </div>
        </div>
      </footer>

      {/* CART NOTIFICATION */}
      {cartMessage && (
        <div className="fixed bottom-5 left-4 right-4 z-50 mx-auto max-w-md rounded-xl bg-gray-950 px-5 py-4 text-center text-sm font-semibold text-white shadow-2xl">
          ✓ {cartMessage}
        </div>
      )}
    </main>
  );
}

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (product: Product) => void;
}) {
  const [imageSrc, setImageSrc] =
    useState(product.image);

  useEffect(() => {
    setImageSrc(product.image);
  }, [product.image]);

  return (
    <div className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      {/* CLICKABLE PRODUCT AREA */}
      <Link
        href={`/product/${product.slug}`}
        className="block"
      >

        <div className="relative overflow-hidden">

          <img
            src={imageSrc}
            alt={product.name}
            className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56"
            onError={() => {
              if (
                imageSrc !== FALLBACK_IMAGE
              ) {
                setImageSrc(
                  FALLBACK_IMAGE
                );
              }
            }}
          />

          {product.discount > 0 && (
            <span className="absolute left-2 top-2 rounded bg-orange-600 px-2 py-1 text-xs font-bold text-white">
              -{product.discount}%
            </span>
          )}

          {product.official && (
            <span className="absolute bottom-2 left-2 rounded bg-gray-900 px-2 py-1 text-[10px] font-bold text-white">
              ✓ Official Store
            </span>
          )}

        </div>

        <div className="p-4">

          <h3 className="min-h-[40px] line-clamp-2 text-sm font-medium">
            {product.name}
          </h3>

          <div className="mt-3">

            <p className="text-lg font-black">
              {formatPrice(product.price)}
            </p>

            {product.oldPrice > product.price && (
              <div className="flex items-center gap-2">

                <p className="text-xs text-gray-400 line-through">
                  {formatPrice(
                    product.oldPrice
                  )}
                </p>

                <span className="text-xs font-semibold text-green-600">
                  Save {product.discount}%
                </span>

              </div>
            )}

          </div>

          <div className="mt-3">

            <p className="text-xs text-gray-500">
              Sold by{" "}
              <span className="font-semibold text-gray-700">
                {product.sellerName}
              </span>
            </p>

          </div>

          {product.rating > 0 && (
            <div className="mt-3 flex items-center justify-between">

              <div className="text-sm">

                <span className="text-yellow-500">
                  ★
                </span>{" "}

                <span className="font-semibold">
                  {product.rating}
                </span>{" "}

                <span className="text-xs text-gray-400">
                  ({product.reviews})
                </span>

              </div>

              {product.sellerScore > 0 && (
                <span className="text-[10px] text-gray-400">
                  Seller{" "}
                  {product.sellerScore}%
                </span>
              )}

            </div>
          )}

        </div>
      </Link>

      {/* ADD TO CART */}
      <div className="px-4 pb-4">

        <button
          type="button"
          onClick={() =>
            onAddToCart(product)
          }
          disabled={
            product.stockQuantity <= 0
          }
          className="w-full rounded-md border border-orange-600 py-2 text-sm font-bold text-orange-600 transition hover:bg-orange-600 hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-400"
        >
          {product.stockQuantity > 0
            ? "Add to Cart"
            : "Out of Stock"}
        </button>

      </div>
    </div>
  );
}