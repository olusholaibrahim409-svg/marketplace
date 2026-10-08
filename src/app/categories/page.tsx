import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-[#f68b1e] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="mb-6 inline-block text-sm font-medium text-white/80 transition hover:text-white"
          >
            ← Back to Marketplace
          </Link>

          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Shop by Category
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-white/90 sm:text-base">
            Explore products across all our marketplace categories.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              No categories available
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Categories will appear here once they have been added to the
              marketplace.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#f68b1e] hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl transition group-hover:bg-[#f68b1e] group-hover:text-white">
                  🛍️
                </div>

                <h2 className="mt-5 text-lg font-bold text-gray-900 group-hover:text-[#f68b1e]">
                  {category.name}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Browse products in {category.name}
                </p>

                <div className="mt-5 text-sm font-semibold text-[#f68b1e]">
                  Shop now →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}