"use client";

import { FormEvent, useState } from "react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Your new password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        "Your new password must be different from your current password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/account/security/password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.message ||
            "Unable to change your password."
        );
        return;
      }

      setMessage(
        data?.message ||
          "Your password has been changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-5"
    >
      {/* Current Password */}
      <div>
        <label
          htmlFor="currentPassword"
          className="mb-2 block text-sm font-bold text-gray-800"
        >
          Current Password
        </label>

        <div className="relative">
          <input
            id="currentPassword"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(event.target.value)
            }
            autoComplete="current-password"
            placeholder="Enter your current password"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-20 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />

          <button
            type="button"
            onClick={() =>
              setShowCurrent((value) => !value)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-500 hover:text-orange-600"
          >
            {showCurrent ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label
          htmlFor="newPassword"
          className="mb-2 block text-sm font-bold text-gray-800"
        >
          New Password
        </label>

        <div className="relative">
          <input
            id="newPassword"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            autoComplete="new-password"
            placeholder="Enter your new password"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-20 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />

          <button
            type="button"
            onClick={() =>
              setShowNew((value) => !value)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-500 hover:text-orange-600"
          >
            {showNew ? "Hide" : "Show"}
          </button>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Use at least 8 characters. A combination of letters,
          numbers and symbols is recommended.
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-bold text-gray-800"
        >
          Confirm New Password
        </label>

        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            autoComplete="new-password"
            placeholder="Confirm your new password"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-20 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirm((value) => !value)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-500 hover:text-orange-600"
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      )}

      {/* Submit */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Changing Password..."
            : "Change Password"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setError("");
            setMessage("");
          }}
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
        >
          Clear
        </button>
      </div>
    </form>
  );
}