
import Link from "next/link";

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Utility Bar */}
      <div className="bg-slate-900 text-sm text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <p>Welcome to Marketplace</p>

          <div className="hidden gap-6 md:flex">
            <Link href="/seller" className="hover:text-orange-400">
              Sell on Marketplace
            </Link>

            <Link href="/help" className="hover:text-orange-400">
              Help Center
            </Link>

            <Link href="/track-order" className="hover:text-orange-400">
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
            className="shrink-0 text-2xl font-black tracking-tight"
          >
            MARKETPLACE
          </Link>

          <form action="/" className="hidden flex-1 md:flex">
            <input
              type="text"
              name="search"
              placeholder="Search products, brands and categories..."
              className="w-full rounded-l-md border-0 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
            />

            <button
              type="submit"
              className="rounded-r-md bg-slate-950 px-6 font-bold text-white transition hover:bg-slate-800"
            >
              Search
            </button>
          </form>

          <div className="ml-auto flex items-center gap-4 text-sm font-medium">
            <Link
              href="/account"
              className="hidden hover:text-orange-100 md:block"
            >
              Account
            </Link>

            <Link
              href="/account/orders"
              className="hidden hover:text-orange-100 md:block"
            >
              Orders
            </Link>

            <Link href="/cart" className="hover:text-orange-100">
              🛒 Cart
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-orange-700">
        <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-4 py-3 text-sm font-medium whitespace-nowrap">
          <Link href="/" className="hover:text-orange-200">
            ☰ Categories
          </Link>

          <Link href="/flash-sales" className="hover:text-orange-200">
            Flash Sales
          </Link>

          <Link href="/official-stores" className="hover:text-orange-200">
            Official Stores
          </Link>

          <Link href="/deals" className="hover:text-orange-200">
            Deals
          </Link>

          <Link href="/new-arrivals" className="hover:text-orange-200">
            New Arrivals
          </Link>

          <Link href="/top-selling" className="hover:text-orange-200">
            Top Selling
          </Link>

          <Link href="/seller" className="hover:text-orange-200">
            Sell on Marketplace
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
              Website Preferences
            </p>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Cookie Policy
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              This Cookie Policy explains how Marketplace may use cookies and
              similar technologies to provide essential functionality,
              remember preferences and improve your experience.
            </p>

            <p className="mt-5 text-sm text-slate-400">
              Last updated: September 2026
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-4 text-sm text-slate-400">
          <Link href="/" className="hover:text-orange-400">
            Home
          </Link>

          <span className="mx-2">/</span>

          <span className="text-white">Cookie Policy</span>
        </div>
      </div>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="space-y-8">
          {/* Introduction */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              1. What Are Cookies?
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Cookies are small text files that websites may store on your
              device when you visit them. They can help websites remember
              information about your visit and provide certain functionality.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              Similar technologies may also be used for purposes such as
              maintaining login sessions, remembering preferences and
              understanding how visitors interact with a website.
            </p>
          </article>

          {/* Why */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              2. Why Marketplace Uses Cookies
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace may use cookies and similar technologies to help:
            </p>

            <ul className="mt-5 space-y-3 text-slate-300">
              <li>• Keep users signed in securely.</li>
              <li>• Maintain shopping and checkout functionality.</li>
              <li>• Remember certain preferences.</li>
              <li>• Improve website performance.</li>
              <li>• Understand how features are used.</li>
              <li>• Help protect accounts and prevent abuse.</li>
            </ul>
          </article>

          {/* Types */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              3. Types of Cookies We May Use
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                <div className="text-2xl">🔐</div>

                <h3 className="mt-3 text-lg font-bold">
                  Essential Cookies
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-400">
                  These may be necessary for core functions such as account
                  authentication, security, navigation and shopping
                  functionality.
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                <div className="text-2xl">⚙️</div>

                <h3 className="mt-3 text-lg font-bold">
                  Functional Cookies
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-400">
                  These may help remember preferences and settings to make the
                  Marketplace experience more convenient.
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                <div className="text-2xl">📊</div>

                <h3 className="mt-3 text-lg font-bold">
                  Analytics Cookies
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-400">
                  Where enabled, analytics technologies may help us understand
                  website traffic, performance and feature usage.
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
                <div className="text-2xl">🛡️</div>

                <h3 className="mt-3 text-lg font-bold">
                  Security Cookies
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-400">
                  Certain technologies may be used to help identify suspicious
                  activity and protect Marketplace accounts and systems.
                </p>
              </div>
            </div>
          </article>

          {/* Session */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              4. Authentication and Session Cookies
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              When you sign in to Marketplace, technologies may be used to
              maintain your authenticated session and help ensure that protected
              account features remain accessible only to you.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              These technologies may be essential for features such as account
              pages, orders and seller dashboards.
            </p>
          </article>

          {/* Shopping */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              5. Shopping and Cart Functionality
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace may use browser storage, cookies or similar
              technologies to support shopping functionality such as retaining
              product selections and maintaining a convenient shopping
              experience.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              Disabling certain browser storage technologies may affect
              shopping or other functionality.
            </p>
          </article>

          {/* Third party */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              6. Third-Party Technologies
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Some services integrated into Marketplace may use their own
              cookies or similar technologies. Examples may include payment,
              analytics, security, hosting or other service providers.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              These third parties may have their own privacy and cookie
              policies. Their use of information is governed by their
              respective policies and terms.
            </p>
          </article>

          {/* Browser */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              7. Managing Cookies
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Most modern web browsers allow you to control cookies through
              browser settings. You may be able to block, delete or restrict
              cookies.
            </p>

            <div className="mt-6 rounded-xl border border-orange-500/20 bg-orange-500/10 p-5">
              <p className="text-sm leading-7 text-slate-300">
                <strong className="text-orange-400">
                  Important:
                </strong>{" "}
                Blocking essential cookies or browser storage may prevent some
                Marketplace features from working correctly.
              </p>
            </div>
          </article>

          {/* Local storage */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              8. Local Storage and Similar Technologies
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace may also use technologies such as browser local
              storage or session storage. These technologies allow websites to
              retain information directly in your browser.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              Such technologies may be used for features such as shopping cart
              functionality, temporary preferences and application state.
            </p>
          </article>

          {/* Updates */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              9. Changes to This Cookie Policy
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              We may update this Cookie Policy from time to time to reflect
              changes in technology, functionality, legal requirements or
              Marketplace services.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              The latest version will always be published on this page with an
              updated date.
            </p>
          </article>

          {/* Privacy */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              10. Related Privacy Information
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Cookies may form part of the information collected when you use
              Marketplace. For more information about how personal information
              may be handled, please review our Privacy Policy.
            </p>

            <div className="mt-6">
              <Link
                href="/privacy"
                className="font-semibold text-orange-400 hover:text-orange-300"
              >
                Read our Privacy Policy →
              </Link>
            </div>
          </article>

          {/* Terms */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              11. Related Terms
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Your use of Marketplace is also governed by our Terms &
              Conditions and other applicable Marketplace policies.
            </p>

            <div className="mt-6">
              <Link
                href="/terms"
                className="font-semibold text-orange-400 hover:text-orange-300"
              >
                Read Terms & Conditions →
              </Link>
            </div>
          </article>

          {/* Contact */}
          <article className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-6 md:p-8">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
              Need Help?
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Questions about cookies?
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              If you have questions about our use of cookies or similar
              technologies, our support team can assist you.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-lg bg-orange-600 px-5 py-3 font-bold text-white transition hover:bg-orange-500"
              >
                Contact Support
              </Link>

              <Link
                href="/help"
                className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 font-bold text-white transition hover:border-orange-500"
              >
                Visit Help Center
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
            Marketplace
          </p>

          <h2 className="mt-3 text-3xl font-black md:text-4xl">
            Shop with confidence.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Discover products, trusted sellers and great deals across
            Marketplace.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-lg bg-orange-600 px-6 py-3 font-bold transition hover:bg-orange-500"
            >
              Start Shopping
            </Link>

            <Link
              href="/official-stores"
              className="rounded-lg border border-slate-700 px-6 py-3 font-bold transition hover:border-orange-500"
            >
              Browse Stores
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-black">
              MARKETPLACE
            </h3>

            <p className="mt-4 max-w-xs leading-7 text-slate-400">
              Your trusted online marketplace for products, trusted sellers
              and convenient shopping.
            </p>

            <div className="mt-6 flex gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm">
                f
              </span>

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm">
                X
              </span>

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm">
                ◎
              </span>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold">
              Customer Service
            </h4>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <Link
                href="/help"
                className="block hover:text-orange-400"
              >
                Help Center
              </Link>

              <Link
                href="/contact"
                className="block hover:text-orange-400"
              >
                Contact Us
              </Link>

              <Link
                href="/track-order"
                className="block hover:text-orange-400"
              >
                Track Order
              </Link>

              <Link
                href="/returns"
                className="block hover:text-orange-400"
              >
                Returns & Refunds
              </Link>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-bold">
              Marketplace
            </h4>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <Link
                href="/"
                className="block hover:text-orange-400"
              >
                Home
              </Link>

              <Link
                href="/official-stores"
                className="block hover:text-orange-400"
              >
                Official Stores
              </Link>

              <Link
                href="/deals"
                className="block hover:text-orange-400"
              >
                Deals
              </Link>

              <Link
                href="/new-arrivals"
                className="block hover:text-orange-400"
              >
                New Arrivals
              </Link>

              <Link
                href="/top-selling"
                className="block hover:text-orange-400"
              >
                Top Selling
              </Link>

              <Link
                href="/flash-sales"
                className="block hover:text-orange-400"
              >
                Flash Sales
              </Link>
            </div>
          </div>

          {/* Shop & Sell */}
          <div>
            <h4 className="font-bold">
              Shop & Sell
            </h4>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <Link
                href="/cart"
                className="block hover:text-orange-400"
              >
                Shopping Cart
              </Link>

              <Link
                href="/account/orders"
                className="block hover:text-orange-400"
              >
                My Orders
              </Link>

              <Link
                href="/seller"
                className="block hover:text-orange-400"
              >
                Become a Seller
              </Link>

              <Link
                href="/seller"
                className="block hover:text-orange-400"
              >
                Seller Center
              </Link>

              <Link
                href="/seller/policies"
                className="block hover:text-orange-400"
              >
                Seller Policies
              </Link>

              <Link
                href="/seller/support"
                className="block hover:text-orange-400"
              >
                Seller Support
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>
              © 2026 Marketplace. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                href="/privacy"
                className="hover:text-orange-400"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="hover:text-orange-400"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/cookies"
                className="text-orange-400"
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
