import Link from "next/link";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function SecurityPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      imageUrl: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const firstName = user.firstName || "";
  const lastName = user.lastName || "";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-gray-900">
      {/* Top Utility Bar */}
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
              className="transition hover:text-white"
            >
              Sell on Marketplace
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 border-b border-orange-600 bg-orange-500 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="shrink-0 text-xl font-black tracking-tight text-white sm:text-2xl"
            >
              MARKETPLACE
            </Link>

            {/* Search */}
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
                  className="bg-gray-900 px-6 text-sm font-bold text-white transition hover:bg-gray-800"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Header Links */}
            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              <Link
                href="/account"
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 sm:block"
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

          {/* Mobile Search */}
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
                className="bg-gray-900 px-5 text-sm font-bold text-white"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Orange Navigation */}
      <nav className="border-b border-orange-600 bg-orange-500">
        <div className="mx-auto flex max-w-7xl items-center gap-8 overflow-x-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="whitespace-nowrap py-4 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Home
          </Link>

          <Link
            href="/categories"
            className="whitespace-nowrap py-4 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Categories
          </Link>

          <Link
            href="/deals"
            className="whitespace-nowrap py-4 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Deals
          </Link>

          <Link
            href="/flash-sales"
            className="whitespace-nowrap py-4 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Flash Sales
          </Link>

          <Link
            href="/new-arrivals"
            className="whitespace-nowrap py-4 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            New Arrivals
          </Link>

          <Link
            href="/top-selling"
            className="whitespace-nowrap py-4 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Top Selling
          </Link>

          <Link
            href="/seller/apply"
            className="ml-auto whitespace-nowrap py-4 text-sm font-black text-white transition hover:bg-orange-600"
          >
            Sell on Marketplace
          </Link>
        </div>
      </nav>

      {/* Security Hero */}
      <section className="bg-[#151515]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-7 flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-400 transition hover:text-white"
            >
              Home
            </Link>

            <span className="text-gray-600">/</span>

            <Link
              href="/account"
              className="text-gray-400 transition hover:text-white"
            >
              My Account
            </Link>

            <span className="text-gray-600">/</span>

            <span className="font-medium text-orange-400">
              Security
            </span>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
                Account Protection
              </p>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Account Security
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
                Protect your Marketplace account and manage your
                security settings.
              </p>
            </div>

            <Link
              href="/account"
              className="inline-flex w-fit items-center rounded-lg border border-gray-700 bg-[#202020] px-5 py-3 text-sm font-bold text-white transition hover:border-orange-500 hover:bg-[#262626]"
            >
              ← Back to My Account
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Account Sidebar */}
          <aside className="h-fit overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Profile */}
            <div className="bg-[#151515] p-6">
              <div className="flex items-center gap-4">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={`${firstName} ${lastName}`}
                    className="h-14 w-14 rounded-full border-2 border-orange-500 object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-500 text-lg font-black text-white">
                    {initials}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate font-bold text-white">
                    {firstName || "Marketplace"} {lastName}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="p-3">
              <Link
                href="/account"
                className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-500"
              >
                <span>Account Overview</span>
                <span>›</span>
              </Link>

              <Link
                href="/account/orders"
                className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-500"
              >
                <span>My Orders</span>
                <span>›</span>
              </Link>

              <Link
                href="/account/profile"
                className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-500"
              >
                <span>My Profile</span>
                <span>›</span>
              </Link>

              <Link
                href="/account/addresses"
                className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-500"
              >
                <span>My Addresses</span>
                <span>›</span>
              </Link>

              <Link
                href="/account/wishlist"
                className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-500"
              >
                <span>Wishlist</span>
                <span>›</span>
              </Link>

              <Link
                href="/cart"
                className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-500"
              >
                <span>Shopping Cart</span>
                <span>›</span>
              </Link>

              <div className="my-3 border-t border-gray-100" />

              {/* Active Security */}
              <Link
                href="/account/security"
                className="flex items-center justify-between rounded-lg bg-orange-50 px-4 py-3 text-sm font-bold text-orange-500"
              >
                <span>Security</span>
                <span>›</span>
              </Link>

              <Link
                href="/contact"
                className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-500"
              >
                <span>Help & Support</span>
                <span>›</span>
              </Link>
            </nav>
          </aside>

          {/* Security Content */}
          <div className="space-y-6">
            {/* Password */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white px-6 py-6 sm:px-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-xl">
                    🔐
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-gray-900">
                      Password & Login
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Manage the password you use to access your
                      Marketplace account.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Change your password
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Enter your current password and choose a new
                      password for your account.
                    </p>
                  </div>

                  <ChangePasswordForm />
                </div>

                <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50 p-5">
                  <p className="text-sm font-bold text-orange-800">
                    Password security
                  </p>

                  <ul className="mt-3 space-y-2 text-sm leading-6 text-orange-700">
                    <li>
                      • Use a password you do not use on other websites.
                    </li>

                    <li>
                      • Avoid sharing your password with anyone.
                    </li>

                    <li>
                      • Avoid using easily guessed personal information.
                    </li>

                    <li>
                      • Be careful with suspicious links and messages.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl">
                  👤
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-black text-gray-900">
                    Account Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Information associated with your Marketplace
                    account.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Email Address
                  </p>

                  <p className="mt-2 break-all font-semibold text-gray-900">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Account Role
                  </p>

                  <p className="mt-2 font-semibold text-gray-900">
                    {session.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="rounded-2xl bg-[#151515] p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                    Stay protected
                  </p>

                  <h3 className="mt-2 text-xl font-black text-white">
                    Keep your account secure.
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                    Marketplace will never ask you to send your
                    password through an unsolicited message. If you
                    notice suspicious activity, contact our support
                    team immediately.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] text-gray-300">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
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

            {/* Customer Service */}
            <div>
              <h3 className="font-bold text-white">
                Customer Service
              </h3>

              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    href="/help"
                    className="transition hover:text-orange-400"
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
                    href="/account/orders"
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
                    href="/categories"
                    className="transition hover:text-orange-400"
                  >
                    Categories
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
                    href="/seller/apply"
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

          {/* Footer Bottom */}
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