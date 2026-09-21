export default function AdminPage() {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
  
          <p className="mt-1 text-gray-500">
            Welcome to City Care Hospital administration.
          </p>
        </div>
  
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Patients
            </p>
  
            <p className="mt-2 text-3xl font-bold">
              0
            </p>
          </div>
  
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Doctors
            </p>
  
            <p className="mt-2 text-3xl font-bold">
              0
            </p>
          </div>
  
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Rooms
            </p>
  
            <p className="mt-2 text-3xl font-bold">
              0
            </p>
          </div>
  
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Users
            </p>
  
            <p className="mt-2 text-3xl font-bold">
              0
            </p>
          </div>
        </div>
      </div>
    );
  }