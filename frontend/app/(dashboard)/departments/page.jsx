"use client";

import { useEffect, useState } from "react";

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/services/departmentService";

import DepartmentForm from "@/components/departments/DepartmentForm";
import DepartmentTable from "@/components/departments/DepartmentTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Toast from "@/components/ui/Toast";

export default function DepartmentsPage() {
  const [departments, setDepartments] =
    useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [selectedDepartment, setSelectedDepartment] =
    useState(null);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [form, setForm] = useState({
    name: "",
    location: "",
    contact_phone: "",
  });

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        message: "",
        type: "success",
      });
    }, 3000);
  };

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();

      setDepartments(data);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to load departments",
        "error"
      );
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      location: "",
      contact_phone: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      showToast(
        "Department name is required",
        "error"
      );
      return;
    }

    if (!form.location.trim()) {
      showToast(
        "Location is required",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await updateDepartment(
          editingId,
          form
        );

        showToast(
          "Department updated successfully"
        );
      } else {
        await createDepartment(form);

        showToast(
          "Department added successfully"
        );
      }

      resetForm();

      await loadDepartments();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (department) => {
    setEditingId(
      department.department_id
    );

    setForm({
      name: department.name || "",
      location:
        department.location || "",
      contact_phone:
        department.contact_phone || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeleteClick = (
    department
  ) => {
    setSelectedDepartment(department);
  };

  const confirmDelete = async () => {
    if (!selectedDepartment) return;

    try {
      setDeleteLoading(true);

      await deleteDepartment(
        selectedDepartment.department_id
      );

      showToast(
        "Department deleted successfully"
      );

      setSelectedDepartment(null);

      await loadDepartments();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to delete department",
        "error"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />

      <ConfirmModal
        open={!!selectedDepartment}
        title="Delete Department"
        message={
          selectedDepartment
            ? `Are you sure you want to delete "${selectedDepartment.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() =>
          setSelectedDepartment(null)
        }
      />

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Departments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage hospital departments and
            their information.
          </p>
        </div>

        <DepartmentForm
          form={form}
          editingId={editingId}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        <DepartmentTable
          departments={departments}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>
    </>
  );
}