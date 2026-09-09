import type {
    Patient,
    PatientFormData,
  } from "@/types/patient";
  
  const API_URL =
    "http://localhost:5000/api/patients";
  
  export async function getPatients(): Promise<
    Patient[]
  > {
    const response = await fetch(API_URL);
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch patients"
      );
    }
  
    return data;
  }
  
  export async function getPatient(
    id: number
  ): Promise<Patient> {
    const response = await fetch(
      `${API_URL}/${id}`
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch patient"
      );
    }
  
    return data;
  }
  
  export async function createPatient(
    form: PatientFormData
  ) {
    const response = await fetch(API_URL, {
      method: "POST",
  
      headers: {
        "Content-Type": "application/json",
      },
  
      body: JSON.stringify(form),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to create patient"
      );
    }
  
    return data;
  }
  
  export async function updatePatient(
    id: number,
    form: PatientFormData
  ) {
    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "PUT",
  
        headers: {
          "Content-Type": "application/json",
        },
  
        body: JSON.stringify(form),
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update patient"
      );
    }
  
    return data;
  }
  
  export async function deletePatient(
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
        data.message || "Failed to delete patient"
      );
    }
  
    return data;
  }