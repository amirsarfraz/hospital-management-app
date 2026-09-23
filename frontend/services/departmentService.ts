import type { Department } from "@/types/department";

import { apiRequest } from "@/lib/api";

const API_URL = "/api/departments";

export async function getDepartments(): Promise<Department[]> {
  return apiRequest<Department[]>(API_URL);
}

export async function createDepartment(payload: {
  name: string;
  location: string;
  contact_phone: string;
}): Promise<Department> {
  return apiRequest<Department>(API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateDepartment(
  id: number,
  payload: {
    name: string;
    location: string;
    contact_phone: string;
  }
): Promise<Department> {
  return apiRequest<Department>(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

export async function deleteDepartment(
  id: number
): Promise<unknown> {
  return apiRequest(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );
}