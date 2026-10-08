import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export default async function SellerDashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "SELLER") {
    redirect("/");
  }

  const seller = await prisma.seller.findUnique({
    where: {
      userId: user.userId,
    },
  });

  if (!seller) {
    redirect("/");
  }

  const products = await prisma.product.count({
    where: {
      sellerId: seller.id,
    },
  });

  const pendingProducts = await prisma.product.count({
    where: {
      sellerId: seller.id,
      status: "PENDING",
    },
  });

  const approvedProducts = await prisma.product.count({
    where: {
      sellerId: seller.id,
      status: "APPROVED",
    },
  });

  const totalOrders = await prisma.order.count({
    where: {
      sellerId: seller.id,
    },
  });

  return (
    <div className="space-y-8">
      {/* WELCOME */}
      <section className="rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm font-medium text-orange-100">
          Seller Center
        </p>

        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
          Welcome, {seller.storeName}
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-orange-100 sm:text-base">
          Manage your products, orders, store and marketplace
          business from one place.
        </p>
      </section>

      {/* STATISTICS */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Products
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {products}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Products in your store
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Approved Products
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {approvedProducts}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Live products
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Pending Products
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-600">
            {pendingProducts}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Awaiting admin approval
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {totalOrders}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Orders received
          </p>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Quickly manage your marketplace business.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/seller/products/new"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl text-orange-600">
              +
            </div>

            <h3 className="font-bold text-gray-900">
              Add Product
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Add a new product to your store.
            </p>
          </Link>

          <Link
            href="/seller/products"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              📦
            </div>

            <h3 className="font-bold text-gray-900">
              Manage Products
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View and manage your products.
            </p>
          </Link>

          <Link
            href="/seller/orders"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
              🛒
            </div>

            <h3 className="font-bold text-gray-900">
              Orders
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Manage customer orders.
            </p>
          </Link>

          <Link
            href="/seller/store"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
              🏪
            </div>

            <h3 className="font-bold text-gray-900">
              Store Profile
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Manage your marketplace store.
            </p>
          </Link>
        </div>
      </section>

      {/* STORE INFORMATION + SELLER TOOLS */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* STORE INFORMATION */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Store Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your current seller account information.
              </p>
            </div>

            <Link
              href="/seller/store"
              className="rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-100"
            >
              Edit
            </Link>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm text-gray-500">
                Store Name
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {seller.storeName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Store Slug
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                /seller/{seller.slug}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {seller.phone || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Commission Rate
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {seller.commissionRate.toString()}%
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Seller Status
              </p>

              <span className="mt-1 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                {seller.status}
              </span>
            </div>
          </div>
        </div>

        {/* SELLER TOOLS */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Seller Tools
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage different areas of your seller account.
          </p>

          <div className="mt-5 space-y-3">
            <Link
              href="/seller/products"
              className="flex items-center justify-between rounded-xl border p-4 transition hover:border-orange-200 hover:bg-orange-50"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  Products
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Manage your products and inventory.
                </p>
              </div>

              <span className="text-gray-400">
                →
              </span>
            </Link>

            <Link
              href="/seller/orders"
              className="flex items-center justify-between rounded-xl border p-4 transition hover:border-orange-200 hover:bg-orange-50"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  Orders
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  View and process customer orders.
                </p>
              </div>

              <span className="text-gray-400">
                →
              </span>
            </Link>

            <Link
              href="/seller/store"
              className="flex items-center justify-between rounded-xl border p-4 transition hover:border-orange-200 hover:bg-orange-50"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  Store Settings
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Update your store information and logo.
                </p>
              </div>

              <span className="text-gray-400">
                →
              </span>
            </Link>

            <Link
              href="/seller/finance"
              className="flex items-center justify-between rounded-xl border p-4 transition hover:border-orange-200 hover:bg-orange-50"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  Finance & Payouts
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  View sales, commissions and payouts.
                </p>
              </div>

              <span className="text-gray-400">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}