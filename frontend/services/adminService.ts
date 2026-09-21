import { apiRequest } from "@/lib/api";

import type {
  UpdateRoleResponse,
  User,
  UserRole,
  UsersResponse,
} from "@/types/user";

interface GetUsersParams {
  search?: string;
  role?: string;
}

export const adminService = {
  // =====================================================
  // GET ALL USERS
  // =====================================================

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

  // =====================================================
  // GET USER
  // =====================================================

  async getUserById(
    id: string
  ): Promise<User> {
    const data = await apiRequest<{
      user: User;
    }>(
      `/api/admin/users/${id}`
    );

    return data.user;
  },

  // =====================================================
  // UPDATE USER ROLE
  // =====================================================

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

  // =====================================================
  // DELETE USER
  // =====================================================

  async deleteUser(
    id: string
  ): Promise<void> {
    await apiRequest(
      `/api/admin/users/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};