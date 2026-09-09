export default function Input({
    label,
    error,
    className = "",
    ...props
  }) {
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
  
        <input
          className={`w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className}`}
          {...props}
        />
  
        {error && (
          <p className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }