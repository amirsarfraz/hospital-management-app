export type Department = {
    department_id: number;
    name: string;
  };
  
  export type Doctor = {
    doctor_id: number;
    first_name: string;
    last_name: string;
    specialization: string;
    years_experience: number;
    contact_number: string | null;
    department_id: number;
    departments?: Department | null;
  };
  
  export type DoctorFormData = {
    first_name: string;
    last_name: string;
    specialization: string;
    years_experience: string;
    contact_number: string;
    department_id: string;
  };