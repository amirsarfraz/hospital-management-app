"use client";

import { useEffect, useState } from "react";

import { getDashboardData } from "@/services/dashboardService";
import type { DashboardData } from "@/types/dashboard";

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getDashboardData();

        setDashboard(data);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="font-medium text-red-700">
          Failed to load dashboard data.
        </p>

        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Overview of City Care Hospital.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Patients
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {dashboard.totalPatients}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Doctors
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {dashboard.totalDoctors}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Available Rooms
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {dashboard.availableRooms}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {dashboard.occupiedRooms} occupied
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Unpaid Bills
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            $
            {dashboard.unpaidBillsTotal.toLocaleString()}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {dashboard.unpaidBillsCount} pending
          </p>
        </div>
      </div>
    </div>
  );
}