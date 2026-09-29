export interface Department {
  department_id: number;
  name: string;
  location: string;
  contact_phone: string;
  created_at?: string;
  updated_at?: string;
}

export type DepartmentFormData = {
  name: string;
  location: string;
  contact_phone: string;
};

export type DepartmentToast = {
  message: string;
  type: "success" | "error";
};

export type DepartmentsState = {
  departments: Department[];
  editingId: number | null;
  loading: boolean;
  deleteLoading: boolean;
  selectedDepartment: Department | null;
  toast: DepartmentToast;
  form: DepartmentFormData;
};