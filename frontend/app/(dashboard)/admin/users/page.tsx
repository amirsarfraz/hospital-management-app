"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  SyntheticEvent,
} from "react";

import {
  adminService,
} from "@/services/adminService";

import type {
  AdminUsersState,
  CreateUserPayload,
  UpdateUserPayload,
  User,
  UserRole,
} from "@/types/user";

const roles: UserRole[] = [
  "admin",
  "manager",
  "user",
  "guest",
];

const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  role: "user" as UserRole,
};

export default function AdminUsersPage() {
  const [state, setState] =
    useState<AdminUsersState>({
      users: [],

      loading: true,
      submitting: false,
      deleteLoading: false,

      error: "",

      search: "",
      roleFilter: "",

      updatingId: null,

      modalOpen: false,
      editingUser: null,
      deleteUser: null,

      form: initialForm,
    });

  const {
    users,
    loading,
    submitting,
    deleteLoading,
    error,
    search,
    roleFilter,
    updatingId,
    modalOpen,
    editingUser,
    deleteUser,
    form,
  } = state;

  const updateState = <
    K extends keyof AdminUsersState
  >(
    field: K,
    value: AdminUsersState[K]
  ) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = useCallback(
    async () => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: "",
        }));

        const data =
          await adminService.getUsers({
            search,
            role: roleFilter,
          });

        setState((prev) => ({
          ...prev,
          users: data,
          loading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,

          loading: false,

          error:
            err instanceof Error
              ? err.message
              : "Failed to load users",
        }));
      }
    },
    [search, roleFilter]
  );

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        fetchUsers();
      },
      300
    );

    return () =>
      clearTimeout(timeout);
  }, [fetchUsers]);

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {
    setState((prev) => ({
      ...prev,

      modalOpen: true,

      editingUser: null,

      form: {
        ...initialForm,
      },

      error: "",
    }));
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (
    user: User
  ) => {
    setState((prev) => ({
      ...prev,

      modalOpen: true,

      editingUser: user,

      error: "",

      form: {
        first_name:
          user.first_name || "",

        last_name:
          user.last_name || "",

        email:
          user.email || "",

        password: "",

        role:
          user.role,
      },
    }));
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (submitting) {
      return;
    }

    setState((prev) => ({
      ...prev,

      modalOpen: false,

      editingUser: null,

      form: {
        ...initialForm,
      },
    }));
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const {
      name,
      value,
    } = e.target;

    setState((prev) => ({
      ...prev,

      form: {
        ...prev.form,

        [name]: value,
      },
    }));
  };

  // ==========================================
  // CREATE / UPDATE USER
  // ==========================================

  const handleSubmit = async (
    e: SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!form.first_name.trim()) {
      updateState(
        "error",
        "First name is required"
      );

      return;
    }

    if (!form.email.trim()) {
      updateState(
        "error",
        "Email is required"
      );

      return;
    }

    if (
      !editingUser &&
      form.password.length < 8
    ) {
      updateState(
        "error",
        "Password must be at least 8 characters"
      );

      return;
    }

    if (
      editingUser &&
      form.password &&
      form.password.length < 8
    ) {
      updateState(
        "error",
        "Password must be at least 8 characters"
      );

      return;
    }

    try {
      updateState(
        "submitting",
        true
      );

      updateState(
        "error",
        ""
      );

      if (editingUser) {
        const payload:
          UpdateUserPayload = {
          first_name:
            form.first_name.trim(),

          last_name:
            form.last_name.trim(),

          email:
            form.email.trim(),

          role:
            form.role,
        };

        if (
          form.password.trim()
        ) {
          payload.password =
            form.password;
        }

        await adminService.updateUser(
          editingUser.id,
          payload
        );
      } else {
        const payload:
          CreateUserPayload = {
          first_name:
            form.first_name.trim(),

          last_name:
            form.last_name.trim(),

          email:
            form.email.trim(),

          password:
            form.password,

          role:
            form.role,
        };

        await adminService.createUser(
          payload
        );
      }

      setState((prev) => ({
        ...prev,

        modalOpen: false,

        editingUser: null,

        form: {
          ...initialForm,
        },
      }));

      await fetchUsers();
    } catch (err) {
      updateState(
        "error",

        err instanceof Error
          ? err.message
          : editingUser
            ? "Failed to update user"
            : "Failed to create user"
      );
    } finally {
      updateState(
        "submitting",
        false
      );
    }
  };

  // ==========================================
  // CHANGE ROLE
  // ==========================================

  const handleRoleChange =
    async (
      userId: string,
      role: UserRole
    ) => {
      try {
        updateState(
          "updatingId",
          userId
        );

        updateState(
          "error",
          ""
        );

        const updatedUser =
          await adminService.updateUserRole(
            userId,
            role
          );

        setState((prev) => ({
          ...prev,

          users:
            prev.users.map(
              (user) =>
                user.id ===
                  userId
                  ? updatedUser
                  : user
            ),
        }));
      } catch (err) {
        updateState(
          "error",

          err instanceof Error
            ? err.message
            : "Failed to update user role"
        );
      } finally {
        updateState(
          "updatingId",
          null
        );
      }
    };

  // ==========================================
  // OPEN DELETE MODAL
  // ==========================================

  const openDeleteModal = (
    user: User
  ) => {
    updateState(
      "deleteUser",
      user
    );
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDelete =
    async () => {
      if (!deleteUser) {
        return;
      }

      try {
        updateState(
          "deleteLoading",
          true
        );

        updateState(
          "error",
          ""
        );

        await adminService.deleteUser(
          deleteUser.id
        );

        setState((prev) => ({
          ...prev,

          deleteUser: null,

          users:
            prev.users.filter(
              (user) =>
                user.id !==
                deleteUser.id
            ),
        }));
      } catch (err) {
        updateState(
          "error",

          err instanceof Error
            ? err.message
            : "Failed to delete user"
        );
      } finally {
        updateState(
          "deleteLoading",
          false
        );
      }
    };

  return (
    <>
      <div>
        {/* Header */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              User Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Add, edit and manage
              application users.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            + Add User
          </button>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                updateState(
                  "error",
                  ""
                )
              }
              className="ml-4 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Search + Filter */}

        <div className="mb-5 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={search}
            onChange={(e) =>
              updateState(
                "search",
                e.target.value
              )
            }
            placeholder="Search by name or email..."
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            value={roleFilter}
            onChange={(e) =>
              updateState(
                "roleFilter",

                e.target.value as
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
                  {role
                    .charAt(0)
                    .toUpperCase() +
                    role.slice(1)}
                </option>
              )
            )}
          </select>
        </div>

        {/* Table */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
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

                  <th className="px-5 py-3 text-right text-sm font-semibold text-slate-600">
                    Actions
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
                        <td className="px-5 py-4 font-medium text-slate-900">
                          {user.name ||
                            "—"}
                        </td>

                        <td className="px-5 py-4 text-slate-700">
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
                            className="rounded-md border border-slate-300 bg-white px-3 py-2 capitalize outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
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

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  user
                                )
                              }
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openDeleteModal(
                                  user
                                )
                              }
                              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
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

      {/* ======================================
          ADD / EDIT MODAL
      ====================================== */}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingUser
                    ? "Edit User"
                    : "Add User"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingUser
                    ? "Update user account information."
                    : "Create a new hospital management user."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                className="text-2xl leading-none text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
            >
              <div className="space-y-4 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      First Name
                    </label>

                    <input
                      type="text"
                      name="first_name"
                      value={
                        form.first_name
                      }
                      onChange={
                        handleFormChange
                      }
                      placeholder="First name"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Last Name
                    </label>

                    <input
                      type="text"
                      name="last_name"
                      value={
                        form.last_name
                      }
                      onChange={
                        handleFormChange
                      }
                      placeholder="Last name"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="user@example.com"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={
                      form.password
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder={
                      editingUser
                        ? "Leave blank to keep current password"
                        : "Minimum 8 characters"
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />

                  {editingUser && (
                    <p className="mt-1 text-xs text-slate-500">
                      Leave blank if
                      you do not want
                      to change the
                      password.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Role
                  </label>

                  <select
                    name="role"
                    value={
                      form.role
                    }
                    onChange={
                      handleFormChange
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 capitalize outline-none focus:border-blue-500"
                  >
                    {roles.map(
                      (role) => (
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
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    submitting
                  }
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting
                  }
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Saving..."
                    : editingUser
                      ? "Save Changes"
                      : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================
          DELETE CONFIRMATION MODAL
      ====================================== */}

      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">
              Delete User
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Are you sure you
              want to delete{" "}
              <strong>
                {deleteUser.name ||
                  deleteUser.email}
              </strong>
              ? This action cannot
              be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={
                  deleteLoading
                }
                onClick={() =>
                  updateState(
                    "deleteUser",
                    null
                  )
                }
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  deleteLoading
                }
                onClick={
                  handleDelete
                }
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading
                  ? "Deleting..."
                  : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}