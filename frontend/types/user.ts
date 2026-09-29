import type {
  User as SupabaseUser,
} from "@supabase/supabase-js";

export type UserRole =
  | "admin"
  | "manager"
  | "user"
  | "guest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;

  first_name?: string;
  last_name?: string;

  created_at?: string;
  updated_at?: string;
}

export interface AuthUserResponse {
  user: User;
}

export interface UsersResponse {
  users: User[];
}

export interface UserResponse {
  user: User;
}

export interface CreateUserResponse {
  message: string;
  user: User;
}

export interface UpdateUserResponse {
  message: string;
  user: User;
}

export interface UpdateRoleResponse {
  message: string;
  user: User;
}

export interface DeleteUserResponse {
  message: string;
}

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  password?: string;
}

export interface AdminUserForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole;
}

export type Profile = {
  id: string;
  role?: string;
  full_name?: string;
};

export type CurrentUserState = {
  user: SupabaseUser | null;
  profile: Profile | null;
  loading: boolean;
};

export type RegisterState = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  error: string;
  success: string;
  loading: boolean;
};

export type AdminUsersState = {
  users: User[];

  loading: boolean;
  submitting: boolean;
  deleteLoading: boolean;

  error: string;

  search: string;
  roleFilter: UserRole | "";

  updatingId: string | null;

  modalOpen: boolean;
  editingUser: User | null;
  deleteUser: User | null;

  form: AdminUserForm;
};