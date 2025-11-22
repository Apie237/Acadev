import { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

const TokenHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      console.log("✅ Token received from URL:", token);
      
      // Store token
      localStorage.setItem("token", token);

      // Fetch user data
      api
        .get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("✅ User authenticated from URL token:", res.data);
          setUser(res.data);
          
          // Clean up URL
          params.delete("token");
          const newSearch = params.toString();
          const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ""}`;
          navigate(newUrl, { replace: true });
        })
        .catch((err) => {
          console.error("❌ Failed to authenticate with URL token:", err);
          localStorage.removeItem("token");
          navigate("/login");
        });
    }
  }, [location, navigate, setUser]);

  return null; // This component doesn't render anything
};

export default TokenHandler;