"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;

  variant: {
    id: string;
    name: string;
    sku: string | null;
    price: number | null;
    stockQuantity: number;
    attributes: unknown;
  } | null;

  product: {
    id: string;
    name: string;
    slug: string;
    sellerId: string;

    seller: {
      id: string;
      storeName: string;
      status: string;
    } | null;

    category: {
      id: string;
      name: string;
    } | null;

    image: string | null;
  };
};

type AdminOrder = {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;

  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
  } | null;

  shippingAddress: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    country: string;
  } | null;

  payment: {
    id: string;
    reference: string;
    amount: number;
    method: string;
    status: string;
    paidAt: string | null;
  } | null;

  shipment: {
    id: string;
    trackingNumber: string | null;
    courier: string | null;
    status: string;
    shippedAt: string | null;
    deliveredAt: string | null;
  } | null;

  items: OrderItem[];

  summary: {
    itemCount: number;
    quantity: number;
    subtotal: number;
    commission: number;
    earnings: number;
  };

  commission: {
    rate: number;
    amount: number;
  } | null;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  orders?: AdminOrder[];
  count?: number;

  summary?: {
    totalOrders: number;
    totalSales: number;
    totalCommission: number;
    pendingOrders: number;
    deliveredOrders: number;
  };
};

const statusOptions = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED",
];

const updateStatusOptions = statusOptions.filter(
  (status) => status !== "ALL"
);

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function statusClasses(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";

    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";

    case "PROCESSING":
      return "bg-indigo-100 text-indigo-800";

    case "SHIPPED":
      return "bg-purple-100 text-purple-800";

    case "OUT_FOR_DELIVERY":
      return "bg-orange-100 text-orange-800";

    case "DELIVERED":
      return "bg-green-100 text-green-800";

    case "CANCELLED":
      return "bg-red-100 text-red-800";

    case "RETURNED":
      return "bg-pink-100 text-pink-800";

    case "REFUNDED":
      return "bg-gray-100 text-gray-800";

    default:
      return "bg-gray-100 text-gray-800";
  }
}

function paymentStatusClasses(status: string) {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-800";

    case "FAILED":
      return "bg-red-100 text-red-800";

    case "REFUNDED":
      return "bg-gray-100 text-gray-800";

    case "PROCESSING":
      return "bg-blue-100 text-blue-800";

    default:
      return "bg-yellow-100 text-yellow-800";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] =
    useState<AdminOrder[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [expandedOrder, setExpandedOrder] =
    useState<string | null>(null);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [selectedStatuses, setSelectedStatuses] =
    useState<Record<string, string>>({});

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/orders",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data: ApiResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load orders."
        );
      }

      const loadedOrders =
        data.orders || [];

      setOrders(loadedOrders);

      const initialStatuses: Record<
        string,
        string
      > = {};

      loadedOrders.forEach((order) => {
        initialStatuses[order.id] =
          order.status;
      });

      setSelectedStatuses(
        initialStatuses
      );
    } catch (error) {
      console.error(
        "LOAD ADMIN ORDERS ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const searchTerm =
      search.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName =
        `${order.customer?.firstName || ""} ${
          order.customer?.lastName || ""
        }`
          .trim()
          .toLowerCase();

      const customerEmail =
        order.customer?.email?.toLowerCase() ||
        "";

      const matchesSearch =
        !searchTerm ||
        order.orderNumber
          .toLowerCase()
          .includes(searchTerm) ||
        customerName.includes(searchTerm) ||
        customerEmail.includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" ||
        order.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    orders,
    search,
    statusFilter,
  ]);

  const totalSales = orders.reduce(
    (sum, order) =>
      sum + order.summary.subtotal,
    0
  );

  const totalCommission = orders.reduce(
    (sum, order) =>
      sum + order.summary.commission,
    0
  );

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "PENDING" ||
      order.status === "CONFIRMED" ||
      order.status === "PROCESSING"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.status === "DELIVERED"
  ).length;

  async function updateOrderStatus(
    orderId: string
  ) {
    const selectedStatus =
      selectedStatuses[orderId];

    const currentOrder =
      orders.find(
        (order) =>
          order.id === orderId
      );

    if (!currentOrder) {
      return;
    }

    if (!selectedStatus) {
      return;
    }

    if (
      selectedStatus ===
      currentOrder.status
    ) {
      setMessage(
        "The order is already using that status."
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);

      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to change order ${currentOrder.orderNumber} from "${formatStatus(
          currentOrder.status
        )}" to "${formatStatus(
          selectedStatus
        )}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(orderId);
      setError("");
      setMessage("");

      const response = await fetch(
        "/api/admin/orders",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            orderId,
            status: selectedStatus,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to update order status."
        );
      }

      const updatedAt =
        data.order?.updatedAt ||
        new Date().toISOString();

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: selectedStatus,
                updatedAt,
              }
            : order
        )
      );

      setSelectedStatuses((current) => ({
        ...current,
        [orderId]: selectedStatus,
      }));

      setMessage(
        `Order ${currentOrder.orderNumber} updated to ${formatStatus(
          selectedStatus
        )}.`
      );

      setTimeout(() => {
        setMessage("");
      }, 4000);
    } catch (error) {
      console.error(
        "UPDATE ADMIN ORDER ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update order."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function handleStatusSelection(
    orderId: string,
    status: string
  ) {
    setSelectedStatuses((current) => ({
      ...current,
      [orderId]: status,
    }));

    setMessage("");
    setError("");
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link
              href="/admin"
              className="text-2xl font-black tracking-tight text-orange-600"
            >
              MARKETPLACE
            </Link>

            <p className="mt-1 text-sm text-gray-500">
              Administration
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/products"
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
            >
              Products
            </Link>

            <Link
              href="/admin/orders"
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              Orders
            </Link>

            <Link
              href="/"
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
            >
              View Store
            </Link>

            <form
              action="/api/auth/logout"
              method="POST"
            >
              <button
                type="submit"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <p className="text-sm font-medium text-orange-600">
            Admin / Orders
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Orders
          </h1>

          <p className="mt-2 text-gray-500">
            Manage and monitor all customer
            orders across the marketplace.
          </p>
        </div>

        {/* MESSAGES */}
        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-red-800">
                  Unable to load orders
                </h2>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={loadOrders}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* STATS */}
        {!loading && !error && (
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Total Orders
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Pending
              </p>

              <p className="mt-2 text-2xl font-bold text-orange-600">
                {pendingOrders}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Delivered
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {deliveredOrders}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Total Sales
              </p>

              <p className="mt-2 text-xl font-bold text-gray-900">
                {formatCurrency(
                  totalSales
                )}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Commission
              </p>

              <p className="mt-2 text-xl font-bold text-orange-600">
                {formatCurrency(
                  totalCommission
                )}
              </p>
            </div>
          </div>
        )}

        {/* SEARCH / FILTER */}
        {!loading &&
          !error &&
          orders.length > 0 && (
            <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    🔎
                  </span>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search by order number, customer name or email..."
                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                  className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  {statusOptions.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status === "ALL"
                          ? "All Statuses"
                          : formatStatus(
                              status
                            )}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          )}

        {/* LOADING */}
        {loading && (
          <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

            <p className="font-medium text-gray-700">
              Loading marketplace orders...
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="rounded-2xl border bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">
                📦
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                No orders yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Customer orders will appear
                here once purchases are made.
              </p>
            </div>
          )}

        {/* NO RESULTS */}
        {!loading &&
          !error &&
          orders.length > 0 &&
          filteredOrders.length === 0 && (
            <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
              <div className="text-4xl">
                🔎
              </div>

              <h2 className="mt-4 text-lg font-bold text-gray-900">
                No matching orders
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Try another search term or
                status filter.
              </p>
            </div>
          )}

        {/* ORDERS */}
        {!loading &&
          !error &&
          filteredOrders.length > 0 && (
            <div className="space-y-4">
              {filteredOrders.map(
                (order) => {
                  const customerName =
                    `${order.customer?.firstName || ""} ${
                      order.customer?.lastName || ""
                    }`.trim() ||
                    "Customer";

                  const isExpanded =
                    expandedOrder ===
                    order.id;

                  const selectedStatus =
                    selectedStatuses[
                      order.id
                    ] ||
                    order.status;

                  const hasStatusChanged =
                    selectedStatus !==
                    order.status;

                  const isUpdating =
                    updatingId ===
                    order.id;

                  return (
                    <div
                      key={order.id}
                      className="overflow-hidden rounded-xl border bg-white shadow-sm"
                    >
                      {/* ORDER HEADER */}
                      <div className="p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-xl">
                              📦
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h2 className="font-bold text-gray-900">
                                  {
                                    order.orderNumber
                                  }
                                </h2>

                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses(
                                    order.status
                                  )}`}
                                >
                                  {formatStatus(
                                    order.status
                                  )}
                                </span>
                              </div>

                              <p className="mt-1 text-sm text-gray-500">
                                {formatDate(
                                  order.createdAt
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-start gap-1 lg:items-end">
                            <p className="text-lg font-bold text-gray-900">
                              {formatCurrency(
                                order.summary
                                  .subtotal
                              )}
                            </p>

                            <p className="text-xs text-gray-500">
                              {
                                order.summary
                                  .quantity
                              }{" "}
                              item
                              {order.summary
                                .quantity !==
                              1
                                ? "s"
                                : ""}
                            </p>
                          </div>
                        </div>

                        {/* STATUS CONTROL */}
                        <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
                                Order Status
                              </p>

                              <p className="mt-1 text-sm text-gray-600">
                                Current status:{" "}
                                <span className="font-semibold text-gray-900">
                                  {formatStatus(
                                    order.status
                                  )}
                                </span>
                              </p>
                            </div>

                            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                              <select
                                value={
                                  selectedStatus
                                }
                                disabled={
                                  isUpdating
                                }
                                onChange={(
                                  event
                                ) =>
                                  handleStatusSelection(
                                    order.id,
                                    event
                                      .target
                                      .value
                                  )
                                }
                                className="w-full min-w-[210px] cursor-pointer rounded-lg border-2 border-orange-300 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                              >
                                {updateStatusOptions.map(
                                  (
                                    status
                                  ) => (
                                    <option
                                      key={
                                        status
                                      }
                                      value={
                                        status
                                      }
                                    >
                                      {formatStatus(
                                        status
                                      )}
                                    </option>
                                  )
                                )}
                              </select>

                              <button
                                type="button"
                                disabled={
                                  isUpdating ||
                                  !hasStatusChanged
                                }
                                onClick={() =>
                                  updateOrderStatus(
                                    order.id
                                  )
                                }
                                className="inline-flex min-w-[150px] cursor-pointer items-center justify-center rounded-lg bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                              >
                                {isUpdating
                                  ? "Updating..."
                                  : hasStatusChanged
                                  ? "Update Status"
                                  : "No Changes"}
                              </button>
                            </div>
                          </div>

                          {hasStatusChanged && (
                            <div className="mt-3 rounded-lg border border-orange-200 bg-white px-4 py-3 text-sm text-gray-600">
                              New status selected:{" "}
                              <span className="font-bold text-orange-600">
                                {formatStatus(
                                  selectedStatus
                                )}
                              </span>
                              . Click{" "}
                              <span className="font-semibold">
                                Update Status
                              </span>{" "}
                              to save the change.
                            </div>
                          )}
                        </div>

                        {/* CUSTOMER / PAYMENT / SELLER */}
                        <div className="mt-5 grid gap-4 border-t pt-5 md:grid-cols-3">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Customer
                            </p>

                            <p className="mt-1 font-semibold text-gray-900">
                              {customerName}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              {order.customer
                                ?.email ||
                                "No email"}
                            </p>

                            {order.customer
                              ?.phone && (
                              <p className="mt-1 text-sm text-gray-500">
                                {
                                  order
                                    .customer
                                    .phone
                                }
                              </p>
                            )}
                          </div>

                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Payment
                            </p>

                            {order.payment ? (
                              <>
                                <span
                                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStatusClasses(
                                    order
                                      .payment
                                      .status
                                  )}`}
                                >
                                  {formatStatus(
                                    order
                                      .payment
                                      .status
                                  )}
                                </span>

                                <p className="mt-1 text-sm text-gray-500">
                                  {
                                    order
                                      .payment
                                      .method
                                  }
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                  Ref:{" "}
                                  {
                                    order
                                      .payment
                                      .reference
                                  }
                                </p>
                              </>
                            ) : (
                              <p className="mt-1 text-sm text-gray-500">
                                No payment record
                              </p>
                            )}
                          </div>

                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Marketplace Commission
                            </p>

                            <p className="mt-1 font-bold text-orange-600">
                              {formatCurrency(
                                order.summary
                                  .commission
                              )}
                            </p>

                            {order.commission && (
                              <p className="mt-1 text-xs text-gray-500">
                                Rate:{" "}
                                {
                                  order
                                    .commission
                                    .rate
                                }
                                %
                              </p>
                            )}
                          </div>
                        </div>

                        {/* PRODUCTS */}
                        <div className="mt-5 border-t pt-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-gray-900">
                              Order Products
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                setExpandedOrder(
                                  isExpanded
                                    ? null
                                    : order.id
                                )
                              }
                              className="cursor-pointer text-sm font-semibold text-orange-600 hover:text-orange-700"
                            >
                              {isExpanded
                                ? "Hide Details"
                                : "View Details"}
                            </button>
                          </div>

                          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                            {order.items.map(
                              (item) => (
                                <div
                                  key={
                                    item.id
                                  }
                                  className="flex min-w-[280px] items-center gap-3 rounded-lg border bg-gray-50 p-3"
                                >
                                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                    {item
                                      .product
                                      .image ? (
                                      <img
                                        src={
                                          item
                                            .product
                                            .image
                                        }
                                        alt={
                                          item
                                            .product
                                            .name
                                        }
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-full items-center justify-center text-xl">
                                        📦
                                      </div>
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                                      {
                                        item
                                          .product
                                          .name
                                      }
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                      Seller:{" "}
                                      {item
                                        .product
                                        .seller
                                        ?.storeName ||
                                        "Unknown seller"}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                      Qty:{" "}
                                      {
                                        item.quantity
                                      }
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-orange-600">
                                      {formatCurrency(
                                        item.totalPrice
                                      )}
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      {/* EXPANDED DETAILS */}
                      {isExpanded && (
                        <div className="border-t bg-gray-50 p-5">
                          <div className="grid gap-6 lg:grid-cols-3">
                            {/* PRODUCTS */}
                            <div>
                              <h3 className="font-bold text-gray-900">
                                Order Items
                              </h3>

                              <div className="mt-3 space-y-3">
                                {order.items.map(
                                  (item) => (
                                    <div
                                      key={
                                        item.id
                                      }
                                      className="rounded-lg border bg-white p-4"
                                    >
                                      <div className="flex gap-3">
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                          {item
                                            .product
                                            .image ? (
                                            <img
                                              src={
                                                item
                                                  .product
                                                  .image
                                              }
                                              alt={
                                                item
                                                  .product
                                                  .name
                                              }
                                              className="h-full w-full object-cover"
                                            />
                                          ) : (
                                            <div className="flex h-full items-center justify-center">
                                              📦
                                            </div>
                                          )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                          <p className="font-semibold text-gray-900">
                                            {
                                              item
                                                .product
                                                .name
                                            }
                                          </p>

                                          <p className="mt-1 text-sm text-gray-500">
                                            Seller:{" "}
                                            {item
                                              .product
                                              .seller
                                              ?.storeName ||
                                              "Unknown seller"}
                                          </p>

                                          <p className="mt-1 text-sm text-gray-500">
                                            Category:{" "}
                                            {item
                                              .product
                                              .category
                                              ?.name ||
                                              "Uncategorized"}
                                          </p>

                                          <p className="mt-1 text-sm text-gray-500">
                                            Quantity:{" "}
                                            {
                                              item.quantity
                                            }
                                          </p>

                                          <p className="mt-1 text-sm text-gray-500">
                                            Unit price:{" "}
                                            {formatCurrency(
                                              item.unitPrice
                                            )}
                                          </p>

                                          <p className="mt-1 font-bold text-orange-600">
                                            {formatCurrency(
                                              item.totalPrice
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>

                            {/* CUSTOMER */}
                            <div>
                              <h3 className="font-bold text-gray-900">
                                Customer & Delivery
                              </h3>

                              <div className="mt-3 rounded-lg border bg-white p-4">
                                <p className="font-semibold text-gray-900">
                                  {customerName}
                                </p>

                                {order.customer
                                  ?.email && (
                                  <p className="mt-2 text-sm text-gray-600">
                                    ✉️{" "}
                                    {
                                      order
                                        .customer
                                        .email
                                    }
                                  </p>
                                )}

                                {order.customer
                                  ?.phone && (
                                  <p className="mt-2 text-sm text-gray-600">
                                    📞{" "}
                                    {
                                      order
                                        .customer
                                        .phone
                                    }
                                  </p>
                                )}

                                {order.shippingAddress && (
                                  <div className="mt-4 border-t pt-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                      Delivery Address
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-gray-700">
                                      {
                                        order
                                          .shippingAddress
                                          .addressLine1
                                      }

                                      {order
                                        .shippingAddress
                                        .addressLine2 && (
                                        <>
                                          <br />
                                          {
                                            order
                                              .shippingAddress
                                              .addressLine2
                                          }
                                        </>
                                      )}

                                      <br />

                                      {
                                        order
                                          .shippingAddress
                                          .city
                                      }
                                      ,{" "}
                                      {
                                        order
                                          .shippingAddress
                                          .state
                                      }

                                      <br />

                                      {
                                        order
                                          .shippingAddress
                                          .country
                                      }
                                    </p>

                                    <p className="mt-2 text-sm text-gray-500">
                                      Phone:{" "}
                                      {
                                        order
                                          .shippingAddress
                                          .phone
                                      }
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* SUMMARY */}
                            <div>
                              <h3 className="font-bold text-gray-900">
                                Order Summary
                              </h3>

                              <div className="mt-3 rounded-lg border bg-white p-4">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">
                                    Products
                                  </span>

                                  <span className="font-medium text-gray-900">
                                    {formatCurrency(
                                      order.summary
                                        .subtotal
                                    )}
                                  </span>
                                </div>

                                <div className="mt-3 flex justify-between text-sm">
                                  <span className="text-gray-500">
                                    Commission
                                  </span>

                                  <span className="font-medium text-orange-600">
                                    {formatCurrency(
                                      order.summary
                                        .commission
                                    )}
                                  </span>
                                </div>

                                <div className="mt-3 flex justify-between text-sm">
                                  <span className="text-gray-500">
                                    Seller Earnings
                                  </span>

                                  <span className="font-medium text-green-600">
                                    {formatCurrency(
                                      order.summary
                                        .earnings
                                    )}
                                  </span>
                                </div>

                                <div className="mt-4 border-t pt-4">
                                  <div className="flex justify-between">
                                    <span className="font-semibold text-gray-900">
                                      Order Total
                                    </span>

                                    <span className="font-bold text-gray-900">
                                      {formatCurrency(
                                        order.summary
                                          .subtotal
                                      )}
                                    </span>
                                  </div>
                                </div>

                                {order.shipment && (
                                  <div className="mt-4 border-t pt-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                      Shipment
                                    </p>

                                    <p className="mt-2 text-sm font-semibold text-gray-900">
                                      {order.shipment
                                        .courier ||
                                        "Courier not assigned"}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                      Status:{" "}
                                      {formatStatus(
                                        order
                                          .shipment
                                          .status
                                      )}
                                    </p>

                                    {order.shipment
                                      .trackingNumber && (
                                      <p className="mt-1 text-sm text-gray-500">
                                        Tracking:{" "}
                                        {
                                          order
                                            .shipment
                                            .trackingNumber
                                        }
                                      </p>
                                    )}
                                  </div>
                                )}

                                <div className="mt-4 border-t pt-4">
                                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Last Updated
                                  </p>

                                  <p className="mt-1 text-sm text-gray-600">
                                    {formatDate(
                                      order.updatedAt
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
      </div>
    </main>
  );
}