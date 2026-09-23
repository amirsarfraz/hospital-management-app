"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  adminService,
} from "@/services/adminService";

import type {
  User,
  UserRole,
} from "@/types/user";

const roles: UserRole[] = [
  "admin",
  "manager",
  "user",
  "guest",
];

export default function AdminUsersPage() {
  const [
    users,
    setUsers,
  ] = useState<User[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    roleFilter,
    setRoleFilter,
  ] = useState<
    UserRole | ""
  >("");

  const [
    updatingId,
    setUpdatingId,
  ] = useState<
    string | null
  >(null);

  const fetchUsers =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await adminService.getUsers(
              {
                search,
                role:
                  roleFilter,
              }
            );

          setUsers(data);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load users"
          );
        } finally {
          setLoading(false);
        }
      },
      [
        search,
        roleFilter,
      ]
    );

  useEffect(() => {
    const timeout =
      setTimeout(
        () => {
          fetchUsers();
        },
        300
      );

    return () =>
      clearTimeout(
        timeout
      );
  }, [fetchUsers]);

  const handleRoleChange =
    async (
      userId: string,
      role: UserRole
    ) => {
      try {
        setUpdatingId(
          userId
        );

        setError("");

        const updatedUser =
          await adminService.updateUserRole(
            userId,
            role
          );

        setUsers(
          (
            currentUsers
          ) =>
            currentUsers.map(
              (user) =>
                user.id ===
                userId
                  ? updatedUser
                  : user
            )
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update user role"
        );
      } finally {
        setUpdatingId(null);
      }
    };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          User Management
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View users and manage application roles.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-5 grid gap-4 md:grid-cols-2">
        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search by name or email..."
          className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(
              e.target
                .value as
                | UserRole
                | ""
            )
          }
          className="rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="">
            All roles
          </option>

          {roles.map(
            (role) => (
              <option
                key={role}
                value={role}
              >
                {role}
              </option>
            )
          )}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                  Name
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                  Email
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                  Role
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-slate-600">
                  Created
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                users.map(
                  (user) => (
                    <tr
                      key={
                        user.id
                      }
                      className="border-t border-slate-200"
                    >
                      <td className="px-5 py-4">
                        {user.name ||
                          "—"}
                      </td>

                      <td className="px-5 py-4">
                        {user.email ||
                          "—"}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={
                            user.role
                          }
                          disabled={
                            updatingId ===
                            user.id
                          }
                          onChange={(
                            e
                          ) =>
                            handleRoleChange(
                              user.id,
                              e
                                .target
                                .value as UserRole
                            )
                          }
                          className="rounded-md border border-slate-300 bg-white px-3 py-2 capitalize outline-none focus:border-blue-500 disabled:opacity-60"
                        >
                          {roles.map(
                            (
                              role
                            ) => (
                              <option
                                key={
                                  role
                                }
                                value={
                                  role
                                }
                              >
                                {
                                  role
                                }
                              </option>
                            )
                          )}
                        </select>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {user.created_at
                          ? new Date(
                              user.created_at
                            ).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="p-8 text-center text-slate-500">
            Loading users...
          </div>
        )}

        {!loading &&
          users.length ===
            0 &&
          !error && (
            <div className="p-8 text-center text-slate-500">
              No users found.
            </div>
          )}
      </div>
    </div>
  );
}