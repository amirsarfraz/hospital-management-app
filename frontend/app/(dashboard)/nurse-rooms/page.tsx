"use client";

import {
  useEffect,
  useState,
} from "react";

import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Toast from "@/components/ui/Toast";

import NurseRoomTable from "@/components/nurse-rooms/nurseRoomTable";
import AssignNurseRoomModal from "@/components/nurse-rooms/assignNurseRoomModal";

import {
  getNurseRooms,
  assignNurseRoom,
  deleteNurseRoom,
} from "@/services/nurseRoomService";

import { getNurses } from "@/services/nurseService";
import { getRooms } from "@/services/roomService";

import type { Nurse } from "@/types/nurse";
import type { Room } from "@/types/room";
import type { UserRole } from "@/types/user";

import type {
  NurseRoomAssignment,
  NurseRoomFormData,
} from "@/types/nurseRoom";

const emptyForm: NurseRoomFormData = {
  nurse_id: "",
  room_number: "",
};

export default function NurseRoomsPage() {
  const [role, setRole] =
    useState<UserRole | null>(null);

  const [assignments, setAssignments] =
    useState<NurseRoomAssignment[]>([]);

  const [nurses, setNurses] =
    useState<Nurse[]>([]);

  const [rooms, setRooms] =
    useState<Room[]>([]);

  const [form, setForm] =
    useState<NurseRoomFormData>(emptyForm);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [deleteAssignment, setDeleteAssignment] =
    useState<NurseRoomAssignment | null>(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const canManage =
    role === "admin" ||
    role === "manager";

  useEffect(() => {
    const storedRole =
      localStorage.getItem(
        "role"
      ) as UserRole | null;

    setRole(storedRole);
  }, []);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        assignmentData,
        nurseData,
        roomData,
      ] = await Promise.all([
        getNurseRooms(),
        getNurses(),
        getRooms(),
      ]);

      setAssignments(assignmentData);
      setNurses(nurseData);
      setRooms(roomData);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to load data",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      setSubmitting(true);

      await assignNurseRoom(form);

      showToast(
        "Nurse assigned to room successfully."
      );

      setModalOpen(false);
      setForm(emptyForm);

      await loadData();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to assign room",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteAssignment) {
      return;
    }

    try {
      setSubmitting(true);

      await deleteNurseRoom(
        deleteAssignment.nurse_room_id
      );

      setDeleteAssignment(null);

      showToast(
        "Nurse room assignment removed."
      );

      await loadData();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to remove assignment",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

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
            onClick={() => {
              setForm(emptyForm);
              setModalOpen(true);
            }}
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
          assignments={assignments}
          canManage={canManage}
          onDelete={setDeleteAssignment}
        />
      )}

      <AssignNurseRoomModal
        open={modalOpen}
        form={form}
        nurses={nurses}
        rooms={rooms}
        loading={submitting}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={() => {
          setModalOpen(false);
          setForm(emptyForm);
        }}
      />

      <ConfirmModal
        open={deleteAssignment !== null}
        title="Remove Assignment"
        message="Are you sure you want to remove this nurse from the room?"
        confirmText="Remove"
        loading={submitting}
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteAssignment(null)
        }
      />

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast((prev) => ({
              ...prev,
              show: false,
            }))
          }
        />
      )}
    </div>
  );
}