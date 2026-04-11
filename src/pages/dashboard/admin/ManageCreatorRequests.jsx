import React, { useEffect, useState } from "react";
import axiosSecure from "../../../api/axiosSecure";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiX, FiEye } from "react-icons/fi";

const ManageCreatorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    axiosSecure
      .get("/admin/creator-requests")
      .then((res) => setRequests(Array.isArray(res.data) ? res.data : []))
      .catch((error) => {
        Swal.fire("Error", error?.response?.data?.message || "Failed to load creator requests", "error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const review = async (id, status) => {
    const prompt = await Swal.fire({
      title: status === "approved" ? "Approve Request?" : "Reject Request?",
      input: "textarea",
      inputPlaceholder: "Optional review note",
      showCancelButton: true,
      confirmButtonText: status === "approved" ? "Approve" : "Reject",
      confirmButtonColor: status === "approved" ? "#10b981" : "#ef4444",
      background: "#0a0f1c",
      color: "#fff",
    });

    if (!prompt.isConfirmed) return;

    try {
      await axiosSecure.patch(`/admin/creator-requests/${id}`, {
        status,
        reviewNote: prompt.value || "",
      });
      setSelected(null);
      load();
      Swal.fire("Updated", `Request ${status}`, "success");
    } catch (error) {
      Swal.fire("Error", error?.response?.data?.message || "Review failed", "error");
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
    <section className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white">Creator Application <span className="text-primary">Review</span></h2>
        <p className="text-slate-500 mt-1">{requests.length} request(s) found</p>
      </div>

      <div className="bg-[#0a0f1c]/60 border border-slate-800 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="p-5 text-xs uppercase tracking-widest text-slate-500">Applicant</th>
              <th className="p-5 text-xs uppercase tracking-widest text-slate-500">Experience</th>
              <th className="p-5 text-xs uppercase tracking-widest text-slate-500">Status</th>
              <th className="p-5 text-xs uppercase tracking-widest text-slate-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {requests.map((r) => (
              <tr key={r._id} className="hover:bg-white/5">
                <td className="p-5">
                  <p className="font-bold text-white">{r.fullName}</p>
                  <p className="text-xs text-slate-500">{r.email}</p>
                </td>
                <td className="p-5 text-slate-300">{r.experience}</td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                    r.status === "approved"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : r.status === "rejected"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex justify-center gap-2">
                    <button className="btn btn-sm" onClick={() => setSelected(r)}><FiEye /></button>
                    {r.status === "pending" && (
                      <>
                        <button className="btn btn-sm btn-success" onClick={() => review(r._id, "approved")}><FiCheck /></button>
                        <button className="btn btn-sm btn-error" onClick={() => review(r._id, "rejected")}><FiX /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-black/70"
            />
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-8 space-y-4"
            >
              <h3 className="text-2xl font-black text-white">{selected.fullName}</h3>
              <p className="text-slate-400 text-sm">{selected.email}</p>
              <Info title="Portfolio" value={selected.portfolio} />
              <Info title="Skills" value={selected.skills} />
              <Info title="Experience" value={selected.experience} />
              <Info title="Motivation" value={selected.motivation} />
              {selected.reviewNote && <Info title="Review Note" value={selected.reviewNote} />}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Info = ({ title, value }) => (
  <div>
    <p className="text-xs uppercase tracking-widest text-slate-500">{title}</p>
    <p className="text-slate-200 mt-1 break-words">{value || "-"}</p>
  </div>
);

export default ManageCreatorRequests;
