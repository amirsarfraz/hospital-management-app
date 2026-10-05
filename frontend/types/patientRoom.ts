import type { Patient } from "@/types/patient";
import type { Room } from "@/types/room";
import type { UserRole } from "@/types/user";

export interface PatientRoomPatient {
    patient_id: number;
    first_name: string;
    last_name: string;
  }
  
  export interface PatientRoomRoom {
    room_number: number;
    room_type?: string;
    status?: string;
  }
  
  
  export interface PatientRoomTableProps {
    assignments: PatientRoomAssignment[];
    canManage: boolean;
    onDelete: (assignment: PatientRoomAssignment) => void;
  }


export type PatientRoomAssignment = {
  patient_room_id: number;
  patient_id: number;
  room_number: number;
  assigned_at?: string;
  patients?: Patient | null;
  rooms?: Room | null;
};

export type PatientRoomFormData = {
  patient_id: string;
  room_number: string;
};

export type PatientRoomToast = {
  show: boolean;
  message: string;
  type: "success" | "error";
};

export type PatientRoomsState = {
  role: UserRole | null;
  assignments: PatientRoomAssignment[];
  patients: Patient[];
  rooms: Room[];
  form: PatientRoomFormData;
  loading: boolean;
  submitting: boolean;
  modalOpen: boolean;
  deleteAssignment: PatientRoomAssignment | null;
  toast: PatientRoomToast;
};