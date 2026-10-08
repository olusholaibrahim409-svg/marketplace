import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export default async function SellerProductsPage() {
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

  const products = await prisma.product.findMany({
    where: {
      sellerId: seller.id,
    },
    include: {
      Category: true,
      Brand: true,
      ProductImage: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
      Inventory: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalProducts = products.length;

  const pendingProducts = products.filter(
    (product) => product.status === "PENDING"
  ).length;

  const approvedProducts = products.filter(
    (product) => product.status === "APPROVED"
  ).length;

  const rejectedProducts = products.filter(
    (product) => product.status === "REJECTED"
  ).length;

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            Seller Center
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            My Products
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage all products listed in your store.
          </p>
        </div>

        <Link
          href="/seller/products/new"
          className="inline-flex items-center justify-center rounded-xl bg-[#f68b1e] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          + Add Product
        </Link>
      </section>

      {/* STATISTICS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Total Products
            </p>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-lg">
              📦
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold text-gray-900">
            {totalProducts}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            All products in your store
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Approved
            </p>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-lg">
              ✓
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold text-green-600">
            {approvedProducts}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Live products
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Pending
            </p>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-lg">
              ⏳
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold text-orange-600">
            {pendingProducts}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Awaiting admin approval
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Rejected
            </p>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-lg">
              !
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold text-red-600">
            {rejectedProducts}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Products requiring attention
          </p>
        </div>
      </section>

      {/* PRODUCTS TABLE */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View and manage everything in your store.
            </p>
          </div>

          <span className="w-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
            {totalProducts}{" "}
            {totalProducts === 1 ? "Product" : "Products"}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
              📦
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              No products yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              You have not added any products to your store yet.
              Add your first product to start selling.
            </p>

            <Link
              href="/seller/products/new"
              className="mt-6 inline-flex rounded-xl bg-[#f68b1e] px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {products.map((product) => {
                  const imageUrl =
                    product.ProductImage.length > 0
                      ? product.ProductImage[0].url
                      : null;

                  const stock =
                    product.Inventory?.quantity ??
                    product.stockQuantity;

                  return (
                    <tr
                      key={product.id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* PRODUCT */}
                      <td className="px-6 py-5">
                        <div className="flex min-w-[300px] items-center gap-4">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-2xl">
                                📦
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900">
                              {product.name}
                            </p>

                            {product.Brand && (
                              <p className="mt-1 text-xs text-gray-500">
                                Brand: {product.Brand.name}
                              </p>
                            )}

                            {product.sku && (
                              <p className="mt-1 text-xs text-gray-400">
                                SKU: {product.sku}
                              </p>
                            )}

                            {imageUrl && (
                              <p className="mt-1 text-xs font-medium text-green-600">
                                ✓ Image uploaded
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-5">
                        <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                          {product.Category.name}
                        </span>
                      </td>

                      {/* PRICE */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-gray-900">
                            ₦
                            {Number(
                              product.price
                            ).toLocaleString("en-NG")}
                          </p>

                          {product.compareAtPrice && (
                            <p className="text-xs text-gray-400 line-through">
                              ₦
                              {Number(
                                product.compareAtPrice
                              ).toLocaleString("en-NG")}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* STOCK */}
                      <td className="px-6 py-5">
                        <span
                          className={
                            stock > 0
                              ? "font-semibold text-gray-700"
                              : "font-semibold text-red-600"
                          }
                        >
                          {stock}
                        </span>

                        {stock === 0 && (
                          <p className="mt-1 text-xs text-red-500">
                            Out of stock
                          </p>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">
                        {product.status === "APPROVED" && (
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                            APPROVED
                          </span>
                        )}

                        {product.status === "PENDING" && (
                          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                            PENDING
                          </span>
                        )}

                        {product.status === "REJECTED" && (
                          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                            REJECTED
                          </span>
                        )}

                        {product.status !== "APPROVED" &&
                          product.status !== "PENDING" &&
                          product.status !== "REJECTED" && (
                            <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                              {product.status}
                            </span>
                          )}
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          {/* VIEW */}
                          <Link
                            href={`/seller/products/${product.id}`}
                            className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                          >
                            View
                          </Link>

                          {/* EDIT */}
                          <Link
                            href={`/seller/products/${product.id}/edit`}
                            className="inline-flex items-center justify-center rounded-lg bg-[#f68b1e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}