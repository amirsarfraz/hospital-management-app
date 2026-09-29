"use client";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";

import {
  supabase,
} from "@/lib/supabase";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({
  onMenuClick,
}: HeaderProps) {
  const router = useRouter();

  const [
    logoutLoading,
    setLogoutLoading,
  ] = useState(false);

  const handleLogout =
    async () => {
      try {
        setLogoutLoading(true);

        const { error } =
          await supabase.auth.signOut();

        if (error) {
          throw error;
        }

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "refresh_token"
        );

        localStorage.removeItem(
          "role"
        );

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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile/tablet menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        </button>

        <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg lg:text-xl">
          City Care Hospital
        </h1>
      </div>

      {/* Right */}
      <div className="ml-3 flex shrink-0 items-center gap-3 sm:gap-5">
        <span className="hidden text-sm text-slate-500 md:block">
          Hospital Management System
        </span>

        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutLoading}
          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
        >
          {logoutLoading
            ? "Logging out..."
            : "Logout"}
        </button>
      </div>
    </header>
  );
}