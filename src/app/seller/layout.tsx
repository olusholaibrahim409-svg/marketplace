"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SellerSidebar from "@/components/seller/Sidebar";

type SellerProfile = {
  id: string;
  storeName: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  phone: string | null;
  status: string;
};

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  if (pathname === "/seller/apply") {
    return <>{children}</>;
  }

  const storeUrl = seller?.slug
    ? `/seller/${seller.slug}`
    : "/seller/store";

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-50 bg-[#f68b1e] text-white shadow">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 lg:px-6">
          <Link
            href="/seller"
            className="text-xl font-extrabold tracking-tight sm:text-2xl"
          >
            MARKETPLACE

            <span className="ml-2 text-xs font-medium opacity-80">
              Seller Center
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden rounded-lg px-4 py-2 text-sm font-semibold transition hover:bg-white/10 sm:block"
            >
              🏠 Marketplace
            </Link>

            <Link
              href={storeUrl}
              target="_blank"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#f68b1e] transition hover:bg-gray-100"
            >
              {loadingSeller ? "Loading Store..." : "View Store"}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] flex-col lg:flex-row">
        <SellerSidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}