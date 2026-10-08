"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  {
    name: "Phones & Tablets",
    slug: "phones-tablets",
    icon: "📱",
    description: "Smartphones, tablets, accessories and more",
  },
  {
    name: "Appliances",
    slug: "appliances",
    icon: "🔌",
    description: "Home appliances and electrical products",
  },
  {
    name: "Electronics",
    slug: "electronics",
    icon: "💻",
    description: "Gadgets, devices and electronic accessories",
  },
  {
    name: "Health & Beauty",
    slug: "health-beauty",
    icon: "🧴",
    description: "Beauty, skincare, personal care and health",
  },
  {
    name: "Home & Office",
    slug: "home-office",
    icon: "🏠",
    description: "Furniture, home items and office essentials",
  },
  {
    name: "Fashion",
    slug: "fashion",
    icon: "👕",
    description: "Clothing, shoes, bags and fashion accessories",
  },
  {
    name: "Supermarket",
    slug: "supermarket",
    icon: "🛒",
    description: "Groceries, food, drinks and everyday essentials",
  },
  {
    name: "Computing",
    slug: "computing",
    icon: "🖥️",
    description: "Laptops, computers, monitors and accessories",
  },
  {
    name: "Baby Products",
    slug: "baby-products",
    icon: "🍼",
    description: "Baby clothing, feeding, toys and essentials",
  },
  {
    name: "Gaming",
    slug: "gaming",
    icon: "🎮",
    description: "Gaming consoles, games and gaming accessories",
  },
  {
    name: "Sports & Fitness",
    slug: "sports-fitness",
    icon: "⚽",
    description: "Sports equipment, fitness gear and accessories",
  },
  {
    name: "Other Categories",
    slug: "other-categories",
    icon: "•••",
    description: "Discover more products and marketplace categories",
  },
];

export default function CategoryPage() {
  const [search, setSearch] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* TOP BAR */}
      <div className="hidden bg-gray-900 text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">
          <span>Welcome to Marketplace</span>

          <div className="flex items-center gap-5">
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
              onChange={(event) => setSearch(event.target.value)}
              type="search"
              placeholder="Search categories"
              className="w-full rounded-l-md bg-white px-4 py-3 text-sm text-gray-900 outline-none"
            />

            <button
              type="button"
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
              onChange={(event) => setSearch(event.target.value)}
              type="search"
              placeholder="Search categories"
              className="w-full rounded-l-md bg-white px-3 py-2.5 text-sm text-gray-900 outline-none"
            />

            <button
              type="button"
              className="rounded-r-md bg-gray-900 px-4 text-sm font-semibold"
            >
              Search
            </button>
          </div>
        </div>

        {/* CATEGORY NAV */}
        <nav className="bg-orange-700">
          <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-4 py-3 text-sm font-medium">
            <Link
              href="/category"
              className="whitespace-nowrap font-bold text-orange-200"
            >
              ☰ Categories
            </Link>

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

            <Link
              href="/seller/apply"
              className="whitespace-nowrap hover:text-orange-200"
            >
              Sell on Marketplace
            </Link>
          </div>
        </nav>
      </header>

      {/* PAGE CONTENT */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* BREADCRUMB */}
        <div className="mb-5 text-sm text-gray-500">
          <Link
            href="/"
            className="hover:text-orange-600"
          >
            Home
          </Link>

          <span className="mx-2">/</span>

          <span className="font-semibold text-gray-900">
            Categories
          </span>
        </div>

        {/* HERO */}
        <section className="overflow-hidden rounded-xl bg-gray-950 p-7 text-white shadow-sm md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
            Marketplace
          </p>

          <h1 className="mt-3 text-3xl font-black md:text-5xl">
            Shop by Category
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300 md:text-base">
            Explore our marketplace categories and find the products
            you need from trusted sellers.
          </p>
        </section>

        {/* CATEGORY SEARCH */}
        <section className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black">
                All Categories
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Browse products by category
              </p>
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find a category..."
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 md:w-80"
            />
          </div>
        </section>

        {/* CATEGORY GRID */}
        <section className="mt-6">
          {filteredCategories.length === 0 ? (
            <div className="rounded-xl bg-white p-12 text-center shadow-sm">
              <div className="text-5xl">🔎</div>

              <h2 className="mt-4 text-xl font-bold">
                No category found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Try searching for another category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filteredCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="group rounded-xl bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl transition group-hover:bg-orange-100">
                    {category.icon}
                  </div>

                  <h3 className="mt-5 text-base font-black text-gray-900 transition group-hover:text-orange-600">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    {category.description}
                  </p>

                  <div className="mt-4 text-sm font-bold text-orange-600">
                    Shop now →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* BACK HOME */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex rounded-md bg-orange-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
          >
            ← Back to Marketplace
          </Link>
        </div>
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
                className="block font-semibold text-orange-400 transition hover:text-orange-300"
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
    </main>
  );
}