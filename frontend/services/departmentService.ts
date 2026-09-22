import { apiRequest } from "@/lib/api";

const API_URL = "/api/departments";

export async function getDepartments() {
  return apiRequest(API_URL);
}

export async function createDepartment(payload: {
  name: string;
  location: string;
  contact_phone: string;
}) {
  return apiRequest(API_URL, {
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
) {
  return apiRequest(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteDepartment(id: number) {
  return apiRequest(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}