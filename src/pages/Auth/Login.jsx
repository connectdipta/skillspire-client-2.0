import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import GoogleLogin from "./GoogleLogin";
import axiosPublic from "../../api/axiosPublic";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Functional toggle to ensure we always have the latest state
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    Swal.fire({
      title: "Verifying Identity...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const result = await signInUser(data.email, data.password);
      await axiosPublic.post("/users", {
        email: result.user.email,
        name: result.user.displayName || "",
        photo: result.user.photoURL || "",
      });

     const jwtRes = await axiosPublic.post("/jwt", {
  email: result.user.email,
  name: result.user.displayName,
  photo: result.user.photoURL,
});

/* ⭐ SAVE TOKEN (MOST IMPORTANT LINE) */
localStorage.setItem("access-token", jwtRes.data.token);

const role = jwtRes.data.role || "user";

      Swal.fire({
        icon: "success",
        title: "Welcome Back! 👋",
        text: "Redirecting to your dashboard...",
        timer: 1500,
        showConfirmButton: false,
      });

      if (role === "admin" || role === "creator") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate(location.state || "/", { replace: true });
      }
    } catch (error) {
      Swal.fire(
        "Access Denied",
        error?.message || "Invalid credentials. Please try again.",
        "error"
      );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="text-left mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Welcome <span className="text-primary">Back</span>
        </h2>
        <p className="text-slate-400 text-lg font-medium">
          Continue your journey on SkillSpire
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* EMAIL */}
        <div className="form-control">
          <label className="label pb-3">
            <span className="label-text font-bold text-slate-300 text-lg">Email Address</span>
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
            <input
              type="email"
              placeholder="name@example.com"
              {...register("email", { required: "Email is required" })}
              className={`input w-full pl-14 h-16 rounded-2xl bg-slate-800/40 border-slate-700 text-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg ${errors.email ? 'border-error' : ''}`}
            />
          </div>
          {errors.email && (
            <p className="text-error text-sm mt-2 ml-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="form-control">
          <div className="flex justify-between items-center pb-3">
            <label className="label p-0">
              <span className="label-text font-bold text-slate-300 text-lg">Password</span>
            </label>
            <Link to="/forgot-password" size="sm" className="text-sm font-bold text-primary hover:text-primary-focus transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
              className="input w-full pl-14 pr-14 h-16 rounded-2xl bg-slate-800/40 border-slate-700 text-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg"
            />
            {/* TOGGLE BUTTON */}
            <button
              type="button" // CRITICAL: prevents form submission
              onClick={togglePasswordVisibility}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-all duration-200 focus:outline-none p-2"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={showPassword ? "eye-slash" : "eye"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.1 }}
                >
                  {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
          {errors.password && (
            <p className="text-error text-sm mt-2 ml-1 font-medium">{errors.password.message}</p>
          )}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-full h-16 rounded-2xl text-xl font-black shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all mt-6 text-slate-900"
        >
          Sign In
        </button>
      </form>

      <div className="relative my-12">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-800"></span>
        </div>
        <div className="relative flex justify-center text-sm uppercase">
          <span className="bg-[#111827] px-6 text-slate-500 font-bold tracking-widest">Or Continue With</span>
        </div>
      </div>

      <div className="w-full">
        <GoogleLogin />
      </div>

      <p className="mt-12 text-center text-lg font-medium text-slate-400">
        New to SkillSpire?
        <Link to="/register" className="ml-2 text-primary font-bold hover:underline underline-offset-4 transition-all">
          Create an account
        </Link>
      </p>
    </motion.div>
  );
};

export default Login;