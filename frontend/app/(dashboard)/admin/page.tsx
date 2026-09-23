"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getAdminDashboardStats,
} from "@/services/adminDashboardService";

import type {
  AdminDashboardStats,
} from "@/services/adminDashboardService";

export default function AdminPage() {
  const [
    stats,
    setStats,
  ] =
    useState<AdminDashboardStats>(
      {
        patients: 0,
        doctors: 0,
        nurses: 0,
        users: 0,
      }
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAdminDashboardStats();

        setStats(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load admin dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-slate-500">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          City Care Hospital administration overview.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Patients
          </p>

          <p className="mt-2 text-3xl font-bold">
            {stats.patients}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Doctors
          </p>

          <p className="mt-2 text-3xl font-bold">
            {stats.doctors}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Nurses
          </p>

          <p className="mt-2 text-3xl font-bold">
            {stats.nurses}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Users
          </p>

          <p className="mt-2 text-3xl font-bold">
            {stats.users}
          </p>
        </div>
      </div>
    </div>
  );
}