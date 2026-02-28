import React, { useEffect, useState } from "react";
import axiosPublic from "../../../api/axiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router";
import { FiEdit3, FiTrash2, FiUsers, FiInbox, FiClock, FiCheckCircle } from "react-icons/fi";
import axiosSecure from "../../../api/axiosSecure";

const MyContests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchContests = async () => {
      setLoading(true);
      try {
        // We fetch contests filtered by the creator's email
        const res = await axiosPublic.get("/contests", { 
          params: { creatorEmail: user.email } 
        });
        
        // Sorting by ID (newest first)
        const sorted = [...res.data].sort((a, b) => b._id.localeCompare(a._id));
        setContests(sorted);
      } catch (error) {
        Swal.fire({ 
          icon: "error", 
          title: "Fetch Failed", 
          text: "Could not load your contests.",
          background: "#0a0f1c", 
          color: "#fff" 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [user?.email]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete contest?",
      text: "This action will permanently remove the arena and all participant data.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      background: "#0a0f1c",
      color: "#fff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#1e293b",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/contests/${id}`);
        setContests((prev) => prev.filter((c) => c._id !== id));
        Swal.fire({ title: "Deleted!", icon: "success", background: "#0a0f1c", color: "#fff", timer: 1000, showConfirmButton: false });
      } catch (err) {
        Swal.fire("Error", "Check if this contest has active participants before deleting.", "error");
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 font-medium">Calculating participant data...</p>
    </div>
  );

  // ... (No Contests UI remains the same)

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">My <span className="text-primary">Arenas</span></h2>
          <p className="text-slate-500 text-sm mt-1 font-bold">Real-time engagement tracking</p>
        </div>
        <Link to="/dashboard/add-contest" className="bg-white text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all text-center">
          + New Contest
        </Link>
      </header>

      <div className="overflow-hidden bg-[#0a0f1c]/50 border border-slate-800 rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="p-6 text-[10px] uppercase text-slate-500 font-black">Contest Info</th>
                <th className="p-6 text-[10px] uppercase text-slate-500 font-black text-center">Status</th>
                <th className="p-6 text-[10px] uppercase text-slate-500 font-black text-center whitespace-nowrap">Real Participants</th>
                <th className="p-6 text-[10px] uppercase text-slate-500 font-black text-center">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {contests.map((contest) => (
                <tr key={contest._id} className="hover:bg-white/[0.02] group transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 hidden sm:block">
                        <img src={contest.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-primary transition-colors">{contest.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{contest.type}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-6 text-center">
                    <div className="flex justify-center">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${
                        contest.status === "pending" 
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {contest.status === "pending" ? <FiClock /> : <FiCheckCircle />}
                        {contest.status}
                      </span>
                    </div>
                  </td>

                  {/* REAL PARTICIPANTS COUNTER */}
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner group-hover:border-primary/30 transition-all">
                      <FiUsers className="text-primary animate-pulse" />
                      <span className="text-white font-black text-lg">
                        {contest.participants || 0}
                      </span>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="flex items-center justify-center gap-2">
                      {contest.status === "pending" ? (
                        <>
                          <Link to={`/dashboard/edit/${contest._id}`} className="p-3 bg-slate-800 text-slate-400 hover:bg-primary hover:text-white rounded-xl transition-all border border-slate-700">
                            <FiEdit3 size={16} />
                          </Link>
                          <button onClick={() => handleDelete(contest._id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border border-red-500/20 transition-all">
                            <FiTrash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => navigate(`/dashboard/submissions?contestId=${contest._id.toString()}`)}
                          className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest bg-primary text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/20"
                        >
                          Review Submissions
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyContests;