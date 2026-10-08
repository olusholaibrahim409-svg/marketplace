"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  productId: string;
  variantId?: string | null;
  variantName?: string | null;
  variantAttributes?: Record<string, unknown> | null;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  sellerName: string;
};

function getVariantOptionLabel(
  attributes?: Record<string, unknown> | null
) {
  if (!attributes) {
    return "Option";
  }

  const keys = Object.keys(attributes);

  if (keys.length === 0) {
    return "Option";
  }

  const key = keys[0];

  const labels: Record<string, string> = {
    size: "Size",
    color: "Color",
    colour: "Colour",
    storage: "Storage",
    capacity: "Capacity",
    ram: "RAM",
    memory: "Memory",
    material: "Material",
    style: "Style",
    model: "Model",
    version: "Version",
    length: "Length",
    weight: "Weight",
    finish: "Finish",
  };

  return (
    labels[key.toLowerCase()] ||
    key.charAt(0).toUpperCase() + key.slice(1)
  );
}

function getVariantOptionValue(
  attributes?: Record<string, unknown> | null
) {
  if (!attributes) {
    return null;
  }

  const keys = Object.keys(attributes);

  if (keys.length === 0) {
    return null;
  }

  const value = attributes[keys[0]];

  if (value === null || value === undefined) {
    return null;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return null;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<
    "PAYSTACK" | "CASH_ON_DELIVERY"
  >("PAYSTACK");

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("marketplace_cart");

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error("Unable to load cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const shippingFee = subtotal > 0 ? 2500 : 0;
  const total = subtotal + shippingFee;

  const formatPrice = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG")}`;
  };

  async function handlePlaceOrder(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);

    try {
      /*
       * STEP 1
       * Create the order in our database.
       */
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          addressLine1,
          city,
          state,
          paymentMethod,
          items: cart.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
          })),
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        if (orderResponse.status === 401) {
          window.location.href = "/login";
          return;
        }

        throw new Error(
          orderData.message || "Unable to place your order."
        );
      }

      const orderId = orderData.order?.id;

      if (!orderId) {
        throw new Error(
          "Order was created but no order ID was returned."
        );
      }

      /*
       * STEP 2
       * If the customer selected Paystack,
       * initialize the Paystack transaction.
       */
      if (paymentMethod === "PAYSTACK") {
        const paystackResponse = await fetch(
          "/api/paystack/initialize",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId,
            }),
          }
        );

        const paystackData =
          await paystackResponse.json();

        if (!paystackResponse.ok) {
          throw new Error(
            paystackData.message ||
              "Unable to initialize Paystack payment."
          );
        }

        if (!paystackData.authorizationUrl) {
          throw new Error(
            "Paystack did not return a checkout URL."
          );
        }

        /*
         * Keep the cart until payment is completed.
         * The cart will be cleared after successful verification.
         */
        window.location.href =
          paystackData.authorizationUrl;

        return;
      }

      /*
       * CASH ON DELIVERY
       *
       * No Paystack payment is required.
       */
      setSuccess(
        `Order ${orderData.order.orderNumber} was created successfully.`
      );

      localStorage.removeItem("marketplace_cart");
      setCart([]);

      setTimeout(() => {
        window.location.href = `/account`;
      }, 2000);
    } catch (error) {
      console.error("PLACE ORDER ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to place your order."
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f5f5] px-4 py-10">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-gray-600">
            Loading checkout...
          </p>
        </div>
      </main>
    );
  }

  if (cart.length === 0 && !success) {
    return (
      <main className="min-h-screen bg-[#f5f5f5] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-2 text-gray-600">
            Add some products to your cart before checking
            out.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-[#f68b1e] px-6 py-3 font-semibold text-white hover:bg-[#e57d12]"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* HEADER */}

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Link
            href="/"
            className="text-2xl font-extrabold text-[#f68b1e]"
          >
            MARKETPLACE
          </Link>

          <Link
            href="/cart"
            className="text-sm font-semibold text-gray-700 hover:text-[#f68b1e]"
          >
            ← Back to Cart
          </Link>
        </div>
      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Checkout
        </h1>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}

            <div className="mt-1">
              Redirecting to your account...
            </div>
          </div>
        )}

        <form
          onSubmit={handlePlaceOrder}
          className="grid gap-6 lg:grid-cols-[1fr_380px]"
        >
          {/* LEFT SIDE */}

          <div className="space-y-6">
            {/* CUSTOMER INFORMATION */}

            <section className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Customer Information
              </h2>

              <div className="grid gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    required
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#f68b1e]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#f68b1e]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    required
                    placeholder="08012345678"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#f68b1e]"
                  />
                </div>
              </div>
            </section>

            {/* DELIVERY */}

            <section className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Delivery Address
              </h2>

              <div className="grid gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Street Address
                  </label>

                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(event) =>
                      setAddressLine1(event.target.value)
                    }
                    required
                    placeholder="House number, street name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#f68b1e]"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      City
                    </label>

                    <input
                      type="text"
                      value={city}
                      onChange={(event) =>
                        setCity(event.target.value)
                      }
                      required
                      placeholder="e.g. Ibadan"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#f68b1e]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      State
                    </label>

                    <input
                      type="text"
                      value={state}
                      onChange={(event) =>
                        setState(event.target.value)
                      }
                      required
                      placeholder="e.g. Oyo"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#f68b1e]"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* PAYMENT */}

            <section className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Payment Method
              </h2>

              <div className="space-y-3">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                    paymentMethod === "PAYSTACK"
                      ? "border-[#f68b1e] bg-orange-50"
                      : "hover:border-[#f68b1e]"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PAYSTACK"
                    checked={
                      paymentMethod === "PAYSTACK"
                    }
                    onChange={() =>
                      setPaymentMethod("PAYSTACK")
                    }
                  />

                  <div>
                    <p className="font-semibold text-gray-900">
                      Pay with Paystack
                    </p>

                    <p className="text-sm text-gray-500">
                      Card, bank transfer and other supported
                      payment methods.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                    paymentMethod === "CASH_ON_DELIVERY"
                      ? "border-[#f68b1e] bg-orange-50"
                      : "hover:border-[#f68b1e]"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH_ON_DELIVERY"
                    checked={
                      paymentMethod ===
                      "CASH_ON_DELIVERY"
                    }
                    onChange={() =>
                      setPaymentMethod(
                        "CASH_ON_DELIVERY"
                      )
                    }
                  />

                  <div>
                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay when your order is delivered.
                    </p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* ORDER SUMMARY */}

          <aside className="h-fit rounded-xl bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="mb-5 text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="space-y-4">
              {cart.map((item) => {
                const optionLabel =
                  getVariantOptionLabel(
                    item.variantAttributes
                  );

                const optionValue =
                  getVariantOptionValue(
                    item.variantAttributes
                  );

                const selectedOption =
                  optionValue ||
                  item.variantName ||
                  null;

                return (
                  <div
                    key={`${item.productId}-${item.variantId || "default"}`}
                    className="flex gap-3 border-b pb-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                        {item.name}
                      </p>

                      {/* SELECTED VARIANT */}

                      {item.variantId &&
                        selectedOption && (
                          <div className="mt-2 rounded-md bg-orange-50 px-2.5 py-1.5">
                            <p className="text-xs text-gray-500">
                              <span className="font-bold text-gray-700">
                                {optionLabel}:
                              </span>{" "}
                              <span className="font-bold text-[#f68b1e]">
                                {selectedOption}
                              </span>
                            </p>
                          </div>
                        )}

                      <p className="mt-2 text-xs text-gray-500">
                        Sold by{" "}
                        <span className="font-semibold text-gray-700">
                          {item.sellerName}
                        </span>
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>

                      <p className="mt-1 font-semibold text-[#f68b1e]">
                        {formatPrice(
                          Number(item.price) *
                            item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TOTALS */}

            <div className="mt-5 space-y-3 border-b pb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Subtotal
                </span>

                <span className="font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Delivery
                </span>

                <span className="font-semibold">
                  {formatPrice(shippingFee)}
                </span>
              </div>
            </div>

            <div className="flex justify-between py-5">
              <span className="text-lg font-bold text-gray-900">
                Total
              </span>

              <span className="text-xl font-extrabold text-[#f68b1e]">
                {formatPrice(total)}
              </span>
            </div>

            <button
              type="submit"
              disabled={placingOrder || Boolean(success)}
              className="w-full rounded-lg bg-[#f68b1e] px-5 py-3.5 font-bold text-white transition hover:bg-[#e57d12] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {placingOrder
                ? paymentMethod === "PAYSTACK"
                  ? "Connecting to Paystack..."
                  : "Placing Order..."
                : paymentMethod === "PAYSTACK"
                ? "Pay with Paystack"
                : "Place Order"}
            </button>

            <p className="mt-3 text-center text-xs text-gray-500">
              By placing this order, you agree to our terms
              and conditions.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}