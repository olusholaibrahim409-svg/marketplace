
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Top utility bar */}
      <div className="bg-slate-950 border-b border-white/10">
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
              href="/track-order"
              className="transition hover:text-orange-400"
            >
              Track Order
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
              We&apos;re here to help
            </p>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Contact Us
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Have a question about an order, payment, product, delivery,
              returns or selling on Marketplace? Our support team is ready to
              help.
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

          <span className="text-white">Contact Us</span>
        </div>
      </div>

      {/* Main contact area */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Contact information */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              Get in touch
            </p>

            <h2 className="mt-3 text-3xl font-black">
              How can we help?
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Choose the most convenient way to reach us. For order-related
              questions, having your order number available can help us assist
              you faster.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-xl">
                    📧
                  </div>

                  <div>
                    <h3 className="font-bold">Email Support</h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Send us a message and our support team will respond.
                    </p>

                    <a
                      href="mailto:support@marketplace.com"
                      className="mt-2 inline-block text-sm font-semibold text-orange-400 hover:text-orange-300"
                    >
                      support@marketplace.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-xl">
                    📞
                  </div>

                  <div>
                    <h3 className="font-bold">Customer Support</h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Speak with our customer service team about your order or
                      account.
                    </p>

                    <p className="mt-2 text-sm font-semibold text-orange-400">
                      +234 800 000 0000
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-xl">
                    💬
                  </div>

                  <div>
                    <h3 className="font-bold">Help Center</h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Find quick answers to common shopping and selling
                      questions.
                    </p>

                    <Link
                      href="/help"
                      className="mt-2 inline-block text-sm font-semibold text-orange-400 hover:text-orange-300"
                    >
                      Visit Help Center →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-black">
                Send us a message
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Fill out the form below and tell us how we can help.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-6">
                <div className="text-3xl">✓</div>

                <h3 className="mt-3 text-xl font-bold text-green-400">
                  Message received
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Thank you for contacting Marketplace. Our support team will
                  review your message and get back to you.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-5 rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your full name"
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+234..."
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="topic"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Topic
                    </label>

                    <select
                      id="topic"
                      name="topic"
                      required
                      defaultValue=""
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500"
                    >
                      <option value="" disabled>
                        Select a topic
                      </option>

                      <option value="order">
                        Order & Delivery
                      </option>

                      <option value="payment">
                        Payment
                      </option>

                      <option value="product">
                        Product Question
                      </option>

                      <option value="return">
                        Returns & Refunds
                      </option>

                      <option value="account">
                        Account
                      </option>

                      <option value="seller">
                        Selling on Marketplace
                      </option>

                      <option value="other">
                        Other
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="orderNumber"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Order Number
                    <span className="ml-2 text-xs font-normal text-slate-500">
                      Optional
                    </span>
                  </label>

                  <input
                    id="orderNumber"
                    name="orderNumber"
                    type="text"
                    placeholder="e.g. ORD-123456789"
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell us how we can help..."
                    className="w-full resize-none rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-orange-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-orange-400"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="border-y border-white/10 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              Need something else?
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Quick help
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/help"
              className="rounded-xl border border-white/10 bg-slate-950 p-5 transition hover:border-orange-500/40 hover:bg-slate-900"
            >
              <div className="text-2xl">❓</div>

              <h3 className="mt-4 font-bold">Help Center</h3>

              <p className="mt-2 text-sm text-slate-400">
                Browse answers to common questions.
              </p>
            </Link>

            <Link
              href="/track-order"
              className="rounded-xl border border-white/10 bg-slate-950 p-5 transition hover:border-orange-500/40 hover:bg-slate-900"
            >
              <div className="text-2xl">📦</div>

              <h3 className="mt-4 font-bold">Track Order</h3>

              <p className="mt-2 text-sm text-slate-400">
                Check the status of your delivery.
              </p>
            </Link>

            <Link
              href="/returns"
              className="rounded-xl border border-white/10 bg-slate-950 p-5 transition hover:border-orange-500/40 hover:bg-slate-900"
            >
              <div className="text-2xl">↩️</div>

              <h3 className="mt-4 font-bold">Returns & Refunds</h3>

              <p className="mt-2 text-sm text-slate-400">
                Learn about our return process.
              </p>
            </Link>

            <Link
              href="/account/orders"
              className="rounded-xl border border-white/10 bg-slate-950 p-5 transition hover:border-orange-500/40 hover:bg-slate-900"
            >
              <div className="text-2xl">🛍️</div>

              <h3 className="mt-4 font-bold">My Orders</h3>

              <p className="mt-2 text-sm text-slate-400">
                View your orders and order history.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 p-8 sm:p-10">
            <div className="flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-100">
                  Ready to shop?
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Discover great products today.
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-orange-50">
                  Browse thousands of products from trusted sellers across the
                  Marketplace.
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
