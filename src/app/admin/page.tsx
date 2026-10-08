import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";

export default async function Page() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (
    user.role !== "ADMIN" &&
    user.role !== "SUPER_ADMIN"
  ) {
    redirect("/");
  }

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
              Administration Dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600">
              {user.role}
            </span>

            <Link
              href="/"
              className="text-sm font-medium text-gray-600 transition hover:text-orange-500"
            >
              View Store
            </Link>
          </div>
        </div>
      </header>

      {/* DASHBOARD */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your marketplace from one place.
          </p>
        </div>

        {/* MAIN CARDS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* PRODUCTS */}
          <Link
            href="/admin/products"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              📦
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              Products
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Manage products, pricing, inventory and approval.
            </p>

            <div className="mt-4 text-sm font-bold text-orange-500">
              Manage Products →
            </div>
          </Link>

          {/* ADD PRODUCT */}
          <Link
            href="/admin/products/new"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
              ➕
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              Add Product
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add a new product to the marketplace.
            </p>

            <div className="mt-4 text-sm font-bold text-orange-500">
              Add Product →
            </div>
          </Link>

          {/* ORDERS */}
          <Link
            href="/admin/orders"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              🛒
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              Orders
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Manage and monitor all customer orders across the marketplace.
            </p>

            <div className="mt-4 text-sm font-bold text-orange-500">
              Manage Orders →
            </div>
          </Link>

          {/* SELLER APPLICATIONS */}
          <Link
            href="/admin/seller-applications"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
              👥
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              Seller Applications
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Review, approve and reject seller applications.
            </p>

            <div className="mt-4 text-sm font-bold text-orange-500">
              Manage Applications →
            </div>
          </Link>
        </div>

        {/* MARKETPLACE MANAGEMENT */}
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Marketplace Management
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* CATEGORIES */}
            <Link
              href="/admin/categories"
              className="rounded-xl border p-4 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-sm"
            >
              <p className="font-semibold text-gray-900">
                Categories & Brands
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Organize product categories and manage brands.
              </p>

              <div className="mt-3 text-sm font-bold text-orange-500">
                Manage Categories →
              </div>
            </Link>

            {/* CUSTOMERS */}
            <Link
              href="/admin/customers"
              className="rounded-xl border p-4 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-sm"
            >
              <p className="font-semibold text-gray-900">
                Customers
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Manage customer accounts.
              </p>

              <div className="mt-3 text-sm font-bold text-orange-500">
                Manage Customers →
              </div>
            </Link>

            {/* PAYMENTS */}
            <div className="rounded-xl border p-4">
              <p className="font-semibold">
                Payments
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Payment management coming next.
              </p>
            </div>

            {/* MARKETING */}
            <div className="rounded-xl border p-4">
              <p className="font-semibold">
                Marketing
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Campaigns and promotions coming next.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}