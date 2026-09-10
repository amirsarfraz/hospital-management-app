"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Toast from "@/components/ui/Toast";

import {
  getNurses,
  createNurse,
  updateNurse,
  deleteNurse,
} from "@/services/nurseService";

import { getDepartments } from "@/services/departmentService";

import type {
  Nurse,
  NurseFormData,
  Department,
} from "@/types/nurse";

const emptyForm: NurseFormData = {
  first_name: "",
  last_name: "",
  shift_timing: "",
  contact_number: "",
  department_id: "",
};

export default function NursesPage() {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] =
    useState<NurseFormData>(emptyForm);

  const [editingNurse, setEditingNurse] =
    useState<Nurse | null>(null);

  const [deleteNurseId, setDeleteNurseId] =
    useState<number | null>(null);

  const [formOpen, setFormOpen] =
    useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

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

  const fetchData = async () => {
    try {
      setLoading(true);

      const [nurseData, departmentData] =
        await Promise.all([
          getNurses(),
          getDepartments(),
        ]);

      setNurses(nurseData);
      setDepartments(departmentData);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to load nurses",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const openCreateModal = () => {
    setEditingNurse(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEditModal = (nurse: Nurse) => {
    setEditingNurse(nurse);

    setForm({
      first_name: nurse.first_name,
      last_name: nurse.last_name,
      shift_timing: nurse.shift_timing,
      contact_number:
        nurse.contact_number || "",
      department_id: String(
        nurse.department_id
      ),
    });

    setFormOpen(true);
  };

  const closeFormModal = () => {
    setFormOpen(false);
    setEditingNurse(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.shift_timing ||
      !form.department_id
    ) {
      showToast(
        "Please fill all required fields.",
        "error"
      );

      return;
    }

    try {
      setSubmitting(true);

      if (editingNurse) {
        await updateNurse(
          editingNurse.nurse_id,
          form
        );

        showToast(
          "Nurse updated successfully."
        );
      } else {
        await createNurse(form);

        showToast(
          "Nurse added successfully."
        );
      }

      closeFormModal();

      await fetchData();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Something went wrong",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteNurseId) return;

    try {
      setSubmitting(true);

      await deleteNurse(deleteNurseId);

      setDeleteNurseId(null);

      showToast(
        "Nurse deleted successfully."
      );

      await fetchData();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to delete nurse",
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
            Nurses
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage hospital nurses, shifts and departments.
          </p>
        </div>

        <Button onClick={openCreateModal}>
          + Add Nurse
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Nurse List
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {nurses.length} nurses registered
          </p>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            Loading nurses...
          </div>
        ) : nurses.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="font-semibold text-slate-900">
              No nurses found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add your first nurse to get started.
            </p>

            <div className="mt-5">
              <Button onClick={openCreateModal}>
                + Add Nurse
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-slate-50">
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">
                    Nurse
                  </th>

                  <th className="px-6 py-4">
                    Department
                  </th>

                  <th className="px-6 py-4">
                    Shift
                  </th>

                  <th className="px-6 py-4">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {nurses.map((nurse) => (
                  <tr
                    key={nurse.nurse_id}
                    className="border-t border-slate-100 transition hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 font-semibold text-purple-600">
                          {nurse.first_name
                            .charAt(0)
                            .toUpperCase()}
                          {nurse.last_name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {nurse.first_name}{" "}
                            {nurse.last_name}
                          </p>

                          <p className="text-xs text-slate-400">
                            ID #{nurse.nurse_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {nurse.departments?.name ||
                          "Not assigned"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {nurse.shift_timing}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {nurse.contact_number || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">

                        <Button
                          variant="secondary"
                          onClick={() =>
                            openEditModal(nurse)
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() =>
                            setDeleteNurseId(
                              nurse.nurse_id
                            )
                          }
                        >
                          Delete
                        </Button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      <Modal
        open={formOpen}
        title={
          editingNurse
            ? "Edit Nurse"
            : "Add Nurse"
        }
        onClose={closeFormModal}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div className="grid gap-4 sm:grid-cols-2">

            <Input
              label="First Name"
              error=""
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="Enter first name"
              required
            />

            <Input
              label="Last Name"
              error=""
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Enter last name"
              required
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Shift Timing
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                name="shift_timing"
                value={form.shift_timing}
                onChange={handleChange}
                required
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select Shift
                </option>

                <option value="Morning">
                  Morning
                </option>

                <option value="Evening">
                  Evening
                </option>

                <option value="Night">
                  Night
                </option>
              </select>
            </div>

            <Input
              label="Contact Number"
              error=""
              name="contact_number"
              value={form.contact_number}
              onChange={handleChange}
              placeholder="03001234567"
            />

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Department
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                name="department_id"
                value={form.department_id}
                onChange={handleChange}
                required
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select Department
                </option>

                {departments.map(
                  (department) => (
                    <option
                      key={
                        department.department_id
                      }
                      value={
                        department.department_id
                      }
                    >
                      {department.name}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

            <Button
              type="button"
              variant="secondary"
              onClick={closeFormModal}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingNurse
                  ? "Update Nurse"
                  : "Add Nurse"}
            </Button>

          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={deleteNurseId !== null}
        title="Delete Nurse"
        message="Are you sure you want to delete this nurse? This action cannot be undone."
        confirmText="Delete Nurse"
        loading={submitting}
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteNurseId(null)
        }
      />

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast((previous) => ({
              ...previous,
              show: false,
            }))
          }
        />
      )}

    </div>
  );
}