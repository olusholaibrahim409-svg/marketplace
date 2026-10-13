import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type TopSellingProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  discount: number;
  savings: number;
  totalSold: number;
  images: {
    id: string;
    url: string;
    altText: string | null;
  }[];
  seller: {
    id: string;
    storeName: string;
    slug: string;
    status: string;
  };
  category: {
    name: string;
  };
};

function formatPrice(price: number) {
  const naira = String.fromCharCode(0x20a6);
  return `${naira}${price.toLocaleString("en-NG")}`;
}

export default async function TopSellingPage() {
  const rawProducts = await prisma.product.findMany({
    where: {
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
          sortOrder: "asc",
        },
        select: {
          id: true,
          url: true,
          altText: true,
        },
      },

      Seller: {
        select: {
          id: true,
          storeName: true,
          slug: true,
          status: true,
        },
      },

      Category: {
        select: {
          name: true,
        },
      },

      OrderItem: {
        select: {
          quantity: true,
        },
      },
    },
  });

  const products: TopSellingProduct[] = rawProducts.map((product) => {
    const totalSold = product.OrderItem.reduce(
      (total, item) => total + item.quantity,
      0
    );

    const price = Number(product.price);

    const compareAtPrice = product.compareAtPrice
      ? Number(product.compareAtPrice)
      : null;

    const discount =
      compareAtPrice && compareAtPrice > price
        ? Math.round(
            ((compareAtPrice - price) / compareAtPrice) * 100
          )
        : 0;

    const savings =
      compareAtPrice && compareAtPrice > price
        ? compareAtPrice - price
        : 0;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price,
      compareAtPrice,
      discount,
      savings,
      totalSold,
      images: product.ProductImage,
      seller: product.Seller,
      category: product.Category,
    };
  });

  /*
   * Products with actual sales are the real Top Sellers.
   *
   * If there are no sales yet, we still show approved products
   * so the page does not look broken on a new marketplace.
   */
  const productsWithSales: TopSellingProduct[] = products
    .filter((product: TopSellingProduct) => product.totalSold > 0)
    .sort(
      (
        a: TopSellingProduct,
        b: TopSellingProduct
      ) => {
        if (b.totalSold !== a.totalSold) {
          return b.totalSold - a.totalSold;
        }

        return b.price - a.price;
      }
    );

  const productsWithoutSales: TopSellingProduct[] = products
    .filter((product: TopSellingProduct) => product.totalSold === 0)
    .sort(
      (
        a: TopSellingProduct,
        b: TopSellingProduct
      ) => {
        return (
          new Date(b.id).getTime() -
          new Date(a.id).getTime()
        );
      }
    );

  const topSellingProducts: TopSellingProduct[] =
    productsWithSales.length > 0
      ? productsWithSales
      : productsWithoutSales;

  const totalUnitsSold = products.reduce(
    (
      total: number,
      product: TopSellingProduct
    ) => total + product.totalSold,
    0
  );

  const highestDiscount = products.reduce(
    (
      highest: number,
      product: TopSellingProduct
    ) => Math.max(highest, product.discount),
    0
  );

  const hasRealSales = productsWithSales.length > 0;

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* TOP UTILITY BAR */}
      <div className="hidden bg-gray-950 text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">
          <p>Welcome to Marketplace</p>

          <div className="flex items-center gap-6">
            <Link
              href="/seller/apply"
              className="transition hover:text-orange-400"
            >
              Sell on Marketplace
            </Link>

            <Link
              href="/help"
              className="transition hover:text-orange-400"
            >
              Help Center
            </Link>

            <Link
              href="/track-order"
              className="transition hover:text-orange-400"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header className="sticky top-0 z-40 bg-orange-600 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">
          <Link
            href="/"
            className="shrink-0 text-xl font-black tracking-tight md:text-2xl"
          >
            MARKETPLACE
          </Link>

          {/* DESKTOP SEARCH */}
          <div className="hidden flex-1 md:flex">
            <form action="/" className="flex w-full">
              <input
                type="search"
                name="search"
                placeholder="Search products, brands and categories"
                className="w-full rounded-l-md bg-white px-4 py-3 text-sm text-gray-900 outline-none"
              />

              <button
                type="submit"
                className="rounded-r-md bg-gray-950 px-7 text-sm font-bold transition hover:bg-gray-800"
              >
                Search
              </button>
            </form>
          </div>

          {/* ACCOUNT */}
          <Link
            href="/account"
            className="hidden rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-orange-700 md:block"
          >
            Account
          </Link>

          {/* ORDERS */}
          <Link
            href="/account/orders"
            className="hidden rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-orange-700 md:block"
          >
            Orders
          </Link>

          {/* CART */}
          <Link
            href="/cart"
            className="rounded-md px-3 py-2 text-lg transition hover:bg-orange-700"
            aria-label="Shopping cart"
          >
            🛒
          </Link>
        </div>

        {/* MOBILE SEARCH */}
        <div className="px-4 pb-3 md:hidden">
          <form action="/" className="flex">
            <input
              type="search"
              name="search"
              placeholder="Search products, brands and categories"
              className="w-full rounded-l-md bg-white px-3 py-2.5 text-sm text-gray-900 outline-none"
            />

            <button
              type="submit"
              className="rounded-r-md bg-gray-950 px-4 text-sm font-bold"
            >
              Search
            </button>
          </form>
        </div>

        {/* NAVIGATION */}
        <nav className="bg-orange-700">
          <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-4 py-3 text-sm font-medium">
            <Link
              href="/"
              className="whitespace-nowrap transition hover:text-orange-200"
            >
              ☰ Categories
            </Link>

            <Link
              href="/flash-sales"
              className="whitespace-nowrap transition hover:text-orange-200"
            >
              ⚡ Flash Sales
            </Link>

            <Link
              href="/official-stores"
              className="whitespace-nowrap transition hover:text-orange-200"
            >
              Official Stores
            </Link>

            <Link
              href="/deals"
              className="whitespace-nowrap transition hover:text-orange-200"
            >
              Deals
            </Link>

            <Link
              href="/new-arrivals"
              className="whitespace-nowrap transition hover:text-orange-200"
            >
              New Arrivals
            </Link>

            <Link
              href="/top-selling"
              className="whitespace-nowrap font-bold text-white"
            >
              Top Selling
            </Link>

            <Link
              href="/seller/apply"
              className="whitespace-nowrap transition hover:text-orange-200"
            >
              Sell on Marketplace
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-orange-600/30 blur-3xl" />

        <div className="absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_0.6fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-400">
                <span>🏆</span>
                MARKETPLACE FAVOURITES
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
                Top Selling
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
                Discover the products shoppers are buying the most.
                Explore popular products from trusted Marketplace
                sellers and see what customers are choosing.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#top-products"
                  className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
                >
                  Explore Top Sellers
                </Link>

                <Link
                  href="/deals"
                  className="rounded-lg border border-gray-700 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  View Deals
                </Link>
              </div>
            </div>

            {/* HERO STATS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-black text-orange-400">
                  {topSellingProducts.length}
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Popular Products
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-black text-orange-400">
                  {totalUnitsSold}
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Units Sold
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500/20 text-xl">
                    🔥
                  </div>

                  <div>
                    <p className="font-bold text-white">
                      {hasRealSales
                        ? "Customer favourites"
                        : "Your first Marketplace favourites"}
                    </p>

                    <p className="text-sm text-gray-400">
                      {hasRealSales
                        ? "Ranked using real product order quantities."
                        : "Top-selling rankings will appear here as customers place orders."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BREADCRUMB */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="transition hover:text-orange-600"
            >
              Home
            </Link>

            <span>›</span>

            <span className="font-semibold text-gray-900">
              Top Selling
            </span>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <section
        id="top-products"
        className="mx-auto max-w-7xl px-4 py-10"
      >
        {/* SECTION HEADER */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                🏆
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  Top Selling Products
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {topSellingProducts.length}{" "}
                  {topSellingProducts.length === 1
                    ? "product"
                    : "products"}{" "}
                  available
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/"
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-gray-50"
              >
                ← Continue Shopping
              </Link>

              <Link
                href="/new-arrivals"
                className="rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                New Arrivals
              </Link>
            </div>
          </div>

          <div className="border-t bg-orange-50 px-5 py-3 md:px-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-orange-600">🔥</span>

              <span className="font-semibold text-orange-900">
                {hasRealSales
                  ? "These products are ranked by actual units purchased."
                  : "Start shopping and these rankings will update as orders are placed."}
              </span>
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {topSellingProducts.length === 0 ? (
          <div className="rounded-2xl bg-white p-14 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">
              🏆
            </div>

            <h3 className="mt-5 text-2xl font-black">
              No products available yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Approved products will appear here once they are
              available for customers to shop.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-orange-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {/* SUMMARY */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Popular Products
                </p>

                <p className="mt-2 text-2xl font-black text-gray-900">
                  {topSellingProducts.length}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Units Sold
                </p>

                <p className="mt-2 text-2xl font-black text-orange-600">
                  {totalUnitsSold}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Highest Discount
                </p>

                <p className="mt-2 text-2xl font-black text-green-600">
                  {highestDiscount}%
                </p>
              </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {topSellingProducts.map(
                (
                  product: TopSellingProduct,
                  index: number
                ) => (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* IMAGE */}
                    <Link
                      href={`/product/${product.slug}`}
                      className="relative block aspect-square overflow-hidden bg-gray-100"
                    >
                      {product.images[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={
                            product.images[0].altText ||
                            product.name
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl">
                          📦
                        </div>
                      )}

                      {/* RANK */}
                      <div className="absolute left-3 top-3">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-black text-white shadow-lg ${
                            index === 0
                              ? "bg-orange-600"
                              : "bg-gray-950"
                          }`}
                        >
                          #{index + 1} Top Seller
                        </span>
                      </div>

                      {/* DISCOUNT */}
                      {product.discount > 0 && (
                        <div className="absolute right-3 top-3">
                          <span className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-black text-white shadow-lg">
                            -{product.discount}%
                          </span>
                        </div>
                      )}

                      {/* SOLD */}
                      {product.totalSold > 0 && (
                        <div className="absolute bottom-3 left-3">
                          <span className="rounded-md bg-black/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                            🔥 {product.totalSold} sold
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* INFO */}
                    <div className="p-5">
                      {/* CATEGORY */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-md bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-600">
                          {product.category.name}
                        </span>

                        {product.totalSold > 0 && (
                          <span className="text-xs font-bold text-orange-600">
                            Popular
                          </span>
                        )}
                      </div>

                      {/* PRODUCT NAME */}
                      <Link
                        href={`/product/${product.slug}`}
                        className="mt-3 block min-h-[48px] line-clamp-2 text-base font-bold leading-6 transition hover:text-orange-600"
                      >
                        {product.name}
                      </Link>

                      {/* PRICE */}
                      <div className="mt-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-2xl font-black text-orange-600">
                            {formatPrice(product.price)}
                          </span>

                          {product.discount > 0 && (
                            <span className="rounded bg-red-50 px-2 py-1 text-xs font-bold text-red-600">
                              -{product.discount}%
                            </span>
                          )}
                        </div>

                        {product.compareAtPrice &&
                          product.compareAtPrice >
                            product.price && (
                            <div className="mt-1">
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(
                                  product.compareAtPrice
                                )}
                              </span>
                            </div>
                          )}
                      </div>

                      {/* SALES */}
                      <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50 p-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                            🔥
                          </span>

                          <div>
                            <p className="text-xs text-gray-500">
                              Units sold
                            </p>

                            <p className="text-sm font-black text-orange-700">
                              {product.totalSold}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* SELLER */}
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                          Sold by
                        </p>

                        <Link
                          href={`/seller/${product.seller.slug}`}
                          className="mt-1 block text-sm font-bold text-gray-800 transition hover:text-orange-600"
                        >
                          {product.seller.storeName}
                        </Link>
                      </div>

                      {/* BUTTON */}
                      <Link
                        href={`/product/${product.slug}`}
                        className="mt-5 flex w-full items-center justify-center rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
                      >
                        Shop Now →
                      </Link>
                    </div>
                  </article>
                )
              )}
            </div>
          </>
        )}
      </section>

      {/* DISCOVER MORE */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="rounded-2xl bg-gray-950 p-7 text-white md:p-10">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-400">
              Discover More
            </p>

            <h2 className="mt-2 text-2xl font-black md:text-3xl">
              Find more products you&apos;ll love
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
              Explore new arrivals, special offers and limited-time
              flash sales from Marketplace sellers.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/new-arrivals"
              className="rounded-lg bg-orange-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
            >
              New Arrivals
            </Link>

            <Link
              href="/flash-sales"
              className="rounded-lg border border-gray-700 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Flash Sales
            </Link>

            <Link
              href="/deals"
              className="rounded-lg border border-gray-700 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              View Deals
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div>
            <h3 className="text-2xl font-black">
              MARKETPLACE
            </h3>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Your trusted online marketplace connecting customers
              with verified sellers and quality products.
            </p>
          </div>

          {/* CUSTOMER SERVICE */}
          <div>
            <h3 className="font-bold">Customer Service</h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <Link
                href="/help"
                className="block transition hover:text-orange-400"
              >
                Help Center
              </Link>

              <Link
                href="/contact"
                className="block transition hover:text-orange-400"
              >
                Contact Us
              </Link>

              <Link
                href="/track-order"
                className="block transition hover:text-orange-400"
              >
                Track Order
              </Link>

              <Link
                href="/returns"
                className="block transition hover:text-orange-400"
              >
                Returns & Refunds
              </Link>
            </div>
          </div>

          {/* MARKETPLACE */}
          <div>
            <h3 className="font-bold">Marketplace</h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <Link
                href="/"
                className="block transition hover:text-orange-400"
              >
                Home
              </Link>

              <Link
                href="/category"
                className="block transition hover:text-orange-400"
              >
                Categories
              </Link>

              <Link
                href="/official-stores"
                className="block transition hover:text-orange-400"
              >
                Official Stores
              </Link>

              <Link
                href="/deals"
                className="block transition hover:text-orange-400"
              >
                Deals
              </Link>

              <Link
                href="/new-arrivals"
                className="block transition hover:text-orange-400"
              >
                New Arrivals
              </Link>

              <Link
                href="/top-selling"
                className="block font-semibold text-orange-400"
              >
                Top Selling
              </Link>

              <Link
                href="/flash-sales"
                className="block transition hover:text-orange-400"
              >
                Flash Sales
              </Link>
            </div>
          </div>

          {/* SHOP & SELL */}
          <div>
            <h3 className="font-bold">Shop & Sell</h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <Link
                href="/cart"
                className="block transition hover:text-orange-400"
              >
                Shopping Cart
              </Link>

              <Link
                href="/account/orders"
                className="block transition hover:text-orange-400"
              >
                My Orders
              </Link>

              <Link
                href="/seller/apply"
                className="block transition hover:text-orange-400"
              >
                Become a Seller
              </Link>

              <Link
                href="/seller"
                className="block transition hover:text-orange-400"
              >
                Seller Center
              </Link>

              <Link
                href="/seller/policies"
                className="block transition hover:text-orange-400"
              >
                Seller Policies
              </Link>

              <Link
                href="/seller/support"
                className="block transition hover:text-orange-400"
              >
                Seller Support
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="border-t border-gray-800">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-4 py-5 text-xs text-gray-500 md:flex-row">
            <p>
              © 2026 Marketplace. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                href="/privacy"
                className="transition hover:text-orange-400"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="transition hover:text-orange-400"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/cookies"
                className="transition hover:text-orange-400"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}