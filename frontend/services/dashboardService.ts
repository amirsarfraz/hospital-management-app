import type { DashboardData } from "@/types/dashboard";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

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