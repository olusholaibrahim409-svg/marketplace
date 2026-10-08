import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function SellerApplicationsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const applications = await prisma.sellerApplication.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingCount = applications.filter(
    (application) => application.status === "PENDING"
  ).length;

  const approvedCount = applications.filter(
    (application) => application.status === "APPROVED"
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "REJECTED"
  ).length;

  return (
    <main className="min-h-screen bg-gray-100">
      {/* HEADER */}
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
              Seller Applications
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm font-medium text-gray-600 transition hover:text-orange-500"
            >
              ← Back to Dashboard
            </Link>

            <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600">
              {user.role}
            </span>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* PAGE TITLE */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Seller Applications
          </h1>

          <p className="mt-2 text-gray-500">
            Review and manage applications from customers who want to become
            sellers.
          </p>
        </div>

        {/* STATISTICS */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* TOTAL */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Applications
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {applications.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                📋
              </div>
            </div>
          </div>

          {/* PENDING */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {pendingCount}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-2xl">
                ⏳
              </div>
            </div>
          </div>

          {/* APPROVED */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Approved
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {approvedCount}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                ✓
              </div>
            </div>
          </div>

          {/* REJECTED */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Rejected
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {rejectedCount}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
                ✕
              </div>
            </div>
          </div>
        </div>

        {/* APPLICATIONS */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <h2 className="text-xl font-bold text-gray-900">
              Applications
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review seller applications submitted through the Marketplace
              onboarding process.
            </p>
          </div>

          {applications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                📋
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                No seller applications yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                When customers submit seller applications, they will appear
                here for review.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-6 py-4">Applicant</th>
                    <th className="px-6 py-4">Store</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Submitted</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {applications.map((application) => (
                    <tr
                      key={application.id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* APPLICANT */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {application.firstName}{" "}
                            {application.lastName}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {application.email}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {application.phone}
                          </p>
                        </div>
                      </td>

                      {/* STORE */}
                      <td className="px-6 py-5">
                        <p className="font-semibold text-gray-900">
                          {application.storeName}
                        </p>

                        <p className="mt-1 max-w-[220px] truncate text-sm text-gray-500">
                          {application.storeDescription ||
                            "No description"}
                        </p>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {application.category || "Not provided"}
                      </td>

                      {/* LOCATION */}
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-gray-700">
                          {application.city || "—"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {application.state || "—"}
                        </p>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">
                        {application.status === "PENDING" && (
                          <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                            Pending
                          </span>
                        )}

                        {application.status === "APPROVED" && (
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                            Approved
                          </span>
                        )}

                        {application.status === "REJECTED" && (
                          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                            Rejected
                          </span>
                        )}

                        {application.status === "SUSPENDED" && (
                          <span className="inline-flex rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-700">
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-5 text-sm text-gray-500">
                        {new Date(
                          application.createdAt
                        ).toLocaleDateString("en-NG", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-5">
                        <Link
                          href={`/admin/seller-applications/${application.id}`}
                          className="inline-flex rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}