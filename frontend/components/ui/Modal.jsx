export default function Modal({
    open,
    title,
    children,
    onClose,
  }) {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
  
            <button
              onClick={onClose}
              className="text-xl text-slate-400 hover:text-slate-700"
            >
              ×
            </button>
          </div>
  
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  }