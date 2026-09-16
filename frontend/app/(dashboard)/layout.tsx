"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/login");
        return;
      }

      setAuthLoading(false);
    };

    checkAuth();
  }, [router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">
          Checking authentication...
        </p>
      </div>
    );
  }

  return (
    <>
      <Sidebar />

      <div className="min-h-screen lg:ml-64">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </>
  );
}