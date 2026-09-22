import type { DoctorFormData } from "@/types/doctor";

import { apiRequest } from "@/lib/api";

const API_URL = "/api/doctors";

export async function getDoctors() {
  return apiRequest(API_URL);
}

export async function createDoctor(form: DoctorFormData) {
  return apiRequest(API_URL, {
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
) {
  return apiRequest(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      ...form,
      years_experience: Number(form.years_experience),
      department_id: Number(form.department_id),
    }),
  });
}

export async function deleteDoctor(id: number) {
  return apiRequest(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}