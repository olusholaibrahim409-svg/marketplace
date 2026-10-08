import Link from "next/link";

const helpTopics = [
{
icon: "📦",
title: "Orders & Delivery",
description:
"Get help with placing orders, tracking deliveries, delivery times and order updates.",
links: [
{ label: "Track an Order", href: "/track-order" },
{ label: "My Orders", href: "/account/orders" },
],
},
{
icon: "💳",
title: "Payments",
description:
"Learn about available payment methods, payment issues and transaction information.",
links: [
{ label: "Payment Methods", href: "/account/payment-methods" },
{ label: "Contact Support", href: "/contact" },
],
},
{
icon: "↩️",
title: "Returns & Refunds",
description:
"Find information about returning products, refunds and resolving order issues.",
links: [
{ label: "Returns & Refunds", href: "/returns" },
{ label: "My Orders", href: "/account/orders" },
],
},
{
icon: "👤",
title: "Account",
description:
"Manage your profile, addresses, wishlist, security and other account settings.",
links: [
{ label: "My Account", href: "/account" },
{ label: "My Profile", href: "/account/profile" },
],
},
{
icon: "🛒",
title: "Shopping",
description:
"Get help finding products, using your cart and discovering marketplace deals.",
links: [
{ label: "Shopping Cart", href: "/cart" },
{ label: "Browse Deals", href: "/deals" },
],
},
{
icon: "🏪",
title: "Selling on Marketplace",
description:
"Learn about becoming a seller, managing products and running your store.",
links: [
{ label: "Seller Center", href: "/seller" },
{ label: "Become a Seller", href: "/seller" },
],
},
];

const popularQuestions = [
"How do I track my order?",
"How can I return a product?",
"What payment methods are available?",
"How do I update my delivery address?",
"How do I reset my password?",
"How can I become a seller?",
];

export default function HelpPage() {
return ( <main className="min-h-screen bg-[#f5f5f5] text-gray-900">
{/* ========================================================= */}
{/* TOP UTILITY BAR */}
{/* ========================================================= */} <div className="bg-[#1f1f1f] text-gray-300"> <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6 lg:px-8"> <p>Welcome to Marketplace</p>


      <div className="hidden items-center gap-5 sm:flex">
        <Link
          href="/seller"
          className="transition hover:text-white"
        >
          Sell on Marketplace
        </Link>

        <Link
          href="/help"
          className="text-white"
        >
          Help Center
        </Link>

        <Link
          href="/track-order"
          className="transition hover:text-white"
        >
          Track Order
        </Link>
      </div>
    </div>
  </div>

  {/* ========================================================= */}
  {/* MAIN HEADER */}
  {/* ========================================================= */}
  <header className="sticky top-0 z-50 bg-orange-500 shadow-md">
    <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="shrink-0 text-lg font-black tracking-tight text-white sm:text-2xl"
      >
        MARKETPLACE
      </Link>

      {/* Desktop search */}
      <form
        action="/"
        method="GET"
        className="mx-auto hidden w-full max-w-2xl md:flex"
      >
        <input
          type="search"
          name="search"
          placeholder="Search products, brands and categories..."
          className="w-full rounded-l-lg border-0 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-orange-300"
        />

        <button
          type="submit"
          className="rounded-r-lg bg-[#222] px-6 py-3 text-sm font-bold text-white transition hover:bg-black"
        >
          Search
        </button>
      </form>

      {/* Header actions */}
      <div className="ml-auto flex items-center gap-2 text-white sm:gap-4">
        <Link
          href="/account"
          className="hidden rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-orange-600 sm:block"
        >
          Account
        </Link>

        <Link
          href="/account/orders"
          className="hidden rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-orange-600 sm:block"
        >
          Orders
        </Link>

        <Link
          href="/cart"
          className="rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-orange-600"
        >
          🛒 <span className="hidden sm:inline">Cart</span>
        </Link>
      </div>
    </div>

    {/* Mobile search */}
    <div className="px-4 pb-3 md:hidden">
      <form action="/" method="GET" className="flex">
        <input
          type="search"
          name="search"
          placeholder="Search products..."
          className="min-w-0 flex-1 rounded-l-lg border-0 bg-white px-4 py-3 text-sm text-gray-900 outline-none"
        />

        <button
          type="submit"
          className="rounded-r-lg bg-[#222] px-4 text-sm font-bold text-white"
        >
          Search
        </button>
      </form>
    </div>
  </header>

  {/* ========================================================= */}
  {/* NAVIGATION */}
  {/* ========================================================= */}
  <nav className="bg-orange-700 text-white">
    <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-4 py-3 text-sm font-medium sm:px-6 lg:px-8">
      <Link
        href="/"
        className="whitespace-nowrap transition hover:text-orange-200"
      >
        ☰ Categories
      </Link>

      <Link
        href="/flash-sales"
        className="whitespace-nowrap transition hover:text-orange-200"
      >
        Flash Sales
      </Link>

      <Link
        href="/official-stores"
        className="whitespace-nowrap transition hover:text-orange-200"
      >
        Official Stores
      </Link>

      <Link
        href="/deals"
        className="whitespace-nowrap transition hover:text-orange-200"
      >
        Deals
      </Link>

      <Link
        href="/new-arrivals"
        className="whitespace-nowrap transition hover:text-orange-200"
      >
        New Arrivals
      </Link>

      <Link
        href="/top-selling"
        className="whitespace-nowrap transition hover:text-orange-200"
      >
        Top Selling
      </Link>

      <Link
        href="/seller"
        className="whitespace-nowrap transition hover:text-orange-200"
      >
        Sell on Marketplace
      </Link>
    </div>
  </nav>

  {/* ========================================================= */}
  {/* HERO */}
  {/* ========================================================= */}
  <section className="relative overflow-hidden bg-[#101010]">
    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-orange-950/50" />

    <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
          Customer Support
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
          How can we help?
        </h1>

        <p className="mt-4 text-sm leading-7 text-gray-300 sm:text-base">
          Find answers, manage your orders and get the support you need
          while shopping on Marketplace.
        </p>

        {/* Help search */}
        <form
          action="/help"
          method="GET"
          className="mx-auto mt-8 flex max-w-2xl"
        >
          <input
            type="search"
            name="q"
            placeholder="Search for help..."
            className="min-w-0 flex-1 rounded-l-xl border-0 bg-white px-5 py-4 text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />

          <button
            type="submit"
            className="rounded-r-xl bg-orange-500 px-6 py-4 text-sm font-bold text-white transition hover:bg-orange-600 sm:px-8"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  </section>

  {/* ========================================================= */}
  {/* BREADCRUMB */}
  {/* ========================================================= */}
  <div className="border-b border-gray-200 bg-white">
    <div className="mx-auto max-w-7xl px-4 py-4 text-sm sm:px-6 lg:px-8">
      <Link
        href="/"
        className="text-gray-500 transition hover:text-orange-500"
      >
        Home
      </Link>

      <span className="mx-2 text-gray-400">/</span>

      <span className="font-semibold text-gray-900">
        Help Center
      </span>
    </div>
  </div>

  {/* ========================================================= */}
  {/* HELP TOPICS */}
  {/* ========================================================= */}
  <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div className="mb-7">
      <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
        Support
      </p>

      <h2 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
        What do you need help with?
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Choose a topic below to find the information you need.
      </p>
    </div>

    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {helpTopics.map((topic) => (
        <div
          key={topic.title}
          className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              {topic.icon}
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Help
            </span>
          </div>

          <h3 className="mt-5 text-lg font-black text-gray-900">
            {topic.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {topic.description}
          </p>

          <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
            {topic.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm font-bold text-orange-500 transition hover:text-orange-600"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* ========================================================= */}
    {/* POPULAR QUESTIONS */}
    {/* ========================================================= */}
    <div className="mt-12 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          Frequently Asked Questions
        </p>

        <h2 className="mt-1 text-2xl font-black text-gray-900">
          Popular questions
        </h2>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {popularQuestions.map((question) => (
          <button
            key={question}
            type="button"
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-left text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
          >
            <span>{question}</span>

            <span className="ml-4 text-gray-400">+</span>
          </button>
        ))}
      </div>
    </div>

    {/* ========================================================= */}
    {/* CONTACT SUPPORT */}
    {/* ========================================================= */}
    <section className="mt-10 overflow-hidden rounded-2xl bg-[#151515]">
      <div className="flex flex-col justify-between gap-7 p-7 sm:p-10 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
            Still need help?
          </p>

          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            Our support team is here for you.
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
            If you cannot find the answer you are looking for, contact our
            support team and we will help you with your marketplace
            experience.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Contact Us
          </Link>

          <Link
            href="/track-order"
            className="rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
          >
            Track Order
          </Link>
        </div>
      </div>
    </section>
  </section>

  {/* ========================================================= */}
  {/* FOOTER */}
  {/* ========================================================= */}
  <footer className="border-t border-gray-800 bg-[#171717] text-gray-300">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="text-xl font-black tracking-wide text-white"
          >
            MARKETPLACE
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
            Your trusted online marketplace for quality products, trusted
            sellers and convenient shopping.
          </p>

          <div className="mt-5 flex gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm">
              f
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm">
              X
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm">
              ◎
            </span>
          </div>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="font-bold text-white">
            Customer Service
          </h3>

          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link
                href="/help"
                className="text-orange-400"
              >
                Help Center
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                className="transition hover:text-orange-400"
              >
                Contact Us
              </Link>
            </li>

            <li>
              <Link
                href="/track-order"
                className="transition hover:text-orange-400"
              >
                Track Order
              </Link>
            </li>

            <li>
              <Link
                href="/returns"
                className="transition hover:text-orange-400"
              >
                Returns & Refunds
              </Link>
            </li>
          </ul>
        </div>

        {/* Marketplace */}
        <div>
          <h3 className="font-bold text-white">
            Marketplace
          </h3>

          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link
                href="/"
                className="transition hover:text-orange-400"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/"
                className="transition hover:text-orange-400"
              >
                Categories
              </Link>
            </li>

            <li>
              <Link
                href="/official-stores"
                className="transition hover:text-orange-400"
              >
                Official Stores
              </Link>
            </li>

            <li>
              <Link
                href="/deals"
                className="transition hover:text-orange-400"
              >
                Deals
              </Link>
            </li>

            <li>
              <Link
                href="/new-arrivals"
                className="transition hover:text-orange-400"
              >
                New Arrivals
              </Link>
            </li>

            <li>
              <Link
                href="/top-selling"
                className="transition hover:text-orange-400"
              >
                Top Selling
              </Link>
            </li>

            <li>
              <Link
                href="/flash-sales"
                className="transition hover:text-orange-400"
              >
                Flash Sales
              </Link>
            </li>
          </ul>
        </div>

        {/* Shop & Sell */}
        <div>
          <h3 className="font-bold text-white">
            Shop & Sell
          </h3>

          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link
                href="/cart"
                className="transition hover:text-orange-400"
              >
                Shopping Cart
              </Link>
            </li>

            <li>
              <Link
                href="/account/orders"
                className="transition hover:text-orange-400"
              >
                My Orders
              </Link>
            </li>

            <li>
              <Link
                href="/seller"
                className="transition hover:text-orange-400"
              >
                Become a Seller
              </Link>
            </li>

            <li>
              <Link
                href="/seller"
                className="transition hover:text-orange-400"
              >
                Seller Center
              </Link>
            </li>

            <li>
              <Link
                href="/seller/policies"
                className="transition hover:text-orange-400"
              >
                Seller Policies
              </Link>
            </li>

            <li>
              <Link
                href="/seller/support"
                className="transition hover:text-orange-400"
              >
                Seller Support
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="mt-10 flex flex-col gap-4 border-t border-gray-800 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} Marketplace. All rights reserved.
        </p>

        <div className="flex flex-wrap gap-5">
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
  </footer>
</main>

);
}
