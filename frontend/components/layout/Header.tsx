"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function Header() {
  const router = useRouter();

  const [logoutLoading, setLogoutLoading] =
    useState(false);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <div>
        <h1 className="text-xl font-semibold">
          City Care Hospital
        </h1>
      </div>

      <div className="flex items-center gap-5">
        <span className="text-sm text-slate-500">
          Hospital Management System
        </span>

        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {logoutLoading
            ? "Logging out..."
            : "Logout"}
        </button>
      </div>
    </header>
  );
}