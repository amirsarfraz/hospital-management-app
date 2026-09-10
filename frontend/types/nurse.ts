export type Department = {
    department_id: number;
    name: string;
  };
  
  export type Nurse = {
    nurse_id: number;
    first_name: string;
    last_name: string;
    shift_timing: string;
    contact_number: string | null;
    department_id: number;
    created_at?: string;
  
    departments?: Department | null;
  };
  
  export type NurseFormData = {
    first_name: string;
    last_name: string;
    shift_timing: string;
    contact_number: string;
    department_id: string;
  };