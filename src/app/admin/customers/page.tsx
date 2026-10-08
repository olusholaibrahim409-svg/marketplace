"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CustomerOrder = {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
};

type Customer = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  imageUrl: string | null;
  createdAt: string;
  orderCount: number;
  completedOrders: number;
  totalSpent: number;
  orders: CustomerOrder[];
};

type Summary = {
  totalCustomers: number;
  customersWithOrders: number;
  totalRevenue: number;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const getInitials = (name: string | null, email: string) => {
  if (name) {
    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  }

  return email.slice(0, 2).toUpperCase();
};

const getStatusClasses = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700";

    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";

    case "PROCESSING":
      return "bg-purple-100 text-purple-700";

    case "SHIPPED":
      return "bg-indigo-100 text-indigo-700";

    case "OUT_FOR_DELIVERY":
      return "bg-cyan-100 text-cyan-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    case "RETURNED":
      return "bg-orange-100 text-orange-700";

    case "REFUNDED":
      return "bg-pink-100 text-pink-700";

    case "PENDING":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalCustomers: 0,
    customersWithOrders: 0,
    totalRevenue: 0,
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/customers", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || "Failed to load customers"
          );
        }

        setCustomers(data.customers || []);

        setSummary(
          data.summary || {
            totalCustomers: 0,
            customersWithOrders: 0,
            totalRevenue: 0,
          }
        );
      } catch (err) {
        console.error("ADMIN CUSTOMERS PAGE ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load customers"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return customers;
    }

    return customers.filter((customer) => {
      const name = customer.name?.toLowerCase() || "";
      const email = customer.email?.toLowerCase() || "";
      const phone = customer.phone?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue)
      );
    });
  }, [customers, search]);

  return (
    <main className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <Link
              href="/"
              className="text-2xl font-extrabold text-orange-500"
            >
              MARKETPLACE
            </Link>

            <p className="mt-1 text-sm text-gray-500">
              Customer Management
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm font-medium text-gray-600 transition hover:text-orange-500"
            >
              Dashboard
            </Link>

            <Link
              href="/"
              className="text-sm font-medium text-gray-600 transition hover:text-orange-500"
            >
              View Store
            </Link>
          </div>
        </div>
      </header>

      {/* PAGE */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* TITLE */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
              Administration
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Customers
            </h1>

            <p className="mt-2 text-gray-500">
              Manage customer accounts, orders and spending.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex w-fit items-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-500"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-700">
              Unable to load customers
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* TOTAL CUSTOMERS */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Customers
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading ? "—" : summary.totalCustomers}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                👤
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Registered customer accounts
            </p>
          </div>

          {/* CUSTOMERS WITH ORDERS */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Customers With Orders
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading
                    ? "—"
                    : summary.customersWithOrders}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🛒
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Customers who have placed orders
            </p>
          </div>

          {/* TOTAL SPENDING */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Customer Spending
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading
                    ? "—"
                    : formatCurrency(summary.totalRevenue)}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                💰
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Total value of customer orders
            </p>
          </div>
        </div>

        {/* CUSTOMER LIST */}
        <div className="mt-8 rounded-2xl bg-white shadow-sm">
          {/* LIST HEADER */}
          <div className="border-b p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Customer Accounts
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  View customer profiles and order history.
                </p>
              </div>

              <div className="w-full md:w-80">
                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search customers..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="p-12 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

              <p className="mt-4 text-sm text-gray-500">
                Loading customers...
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            !error &&
            filteredCustomers.length === 0 && (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                  👤
                </div>

                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  No customers found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {search
                    ? "Try changing your search."
                    : "There are no customer accounts yet."}
                </p>
              </div>
            )}

          {/* DESKTOP TABLE */}
          {!loading &&
            !error &&
            filteredCustomers.length > 0 && (
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Contact
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Orders
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Delivered
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Total Spent
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Joined
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCustomers.map((customer) => {
                      const displayName =
                        customer.name || "Unnamed Customer";

                      return (
                        <tr
                          key={customer.id}
                          className="border-b last:border-b-0 hover:bg-gray-50"
                        >
                          {/* CUSTOMER */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              {customer.imageUrl ? (
                                <img
                                  src={customer.imageUrl}
                                  alt={displayName}
                                  className="h-11 w-11 rounded-full object-cover"
                                />
                              ) : (
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                                  {getInitials(
                                    customer.name,
                                    customer.email
                                  )}
                                </div>
                              )}

                              <div>
                                <p className="font-semibold text-gray-900">
                                  {displayName}
                                </p>

                                <p className="text-xs text-gray-400">
                                  ID: {customer.id.slice(0, 12)}...
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* CONTACT */}
                          <td className="px-6 py-5">
                            <p className="text-sm text-gray-700">
                              {customer.email}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {customer.phone || "No phone number"}
                            </p>
                          </td>

                          {/* ORDERS */}
                          <td className="px-6 py-5">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
                              {customer.orderCount}
                            </span>
                          </td>

                          {/* DELIVERED */}
                          <td className="px-6 py-5">
                            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-600">
                              {customer.completedOrders}
                            </span>
                          </td>

                          {/* SPENDING */}
                          <td className="px-6 py-5">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(
                                customer.totalSpent
                              )}
                            </p>
                          </td>

                          {/* JOINED */}
                          <td className="px-6 py-5">
                            <p className="text-sm text-gray-600">
                              {formatDate(customer.createdAt)}
                            </p>
                          </td>

                          {/* ACTION */}
                          <td className="px-6 py-5 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedCustomer(customer)
                              }
                              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          {/* MOBILE / TABLET CARDS */}
          {!loading &&
            !error &&
            filteredCustomers.length > 0 && (
              <div className="divide-y lg:hidden">
                {filteredCustomers.map((customer) => {
                  const displayName =
                    customer.name || "Unnamed Customer";

                  return (
                    <div
                      key={customer.id}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {customer.imageUrl ? (
                            <img
                              src={customer.imageUrl}
                              alt={displayName}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                              {getInitials(
                                customer.name,
                                customer.email
                              )}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-gray-900">
                              {displayName}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {customer.email}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCustomer(customer)
                          }
                          className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
                        >
                          View
                        </button>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs text-gray-500">
                            Orders
                          </p>

                          <p className="mt-1 font-bold text-gray-900">
                            {customer.orderCount}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs text-gray-500">
                            Delivered
                          </p>

                          <p className="mt-1 font-bold text-gray-900">
                            {customer.completedOrders}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs text-gray-500">
                            Total Spent
                          </p>

                          <p className="mt-1 font-bold text-gray-900">
                            {formatCurrency(
                              customer.totalSpent
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs text-gray-500">
                            Joined
                          </p>

                          <p className="mt-1 font-bold text-gray-900">
                            {formatDate(customer.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </section>

      {/* CUSTOMER DETAILS MODAL */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Customer Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Customer account and order history.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
              >
                ×
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="max-h-[calc(90vh-90px)] overflow-y-auto p-6">
              {/* PROFILE */}
              <div className="rounded-2xl border bg-gray-50 p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    {selectedCustomer.imageUrl ? (
                      <img
                        src={selectedCustomer.imageUrl}
                        alt={
                          selectedCustomer.name ||
                          "Customer"
                        }
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
                        {getInitials(
                          selectedCustomer.name,
                          selectedCustomer.email
                        )}
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {selectedCustomer.name ||
                          "Unnamed Customer"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        {selectedCustomer.email}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {selectedCustomer.phone ||
                          "No phone number"}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Joined
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {formatDate(
                        selectedCustomer.createdAt
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* CUSTOMER STATS */}
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border p-4">
                  <p className="text-sm text-gray-500">
                    Total Orders
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {selectedCustomer.orderCount}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-sm text-gray-500">
                    Delivered
                  </p>

                  <p className="mt-2 text-2xl font-bold text-green-600">
                    {selectedCustomer.completedOrders}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-sm text-gray-500">
                    Total Spent
                  </p>

                  <p className="mt-2 text-xl font-bold text-gray-900">
                    {formatCurrency(
                      selectedCustomer.totalSpent
                    )}
                  </p>
                </div>
              </div>

              {/* ORDER HISTORY */}
              <div className="mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Order History
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Orders placed by this customer.
                  </p>
                </div>

                {selectedCustomer.orders.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center">
                    <div className="text-3xl">
                      🛒
                    </div>

                    <p className="mt-3 font-semibold text-gray-900">
                      No orders yet
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      This customer has not placed any
                      orders.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border">
                    {selectedCustomer.orders.map(
                      (order, index) => (
                        <div
                          key={order.id}
                          className={`p-4 ${
                            index !==
                            selectedCustomer.orders.length -
                              1
                              ? "border-b"
                              : ""
                          }`}
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {order.orderNumber}
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                {formatDate(
                                  order.createdAt
                                )}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(
                                  order.status
                                )}`}
                              >
                                {order.status.replaceAll(
                                  "_",
                                  " "
                                )}
                              </span>

                              <p className="font-bold text-gray-900">
                                {formatCurrency(
                                  order.total
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}