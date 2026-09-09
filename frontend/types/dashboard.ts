export type Department = {
    department_id: number;
    name: string;
    location?: string;
    contact_phone?: string;
  };
  
  export type Patient = {
    patient_id: number;
    first_name: string;
    last_name: string;
    phone_number?: string;
    gender?: string;
  };
  
  export type DashboardData = {
    totalPatients: number;
    totalDoctors: number;
  
    availableRooms: number;
    occupiedRooms: number;
  
    unpaidBillsTotal: number;
    unpaidBillsCount: number;
  
    departments: Department[];
    recentPatients: Patient[];
  };