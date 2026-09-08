export default function Toast({
    message,
    type = "success",
    onClose,
  }) {
    if (!message) return null;
  
    const styles = {
      success:
        "border-green-200 bg-green-50 text-green-800",
      error:
        "border-red-200 bg-red-50 text-red-800",
    };
  
    return (
      <div
        className={`fixed right-6 top-6 z-[60] flex min-w-[320px] items-center justify-between rounded-xl border px-4 py-3 shadow-lg ${styles[type]}`}
      >
        <span className="text-sm font-medium">
          {message}
        </span>
  
        <button
          onClick={onClose}
          className="ml-4 text-lg opacity-60 hover:opacity-100"
        >
          ×
        </button>
      </div>
    );
  }