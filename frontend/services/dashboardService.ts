import { apiRequest } from "@/lib/api";

import type { DashboardData } from "@/types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  return apiRequest<DashboardData>("/api/dashboard");
}