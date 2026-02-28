import { useEffect, useState } from "react";
import axiosPublic from "../api/axiosPublic";
import useAuth from "./useAuth";

const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    axiosPublic
      .get(`/users/role/${user.email}`)
      .then(res => setRole(res.data.role))
      .finally(() => setLoading(false));
  }, [user?.email]);

  return { role, loading };
};

export default useRole;
