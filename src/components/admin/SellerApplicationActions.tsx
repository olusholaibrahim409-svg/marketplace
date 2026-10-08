"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  applicationId: string;
};

export default function SellerApplicationActions({
  applicationId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [showReject, setShowReject] =
    useState(false);

  const [rejectionReason, setRejectionReason] =
    useState("");

  const [error, setError] =
    useState("");

  const handleApprove = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to approve this seller application?"
      );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          `/api/admin/seller-applications/${applicationId}`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              action: "APPROVE",
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to approve application."
        );
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to approve application."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    const reason =
      rejectionReason.trim();

    if (!reason) {
      setError(
        "Please enter a rejection reason."
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          `/api/admin/seller-applications/${applicationId}`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              action: "REJECT",

              rejectionReason:
                reason,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to reject application."
        );
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to reject application."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">
            {error}
          </p>
        </div>
      )}

      {!showReject ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              setShowReject(true)
            }
            disabled={loading}
            className="rounded-xl border border-red-200 bg-red-50 px-6 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ✕ Reject Application
          </button>

          <button
            type="button"
            onClick={handleApprove}
            disabled={loading}
            className="rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Approving..."
              : "✓ Approve Application"}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <h3 className="font-bold text-red-800">
            Reject Seller Application
          </h3>

          <p className="mt-1 text-sm text-red-700">
            Please provide a reason for rejecting
            this application.
          </p>

          <textarea
            value={rejectionReason}
            onChange={(event) =>
              setRejectionReason(
                event.target.value
              )
            }
            disabled={loading}
            rows={4}
            placeholder="Enter the reason for rejection..."
            className="mt-4 w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:opacity-50"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setShowReject(false);
                setRejectionReason("");
                setError("");
              }}
              disabled={loading}
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleReject}
              disabled={loading}
              className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Rejecting..."
                : "Confirm Rejection"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}