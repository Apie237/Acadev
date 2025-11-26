import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AcadevoLoader from "../../../client/src/components/AcadevoLoader";

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useContext(AuthContext);

  if (loading) return <AcadevoLoader/>

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
