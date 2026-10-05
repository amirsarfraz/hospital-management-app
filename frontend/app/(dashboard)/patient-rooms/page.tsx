"use client";

import { useEffect,useState } from "react";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Toast from "@/components/ui/Toast";
import PatientRoomTable from "@/components/patient-rooms/patientRoomTable";
import AssignPatientRoomModal from "@/components/patient-rooms/assignPatientRoomModal";
import { getPatientRooms,assignPatientRoom,deletePatientRoom } from "@/services/patientRoomService";
import { getPatients } from "@/services/patientService";
import { getRooms } from "@/services/roomService";
import type { UserRole } from "@/types/user";
import type { PatientRoomFormData,PatientRoomsState } from "@/types/patientRoom";

const emptyForm: PatientRoomFormData = {
  patient_id: "",
  room_number: "",
};

const initialState: PatientRoomsState = {
  role: null,

  assignments: [],

  patients: [],

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

export default function PatientRoomsPage() {
  const [
    state,
    setState,
  ] = useState<PatientRoomsState>(
    initialState
  );

  const {
    role,
    assignments,
    patients,
    rooms,
    form,
    loading,
    submitting,
    modalOpen,
    deleteAssignment,
    toast,
  } = state;

  const updateState = <
    K extends keyof PatientRoomsState
  >(
    key: K,
    value: PatientRoomsState[K]
  ) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const canManage =
    role === "admin" ||
    role === "manager";

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

  const showToast = (
    message: string,
    type: "success" | "error" =
      "success"
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

  const loadData = async () => {
    try {
      updateState(
        "loading",
        true
      );

      const [
        assignmentData,
        patientData,
        roomData,
      ] = await Promise.all([
        getPatientRooms(),
        getPatients(),
        getRooms(),
      ]);

      setState((prev) => ({
        ...prev,

        assignments:
          assignmentData,

        patients:
          patientData,

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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !form.patient_id ||
      !form.room_number
    ) {
      showToast(
        "Please select patient and room.",
        "error"
      );

      return;
    }

    try {
      updateState(
        "submitting",
        true
      );

      await assignPatientRoom(
        form
      );

      showToast(
        "Patient assigned to room successfully."
      );

      setState((prev) => ({
        ...prev,

        modalOpen: false,

        form: {
          ...emptyForm,
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

  const handleDelete =
    async () => {
      if (!deleteAssignment) {
        return;
      }

      try {
        updateState(
          "submitting",
          true
        );

        await deletePatientRoom(
          deleteAssignment.patient_room_id
        );

        updateState(
          "deleteAssignment",
          null
        );

        showToast(
          "Patient room assignment removed."
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
        updateState(
          "submitting",
          false
        );
      }
    };

  const openAssignModal = () => {
    setState((prev) => ({
      ...prev,

      form: {
        ...emptyForm,
      },

      modalOpen: true,
    }));
  };

  const closeAssignModal = () => {
    setState((prev) => ({
      ...prev,

      modalOpen: false,

      form: {
        ...emptyForm,
      },
    }));
  };

  const closeToast = () => {
    setState((prev) => ({
      ...prev,

      toast: {
        ...prev.toast,
        show: false,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Patient Room Assignments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Assign patients to hospital rooms.
          </p>
        </div>

        {canManage && (
          <Button
            onClick={
              openAssignModal
            }
          >
            + Assign Patient
          </Button>
        )}
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500">
          Loading assignments...
        </div>
      ) : (
        <PatientRoomTable
          assignments={
            assignments
          }
          canManage={
            canManage
          }
          onDelete={(
            assignment
          ) =>
            updateState(
              "deleteAssignment",
              assignment
            )
          }
        />
      )}

      <AssignPatientRoomModal
        open={modalOpen}
        form={form}
        patients={patients}
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
        message="Are you sure you want to remove this patient from the room?"
        confirmText="Remove"
        loading={submitting}
        onConfirm={
          handleDelete
        }
        onCancel={() =>
          updateState(
            "deleteAssignment",
            null
          )
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