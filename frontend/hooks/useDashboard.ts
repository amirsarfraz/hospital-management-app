"use client";

import { useEffect, useState } from "react";
import { getDashboardData } from "@/services/dashboardService";
import type { DashboardData } from "@/types/dashboard";

export function useDashboard() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getDashboardData();

        setDashboard(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return {
    dashboard,
    loading,
    error,
  };
}