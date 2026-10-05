"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Toast from "@/components/ui/Toast";
import NurseRoomTable from "@/components/nurse-rooms/nurseRoomTable";
import AssignNurseRoomModal from "@/components/nurse-rooms/assignNurseRoomModal";
import { getNurseRooms, assignNurseRoom, deleteNurseRoom } from "@/services/nurseRoomService";
import { getNurses } from "@/services/nurseService";
import { getRooms } from "@/services/roomService";
import type { UserRole } from "@/types/user";
import type { NurseRoomFormData, NurseRoomsState } from "@/types/nurseRoom";

// ==========================================
// EMPTY FORM
// ==========================================

const emptyForm: NurseRoomFormData = {
  nurse_id: "",
  room_number: "",
};

// ==========================================
// INITIAL STATE
// ==========================================

const initialState: NurseRoomsState = {
  role: null,
  assignments: [],
  nurses: [],
  rooms: [],
  form: {
    ...emptyForm,
  },

  loading: true,
  submitting: false,
  modalOpen: false,
  deleteAssignment: null,

  toast: {
    show: false,
    message: "",
    type: "success",
  },
};

export default function NurseRoomsPage() {
  const [
    state,
    setState,
  ] =
    useState<NurseRoomsState>(
      initialState
    );

  // ========================================
  // STATE VALUES
  // ========================================

  const {
    role,
    assignments,
    nurses,
    rooms,
    form,
    loading,
    submitting,
    modalOpen,
    deleteAssignment,
    toast,
  } = state;

  // ========================================
  // UPDATE STATE HELPER
  // ========================================

  const updateState = <
    K extends keyof NurseRoomsState
  >(
    field: K,
    value: NurseRoomsState[K]
  ) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ========================================
  // PERMISSIONS
  // ========================================

  const canManage =
    role === "admin" ||
    role === "manager";

  // ========================================
  // GET ROLE
  // ========================================

  useEffect(() => {
    const storedRole =
      localStorage.getItem(
        "role"
      ) as UserRole | null;

    updateState(
      "role",
      storedRole
    );
  }, []);

  // ========================================
  // TOAST
  // ========================================

  const showToast = (
    message: string,
    type:
      | "success"
      | "error" = "success"
  ) => {
    updateState(
      "toast",
      {
        show: true,
        message,
        type,
      }
    );
  };

  const closeToast = () => {
    updateState(
      "toast",
      {
        ...toast,
        show: false,
      }
    );
  };

  // ========================================
  // LOAD DATA
  // ========================================

  const loadData = async () => {
    try {
      updateState(
        "loading",
        true
      );

      const [
        assignmentData,
        nurseData,
        roomData,
      ] = await Promise.all([
        getNurseRooms(),
        getNurses(),
        getRooms(),
      ]);

      setState((prev) => ({
        ...prev,

        assignments:
          assignmentData,

        nurses:
          nurseData,

        rooms:
          roomData,
      }));
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to load data",
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
    loadData();
  }, []);

  // ========================================
  // OPEN ASSIGN MODAL
  // ========================================

  const openAssignModal = () => {
    setState((prev) => ({
      ...prev,

      form: {
        ...emptyForm,
      },

      modalOpen: true,
    }));
  };

  // ========================================
  // CLOSE ASSIGN MODAL
  // ========================================

  const closeAssignModal = () => {
    setState((prev) => ({
      ...prev,

      modalOpen: false,

      form: {
        ...emptyForm,
      },
    }));
  };

  // ========================================
  // FORM CHANGE
  // ========================================

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>
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

  // ========================================
  // ASSIGN NURSE
  // ========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !form.nurse_id ||
      !form.room_number
    ) {
      showToast(
        "Please select nurse and room.",
        "error"
      );

      return;
    }

    try {
      updateState(
        "submitting",
        true
      );

      await assignNurseRoom(
        form
      );

      setState((prev) => ({
        ...prev,

        modalOpen: false,

        form: {
          ...emptyForm,
        },

        toast: {
          show: true,

          message:
            "Nurse assigned to room successfully.",

          type: "success",
        },
      }));

      await loadData();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to assign room",
        "error"
      );
    } finally {
      updateState(
        "submitting",
        false
      );
    }
  };

  // ========================================
  // OPEN DELETE MODAL
  // ========================================

  const openDeleteModal = (
    assignment:
      NurseRoomsState["deleteAssignment"]
  ) => {
    updateState(
      "deleteAssignment",
      assignment
    );
  };

  // ========================================
  // CLOSE DELETE MODAL
  // ========================================

  const closeDeleteModal = () => {
    updateState(
      "deleteAssignment",
      null
    );
  };

  // ========================================
  // DELETE ASSIGNMENT
  // ========================================

  const handleDelete = async () => {
    if (!deleteAssignment) {
      return;
    }

    try {
      updateState(
        "submitting",
        true
      );

      await deleteNurseRoom(
        deleteAssignment.nurse_room_id
      );

      setState((prev) => ({
        ...prev,

        deleteAssignment: null,

        toast: {
          show: true,

          message:
            "Nurse room assignment removed.",

          type: "success",
        },
      }));

      await loadData();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to remove assignment",
        "error"
      );
    } finally {
      updateState(
        "submitting",
        false
      );
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Nurse Room Assignments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Assign nurses to hospital rooms.
          </p>
        </div>

        {canManage && (
          <Button
            onClick={
              openAssignModal
            }
          >
            + Assign Nurse
          </Button>
        )}
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500">
          Loading assignments...
        </div>
      ) : (
        <NurseRoomTable
          assignments={
            assignments
          }
          canManage={
            canManage
          }
          onDelete={
            openDeleteModal
          }
        />
      )}

      <AssignNurseRoomModal
        open={modalOpen}
        form={form}
        nurses={nurses}
        rooms={rooms}
        loading={submitting}
        onChange={
          handleChange
        }
        onSubmit={
          handleSubmit
        }
        onClose={
          closeAssignModal
        }
      />

      <ConfirmModal
        open={
          deleteAssignment !==
          null
        }
        title="Remove Assignment"
        message="Are you sure you want to remove this nurse from the room?"
        confirmText="Remove"
        loading={submitting}
        onConfirm={
          handleDelete
        }
        onCancel={
          closeDeleteModal
        }
      />

      {toast.show && (
        <Toast
          message={
            toast.message
          }
          type={
            toast.type
          }
          onClose={
            closeToast
          }
        />
      )}
    </div>
  );
}