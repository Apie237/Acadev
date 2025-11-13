import { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);

      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.role === "admin") setAdmin(res.data);
        else setAdmin(null);
      } catch (err) {
        console.error(err);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
