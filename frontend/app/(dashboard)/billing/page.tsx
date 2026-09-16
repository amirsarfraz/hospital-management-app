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
  getBills,
  createBill,
  updateBill,
  deleteBill,
} from "@/services/billService";

import {
  getPatients,
} from "@/services/patientService";

import type {
  Bill,
  BillFormData,
} from "@/types/bill";

import type {
  Patient,
} from "@/types/patient";

const emptyForm: BillFormData = {
  patient_id: "",
  total_amount: "",
  payment_status: "unpaid",
  date_issued: "",
};

export default function BillingPage() {
  const [bills, setBills] =
    useState<Bill[]>([]);

  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [form, setForm] =
    useState<BillFormData>(
      emptyForm
    );

  const [
    editingBill,
    setEditingBill,
  ] = useState<Bill | null>(null);

  const [
    deleteBillId,
    setDeleteBillId,
  ] = useState<number | null>(
    null
  );

  const [formOpen, setFormOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [toast, setToast] =
    useState({
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
        billData,
        patientData,
      ] = await Promise.all([
        getBills(),
        getPatients(),
      ]);

      setBills(billData);
      setPatients(patientData);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to load billing data",
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
    >
  ) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]:
        e.target.value,
    }));
  };

  const openCreateModal = () => {
    setEditingBill(null);

    setForm({
      ...emptyForm,
      date_issued:
        new Date()
          .toISOString()
          .slice(0, 10),
    });

    setFormOpen(true);
  };

  const openEditModal = (
    bill: Bill
  ) => {
    setEditingBill(bill);

    setForm({
      patient_id:
        String(bill.patient_id),

      total_amount:
        String(bill.total_amount),

      payment_status:
        bill.payment_status,

      date_issued:
        bill.date_issued,
    });

    setFormOpen(true);
  };

  const closeFormModal = () => {
    setFormOpen(false);
    setEditingBill(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !form.patient_id ||
      !form.total_amount ||
      !form.payment_status ||
      !form.date_issued
    ) {
      showToast(
        "Please fill all required fields.",
        "error"
      );

      return;
    }

    if (
      Number(form.total_amount) < 0
    ) {
      showToast(
        "Total amount cannot be negative.",
        "error"
      );

      return;
    }

    try {
      setSubmitting(true);

      if (editingBill) {
        await updateBill(
          editingBill.bill_number,
          form
        );

        showToast(
          "Bill updated successfully."
        );
      } else {
        await createBill(form);

        showToast(
          "Bill created successfully."
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

  const handleDelete =
    async () => {
      if (
        deleteBillId === null
      ) {
        return;
      }

      try {
        setSubmitting(true);

        await deleteBill(
          deleteBillId
        );

        setDeleteBillId(null);

        showToast(
          "Bill deleted successfully."
        );

        await fetchData();
      } catch (error) {
        showToast(
          error instanceof Error
            ? error.message
            : "Failed to delete bill",
          "error"
        );
      } finally {
        setSubmitting(false);
      }
    };

  const filteredBills =
    bills.filter((bill) => {
      const searchText = `
        ${bill.bill_number}
        ${
          bill.patients?.first_name ||
          ""
        }
        ${
          bill.patients?.last_name ||
          ""
        }
        ${
          bill.patients?.phone_number ||
          ""
        }
      `.toLowerCase();

      const matchesSearch =
        searchText.includes(
          search.toLowerCase()
        );

      const matchesStatus =
        statusFilter === "all" ||
        bill.payment_status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const paidBills =
    bills.filter(
      (bill) =>
        bill.payment_status ===
        "paid"
    );

  const unpaidBills =
    bills.filter(
      (bill) =>
        bill.payment_status ===
        "unpaid"
    );

  const totalRevenue =
    paidBills.reduce(
      (total, bill) =>
        total +
        Number(
          bill.total_amount
        ),
      0
    );

  const outstandingAmount =
    unpaidBills.reduce(
      (total, bill) =>
        total +
        Number(
          bill.total_amount
        ),
      0
    );

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Billing
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage patient bills
            and payment status.
          </p>
        </div>

        <Button
          onClick={
            openCreateModal
          }
        >
          + Create Bill
        </Button>

      </div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Revenue
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            Rs.{" "}
            {totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Outstanding
          </p>

          <p className="mt-2 text-2xl font-bold text-amber-600">
            Rs.{" "}
            {outstandingAmount.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Paid Bills
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {paidBills.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Unpaid Bills
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {unpaidBills.length}
          </p>
        </div>

      </div>

      {/* Search/filter */}

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search by bill number, patient or phone..."
          className="h-11 rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="all">
            All Statuses
          </option>

          <option value="paid">
            Paid
          </option>

          <option value="unpaid">
            Unpaid
          </option>
        </select>

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Billing Records
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {bills.length} bills
            generated
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500">
            Loading bills...
          </div>
        ) : filteredBills.length ===
          0 ? (
          <div className="py-16 text-center">
            <p className="font-medium text-slate-900">
              No bills found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="bg-slate-50">
                <tr className="text-xs uppercase tracking-wide text-slate-500">

                  <th className="px-6 py-4">
                    Bill
                  </th>

                  <th className="px-6 py-4">
                    Patient
                  </th>

                  <th className="px-6 py-4">
                    Amount
                  </th>

                  <th className="px-6 py-4">
                    Date
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>
                {filteredBills.map(
                  (bill) => (
                    <tr
                      key={
                        bill.bill_number
                      }
                      className="border-t border-slate-100 hover:bg-slate-50/70"
                    >

                      <td className="px-6 py-4 font-semibold text-slate-900">
                        #
                        {
                          bill.bill_number
                        }
                      </td>

                      <td className="px-6 py-4">

                        <p className="font-medium text-slate-900">
                          {
                            bill.patients
                              ?.first_name
                          }{" "}
                          {
                            bill.patients
                              ?.last_name
                          }
                        </p>

                        <p className="text-xs text-slate-400">
                          Patient #
                          {
                            bill.patient_id
                          }
                        </p>

                      </td>

                      <td className="px-6 py-4 font-medium text-slate-700">
                        Rs.{" "}
                        {Number(
                          bill.total_amount
                        ).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {
                          bill.date_issued
                        }
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            bill.payment_status ===
                            "paid"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {
                            bill.payment_status
                          }
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <Button
                            variant="secondary"
                            onClick={() =>
                              openEditModal(
                                bill
                              )
                            }
                          >
                            Edit
                          </Button>

                          <Button
                            variant="danger"
                            onClick={() =>
                              setDeleteBillId(
                                bill.bill_number
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

      {/* Add/Edit modal */}

      <Modal
        open={formOpen}
        title={
          editingBill
            ? "Edit Bill"
            : "Create Bill"
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

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Patient *
              </label>

              <select
                name="patient_id"
                value={
                  form.patient_id
                }
                onChange={
                  handleChange
                }
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

            <Input
              label="Total Amount"
              error=""
              type="number"
              min="0"
              name="total_amount"
              value={
                form.total_amount
              }
              onChange={
                handleChange
              }
              placeholder="8500"
              required
            />

            <Input
              label="Date Issued"
              error=""
              type="date"
              name="date_issued"
              value={
                form.date_issued
              }
              onChange={
                handleChange
              }
              required
            />

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Payment Status *
              </label>

              <select
                name="payment_status"
                value={
                  form.payment_status
                }
                onChange={
                  handleChange
                }
                required
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="unpaid">
                  Unpaid
                </option>

                <option value="paid">
                  Paid
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
                : editingBill
                  ? "Update Bill"
                  : "Create Bill"}
            </Button>

          </div>

        </form>

      </Modal>

      <ConfirmModal
        open={
          deleteBillId !== null
        }
        title="Delete Bill"
        message="Are you sure you want to delete this bill? This action cannot be undone."
        confirmText="Delete Bill"
        loading={
          submitting
        }
        onConfirm={
          handleDelete
        }
        onCancel={() =>
          setDeleteBillId(
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
          onClose={() =>
            setToast(
              (previous) => ({
                ...previous,
                show: false,
              })
            )
          }
        />
      )}

    </div>
  );
}