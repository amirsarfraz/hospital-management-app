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