"use client";

import { useEffect, useState } from "react";

type Department = {
  department_id: number;
  name: string;
  doctors?: {
    count: number;
  }[];
};

type DashboardData = {
  totalPatients: number;
  totalDoctors: number;
  availableRooms: number;
  occupiedRooms: number;
  unpaidBillsTotal: number;
  unpaidBillsCount: number;
  departments: Department[];
};

export default function Home() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/dashboard"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard");
        }

        const data = await response.json();

        setDashboard(data);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-8">
        <p className="text-red-500">
          Failed to load dashboard data.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Good morning, Admin
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Here&apos;s what&apos;s happening at City Care Hospital today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Patients
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {dashboard.totalPatients}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Doctors
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {dashboard.totalDoctors}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Available Rooms
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {dashboard.availableRooms}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {dashboard.occupiedRooms} occupied
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Unpaid Bills
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            ${dashboard.unpaidBillsTotal.toLocaleString()}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {dashboard.unpaidBillsCount} pending
          </p>
        </div>
      </div>
    </div>
  );
}