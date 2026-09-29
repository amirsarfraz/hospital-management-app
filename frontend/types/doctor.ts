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

export type DoctorToast = {
  show: boolean;
  message: string;
  type: "success" | "error";
};

export type DoctorsState = {
  doctors: Doctor[];
  departments: Department[];
  loading: boolean;
  submitting: boolean;
  form: DoctorFormData;
  editingDoctor: Doctor | null;
  deleteDoctorId: number | null;
  isFormOpen: boolean;
  toast: DoctorToast;
};