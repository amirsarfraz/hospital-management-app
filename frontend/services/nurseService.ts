import type {
  Nurse,
  NurseFormData,
} from "@/types/nurse";

import { apiRequest } from "@/lib/api";

const API_URL = "/api/nurses";

export async function getNurses(): Promise<Nurse[]> {
  return apiRequest<Nurse[]>(API_URL);
}

export async function createNurse(
  form: NurseFormData
): Promise<Nurse> {
  return apiRequest<Nurse>(API_URL, {
    method: "POST",
    body: JSON.stringify({
      ...form,
      department_id: Number(form.department_id),
    }),
  });
}

export async function updateNurse(
  id: number,
  form: NurseFormData
): Promise<Nurse> {
  return apiRequest<Nurse>(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        ...form,
        department_id: Number(form.department_id),
      }),
    }
  );
}

export async function deleteNurse(
  id: number
): Promise<unknown> {
  return apiRequest(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );
}