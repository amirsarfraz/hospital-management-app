import type {
  Doctor,
  DoctorFormData,
} from "@/types/doctor";

import { apiRequest } from "@/lib/api";

const API_URL = "/api/doctors";

export async function getDoctors(): Promise<Doctor[]> {
  return apiRequest<Doctor[]>(API_URL);
}

export async function createDoctor(
  form: DoctorFormData
): Promise<Doctor> {
  return apiRequest<Doctor>(API_URL, {
    method: "POST",
    body: JSON.stringify({
      ...form,
      years_experience: Number(form.years_experience),
      department_id: Number(form.department_id),
    }),
  });
}

export async function updateDoctor(
  id: number,
  form: DoctorFormData
): Promise<Doctor> {
  return apiRequest<Doctor>(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        ...form,
        years_experience: Number(form.years_experience),
        department_id: Number(form.department_id),
      }),
    }
  );
}

export async function deleteDoctor(
  id: number
): Promise<unknown> {
  return apiRequest(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );
}