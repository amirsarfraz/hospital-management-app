"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Toast from "@/components/ui/Toast";

import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "@/services/patientService";

import type {
  Patient,
  PatientFormData,
} from "@/types/patient";

const emptyForm: PatientFormData = {
  first_name: "",
  last_name: "",
  date_of_birth: "",
  gender: "",
  address: "",
  phone_number: "",
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<PatientFormData>(emptyForm);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletePatientId, setDeletePatientId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");

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

  const fetchPatients = async () => {
    try {
      setLoading(true);

      const data = await getPatients();

      setPatients(data);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to load patients",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const openCreateModal = () => {
    setEditingPatient(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEditModal = (patient: Patient) => {
    setEditingPatient(patient);

    setForm({
      first_name: patient.first_name,
      last_name: patient.last_name,
      date_of_birth: patient.date_of_birth,
      gender: patient.gender,
      address: patient.address || "",
      phone_number: patient.phone_number,
    });

    setFormOpen(true);
  };

  const closeFormModal = () => {
    setFormOpen(false);
    setEditingPatient(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.date_of_birth ||
      !form.gender ||
      !form.phone_number.trim()
    ) {
      showToast(
        "Please fill all required fields.",
        "error"
      );

      return;
    }

    try {
      setSubmitting(true);

      if (editingPatient) {
        await updatePatient(
          editingPatient.patient_id,
          form
        );

        showToast(
          "Patient updated successfully."
        );
      } else {
        await createPatient(form);

        showToast(
          "Patient added successfully."
        );
      }

      closeFormModal();

      await fetchPatients();
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
    if (!deletePatientId) return;

    try {
      setSubmitting(true);

      await deletePatient(deletePatientId);

      setDeletePatientId(null);

      showToast(
        "Patient deleted successfully."
      );

      await fetchPatients();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to delete patient",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const text = `
      ${patient.first_name}
      ${patient.last_name}
      ${patient.phone_number}
      ${patient.gender}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Patients
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage hospital patients and their information.
          </p>
        </div>

        <Button onClick={openCreateModal}>
          + Add Patient
        </Button>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search patients by name, phone or gender..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Patient Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Patient List
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {patients.length} patients registered
          </p>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            Loading patients...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="font-semibold text-slate-900">
              No patients found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try another search."
                : "Add your first patient to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="bg-slate-50">
                <tr className="text-xs uppercase tracking-wide text-slate-500">

                  <th className="px-6 py-4">
                    Patient
                  </th>

                  <th className="px-6 py-4">
                    DOB
                  </th>

                  <th className="px-6 py-4">
                    Gender
                  </th>

                  <th className="px-6 py-4">
                    Phone
                  </th>

                  <th className="px-6 py-4">
                    Address
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.patient_id}
                    className="border-t border-slate-100 hover:bg-slate-50/70"
                  >

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 font-semibold text-emerald-600">
                          {patient.first_name
                            .charAt(0)
                            .toUpperCase()}
                          {patient.last_name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {patient.first_name}{" "}
                            {patient.last_name}
                          </p>

                          <p className="text-xs text-slate-400">
                            ID #{patient.patient_id}
                          </p>
                        </div>

                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {patient.date_of_birth}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {patient.gender}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {patient.phone_number}
                    </td>

                    <td className="max-w-[250px] truncate px-6 py-4 text-slate-600">
                      {patient.address || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">

                        <Button
                          variant="secondary"
                          onClick={() =>
                            openEditModal(patient)
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() =>
                            setDeletePatientId(
                              patient.patient_id
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

      {/* Add / Edit Modal */}
      <Modal
        open={formOpen}
        title={
          editingPatient
            ? "Edit Patient"
            : "Add Patient"
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

            <Input
              label="Date of Birth"
              error=""
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
              required
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Gender
              </label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <Input
              label="Phone Number"
              error=""
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              placeholder="03001234567"
              required
            />

            <div className="sm:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter patient address"
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

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
                : editingPatient
                  ? "Update Patient"
                  : "Add Patient"}
            </Button>

          </div>

        </form>
      </Modal>

      {/* Delete Modal */}
      <ConfirmModal
        open={deletePatientId !== null}
        title="Delete Patient"
        message="Are you sure you want to delete this patient? This action cannot be undone."
        confirmText="Delete Patient"
        loading={submitting}
        onConfirm={handleDelete}
        onCancel={() =>
          setDeletePatientId(null)
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