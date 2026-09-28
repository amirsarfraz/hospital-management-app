import type { Patient } from "@/types/patient";

export type BillPatient = {
    patient_id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
  
  export type PaymentStatus =
    | "paid"
    | "unpaid";
  
  export type Bill = {
    bill_number: number;
  
    patient_id: number;
  
    total_amount: number;
  
    payment_status: PaymentStatus;
  
    date_issued: string;
  
    created_at?: string;
  
    patients?: BillPatient | null;
  };
  
  export type BillFormData = {
    patient_id: string;
    total_amount: string;
    payment_status: string;
    date_issued: string;
  };
  

export type BillToast = {
  show: boolean;
  message: string;
  type: "success" | "error";
};

export type BillingState = {
  bills: Bill[];
  patients: Patient[];
  loading: boolean;
  submitting: boolean;
  form: BillFormData;
  editingBill: Bill | null;
  deleteBillId: number | null;
  formOpen: boolean;
  search: string;
  statusFilter: string;
  toast: BillToast;
};

