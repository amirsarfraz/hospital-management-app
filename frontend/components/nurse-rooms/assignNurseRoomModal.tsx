import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

import type { Nurse } from "@/types/nurse";
import type { Room } from "@/types/room";
import type {
  NurseRoomFormData,
} from "@/types/nurseRoom";

interface Props {
  open: boolean;
  form: NurseRoomFormData;
  nurses: Nurse[];
  rooms: Room[];
  loading: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>
  ) => void;
  onClose: () => void;
}

export default function AssignNurseRoomModal({
  open,
  form,
  nurses,
  rooms,
  loading,
  onChange,
  onSubmit,
  onClose,
}: Props) {
  return (
    <Modal
      open={open}
      title="Assign Nurse to Room"
      onClose={onClose}
    >
      <form
        onSubmit={onSubmit}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Nurse
          </label>

          <select
            name="nurse_id"
            value={form.nurse_id}
            onChange={onChange}
            required
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              Select Nurse
            </option>

            {nurses.map((nurse) => (
              <option
                key={nurse.nurse_id}
                value={nurse.nurse_id}
              >
                {nurse.first_name}{" "}
                {nurse.last_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Room
          </label>

          <select
            name="room_number"
            value={form.room_number}
            onChange={onChange}
            required
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              Select Room
            </option>

            {rooms.map((room) => (
              <option
                key={room.room_number}
                value={room.room_number}
              >
                Room {room.room_number}
                {room.room_type
                  ? ` - ${room.room_type}`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Assigning..."
              : "Assign Room"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}