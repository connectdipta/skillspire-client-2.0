import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosPublic from "../../../api/axiosPublic";
import axiosSecure from "../../../api/axiosSecure";
import axios from "axios";
import Swal from "sweetalert2";
import { FiImage, FiArrowLeft, FiSave } from "react-icons/fi";

const EditContest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const [deadline, setDeadline] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  /* ---------- LOAD CONTEST ---------- */
  useEffect(() => {
    axiosPublic.get(`/contests/${id}`).then((res) => {
      const contest = res.data;

      if (contest.status !== "pending") {
        Swal.fire("Access Denied", "Confirmed contests cannot be modified.", "warning");
        navigate("/dashboard/my-contests");
        return;
      }

      reset({
        name: contest.name,
        description: contest.description,
        taskInstruction: contest.taskInstruction,
        type: contest.type,
        price: contest.price,
        prize: contest.prize,
      });

      setDeadline(new Date(contest.deadline));
      setImagePreview(contest.image);
      setLoading(false);
    });
  }, [id, reset, navigate]);

  /* ---------- SUBMIT ---------- */
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      let imageUrl = imagePreview;

      // ✅ upload ONLY if user selected a new file
      if (data.image?.[0] instanceof File) {
        const formData = new FormData();
        formData.append("image", data.image[0]);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgHost}`,
          formData
        );

        imageUrl = imgRes.data.data.url;
      }

      const updatedData = {
        name: data.name,
        description: data.description,
        taskInstruction: data.taskInstruction,
        type: data.type,
        price: Number(data.price),
        prize: Number(data.prize),
        image: imageUrl,
        deadline: deadline.toISOString(),
      };

      await axiosSecure.put(`/contests/${id}`, updatedData);

      Swal.fire("Updated ✅", "Changes saved successfully", "success");
      navigate("/dashboard/my-contests");
    } catch (err) {
      console.error(err);
      Swal.fire("Error ❌", err.response?.data?.message || "Failed to sync changes", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Responsive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-primary mb-2 transition-colors text-sm font-bold uppercase tracking-wider"
          >
            <FiArrowLeft /> Back to List
          </button>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Modify <span className="text-primary">Contest</span>
          </h2>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 backdrop-blur-xl shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
          
          {/* Contest Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Contest Name</label>
            <input
              {...register("name", { required: true })}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-primary transition-all"
            />
          </div>

          {/* Image Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-center lg:text-left block">Existing Preview</label>
              <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-slate-800 group">
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <FiImage className="text-white/20 text-4xl" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Upload New Artwork</label>
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-2 text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary hover:file:text-white transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Description & Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
              <textarea
                {...register("description", { required: true })}
                rows={4}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Submission Rules</label>
              <textarea
                {...register("taskInstruction", { required: true })}
                rows={4}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all resize-none"
              />
            </div>
          </div>

          {/* Type, Price, Prize */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <select
                {...register("type", { required: true })}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option className="bg-slate-900">Coding</option>
                <option className="bg-slate-900">Design</option>
                <option className="bg-slate-900">Writing</option>
                <option className="bg-slate-900">Photography</option>
                <option className="bg-slate-900">Quiz</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Entry Fee ($)</label>
              <input
                type="number"
                {...register("price", { required: true })}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Prize Pool ($)</label>
              <input
                type="number"
                {...register("prize", { required: true })}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-primary font-bold text-primary"
              />
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 block">New Submission Deadline</label>
            <DatePicker
              selected={deadline}
              onChange={(date) => setDeadline(date)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-primary"
              dateFormat="MMMM d, yyyy"
              minDate={new Date()}
            />
          </div>

          {/* Submit */}
          <button 
            disabled={submitting}
            className={`w-full py-4 md:py-5 text-sm md:text-base font-black rounded-[1.5rem] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 ${
              submitting 
              ? "bg-slate-800 text-slate-600 cursor-not-allowed" 
              : "bg-primary hover:bg-blue-600 text-white shadow-xl shadow-primary/20"
            }`}
          >
            {submitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Synchronizing...
              </>
            ) : (
              <>
                <FiSave /> Save Changes
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditContest;