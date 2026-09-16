"use client";

import {
  useEffect,
  useState,
} from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Toast from "@/components/ui/Toast";

import {
  getTreatments,
  createTreatment,
  updateTreatment,
  deleteTreatment,
} from "@/services/treatmentService";

import { getPatients } from "@/services/patientService";
import { getDoctors } from "@/services/doctorService";

import type {
  Treatment,
  TreatmentFormData,
} from "@/types/treatment";

import type { Patient } from "@/types/patient";
import type { Doctor } from "@/types/doctor";

const emptyForm: TreatmentFormData = {
  patient_id: "",
  doctor_id: "",
  treatment_date: "",
  diagnosis: "",
  medication: "",
};

export default function TreatmentsPage() {
  const [treatments, setTreatments] =
    useState<Treatment[]>([]);

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [doctors, setDoctors] =
    useState<Doctor[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [form, setForm] =
    useState<TreatmentFormData>(
      emptyForm
    );

  const [
    editingTreatment,
    setEditingTreatment,
  ] = useState<Treatment | null>(null);

  const [
    deleteTreatmentId,
    setDeleteTreatmentId,
  ] = useState<number | null>(null);

  const [formOpen, setFormOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (
    message: string,
    type: "success" | "error" =
      "success"
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

      const [
        treatmentData,
        patientData,
        doctorData,
      ] = await Promise.all([
        getTreatments(),
        getPatients(),
        getDoctors(),
      ]);

      setTreatments(treatmentData);
      setPatients(patientData);
      setDoctors(doctorData);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to load treatments",
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
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >
  ) => {
    setForm((previous) => ({
      ...previous,

      [e.target.name]:
        e.target.value,
    }));
  };

  const openCreateModal = () => {
    setEditingTreatment(null);

    setForm(emptyForm);

    setFormOpen(true);
  };

  const openEditModal = (
    treatment: Treatment
  ) => {
    setEditingTreatment(treatment);

    setForm({
      patient_id: String(
        treatment.patient_id
      ),

      doctor_id: String(
        treatment.doctor_id
      ),

      treatment_date:
        treatment.treatment_date,

      diagnosis:
        treatment.diagnosis,

      medication:
        treatment.medication || "",
    });

    setFormOpen(true);
  };

  const closeFormModal = () => {
    setFormOpen(false);

    setEditingTreatment(null);

    setForm(emptyForm);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !form.patient_id ||
      !form.doctor_id ||
      !form.treatment_date ||
      !form.diagnosis.trim()
    ) {
      showToast(
        "Please fill all required fields.",
        "error"
      );

      return;
    }

    try {
      setSubmitting(true);

      if (editingTreatment) {
        await updateTreatment(
          editingTreatment.treatment_id,
          form
        );

        showToast(
          "Treatment updated successfully."
        );
      } else {
        await createTreatment(form);

        showToast(
          "Treatment added successfully."
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
    if (!deleteTreatmentId) return;

    try {
      setSubmitting(true);

      await deleteTreatment(
        deleteTreatmentId
      );

      setDeleteTreatmentId(null);

      showToast(
        "Treatment deleted successfully."
      );

      await fetchData();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to delete treatment",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTreatments =
    treatments.filter(
      (treatment) => {
        const searchText = `
          ${
            treatment.patients
              ?.first_name || ""
          }

          ${
            treatment.patients
              ?.last_name || ""
          }

          ${
            treatment.doctors
              ?.first_name || ""
          }

          ${
            treatment.doctors
              ?.last_name || ""
          }

          ${treatment.diagnosis}

          ${
            treatment.medication || ""
          }
        `.toLowerCase();

        return searchText.includes(
          search.toLowerCase()
        );
      }
    );

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Treatments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage patient treatment
            records, diagnoses and
            prescribed medications.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
        >
          + Add Treatment
        </Button>

      </div>

      {/* SEARCH */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

        <input
          type="text"
          placeholder="Search patient, doctor, diagnosis or medication..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Treatment History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {treatments.length} treatment
            records
          </p>

        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500">
            Loading treatments...
          </div>
        ) : filteredTreatments.length ===
          0 ? (
          <div className="py-16 text-center">

            <p className="font-medium text-slate-900">
              No treatments found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add a treatment record to
              get started.
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
                    Doctor
                  </th>

                  <th className="px-6 py-4">
                    Date
                  </th>

                  <th className="px-6 py-4">
                    Diagnosis
                  </th>

                  <th className="px-6 py-4">
                    Medication
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredTreatments.map(
                  (treatment) => (
                    <tr
                      key={
                        treatment.treatment_id
                      }
                      className="border-t border-slate-100 hover:bg-slate-50/70"
                    >

                      <td className="px-6 py-4">

                        <p className="font-medium text-slate-900">
                          {
                            treatment.patients
                              ?.first_name
                          }{" "}
                          {
                            treatment.patients
                              ?.last_name
                          }
                        </p>

                        <p className="text-xs text-slate-400">
                          Patient #
                          {
                            treatment.patient_id
                          }
                        </p>

                      </td>

                      <td className="px-6 py-4">

                        <p className="font-medium text-slate-800">
                          Dr.{" "}
                          {
                            treatment.doctors
                              ?.first_name
                          }{" "}
                          {
                            treatment.doctors
                              ?.last_name
                          }
                        </p>

                        <p className="text-xs text-slate-400">
                          {
                            treatment.doctors
                              ?.specialization
                          }
                        </p>

                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {
                          treatment.treatment_date
                        }
                      </td>

                      <td className="max-w-[220px] px-6 py-4 text-slate-600">
                        {treatment.diagnosis}
                      </td>

                      <td className="max-w-[220px] px-6 py-4 text-slate-600">
                        {treatment.medication ||
                          "No medication"}
                      </td>

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <Button
                            variant="secondary"
                            onClick={() =>
                              openEditModal(
                                treatment
                              )
                            }
                          >
                            Edit
                          </Button>

                          <Button
                            variant="danger"
                            onClick={() =>
                              setDeleteTreatmentId(
                                treatment.treatment_id
                              )
                            }
                          >
                            Delete
                          </Button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ADD / EDIT MODAL */}

      <Modal
        open={formOpen}
        title={
          editingTreatment
            ? "Edit Treatment"
            : "Add Treatment"
        }
        onClose={closeFormModal}
      >

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div className="grid gap-4 sm:grid-cols-2">

            {/* PATIENT */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Patient *
              </label>

              <select
                name="patient_id"
                value={form.patient_id}
                onChange={handleChange}
                required
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  Select Patient
                </option>

                {patients.map(
                  (patient) => (
                    <option
                      key={
                        patient.patient_id
                      }
                      value={
                        patient.patient_id
                      }
                    >
                      {
                        patient.first_name
                      }{" "}
                      {
                        patient.last_name
                      }
                    </option>
                  )
                )}

              </select>

            </div>

            {/* DOCTOR */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Doctor *
              </label>

              <select
                name="doctor_id"
                value={form.doctor_id}
                onChange={handleChange}
                required
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  Select Doctor
                </option>

                {doctors.map(
                  (doctor) => (
                    <option
                      key={
                        doctor.doctor_id
                      }
                      value={
                        doctor.doctor_id
                      }
                    >
                      Dr.{" "}
                      {
                        doctor.first_name
                      }{" "}
                      {
                        doctor.last_name
                      }{" "}
                      -{" "}
                      {
                        doctor.specialization
                      }
                    </option>
                  )
                )}

              </select>

            </div>

            <Input
              label="Treatment Date"
              error=""
              type="date"
              name="treatment_date"
              value={
                form.treatment_date
              }
              onChange={handleChange}
              required
            />

            <Input
              label="Medication"
              error=""
              name="medication"
              value={form.medication}
              onChange={handleChange}
              placeholder="e.g. Amlodipine 5mg"
            />

            <div className="sm:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Diagnosis *
              </label>

              <textarea
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Enter diagnosis..."
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
                : editingTreatment
                  ? "Update Treatment"
                  : "Add Treatment"}
            </Button>

          </div>

        </form>

      </Modal>

      {/* DELETE */}

      <ConfirmModal
        open={
          deleteTreatmentId !== null
        }
        title="Delete Treatment"
        message="Are you sure you want to delete this treatment record? This action cannot be undone."
        confirmText="Delete Treatment"
        loading={submitting}
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteTreatmentId(null)
        }
      />

      {/* TOAST */}

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