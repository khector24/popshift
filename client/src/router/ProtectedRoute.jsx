import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentAdmin } from "../services/adminAuthApi.js";

export default function ProtectedRoute() {
  const [authStatus, setAuthStatus] = useState("checking");

  useEffect(() => {
    async function checkAuthentication() {
      try {
        await getCurrentAdmin();

        setAuthStatus("authenticated");
      } catch (err) {
        if (err.status === 401) {
          setAuthStatus("unauthenticated");
          return;
        }

        setAuthStatus("error");
      }
    }

    checkAuthentication();
  }, []);

  if (authStatus === "checking") {
    return null;
  }

  if (authStatus === "unauthenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  if (authStatus === "error") {
    return <p>Unable to verify authentication.</p>;
  }

  return <Outlet />;
}
