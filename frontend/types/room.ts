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

export type RoomToast = {
  show: boolean;
  message: string;
  type: "success" | "error";
};

export type RoomsState = {
  rooms: Room[];
  loading: boolean;
  submitting: boolean;
  form: RoomFormData;
  editingRoom: Room | null;
  deleteRoomNumber: number | null;
  formOpen: boolean;
  search: string;
  statusFilter: "all" | RoomStatus;
  toast: RoomToast;
};