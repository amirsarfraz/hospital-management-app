"use client";

import {
  useRouter,
} from "next/navigation";

import {
  authService,
} from "@/services/authService";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout =
    async () => {
      await authService.logout();

      router.replace(
        "/login"
      );
    };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">

      <div>
        <h2 className="font-semibold text-gray-900">
          Hospital Administration
        </h2>
      </div>

      <button
        onClick={
          handleLogout
        }
        className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Logout
      </button>

    </header>
  );
}