import type {
  Patient,
  PatientFormData,
} from "@/types/patient";

import { apiRequest } from "@/lib/api";

const API_URL = "/api/patients";

export async function getPatients(): Promise<
  Patient[]
> {
  return apiRequest<Patient[]>(API_URL);
}

export async function getPatient(
  id: number
): Promise<Patient> {
  return apiRequest<Patient>(
    `${API_URL}/${id}`
  );
}

export async function createPatient(
  form: PatientFormData
) {
  return apiRequest(API_URL, {
    method: "POST",
    body: JSON.stringify(form),
  });
}

export async function updatePatient(
  id: number,
  form: PatientFormData
) {
  return apiRequest(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(form),
    }
  );
}

export async function deletePatient(
  id: number
) {
  return apiRequest(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );
}