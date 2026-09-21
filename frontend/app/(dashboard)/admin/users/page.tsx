"use client";

import {
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
  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [role, setRole] =
    useState("");

  const [error, setError] =
    useState("");

  const [updatingUserId, setUpdatingUserId] =
    useState<string | null>(null);

  const [deletingUserId, setDeletingUserId] =
    useState<string | null>(null);

  // =====================================================
  // LOAD USERS
  // =====================================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await adminService.getUsers({
          search,
          role,
        });

      setUsers(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    loadUsers();
  };

  // =====================================================
  // UPDATE ROLE
  // =====================================================

  const handleRoleChange = async (
    userId: string,
    newRole: UserRole
  ) => {
    try {
      setUpdatingUserId(
        userId
      );

      setError("");

      const updatedUser =
        await adminService.updateUserRole(
          userId,
          newRole
        );

      setUsers(
        (currentUsers) =>
          currentUsers.map(
            (user) =>
              user.id === userId
                ? updatedUser
                : user
          )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update role"
      );

      // Reload because select may have
      // visually changed before API failed
      await loadUsers();
    } finally {
      setUpdatingUserId(
        null
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (
    user: User
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${user.name}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingUserId(
        user.id
      );

      setError("");

      await adminService.deleteUser(
        user.id
      );

      setUsers(
        (currentUsers) =>
          currentUsers.filter(
            (currentUser) =>
              currentUser.id !==
              user.id
          )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete user"
      );
    } finally {
      setDeletingUserId(
        null
      );
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          User Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage users and control their access roles.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}

      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 rounded-xl border bg-white p-4 md:flex-row"
      >
        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search name or email..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 md:max-w-sm"
        />

        <select
          value={role}
          onChange={(event) =>
            setRole(
              event.target.value
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="">
            All roles
          </option>

          <option value="admin">
            Admin
          </option>

          <option value="manager">
            Manager
          </option>

          <option value="user">
            User
          </option>

          <option value="guest">
            Guest
          </option>
        </select>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Search
        </button>

        {(search || role) && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setRole("");

              setTimeout(
                () =>
                  loadUsers(),
                0
              );
            }}
            className="rounded-lg border px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            Reset
          </button>
        )}
      </form>

      {/* Users table */}

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Users
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {users.length} user
            {users.length !== 1
              ? "s"
              : ""}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  User
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Role
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Created
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map(
                  (user) => (
                    <tr
                      key={
                        user.id
                      }
                      className="hover:bg-gray-50"
                    >

                      {/* Name */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                            {user.name
                              ?.charAt(
                                0
                              )
                              .toUpperCase() ||
                              "U"}
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {
                                user.name
                              }
                            </p>

                            <p className="text-xs text-gray-400">
                              {
                                user.id
                              }
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* Email */}

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {
                          user.email
                        }
                      </td>

                      {/* Role */}

                      <td className="px-5 py-4">

                        <select
                          value={
                            user.role
                          }
                          disabled={
                            updatingUserId ===
                            user.id
                          }
                          onChange={(
                            event
                          ) =>
                            handleRoleChange(
                              user.id,
                              event
                                .target
                                .value as UserRole
                            )
                          }
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm capitalize outline-none focus:border-blue-500 disabled:opacity-50"
                        >
                          {roles.map(
                            (
                              availableRole
                            ) => (
                              <option
                                key={
                                  availableRole
                                }
                                value={
                                  availableRole
                                }
                              >
                                {
                                  availableRole
                                }
                              </option>
                            )
                          )}
                        </select>

                        {updatingUserId ===
                          user.id && (
                          <p className="mt-1 text-xs text-gray-400">
                            Updating...
                          </p>
                        )}
                      </td>

                      {/* Created */}

                      <td className="px-5 py-4 text-sm text-gray-500">
                        {user.created_at
                          ? new Date(
                              user.created_at
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4 text-right">

                        <button
                          disabled={
                            deletingUserId ===
                            user.id
                          }
                          onClick={() =>
                            handleDelete(
                              user
                            )
                          }
                          className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          {deletingUserId ===
                          user.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </td>
                    </tr>
                  )
                )
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}