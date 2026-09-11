import type {
    Bill,
    BillFormData,
  } from "@/types/bill";
  
  const API_URL =
    "http://localhost:5000/api/bills";
  
  export async function getBills(): Promise<Bill[]> {
    const response = await fetch(API_URL);
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch bills"
      );
    }
  
    return data;
  }
  
  export async function getBill(
    id: number
  ): Promise<Bill> {
    const response = await fetch(
      `${API_URL}/${id}`
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch bill"
      );
    }
  
    return data;
  }
  
  export async function createBill(
    form: BillFormData
  ) {
    const response = await fetch(API_URL, {
      method: "POST",
  
      headers: {
        "Content-Type": "application/json",
      },
  
      body: JSON.stringify({
        patient_id:
          Number(form.patient_id),
  
        total_amount:
          Number(form.total_amount),
  
        payment_status:
          form.payment_status,
  
        date_issued:
          form.date_issued,
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to create bill"
      );
    }
  
    return data;
  }
  
  export async function updateBill(
    id: number,
    form: BillFormData
  ) {
    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "PUT",
  
        headers: {
          "Content-Type": "application/json",
        },
  
        body: JSON.stringify({
          patient_id:
            Number(form.patient_id),
  
          total_amount:
            Number(form.total_amount),
  
          payment_status:
            form.payment_status,
  
          date_issued:
            form.date_issued,
        }),
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update bill"
      );
    }
  
    return data;
  }
  
  export async function deleteBill(
    id: number
  ) {
    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE",
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to delete bill"
      );
    }
  
    return data;
  }