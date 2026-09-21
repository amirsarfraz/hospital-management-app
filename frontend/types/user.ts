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
  created_at?: string;
  updated_at?: string;
}

export interface AuthUserResponse {
  user: User;
}

export interface UsersResponse {
  users: User[];
}

export interface UpdateRoleResponse {
  message: string;
  user: User;
}