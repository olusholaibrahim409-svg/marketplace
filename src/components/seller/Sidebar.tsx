"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    label: "Dashboard",
    href: "/seller",
    icon: "📊",
  },
  {
    label: "Products",
    href: "/seller/products",
    icon: "📦",
  },
  {
    label: "Add Product",
    href: "/seller/products/new",
    icon: "➕",
  },
  {
    label: "Orders",
    href: "/seller/orders",
    icon: "🛒",
  },
  {
    label: "Store Settings",
    href: "/seller/store",
    icon: "🏪",
  },
];

type SellerProfile = {
  id: string;
  storeName: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  phone: string | null;
  status: string;
};

export default function SellerSidebar() {
  const pathname = usePathname();

  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [loadingSeller, setLoadingSeller] = useState(true);

  useEffect(() => {
    async function loadSeller() {
      try {
        const response = await fetch("/api/seller/store", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          setSeller(null);
          return;
        }

        const data = await response.json();

        if (data.seller) {
          setSeller(data.seller);
        }
      } catch (error) {
        console.error("Failed to load seller store:", error);
      } finally {
        setLoadingSeller(false);
      }
    }

    loadSeller();
  }, []);

  const storeUrl = seller?.slug
    ? `/seller/${seller.slug}`
    : "/seller/store";

  return (
    <aside className="w-full shrink-0 border-b bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="p-5">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Seller Center
          </p>

          <h2 className="mt-1 text-xl font-bold text-gray-900">
            MARKETPLACE
          </h2>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/seller"
                ? pathname === "/seller"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#f68b1e] text-white"
                    : "text-gray-600 hover:bg-orange-50 hover:text-[#f68b1e]"
                }`}
              >
                <span className="text-lg">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="my-6 border-t border-gray-200" />

        <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Store
        </p>

        <Link
          href={storeUrl}
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-orange-50 hover:text-[#f68b1e]"
        >
          <span className="text-lg">🌐</span>

          <span>
            {loadingSeller ? "Loading Store..." : "View My Store"}
          </span>
        </Link>
      </div>
    </aside>
  );
}