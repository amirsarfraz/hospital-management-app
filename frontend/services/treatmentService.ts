import type {
    Treatment,
    TreatmentFormData,
  } from "@/types/treatment";
  
  const API_URL =
    "http://localhost:5000/api/treatments";
  
  export async function getTreatments(): Promise<
    Treatment[]
  > {
    const response = await fetch(API_URL);
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to fetch treatments"
      );
    }
  
    return data;
  }
  
  export async function getTreatment(
    id: number
  ): Promise<Treatment> {
    const response = await fetch(
      `${API_URL}/${id}`
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to fetch treatment"
      );
    }
  
    return data;
  }
  
  export async function createTreatment(
    form: TreatmentFormData
  ) {
    const response = await fetch(API_URL, {
      method: "POST",
  
      headers: {
        "Content-Type": "application/json",
      },
  
      body: JSON.stringify({
        ...form,
  
        patient_id:
          Number(form.patient_id),
  
        doctor_id:
          Number(form.doctor_id),
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to create treatment"
      );
    }
  
    return data;
  }
  
  export async function updateTreatment(
    id: number,
    form: TreatmentFormData
  ) {
    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "PUT",
  
        headers: {
          "Content-Type": "application/json",
        },
  
        body: JSON.stringify({
          ...form,
  
          patient_id:
            Number(form.patient_id),
  
          doctor_id:
            Number(form.doctor_id),
        }),
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to update treatment"
      );
    }
  
    return data;
  }
  
  export async function deleteTreatment(
    id: number
  ) {
    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE",
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to delete treatment"
      );
    }
  
    return data;
  }