"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "REFUNDED";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;

  product: {
    id: string;
    name: string;
    slug: string;
    image: string;

    seller: {
      id: string;
      storeName: string;
      status: string;
    } | null;
  };

  variant: {
    id: string;
    name: string;
    sku: string | null;
  } | null;
};

type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;

  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;

  address: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    country: string;
  };

  payment: {
    id: string;
    reference: string;
    amount: number;
    method: string;
    status: string;
    provider: string | null;
    paidAt: string | null;
  } | null;

  items: OrderItem[];
};

const trackingSteps: {
  status: OrderStatus;
  title: string;
  description: string;
}[] = [
  {
    status: "PENDING",
    title: "Order Placed",
    description: "Your order has been received.",
  },
  {
    status: "CONFIRMED",
    title: "Order Confirmed",
    description: "Your payment and order have been confirmed.",
  },
  {
    status: "PROCESSING",
    title: "Processing",
    description: "The seller is preparing your order.",
  },
  {
    status: "SHIPPED",
    title: "Shipped",
    description: "Your order has left the seller.",
  },
  {
    status: "OUT_FOR_DELIVERY",
    title: "Out for Delivery",
    description: "Your order is on the way to you.",
  },
  {
    status: "DELIVERED",
    title: "Delivered",
    description: "Your order has been delivered.",
  },
];

const statusOrder: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "CONFIRMED":
      return "Confirmed";
    case "PROCESSING":
      return "Processing";
    case "SHIPPED":
      return "Shipped";
    case "OUT_FOR_DELIVERY":
      return "Out for Delivery";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    case "RETURNED":
      return "Returned";
    case "REFUNDED":
      return "Refunded";
    default:
      return status;
  }
}

function getPaymentMethodLabel(method: string) {
  switch (method) {
    case "PAYSTACK":
      return "Paystack";
    case "CASH_ON_DELIVERY":
      return "Cash on Delivery";
    case "BANK_TRANSFER":
      return "Bank Transfer";
    case "USSD":
      return "USSD";
    case "CARD":
      return "Card";
    case "FLUTTERWAVE":
      return "Flutterwave";
    default:
      return method;
  }
}

function getStatusStyles(status: OrderStatus) {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    case "RETURNED":
    case "REFUNDED":
      return "bg-purple-100 text-purple-700";
    case "PROCESSING":
    case "SHIPPED":
    case "OUT_FOR_DELIVERY":
      return "bg-orange-100 text-orange-700";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      return;
    }

    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/account/orders/${encodeURIComponent(orderId)}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            return;
          }

          throw new Error(
            data.message || "Unable to load order."
          );
        }

        setOrder(data.order);
      } catch (err) {
        console.error("LOAD ORDER ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load order details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f5f5]">
        <header className="sticky top-0 z-50 border-b bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
            <Link
              href="/"
              className="text-2xl font-black text-orange-500"
            >
              MARKETPLACE
            </Link>

            <Link
              href="/account/orders"
              className="text-sm font-medium text-gray-700 hover:text-orange-500"
            >
              My Orders
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

            <p className="text-gray-600">
              Loading order details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#f5f5f5]">
        <header className="border-b bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
            <Link
              href="/"
              className="text-2xl font-black text-orange-500"
            >
              MARKETPLACE
            </Link>

            <Link
              href="/account/orders"
              className="text-sm font-medium text-gray-700 hover:text-orange-500"
            >
              My Orders
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-4 py-20">
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl">
              !
            </div>

            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Order Not Found
            </h1>

            <p className="mb-6 text-gray-500">
              {error ||
                "We could not find this order in your account."}
            </p>

            <Link
              href="/account/orders"
              className="inline-flex rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Back to My Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const currentStatusIndex = statusOrder.indexOf(
    order.status
  );

  const isCancelled =
    order.status === "CANCELLED" ||
    order.status === "RETURNED" ||
    order.status === "REFUNDED";

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-orange-500"
          >
            MARKETPLACE
          </Link>

          <div className="flex items-center gap-5">
            <Link
              href="/account"
              className="text-sm font-medium text-gray-700 hover:text-orange-500"
            >
              Account
            </Link>

            <Link
              href="/account/orders"
              className="text-sm font-semibold text-orange-500"
            >
              My Orders
            </Link>

            <Link
              href="/cart"
              className="text-sm font-medium text-gray-700 hover:text-orange-500"
            >
              Cart
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* BREADCRUMB */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link
            href="/"
            className="hover:text-orange-500"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            href="/account/orders"
            className="hover:text-orange-500"
          >
            My Orders
          </Link>

          <span>/</span>

          <span className="font-medium text-gray-900">
            {order.orderNumber}
          </span>
        </div>

        {/* ORDER HEADER */}
        <section className="mb-6 rounded-xl bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-1 text-sm text-gray-500">
                Order Number
              </p>

              <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
                {order.orderNumber}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyles(
                  order.status
                )}`}
              >
                {getStatusLabel(order.status)}
              </span>

              {order.payment && (
                <span
                  className={`text-sm font-medium ${
                    order.payment.status === "PAID"
                      ? "text-green-600"
                      : order.payment.status ===
                        "FAILED"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  Payment: {order.payment.status}
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          <div className="space-y-6">
            {/* TRACKING */}
            <section className="rounded-xl bg-white p-5 shadow-sm md:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Order Tracking
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Follow the progress of your order.
                </p>
              </div>

              {isCancelled ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
                      !
                    </div>

                    <div>
                      <h3 className="font-semibold text-red-700">
                        {getStatusLabel(order.status)}
                      </h3>

                      <p className="mt-1 text-sm text-red-600">
                        This order is no longer progressing
                        through normal delivery.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-0">
                  {trackingSteps.map((step, index) => {
                    const stepIndex = statusOrder.indexOf(
                      step.status
                    );

                    const completed =
                      currentStatusIndex >= stepIndex;

                    const current =
                      order.status === step.status;

                    const last =
                      index === trackingSteps.length - 1;

                    return (
                      <div
                        key={step.status}
                        className="relative flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                              completed
                                ? "border-orange-500 bg-orange-500 text-white"
                                : "border-gray-200 bg-white text-gray-300"
                            }`}
                          >
                            {completed ? (
                              <CheckIcon />
                            ) : (
                              <span className="h-2.5 w-2.5 rounded-full bg-current" />
                            )}
                          </div>

                          {!last && (
                            <div
                              className={`h-14 w-0.5 ${
                                currentStatusIndex >
                                stepIndex
                                  ? "bg-orange-500"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>

                        <div className="pb-8">
                          <h3
                            className={`font-semibold ${
                              completed
                                ? "text-gray-900"
                                : "text-gray-400"
                            }`}
                          >
                            {step.title}

                            {current && (
                              <span className="ml-2 rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-600">
                                Current
                              </span>
                            )}
                          </h3>

                          <p
                            className={`mt-1 text-sm ${
                              completed
                                ? "text-gray-500"
                                : "text-gray-400"
                            }`}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* PRODUCTS */}
            <section className="rounded-xl bg-white shadow-sm">
              <div className="border-b p-5 md:p-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Items in Your Order
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {order.items.length}{" "}
                  {order.items.length === 1
                    ? "product"
                    : "products"}{" "}
                  in this order
                </p>
              </div>

              <div className="divide-y">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 md:p-6"
                  >
                    <div className="flex gap-4">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-gray-50"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="line-clamp-2 font-semibold text-gray-900 hover:text-orange-500"
                        >
                          {item.product.name}
                        </Link>

                        {item.variant && (
                          <p className="mt-2 text-sm text-gray-500">
                            Variant: {item.variant.name}
                          </p>
                        )}

                        {item.variant?.sku && (
                          <p className="mt-1 text-xs text-gray-400">
                            SKU: {item.variant.sku}
                          </p>
                        )}

                        {item.product.seller && (
                          <p className="mt-2 text-sm text-gray-500">
                            Sold by{" "}
                            <span className="font-medium text-gray-700">
                              {
                                item.product.seller
                                  .storeName
                              }
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {formatCurrency(
                            item.price * item.quantity
                          )}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {formatCurrency(item.price)} ×{" "}
                          {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* DELIVERY ADDRESS */}
            <section className="rounded-xl bg-white p-5 shadow-sm md:p-6">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Delivery Address
              </h2>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="font-semibold text-gray-900">
                  {order.address.firstName}{" "}
                  {order.address.lastName}
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {order.address.addressLine1}
                  {order.address.addressLine2 && (
                    <>
                      <br />
                      {order.address.addressLine2}
                    </>
                  )}
                  <br />
                  {order.address.city},{" "}
                  {order.address.state}
                  <br />
                  {order.address.country}
                </p>

                <p className="mt-3 text-sm font-medium text-gray-700">
                  Phone: {order.address.phone}
                </p>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="space-y-6">
            {/* ORDER SUMMARY */}
            <section className="rounded-xl bg-white p-5 shadow-sm md:p-6">
              <h2 className="mb-5 text-lg font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-900">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span className="font-medium text-gray-900">
                    {order.shippingFee === 0
                      ? "Free"
                      : formatCurrency(order.shippingFee)}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                      Discount
                    </span>

                    <span className="font-medium text-green-600">
                      -{formatCurrency(order.discount)}
                    </span>
                  </div>
                )}

                <div className="my-4 border-t" />

                <div className="flex justify-between gap-4">
                  <span className="text-base font-bold text-gray-900">
                    Total
                  </span>

                  <span className="text-lg font-black text-orange-500">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </section>

            {/* PAYMENT */}
            {order.payment && (
              <section className="rounded-xl bg-white p-5 shadow-sm md:p-6">
                <h2 className="mb-5 text-lg font-bold text-gray-900">
                  Payment Information
                </h2>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-500">
                      Payment Method
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {getPaymentMethodLabel(
                        order.payment.method
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">
                      Payment Status
                    </p>

                    <p
                      className={`mt-1 font-semibold ${
                        order.payment.status === "PAID"
                          ? "text-green-600"
                          : order.payment.status ===
                            "FAILED"
                          ? "text-red-600"
                          : "text-orange-500"
                      }`}
                    >
                      {order.payment.status}
                    </p>
                  </div>

                  {order.payment.reference && (
                    <div>
                      <p className="text-gray-500">
                        Payment Reference
                      </p>

                      <p className="mt-1 break-all font-mono text-xs text-gray-700">
                        {order.payment.reference}
                      </p>
                    </div>
                  )}

                  {order.payment.paidAt && (
                    <div>
                      <p className="text-gray-500">
                        Paid On
                      </p>

                      <p className="mt-1 font-medium text-gray-900">
                        {formatDateTime(
                          order.payment.paidAt
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* SELLERS */}
            <section className="rounded-xl bg-white p-5 shadow-sm md:p-6">
              <h2 className="mb-5 text-lg font-bold text-gray-900">
                Store Information
              </h2>

              <div className="space-y-4">
                {Array.from(
                  new Map(
                    order.items
                      .filter(
                        (item) => item.product.seller
                      )
                      .map((item) => [
                        item.product.seller!.id,
                        item.product.seller!,
                      ])
                  ).values()
                ).map((seller) => (
                  <div
                    key={seller.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <p className="font-semibold text-gray-900">
                      {seller.storeName}
                    </p>

                    <p className="mt-1 text-xs text-green-600">
                      Verified seller
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ACTIONS */}
            <section className="rounded-xl bg-white p-5 shadow-sm md:p-6">
              <div className="space-y-3">
                <Link
                  href="/account/orders"
                  className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-500"
                >
                  Back to My Orders
                </Link>

                <Link
                  href="/"
                  className="flex w-full items-center justify-center rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Continue Shopping
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-12 bg-[#111827] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-black text-orange-500">
              MARKETPLACE
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Everything you need, all in one marketplace.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">
              Customer Service
            </h4>

            <div className="mt-4 space-y-2 text-sm text-gray-400">
              <Link
                href="/account/orders"
                className="block hover:text-white"
              >
                My Orders
              </Link>

              <Link
                href="/account"
                className="block hover:text-white"
              >
                My Account
              </Link>

              <Link
                href="/cart"
                className="block hover:text-white"
              >
                Shopping Cart
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">
              Marketplace
            </h4>

            <div className="mt-4 space-y-2 text-sm text-gray-400">
              <Link
                href="/"
                className="block hover:text-white"
              >
                Home
              </Link>

              <Link
                href="/sell"
                className="block hover:text-white"
              >
                Sell on Marketplace
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">
              Need Help?
            </h4>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Contact our customer support team if you need
              assistance with your order.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800">
          <div className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} MARKETPLACE. All
            rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}