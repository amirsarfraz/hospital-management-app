export default function Header() {
    return (
      <header className="h-16 border-b bg-white px-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">City Care Hospital</h1>
        </div>
  
        <div className="text-sm text-slate-500">
          Hospital Management System
        </div>
      </header>
    );
  }