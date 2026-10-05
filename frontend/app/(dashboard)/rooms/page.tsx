"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Toast from "@/components/ui/Toast";
import type { UserRole } from "@/types/user";
import { getRooms,createRoom,updateRoom,deleteRoom } from "@/services/roomService";
import type { Room,RoomFormData,RoomsState,RoomStatus } from "@/types/room";

const emptyForm: RoomFormData = {
  room_number: "",
  room_type: "",
  daily_charge_rate: "",
  status: "available",
};

export default function RoomsPage() {
  const [role, setRole] = useState<UserRole | null>(null);

  const canManage =
    role === "admin" ||
    role === "manager";

  useEffect(() => {
    const storedRole =
      localStorage.getItem("role") as UserRole | null;

    setRole(storedRole);
  }, []);
  const [state, setState] =
    useState<RoomsState>({
      rooms: [],
      loading: true,
      submitting: false,
      form: emptyForm,
      editingRoom: null,
      deleteRoomNumber: null,
      formOpen: false,
      search: "",
      statusFilter: "all",
      toast: {
        show: false,
        message: "",
        type: "success",
      },
    });

  const {
    rooms,
    loading,
    submitting,
    form,
    editingRoom,
    deleteRoomNumber,
    formOpen,
    search,
    statusFilter,
    toast,
  } = state;

  const updateState = <
    K extends keyof RoomsState
  >(
    field: K,
    value: RoomsState[K]
  ) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    updateState("toast", {
      show: true,
      message,
      type,
    });
  };

  const fetchRooms = async () => {
    try {
      updateState(
        "loading",
        true
      );

      const data =
        await getRooms();

      updateState(
        "rooms",
        data
      );
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to load rooms",
        "error"
      );
    } finally {
      updateState(
        "loading",
        false
      );
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
    >
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

  const openCreateModal = () => {
    setState((prev) => ({
      ...prev,
      editingRoom: null,
      form: emptyForm,
      formOpen: true,
    }));
  };

  const openEditModal = (
    room: Room
  ) => {
    setState((prev) => ({
      ...prev,

      editingRoom: room,

      form: {
        room_number:
          String(
            room.room_number
          ),

        room_type:
          room.room_type,

        daily_charge_rate:
          String(
            room.daily_charge_rate
          ),

        status:
          room.status,
      },

      formOpen: true,
    }));
  };

  const closeFormModal = () => {
    setState((prev) => ({
      ...prev,
      formOpen: false,
      editingRoom: null,
      form: emptyForm,
    }));
  };

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !form.room_number ||
      !form.room_type ||
      !form.daily_charge_rate ||
      !form.status
    ) {
      showToast(
        "Please fill all required fields.",
        "error"
      );

      return;
    }

    if (
      Number(
        form.daily_charge_rate
      ) < 0
    ) {
      showToast(
        "Daily charge cannot be negative.",
        "error"
      );

      return;
    }

    try {
      updateState(
        "submitting",
        true
      );

      if (editingRoom) {
        await updateRoom(
          editingRoom.room_number,
          form
        );

        showToast(
          "Room updated successfully."
        );
      } else {
        await createRoom(
          form
        );

        showToast(
          "Room added successfully."
        );
      }

      closeFormModal();

      await fetchRooms();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Something went wrong",
        "error"
      );
    } finally {
      updateState(
        "submitting",
        false
      );
    }
  };

  const handleDelete = async () => {
    if (
      deleteRoomNumber === null
    ) {
      return;
    }

    try {
      updateState(
        "submitting",
        true
      );

      await deleteRoom(
        deleteRoomNumber
      );

      updateState(
        "deleteRoomNumber",
        null
      );

      showToast(
        "Room deleted successfully."
      );

      await fetchRooms();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to delete room",
        "error"
      );
    } finally {
      updateState(
        "submitting",
        false
      );
    }
  };

  const filteredRooms =
    rooms.filter((room) => {
      const matchesSearch =
        String(
          room.room_number
        ).includes(search) ||
        room.room_type
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =
        statusFilter === "all" ||
        room.status ===
        statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const availableCount =
    rooms.filter(
      (room) =>
        room.status ===
        "available"
    ).length;

  const occupiedCount =
    rooms.filter(
      (room) =>
        room.status ===
        "occupied"
    ).length;

  const maintenanceCount =
    rooms.filter(
      (room) =>
        room.status ===
        "maintenance"
    ).length;

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Rooms
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage hospital rooms,
            types, charges and
            availability.
          </p>
        </div>

        {canManage && (
          <Button onClick={openCreateModal}>
            + Add Room
          </Button>
        )}
      </div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Rooms
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {rooms.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Available
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {availableCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Occupied
          </p>

          <p className="mt-2 text-2xl font-bold text-amber-600">
            {occupiedCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Maintenance
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {maintenanceCount}
          </p>
        </div>
      </div>

      {/* Filters */}

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <input
          value={search}
          onChange={(e) =>
            updateState(
              "search",
              e.target.value
            )
          }
          placeholder="Search by room number or type..."
          className="h-11 rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            updateState(
              "statusFilter",
              e.target.value as
              | "all"
              | RoomStatus
            )
          }
          className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="all">
            All Statuses
          </option>

          <option value="available">
            Available
          </option>

          <option value="occupied">
            Occupied
          </option>

          <option value="maintenance">
            Maintenance
          </option>
        </select>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Room List
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {rooms.length} rooms
            registered
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500">
            Loading rooms...
          </div>
        ) : filteredRooms.length ===
          0 ? (
          <div className="py-16 text-center">
            <p className="font-medium text-slate-900">
              No rooms found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">
                    Room
                  </th>

                  <th className="px-6 py-4">
                    Type
                  </th>

                  <th className="px-6 py-4">
                    Daily Charge
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  {canManage && (
                    <th className="px-6 py-4 text-right">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredRooms.map(
                  (room) => (
                    <tr
                      key={
                        room.room_number
                      }
                      className="border-t border-slate-100 hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        Room{" "}
                        {
                          room.room_number
                        }
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {
                          room.room_type
                        }
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        Rs.{" "}
                        {Number(
                          room.daily_charge_rate
                        ).toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${room.status ===
                            "available"
                            ? "bg-emerald-50 text-emerald-700"
                            : room.status ===
                              "occupied"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                            }`}
                        >
                          {
                            room.status
                          }
                        </span>
                      </td>

                      {canManage && (
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="secondary"
                              onClick={() =>
                                openEditModal(
                                  room
                                )
                              }
                            >
                              Edit
                            </Button>

                            <Button
                              variant="danger"
                              onClick={() =>
                                updateState(
                                  "deleteRoomNumber",
                                  room.room_number
                                )
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}

      <Modal
        open={formOpen}
        title={
          editingRoom
            ? "Edit Room"
            : "Add Room"
        }
        onClose={
          closeFormModal
        }
      >
        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Room Number"
              error=""
              type="number"
              name="room_number"
              value={
                form.room_number
              }
              onChange={
                handleChange
              }
              disabled={
                editingRoom !== null
              }
              placeholder="101"
              required
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Room Type *
              </label>

              <select
                name="room_type"
                value={
                  form.room_type
                }
                onChange={
                  handleChange
                }
                required
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select Room Type
                </option>

                <option value="General">
                  General
                </option>

                <option value="Private">
                  Private
                </option>

                <option value="ICU">
                  ICU
                </option>
              </select>
            </div>

            <Input
              label="Daily Charge Rate"
              error=""
              type="number"
              min="0"
              name="daily_charge_rate"
              value={
                form.daily_charge_rate
              }
              onChange={
                handleChange
              }
              placeholder="5000"
              required
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status *
              </label>

              <select
                name="status"
                value={
                  form.status
                }
                onChange={
                  handleChange
                }
                required
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="available">
                  Available
                </option>

                <option value="occupied">
                  Occupied
                </option>

                <option value="maintenance">
                  Maintenance
                </option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="secondary"
              onClick={
                closeFormModal
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                submitting
              }
            >
              {submitting
                ? "Saving..."
                : editingRoom
                  ? "Update Room"
                  : "Add Room"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}

      <ConfirmModal
        open={
          deleteRoomNumber !== null
        }
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
        confirmText="Delete Room"
        loading={
          submitting
        }
        onConfirm={
          handleDelete
        }
        onCancel={() =>
          updateState(
            "deleteRoomNumber",
            null
          )
        }
      />

      {/* Toast */}

      {toast.show && (
        <Toast
          message={
            toast.message
          }
          type={
            toast.type
          }
          onClose={() =>
            setState(
              (prev) => ({
                ...prev,
                toast: {
                  ...prev.toast,
                  show: false,
                },
              })
            )
          }
        />
      )}
    </div>
  );
}