"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Seller = {
  id: string;
  storeName: string;
  slug: string;
  description: string | null;
  phone: string | null;
  status: "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";
  commissionRate: string | number;
  approvedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    status: string;
  };
  _count: {
    products: number;
    orders: number;
    commissions: number;
    payouts: number;
  };
};

type SellerApplication = {
  id: string;
  userId: string;
  storeName: string;
  businessName: string | null;
  phone: string;
  documents: unknown;
  status: "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
};

function statusClasses(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-700";

    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    case "SUSPENDED":
      return "bg-red-100 text-red-700";

    case "REJECTED":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [applications, setApplications] = useState<
    SellerApplication[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadSellers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/sellers", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to load seller information."
        );
        return;
      }

      setSellers(data.sellers || []);
      setApplications(data.applications || []);
    } catch {
      setError("Failed to load seller information.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSellers();
  }, []);

  /*
   * Handles seller account actions:
   * approve
   * reject
   * suspend
   * activate
   */
  async function handleSellerAction(
    sellerId: string,
    action:
      | "approve"
      | "reject"
      | "suspend"
      | "activate"
  ) {
    let confirmationMessage =
      "Are you sure you want to continue?";

    if (action === "suspend") {
      confirmationMessage =
        "Are you sure you want to suspend this seller?";
    }

    if (action === "activate") {
      confirmationMessage =
        "Are you sure you want to activate this seller?";
    }

    if (action === "approve") {
      confirmationMessage =
        "Are you sure you want to approve this seller?";
    }

    if (action === "reject") {
      confirmationMessage =
        "Are you sure you want to reject this seller?";
    }

    const confirmed = window.confirm(
      confirmationMessage
    );

    if (!confirmed) {
      return;
    }

    setActionId(sellerId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/admin/sellers/${sellerId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to update seller."
        );
        return;
      }

      setSuccess(
        data.message ||
          "Seller updated successfully."
      );

      await loadSellers();
    } catch {
      setError("Failed to update seller.");
    } finally {
      setActionId("");
    }
  }

  /*
   * Approve or reject a seller application.
   *
   * IMPORTANT:
   * The application ID is sent here, not a seller ID.
   *
   * Approving an application will:
   * - create the Seller record
   * - change the customer's role to SELLER
   * - mark the application APPROVED
   * - generate the seller store slug
   */
  async function handleApplicationAction(
    applicationId: string,
    action: "approve" | "reject"
  ) {
    let rejectionReason = "";

    if (action === "approve") {
      const confirmed = window.confirm(
        "Approve this seller application? This will create the seller account and change the customer's role to SELLER."
      );

      if (!confirmed) {
        return;
      }
    }

    if (action === "reject") {
      const confirmed = window.confirm(
        "Reject this seller application?"
      );

      if (!confirmed) {
        return;
      }

      rejectionReason =
        window.prompt(
          "Enter a rejection reason (optional):"
        ) || "";
    }

    setActionId(applicationId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/admin/sellers/${applicationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            rejectionReason:
              rejectionReason.trim() || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to process seller application."
        );
        return;
      }

      setSuccess(
        data.message ||
          "Seller application updated successfully."
      );

      await loadSellers();
    } catch {
      setError(
        "Failed to process seller application."
      );
    } finally {
      setActionId("");
    }
  }

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status === "PENDING"
    );

  const approvedSellers = sellers.filter(
    (seller) => seller.status === "APPROVED"
  );

  const pendingSellers = sellers.filter(
    (seller) => seller.status === "PENDING"
  );

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <Link
              href="/admin"
              className="text-2xl font-extrabold text-orange-500"
            >
              MARKETPLACE
            </Link>

            <p className="mt-1 text-sm text-gray-500">
              Admin / Sellers
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Seller Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage seller accounts, applications,
            approvals and marketplace stores.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <p className="text-gray-500">
              Loading seller information...
            </p>
          </div>
        ) : (
          <>
            {/* STATISTICS */}
            <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                  Total Sellers
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {sellers.length}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                  Approved
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {approvedSellers.length}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                  Pending Sellers
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {pendingSellers.length}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                  Pending Applications
                </p>

                <p className="mt-2 text-3xl font-bold text-orange-500">
                  {pendingApplications.length}
                </p>
              </div>
            </div>

            {/* SELLER APPLICATIONS */}
            <section className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="border-b px-6 py-5">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Seller Applications
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Review and approve customers who want
                      to sell on the marketplace.
                    </p>
                  </div>

                  {pendingApplications.length > 0 && (
                    <span className="w-fit rounded-full bg-yellow-100 px-4 py-2 text-xs font-bold text-yellow-700">
                      {pendingApplications.length}{" "}
                      Pending
                    </span>
                  )}
                </div>
              </div>

              {applications.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="text-5xl">
                    📋
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-gray-900">
                    No seller applications
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Seller applications will appear here
                    when customers apply.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                          Store
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                          Business
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                          Phone
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                          Status
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                          Date
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {applications.map(
                        (application) => (
                          <tr
                            key={application.id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4">
                              <p className="font-semibold text-gray-900">
                                {
                                  application.storeName
                                }
                              </p>

                              <p className="text-xs text-gray-500">
                                Customer ID:{" "}
                                {application.userId}
                              </p>
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-600">
                              {application.businessName ||
                                "Individual seller"}
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-600">
                              {application.phone}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                                  application.status
                                )}`}
                              >
                                {
                                  application.status
                                }
                              </span>

                              {application.rejectionReason && (
                                <p className="mt-2 max-w-xs text-xs text-red-500">
                                  {
                                    application.rejectionReason
                                  }
                                </p>
                              )}
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(
                                application.createdAt
                              ).toLocaleDateString(
                                "en-NG"
                              )}
                            </td>

                            <td className="px-6 py-4">
                              {application.status ===
                              "PENDING" ? (
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleApplicationAction(
                                        application.id,
                                        "approve"
                                      )
                                    }
                                    disabled={
                                      actionId ===
                                      application.id
                                    }
                                    className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {actionId ===
                                    application.id
                                      ? "Processing..."
                                      : "Approve"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleApplicationAction(
                                        application.id,
                                        "reject"
                                      )
                                    }
                                    disabled={
                                      actionId ===
                                      application.id
                                    }
                                    className="rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">
                                  No action
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* SELLERS */}
            <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="border-b px-6 py-5">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Sellers
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Manage existing marketplace sellers.
                    </p>
                  </div>

                  {sellers.length > 0 && (
                    <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700">
                      {sellers.length} Seller
                      {sellers.length === 1
                        ? ""
                        : "s"}
                    </span>
                  )}
                </div>
              </div>

              {sellers.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="text-5xl">
                    🏪
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-gray-900">
                    No sellers yet
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Approved sellers will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                          Seller / Store
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                          Email
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                          Products
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                          Commission
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                          Status
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {sellers.map((seller) => (
                        <tr
                          key={seller.id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">
                              {seller.storeName}
                            </p>

                            <p className="text-xs text-gray-500">
                              {seller.user.firstName ||
                                ""}{" "}
                              {seller.user.lastName ||
                                ""}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {seller.user.email}
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                            {seller._count.products}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {Number(
                              seller.commissionRate
                            ).toLocaleString(
                              "en-NG"
                            )}
                            %
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                                seller.status
                              )}`}
                            >
                              {seller.status}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {seller.status !==
                                "APPROVED" &&
                                seller.status !==
                                  "REJECTED" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSellerAction(
                                        seller.id,
                                        "approve"
                                      )
                                    }
                                    disabled={
                                      actionId ===
                                      seller.id
                                    }
                                    className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    Approve
                                  </button>
                                )}

                              {seller.status ===
                                "APPROVED" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSellerAction(
                                      seller.id,
                                      "suspend"
                                    )
                                  }
                                  disabled={
                                    actionId ===
                                    seller.id
                                  }
                                  className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Suspend
                                </button>
                              )}

                              {seller.status ===
                                "SUSPENDED" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSellerAction(
                                      seller.id,
                                      "activate"
                                    )
                                  }
                                  disabled={
                                    actionId ===
                                    seller.id
                                  }
                                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Activate
                                </button>
                              )}

                              {seller.status ===
                                "PENDING" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSellerAction(
                                      seller.id,
                                      "reject"
                                    )
                                  }
                                  disabled={
                                    actionId ===
                                    seller.id
                                  }
                                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              )}

                              {seller.status ===
                                "REJECTED" && (
                                <span className="text-xs text-gray-400">
                                  Rejected
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}