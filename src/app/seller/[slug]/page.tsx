"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  compareAtPrice: string | number | null;
  images: {
    id: string;
    url: string;
    altText: string | null;
  }[];
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

type Seller = {
  id: string;
  storeName: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  phone: string | null;
  status: string;
};

type StoreResponse = {
  seller: Seller;
  products: Product[];
};

export default function SellerStorePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [store, setStore] = useState<StoreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStore() {
      try {
        const response = await fetch(`/api/sellers/${slug}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load seller store."
          );
        }

        setStore(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load seller store."
        );
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadStore();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <header className="bg-[#f68b1e] px-6 py-5 text-white">
          <Link
            href="/"
            className="text-2xl font-extrabold"
          >
            MARKETPLACE
          </Link>
        </header>

        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-lg font-semibold text-gray-600">
            Loading store...
          </p>
        </div>
      </main>
    );
  }

  if (error || !store) {
    return (
      <main className="min-h-screen bg-gray-100">
        <header className="bg-[#f68b1e] px-6 py-5 text-white">
          <Link
            href="/"
            className="text-2xl font-extrabold"
          >
            MARKETPLACE
          </Link>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="rounded-xl bg-white p-10 shadow">
            <h1 className="text-3xl font-bold">
              Store Not Found
            </h1>

            <p className="mt-3 text-gray-500">
              {error || "This store could not be found."}
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-[#f68b1e] px-6 py-3 font-semibold text-white"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* HEADER */}
      <header className="bg-[#f68b1e] text-white shadow">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4">
          <Link
            href="/"
            className="text-2xl font-extrabold"
          >
            MARKETPLACE
          </Link>

          <div className="hidden flex-1 md:block">
            <div className="rounded-lg bg-white px-4 py-3 text-sm text-gray-400">
              Search products
            </div>
          </div>

          <Link
            href="/"
            className="font-semibold hover:underline"
          >
            Home
          </Link>
        </div>
      </header>

      {/* STORE HEADER */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f68b1e] text-3xl font-bold text-white">
              {store.seller.logoUrl ? (
                <img
                  src={store.seller.logoUrl}
                  alt={store.seller.storeName}
                  className="h-full w-full object-cover"
                />
              ) : (
                store.seller.storeName
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {store.seller.storeName}
                </h1>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  ✓ Verified Store
                </span>
              </div>

              <p className="mt-2 text-gray-500">
                Official Marketplace Seller
              </p>

              {store.seller.description && (
                <p className="mt-3 max-w-2xl text-gray-600">
                  {store.seller.description}
                </p>
              )}

              <div className="mt-4 flex gap-6 text-sm text-gray-600">
                <span>
                  <strong className="text-gray-900">
                    {store.products.length}
                  </strong>{" "}
                  Products
                </span>

                <span>
                  <strong className="text-gray-900">
                    {store.seller.status}
                  </strong>{" "}
                  Seller Status
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BREADCRUMB */}
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <p className="text-sm text-gray-500">
          <Link
            href="/"
            className="hover:text-[#f68b1e]"
          >
            Home
          </Link>{" "}
          / {store.seller.storeName}
        </p>
      </div>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Store Products
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Products sold by {store.seller.storeName}
          </p>
        </div>

        {store.products.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <h3 className="text-xl font-semibold">
              No products available
            </h3>

            <p className="mt-2 text-gray-500">
              This seller has no approved products.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {store.products.map((product) => {
              const image =
                product.images?.[0]?.url ||
                "https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&w=800&q=80";

              const price = Number(product.price);

              const comparePrice =
                product.compareAtPrice !== null
                  ? Number(product.compareAtPrice)
                  : null;

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    {comparePrice &&
                      comparePrice > price && (
                        <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                          SALE
                        </span>
                      )}
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-2 min-h-[40px] text-sm font-medium text-gray-800">
                      {product.name}
                    </h3>

                    <p className="mt-3 text-lg font-bold text-gray-900">
                      ₦{price.toLocaleString("en-NG")}
                    </p>

                    {comparePrice &&
                      comparePrice > price && (
                        <p className="mt-1 text-xs text-gray-400 line-through">
                          ₦{comparePrice.toLocaleString("en-NG")}
                        </p>
                      )}

                    {product.category && (
                      <p className="mt-3 text-xs text-gray-500">
                        {product.category.name}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="mt-12 bg-[#222] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-bold">
                MARKETPLACE
              </h3>

              <p className="mt-3 text-sm text-gray-400">
                Shop from trusted sellers and discover
                products at great prices.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">
                Customer Service
              </h4>

              <div className="mt-3 space-y-2 text-sm text-gray-400">
                <Link
                  href="/account/orders"
                  className="block hover:text-white"
                >
                  My Orders
                </Link>

                <Link
                  href="/"
                  className="block hover:text-white"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold">
                Marketplace
              </h4>

              <Link
                href="/seller"
                className="mt-3 block text-sm text-gray-400 hover:text-white"
              >
                Seller Center
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} MARKETPLACE. All
            rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}