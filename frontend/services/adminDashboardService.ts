import {
  getDashboardData,
} from "@/services/dashboardService";

import {
  getNurses,
} from "@/services/nurseService";

import {
  adminService,
} from "@/services/adminService";

export type AdminDashboardStats = {
  patients: number;
  doctors: number;
  nurses: number;
  users: number;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [
    dashboard,
    nurses,
    users,
  ] = await Promise.all([
    getDashboardData(),
    getNurses(),
    adminService.getUsers(),
  ]);

  return {
    patients:
      dashboard.totalPatients,

    doctors:
      dashboard.totalDoctors,

    nurses:
      Array.isArray(
        nurses
      )
        ? nurses.length
        : 0,

    users:
      users.length,
  };
}