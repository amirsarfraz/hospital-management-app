export type RoomStatus =
  | "available"
  | "occupied"
  | "maintenance";

export type RoomType =
  | "General"
  | "Private"
  | "ICU";

export type Room = {
  room_number: number;
  room_type: RoomType;
  daily_charge_rate: number;
  status: RoomStatus;
  created_at?: string;
};

export type RoomFormData = {
  room_number: string;
  room_type: string;
  daily_charge_rate: string;
  status: string;
};