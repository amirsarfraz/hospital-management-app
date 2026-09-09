const API_URL = "http://localhost:5000/api/departments";

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