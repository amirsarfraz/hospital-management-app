import type { NurseFormData } from "@/types/nurse";
import API_BASE_URL from "@/lib/api";
const API_URL = `${API_BASE_URL}/api/nurses`;

export async function getNurses() {
  const response = await fetch(API_URL);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch nurses"
    );
  }

  return data;
}

export async function createNurse(
  form: NurseFormData
) {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      ...form,

      department_id:
        Number(form.department_id),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create nurse"
    );
  }

  return data;
}

export async function updateNurse(
  id: number,
  form: NurseFormData
) {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        ...form,

        department_id:
          Number(form.department_id),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update nurse"
    );
  }

  return data;
}

export async function deleteNurse(
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
      data.message || "Failed to delete nurse"
    );
  }

  return data;
}