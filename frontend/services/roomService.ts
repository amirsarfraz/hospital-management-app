import type {
    Room,
    RoomFormData,
  } from "@/types/room";
  import API_BASE_URL from "@/lib/api";
  
  const API_URL = `${API_BASE_URL}/api/rooms`;
  
  export async function getRooms(): Promise<
    Room[]
  > {
    const response =
      await fetch(API_URL);
  
    const data =
      await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to fetch rooms"
      );
    }
  
    return data;
  }
  
  export async function getRoom(
    roomNumber: number
  ): Promise<Room> {
    const response = await fetch(
      `${API_URL}/${roomNumber}`
    );
  
    const data =
      await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to fetch room"
      );
    }
  
    return data;
  }
  
  export async function createRoom(
    form: RoomFormData
  ) {
    const response = await fetch(
      API_URL,
      {
        method: "POST",
  
        headers: {
          "Content-Type":
            "application/json",
        },
  
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
      }
    );
  
    const data =
      await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to create room"
      );
    }
  
    return data;
  }
  
  export async function updateRoom(
    roomNumber: number,
    form: RoomFormData
  ) {
    const response = await fetch(
      `${API_URL}/${roomNumber}`,
      {
        method: "PUT",
  
        headers: {
          "Content-Type":
            "application/json",
        },
  
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
  
    const data =
      await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to update room"
      );
    }
  
    return data;
  }
  
  export async function deleteRoom(
    roomNumber: number
  ) {
    const response = await fetch(
      `${API_URL}/${roomNumber}`,
      {
        method: "DELETE",
      }
    );
  
    const data =
      await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to delete room"
      );
    }
  
    return data;
  }