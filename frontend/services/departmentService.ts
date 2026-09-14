import API_BASE_URL from "@/lib/api";

const API_URL = `${API_BASE_URL}/api/departments`;

export async function getDepartments() {
  const response = await fetch(API_URL);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch departments"
    );
  }

  return data;
}

export async function createDepartment(payload: {
  name: string;
  location: string;
  contact_phone: string;
}) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create department"
    );
  }

  return data;
}

export async function updateDepartment(
  id: number,
  payload: {
    name: string;
    location: string;
    contact_phone: string;
  }
) {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update department"
    );
  }

  return data;
}

export async function deleteDepartment(id: number) {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete department"
    );
  }

  return data;
}