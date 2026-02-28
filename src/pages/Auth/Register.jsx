import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaCamera } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import axiosPublic from "../../api/axiosPublic";
import GoogleLogin from "./GoogleLogin";
import { motion, AnimatePresence } from "framer-motion";

const Register = () => {
  const { registerUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const photo = watch("photo");

  const onSubmit = async (data) => {
    Swal.fire({
      title: "Creating your profile...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      /* ================= 1️⃣ UPLOAD IMAGE ================= */
      const formData = new FormData();
      formData.append("image", data.photo[0]);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgHost}`,
        formData
      );

      const photoURL = imgRes.data.data.url;

      /* ================= 2️⃣ FIREBASE REGISTER ================= */
      await registerUser(data.email, data.password);

      await updateUserProfile({
        displayName: data.name,
        photoURL,
      });

      /* ================= 3️⃣ SAVE USER IN DB ================= */
      await axiosPublic.post("/users", {
        email: data.email,
        name: data.name,
        photo: photoURL,
      });

    /* ================= 4️⃣ GET JWT TOKEN ================= */
const jwtRes = await axiosPublic.post("/jwt", {
  email: data.email,
  name: data.name,
  photo: photoURL,
});

/* ⭐ SAVE TOKEN (IMPORTANT) */
localStorage.setItem("access-token", jwtRes.data.token);

      Swal.fire({
        icon: "success",
        title: "Welcome to SkillSpire! 🎉",
        text: "Account created successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message || "Something went wrong",
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* HEADER */}
      <div className="text-left mb-10">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
          Join <span className="text-primary">SkillSpire</span>
        </h2>
        <p className="text-slate-400 text-lg font-medium">Start your journey to the leaderboard</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* PHOTO UPLOAD & PREVIEW */}
        <div className="flex flex-col items-center md:items-start mb-8">
          <div className="relative group">
            <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-slate-700 bg-slate-800 flex items-center justify-center transition-all group-hover:border-primary/50 shadow-xl">
              {photo && photo.length > 0 ? (
                <img
                  src={URL.createObjectURL(photo[0])}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-5xl text-slate-600" />
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 bg-primary text-slate-900 p-3 rounded-2xl cursor-pointer shadow-2xl hover:scale-110 transition-transform ring-4 ring-[#111827]">
              <FaCamera size={18} />
              <input
                type="file"
                className="hidden"
                {...register("photo", { required: "Avatar is required" })}
              />
            </label>
          </div>
          {errors.photo && (
            <p className="text-error text-sm mt-3 font-bold">{errors.photo.message}</p>
          )}
        </div>

        {/* INPUT STACK */}
        <div className="space-y-6">
          
          {/* NAME */}
          <div className="form-control">
            <label className="label pb-2">
              <span className="label-text font-bold text-slate-300">Full Name</span>
            </label>
            <div className="relative">
              <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
              <input
                placeholder="Your Name"
                {...register("name", { required: "Name is required" })}
                className="input w-full pl-14 h-16 rounded-2xl bg-slate-800/40 border-slate-700 text-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg"
              />
            </div>
            {errors.name && <p className="text-error text-xs mt-1 ml-2 font-medium">{errors.name.message}</p>}
          </div>

          {/* EMAIL */}
          <div className="form-control">
            <label className="label pb-2">
              <span className="label-text font-bold text-slate-300">Email Address</span>
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
              <input
                type="email"
                placeholder="email@example.com"
                {...register("email", { required: "Email is required" })}
                className="input w-full pl-14 h-16 rounded-2xl bg-slate-800/40 border-slate-700 text-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg"
              />
            </div>
            {errors.email && <p className="text-error text-xs mt-1 ml-2 font-medium">{errors.email.message}</p>}
          </div>

          {/* PASSWORD - FIXED TOGGLE */}
          <div className="form-control">
            <label className="label pb-2">
              <span className="label-text font-bold text-slate-300">Create Password</span>
            </label>
            <div className="relative">
              <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                className="input w-full pl-14 pr-14 h-16 rounded-2xl bg-slate-800/40 border-slate-700 text-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors p-2 z-20"
              >
                <AnimatePresence mode="wait" initial={false}>
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
            {errors.password && <p className="text-error text-xs mt-1 ml-2 font-medium">{errors.password.message}</p>}
          </div>
        </div>

        {/* SUBMIT */}
        <button type="submit" className="btn btn-primary w-full h-16 rounded-2xl text-xl font-black shadow-2xl shadow-primary/30 hover:scale-[1.01] active:scale-95 transition-all mt-6 text-slate-900">
          Create Account
        </button>
      </form>

      {/* DIVIDER */}
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-800"></span>
        </div>
        <div className="relative flex justify-center text-sm uppercase">
          <span className="bg-[#111827] px-6 text-slate-500 font-bold tracking-widest">Or Continue With</span>
        </div>
      </div>

      <GoogleLogin label="Join with Google" />

      {/* LOGIN LINK */}
      <p className="mt-10 text-center text-lg font-medium text-slate-400">
        Already have an account?
        <Link to="/login" className="ml-2 text-primary font-bold hover:underline underline-offset-4">
          Login here
        </Link>
      </p>
    </motion.div>
  );
};

export default Register;