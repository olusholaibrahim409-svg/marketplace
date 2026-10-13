import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
    },
  });

  if (!category) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      status: "APPROVED",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compareAtPrice: true,
      ProductImage: {
        take: 1,
        orderBy: {
          createdAt: "asc",
        },
        select: {
          url: true,
        },
      },
      Seller: {
        select: {
          storeName: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts = products.map((product) => {
    const price = Number(product.price);

    const compareAtPrice =
      product.compareAtPrice !== null
        ? Number(product.compareAtPrice)
        : null;

    const discount =
      compareAtPrice !== null && compareAtPrice > price
        ? Math.round(
            ((compareAtPrice - price) / compareAtPrice) * 100
          )
        : 0;

    return {
      ...product,
      price,
      compareAtPrice,
      discount,
    };
  });

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="bg-orange-600 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-wide"
          >
            MARKETPLACE
          </Link>

          <div className="flex items-center gap-5 text-sm font-medium">
            <Link href="/" className="hover:text-orange-200">
              Home
            </Link>

            <Link href="/cart" className="hover:text-orange-200">
              🛒 Cart
            </Link>
          </div>
        </div>
      </header>

      {/* Category Hero */}
      <section className="bg-orange-50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <Link
            href="/"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            ← Back to Marketplace
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-orange-600">
            Shop by Category
          </p>

          <h1 className="mt-2 text-4xl font-extrabold capitalize text-gray-900">
            {category.name}
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            {category.description ||
              `Explore the latest ${category.name.toLowerCase()} products from verified marketplace sellers.`}
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {category.name} Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {formattedProducts.length}{" "}
              {formattedProducts.length === 1
                ? "product"
                : "products"}{" "}
              available
            </p>
          </div>
        </div>

        {formattedProducts.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <div className="text-5xl">🛍️</div>

            <h3 className="mt-4 text-xl font-bold">
              No products in this category yet
            </h3>

            <p className="mt-2 text-gray-500">
              Check back soon for new products.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-orange-600 px-5 py-3 text-sm font-bold text-white hover:bg-orange-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {formattedProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Product Image */}
                <Link
                  href={`/product/${product.slug}`}
                  className="relative block aspect-square overflow-hidden bg-gray-100"
                >
                  {product.ProductImage[0]?.url ? (
                    <img
                      src={product.ProductImage[0].url}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}

                  {product.discount > 0 && (
                    <div className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                      -{product.discount}%
                    </div>
                  )}
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link
                    href={`/product/${product.slug}`}
                    className="line-clamp-2 text-lg font-bold hover:text-orange-600"
                  >
                    {product.name}
                  </Link>

                  <div className="mt-3">
                    <span className="text-xl font-extrabold text-orange-600">
                      ₦{product.price.toLocaleString()}
                    </span>

                    {product.compareAtPrice !== null &&
                      product.compareAtPrice > product.price && (
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm text-gray-400 line-through">
                            ₦
                            {product.compareAtPrice.toLocaleString()}
                          </span>

                          <span className="text-xs font-bold text-green-600">
                            Save {product.discount}%
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Seller */}
                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-500">
                      Sold by
                    </p>

                    <Link
                      href={`/seller/${product.Seller.slug}`}
                      className="font-semibold text-gray-800 hover:text-orange-600"
                    >
                      {product.Seller.storeName}
                    </Link>
                  </div>

                  {/* Button */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="mt-4 block rounded-lg bg-orange-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-700"
                  >
                    View Product →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-10 bg-gray-900 text-gray-300">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-extrabold text-white">
              MARKETPLACE
            </h3>

            <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400">
              Your trusted online marketplace connecting customers
              with verified sellers and quality products.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white">
              Customer Service
            </h4>

            <div className="mt-3 space-y-2 text-sm">
              <Link
                href="/help"
                className="block hover:text-orange-400"
              >
                Help Center
              </Link>

              <Link
                href="/contact"
                className="block hover:text-orange-400"
              >
                Contact Us
              </Link>

              <Link
                href="/track-order"
                className="block hover:text-orange-400"
              >
                Track Order
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white">
              Marketplace
            </h4>

            <div className="mt-3 space-y-2 text-sm">
              <Link
                href="/"
                className="block hover:text-orange-400"
              >
                Home
              </Link>

              <Link
                href="/official-stores"
                className="block hover:text-orange-400"
              >
                Official Stores
              </Link>

              <Link
                href="/deals"
                className="block hover:text-orange-400"
              >
                Deals
              </Link>

              <Link
                href="/new-arrivals"
                className="block hover:text-orange-400"
              >
                New Arrivals
              </Link>

              <Link
                href="/top-selling"
                className="block hover:text-orange-400"
              >
                Top Selling
              </Link>

              <Link
                href="/flash-sales"
                className="block hover:text-orange-400"
              >
                Flash Sales
              </Link>

              <Link
                href="/seller"
                className="block hover:text-orange-400"
              >
                Sell on Marketplace
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800">
          <div className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-gray-500">
            © 2026 Marketplace. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}