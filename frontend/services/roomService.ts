import type {
  Room,
  RoomFormData,
} from "@/types/room";

import { apiRequest } from "@/lib/api";

const API_URL = "/api/rooms";

export async function getRooms(): Promise<
  Room[]
> {
  return apiRequest<Room[]>(API_URL);
}

export async function getRoom(
  roomNumber: number
): Promise<Room> {
  return apiRequest<Room>(
    `${API_URL}/${roomNumber}`
  );
}

export async function createRoom(
  form: RoomFormData
) {
  return apiRequest(API_URL, {
    method: "POST",
    body: JSON.stringify({
      room_number:
        Number(form.room_number),
      room_type:
        form.room_type,
      daily_charge_rate:
        Number(
          form.daily_charge_rate
        ),
      status:
        form.status,
    }),
  });
}

export async function updateRoom(
  roomNumber: number,
  form: RoomFormData
) {
  return apiRequest(
    `${API_URL}/${roomNumber}`,
    {
      method: "PUT",
      body: JSON.stringify({
        room_type:
          form.room_type,
        daily_charge_rate:
          Number(
            form.daily_charge_rate
          ),
        status:
          form.status,
      }),
    }
  );
}

export async function deleteRoom(
  roomNumber: number
) {
  return apiRequest(
    `${API_URL}/${roomNumber}`,
    {
      method: "DELETE",
    }
  );
}