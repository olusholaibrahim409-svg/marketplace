
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Utility Bar */}
      <div className="bg-slate-900 text-sm text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <p>Welcome to Marketplace</p>

          <div className="hidden gap-6 md:flex">
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
            className="shrink-0 text-2xl font-black tracking-tight"
          >
            MARKETPLACE
          </Link>

          <form
            action="/"
            className="hidden flex-1 md:flex"
          >
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
              className="hidden transition hover:text-orange-100 md:block"
            >
              Account
            </Link>

            <Link
              href="/account/orders"
              className="hidden transition hover:text-orange-100 md:block"
            >
              Orders
            </Link>

            <Link
              href="/cart"
              className="transition hover:text-orange-100"
            >
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
              Your Privacy Matters
            </p>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Privacy Policy
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              This Privacy Policy explains how Marketplace collects, uses,
              stores and protects information when you use our website,
              marketplace services and related features.
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
          <span className="text-white">Privacy Policy</span>
        </div>
      </div>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="space-y-8">
          {/* Introduction */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              1. Introduction
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace respects your privacy and is committed to protecting
              the information you provide when using our platform. This policy
              describes the types of information we may collect, why we collect
              it, how it may be used and the choices available to you.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              By accessing or using Marketplace, you acknowledge that you have
              read and understood this Privacy Policy.
            </p>
          </article>

          {/* Information */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              2. Information We Collect
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Depending on how you use Marketplace, we may collect information
              such as:
            </p>

            <ul className="mt-5 space-y-3 text-slate-300">
              <li>
                • <strong className="text-white">Account information:</strong>{" "}
                name, email address, phone number and account credentials.
              </li>

              <li>
                • <strong className="text-white">Order information:</strong>{" "}
                products purchased, order numbers, delivery details and order
                history.
              </li>

              <li>
                • <strong className="text-white">Payment information:</strong>{" "}
                payment status, transaction references and payment method
                information processed through supported payment providers.
              </li>

              <li>
                • <strong className="text-white">Seller information:</strong>{" "}
                store details, business information, product listings and
                seller-related information.
              </li>

              <li>
                • <strong className="text-white">Technical information:</strong>{" "}
                browser type, device information, IP address and information
                about how you interact with our platform.
              </li>

              <li>
                • <strong className="text-white">Communications:</strong>{" "}
                messages, enquiries, support requests and information you
                provide when contacting us.
              </li>
            </ul>
          </article>

          {/* Use */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              3. How We Use Your Information
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Information collected through Marketplace may be used to:
            </p>

            <ul className="mt-5 space-y-3 text-slate-300">
              <li>• Create and manage customer and seller accounts.</li>
              <li>• Process and manage orders.</li>
              <li>• Facilitate deliveries and customer support.</li>
              <li>• Process payments through supported providers.</li>
              <li>• Provide marketplace and seller services.</li>
              <li>• Improve website performance and user experience.</li>
              <li>• Detect fraud, abuse and unauthorized activity.</li>
              <li>• Communicate important service-related information.</li>
              <li>• Comply with applicable legal and regulatory obligations.</li>
            </ul>
          </article>

          {/* Payments */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              4. Payments
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Payments may be processed through third-party payment providers.
              Marketplace may receive transaction information such as payment
              references, transaction status and confirmation details.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              Full payment card information may be handled directly by the
              relevant payment provider rather than being stored by
              Marketplace.
            </p>
          </article>

          {/* Cookies */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              5. Cookies and Similar Technologies
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace may use cookies and similar technologies to maintain
              sessions, remember preferences, understand website usage and
              improve the services provided to users.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              You can control certain cookies through your browser settings.
              Some functionality may not operate correctly if essential
              cookies are disabled.
            </p>

            <div className="mt-5">
              <Link
                href="/cookies"
                className="font-semibold text-orange-400 hover:text-orange-300"
              >
                Read our Cookie Policy →
              </Link>
            </div>
          </article>

          {/* Sharing */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              6. When Information May Be Shared
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              We may share relevant information when necessary to provide our
              services, including with:
            </p>

            <ul className="mt-5 space-y-3 text-slate-300">
              <li>
                • Sellers involved in fulfilling marketplace orders.
              </li>

              <li>
                • Delivery and logistics providers.
              </li>

              <li>
                • Payment processors and financial service providers.
              </li>

              <li>
                • Technology and hosting service providers.
              </li>

              <li>
                • Professional advisers or authorities where legally required.
              </li>
            </ul>

            <p className="mt-5 leading-8 text-slate-300">
              We do not intend to sell personal information simply because you
              use Marketplace.
            </p>
          </article>

          {/* Security */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              7. Data Security
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              We use reasonable technical and organizational measures designed
              to protect information against unauthorized access, loss,
              misuse, alteration or disclosure.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              However, no internet-based service can guarantee absolute
              security. Users should also take appropriate steps to protect
              their account credentials and devices.
            </p>
          </article>

          {/* Retention */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              8. Data Retention
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              We may retain information for as long as reasonably necessary to
              provide our services, maintain business records, resolve
              disputes, prevent fraud, comply with legal obligations and
              enforce our agreements.
            </p>
          </article>

          {/* Rights */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              9. Your Privacy Choices
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Depending on applicable law, you may have rights relating to your
              personal information, including requesting access, correction,
              deletion or other forms of control over certain information.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              You can contact Marketplace if you would like to make a privacy
              request or ask questions about how your information is handled.
            </p>
          </article>

          {/* Children */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              10. Children&apos;s Privacy
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace is not intended to knowingly collect personal
              information from children where doing so is prohibited by
              applicable law.
            </p>
          </article>

          {/* Third Party */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              11. Third-Party Services
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace may contain links to or integrations with third-party
              services. Those services may have their own privacy policies and
              practices. We encourage you to review their policies before
              providing personal information directly to them.
            </p>
          </article>

          {/* Changes */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              12. Changes to This Privacy Policy
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              We may update this Privacy Policy from time to time to reflect
              changes to our services, technology, legal requirements or
              business practices.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              When changes are made, the updated version will be published on
              this page with a revised update date.
            </p>
          </article>

          {/* Contact */}
          <article className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-6 md:p-8">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
              Questions?
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Need help with your privacy?
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              If you have questions about this Privacy Policy or how
              Marketplace handles your information, our support team can help.
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
            <h3 className="text-2xl font-black">MARKETPLACE</h3>

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
            <h4 className="font-bold">Customer Service</h4>

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
            <h4 className="font-bold">Marketplace</h4>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <Link href="/" className="block hover:text-orange-400">
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
            <h4 className="font-bold">Shop & Sell</h4>

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
                className="text-orange-400"
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
                className="hover:text-orange-400"
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
