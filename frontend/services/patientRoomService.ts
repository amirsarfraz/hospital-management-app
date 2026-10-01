import type {
    PatientRoomAssignment,
    PatientRoomFormData,
  } from "@/types/patientRoom";
  
  import { apiRequest } from "@/lib/api";
  
  const API_URL = "/api/patient-rooms";
  
  export async function getPatientRooms(): Promise<
    PatientRoomAssignment[]
  > {
    return apiRequest<PatientRoomAssignment[]>(
      API_URL
    );
  }
  
  export async function assignPatientRoom(
    form: PatientRoomFormData
  ): Promise<PatientRoomAssignment> {
    return apiRequest<PatientRoomAssignment>(
      API_URL,
      {
        method: "POST",
        body: JSON.stringify({
          patient_id: Number(form.patient_id),
          room_number: Number(form.room_number),
        }),
      }
    );
  }
  
  export async function deletePatientRoom(
    id: number
  ): Promise<void> {
    return apiRequest<void>(
      `${API_URL}/${id}`,
      {
        method: "DELETE",
      }
    );
  }