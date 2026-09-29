import {
  apiRequest,
} from "@/lib/api";

import type {
  CreateUserPayload,
  CreateUserResponse,
  DeleteUserResponse,
  UpdateRoleResponse,
  UpdateUserPayload,
  UpdateUserResponse,
  User,
  UserResponse,
  UserRole,
  UsersResponse,
} from "@/types/user";

interface GetUsersParams {
  search?: string;
  role?: UserRole | "";
}

export const adminService = {
  // ==========================================
  // GET ALL USERS
  // ==========================================
  async getUsers(
    params: GetUsersParams = {}
  ): Promise<User[]> {
    const searchParams =
      new URLSearchParams();

    if (params.search) {
      searchParams.set(
        "search",
        params.search
      );
    }

    if (params.role) {
      searchParams.set(
        "role",
        params.role
      );
    }

    const query =
      searchParams.toString();

    const endpoint = query
      ? `/api/admin/users?${query}`
      : "/api/admin/users";

    const data =
      await apiRequest<UsersResponse>(
        endpoint
      );

    return data.users;
  },

  // ==========================================
  // GET SINGLE USER
  // ==========================================
  async getUser(
    id: string
  ): Promise<User> {
    const data =
      await apiRequest<UserResponse>(
        `/api/admin/users/${id}`
      );

    return data.user;
  },

  // ==========================================
  // CREATE USER
  // ==========================================
  async createUser(
    payload: CreateUserPayload
  ): Promise<User> {
    const data =
      await apiRequest<CreateUserResponse>(
        "/api/admin/users",
        {
          method: "POST",

          body: JSON.stringify(
            payload
          ),
        }
      );

    return data.user;
  },

  // ==========================================
  // UPDATE USER
  // ==========================================
  async updateUser(
    id: string,
    payload: UpdateUserPayload
  ): Promise<User> {
    const data =
      await apiRequest<UpdateUserResponse>(
        `/api/admin/users/${id}`,
        {
          method: "PATCH",

          body: JSON.stringify(
            payload
          ),
        }
      );

    return data.user;
  },

  // ==========================================
  // UPDATE ROLE
  // ==========================================
  async updateUserRole(
    id: string,
    role: UserRole
  ): Promise<User> {
    const data =
      await apiRequest<UpdateRoleResponse>(
        `/api/admin/users/${id}/role`,
        {
          method: "PATCH",

          body: JSON.stringify({
            role,
          }),
        }
      );

    return data.user;
  },

  // ==========================================
  // DELETE USER
  // ==========================================
  async deleteUser(
    id: string
  ): Promise<DeleteUserResponse> {
    return apiRequest<DeleteUserResponse>(
      `/api/admin/users/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};