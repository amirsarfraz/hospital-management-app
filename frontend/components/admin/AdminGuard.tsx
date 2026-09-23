"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  apiRequest,
} from "@/lib/api";

import type {
  AuthUserResponse,
} from "@/types/user";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router =
    useRouter();

  const [
    checking,
    setChecking,
  ] = useState(true);

  useEffect(() => {
    const checkAdmin =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "access_token"
            );

          if (!token) {
            router.replace(
              "/login"
            );

            return;
          }

          const data =
            await apiRequest<AuthUserResponse>(
              "/api/auth/me"
            );

          localStorage.setItem(
            "role",
            data.user.role
          );

          if (
            data.user.role !==
            "admin"
          ) {
            router.replace(
              "/dashboard"
            );

            return;
          }

          setChecking(false);
        } catch (error) {
          console.error(
            "Admin access check failed:",
            error
          );

          localStorage.removeItem(
            "access_token"
          );

          localStorage.removeItem(
            "refresh_token"
          );

          localStorage.removeItem(
            "role"
          );

          router.replace(
            "/login"
          );
        }
      };

    checkAdmin();
  }, [router]);

  if (checking) {
    return (
      <div className="p-6 text-slate-500">
        Checking admin access...
      </div>
    );
  }

  return <>{children}</>;
}