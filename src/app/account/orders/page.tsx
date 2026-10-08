
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
  } | null;
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  createdAt: string;
  payment: {
    reference: string;
    method: string;
    status: string;
  } | null;
  address: {
    firstName: string;
    lastName: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    country: string;
  };
  items: OrderItem[];
};

const trackingSteps = [
  {
    status: "PENDING",
    title: "Order Placed",
    description: "Your order has been received.",
  },
  {
    status: "CONFIRMED",
    title: "Order Confirmed",
    description: "The seller has confirmed your order.",
  },
  {
    status: "PROCESSING",
    title: "Processing",
    description: "Your order is being prepared.",
  },
  {
    status: "SHIPPED",
    title: "Shipped",
    description: "Your order has left the seller.",
  },
  {
    status: "OUT_FOR_DELIVERY",
    title: "Out for Delivery",
    description: "Your order is on its way to you.",
  },
  {
    status: "DELIVERED",
    title: "Delivered",
    description: "Your order has been delivered.",
  },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/account/orders", {
          cache: "no-store",
        });

        const data = await response.json();

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load orders."
          );
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("LOAD ORDERS ERROR:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  function formatPrice(amount: number) {
    const naira = String.fromCharCode(0x20a6);

    return `${naira}${amount.toLocaleString("en-NG")}`;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatShortDate(date: string) {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700 border-green-200";

      case "CANCELLED":
      case "REFUNDED":
      case "RETURNED":
        return "bg-red-100 text-red-700 border-red-200";

      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "PROCESSING":
      case "CONFIRMED":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "DELIVERED":
        return "✓";

      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return "🚚";

      case "PROCESSING":
        return "⚙️";

      case "CONFIRMED":
        return "✓";

      case "CANCELLED":
      case "REFUNDED":
      case "RETURNED":
        return "×";

      default:
        return "🕐";
    }
  }

  function getTrackingIndex(status: string) {
    return trackingSteps.findIndex(
      (step) => step.status === status
    );
  }

  function isTrackingStepComplete(
    orderStatus: string,
    stepStatus: string
  ) {
    const currentIndex = getTrackingIndex(orderStatus);
    const stepIndex = getTrackingIndex(stepStatus);

    if (currentIndex === -1 || stepIndex === -1) {
      return false;
    }

    return currentIndex >= stepIndex;
  }

  function toggleOrder(orderId: string) {
    setExpandedOrder((current) =>
      current === orderId ? null : orderId
    );
  }

  const filteredOrders = useMemo(() => {
    if (statusFilter === "ALL") {
      return orders;
    }

    return orders.filter(
      (order) => order.status === statusFilter
    );
  }, [orders, statusFilter]);

  const totalSpent = useMemo(() => {
    return orders
      .filter(
        (order) =>
          order.status !== "CANCELLED" &&
          order.status !== "REFUNDED"
      )
      .reduce((sum, order) => sum + order.total, 0);
  }, [orders]);

  const deliveredCount = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  const activeCount = orders.filter(
    (order) =>
      !["DELIVERED", "CANCELLED", "REFUNDED", "RETURNED"].includes(
        order.status
      )
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="hidden bg-gray-950 text-xs text-gray-300 sm:block">
          <div className="mx-auto flex max-w-7xl justify-between px-4 py-2">
            <span>Welcome to Marketplace</span>

            <div className="flex gap-5">
              <span>Sell on Marketplace</span>
              <span>Help Center</span>
              <span>Track Order</span>
            </div>
          </div>
        </div>

        <header className="bg-orange-600 text-white shadow-lg">
          <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-2">
            <Link
              href="/"
              className="text-xl font-black sm:text-2xl"
            >
              MARKETPLACE
            </Link>

            <Link
              href="/account"
              className="rounded-lg bg-orange-700 px-4 py-2 text-sm font-bold"
            >
              ← My Account
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-600" />

            <p className="text-sm font-medium text-gray-600">
              Loading your orders...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* TOP UTILITY BAR */}

      <div className="hidden bg-gray-950 text-xs text-gray-300 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <p>Welcome to Marketplace</p>

          <div className="flex items-center gap-5">
            <Link
              href="/seller"
              className="transition hover:text-white"
            >
              Sell on Marketplace
            </Link>

            <Link
              href="/"
              className="transition hover:text-white"
            >
              Help Center
            </Link>

            <Link
              href="/orders"
              className="transition hover:text-white"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* HEADER */}

      <header className="sticky top-0 z-40 bg-orange-600 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex min-h-16 items-center gap-4 py-2">
            <Link
              href="/"
              className="shrink-0 text-xl font-black tracking-tight sm:text-2xl"
            >
              MARKETPLACE
            </Link>

            <div className="hidden flex-1 md:block">
              <div className="mx-auto max-w-2xl overflow-hidden rounded-md bg-white shadow-sm">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Search products, brands and categories..."
                    className="min-w-0 flex-1 px-4 py-3 text-sm text-gray-900 outline-none"
                  />

                  <button
                    type="button"
                    className="bg-orange-700 px-6 text-sm font-bold transition hover:bg-orange-800"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="hidden text-sm font-semibold transition hover:text-orange-100 sm:block"
              >
                Home
              </Link>

              <Link
                href="/account"
                className="hidden text-sm font-semibold transition hover:text-orange-100 sm:block"
              >
                Account
              </Link>

              <Link
                href="/cart"
                className="rounded-lg bg-orange-700 px-3 py-2 text-sm font-bold sm:px-4"
              >
                🛒 Cart
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}

      <nav className="bg-orange-700 text-white">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-3 text-sm font-semibold whitespace-nowrap">
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

      {/* HERO */}

      <section className="bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              My Marketplace
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              My Orders
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              View your purchases, track deliveries, review
              payment information and manage your orders.
            </p>
          </div>
        </div>
      </section>

      {/* BREADCRUMB */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-500 transition hover:text-orange-600"
            >
              Home
            </Link>

            <span className="text-gray-400">/</span>

            <Link
              href="/account"
              className="text-gray-500 transition hover:text-orange-600"
            >
              My Account
            </Link>

            <span className="text-gray-400">/</span>

            <span className="font-semibold text-gray-900">
              Orders
            </span>
          </div>
        </div>
      </div>

      {/* MAIN */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        {/* PAGE TOP */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              Purchase History
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
              Your Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {orders.length}{" "}
              {orders.length === 1 ? "order" : "orders"} in
              your account
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              Continue Shopping
            </Link>

            <Link
              href="/cart"
              className="rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
            >
              View Cart
            </Link>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-red-800">
                Unable to load orders
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* STAT CARDS */}

        {orders.length > 0 && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Total Orders
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
                  🛍️
                </span>
              </div>

              <p className="mt-4 text-2xl font-black text-gray-900">
                {orders.length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                All purchases
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Active Orders
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                  🚚
                </span>
              </div>

              <p className="mt-4 text-2xl font-black text-gray-900">
                {activeCount}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Currently processing
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Delivered
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                  ✓
                </span>
              </div>

              <p className="mt-4 text-2xl font-black text-gray-900">
                {deliveredCount}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Successfully delivered
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Total Spent
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-100">
                  ₦
                </span>
              </div>

              <p className="mt-4 text-xl font-black text-orange-600">
                {formatPrice(totalSpent)}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Excluding cancelled/refunded
              </p>
            </div>
          </div>
        )}

        {/* FILTERS */}

        {orders.length > 0 && (
          <div className="mb-6 overflow-x-auto rounded-xl bg-white p-4 shadow-sm">
            <div className="flex min-w-max items-center gap-2">
              <span className="mr-2 text-sm font-bold text-gray-700">
                Filter:
              </span>

              {[
                ["ALL", "All Orders"],
                ["PENDING", "Pending"],
                ["CONFIRMED", "Confirmed"],
                ["PROCESSING", "Processing"],
                ["SHIPPED", "Shipped"],
                ["OUT_FOR_DELIVERY", "Out for Delivery"],
                ["DELIVERED", "Delivered"],
                ["CANCELLED", "Cancelled"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatusFilter(value)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    statusFilter === value
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}

        {!error && orders.length === 0 && (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="bg-gradient-to-r from-orange-50 to-white px-6 py-16 text-center sm:px-10 sm:py-20">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-5xl">
                🛍️
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                Purchase History
              </p>

              <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
                You have no orders yet
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">
                Your orders will appear here after you make
                a purchase. Start exploring our marketplace
                and discover products from trusted sellers.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="rounded-lg bg-orange-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
                >
                  Start Shopping
                </Link>

                <Link
                  href="/deals"
                  className="rounded-lg border border-gray-300 px-7 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  Explore Deals
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* FILTER EMPTY */}

        {!error &&
          orders.length > 0 &&
          filteredOrders.length === 0 && (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <div className="text-4xl">🔎</div>

              <h2 className="mt-4 text-xl font-black text-gray-900">
                No orders found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                There are no orders matching this status.
              </p>

              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className="mt-5 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700"
              >
                View All Orders
              </button>
            </div>
          )}

        {/* ORDERS */}

        {!error && filteredOrders.length > 0 && (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const isExpanded =
                expandedOrder === order.id;

              const firstItem = order.items[0];

              return (
                <section
                  key={order.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* ORDER HEADER */}

                  <div className="border-b border-gray-100 bg-white px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex gap-4">
                        {firstItem?.product?.image ? (
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            <img
                              src={firstItem.product.image}
                              alt={firstItem.productName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-2xl">
                            🛍️
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Order Number
                          </p>

                          <Link
                            href={`/account/orders/${order.id}`}
                            className="mt-1 block truncate font-black text-orange-600 hover:underline"
                          >
                            {order.orderNumber}
                          </Link>

                          <p className="mt-1 text-xs text-gray-500">
                            Placed {formatShortDate(order.createdAt)}
                            {" · "}
                            {order.items.length}{" "}
                            {order.items.length === 1
                              ? "product"
                              : "products"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClass(
                            order.status
                          )}`}
                        >
                          <span>
                            {getStatusIcon(order.status)}
                          </span>

                          {order.status.replaceAll(
                            "_",
                            " "
                          )}
                        </span>

                        <span className="text-lg font-black text-gray-900">
                          {formatPrice(order.total)}
                        </span>

                        <Link
                          href={`/account/orders/${order.id}`}
                          className="rounded-lg bg-orange-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-orange-700"
                        >
                          View Details
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            toggleOrder(order.id)
                          }
                          className="rounded-lg border border-gray-300 px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
                        >
                          {isExpanded
                            ? "Hide"
                            : "Track Order"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* QUICK PRODUCT PREVIEW */}

                  {!isExpanded && (
                    <div className="px-5 py-4 sm:px-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          {order.items.slice(0, 3).map((item) => (
                            <div
                              key={item.id}
                              className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                            >
                              {item.product?.image ? (
                                <img
                                  src={item.product.image}
                                  alt={item.productName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                  —
                                </div>
                              )}
                            </div>
                          ))}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-800">
                              {firstItem?.productName}
                              {order.items.length > 1 &&
                                ` + ${
                                  order.items.length - 1
                                } more`}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {order.payment?.status ===
                              "PAID"
                                ? "Payment completed"
                                : "Payment pending"}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            toggleOrder(order.id)
                          }
                          className="text-sm font-bold text-orange-600 hover:text-orange-700"
                        >
                          Track & View Summary →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* EXPANDED ORDER */}

                  {isExpanded && (
                    <div className="p-5 sm:p-6">
                      {/* TRACKING */}

                      <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
                        <div className="mb-7">
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                            Delivery Status
                          </p>

                          <h2 className="mt-1 text-lg font-black text-gray-900">
                            Order Tracking
                          </h2>

                          <p className="mt-1 text-sm text-gray-500">
                            Follow the progress of your order.
                          </p>
                        </div>

                        <div className="relative">
                          {trackingSteps.map(
                            (step, index) => {
                              const complete =
                                isTrackingStepComplete(
                                  order.status,
                                  step.status
                                );

                              const isCurrent =
                                order.status ===
                                step.status;

                              const isLast =
                                index ===
                                trackingSteps.length - 1;

                              return (
                                <div
                                  key={step.status}
                                  className="relative flex gap-4 pb-7 last:pb-0"
                                >
                                  {!isLast && (
                                    <div
                                      className={`absolute left-[11px] top-6 h-full w-0.5 ${
                                        complete
                                          ? "bg-orange-500"
                                          : "bg-gray-200"
                                      }`}
                                    />
                                  )}

                                  <div
                                    className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                                      complete
                                        ? "border-orange-500 bg-orange-500 text-white"
                                        : "border-gray-300 bg-white text-transparent"
                                    }`}
                                  >
                                    {complete && (
                                      <span className="text-xs font-bold">
                                        ✓
                                      </span>
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                      <h3
                                        className={`font-bold ${
                                          complete
                                            ? "text-gray-900"
                                            : "text-gray-400"
                                        }`}
                                      >
                                        {step.title}
                                      </h3>

                                      {isCurrent && (
                                        <span className="w-fit rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-600">
                                          Current Status
                                        </span>
                                      )}
                                    </div>

                                    <p
                                      className={`mt-1 text-sm ${
                                        complete
                                          ? "text-gray-600"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      {step.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>

                        {order.status === "DELIVERED" && (
                          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                            <p className="font-bold text-green-700">
                              ✓ Your order has been delivered
                              successfully.
                            </p>
                          </div>
                        )}

                        {(order.status === "CANCELLED" ||
                          order.status === "REFUNDED" ||
                          order.status === "RETURNED") && (
                          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                            <p className="font-bold text-red-700">
                              This order is{" "}
                              {order.status.toLowerCase()}.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* PRODUCTS */}

                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                              Order Contents
                            </p>

                            <h3 className="mt-1 text-lg font-black text-gray-900">
                              Products
                            </h3>
                          </div>

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                            {order.items.length}{" "}
                            {order.items.length === 1
                              ? "item"
                              : "items"}
                          </span>
                        </div>

                        <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex gap-4 p-4"
                            >
                              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                {item.product?.image ? (
                                  <img
                                    src={item.product.image}
                                    alt={item.productName}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <img
                                    src={FALLBACK_IMAGE}
                                    alt={item.productName}
                                    className="h-full w-full object-cover"
                                  />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <Link
                                  href={`/product/${
                                    item.product?.slug || ""
                                  }`}
                                  className="font-bold text-gray-900 transition hover:text-orange-600"
                                >
                                  {item.productName}
                                </Link>

                                <p className="mt-1 text-sm text-gray-500">
                                  Quantity: {item.quantity}
                                </p>

                                <p className="mt-1 text-sm text-gray-600">
                                  {formatPrice(item.unitPrice)} each
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-base font-black text-gray-900">
                                  {formatPrice(item.totalPrice)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* INFORMATION GRID */}

                      <div className="mt-6 grid gap-5 lg:grid-cols-3">
                        {/* DELIVERY */}

                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                              🚚
                            </div>

                            <h3 className="font-black text-gray-900">
                              Delivery Address
                            </h3>
                          </div>

                          <div className="mt-4 space-y-1 text-sm leading-6 text-gray-600">
                            <p className="font-bold text-gray-900">
                              {order.address.firstName}{" "}
                              {order.address.lastName}
                            </p>

                            <p>{order.address.phone}</p>

                            <p>{order.address.addressLine1}</p>

                            <p>
                              {order.address.city},{" "}
                              {order.address.state}
                            </p>

                            <p>{order.address.country}</p>
                          </div>
                        </div>

                        {/* PAYMENT */}

                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                              🔒
                            </div>

                            <h3 className="font-black text-gray-900">
                              Payment
                            </h3>
                          </div>

                          <div className="mt-4 space-y-2 text-sm text-gray-600">
                            <p>
                              Method:{" "}
                              <span className="font-bold text-gray-900">
                                {order.payment?.method ===
                                "CASH_ON_DELIVERY"
                                  ? "Cash on Delivery"
                                  : order.payment?.method ||
                                    "Not available"}
                              </span>
                            </p>

                            <p>
                              Status:{" "}
                              <span className="font-bold text-gray-900">
                                {order.payment?.status ||
                                  "Pending"}
                              </span>
                            </p>

                            {order.payment?.reference && (
                              <p className="break-all">
                                Reference:{" "}
                                <span className="font-semibold">
                                  {order.payment.reference}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* TOTAL */}

                        <div className="rounded-xl border border-gray-200 bg-gray-950 p-5 text-white">
                          <p className="text-xs font-bold uppercase tracking-wider text-orange-400">
                            Order Total
                          </p>

                          <p className="mt-3 text-2xl font-black">
                            {formatPrice(order.total)}
                          </p>

                          <div className="mt-4 space-y-2 border-t border-gray-800 pt-4 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Subtotal
                              </span>

                              <span>
                                {formatPrice(order.subtotal)}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Delivery
                              </span>

                              <span>
                                {formatPrice(
                                  order.shippingFee
                                )}
                              </span>
                            </div>

                            {order.discount > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">
                                  Discount
                                </span>

                                <span className="text-green-400">
                                  -{formatPrice(order.discount)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="inline-flex items-center justify-center rounded-lg border border-orange-600 px-5 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-50"
                        >
                          View Full Order Details →
                        </Link>

                        <Link
                          href="/"
                          className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
                        >
                          Continue Shopping
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            toggleOrder(order.id)
                          }
                          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                        >
                          Hide Order
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* DISCOVER MORE */}

      <section className="bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                Marketplace
              </p>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                Discover more products
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                Explore deals, new arrivals, official stores
                and top-selling products from trusted sellers.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/deals"
                className="rounded-lg bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
              >
                Explore Deals
              </Link>

              <Link
                href="/new-arrivals"
                className="rounded-lg border border-gray-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-900"
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* BRAND */}

            <div>
              <h3 className="text-xl font-black tracking-tight">
                MARKETPLACE
              </h3>

              <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
                Your trusted online marketplace for quality
                products from verified sellers.
              </p>

              <div className="mt-6 flex gap-3">
                <Link
                  href="/"
                  className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold transition hover:bg-orange-700"
                >
                  Shop Now
                </Link>

                <Link
                  href="/seller"
                  className="rounded-lg border border-gray-700 px-4 py-2 text-xs font-bold text-gray-300 transition hover:border-gray-500 hover:text-white"
                >
                  Sell With Us
                </Link>
              </div>
            </div>

            {/* CUSTOMER SERVICE */}

            <div>
              <h4 className="font-bold">
                Customer Service
              </h4>

              <div className="mt-4 space-y-3 text-sm text-gray-400">
                <Link
                  href="/"
                  className="block transition hover:text-white"
                >
                  Help Center
                </Link>

                <Link
                  href="/contact"
                  className="block transition hover:text-white"
                >
                  Contact Us
                </Link>

                <Link
                  href="/orders"
                  className="block transition hover:text-white"
                >
                  Track Order
                </Link>

                <Link
                  href="/"
                  className="block transition hover:text-white"
                >
                  Returns & Refunds
                </Link>
              </div>
            </div>

            {/* MARKETPLACE */}

            <div>
              <h4 className="font-bold">
                Marketplace
              </h4>

              <div className="mt-4 space-y-3 text-sm text-gray-400">
                <Link
                  href="/"
                  className="block transition hover:text-white"
                >
                  Home
                </Link>

                <Link
                  href="/"
                  className="block transition hover:text-white"
                >
                  Categories
                </Link>

                <Link
                  href="/official-stores"
                  className="block transition hover:text-white"
                >
                  Official Stores
                </Link>

                <Link
                  href="/deals"
                  className="block transition hover:text-white"
                >
                  Deals
                </Link>

                <Link
                  href="/new-arrivals"
                  className="block transition hover:text-white"
                >
                  New Arrivals
                </Link>

                <Link
                  href="/top-selling"
                  className="block transition hover:text-white"
                >
                  Top Selling
                </Link>

                <Link
                  href="/flash-sales"
                  className="block transition hover:text-white"
                >
                  Flash Sales
                </Link>
              </div>
            </div>

            {/* SHOP & SELL */}

            <div>
              <h4 className="font-bold">
                Shop & Sell
              </h4>

              <div className="mt-4 space-y-3 text-sm text-gray-400">
                <Link
                  href="/cart"
                  className="block transition hover:text-white"
                >
                  Shopping Cart
                </Link>

                <Link
                  href="/orders"
                  className="block transition hover:text-white"
                >
                  My Orders
                </Link>

                <Link
                  href="/seller"
                  className="block transition hover:text-white"
                >
                  Become a Seller
                </Link>

                <Link
                  href="/seller"
                  className="block transition hover:text-white"
                >
                  Seller Center
                </Link>

                <Link
                  href="/"
                  className="block transition hover:text-white"
                >
                  Seller Policies
                </Link>

                <Link
                  href="/"
                  className="block transition hover:text-white"
                >
                  Seller Support
                </Link>
              </div>
            </div>
          </div>

          {/* FOOTER BOTTOM */}

          <div className="mt-12 flex flex-col gap-4 border-t border-gray-800 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Marketplace. All
              rights reserved.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                href="/"
                className="transition hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                href="/"
                className="transition hover:text-white"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/"
                className="transition hover:text-white"
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
