import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import axiosPublic from "../api/axiosPublic";

const CreatorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    axiosPublic
      .get("/users/me")
      .then(res => setRole(res.data.role))
      .catch(() => setRole("user"))
      .finally(() => setRoleLoading(false));
  }, [user?.email]);

  if (loading || roleLoading) {
    return <p className="text-center py-20">Checking creator access…</p>;
  }

  if (user && (role === "creator" || role === "admin")) {
    return children;
  }

  return <Navigate to="/" replace />;
};

export default CreatorRoute;
