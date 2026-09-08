import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function DepartmentForm({
  form,
  editingId,
  loading,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingId
            ? "Edit Department"
            : "Add Department"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {editingId
            ? "Update the department information."
            : "Add a new hospital department."}
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-4 lg:grid-cols-4"
      >
        <Input
          name="name"
          placeholder="Department Name"
          value={form.name}
          onChange={onChange}
        />

        <Input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={onChange}
        />

        <Input
          name="contact_phone"
          placeholder="Phone"
          value={form.contact_phone}
          onChange={onChange}
        />

        <div className="flex gap-2">
          <Button
            type="submit"
            className="flex-1"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Department"
              : "Add Department"}
          </Button>

          {editingId && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}