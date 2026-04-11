import React, { useEffect, useMemo, useState } from "react";
import axiosSecure from "../../../api/axiosSecure";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  FiSend,
  FiAward,
  FiClock,
  FiXCircle,
  FiUser,
  FiGlobe,
  FiBriefcase,
  FiCode,
  FiMessageSquare,
  FiCalendar,
  FiStar,
} from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";

const initialForm = {
  fullName: "",
  portfolio: "",
  experience: "",
  skills: "",
  motivation: "",
  availability: "",
};

const ApplyCreator = () => {
  const { refreshJwtSession } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleSynced, setRoleSynced] = useState(false);

  useEffect(() => {
    axiosSecure
      .get("/creator-requests/me")
      .then((res) => setRequest(res.data))
      .catch(() => setRequest(null))
      .finally(() => setLoading(false));
  }, []);

  const status = request?.status || null;

  useEffect(() => {
    if (status !== "approved" || roleSynced) return;

    refreshJwtSession()
      .then(() => {
        window.dispatchEvent(new Event("role-updated"));
        setRoleSynced(true);
      })
      .catch(() => {
        setRoleSynced(true);
      });
  }, [status, roleSynced, refreshJwtSession]);

  const statusCard = useMemo(() => {
    if (!status) return null;

    if (status === "approved") {
      return {
        icon: <FiAward size={24} />,
        title: "Congratulations! You are now a creator",
        text: "Your application has been approved. You can now create and manage contests from your dashboard.",
        classes: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
      };
    }

    if (status === "rejected") {
      return {
        icon: <FiXCircle size={24} />,
        title: "Application Rejected",
        text: request?.reviewNote || "Your request was reviewed and rejected. You can improve your profile and apply again.",
        classes: "bg-red-500/10 border-red-500/30 text-red-300",
      };
    }

    return {
      icon: <FiClock size={24} />,
      title: "Application Under Review",
      text: "Your request is pending admin review. We will notify you once a decision is made.",
      classes: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    };
  }, [status, request]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data } = await axiosSecure.post("/creator-requests", form);
      setRequest(data.request || { ...form, status: "pending" });

      Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: "Your creator application is now in review.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error?.response?.data?.message || "Could not submit your request",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <section className="relative isolate space-y-8 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] p-8 md:p-10 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1b2640] border border-slate-700/60 shadow-[0_20px_70px_-25px_rgba(8,22,56,0.9)]"
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          <FiStar /> Creator Access Program
        </div>
        <h2 className="text-3xl font-black text-white">
          Apply To Become A <span className="text-primary">Creator</span>
        </h2>
        <p className="text-slate-300/90 mt-3 max-w-2xl leading-relaxed">
          Share your background and portfolio. Admin will review your application and grant creator access.
        </p>
      </motion.div>

      {statusCard && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border rounded-3xl p-6 md:p-7 backdrop-blur-sm ${statusCard.classes}`}
        >
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-xl border border-white/20 bg-black/20 p-3">{statusCard.icon}</div>
            <div>
              <h3 className="font-black text-xl">{statusCard.title}</h3>
              <p className="mt-2 opacity-90">{statusCard.text}</p>
            </div>
          </div>
        </motion.div>
      )}

      {status !== "approved" && status !== "pending" && (
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onSubmit}
          className="grid gap-6 lg:grid-cols-[1fr_300px] bg-[#070e1f]/70 border border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-[0_20px_60px_-28px_rgba(6,18,46,0.9)]"
        >
          <div className="space-y-5">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white">Application Form</h3>
              <p className="mt-1 text-sm text-slate-400">Fields marked by context are required for review quality.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="form-control md:col-span-1">
                <div className="label pb-1">
                  <span className="label-text text-slate-200 font-semibold">Full Name</span>
                </div>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={onChange}
                    required
                    placeholder="Your legal or professional name"
                    className="input input-bordered w-full pl-11 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                  />
                </div>
              </label>

              <label className="form-control md:col-span-1">
                <div className="label pb-1">
                  <span className="label-text text-slate-200 font-semibold">Experience</span>
                </div>
                <div className="relative">
                  <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    name="experience"
                    value={form.experience}
                    onChange={onChange}
                    required
                    placeholder="e.g., 3 years in frontend"
                    className="input input-bordered w-full pl-11 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                  />
                </div>
              </label>

              <label className="form-control md:col-span-2">
                <div className="label pb-1">
                  <span className="label-text text-slate-200 font-semibold">Portfolio URL</span>
                </div>
                <div className="relative">
                  <FiGlobe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    name="portfolio"
                    value={form.portfolio}
                    onChange={onChange}
                    required
                    placeholder="GitHub, Behance, Dribbble, personal site"
                    className="input input-bordered w-full pl-11 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                  />
                </div>
              </label>

              <label className="form-control md:col-span-2">
                <div className="label pb-1">
                  <span className="label-text text-slate-200 font-semibold">Top Skills</span>
                </div>
                <div className="relative">
                  <FiCode className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    name="skills"
                    value={form.skills}
                    onChange={onChange}
                    required
                    placeholder="React, Node.js, UI design, copywriting"
                    className="input input-bordered w-full pl-11 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                  />
                </div>
              </label>

              <label className="form-control md:col-span-2">
                <div className="label pb-1">
                  <span className="label-text text-slate-200 font-semibold">Why should we make you a creator?</span>
                </div>
                <div className="relative">
                  <FiMessageSquare className="absolute left-3.5 top-4 text-slate-500" />
                  <textarea
                    name="motivation"
                    value={form.motivation}
                    onChange={onChange}
                    required
                    placeholder="Share how you plan to run quality contests and engage participants"
                    className="textarea textarea-bordered h-36 w-full pl-11 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                  />
                </div>
              </label>

              <label className="form-control md:col-span-2">
                <div className="label pb-1">
                  <span className="label-text text-slate-200 font-semibold">Availability</span>
                </div>
                <div className="relative">
                  <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    name="availability"
                    value={form.availability}
                    onChange={onChange}
                    placeholder="Optional: e.g., 8-10 hours/week"
                    className="input input-bordered w-full pl-11 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                  />
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary h-12 rounded-xl font-black w-full md:w-auto md:min-w-60 text-slate-900"
            >
              <FiSend /> {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>

          <aside className="rounded-2xl border border-slate-700/80 bg-slate-900/45 p-5 h-fit">
            <h4 className="text-white font-black text-lg">Review Checklist</h4>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Admins usually approve applications with clear experience, proven portfolio links, and detailed motivation.
            </p>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="rounded-xl bg-slate-800/70 border border-slate-700 px-3 py-2">
                Portfolio has real projects and visible outcomes
              </div>
              <div className="rounded-xl bg-slate-800/70 border border-slate-700 px-3 py-2">
                Skills align with contest creation quality
              </div>
              <div className="rounded-xl bg-slate-800/70 border border-slate-700 px-3 py-2">
                Motivation explains community value
              </div>
            </div>
          </aside>
        </motion.form>
      )}
    </section>
  );
};

export default ApplyCreator;
