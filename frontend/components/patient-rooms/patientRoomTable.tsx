import type { PatientRoomTableProps } from "@/types/patientRoom";
  
  export default function PatientRoomTable({
    assignments,
    canManage,
    onDelete,
  }: PatientRoomTableProps) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Patient Room Assignments
          </h2>
  
          <p className="mt-1 text-sm text-slate-500">
            {assignments.length} assignments
          </p>
        </div>
  
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">
                  Patient
                </th>
  
                <th className="px-6 py-4">
                  Room
                </th>
  
                <th className="px-6 py-4">
                  Room Type
                </th>
  
                <th className="px-6 py-4">
                  Status
                </th>
  
                {canManage && (
                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
  
            <tbody className="divide-y divide-slate-100">
              {assignments.map((assignment) => (
                <tr
                  key={assignment.patient_room_id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {assignment.patients
                      ? `${assignment.patients.first_name} ${assignment.patients.last_name}`
                      : `Patient #${assignment.patient_id}`}
                  </td>
  
                  <td className="px-6 py-4">
                    Room {assignment.room_number}
                  </td>
  
                  <td className="px-6 py-4 text-slate-600">
                    {assignment.rooms?.room_type || "—"}
                  </td>
  
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                      Assigned
                    </span>
                  </td>
  
                  {canManage && (
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            onDelete(assignment)
                          }
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
  
              {assignments.length === 0 && (
                <tr>
                  <td
                    colSpan={canManage ? 5 : 4}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No patient room assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }