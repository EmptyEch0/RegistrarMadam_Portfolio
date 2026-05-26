import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const [status, setStatus] = useState<"loading" | "admin" | "unauthorized">("loading");

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem("admin_authenticated") === "true";
      if (isAuthenticated) {
        setStatus("admin");
      } else {
        setStatus("unauthorized");
      }
    };

    checkAuth();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking access…
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
