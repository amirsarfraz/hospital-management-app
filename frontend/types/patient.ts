export type Patient = {
    patient_id: number;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    address: string | null;
    phone_number: string;
    created_at?: string;
  };
  
  export type PatientFormData = {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    address: string;
    phone_number: string;
  };