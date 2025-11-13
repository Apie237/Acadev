export default function Navbar() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-700">Admin Dashboard</h1>
      <div className="flex items-center gap-3">
        <span className="text-gray-600 text-sm">Welcome, Admin</span>
      </div>
    </header>
  );
}
