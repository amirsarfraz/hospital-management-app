"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    title: "Dashboard",
    href: "/admin",
  },
  {
    title: "Users",
    href: "/admin/users",
  },
  {
    title: "Patients",
    href: "/patients",
  },
  {
    title: "Doctors",
    href: "/doctors",
  },
  {
    title: "Nurses",
    href: "/nurses",
  },
  {
    title: "Departments",
    href: "/departments",
  },
  {
    title: "Treatments",
    href: "/treatments",
  },
  {
    title: "Rooms",
    href: "/rooms",
  },
  {
    title: "Billing",
    href: "/bills",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white">
      <div className="border-b px-6 py-5">
        <h1 className="text-xl font-bold text-blue-600">
          City Care
        </h1>

        <p className="text-sm text-gray-500">
          Admin Panel
        </p>
      </div>

      <nav className="p-4">
        <div className="space-y-1">
          {links.map((link) => {
            const active =
              pathname === link.href;

            return (
              <Link
                href={link.href}
                key={link.href}
                className={`block rounded-lg px-4 py-3 text-sm ${
                  active
                    ? "bg-blue-50 font-medium text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.title}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}