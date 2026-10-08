"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function PaystackCallbackContent() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      setLoading(false);
      setMessage("No Paystack payment reference was provided.");
      return;
    }

    const paymentReference = reference;

    async function verifyPayment() {
      try {
        const response = await fetch(
          `/api/paystack/verify?reference=${encodeURIComponent(
            paymentReference
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success || !data.paid) {
          throw new Error(
            data.message || "Payment could not be verified."
          );
        }

        localStorage.removeItem("marketplace_cart");

        setSuccess(true);
        setOrderNumber(data.orderNumber || "");
        setMessage(
          data.message || "Payment verified successfully."
        );
      } catch (error) {
        console.error("PAYSTACK CALLBACK ERROR:", error);

        setSuccess(false);

        setMessage(
          error instanceof Error
            ? error.message
            : "We could not verify your payment."
        );
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-orange-200 border-t-[#f68b1e]" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Verifying your payment
          </h1>

          <p className="mt-2 text-gray-600">
            Please wait while we confirm your Paystack transaction.
          </p>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="text-3xl text-green-600">✓</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Payment Successful
          </h1>

          <p className="mt-3 text-gray-600">
            Your payment has been successfully verified.
          </p>

          {orderNumber && (
            <div className="mt-5 rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Order Number
              </p>

              <p className="mt-1 text-lg font-bold text-gray-900">
                {orderNumber}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/account/orders"
              className="rounded-lg bg-[#f68b1e] px-6 py-3 font-semibold text-white hover:bg-[#e57d12]"
            >
              View My Orders
            </Link>

            <Link
              href="/"
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="text-3xl text-red-600">!</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Payment Verification Failed
        </h1>

        <p className="mt-3 text-gray-600">
          {message}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/checkout"
            className="rounded-lg bg-[#f68b1e] px-6 py-3 font-semibold text-white hover:bg-[#e57d12]"
          >
            Return to Checkout
          </Link>

          <Link
            href="/account/orders"
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            My Orders
          </Link>
        </div>
      </div>
    </main>
  );
}

function LoadingFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
          <div className="h-7 w-7 animate-spin rounded-full border-4 border-orange-200 border-t-[#f68b1e]" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Loading payment page
        </h1>

        <p className="mt-2 text-gray-600">
          Please wait...
        </p>
      </div>
    </main>
  );
}

export default function PaystackCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaystackCallbackContent />
    </Suspense>
  );
}