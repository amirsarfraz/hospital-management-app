import type {
    NurseRoomAssignment,
    NurseRoomFormData,
  } from "@/types/nurseRoom";
  
  import { apiRequest } from "@/lib/api";
  
  const API_URL = "/api/nurse-rooms";
  
  export async function getNurseRooms(): Promise<
    NurseRoomAssignment[]
  > {
    return apiRequest<NurseRoomAssignment[]>(
      API_URL
    );
  }
  
  export async function assignNurseRoom(
    form: NurseRoomFormData
  ): Promise<NurseRoomAssignment> {
    return apiRequest<NurseRoomAssignment>(
      API_URL,
      {
        method: "POST",
        body: JSON.stringify({
          nurse_id: Number(form.nurse_id),
          room_number: Number(form.room_number),
        }),
      }
    );
  }
  
  export async function deleteNurseRoom(
    id: number
  ): Promise<void> {
    return apiRequest<void>(
      `${API_URL}/${id}`,
      {
        method: "DELETE",
      }
    );
  }