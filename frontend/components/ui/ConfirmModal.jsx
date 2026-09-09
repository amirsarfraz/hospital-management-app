import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmModal({
  open,
  title = "Confirm action",
  message,
  confirmText = "Confirm",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
    >
      <p className="text-sm leading-6 text-slate-600">
        {message}
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="danger"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : confirmText}
        </Button>
      </div>
    </Modal>
  );
}