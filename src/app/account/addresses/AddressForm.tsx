
"use client";

import { useEffect, useState } from "react";

export type AddressFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  addressType: "HOME" | "OFFICE" | "OTHER";
  deliveryInstructions: string;
  isDefault: boolean;
};

type AddressFormProps = {
  address?: AddressFormData & {
    id: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
};

const emptyForm: AddressFormData = {
  firstName: "",
  lastName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "Nigeria",
  postalCode: "",
  addressType: "HOME",
  deliveryInstructions: "",
  isDefault: false,
};

export default function AddressForm({
  address,
  onSuccess,
  onCancel,
}: AddressFormProps) {
  const isEditing = Boolean(address?.id);

  const [formData, setFormData] =
    useState<AddressFormData>(emptyForm);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (address) {
      setFormData({
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || "",
        city: address.city,
        state: address.state,
        country: address.country || "Nigeria",
        postalCode: address.postalCode || "",
        addressType: address.addressType,
        deliveryInstructions:
          address.deliveryInstructions || "",
        isDefault: address.isDefault,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [address]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isEditing && !address?.id) {
      setError("The address could not be identified. Please close the form and try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url =
        isEditing && address?.id
          ? `/api/account/addresses/${address.id}`
          : "/api/account/addresses";

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditing
              ? "Failed to update address."
              : "Failed to save address.")
        );
      }

      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
              Delivery Management
            </p>

            <h2 className="text-xl font-bold text-slate-900">
              {isEditing ? "Edit Address" : "Add New Address"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Update your delivery information below."
                : "Enter your delivery information below."}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-8">
          <section>
            <div className="mb-4">
              <h3 className="font-semibold text-slate-900">
                Contact Information
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Who should receive this delivery?
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="First Name *"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />

              <Input
                label="Last Name *"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                required
              />

              <div className="md:col-span-2">
                <Input
                  label="Phone Number *"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 08012345678"
                  required
                />
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h3 className="font-semibold text-slate-900">
                Delivery Address
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Where should your order be delivered?
              </p>
            </div>

            <div className="space-y-5">
              <Input
                label="Address Line 1 *"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="House number, street name"
                required
              />

              <Input
                label={
                  <>
                    Address Line 2{" "}
                    <span className="font-normal text-slate-400">
                      (Optional)
                    </span>
                  </>
                }
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Apartment, landmark, estate, etc."
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="City *"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Ibadan"
                  required
                />

                <Input
                  label="State *"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Oyo"
                  required
                />

                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />

                <Input
                  label={
                    <>
                      Postal Code{" "}
                      <span className="font-normal text-slate-400">
                        (Optional)
                      </span>
                    </>
                  }
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Postal code"
                />
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h3 className="font-semibold text-slate-900">
                Address Preferences
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Help us organize your saved addresses.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="addressType"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Address Type
                </label>

                <select
                  id="addressType"
                  name="addressType"
                  value={formData.addressType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="HOME">Home</option>
                  <option value="OFFICE">Office</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  name="isDefault"
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />

                <span>
                  <span className="block text-sm font-medium text-slate-800">
                    Set as default address
                  </span>
                  <span className="block text-xs text-slate-500">
                    Use this address automatically during checkout.
                  </span>
                </span>
              </label>
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h3 className="font-semibold text-slate-900">
                Delivery Instructions
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Add helpful information for the delivery agent.
              </p>
            </div>

            <textarea
              id="deliveryInstructions"
              name="deliveryInstructions"
              value={formData.deliveryInstructions}
              onChange={handleChange}
              rows={4}
              placeholder="Example: Call me when you arrive. The house is beside..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </section>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? isEditing
                ? "Updating Address..."
                : "Saving Address..."
              : isEditing
                ? "Update Address"
                : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: React.ReactNode;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
    </div>
  );
}
