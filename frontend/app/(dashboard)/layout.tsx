"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  supabase,
} from "@/lib/supabase";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [
    checkingAuth,
    setCheckingAuth,
  ] = useState(true);

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {
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

        return;
      }

      setCheckingAuth(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (!session) {
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
          }
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Prevent background scrolling
  // while mobile sidebar is open.
  useEffect(() => {
    if (!sidebarOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [sidebarOpen]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="min-w-0 lg:pl-64">
        <Header
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}