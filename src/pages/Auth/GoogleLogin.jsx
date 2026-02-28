import { FcGoogle } from "react-icons/fc";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import axiosPublic from "../../api/axiosPublic";

const GoogleLogin = ({ label = "Continue with Google" }) => {
  const { signInGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleLogin = async () => {
    Swal.fire({
      title: "Syncing with Google...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      /* ================= FIREBASE LOGIN ================= */
      const result = await signInGoogle();
      const user = result.user;

      /* ================= GET JWT FROM BACKEND ================= */
      const res = await axiosPublic.post("/jwt", {
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
      });

      /* ================= SAVE TOKEN ================= */
      localStorage.setItem("access-token", res.data.token);

      Swal.fire({
        icon: "success",
        title: "Welcome to SkillSpire 🚀",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(location.state?.pathname || "/", { replace: true });

    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text: err?.message || "Google login failed",
      });
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGoogleLogin}
      className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-base-300 bg-base-100 h-14 font-bold text-base-content transition-all hover:bg-base-200 hover:shadow-lg hover:shadow-base-300/50 active:bg-base-300"
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full"></div>
      <FcGoogle className="text-2xl transition-transform group-hover:scale-110" />
      <span className="tracking-tight">{label}</span>
    </motion.button>
  );
};

export default GoogleLogin;