"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      window.location.href = "/login";
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span>{loading ? "Logging out..." : "↪ Logout"}</span>
      <span>›</span>
    </button>
  );
}