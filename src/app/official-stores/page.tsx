import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OfficialStoresPage() {
  const sellers = await prisma.seller.findMany({
    where: {
      status: "APPROVED",
    },
    orderBy: {
      storeName: "asc",
    },
    select: {
      id: true,
      storeName: true,
      slug: true,
      description: true,
      logoUrl: true,
      phone: true,
      status: true,
      _count: {
        select: {
          Product: {
            where: {
              status: "APPROVED",
            },
          },
        },
      },
    },
  });

  const totalProducts = sellers.reduce(
    (total, seller) => total + seller._count.Product,
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* TOP BAR */}
      <div className="hidden bg-gray-950 text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">
          <p>Welcome to Marketplace</p>

          <div className="flex items-center gap-6">
            <Link
              href="/seller/apply"
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

      {/* MAIN HEADER */}
      <header className="sticky top-0 z-40 bg-orange-600 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">
          <Link
            href="/"
            className="shrink-0 text-xl font-black tracking-tight md:text-2xl"
          >
            MARKETPLACE
          </Link>

          {/* SEARCH */}
          <div className="hidden flex-1 md:flex">
            <form action="/" className="flex w-full">
              <input
                type="search"
                name="search"
                placeholder="Search products, brands and categories"
                className="w-full rounded-l-md bg-white px-4 py-3 text-sm text-gray-900 outline-none"
              />

              <button
                type="submit"
                className="rounded-r-md bg-gray-950 px-7 text-sm font-bold transition hover:bg-gray-800"
              >
                Search
              </button>
            </form>
          </div>

          <Link
            href="/account"
            className="hidden rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-orange-700 md:block"
          >
            Account
          </Link>

          <Link
            href="/account/orders"
            className="hidden rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-orange-700 md:block"
          >
            Orders
          </Link>

          <Link
            href="/cart"
            className="rounded-md px-3 py-2 text-lg transition hover:bg-orange-700"
            aria-label="Shopping cart"
          >
            🛒
          </Link>
        </div>

        {/* MOBILE SEARCH */}
        <div className="px-4 pb-3 md:hidden">
          <form action="/" className="flex">
            <input
              type="search"
              name="search"
              placeholder="Search products, brands and categories"
              className="w-full rounded-l-md bg-white px-3 py-2.5 text-sm text-gray-900 outline-none"
            />

            <button
              type="submit"
              className="rounded-r-md bg-gray-950 px-4 text-sm font-bold"
            >
              Search
            </button>
          </form>
        </div>

        {/* NAVIGATION */}
        <nav className="bg-orange-700">
          <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-4 py-3 text-sm font-medium">
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
              ⚡ Flash Sales
            </Link>

            <Link
              href="/official-stores"
              className="whitespace-nowrap font-bold text-white"
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
              href="/seller/apply"
              className="whitespace-nowrap transition hover:text-orange-200"
            >
              Sell on Marketplace
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-orange-600/30 blur-3xl" />

        <div className="absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_0.6fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-400">
                <span>✓</span>
                VERIFIED SELLERS
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
                Official Stores
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
                Discover trusted Marketplace stores and shop quality
                products from approved sellers in one convenient place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#stores"
                  className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
                >
                  Explore Stores
                </Link>

                <Link
                  href="/"
                  className="rounded-lg border border-gray-700 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Start Shopping
                </Link>
              </div>
            </div>

            {/* HERO STATS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-black text-orange-400">
                  {sellers.length}
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Verified Stores
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-black text-orange-400">
                  {totalProducts}
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Products
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500/20 text-xl">
                    🛡️
                  </div>

                  <div>
                    <p className="font-bold text-white">
                      Shop with confidence
                    </p>

                    <p className="text-sm text-gray-400">
                      Stores shown here have been approved by Marketplace.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BREADCRUMB */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="transition hover:text-orange-600"
            >
              Home
            </Link>

            <span>›</span>

            <span className="font-semibold text-gray-900">
              Official Stores
            </span>
          </div>
        </div>
      </div>

      {/* STORES */}
      <section
        id="stores"
        className="mx-auto max-w-7xl px-4 py-10"
      >
        {/* SECTION HEADER */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                🏪
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  Trusted Stores
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {sellers.length} approved{" "}
                  {sellers.length === 1
                    ? "store"
                    : "stores"}{" "}
                  available
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="w-fit rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-gray-50"
            >
              ← Continue Shopping
            </Link>
          </div>

          <div className="border-t bg-orange-50 px-5 py-3 md:px-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-orange-600">
                ✓
              </span>

              <span className="font-semibold text-orange-900">
                Every store displayed here has an approved Marketplace seller account.
              </span>
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {sellers.length === 0 ? (
          <div className="rounded-2xl bg-white p-14 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">
              🏪
            </div>

            <h3 className="mt-5 text-2xl font-black">
              No official stores yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Approved Marketplace sellers will appear here once their
              stores have been approved.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-orange-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sellers.map((seller) => (
              <article
                key={seller.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* STORE BANNER */}
                <div className="relative h-32 overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-400">
                  <div className="absolute -right-10 -top-20 h-52 w-52 rounded-full bg-white/10" />

                  <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-white/10" />

                  <div className="relative flex h-full items-center justify-between px-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                        Marketplace Store
                      </p>

                      <p className="mt-2 max-w-[190px] truncate text-lg font-black text-white">
                        {seller.storeName}
                      </p>
                    </div>

                    <span className="text-5xl opacity-30">
                      🏪
                    </span>
                  </div>
                </div>

                {/* STORE CONTENT */}
                <div className="px-6 pb-6">
                  {/* LOGO */}
                  <div className="-mt-12 flex items-end justify-between">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl">
                      {seller.logoUrl ? (
                        <img
                          src={seller.logoUrl}
                          alt={`${seller.storeName} logo`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-black text-orange-600">
                          {seller.storeName
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>

                    <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">
                      ✓ Verified
                    </span>
                  </div>

                  {/* NAME */}
                  <div className="mt-5">
                    <h3 className="text-xl font-black text-gray-900">
                      {seller.storeName}
                    </h3>

                    <p className="mt-2 min-h-[48px] line-clamp-2 text-sm leading-6 text-gray-500">
                      {seller.description ||
                        "Shop quality products from this verified Marketplace seller."}
                    </p>
                  </div>

                  {/* STORE STATS */}
                  <div className="mt-5 grid grid-cols-2 divide-x rounded-xl bg-gray-50 py-4">
                    <div className="text-center">
                      <p className="text-xl font-black text-gray-900">
                        {seller._count.Product}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Products
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-black text-green-600">
                        APPROVED
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Seller Status
                      </p>
                    </div>
                  </div>

                  {/* STORE STATUS */}
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-3 py-2.5">
                    <span className="text-green-600">
                      🛡️
                    </span>

                    <p className="text-xs font-semibold text-green-700">
                      Verified Marketplace Seller
                    </p>
                  </div>

                  {/* BUTTON */}
                  <Link
                    href={`/seller/${seller.slug}`}
                    className="mt-5 flex w-full items-center justify-center rounded-xl bg-orange-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-700"
                  >
                    Visit Store →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* WHY SHOP OFFICIAL STORES */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="rounded-2xl bg-gray-950 p-7 text-white md:p-10">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-400">
              Marketplace Benefits
            </p>

            <h2 className="mt-2 text-2xl font-black md:text-3xl">
              Why shop from official stores?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="text-3xl">
                🛡️
              </div>

              <h3 className="mt-3 font-bold">
                Approved Sellers
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Shop from sellers who have been approved to operate on
                the Marketplace platform.
              </p>
            </div>

            <div>
              <div className="text-3xl">
                🛍️
              </div>

              <h3 className="mt-3 font-bold">
                Browse Store Products
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Visit a store and discover its complete selection of
                approved products.
              </p>
            </div>

            <div>
              <div className="text-3xl">
                🔎
              </div>

              <h3 className="mt-3 font-bold">
                Shop With Confidence
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Store information and seller status are clearly shown
                before you shop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER - SAME AS HOMEPAGE */}
      <footer className="bg-gray-950 text-white">
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
                className="block font-semibold text-orange-400"
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