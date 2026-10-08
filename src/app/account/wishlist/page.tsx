
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type WishlistProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
  status: string;
  isFeatured: boolean;
  isFlashSale: boolean;
  image: string | null;

  brand: {
    id: string;
    name: string;
  } | null;

  category: {
    id: string;
    name: string;
    slug: string;
  };

  seller: {
    storeName: string;
  };
};

type WishlistItem = {
  id: string;
  productId: string;
  createdAt: string;
  product: WishlistProduct;
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [removingId, setRemovingId] =
    useState<string | null>(null);

  async function loadWishlist() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/account/wishlist",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load wishlist."
        );
      }

      setItems(data.wishlist?.items || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your wishlist."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  async function handleRemove(productId: string) {
    try {
      setRemovingId(productId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/account/wishlist/${productId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to remove product."
        );
      }

      setItems((currentItems) =>
        currentItems.filter(
          (item) => item.productId !== productId
        )
      );

      setSuccess(
        data.message ||
          "Product removed from wishlist."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove this product."
      );
    } finally {
      setRemovingId(null);
    }
  }

  function formatPrice(price: string) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(price));
  }

  function calculateDiscount(
    price: string,
    compareAtPrice: string | null
  ) {
    if (!compareAtPrice) {
      return null;
    }

    const current = Number(price);
    const original = Number(compareAtPrice);

    if (
      original <= current ||
      original <= 0
    ) {
      return null;
    }

    return Math.round(
      ((original - current) / original) * 100
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-gray-900">

      {/* ================================================== */}
      {/* TOP UTILITY BAR */}
      {/* ================================================== */}

      <div className="hidden bg-[#111111] text-gray-300 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6 lg:px-8">

          <div className="flex items-center gap-6">
            <span>Welcome to Marketplace</span>

            <Link
              href="/contact"
              className="transition hover:text-white"
            >
              Need Help?
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/account/orders"
              className="transition hover:text-white"
            >
              Track Order
            </Link>

            <Link
              href="/seller/apply"
              className="transition hover:text-orange-400"
            >
              Sell on Marketplace
            </Link>
          </div>

        </div>
      </div>

      {/* ================================================== */}
      {/* MAIN HEADER */}
      {/* ================================================== */}

      <header className="sticky top-0 z-40 border-b border-orange-700 bg-orange-500 shadow-md">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex h-20 items-center gap-4">

            <Link
              href="/"
              className="shrink-0 text-xl font-black tracking-tight text-white sm:text-2xl"
            >
              MARKETPLACE
            </Link>

            <div className="hidden flex-1 md:block">

              <form
                action="/"
                method="GET"
                className="mx-auto flex max-w-2xl overflow-hidden rounded-lg bg-white shadow-sm"
              >

                <input
                  type="search"
                  name="search"
                  placeholder="Search products, brands and categories..."
                  className="min-w-0 flex-1 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />

                <button
                  type="submit"
                  className="bg-[#111111] px-7 text-sm font-bold text-white transition hover:bg-gray-800"
                >
                  Search
                </button>

              </form>

            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">

              <Link
                href="/account"
                className="hidden rounded-lg bg-orange-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-orange-800 sm:block"
              >
                My Account
              </Link>

              <Link
                href="/account/orders"
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 lg:block"
              >
                Orders
              </Link>

              <Link
                href="/cart"
                className="rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-orange-500 transition hover:bg-gray-100"
              >
                Cart
              </Link>

            </div>

          </div>

          <div className="pb-4 md:hidden">

            <form
              action="/"
              method="GET"
              className="flex overflow-hidden rounded-lg bg-white"
            >

              <input
                type="search"
                name="search"
                placeholder="Search Marketplace..."
                className="min-w-0 flex-1 px-4 py-3 text-sm text-gray-900 outline-none"
              />

              <button
                type="submit"
                className="bg-[#111111] px-5 text-sm font-bold text-white"
              >
                Search
              </button>

            </form>

          </div>

        </div>

      </header>

      {/* ================================================== */}
      {/* NAVIGATION */}
      {/* ================================================== */}

      <nav className="border-b border-orange-700 bg-orange-600 text-white">

        <div className="mx-auto flex max-w-7xl items-center overflow-x-auto px-4 sm:px-6 lg:px-8">

          <NavLink
            href="/"
            label="Home"
          />

          <NavLink
            href="/categories"
            label="Categories"
          />

          <NavLink
            href="/deals"
            label="Deals"
          />

          <NavLink
            href="/flash-sales"
            label="Flash Sales"
          />

          <NavLink
            href="/new-arrivals"
            label="New Arrivals"
          />

          <NavLink
            href="/top-selling"
            label="Top Selling"
          />

          <Link
            href="/seller/apply"
            className="ml-auto whitespace-nowrap border-b-2 border-transparent px-4 py-4 text-sm font-bold text-white transition hover:border-white hover:bg-orange-700"
          >
            Sell on Marketplace
          </Link>

        </div>

      </nav>

      {/* ================================================== */}
      {/* ACCOUNT HERO */}
      {/* ================================================== */}

      <section className="bg-[#151515]">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="mb-7 flex flex-wrap items-center gap-2 text-sm">

            <Link
              href="/"
              className="text-gray-400 transition hover:text-white"
            >
              Home
            </Link>

            <span className="text-gray-600">
              /
            </span>

            <Link
              href="/account"
              className="text-gray-400 transition hover:text-white"
            >
              My Account
            </Link>

            <span className="text-gray-600">
              /
            </span>

            <span className="font-medium text-orange-400">
              Wishlist
            </span>

          </div>

          <div>

            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              Marketplace Account
            </p>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              My Wishlist
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
              Save products you love and come back to
              them whenever you are ready to shop.
            </p>

          </div>

        </div>

      </section>

      {/* ================================================== */}
      {/* ACCOUNT CONTENT */}
      {/* ================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">

          {/* ================================================== */}
          {/* ACCOUNT SIDEBAR */}
          {/* ================================================== */}

          <aside className="h-fit overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="bg-[#151515] p-6">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-500 text-2xl font-black text-white">
                  ♡
                </div>

                <div className="min-w-0">

                  <p className="truncate font-bold text-white">
                    My Account
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-400">
                    Manage your Marketplace account
                  </p>

                </div>

              </div>

            </div>

            <nav className="p-3">

              <AccountNavLink
                href="/account"
                label="Account Overview"
                icon="▦"
              />

              <AccountNavLink
                href="/account/orders"
                label="My Orders"
                icon="▤"
              />

              <AccountNavLink
                href="/account/profile"
                label="My Profile"
                icon="◉"
              />

              <AccountNavLink
                href="/account/addresses"
                label="My Addresses"
                icon="⌖"
              />

              <AccountNavLink
                href="/account/wishlist"
                label="Wishlist"
                icon="♡"
                active
              />

              <AccountNavLink
                href="/cart"
                label="Shopping Cart"
                icon="▢"
              />

              <div className="my-3 border-t border-gray-100" />

              <AccountNavLink
                href="/account/security"
                label="Security"
                icon="◇"
              />

              <AccountNavLink
                href="/contact"
                label="Help & Support"
                icon="?"
              />

            </nav>

          </aside>

          {/* ================================================== */}
          {/* WISHLIST CONTENT */}
          {/* ================================================== */}

          <div className="min-w-0">

            {/* Heading */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                  Saved Products
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950">
                  My Wishlist
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {items.length}{" "}
                  {items.length === 1
                    ? "product"
                    : "products"}{" "}
                  saved
                </p>

              </div>

              <Link
                href="/"
                className="inline-flex w-fit rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:border-orange-500 hover:text-orange-500"
              >
                Continue Shopping
              </Link>

            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm font-medium text-green-700">
                {success}
              </div>
            )}

            {/* Loading */}
            {loading ? (

              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">

                <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

                <p className="text-sm font-medium text-gray-500">
                  Loading your wishlist...
                </p>

              </div>

            ) : items.length === 0 ? (

              /* ================================================== */
              /* EMPTY WISHLIST */
              /* ================================================== */

              <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl text-orange-500">
                  ♡
                </div>

                <h3 className="mt-6 text-2xl font-black text-gray-950">
                  Your wishlist is empty
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                  Save products you love to your wishlist
                  and they will appear here.
                </p>

                <Link
                  href="/"
                  className="mt-7 inline-flex rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  Start Shopping
                </Link>

              </div>

            ) : (

              /* ================================================== */
              /* WISHLIST PRODUCTS */
              /* ================================================== */

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                {items.map((item) => {

                  const product = item.product;

                  const discount =
                    calculateDiscount(
                      product.price,
                      product.compareAtPrice
                    );

                  const outOfStock =
                    product.stockQuantity <= 0;

                  return (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
                    >

                      {/* PRODUCT IMAGE */}

                      <Link
                        href={`/product/${product.slug}`}
                        className="relative block aspect-square overflow-hidden bg-gray-100"
                      >

                        {product.image ? (

                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                          />

                        ) : (

                          <div className="flex h-full items-center justify-center text-sm font-medium text-gray-400">
                            No image available
                          </div>

                        )}

                        {discount && (
                          <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-1 text-xs font-black text-white">
                            -{discount}%
                          </span>
                        )}

                        {product.isFlashSale && (
                          <span className="absolute right-3 top-3 rounded-md bg-orange-500 px-2 py-1 text-xs font-black text-white">
                            FLASH SALE
                          </span>
                        )}

                      </Link>

                      {/* PRODUCT CONTENT */}

                      <div className="p-5">

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          {product.category.name}
                        </p>

                        <Link
                          href={`/product/${product.slug}`}
                          className="mt-2 block"
                        >

                          <h3 className="line-clamp-2 text-base font-bold text-gray-950 transition hover:text-orange-500">
                            {product.name}
                          </h3>

                        </Link>

                        {product.brand && (
                          <p className="mt-2 text-xs font-medium text-gray-500">
                            {product.brand.name}
                          </p>
                        )}

                        {/* PRICE */}

                        <div className="mt-4 flex items-end gap-2">

                          <span className="text-xl font-black text-orange-600">
                            {formatPrice(
                              product.price
                            )}
                          </span>

                          {product.compareAtPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(
                                product.compareAtPrice
                              )}
                            </span>
                          )}

                        </div>

                        {/* SELLER */}

                        <p className="mt-2 text-xs text-gray-500">
                          Seller:{" "}

                          <span className="font-semibold text-gray-700">
                            {product.seller.storeName}
                          </span>
                        </p>

                        {/* STOCK / CART */}

                        <div className="mt-4">

                          {outOfStock ? (

                            <div className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs font-bold text-red-600">
                              Out of Stock
                            </div>

                          ) : (

                            <button
                              type="button"
                              onClick={() => {
                                setSuccess(
                                  "Add to Cart will be connected next."
                                );
                              }}
                              className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                            >
                              Add to Cart
                            </button>

                          )}

                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(
                              product.id
                            )
                          }
                          disabled={
                            removingId === product.id
                          }
                          className="mt-3 w-full rounded-lg border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {removingId === product.id
                            ? "Removing..."
                            : "Remove from Wishlist"}

                        </button>

                      </div>

                    </article>
                  );
                })}

              </div>

            )}

          </div>

        </div>

      </section>

      {/* ================================================== */}
      {/* FOOTER */}
      {/* ================================================== */}

      <footer className="bg-[#111111] text-gray-300">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

            {/* BRAND */}

            <div>

              <Link
                href="/"
                className="text-2xl font-black tracking-tight text-white"
              >
                MARKETPLACE
              </Link>

              <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
                Your trusted online marketplace for quality products
                from verified sellers.
              </p>

              <Link
                href="/seller/apply"
                className="mt-5 inline-flex rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-bold text-white transition hover:border-orange-500 hover:text-orange-400"
              >
                Become a Seller
              </Link>

            </div>

            {/* CUSTOMER SERVICE */}

            <FooterColumn
              title="Customer Service"
              links={[
                ["Help Center", "/help"],
                ["Contact Us", "/contact"],
                ["Track Order", "/account/orders"],
                ["Returns & Refunds", "/returns"],
              ]}
            />

            {/* MARKETPLACE */}

            <FooterColumn
              title="Marketplace"
              links={[
                ["Home", "/"],
                ["Categories", "/categories"],
                ["Deals", "/deals"],
                ["New Arrivals", "/new-arrivals"],
                ["Top Selling", "/top-selling"],
                ["Flash Sales", "/flash-sales"],
              ]}
            />

            {/* SHOP & SELL */}

            <FooterColumn
              title="Shop & Sell"
              links={[
                ["Shopping Cart", "/cart"],
                ["My Orders", "/account/orders"],
                ["Become a Seller", "/seller/apply"],
                ["Seller Center", "/seller"],
                ["Seller Policies", "/seller/policies"],
                ["Seller Support", "/seller/support"],
              ]}
            />

          </div>

          <div className="mt-10 border-t border-gray-800 pt-6">

            <div className="flex flex-col gap-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">

              <p>
                © {new Date().getFullYear()} Marketplace. All rights
                reserved.
              </p>

              <div className="flex flex-wrap gap-x-5 gap-y-2">

                <Link
                  href="/privacy"
                  className="transition hover:text-gray-300"
                >
                  Privacy Policy
                </Link>

                <Link
                  href="/terms"
                  className="transition hover:text-gray-300"
                >
                  Terms & Conditions
                </Link>

                <Link
                  href="/cookies"
                  className="transition hover:text-gray-300"
                >
                  Cookie Policy
                </Link>

              </div>

            </div>

          </div>

        </div>

      </footer>

    </main>
  );
}

/* ========================================================= */
/* NAVIGATION */
/* ========================================================= */

function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap border-b-2 border-transparent px-4 py-4 text-sm font-semibold text-white transition hover:border-white hover:bg-orange-700"
    >
      {label}
    </Link>
  );
}

/* ========================================================= */
/* ACCOUNT SIDEBAR */
/* ========================================================= */

function AccountNavLink({
  href,
  label,
  icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
        active
          ? "bg-orange-50 font-bold text-orange-500"
          : "font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-500"
      }`}
    >

      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
          active
            ? "bg-orange-500 text-white"
            : "bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-500"
        }`}
      >
        {icon}
      </span>

      <span className="flex-1">
        {label}
      </span>

      <span
        className={`text-lg ${
          active
            ? "text-orange-500"
            : "text-gray-300 group-hover:text-orange-500"
        }`}
      >
        ›
      </span>

    </Link>
  );
}

/* ========================================================= */
/* FOOTER COLUMN */
/* ========================================================= */

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>

      <h3 className="font-bold text-white">
        {title}
      </h3>

      <ul className="mt-4 space-y-3 text-sm">

        {links.map(([label, href]) => (
          <li key={href}>

            <Link
              href={href}
              className="transition hover:text-orange-400"
            >
              {label}
            </Link>

          </li>
        ))}

      </ul>

    </div>
  );
}
