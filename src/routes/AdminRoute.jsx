import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import axiosPublic from "../api/axiosPublic";
import { getRoleFromAccessToken } from "../utils/sessionRole";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [role, setRole] = useState(() => getRoleFromAccessToken() || null);
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      setRoleLoading(false);
      return;
    }

    axiosPublic
      .get("/users/me")
      .then(res => setRole(res.data.role))
      .catch(() => setRole("user"))
      .finally(() => setRoleLoading(false));
  }, [user?.email]);

  if (loading || roleLoading) {
    return <p className="text-center py-20">Checking admin access…</p>;
  }

  if (user && role === "admin") {
    return children;
  }

  return <Navigate to="/" replace />;
};

export default AdminRoute;
