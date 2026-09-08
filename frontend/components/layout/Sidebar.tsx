import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-white px-4 py-6">
      <div className="mb-8 px-3">
        <h1 className="text-xl font-bold text-slate-900">
          City Care
        </h1>
        <p className="text-sm text-slate-500">
          Hospital Management
        </p>
      </div>

      <nav className="space-y-1">
        <Link
          href="/"
          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Dashboard
        </Link>

        <p className="mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Management
        </p>

        <Link
          href="/patients"
          className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Patients
        </Link>

        <Link
          href="/doctors"
          className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Doctors
        </Link>

        <Link
          href="/departments"
          className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Departments
        </Link>

        <Link
          href="/nurses"
          className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Nurses
        </Link>

        <p className="mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Operations
        </p>

        <Link
          href="/treatments"
          className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Treatments
        </Link>

        <Link
          href="/rooms"
          className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Rooms
        </Link>

        <Link
          href="/billing"
          className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Billing
        </Link>
      </nav>
    </aside>
  );
}