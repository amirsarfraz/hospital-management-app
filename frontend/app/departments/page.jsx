"use client";

import { useEffect, useState } from "react";

import DepartmentForm from "@/components/departments/DepartmentForm";
import DepartmentTable from "@/components/departments/DepartmentTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Toast from "@/components/ui/Toast";

export default function DepartmentsPage() {
  const API_URL =
    "http://localhost:5000/api/departments";

  const [departments, setDepartments] =
    useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [deleteDepartment, setDeleteDepartment] =
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

  const showToast = (message, type = "success") => {
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

  const fetchDepartments = async () => {
    try {
      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load departments"
        );
      }

      setDepartments(data);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  useEffect(() => {
    fetchDepartments();
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

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Something went wrong"
        );
      }

      if (editingId) {
        showToast(
          "Department updated successfully"
        );
      } else {
        showToast(
          "Department added successfully"
        );
      }

      resetForm();

      await fetchDepartments();
    } catch (error) {
      showToast(error.message, "error");
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
    setDeleteDepartment(department);
  };

  const confirmDelete = async () => {
    if (!deleteDepartment) return;

    try {
      setDeleteLoading(true);

      const response = await fetch(
        `${API_URL}/${deleteDepartment.department_id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete department"
        );
      }

      showToast(
        "Department deleted successfully"
      );

      setDeleteDepartment(null);

      await fetchDepartments();
    } catch (error) {
      showToast(error.message, "error");
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
        open={!!deleteDepartment}
        title="Delete Department"
        message={
          deleteDepartment
            ? `Are you sure you want to delete "${deleteDepartment.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() =>
          setDeleteDepartment(null)
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