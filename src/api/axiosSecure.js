import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosSecure.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("access-token");

  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosSecure;