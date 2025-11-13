import { useState } from "react";

export default function Settings() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = () => {
    setMessage("✅ Settings saved!");
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Admin Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="admin@example.com"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Save Changes
        </button>

        {message && <p className="text-sm mt-2">{message}</p>}
      </div>
    </div>
  );
}
