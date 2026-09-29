"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import type {
  UserRole,
} from "@/types/user";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const [
    role,
    setRole,
  ] =
    useState<UserRole | null>(
      null
    );

  useEffect(() => {
    const storedRole =
      localStorage.getItem(
        "role"
      ) as UserRole | null;

    setRole(storedRole);
  }, [pathname]);

  // Close mobile sidebar whenever
  // navigation changes.
  useEffect(() => {
    onClose();
  }, [pathname]);

  const linkClass = (
    href: string
  ) => {
    const active =
      pathname === href;

    return [
      "block rounded-lg px-3 py-2 text-sm transition",
      active
        ? "bg-slate-100 font-medium text-slate-900"
        : "text-slate-700 hover:bg-slate-50",
    ].join(" ");
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          border-r border-slate-200
          bg-white
          transition-transform duration-300
          ease-in-out

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >
        <div className="flex items-start justify-between p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              City Care
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Hospital Management
            </p>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-6">
          <div className="flex flex-col gap-1">
            <Link
              href="/dashboard"
              onClick={handleLinkClick}
              className={linkClass(
                "/dashboard"
              )}
            >
              Dashboard
            </Link>

            <p className="mb-1 mt-5 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Management
            </p>

            <Link
              href="/patients"
              onClick={handleLinkClick}
              className={linkClass(
                "/patients"
              )}
            >
              Patients
            </Link>

            <Link
              href="/doctors"
              onClick={handleLinkClick}
              className={linkClass(
                "/doctors"
              )}
            >
              Doctors
            </Link>

            <Link
              href="/departments"
              onClick={handleLinkClick}
              className={linkClass(
                "/departments"
              )}
            >
              Departments
            </Link>

            <Link
              href="/nurses"
              onClick={handleLinkClick}
              className={linkClass(
                "/nurses"
              )}
            >
              Nurses
            </Link>

            <p className="mb-1 mt-5 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Operations
            </p>

            <Link
              href="/treatments"
              onClick={handleLinkClick}
              className={linkClass(
                "/treatments"
              )}
            >
              Treatments
            </Link>

            <Link
              href="/rooms"
              onClick={handleLinkClick}
              className={linkClass(
                "/rooms"
              )}
            >
              Rooms
            </Link>

            <Link
              href="/billing"
              onClick={handleLinkClick}
              className={linkClass(
                "/billing"
              )}
            >
              Billing
            </Link>

            {role === "admin" && (
              <>
                <p className="mb-1 mt-6 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Admin
                </p>

                <Link
                  href="/admin"
                  onClick={
                    handleLinkClick
                  }
                  className={linkClass(
                    "/admin"
                  )}
                >
                  Admin Dashboard
                </Link>

                <Link
                  href="/admin/users"
                  onClick={
                    handleLinkClick
                  }
                  className={linkClass(
                    "/admin/users"
                  )}
                >
                  User Management
                </Link>
              </>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}