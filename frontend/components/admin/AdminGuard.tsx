"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  authService,
} from "@/services/authService";

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({
  children,
}: AdminGuardProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (
          !authService.isAuthenticated()
        ) {
          router.replace(
            "/login"
          );

          return;
        }

        const user =
          await authService.getMe();

        if (
          user.role !== "admin"
        ) {
          router.replace(
            "/dashboard"
          );

          return;
        }

        setAuthorized(true);
      } catch (error) {
        localStorage.removeItem(
          "access_token"
        );

        router.replace(
          "/login"
        );
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">
          Checking permissions...
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}