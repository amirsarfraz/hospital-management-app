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

export default function Sidebar() {
  const pathname =
    usePathname();

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

  return (
    <aside className="min-h-screen w-64 shrink-0 border-r border-slate-200 bg-white">
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-900">
          City Care
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Hospital Management
        </p>
      </div>

      <nav className="flex flex-col gap-1 px-4">
        <Link
          href="/dashboard"
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
          className={linkClass(
            "/patients"
          )}
        >
          Patients
        </Link>

        <Link
          href="/doctors"
          className={linkClass(
            "/doctors"
          )}
        >
          Doctors
        </Link>

        <Link
          href="/departments"
          className={linkClass(
            "/departments"
          )}
        >
          Departments
        </Link>

        <Link
          href="/nurses"
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
          className={linkClass(
            "/treatments"
          )}
        >
          Treatments
        </Link>

        <Link
          href="/rooms"
          className={linkClass(
            "/rooms"
          )}
        >
          Rooms
        </Link>

        <Link
          href="/billing"
          className={linkClass(
            "/billing"
          )}
        >
          Billing
        </Link>

        {role ===
          "admin" && (
          <>
            <p className="mb-1 mt-6 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Admin
            </p>

            <Link
              href="/admin"
              className={linkClass(
                "/admin"
              )}
            >
              Admin Dashboard
            </Link>

            <Link
              href="/admin/users"
              className={linkClass(
                "/admin/users"
              )}
            >
              User Management
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}