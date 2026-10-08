
"use client";

import { useState } from "react";
import Link from "next/link";

const returnSteps = [
  {
    number: "01",
    title: "Request a Return",
    description:
      "Open your order and request a return for an eligible item.",
    icon: "↩️",
  },
  {
    number: "02",
    title: "Request Review",
    description:
      "Our team or the seller reviews the return request and provides the next steps.",
    icon: "🔍",
  },
  {
    number: "03",
    title: "Send the Item Back",
    description:
      "Follow the return instructions and send the eligible item back.",
    icon: "📦",
  },
  {
    number: "04",
    title: "Refund Processed",
    description:
      "Once the return is approved and processed, your refund is initiated.",
    icon: "💳",
  },
];

const faqs = [
  {
    question: "How do I request a return?",
    answer:
      "Go to your orders page, open the relevant order and select the return option when the item is eligible. You may also contact customer support for assistance.",
  },
  {
    question: "Can I return every product?",
    answer:
      "Return eligibility depends on the product, its condition and the applicable Marketplace return policy. Some categories or products may have different conditions.",
  },
  {
    question: "What condition should an item be in?",
    answer:
      "Generally, returned items should be in the condition required by the applicable return policy, with relevant accessories, packaging and documentation where applicable.",
  },
  {
    question: "How long does a refund take?",
    answer:
      "Refund timing can depend on the return review, payment method and payment provider. You will receive information about the refund process once your return is approved.",
  },
  {
    question: "What if I received a damaged item?",
    answer:
      "Contact support as soon as possible and provide your order number and details of the issue. Photos or other information may be requested to help investigate the case.",
  },
  {
    question: "Can I exchange an item?",
    answer:
      "Exchange availability depends on the product and seller. If an exchange is not available, you may be directed through the applicable return and refund process.",
  },
];

export default function ReturnsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
              Customer protection
            </p>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Returns & Refunds
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Need to return an item or understand how refunds work? Find the
              information you need to get started.
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

          <span className="text-white">Returns & Refunds</span>
        </div>
      </div>

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              Before you return
            </p>

            <h2 className="mt-3 text-3xl font-black">
              We want your shopping experience to be simple.
            </h2>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">
              If an item does not meet your expectations, check whether it is
              eligible for return and follow the instructions provided for
              your order. Return conditions may vary depending on the product,
              category, seller and reason for the return.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
                <div className="text-2xl">📋</div>

                <h3 className="mt-4 font-bold">
                  Check your order
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Open your order to check available return options.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
                <div className="text-2xl">📸</div>

                <h3 className="mt-4 font-bold">
                  Keep useful evidence
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Photos and order details can help when reporting a problem.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-7">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500 text-2xl">
              🛡️
            </div>

            <h3 className="mt-5 text-xl font-black">
              Important
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              Return eligibility and refund conditions depend on the applicable
              Marketplace policy and the individual product or seller. Always
              review the return information associated with your order before
              sending an item back.
            </p>

            <Link
              href="/account/orders"
              className="mt-6 inline-flex rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
            >
              Check My Orders
            </Link>
          </div>
        </div>
      </section>

      {/* Return process */}
      <section className="border-y border-white/10 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Return process
            </h2>

            <p className="mt-4 text-slate-400">
              The exact process can vary by product and seller, but these are
              the general steps.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {returnSteps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-xl border border-white/10 bg-slate-950 p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-orange-400">
                    {step.number}
                  </span>

                  <span className="text-2xl">
                    {step.icon}
                  </span>
                </div>

                <h3 className="mt-6 font-bold">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligible / not eligible */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                ✓
              </div>

              <h2 className="text-xl font-black">
                Before requesting a return
              </h2>
            </div>

            <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-400">
              <li className="flex gap-3">
                <span className="text-orange-400">•</span>
                Check the order details and return eligibility.
              </li>

              <li className="flex gap-3">
                <span className="text-orange-400">•</span>
                Keep the product, accessories and packaging where required.
              </li>

              <li className="flex gap-3">
                <span className="text-orange-400">•</span>
                Make sure the item meets the applicable return conditions.
              </li>

              <li className="flex gap-3">
                <span className="text-orange-400">•</span>
                Have your order number available when contacting support.
              </li>

              <li className="flex gap-3">
                <span className="text-orange-400">•</span>
                Follow the return instructions provided for your order.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                !
              </div>

              <h2 className="text-xl font-black">
                Some items may have restrictions
              </h2>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Certain products may have specific return conditions because of
              their category, condition, usage or seller policy. The return
              option shown on your order is the best place to check whether a
              particular item is eligible.
            </p>

            <Link
              href="/help"
              className="mt-6 inline-flex text-sm font-bold text-orange-400 transition hover:text-orange-300"
            >
              Visit Help Center →
            </Link>
          </div>
        </div>
      </section>

      {/* Refund section */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 pb-14 sm:pb-16">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-7 sm:p-9">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
                  Refunds
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  What happens after a return?
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Once an eligible return is received and reviewed, the refund
                  process can begin according to the applicable policy. The
                  time it takes for funds to appear can depend on the payment
                  method and payment provider.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/account/orders"
                    className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
                  >
                    View My Orders
                  </Link>

                  <Link
                    href="/contact"
                    className="rounded-lg border border-white/10 bg-slate-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>

              <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-6">
                <div className="text-3xl">💳</div>

                <h3 className="mt-4 font-bold">
                  Refund status
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Your order information will provide the relevant status as
                  your return or refund moves through the process.
                </p>

                <Link
                  href="/account/orders"
                  className="mt-4 inline-block text-sm font-bold text-orange-400"
                >
                  Check order status →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="border-y border-white/10 bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:py-16">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              Common questions
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Returns FAQ
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Find quick answers to some of the most common return and refund
              questions.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-white/10 bg-slate-950"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left"
                  >
                    <span className="font-bold">
                      {faq.question}
                    </span>

                    <span
                      className={`text-xl text-orange-400 transition-transform ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/10 px-5 pb-5 pt-4">
                      <p className="text-sm leading-7 text-slate-400">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 p-8 sm:p-10">
            <div className="flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-100">
                  Need assistance?
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  We&apos;re here to help.
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-orange-50">
                  If you have a question about a return, refund or order, our
                  support team can help you find the next step.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-lg bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-slate-900"
                >
                  Contact Us
                </Link>

                <Link
                  href="/help"
                  className="rounded-lg border border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white/10"
                >
                  Help Center
                </Link>
              </div>
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
