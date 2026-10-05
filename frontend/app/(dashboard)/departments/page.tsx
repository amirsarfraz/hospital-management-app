"use client";
import { useEffect,useState } from "react";
import { getDepartments,createDepartment,updateDepartment,deleteDepartment } from "@/services/departmentService";
import DepartmentForm from "@/components/departments/DepartmentForm";
import DepartmentTable from "@/components/departments/DepartmentTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Toast from "@/components/ui/Toast";
import type { Department,DepartmentsState } from "@/types/department";
import type { UserRole } from "@/types/user";

const emptyForm = {
  name: "",
  location: "",
  contact_phone: "",
};

export default function DepartmentsPage() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [state, setState] =
    useState<DepartmentsState>({
      departments: [],
      editingId: null,
      loading: false,
      deleteLoading: false,
      selectedDepartment: null,
      toast: {
        message: "",
        type: "success",
      },
      form: emptyForm,
    });
  const canManage =
    role === "admin" ||
    role === "manager";

  useEffect(() => {
    const storedRole =
      localStorage.getItem("role") as UserRole | null;

    setRole(storedRole);
  }, []);

  const {
    departments,
    editingId,
    loading,
    deleteLoading,
    selectedDepartment,
    toast,
    form,
  } = state;

  const updateState = <
    K extends keyof DepartmentsState
  >(
    field: K,
    value: DepartmentsState[K]
  ) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    updateState("toast", {
      message,
      type,
    });

    setTimeout(() => {
      updateState("toast", {
        message: "",
        type: "success",
      });
    }, 3000);
  };

  const loadDepartments = async () => {
    try {
      const data =
        await getDepartments();

      updateState(
        "departments",
        data
      );
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
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

  const resetForm = () => {
    setState((prev) => ({
      ...prev,
      form: emptyForm,
      editingId: null,
    }));
  };

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
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
      updateState(
        "loading",
        true
      );

      if (editingId !== null) {
        await updateDepartment(
          editingId,
          form
        );

        showToast(
          "Department updated successfully"
        );
      } else {
        await createDepartment(
          form
        );

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
      updateState(
        "loading",
        false
      );
    }
  };

  const handleEdit = (
    department: Department
  ) => {
    setState((prev) => ({
      ...prev,

      editingId:
        department.department_id,

      form: {
        name:
          department.name || "",

        location:
          department.location || "",

        contact_phone:
          department.contact_phone || "",
      },
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeleteClick = (
    department: Department
  ) => {
    updateState(
      "selectedDepartment",
      department
    );
  };

  const confirmDelete = async () => {
    if (!selectedDepartment) {
      return;
    }

    try {
      updateState(
        "deleteLoading",
        true
      );

      await deleteDepartment(
        selectedDepartment.department_id
      );

      showToast(
        "Department deleted successfully"
      );

      updateState(
        "selectedDepartment",
        null
      );

      await loadDepartments();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to delete department",
        "error"
      );
    } finally {
      updateState(
        "deleteLoading",
        false
      );
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          updateState(
            "toast",
            {
              message: "",
              type: "success",
            }
          )
        }
      />

      <ConfirmModal
        open={
          !!selectedDepartment
        }
        title="Delete Department"
        message={
          selectedDepartment
            ? `Are you sure you want to delete "${selectedDepartment.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        loading={
          deleteLoading
        }
        onConfirm={
          confirmDelete
        }
        onCancel={() =>
          updateState(
            "selectedDepartment",
            null
          )
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
        {canManage && (
          <DepartmentForm
            form={form}
            editingId={
              editingId
            }
            loading={loading}
            onChange={
              handleChange
            }
            onSubmit={
              handleSubmit
            }
            onCancel={
              resetForm
            }
          />
        )}
        <DepartmentTable
          canManage={canManage}
          departments={
            departments
          }
          onEdit={
            handleEdit
          }
          onDelete={
            handleDeleteClick
          }
        />
      </div>
    </>
  );
}