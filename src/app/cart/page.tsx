"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CartItem = {
  productId: string;
  variantId?: string | null;
  variantName?: string | null;
  variantAttributes?: Record<string, unknown> | null;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  sellerName: string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80";

function formatPrice(value: number) {
  const naira = String.fromCharCode(0x20a6);

  return `${naira}${value.toLocaleString("en-NG")}`;
}

function getVariantOptionLabel(
  attributes?: Record<string, unknown> | null
) {
  if (!attributes) {
    return "Option";
  }

  const keys = Object.keys(attributes);

  if (keys.length === 0) {
    return "Option";
  }

  const key = keys[0];

  const labels: Record<string, string> = {
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
    version: "Version",
    length: "Length",
    weight: "Weight",
    finish: "Finish",
  };

  return (
    labels[key.toLowerCase()] ||
    key.charAt(0).toUpperCase() + key.slice(1)
  );
}

function getVariantOptionValue(
  attributes?: Record<string, unknown> | null
) {
  if (!attributes) {
    return null;
  }

  const keys = Object.keys(attributes);

  if (keys.length === 0) {
    return null;
  }

  const value = attributes[keys[0]];

  if (value === null || value === undefined) {
    return null;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return null;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("marketplace_cart") || "[]"
      );

      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch {
      setCart([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  function saveCart(updatedCart: CartItem[]) {
    setCart(updatedCart);

    localStorage.setItem(
      "marketplace_cart",
      JSON.stringify(updatedCart)
    );
  }

  function increaseQuantity(index: number) {
    const updatedCart = [...cart];

    updatedCart[index] = {
      ...updatedCart[index],
      quantity: updatedCart[index].quantity + 1,
    };

    saveCart(updatedCart);
  }

  function decreaseQuantity(index: number) {
    const updatedCart = [...cart];

    if (updatedCart[index].quantity <= 1) {
      updatedCart.splice(index, 1);
    } else {
      updatedCart[index] = {
        ...updatedCart[index],
        quantity: updatedCart[index].quantity - 1,
      };
    }

    saveCart(updatedCart);
  }

  function removeItem(index: number) {
    const updatedCart = [...cart];

    updatedCart.splice(index, 1);

    saveCart(updatedCart);
  }

  function clearCart() {
    setCart([]);

    localStorage.removeItem("marketplace_cart");
  }

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cart]);

  const deliveryFee = subtotal > 0 ? 2500 : 0;

  const total = subtotal + deliveryFee;

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const uniqueProducts = cart.length;

  if (!loaded) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-300" />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              <div className="h-32 animate-pulse rounded-xl bg-gray-300" />
              <div className="h-40 animate-pulse rounded-xl bg-gray-300" />
              <div className="h-40 animate-pulse rounded-xl bg-gray-300" />
            </div>

            <div className="h-80 animate-pulse rounded-xl bg-gray-300" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* TOP UTILITY BAR */}

      <div className="hidden bg-gray-950 text-xs text-gray-300 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <p>Welcome to Marketplace</p>

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

            {/* SEARCH */}

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

            {/* HEADER LINKS */}

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
                🛒 Cart ({totalItems})
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

      {/* PAGE HERO */}

      <section className="bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              Your Shopping Bag
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              Shopping Cart
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              Review your selected products, update quantities,
              and continue securely to checkout.
            </p>
          </div>
        </div>
      </section>

      {/* BREADCRUMB */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="font-medium text-gray-500 hover:text-orange-600"
            >
              Home
            </Link>

            <span className="text-gray-400">/</span>

            <span className="font-semibold text-gray-900">
              Cart
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        {cart.length === 0 ? (
          /* EMPTY CART */

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="bg-gradient-to-r from-orange-50 to-white px-6 py-16 text-center sm:px-10 sm:py-20">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-5xl shadow-sm">
                🛒
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                Your cart
              </p>

              <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
                Your cart is empty
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">
                You haven't added anything to your cart yet.
                Explore our marketplace and discover products
                from trusted sellers.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="rounded-lg bg-orange-600 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700"
                >
                  Start Shopping
                </Link>

                <Link
                  href="/deals"
                  className="rounded-lg border border-gray-300 px-7 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  Explore Deals
                </Link>
              </div>
            </div>

            {/* EMPTY CART BENEFITS */}

            <div className="grid border-t border-gray-100 sm:grid-cols-3">
              <div className="p-6 text-center">
                <div className="text-2xl">🔒</div>

                <h3 className="mt-3 font-bold">
                  Secure Checkout
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Safe and secure payment processing.
                </p>
              </div>

              <div className="border-t border-gray-100 p-6 text-center sm:border-l sm:border-t-0">
                <div className="text-2xl">🚚</div>

                <h3 className="mt-3 font-bold">
                  Reliable Delivery
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Get your products delivered to your door.
                </p>
              </div>

              <div className="border-t border-gray-100 p-6 text-center sm:border-l sm:border-t-0">
                <div className="text-2xl">✓</div>

                <h3 className="mt-3 font-bold">
                  Trusted Sellers
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Shop from verified marketplace sellers.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* CART SUMMARY HEADER */}

            <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Shopping Bag
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-900">
                  {totalItems}{" "}
                  {totalItems === 1 ? "item" : "items"} in your
                  cart
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {uniqueProducts}{" "}
                  {uniqueProducts === 1
                    ? "product"
                    : "different products"}{" "}
                  selected
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  Continue Shopping
                </Link>

                <button
                  type="button"
                  onClick={clearCart}
                  className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              {/* CART ITEMS */}

              <div className="space-y-4">
                {cart.map((item, index) => {
                  const optionLabel = getVariantOptionLabel(
                    item.variantAttributes
                  );

                  const optionValue =
                    getVariantOptionValue(
                      item.variantAttributes
                    );

                  return (
                    <article
                      key={`${item.productId}-${item.variantId || "default"}`}
                      className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
                    >
                      <div className="p-4 sm:p-5">
                        <div className="flex gap-4 sm:gap-5">
                          {/* IMAGE */}

                          <Link
                            href={`/product/${item.slug}`}
                            className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-36 sm:w-36"
                          >
                            <img
                              src={
                                item.image ||
                                FALLBACK_IMAGE
                              }
                              alt={item.name}
                              className="h-full w-full object-cover transition duration-300 hover:scale-105"
                              onError={(event) => {
                                event.currentTarget.src =
                                  FALLBACK_IMAGE;
                              }}
                            />
                          </Link>

                          {/* DETAILS */}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <Link
                                  href={`/product/${item.slug}`}
                                  className="line-clamp-2 text-base font-bold text-gray-900 transition hover:text-orange-600 sm:text-lg"
                                >
                                  {item.name}
                                </Link>

                                <p className="mt-1 text-xs text-gray-500">
                                  Sold by{" "}
                                  <span className="font-semibold text-gray-700">
                                    {item.sellerName}
                                  </span>
                                </p>

                                {/* SELECTED VARIANT */}

                                {item.variantId &&
                                  (item.variantName ||
                                    optionValue) && (
                                    <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-3 py-2">
                                      <span className="text-xs font-bold text-gray-500">
                                        {optionLabel}:
                                      </span>

                                      <span className="text-xs font-black text-orange-700">
                                        {optionValue ||
                                          item.variantName}
                                      </span>
                                    </div>
                                  )}
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeItem(index)
                                }
                                aria-label={`Remove ${item.name}`}
                                className="shrink-0 text-xl leading-none text-gray-400 transition hover:text-red-500"
                              >
                                ×
                              </button>
                            </div>

                            <div className="mt-3">
                              <p className="text-lg font-black text-orange-600 sm:text-xl">
                                {formatPrice(item.price)}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                Price per item
                              </p>
                            </div>

                            {/* QUANTITY */}

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                  Quantity
                                </p>

                                <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      decreaseQuantity(
                                        index
                                      )
                                    }
                                    className="flex h-9 w-9 items-center justify-center bg-gray-50 text-lg font-bold transition hover:bg-orange-50 hover:text-orange-600"
                                  >
                                    −
                                  </button>

                                  <span className="flex h-9 w-11 items-center justify-center border-x border-gray-300 text-sm font-bold">
                                    {item.quantity}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      increaseQuantity(
                                        index
                                      )
                                    }
                                    className="flex h-9 w-9 items-center justify-center bg-gray-50 text-lg font-bold transition hover:bg-orange-50 hover:text-orange-600"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                  Item Total
                                </p>

                                <p className="mt-1 text-base font-black text-gray-900">
                                  {formatPrice(
                                    item.price *
                                      item.quantity
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-3 sm:px-5">
                        <Link
                          href={`/product/${item.slug}`}
                          className="text-xs font-bold text-gray-600 transition hover:text-orange-600"
                        >
                          View Product →
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(index)
                          }
                          className="text-xs font-bold text-red-500 transition hover:text-red-700"
                        >
                          Remove Item
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* ORDER SUMMARY */}

              <aside className="h-fit lg:sticky lg:top-24">
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                  <div className="bg-gray-950 px-6 py-5 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                      Checkout
                    </p>

                    <h2 className="mt-1 text-xl font-black">
                      Order Summary
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Subtotal
                        </span>

                        <span className="font-bold text-gray-900">
                          {formatPrice(subtotal)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Delivery
                        </span>

                        <span className="font-bold text-gray-900">
                          {deliveryFee === 0
                            ? "Free"
                            : formatPrice(
                                deliveryFee
                              )}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Items
                        </span>

                        <span className="font-bold text-gray-900">
                          {totalItems}
                        </span>
                      </div>

                      <div className="border-t border-dashed border-gray-200 pt-5">
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              Total
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              Including delivery
                            </p>
                          </div>

                          <span className="text-2xl font-black text-orange-600">
                            {formatPrice(total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CHECKOUT */}

                    <Link
                      href="/checkout"
                      className="mt-6 flex w-full items-center justify-center rounded-lg bg-orange-600 px-5 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-orange-700"
                    >
                      Proceed to Checkout →
                    </Link>

                    <Link
                      href="/"
                      className="mt-3 flex w-full items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                    >
                      Continue Shopping
                    </Link>

                    {/* SECURITY */}

                    <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-4">
                      <div className="flex gap-3">
                        <div className="text-xl">
                          🔒
                        </div>

                        <div>
                          <p className="text-sm font-bold text-green-800">
                            Secure Shopping
                          </p>

                          <p className="mt-1 text-xs leading-5 text-green-700">
                            Your payment and personal
                            information are protected
                            during checkout.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* DELIVERY INFO */}

                    <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex gap-3">
                        <div className="text-xl">
                          🚚
                        </div>

                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            Delivery Available
                          </p>

                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            Delivery fee is calculated
                            based on your current cart.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PAYMENT METHODS */}

                <div className="mt-4 rounded-xl bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    We Accept
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-md bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600">
                      CARD
                    </span>

                    <span className="rounded-md bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600">
                      PAYSTACK
                    </span>

                    <span className="rounded-md bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600">
                      TRANSFER
                    </span>

                    <span className="rounded-md bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600">
                      USSD
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>

      {/* SELLER / SHOPPING PROMO */}

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
                Explore deals, new arrivals, official stores
                and top-selling products from trusted sellers.
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
            {/* BRAND */}

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

            {/* CUSTOMER SERVICE */}

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

            {/* MARKETPLACE */}

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

            {/* SHOP & SELL */}

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

          {/* FOOTER BOTTOM */}

          <div className="mt-12 flex flex-col gap-4 border-t border-gray-800 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Marketplace. All
              rights reserved.
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