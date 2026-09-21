import API_URL from "@/lib/api";
import type { DashboardData } from "@/types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  const response = await fetch(
    `${API_URL}/api/dashboard`
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.message ||
        "Failed to load dashboard data"
    );
  }

  return response.json();
}