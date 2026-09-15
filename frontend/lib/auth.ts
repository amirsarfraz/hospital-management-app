import { supabase } from "./supabase";

export async function registerUser(
  fullName: string,
  email: string,
  password: string
) {
  const parts = fullName.trim().split(" ");

  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}