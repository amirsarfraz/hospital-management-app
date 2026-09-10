import type { DoctorFormData } from "@/types/doctor";

const API_URL = "http://localhost:5000/api/doctors";

export async function getDoctors() {
  const response = await fetch(API_URL);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch doctors");
  }

  return data;
}

export async function createDoctor(form: DoctorFormData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...form,
      years_experience: Number(form.years_experience),
      department_id: Number(form.department_id),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create doctor");
  }

  return data;
}

export async function updateDoctor(
  id: number,
  form: DoctorFormData
) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...form,
      years_experience: Number(form.years_experience),
      department_id: Number(form.department_id),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update doctor");
  }

  return data;
}

export async function deleteDoctor(id: number) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete doctor");
  }

  return data;
}