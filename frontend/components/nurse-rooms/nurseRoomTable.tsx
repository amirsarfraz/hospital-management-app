import type { NurseRoomTableProps } from "@/types/nurseRoom";
  
  export default function NurseRoomTable({
    assignments,
    canManage,
    onDelete,
  }: NurseRoomTableProps) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Nurse Room Assignments
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
                  Nurse
                </th>
  
                <th className="px-6 py-4">
                  Room
                </th>
  
                <th className="px-6 py-4">
                  Room Type
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
                  key={assignment.nurse_room_id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {assignment.nurses
                      ? `${assignment.nurses.first_name} ${assignment.nurses.last_name}`
                      : `Nurse #${assignment.nurse_id}`}
                  </td>
  
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      Room {assignment.room_number}
                    </span>
                  </td>
  
                  <td className="px-6 py-4 text-slate-600">
                    {assignment.rooms?.room_type || "—"}
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
                    colSpan={canManage ? 4 : 3}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No nurse room assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }