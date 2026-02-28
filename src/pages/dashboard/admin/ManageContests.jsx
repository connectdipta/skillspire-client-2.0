import React, { useEffect, useState } from "react";
import axiosPublic from "../../../api/axiosPublic";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiCheck, 
  FiX, 
  FiTrash2, 
  FiSearch, 
  FiEye, 
  FiCalendar, 
  FiDollarSign, 
  FiMail 
} from "react-icons/fi";

const ManageContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContest, setSelectedContest] = useState(null);

  // 1. Fetch and Sort Data (Newest First)
  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = () => {
    setLoading(true);
    axiosPublic
      .get("/admin/contests")
      .then((res) => {
        // Sort by ID descending (MongoDB IDs contain timestamps)
        const sortedData = [...res.data].sort((a, b) => b._id.localeCompare(a._id));
        setContests(sortedData);
      })
      .catch(() => 
        Swal.fire({ 
          icon: "error", 
          title: "Error", 
          text: "Failed to fetch registry", 
          background: "#0a0f1c", 
          color: "#fff" 
        })
      )
      .finally(() => setLoading(false));
  };

  // 2. Filter Logic (Derived from sorted contests)
  const filteredContests = contests.filter(c => {
    const nameMatch = c.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = c.creatorEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch;
  });

  // 3. Update Status Action
  const updateStatus = async (id, status) => {
    const confirm = await Swal.fire({
      title: "Change Status?",
      text: `Set this contest to "${status.toUpperCase()}"?`,
      icon: status === "confirmed" ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      background: "#0a0f1c",
      color: "#fff",
      confirmButtonColor: status === "confirmed" ? "#10b981" : "#fbbf24",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosPublic.patch(`/admin/contests/${id}/status`, { status });
      setContests((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      );
      setSelectedContest(null);
      Swal.fire({ 
        title: "Updated!", 
        icon: "success", 
        background: "#0a0f1c", 
        color: "#fff", 
        timer: 1000, 
        showConfirmButton: false 
      });
    } catch {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  // 4. Delete Action
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Permanently?",
      text: "This action will purge all contest data.",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Delete",
      background: "#0a0f1c",
      color: "#fff",
      confirmButtonColor: "#ef4444",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosPublic.delete(`/admin/contests/${id}`);
      setContests((prev) => prev.filter((c) => c._id !== id));
      setSelectedContest(null);
      Swal.fire({ 
        title: "Purged!", 
        icon: "success", 
        background: "#0a0f1c", 
        color: "#fff", 
        timer: 1000, 
        showConfirmButton: false 
      });
    } catch {
      Swal.fire("Error", "Deletion failed", "error");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Loading Arena Data...</p>
    </div>
  );

  return (
    <div className="space-y-8 relative">
      {/* Detail Modal */}
      <AnimatePresence>
        {selectedContest && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContest(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img src={selectedContest.image} alt="" className="w-full h-full object-cover opacity-60" />
                <button 
                  onClick={() => setSelectedContest(null)} 
                  className="absolute top-6 right-6 p-2 bg-black/50 text-white rounded-full hover:bg-white hover:text-black transition-all"
                >
                    <FiX size={20}/>
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-white">{selectedContest.name}</h3>
                  <p className="text-slate-400 mt-2 text-sm leading-relaxed">{selectedContest.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Prize Pool</p>
                    <p className="text-primary font-bold flex items-center gap-1"><FiDollarSign/> {selectedContest.prize}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Deadline</p>
                    <p className="text-white font-bold flex items-center gap-1"><FiCalendar/> {selectedContest.deadline}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                    {selectedContest.status === 'pending' && (
                        <button 
                          onClick={() => updateStatus(selectedContest._id, 'confirmed')} 
                          className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all flex items-center gap-2"
                        >
                            <FiCheck/> Approve
                        </button>
                    )}
                    <button 
                      onClick={() => handleDelete(selectedContest._id)} 
                      className="px-6 py-2 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                    >
                        <FiTrash2/> Delete
                    </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">Manage <span className="text-primary">Contests</span></h2>
          <p className="text-slate-500 text-sm mt-1 font-bold">
            {searchQuery ? `${filteredContests.length} Matches Found` : `${contests.length} Contests Total`}
          </p>
        </div>
        
        <div className="relative group w-full md:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search name or creator..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-sm rounded-2xl py-3 pl-12 pr-6 w-full focus:outline-none focus:border-primary text-white transition-all"
          />
        </div>
      </header>

      <div className="overflow-hidden bg-[#0a0f1c]/50 border border-slate-800 rounded-[2.5rem]">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="p-6 text-[10px] uppercase text-slate-500 font-black">Contest Details</th>
              <th className="p-6 text-[10px] uppercase text-slate-500 font-black text-center">Status</th>
              <th className="p-6 text-[10px] uppercase text-slate-500 font-black text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredContests.map((contest) => (
              <tr key={contest._id} className="hover:bg-white/5 group transition-colors">
                <td className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                            <img src={contest.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                            <p className="font-bold text-white group-hover:text-primary transition-colors">{contest.name}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <FiMail size={12}/> {contest.creatorEmail}
                            </p>
                        </div>
                    </div>
                </td>
                <td className="p-6 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border transition-all ${
                      contest.status === "pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      contest.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>{contest.status}</span>
                </td>
                <td className="p-6">
                    <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedContest(contest)}
                          className="p-2.5 bg-slate-800 text-slate-400 hover:bg-primary hover:text-white rounded-xl transition-all border border-slate-700"
                          title="View Details"
                        >
                          <FiEye size={18} />
                        </button>
                        
                        {contest.status === "pending" && (
                            <button 
                              onClick={() => updateStatus(contest._id, "confirmed")} 
                              className="p-2.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl border border-emerald-500/20 transition-all"
                              title="Approve"
                            >
                              <FiCheck/>
                            </button>
                        )}
                        <button 
                          onClick={() => handleDelete(contest._id)} 
                          className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border border-red-500/20 transition-all"
                          title="Delete"
                        >
                          <FiTrash2/>
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredContests.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-slate-500 font-medium italic">No matches found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageContests;