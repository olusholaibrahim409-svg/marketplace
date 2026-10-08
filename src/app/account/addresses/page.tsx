"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";

type Address = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string | null;
  addressType: "HOME" | "OFFICE" | "OTHER";
  deliveryInstructions: string | null;
  isDefault: boolean;
  createdAt: string;
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [editingAddress, setEditingAddress] =
    useState<Address | null>(null);

  async function loadAddresses() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/account/addresses", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load addresses."
        );
      }

      setAddresses(data.addresses || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your addresses."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  function handleAddressSaved() {
    setShowForm(false);
    setEditingAddress(null);
    loadAddresses();
  }

  function handleEdit(address: Address) {
    setEditingAddress(address);
    setShowForm(true);
    setError("");
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingAddress(null);
    setError("");
  }

  async function handleDelete(address: Address) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the address for ${address.firstName} ${address.lastName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `/api/account/addresses/${address.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete address."
        );
      }

      await loadAddresses();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete this address."
      );
    }
  }

  async function handleSetDefault(address: Address) {
    try {
      setError("");

      const response = await fetch(
        `/api/account/addresses/${address.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isDefault: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to set default address."
        );
      }

      await loadAddresses();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to set this address as default."
      );
    }
  }

  const defaultAddress = addresses.find(
    (address) => address.isDefault
  );

  const otherAddresses = addresses.filter(
    (address) => !address.isDefault
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Utility Bar */}
      <div className="bg-slate-950 text-sm text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <p className="hidden sm:block">
            Welcome to Marketplace
          </p>

          <div className="ml-auto flex items-center gap-5">
            <Link
              href="/contact"
              className="transition hover:text-white"
            >
              Need Help?
            </Link>

            <Link
              href="/account/orders"
              className="transition hover:text-white"
            >
              Track Order
            </Link>

            <Link
              href="/seller/apply"
              className="transition hover:text-white"
            >
              Sell on Marketplace
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-orange-500 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center gap-4">
            <Link
              href="/"
              className="shrink-0 text-xl font-black tracking-tight text-white sm:text-2xl"
            >
              MARKETPLACE
            </Link>

            {/* Search */}
            <div className="hidden flex-1 md:block">
              <div className="mx-auto flex max-w-2xl overflow-hidden rounded-xl bg-white shadow-sm">
                <input
                  type="text"
                  placeholder="Search products, brands and categories..."
                  className="min-w-0 flex-1 border-0 px-5 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  className="bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Account Links */}
            <div className="ml-auto flex items-center gap-4 text-sm font-semibold text-white">
              <Link
                href="/account"
                className="hidden transition hover:text-orange-100 sm:block"
              >
                My Account
              </Link>

              <Link
                href="/account/orders"
                className="hidden transition hover:text-orange-100 sm:block"
              >
                Orders
              </Link>

              <Link
                href="/cart"
                className="transition hover:text-orange-100"
              >
                Cart
              </Link>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="pb-4 md:hidden">
            <div className="flex overflow-hidden rounded-xl bg-white">
              <input
                type="text"
                placeholder="Search products..."
                className="min-w-0 flex-1 border-0 px-4 py-3 text-sm outline-none"
              />

              <button
                type="button"
                className="bg-slate-950 px-5 text-sm font-semibold text-white"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-orange-400 bg-orange-500">
          <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-3 text-sm font-semibold text-white scrollbar-hide sm:px-6 lg:px-8">
            <Link
              href="/"
              className="whitespace-nowrap transition hover:text-orange-100"
            >
              Home
            </Link>

            <Link
              href="/categories"
              className="whitespace-nowrap transition hover:text-orange-100"
            >
              Categories
            </Link>

            <Link
              href="/deals"
              className="whitespace-nowrap transition hover:text-orange-100"
            >
              Deals
            </Link>

            <Link
              href="/flash-sales"
              className="whitespace-nowrap transition hover:text-orange-100"
            >
              Flash Sales
            </Link>

            <Link
              href="/new-arrivals"
              className="whitespace-nowrap transition hover:text-orange-100"
            >
              New Arrivals
            </Link>

            <Link
              href="/top-selling"
              className="whitespace-nowrap transition hover:text-orange-100"
            >
              Top Selling
            </Link>

            <Link
              href="/seller/apply"
              className="whitespace-nowrap transition hover:text-orange-100"
            >
              Sell on Marketplace
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero */}
        <section className="bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
                  <Link
                    href="/"
                    className="transition hover:text-white"
                  >
                    Home
                  </Link>

                  <span>/</span>

                  <Link
                    href="/account"
                    className="transition hover:text-white"
                  >
                    My Account
                  </Link>

                  <span>/</span>

                  <span className="text-white">
                    Addresses
                  </span>
                </div>

                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
                  Delivery Management
                </p>

                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  My Addresses
                </h1>

                <p className="mt-3 max-w-2xl text-slate-400">
                  Save your delivery addresses for a faster and
                  easier checkout experience.
                </p>
              </div>

              {!showForm && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingAddress(null);
                    setShowForm(true);
                    setError("");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-orange-600"
                >
                  <span className="text-lg leading-none">
                    +
                  </span>
                  Add New Address
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
              {/* Sidebar */}
              <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
                    A
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      My Account
                    </p>

                    <p className="font-semibold text-slate-900">
                      Manage your account
                    </p>
                  </div>
                </div>

                <nav className="space-y-1">
                  <SidebarLink
                    href="/account"
                    icon="▦"
                    label="Account Overview"
                  />

                  <SidebarLink
                    href="/account/orders"
                    icon="▤"
                    label="My Orders"
                  />

                  <SidebarLink
                    href="/account/profile"
                    icon="◉"
                    label="My Profile"
                  />

                  <SidebarLink
                    href="/account/addresses"
                    icon="⌖"
                    label="My Addresses"
                    active
                  />

                  {/* FIXED WISHLIST LINK */}
                  <SidebarLink
                    href="/account/wishlist"
                    icon="♡"
                    label="Wishlist"
                  />

                  <SidebarLink
                    href="/cart"
                    icon="▢"
                    label="Shopping Cart"
                  />

                  <div className="my-3 border-t border-slate-200" />

                  <SidebarLink
                    href="/account/security"
                    icon="◇"
                    label="Security"
                  />

                  <SidebarLink
                    href="/contact"
                    icon="?"
                    label="Help & Support"
                  />
                </nav>
              </aside>

              {/* Main Address Area */}
              <div className="min-w-0">
                {showForm ? (
                  <AddressForm
                    address={
                      editingAddress
                        ? {
                            id: editingAddress.id,
                            firstName:
                              editingAddress.firstName,
                            lastName:
                              editingAddress.lastName,
                            phone: editingAddress.phone,
                            addressLine1:
                              editingAddress.addressLine1,
                            addressLine2:
                              editingAddress.addressLine2 ||
                              "",
                            city: editingAddress.city,
                            state: editingAddress.state,
                            country:
                              editingAddress.country ||
                              "Nigeria",
                            postalCode:
                              editingAddress.postalCode ||
                              "",
                            addressType:
                              editingAddress.addressType,
                            deliveryInstructions:
                              editingAddress.deliveryInstructions ||
                              "",
                            isDefault:
                              editingAddress.isDefault,
                          }
                        : undefined
                    }
                    onSuccess={handleAddressSaved}
                    onCancel={handleCancelForm}
                  />
                ) : (
                  <>
                    {/* Header Card */}
                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                          <div className="mb-2 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-xl text-orange-600">
                              ⌖
                            </div>

                            <h2 className="text-xl font-bold text-slate-900">
                              Delivery Addresses
                            </h2>
                          </div>

                          <p className="max-w-2xl text-sm leading-6 text-slate-500">
                            Add your home, office or other delivery
                            locations. Your saved addresses will be
                            available during checkout.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddress(null);
                            setShowForm(true);
                            setError("");
                          }}
                          className="shrink-0 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                        >
                          + Add New Address
                        </button>
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                        {error}
                      </div>
                    )}

                    {/* Loading */}
                    {loading ? (
                      <AddressLoading />
                    ) : addresses.length === 0 ? (
                      <EmptyAddresses
                        onAdd={() => {
                          setEditingAddress(null);
                          setShowForm(true);
                        }}
                      />
                    ) : (
                      <div className="space-y-6">
                        {/* Default Address */}
                        {defaultAddress && (
                          <AddressCard
                            address={defaultAddress}
                            onAdd={() => {
                              setEditingAddress(null);
                              setShowForm(true);
                            }}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onSetDefault={handleSetDefault}
                          />
                        )}

                        {/* Other Addresses */}
                        {otherAddresses.length > 0 && (
                          <div>
                            <div className="mb-4 flex items-center justify-between">
                              <h3 className="font-bold text-slate-900">
                                Other Saved Addresses
                              </h3>

                              <span className="text-sm text-slate-500">
                                {otherAddresses.length}{" "}
                                {otherAddresses.length === 1
                                  ? "address"
                                  : "addresses"}
                              </span>
                            </div>

                            <div className="grid gap-5 xl:grid-cols-2">
                              {otherAddresses.map(
                                (address) => (
                                  <AddressCard
                                    key={address.id}
                                    address={address}
                                    onAdd={() => {
                                      setEditingAddress(null);
                                      setShowForm(true);
                                    }}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onSetDefault={
                                      handleSetDefault
                                    }
                                  />
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Add Another */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddress(null);
                            setShowForm(true);
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-6 text-sm font-semibold text-slate-600 transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
                        >
                          <span className="text-xl">+</span>
                          Add Another Address
                        </button>
                      </div>
                    )}

                    {/* Information */}
                    <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                      <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl text-emerald-700">
                          ✓
                        </div>

                        <div>
                          <h3 className="font-bold text-emerald-900">
                            Your addresses stay organized
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-emerald-800">
                            Save multiple delivery locations and
                            choose the appropriate address whenever
                            you place an order. You can update or
                            remove saved addresses at any time.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link
                href="/"
                className="text-xl font-black tracking-tight text-white"
              >
                MARKETPLACE
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
                Your trusted online marketplace for quality products
                from verified sellers.
              </p>

              <Link
                href="/seller/apply"
                className="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                Become a Seller
              </Link>
            </div>

            <FooterColumn
              title="Customer Service"
              links={[
                ["Help Center", "/help"],
                ["Contact Us", "/contact"],
                ["Track Order", "/account/orders"],
                ["Returns & Refunds", "/returns"],
              ]}
            />

            <FooterColumn
              title="Marketplace"
              links={[
                ["Home", "/"],
                ["Categories", "/categories"],
                ["Deals", "/deals"],
                ["New Arrivals", "/new-arrivals"],
                ["Top Selling", "/top-selling"],
                ["Flash Sales", "/flash-sales"],
              ]}
            />

            <FooterColumn
              title="Shop & Sell"
              links={[
                ["Shopping Cart", "/cart"],
                ["My Orders", "/account/orders"],
                ["Become a Seller", "/seller/apply"],
                ["Seller Center", "/seller"],
                ["Seller Policies", "/seller/policies"],
                ["Seller Support", "/seller/support"],
              ]}
            />
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © 2026 Marketplace. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                href="/privacy"
                className="transition hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="transition hover:text-white"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/cookies"
                className="transition hover:text-white"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Sidebar Link */
function SidebarLink({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition ${
        active
          ? "bg-orange-50 text-orange-600"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className="flex items-center gap-3">
        <span className="w-5 text-center">{icon}</span>
        {label}
      </span>

      <span className="text-slate-400">›</span>
    </Link>
  );
}

/* Address Card */
function AddressCard({
  address,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: Address;
  onAdd: () => void;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
}) {
  const typeLabel =
    address.addressType === "HOME"
      ? "Home"
      : address.addressType === "OFFICE"
        ? "Office"
        : "Other";

  return (
    <div
      className={`rounded-2xl border bg-white p-6 shadow-sm transition ${
        address.isDefault
          ? "border-orange-300 ring-1 ring-orange-100"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-lg text-orange-600">
            ⌖
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-900">
                {address.firstName} {address.lastName}
              </h3>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {typeLabel}
              </span>

              {address.isDefault && (
                <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700">
                  Default
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {address.phone}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="shrink-0 text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          Add
        </button>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <p className="text-sm leading-6 text-slate-700">
          {address.addressLine1}

          {address.addressLine2 && (
            <>
              <br />
              {address.addressLine2}
            </>
          )}

          <br />

          {address.city}, {address.state}

          {address.postalCode &&
            ` ${address.postalCode}`}

          <br />

          {address.country}
        </p>

        {address.deliveryInstructions && (
          <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Delivery Instructions
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {address.deliveryInstructions}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
        {/* Edit */}
        <button
          type="button"
          onClick={() => onEdit(address)}
          className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
        >
          Edit
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(address)}
          className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
        >
          Delete
        </button>

        {/* Set Default */}
        {!address.isDefault && (
          <button
            type="button"
            onClick={() => onSetDefault(address)}
            className="rounded-lg border border-orange-200 px-4 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-50"
          >
            Set as Default
          </button>
        )}
      </div>
    </div>
  );
}

/* Empty State */
function EmptyAddresses({
  onAdd,
}: {
  onAdd: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-3xl text-orange-500">
        ⌖
      </div>

      <h2 className="mt-6 text-xl font-bold text-slate-900">
        No saved addresses yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        You haven't added a delivery address yet. Add your first
        address to make checkout faster and easier.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
      >
        <span className="text-lg">+</span>
        Add Your First Address
      </button>
    </div>
  );
}

/* Loading */
function AddressLoading() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex gap-4">
            <div className="h-11 w-11 rounded-xl bg-slate-200" />

            <div className="flex-1">
              <div className="h-4 w-40 rounded bg-slate-200" />

              <div className="mt-3 h-3 w-24 rounded bg-slate-200" />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="h-3 w-full rounded bg-slate-200" />
            <div className="h-3 w-4/5 rounded bg-slate-200" />
            <div className="h-3 w-3/5 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* Footer Column */
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h3 className="font-bold text-white">
        {title}
      </h3>

      <ul className="mt-4 space-y-3">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}