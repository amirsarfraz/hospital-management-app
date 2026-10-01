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
  
  export interface NurseRoomAssignment {
    nurse_room_id: number;
    nurse_id: number;
    room_number: number;
    assigned_at?: string;
  
    nurses?: NurseRoomNurse | null;
    rooms?: NurseRoomRoom | null;
  }
  
  export interface NurseRoomFormData {
    nurse_id: string;
    room_number: string;
  }
  
  export interface NurseRoomTableProps {
    assignments: NurseRoomAssignment[];
    canManage: boolean;
    onDelete: (assignment: NurseRoomAssignment) => void;
  }