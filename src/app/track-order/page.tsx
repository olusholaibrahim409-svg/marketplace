
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "REFUNDED";

const statusSteps = [
  {
    key: "CONFIRMED",
    title: "Order Confirmed",
    description: "Your order has been confirmed.",
    icon: "✓",
  },
  {
    key: "PROCESSING",
    title: "Processing",
    description: "The seller is preparing your order.",
    icon: "📦",
  },
  {
    key: "SHIPPED",
    title: "Shipped",
    description: "Your order has left the seller.",
    icon: "🚚",
  },
  {
    key: "OUT_FOR_DELIVERY",
    title: "Out for Delivery",
    description: "Your order is on its way to you.",
    icon: "🛵",
  },
  {
    key: "DELIVERED",
    title: "Delivered",
    description: "Your order has been delivered.",
    icon: "🏠",
  },
];

function getStatusIndex(status: OrderStatus) {
  const index = statusSteps.findIndex((step) => step.key === status);

  if (index >= 0) {
    return index;
  }

  if (status === "PENDING") {
    return -1;
  }

  if (status === "CANCELLED" || status === "RETURNED" || status === "REFUNDED") {
    return -1;
  }

  return 0;
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [searchedOrder, setSearchedOrder] = useState("");
  const [status, setStatus] = useState<OrderStatus | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = orderNumber.trim();

    if (!trimmed) {
      return;
    }

    /*
     * This is currently a frontend tracking demonstration.
     *
     * Later we can replace this section with a real API call:
     *
     * fetch(`/api/orders/track?orderNumber=${encodeURIComponent(trimmed)}`)
     *
     * and display the actual order status from your database.
     */
    setSearchedOrder(trimmed);
    setStatus("SHIPPED");
  }

  const currentStep = status ? getStatusIndex(status) : -1;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Utility bar */}
      <div className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-slate-300">
          <div>Welcome to Marketplace</div>

          <div className="hidden items-center gap-5 sm:flex">
            <Link
              href="/seller"
              className="transition hover:text-orange-400"
            >
              Sell on Marketplace
            </Link>

            <Link
              href="/help"
              className="transition hover:text-orange-400"
            >
              Help Center
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-orange-400"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-orange-600 shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
          <Link
            href="/"
            className="shrink-0 text-2xl font-black tracking-tight text-white"
          >
            MARKETPLACE
          </Link>

          <form
            action="/"
            className="hidden flex-1 md:block"
          >
            <div className="flex overflow-hidden rounded-md bg-white">
              <input
                name="search"
                type="text"
                placeholder="Search products, brands and categories..."
                className="w-full px-4 py-3 text-sm text-slate-800 outline-none"
              />

              <button
                type="submit"
                className="bg-slate-900 px-7 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Search
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-4 text-sm font-medium">
            <Link
              href="/account"
              className="hidden text-white transition hover:text-orange-100 sm:block"
            >
              Account
            </Link>

            <Link
              href="/account/orders"
              className="hidden text-white transition hover:text-orange-100 sm:block"
            >
              Orders
            </Link>

            <Link
              href="/cart"
              className="text-white transition hover:text-orange-100"
            >
              🛒 Cart
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <div className="border-t border-orange-500 px-4 py-3 md:hidden">
          <form action="/">
            <div className="flex overflow-hidden rounded-md bg-white">
              <input
                name="search"
                type="text"
                placeholder="Search products..."
                className="w-full px-3 py-2.5 text-sm text-slate-800 outline-none"
              />

              <button
                type="submit"
                className="bg-slate-900 px-5 text-sm font-semibold text-white"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-orange-500 bg-orange-700">
        <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-4 py-3 text-sm font-medium whitespace-nowrap">
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

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-24">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
              Delivery tracking
            </p>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Track Your Order
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Enter your Marketplace order number to check the latest delivery
              status of your purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="border-b border-white/10 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-4 text-sm">
          <Link
            href="/"
            className="text-slate-400 transition hover:text-orange-400"
          >
            Home
          </Link>

          <span className="mx-2 text-slate-600">/</span>

          <span className="text-white">Track Order</span>
        </div>
      </div>

      {/* Tracking section */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:py-16">
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-3xl">
              📦
            </div>

            <h2 className="mt-5 text-2xl font-black sm:text-3xl">
              Where is my order?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Enter the order number you received after completing your
              purchase.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row"
            >
              <input
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                type="text"
                placeholder="Enter your order number"
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500"
              />

              <button
                type="submit"
                className="rounded-lg bg-orange-500 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-orange-400"
              >
                Track Order
              </button>
            </form>

            <p className="mt-4 text-xs text-slate-500">
              Example: ORD-1790762030383-2302
            </p>
          </div>
        </div>
      </section>

      {/* Tracking result */}
      {searchedOrder && status && (
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
            {/* Result header */}
            <div className="border-b border-white/10 bg-slate-800/60 p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Order Number
                  </p>

                  <p className="mt-1 break-all text-lg font-black">
                    {searchedOrder}
                  </p>
                </div>

                <div className="rounded-full bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-400">
                  {formatStatus(status)}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-black">
                Delivery Progress
              </h2>

              <div className="mt-8">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;

                  return (
                    <div
                      key={step.key}
                      className="relative flex gap-4"
                    >
                      {/* Connector */}
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`absolute left-5 top-12 h-full w-0.5 ${
                            index < currentStep
                              ? "bg-orange-500"
                              : "bg-slate-700"
                          }`}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm ${
                          isCompleted
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-slate-700 bg-slate-950 text-slate-500"
                        }`}
                      >
                        {isCompleted ? "✓" : step.icon}
                      </div>

                      {/* Text */}
                      <div
                        className={`pb-9 ${
                          index === statusSteps.length - 1
                            ? "pb-0"
                            : ""
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`font-bold ${
                              isCompleted
                                ? "text-white"
                                : "text-slate-500"
                            }`}
                          >
                            {step.title}
                          </h3>

                          {isCurrent && (
                            <span className="rounded-full bg-orange-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-400">
                              Current
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current status */}
            <div className="border-t border-white/10 bg-orange-500/5 p-6 sm:p-8">
              <div className="flex gap-4">
                <div className="text-2xl">🚚</div>

                <div>
                  <h3 className="font-bold">
                    Your order is on its way
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Your order has been shipped and is currently moving through
                    the delivery process. Delivery timing can vary depending
                    on your location and the selected delivery service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Helpful information */}
      <section className="border-y border-white/10 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              Need help?
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Order support
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Link
              href="/account/orders"
              className="rounded-xl border border-white/10 bg-slate-950 p-6 transition hover:border-orange-500/40"
            >
              <div className="text-2xl">🛍️</div>

              <h3 className="mt-4 font-bold">My Orders</h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                View your complete order history and payment information.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-orange-400">
                View orders →
              </span>
            </Link>

            <Link
              href="/returns"
              className="rounded-xl border border-white/10 bg-slate-950 p-6 transition hover:border-orange-500/40"
            >
              <div className="text-2xl">↩️</div>

              <h3 className="mt-4 font-bold">Returns & Refunds</h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Learn how to request a return or refund for an eligible order.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-orange-400">
                Learn more →
              </span>
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-white/10 bg-slate-950 p-6 transition hover:border-orange-500/40"
            >
              <div className="text-2xl">💬</div>

              <h3 className="mt-4 font-bold">Contact Support</h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Still need help? Send our customer support team a message.
              </p>

              <span className="mt-4 inline-block text-sm font-semibold text-orange-400">
                Contact us →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Shopping CTA */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 p-8 sm:p-10">
            <div className="flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-100">
                  Marketplace
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Continue shopping
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-orange-50">
                  Discover new arrivals, flash sales, deals and products from
                  trusted Marketplace sellers.
                </p>
              </div>

              <Link
                href="/"
                className="shrink-0 rounded-lg bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-slate-900"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Link
                href="/"
                className="text-2xl font-black tracking-tight"
              >
                MARKETPLACE
              </Link>

              <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
                Your trusted online marketplace for quality products, trusted
                sellers and convenient shopping.
              </p>

              <div className="mt-5 flex gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-sm">
                  f
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-sm">
                  X
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-sm">
                  ◎
                </span>
              </div>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-bold">Customer Service</h3>

              <div className="mt-4 space-y-3 text-sm text-slate-400">
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

            {/* Marketplace */}
            <div>
              <h3 className="font-bold">Marketplace</h3>

              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <Link
                  href="/"
                  className="block transition hover:text-orange-400"
                >
                  Home
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

            {/* Shop & Sell */}
            <div>
              <h3 className="font-bold">Shop & Sell</h3>

              <div className="mt-4 space-y-3 text-sm text-slate-400">
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

                <Link
                  href="/seller"
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

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
            <p>
              © {new Date().getFullYear()} Marketplace. All rights reserved.
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
    </main>
  );
}
