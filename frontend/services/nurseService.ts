import type { NurseFormData } from "@/types/nurse";

import { apiRequest } from "@/lib/api";

const API_URL = "/api/nurses";

export async function getNurses() {
  return apiRequest(API_URL);
}

export async function createNurse(
  form: NurseFormData
) {
  return apiRequest(API_URL, {
    method: "POST",
    body: JSON.stringify({
      ...form,
      department_id:
        Number(form.department_id),
    }),
  });
}

export async function updateNurse(
  id: number,
  form: NurseFormData
) {
  return apiRequest(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        ...form,
        department_id:
          Number(form.department_id),
      }),
    }
  );
}

export async function deleteNurse(
  id: number
) {
  return apiRequest(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );
}