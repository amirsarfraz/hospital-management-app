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
  
  export interface PatientRoomAssignment {
    patient_room_id: number;
    patient_id: number;
    room_number: number;
    assigned_at?: string;
    discharged_at?: string | null;
  
    patients?: PatientRoomPatient | null;
    rooms?: PatientRoomRoom | null;
  }
  
  export interface PatientRoomFormData {
    patient_id: string;
    room_number: string;
  }
  
  export interface PatientRoomTableProps {
    assignments: PatientRoomAssignment[];
    canManage: boolean;
    onDelete: (assignment: PatientRoomAssignment) => void;
  }