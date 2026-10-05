export interface NurseRoomNurse {
  nurse_id: number;
  first_name: string;
  last_name: string;
}

export interface NurseRoomRoom {
  room_number: number;
  room_type?: string;
  status?: string;
}


export interface NurseRoomTableProps {
  assignments: NurseRoomAssignment[];
  canManage: boolean;
  onDelete: (assignment: NurseRoomAssignment) => void;
}
import type { Nurse } from "@/types/nurse";
import type { Room } from "@/types/room";
import type { UserRole } from "@/types/user";

export type NurseRoomAssignment = {
  nurse_room_id: number;
  nurse_id: number;
  room_number: number;
  created_at?: string;
  nurses?: Nurse | null;
  rooms?: Room | null;
};

export type NurseRoomFormData = {
  nurse_id: string;
  room_number: string;
};

export type NurseRoomToast = {
  show: boolean;
  message: string;
  type: "success" | "error";
};

export type NurseRoomsState = {
  role: UserRole | null;
  assignments: NurseRoomAssignment[];
  nurses: Nurse[];
  rooms: Room[];
  form: NurseRoomFormData;
  loading: boolean;
  submitting: boolean;
  modalOpen: boolean;
  deleteAssignment:
  | NurseRoomAssignment
  | null;
  toast: NurseRoomToast;
};