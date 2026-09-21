import { ReactNode } from "react";

import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="ml-64">
          <AdminHeader />

          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}