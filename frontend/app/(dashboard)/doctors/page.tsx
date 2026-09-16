"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Toast from "@/components/ui/Toast";

import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "@/services/doctorService";

import { getDepartments } from "@/services/departmentService";

import type {
  Doctor,
  Department,
  DoctorFormData,
} from "@/types/doctor";

const emptyForm: DoctorFormData = {
  first_name: "",
  last_name: "",
  specialization: "",
  years_experience: "",
  contact_number: "",
  department_id: "",
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] =
    useState<DoctorFormData>(emptyForm);

  const [editingDoctor, setEditingDoctor] =
    useState<Doctor | null>(null);

  const [deleteDoctorId, setDeleteDoctorId] =
    useState<number | null>(null);

  const [isFormOpen, setIsFormOpen] =
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

      const [doctorData, departmentData] =
        await Promise.all([
          getDoctors(),
          getDepartments(),
        ]);

      setDoctors(doctorData);
      setDepartments(departmentData);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to load doctors",
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
    setEditingDoctor(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor);

    setForm({
      first_name: doctor.first_name,
      last_name: doctor.last_name,
      specialization: doctor.specialization,
      years_experience: String(
        doctor.years_experience
      ),
      contact_number: doctor.contact_number || "",
      department_id: String(
        doctor.department_id
      ),
    });

    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setEditingDoctor(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.specialization.trim() ||
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

      if (editingDoctor) {
        await updateDoctor(
          editingDoctor.doctor_id,
          form
        );

        showToast(
          "Doctor updated successfully."
        );
      } else {
        await createDoctor(form);

        showToast(
          "Doctor added successfully."
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
    if (!deleteDoctorId) return;

    try {
      setSubmitting(true);

      await deleteDoctor(deleteDoctorId);

      setDeleteDoctorId(null);

      showToast(
        "Doctor deleted successfully."
      );

      await fetchData();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to delete doctor",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Doctors
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage hospital doctors and their departments.
          </p>
        </div>

        <Button onClick={openCreateModal}>
          + Add Doctor
        </Button>
      </div>

      {/* Doctor Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Doctor List
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {doctors.length} doctors registered
          </p>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="font-semibold text-slate-900">
              No doctors found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add your first doctor to get started.
            </p>

            <div className="mt-5">
              <Button onClick={openCreateModal}>
                + Add Doctor
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">
                    Doctor
                  </th>

                  <th className="px-6 py-4">
                    Specialization
                  </th>

                  <th className="px-6 py-4">
                    Department
                  </th>

                  <th className="px-6 py-4">
                    Experience
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
                {doctors.map((doctor) => (
                  <tr
                    key={doctor.doctor_id}
                    className="border-t border-slate-100 transition hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                          {doctor.first_name
                            .charAt(0)
                            .toUpperCase()}
                          {doctor.last_name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            Dr. {doctor.first_name}{" "}
                            {doctor.last_name}
                          </p>

                          <p className="text-xs text-slate-400">
                            ID #{doctor.doctor_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {doctor.specialization}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {doctor.departments?.name ||
                          "Not assigned"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {doctor.years_experience}{" "}
                      {doctor.years_experience === 1
                        ? "year"
                        : "years"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {doctor.contact_number || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          onClick={() =>
                            openEditModal(doctor)
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() =>
                            setDeleteDoctorId(
                              doctor.doctor_id
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

      {/* Add / Edit Doctor Modal */}
      <Modal
        open={isFormOpen}
        onClose={closeFormModal}
        title={
          editingDoctor
            ? "Edit Doctor"
            : "Add Doctor"
        }
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">

            <Input
              label="First Name"
              name="first_name"
              error=""
              value={form.first_name}
              onChange={handleChange}
              placeholder="Enter first name"
              required
            />

            <Input
              label="Last Name"
              name="last_name"
              error=""
              value={form.last_name}
              onChange={handleChange}
              placeholder="Enter last name"
              required
            />

            <Input
              label="Specialization"
              name="specialization"
              error=""
              value={form.specialization}
              onChange={handleChange}
              placeholder="e.g. Cardiologist"
              required
            />

            <Input
              label="Years of Experience"
              name="years_experience"
              type="number"
              error=""
              value={form.years_experience}
              onChange={handleChange}
              placeholder="e.g. 8"
              min="0"
            />

            <Input
              label="Contact Number"
              name="contact_number"
              error=""
              value={form.contact_number}
              onChange={handleChange}
              placeholder="03001234567"
            />

            <div>
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
                : editingDoctor
                  ? "Update Doctor"
                  : "Add Doctor"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={deleteDoctorId !== null}
        title="Delete Doctor"
        message="Are you sure you want to delete this doctor? This action cannot be undone."
        confirmText={
          submitting
            ? "Deleting..."
            : "Delete Doctor"
        }
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteDoctorId(null)
        }
      />

      {/* Toast */}
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