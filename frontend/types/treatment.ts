export type TreatmentPatient = {
  patient_id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
};

export type TreatmentDepartment = {
  department_id: number;
  name: string;
};

export type TreatmentDoctor = {
  doctor_id: number;
  first_name: string;
  last_name: string;
  specialization: string;
  department_id: number;
  departments?: TreatmentDepartment | null;
};

export type Treatment = {
  treatment_id: number;
  patient_id: number;
  doctor_id: number;
  treatment_date: string;
  diagnosis: string;
  medication: string | null;
  created_at?: string;
  patients?: TreatmentPatient | null;
  doctors?: TreatmentDoctor | null;
};

export type TreatmentFormData = {
  patient_id: string;
  doctor_id: string;
  treatment_date: string;
  diagnosis: string;
  medication: string;
};

export type TreatmentToast = {
  show: boolean;
  message: string;
  type: "success" | "error";
};

export type TreatmentsState = {
  treatments: Treatment[];
  patients: TreatmentPatient[];
  doctors: TreatmentDoctor[];
  loading: boolean;
  submitting: boolean;
  form: TreatmentFormData;
  editingTreatment: Treatment | null;
  deleteTreatmentId: number | null;
  formOpen: boolean;
  search: string;
  toast: TreatmentToast;
};