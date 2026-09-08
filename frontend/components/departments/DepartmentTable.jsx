export default function DepartmentTable({
    departments,
    onEdit,
    onDelete,
  }) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Department List
          </h2>
        </div>
  
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Department Name
                </th>
  
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Location
                </th>
  
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Phone
                </th>
  
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
  
            <tbody className="divide-y divide-slate-200">
              {departments.map((department) => (
                <tr
                  key={department.department_id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {department.name}
                  </td>
  
                  <td className="px-6 py-4 text-slate-600">
                    {department.location}
                  </td>
  
                  <td className="px-6 py-4 text-slate-600">
                    {department.contact_phone || "—"}
                  </td>
  
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(department)}
                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                      >
                        Edit
                      </button>
  
                      <button
                        onClick={() => onDelete(department)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
  
              {departments.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      No departments found
                    </p>
  
                    <p className="mt-1 text-sm text-slate-500">
                      Add your first department using the form above.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }