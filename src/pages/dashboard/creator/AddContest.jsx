import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosPublic from "../../../api/axiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";

const AddContest = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [deadline, setDeadline] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (!user) {
      Swal.fire("Login required", "Please login first", "warning");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", data.image[0]);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgHost}`,
        formData
      );

      const imageUrl = imgRes.data?.data?.url;
      if (!imageUrl) throw new Error("Image upload failed");

      const contestData = {
        name: data.name,
        image: imageUrl,
        description: data.description,
        taskInstruction: data.taskInstruction,
        type: data.type,
        price: Number(data.price),
        prize: Number(data.prize),
        deadline: deadline.toISOString(),
        status: "pending",
        creatorEmail: user?.email,
        creatorName: user?.displayName,
        participantsCount: 0,
        createdAt: new Date().toISOString(),
      };

      await axiosPublic.post("/contests", contestData);

      Swal.fire({
        title: "Success 🎉",
        text: "Contest submitted for admin approval",
        icon: "success",
        background: "#0a0f1c",
        color: "#fff",
      });

      reset();
      setDeadline(new Date());
    } catch (error) {
      Swal.fire({
        title: "Error ❌",
        text: error?.response?.data?.message || "Failed to add contest",
        icon: "error",
        background: "#0a0f1c",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Responsive Header */}
        <header className="mb-10 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Create <span className="text-primary">Contest</span>
          </h2>
          <p className="text-slate-500 mt-2 text-sm md:text-base font-medium">
            Deploy a new arena for participants to showcase their skills.
          </p>
        </header>

        {/* Form Card */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
            
            {/* Row 1: Name & Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Contest Name
                </label>
                <input
                  {...register("name", { required: true })}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-700"
                  placeholder="e.g. Cyberpunk UI Challenge"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Cover Artwork
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("image", { required: true })}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-2.5 text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary hover:file:text-white transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Row 2: Description (Full Width) */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
                Mission Description
              </label>
              <textarea
                {...register("description", { required: true })}
                rows={3}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all resize-none"
                placeholder="Briefly describe the contest objectives..."
              />
            </div>

            {/* Row 3: Task Instructions (Full Width) */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
                Submission Guidelines
              </label>
              <textarea
                {...register("taskInstruction", { required: true })}
                rows={3}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all resize-none"
                placeholder="What exactly should participants upload? (Links, Files, etc.)"
              />
            </div>

            {/* Row 4: Type, Fee, & Prize */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Category
                </label>
                <select
                  {...register("type", { required: true })}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900">Select...</option>
                  <option className="bg-slate-900">Coding</option>
                  <option className="bg-slate-900">Design</option>
                  <option className="bg-slate-900">Writing</option>
                  <option className="bg-slate-900">Photography</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Entry Fee ($)
                </label>
                <input
                  type="number"
                  {...register("price", { required: true })}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-primary"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <label className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Prize Pool ($)
                </label>
                <input
                  type="number"
                  {...register("prize", { required: true })}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-primary font-bold text-primary"
                  placeholder="1000"
                />
              </div>
            </div>

            {/* Row 5: Deadline */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest ml-1 block">
                Contest Deadline
              </label>
              <div className="relative">
                <DatePicker
                  selected={deadline}
                  onChange={setDeadline}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-primary"
                  dateFormat="MMMM d, yyyy"
                  minDate={new Date()}
                />
              </div>
            </div>

            {/* Submit Section */}
            <div className="pt-6">
              <button
                disabled={loading}
                className={`w-full py-4 md:py-5 text-sm md:text-base font-black rounded-[1.5rem] uppercase tracking-[0.2em] transition-all duration-300 ${
                  loading 
                  ? "bg-slate-800 text-slate-600 cursor-not-allowed" 
                  : "bg-primary hover:bg-blue-600 text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Launching...
                  </span>
                ) : "Publish Contest"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContest;