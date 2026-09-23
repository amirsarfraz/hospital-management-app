import type {
  Treatment,
  TreatmentFormData,
} from "@/types/treatment";

import { apiRequest } from "@/lib/api";

const API_URL = "/api/treatments";

export async function getTreatments(): Promise<Treatment[]> {
  return apiRequest<Treatment[]>(API_URL);
}

export async function getTreatment(
  id: number
): Promise<Treatment> {
  return apiRequest<Treatment>(
    `${API_URL}/${id}`
  );
}

export async function createTreatment(
  form: TreatmentFormData
): Promise<Treatment> {
  return apiRequest<Treatment>(
    API_URL,
    {
      method: "POST",
      body: JSON.stringify({
        ...form,
        patient_id: Number(form.patient_id),
        doctor_id: Number(form.doctor_id),
      }),
    }
  );
}

export async function updateTreatment(
  id: number,
  form: TreatmentFormData
): Promise<Treatment> {
  return apiRequest<Treatment>(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        ...form,
        patient_id: Number(form.patient_id),
        doctor_id: Number(form.doctor_id),
      }),
    }
  );
}

export async function deleteTreatment(
  id: number
): Promise<unknown> {
  return apiRequest(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );
}