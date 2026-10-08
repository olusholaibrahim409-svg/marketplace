import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import SellerApplicationActions from "@/components/admin/SellerApplicationActions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SellerApplicationReviewPage({
  params,
}: PageProps) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const { id } = await params;

  const application = await prisma.sellerApplication.findUnique({
    where: {
      id,
    },
  });

  if (!application) {
    notFound();
  }

  const statusStyles = {
    PENDING: {
      label: "Pending Review",
      className: "bg-yellow-100 text-yellow-700",
    },
    APPROVED: {
      label: "Approved",
      className: "bg-green-100 text-green-700",
    },
    REJECTED: {
      label: "Rejected",
      className: "bg-red-100 text-red-700",
    },
    SUSPENDED: {
      label: "Suspended",
      className: "bg-gray-200 text-gray-700",
    },
  };

  const currentStatus =
    statusStyles[
      application.status as keyof typeof statusStyles
    ] ?? statusStyles.PENDING;

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
              Seller Application Review
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/seller-applications"
              className="text-sm font-medium text-gray-600 transition hover:text-orange-500"
            >
              ← Back to Applications
            </Link>

            <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600">
              {user.role}
            </span>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        {/* PAGE TITLE */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Review Seller Application
              </h1>

              <p className="mt-2 text-gray-500">
                Review the information submitted by this applicant.
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-bold ${currentStatus.className}`}
            >
              {currentStatus.label}
            </span>
          </div>
        </div>

        {/* APPLICATION META */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Application ID
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-gray-800">
                {application.id}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Submitted
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-800">
                {new Date(application.createdAt).toLocaleDateString(
                  "en-NG",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Last Updated
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-800">
                {new Date(application.updatedAt).toLocaleDateString(
                  "en-NG",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
          </div>
        </div>

        {/* PERSONAL INFORMATION */}
        <section className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-xl">
                👤
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Personal Information
                </h2>

                <p className="text-sm text-gray-500">
                  Applicant contact information
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <InfoItem
              label="First Name"
              value={application.firstName}
            />

            <InfoItem
              label="Last Name"
              value={application.lastName}
            />

            <InfoItem
              label="Email Address"
              value={application.email}
            />

            <InfoItem
              label="Phone Number"
              value={application.phone}
            />
          </div>
        </section>

        {/* STORE INFORMATION */}
        <section className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-xl">
                🏪
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Store Information
                </h2>

                <p className="text-sm text-gray-500">
                  Information about the proposed marketplace store
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <InfoItem
              label="Store Name"
              value={application.storeName}
            />

            <InfoItem
              label="Category"
              value={application.category}
            />

            <div className="sm:col-span-2">
              <InfoItem
                label="Store Description"
                value={application.storeDescription}
                multiline
              />
            </div>

            <div className="sm:col-span-2">
              <InfoItem
                label="Products They Plan to Sell"
                value={application.productsToSell}
                multiline
              />
            </div>
          </div>
        </section>

        {/* BUSINESS INFORMATION */}
        <section className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-xl">
                🏢
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Business Information
                </h2>

                <p className="text-sm text-gray-500">
                  Business and operating information
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <InfoItem
              label="Business Type"
              value={application.businessType}
            />

            <InfoItem
              label="Business Registration"
              value={application.businessRegistration}
            />

            <InfoItem
              label="City"
              value={application.city}
            />

            <InfoItem
              label="State"
              value={application.state}
            />

            <div className="sm:col-span-2">
              <InfoItem
                label="Business Address"
                value={application.businessAddress}
                multiline
              />
            </div>
          </div>
        </section>

        {/* VERIFICATION */}
        <section className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-xl">
                🪪
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Verification Information
                </h2>

                <p className="text-sm text-gray-500">
                  Identity information submitted for verification
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <InfoItem
              label="Identity Type"
              value={application.identityType}
            />

            <InfoItem
              label="Identity Number"
              value={application.identityNumber}
              sensitive
            />
          </div>
        </section>

        {/* BANKING INFORMATION */}
        <section className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-xl">
                🏦
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Banking Information
                </h2>

                <p className="text-sm text-gray-500">
                  Payment account information submitted by the applicant
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <InfoItem
              label="Bank"
              value={application.bankName}
            />

            <InfoItem
              label="Account Name"
              value={application.accountName}
            />

            <InfoItem
              label="Account Number"
              value={application.accountNumber}
              sensitive
            />
          </div>
        </section>

        {/* REJECTION REASON */}
        {application.rejectionReason && (
          <section className="mb-6 overflow-hidden rounded-2xl border border-red-200 bg-red-50">
            <div className="border-b border-red-200 px-6 py-5">
              <h2 className="text-lg font-bold text-red-800">
                Rejection Reason
              </h2>
            </div>

            <div className="p-6">
              <p className="whitespace-pre-wrap text-sm leading-6 text-red-700">
                {application.rejectionReason}
              </p>
            </div>
          </section>
        )}

        {/* REVIEW ACTIONS */}
        <section className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <h2 className="text-xl font-bold text-gray-900">
              Application Decision
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review the application carefully before making a decision.
            </p>
          </div>

          <div className="p-6">
            {application.status === "PENDING" ? (
              <div>
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                  <div className="flex gap-3">
                    <span className="text-xl">⏳</span>

                    <div>
                      <p className="font-semibold text-yellow-800">
                        This application is waiting for review.
                      </p>

                      <p className="mt-1 text-sm text-yellow-700">
                        Once you verify the applicant&apos;s information,
                        you can approve or reject the application.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CONNECTED APPROVE / REJECT ACTIONS */}
                <div className="mt-6">
                  <SellerApplicationActions
                    applicationId={application.id}
                  />
                </div>
              </div>
            ) : application.status === "APPROVED" ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                <div className="flex gap-3">
                  <span className="text-2xl">✓</span>

                  <div>
                    <p className="font-bold text-green-800">
                      This application has been approved.
                    </p>

                    <p className="mt-1 text-sm text-green-700">
                      The applicant has been approved as a seller.
                    </p>
                  </div>
                </div>
              </div>
            ) : application.status === "REJECTED" ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <div className="flex gap-3">
                  <span className="text-2xl">✕</span>

                  <div>
                    <p className="font-bold text-red-800">
                      This application has been rejected.
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      The rejection reason is displayed above.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="font-semibold text-gray-800">
                  Current status: {currentStatus.label}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* BACK BUTTON */}
        <div className="flex justify-center pb-8">
          <Link
            href="/admin/seller-applications"
            className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            ← Back to Seller Applications
          </Link>
        </div>
      </section>
    </main>
  );
}

function InfoItem({
  label,
  value,
  multiline = false,
  sensitive = false,
}: {
  label: string;
  value: string | null | undefined;
  multiline?: boolean;
  sensitive?: boolean;
}) {
  const displayValue = value?.trim() || "Not provided";

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p
        className={`mt-2 text-sm font-medium text-gray-800 ${
          multiline ? "whitespace-pre-wrap leading-6" : ""
        }`}
      >
        {sensitive && displayValue !== "Not provided"
          ? `••••••••${displayValue.slice(-4)}`
          : displayValue}
      </p>
    </div>
  );
}