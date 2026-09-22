import type {
  Bill,
  BillFormData,
} from "@/types/bill";

import { apiRequest } from "@/lib/api";


export async function getBills(): Promise<Bill[]> {
  return apiRequest<Bill[]>("/api/bills");
}


export async function getBill(
  id: number
): Promise<Bill> {
  return apiRequest<Bill>(
    `/api/bills/${id}`
  );
}


export async function createBill(
  form: BillFormData
): Promise<Bill> {
  return apiRequest<Bill>(
    "/api/bills",
    {
      method: "POST",
      body: JSON.stringify({
        patient_id: Number(form.patient_id),
        total_amount: Number(form.total_amount),
        payment_status: form.payment_status,
        date_issued: form.date_issued,
      }),
    }
  );
}


export async function updateBill(
  id: number,
  form: BillFormData
): Promise<Bill> {
  return apiRequest<Bill>(
    `/api/bills/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        patient_id: Number(form.patient_id),
        total_amount: Number(form.total_amount),
        payment_status: form.payment_status,
        date_issued: form.date_issued,
      }),
    }
  );
}


export async function deleteBill(
  id: number
) {
  return apiRequest(
    `/api/bills/${id}`,
    {
      method: "DELETE",
    }
  );
}