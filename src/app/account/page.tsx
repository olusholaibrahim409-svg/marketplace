import Link from "next/link";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/LogoutButton";

export default async function AccountPage() {
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
      phone: true,
      imageUrl: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const firstName = user.firstName || "";
  const lastName = user.lastName || "";

  const fullName =
    `${firstName} ${lastName}`.trim() || "Marketplace Customer";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase() || "U";

  const memberSince = new Date(
    user.createdAt
  ).toLocaleDateString("en-NG", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-gray-900">
      {/* TOP UTILITY BAR */}
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

      {/* MAIN HEADER */}
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

      {/* NAVIGATION */}
      <nav className="border-b border-orange-700 bg-orange-600 text-white">
        <div className="mx-auto flex max-w-7xl items-center overflow-x-auto px-4 sm:px-6 lg:px-8">
          <NavLink href="/" label="Home" />
          <NavLink href="/categories" label="Categories" />
          <NavLink href="/deals" label="Deals" />
          <NavLink href="/flash-sales" label="Flash Sales" />
          <NavLink href="/new-arrivals" label="New Arrivals" />
          <NavLink href="/top-selling" label="Top Selling" />

          <Link
            href="/seller/apply"
            className="ml-auto whitespace-nowrap border-b-2 border-transparent px-4 py-4 text-sm font-bold text-white transition hover:border-white hover:bg-orange-700"
          >
            Sell on Marketplace
          </Link>
        </div>
      </nav>

      {/* ACCOUNT HERO */}
      <section className="bg-[#151515]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-400 transition hover:text-white"
            >
              Home
            </Link>

            <span className="text-gray-600">/</span>

            <span className="font-medium text-orange-400">
              My Account
            </span>
          </div>

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
                Marketplace Account
              </p>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                My Account
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
                Manage your orders, profile, wishlist, addresses and
                shopping activity from one secure place.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-[#202020] p-4 sm:min-w-[360px]">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={fullName}
                  className="h-16 w-16 shrink-0 rounded-full border-2 border-orange-500 object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-500 text-lg font-black text-white">
                  {initials}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-white">
                  {fullName}
                </p>

                <p className="mt-1 truncate text-xs text-gray-400">
                  {user.email}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-400" />

                  <span className="text-xs font-semibold text-green-400">
                    Account Active
                  </span>
                </div>
              </div>

              <Link
                href="/account/profile"
                className="hidden rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-white transition hover:border-orange-500 hover:text-orange-400 sm:block"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ACCOUNT CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* SIDEBAR */}
          <aside className="h-fit overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="bg-[#151515] p-6">
              <div className="flex items-center gap-4">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={fullName}
                    className="h-14 w-14 shrink-0 rounded-full border-2 border-orange-500 object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-orange-500 bg-orange-500 text-lg font-black text-white">
                    {initials}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate font-bold text-white">
                    {fullName}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <nav className="p-3">
              <AccountNavLink
                href="/account"
                label="Account Overview"
                icon="▦"
                active
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

              {/* LOG OUT */}
              <div className="my-3 border-t border-gray-100" />

              <LogoutButton />
            </nav>
          </aside>

          {/* MAIN DASHBOARD */}
          <div className="min-w-0 space-y-8">
            {/* WELCOME SECTION */}
            <section className="relative overflow-hidden rounded-3xl bg-[#151515] shadow-lg">
              <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

              <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />

              <div className="relative p-7 sm:p-9 lg:p-10">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5">
                      <span className="h-2 w-2 rounded-full bg-orange-400" />

                      <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                        Customer Dashboard
                      </span>
                    </div>

                    <p className="text-sm font-medium text-gray-400">
                      Welcome back,
                    </p>

                    <h2 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
                      {fullName}
                    </h2>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
                      Everything you need to manage your Marketplace
                      experience is right here. Check your orders,
                      update your profile, manage addresses and continue
                      shopping.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 hover:shadow-orange-500/30"
                      >
                        Continue Shopping
                        <span>→</span>
                      </Link>

                      <Link
                        href="/account/profile"
                        className="inline-flex items-center justify-center rounded-xl border border-gray-700 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:border-orange-500 hover:bg-orange-500/10"
                      >
                        Edit Profile
                      </Link>
                    </div>
                  </div>

                  <div className="hidden shrink-0 lg:block">
                    <div className="flex h-36 w-36 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-500 text-3xl font-black text-white shadow-xl shadow-orange-500/20">
                        {initials}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK ACCESS */}
            <section>
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                    Your Marketplace
                  </p>

                  <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950">
                    Quick Access
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Everything important is only one click away.
                  </p>
                </div>

                <Link
                  href="/"
                  className="text-sm font-bold text-orange-500 transition hover:text-orange-600"
                >
                  Explore Marketplace →
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardCard
                  href="/account/orders"
                  icon="▤"
                  title="My Orders"
                  description="View purchases, order details and delivery status."
                  accent="orders"
                />

                <DashboardCard
                  href="/account/wishlist"
                  icon="♡"
                  title="Wishlist"
                  description="Keep your favourite products saved for later."
                  accent="wishlist"
                />

                <DashboardCard
                  href="/cart"
                  icon="▢"
                  title="Shopping Cart"
                  description="Review your selected items and checkout."
                  accent="cart"
                />

                <DashboardCard
                  href="/account/profile"
                  icon="◉"
                  title="My Profile"
                  description="Update your personal information and photo."
                  accent="profile"
                />
              </div>
            </section>

            {/* PERSONAL INFORMATION */}
            <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col gap-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 via-white to-white px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-xl text-white shadow-sm">
                    ◉
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
                      Account Details
                    </p>

                    <h2 className="mt-1 text-xl font-black text-gray-950">
                      Personal Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Your basic Marketplace account information.
                    </p>
                  </div>
                </div>

                <Link
                  href="/account/profile"
                  className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:border-orange-500 hover:text-orange-500"
                >
                  Edit Profile
                  <span>→</span>
                </Link>
              </div>

              <div className="grid sm:grid-cols-2">
                <InfoItem
                  label="Full Name"
                  value={fullName}
                  icon="◉"
                />

                <InfoItem
                  label="Email Address"
                  value={user.email}
                  icon="@"
                />

                <InfoItem
                  label="Phone Number"
                  value={user.phone || "Not provided"}
                  icon="☎"
                />

                <InfoItem
                  label="Member Since"
                  value={memberSince}
                  icon="◷"
                />
              </div>
            </section>

            {/* ACCOUNT SERVICES */}
            <section>
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                  Manage
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950">
                  Account Services
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your delivery information and account security.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <ServiceCard
                  href="/account/addresses"
                  icon="⌖"
                  title="My Addresses"
                  description="Add, edit and manage your delivery addresses for faster checkout."
                  label="Manage Addresses"
                />

                <ServiceCard
                  href="/account/security"
                  icon="◇"
                  title="Account Security"
                  description="Manage your password and keep your Marketplace account secure."
                  label="Security Settings"
                />
              </div>
            </section>

            {/* ACCOUNT STATUS */}
            <section className="grid gap-5 md:grid-cols-2">
              <StatusCard
                type="success"
                icon="✓"
                title="Account Status"
                description="Your Marketplace account is active and ready for shopping."
                badge="Active"
              />

              <StatusCard
                type="orange"
                icon="◉"
                title="Profile Information"
                description="Keep your name, phone number and profile photo up to date."
                link="/account/profile"
                linkText="Manage Profile"
              />
            </section>

            {/* SUPPORT */}
            <section className="relative overflow-hidden rounded-3xl bg-[#151515] p-7 shadow-sm sm:p-9">
              <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />

              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                    ?
                  </div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                    Need Assistance?
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-white">
                    We&apos;re here to help.
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                    Get help with your orders, payments, deliveries,
                    returns or Marketplace account.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  Contact Support
                  <span>→</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111111] text-gray-300">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
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

            <FooterColumn
              title="Customer Service"
              links={[
                ["Help Center", "/help"],
                ["Contact Us", "/contact"],
                ["Track Order", "/account/orders"],
                ["Returns & Refunds", "/returns"],
              ]}
            />

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

      <span className="flex-1">{label}</span>

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
/* QUICK ACCESS CARD */
/* ========================================================= */

function DashboardCard({
  href,
  icon,
  title,
  description,
  accent,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  accent: "orders" | "wishlist" | "cart" | "profile";
}) {
  const accentStyles = {
    orders: "bg-orange-50 text-orange-500",
    wishlist: "bg-rose-50 text-rose-500",
    cart: "bg-blue-50 text-blue-500",
    profile: "bg-purple-50 text-purple-500",
  };

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
    >
      <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-orange-50 transition group-hover:scale-150" />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${accentStyles[accent]}`}
        >
          {icon}
        </div>

        <span className="text-lg text-gray-300 transition group-hover:translate-x-1 group-hover:text-orange-500">
          →
        </span>
      </div>

      <div className="relative">
        <h3 className="mt-6 text-base font-black text-gray-950">
          {title}
        </h3>

        <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-500">
          {description}
        </p>

        <div className="mt-5 text-xs font-bold uppercase tracking-wider text-orange-500">
          Open {title}
        </div>
      </div>
    </Link>
  );
}

/* ========================================================= */
/* INFORMATION ITEM */
/* ========================================================= */

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="group flex items-start gap-4 border-b border-gray-100 p-6 transition hover:bg-orange-50/40 sm:p-7 sm:[&:nth-child(odd)]:border-r">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-500 transition group-hover:bg-orange-100 group-hover:text-orange-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {label}
        </p>

        <p className="mt-2 break-words font-bold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ========================================================= */
/* SERVICE CARD */
/* ========================================================= */

function ServiceCard({
  href,
  icon,
  title,
  description,
  label,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg sm:p-7"
    >
      <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-orange-50 transition duration-500 group-hover:scale-150" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
            {icon}
          </div>

          <span className="text-xl text-gray-300 transition group-hover:translate-x-1 group-hover:text-orange-500">
            →
          </span>
        </div>

        <h3 className="mt-6 text-lg font-black text-gray-950">
          {title}
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
          {description}
        </p>

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-orange-500">
          {label}

          <span className="transition group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ========================================================= */
/* STATUS CARD */
/* ========================================================= */

function StatusCard({
  type,
  icon,
  title,
  description,
  badge,
  link,
  linkText,
}: {
  type: "success" | "orange";
  icon: string;
  title: string;
  description: string;
  badge?: string;
  link?: string;
  linkText?: string;
}) {
  const isSuccess = type === "success";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg ${
            isSuccess
              ? "bg-green-50 text-green-600"
              : "bg-orange-50 text-orange-500"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="font-black text-gray-950">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {description}
          </p>

          {badge && (
            <span className="mt-4 inline-flex rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
              {badge}
            </span>
          )}

          {link && linkText && (
            <Link
              href={link}
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-orange-500 transition hover:text-orange-600"
            >
              {linkText}
              <span>→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
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