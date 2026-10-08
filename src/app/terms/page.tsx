
import Link from "next/link";

export default function TermsPage() {
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
              className="rounded-r-md bg-slate-950 px-6 font-bold text-white hover:bg-slate-800"
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
              Marketplace Agreement
            </p>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Terms & Conditions
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              These Terms & Conditions explain the rules that apply when you
              access or use Marketplace, purchase products, create an account,
              or sell products through our platform.
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

          <span className="text-white">Terms & Conditions</span>
        </div>
      </div>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="space-y-8">
          {/* Acceptance */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              1. Acceptance of These Terms
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              By accessing or using Marketplace, you agree to comply with
              these Terms & Conditions and any applicable policies referenced
              within them.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              If you do not agree with these terms, you should not use the
              Marketplace platform.
            </p>
          </article>

          {/* Marketplace */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              2. About Marketplace
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace provides an online platform through which customers
              can discover and purchase products from participating sellers.
              Sellers may use the platform to list products and manage their
              marketplace activities.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace may facilitate communication, payments, order
              processing and other services connected with transactions.
            </p>
          </article>

          {/* Accounts */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              3. Accounts
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Some Marketplace features require you to create an account.
              You are responsible for providing accurate information and
              maintaining the confidentiality of your login credentials.
            </p>

            <ul className="mt-5 space-y-3 text-slate-300">
              <li>• Provide truthful and current account information.</li>
              <li>• Keep your password and account credentials secure.</li>
              <li>• Do not share your account with unauthorized persons.</li>
              <li>• Notify Marketplace if you believe your account has been compromised.</li>
            </ul>
          </article>

          {/* Customer Purchases */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              4. Customer Purchases
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Customers may browse available products and place orders through
              Marketplace. Product availability, pricing, delivery options and
              other details may change from time to time.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              Placing an order does not necessarily guarantee that the product
              will remain available. Where an order cannot be fulfilled,
              Marketplace or the relevant seller may cancel the order and
              provide any applicable refund.
            </p>
          </article>

          {/* Pricing */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              5. Product Information and Pricing
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Sellers are responsible for providing accurate product
              information, descriptions, images, specifications and pricing for
              their listings.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace may correct obvious errors, update information or
              remove listings that do not comply with platform requirements.
            </p>
          </article>

          {/* Payments */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              6. Payments
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace may support different payment methods, including
              supported online payment providers and other payment options
              made available on the platform.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              Payment transactions may be processed by third-party payment
              providers and may be subject to their own terms and policies.
            </p>
          </article>

          {/* Delivery */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              7. Delivery
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Delivery times and charges may vary depending on the seller,
              product, destination, delivery method and other circumstances.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              Customers should ensure that delivery information provided during
              checkout is accurate and complete.
            </p>

            <div className="mt-6">
              <Link
                href="/track-order"
                className="font-semibold text-orange-400 hover:text-orange-300"
              >
                Track an order →
              </Link>
            </div>
          </article>

          {/* Returns */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              8. Returns and Refunds
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Returns and refunds are subject to the applicable Marketplace
              return policy, product conditions and circumstances of the
              transaction.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              Certain products may have specific return requirements or
              restrictions.
            </p>

            <div className="mt-6">
              <Link
                href="/returns"
                className="font-semibold text-orange-400 hover:text-orange-300"
              >
                View Returns & Refunds →
              </Link>
            </div>
          </article>

          {/* Seller Terms */}
          <article className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-6 md:p-8">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
              Seller Requirements
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              9. Selling on Marketplace
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Sellers must comply with Marketplace requirements and applicable
              laws. Sellers are responsible for the products they list, the
              accuracy of their listings, order fulfilment and other
              responsibilities associated with their seller accounts.
            </p>

            <ul className="mt-5 space-y-3 text-slate-300">
              <li>• Do not list prohibited or unlawful products.</li>
              <li>• Provide accurate product descriptions and images.</li>
              <li>• Maintain accurate inventory information.</li>
              <li>• Fulfil accepted orders appropriately.</li>
              <li>• Respond to legitimate customer and Marketplace requests.</li>
              <li>• Follow applicable Marketplace seller policies.</li>
            </ul>

            <div className="mt-6">
              <Link
                href="/seller/policies"
                className="font-semibold text-orange-400 hover:text-orange-300"
              >
                View Seller Policies →
              </Link>
            </div>
          </article>

          {/* Prohibited Conduct */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              10. Prohibited Activities
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Users must not misuse Marketplace or use the platform for
              unlawful, fraudulent or abusive activities.
            </p>

            <ul className="mt-5 space-y-3 text-slate-300">
              <li>• Fraudulent transactions or payment activity.</li>
              <li>• Attempting to access another user&apos;s account.</li>
              <li>• Uploading malicious software or harmful content.</li>
              <li>• Misrepresenting products or seller information.</li>
              <li>• Manipulating reviews, ratings or marketplace activity.</li>
              <li>• Using Marketplace to violate applicable laws.</li>
              <li>• Interfering with the operation or security of the platform.</li>
            </ul>
          </article>

          {/* Intellectual Property */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              11. Intellectual Property
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace and its associated branding, design, software,
              content and functionality may be protected by intellectual
              property laws.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              Unless permission is provided or applicable law allows it, users
              may not copy, reproduce, distribute, modify or commercially
              exploit Marketplace content or systems.
            </p>
          </article>

          {/* Reviews */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              12. Reviews and User Content
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Where Marketplace allows reviews, ratings or other user-generated
              content, users must provide honest and relevant information.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              Content that is unlawful, abusive, misleading, discriminatory,
              fraudulent or unrelated to the relevant transaction may be
              removed.
            </p>
          </article>

          {/* Account Suspension */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              13. Account Suspension or Termination
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace may restrict, suspend or terminate accounts where
              there are reasonable grounds to believe that a user has violated
              these Terms, applicable policies or the law.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              Where appropriate, users may contact support to request
              clarification regarding an account restriction.
            </p>
          </article>

          {/* Availability */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              14. Service Availability
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace aims to maintain reliable services but does not
              guarantee that the platform will always be available,
              uninterrupted or error-free.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              Maintenance, technical issues, network problems, security
              incidents or other circumstances may temporarily affect
              availability.
            </p>
          </article>

          {/* Liability */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              15. Limitation of Responsibility
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace provides a platform connecting customers and
              participating sellers. To the extent permitted by applicable
              law, Marketplace is not responsible for matters that are solely
              within a seller&apos;s responsibility, including inaccurate
              product information or failure to fulfil a seller obligation.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              Nothing in these Terms is intended to exclude or limit rights or
              responsibilities that cannot legally be excluded or limited.
            </p>
          </article>

          {/* Privacy */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              16. Privacy
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Your use of Marketplace is also subject to our Privacy Policy,
              which explains how personal information may be collected, used
              and protected.
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

          {/* Cookies */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              17. Cookies
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace may use cookies and similar technologies to provide
              functionality, maintain sessions and improve the user
              experience.
            </p>

            <div className="mt-6">
              <Link
                href="/cookies"
                className="font-semibold text-orange-400 hover:text-orange-300"
              >
                Read our Cookie Policy →
              </Link>
            </div>
          </article>

          {/* Changes */}
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
            <h2 className="text-2xl font-bold">
              18. Changes to These Terms
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Marketplace may update these Terms & Conditions when necessary
              to reflect changes to our services, policies, technology or
              applicable requirements.
            </p>

            <p className="mt-4 leading-8 text-slate-300">
              Updated terms will be published on this page with a revised
              effective date.
            </p>
          </article>

          {/* Contact */}
          <article className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-6 md:p-8">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
              Need Help?
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Questions about our Terms?
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              If you have questions about these Terms & Conditions or your
              Marketplace account, contact our support team.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-lg bg-orange-600 px-5 py-3 font-bold hover:bg-orange-500"
              >
                Contact Support
              </Link>

              <Link
                href="/help"
                className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 font-bold hover:border-orange-500"
              >
                Help Center
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
              className="rounded-lg bg-orange-600 px-6 py-3 font-bold hover:bg-orange-500"
            >
              Start Shopping
            </Link>

            <Link
              href="/official-stores"
              className="rounded-lg border border-slate-700 px-6 py-3 font-bold hover:border-orange-500"
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
              <Link href="/help" className="block hover:text-orange-400">
                Help Center
              </Link>

              <Link href="/contact" className="block hover:text-orange-400">
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

              <Link href="/deals" className="block hover:text-orange-400">
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
              <Link href="/cart" className="block hover:text-orange-400">
                Shopping Cart
              </Link>

              <Link
                href="/account/orders"
                className="block hover:text-orange-400"
              >
                My Orders
              </Link>

              <Link href="/seller" className="block hover:text-orange-400">
                Become a Seller
              </Link>

              <Link href="/seller" className="block hover:text-orange-400">
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
            <p>© 2026 Marketplace. All rights reserved.</p>

            <div className="flex flex-wrap gap-5">
              <Link
                href="/privacy"
                className="hover:text-orange-400"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-orange-400"
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
