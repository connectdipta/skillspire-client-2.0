import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import axiosSecure from "../../../api/axiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { FiAward, FiEye, FiArrowLeft, FiInbox, FiUser, FiExternalLink, FiSearch, FiClock } from "react-icons/fi";

const Submissions = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const contestId = searchParams.get("contestId");

  const [contests, setContests] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const hasWinner = submissions.some(sub => sub.isWinner);

  /* ================= LOAD CREATOR CONTESTS ================= */
  useEffect(() => {
    if (!user?.email) return;
    axiosSecure
      .get("/contests", { params: { creatorEmail: user.email } })
      .then(res => setContests(res.data));
  }, [user?.email]);

  /* ================= LOAD & SORT SUBMISSIONS ================= */
  useEffect(() => {
    if (!contestId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axiosSecure
      .get("/submissions", { params: { contestId } })
      .then(res => {
        const sortedSubmissions = [...res.data].sort((a, b) => {
          // 1. Winners always stay at the very top
          if (a.isWinner !== b.isWinner) return a.isWinner ? -1 : 1;
          
          // 2. Sort by newest ID (MongoDB IDs naturally contain a timestamp)
          // This ensures the task submitted most recently shows first
          return b._id.localeCompare(a._id);
        });
        setSubmissions(sortedSubmissions);
      })
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, [contestId]);

  /* ================= DECLARE WINNER ================= */
  const declareWinner = async (submissionId) => {
    const confirm = await Swal.fire({
      title: "Confirm Winner?",
      text: "This will reward the participant and close the selection.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Declare Winner",
      background: "#0a0f1c",
      color: "#fff",
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#1e293b",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/submissions/${submissionId}/winner`);
      Swal.fire({ icon: "success", title: "Champion Selected!", background: "#0a0f1c", color: "#fff" });
      
      const res = await axiosSecure.get("/submissions", { params: { contestId } });
      const sorted = res.data.sort((a, b) => {
          if (a.isWinner !== b.isWinner) return a.isWinner ? -1 : 1;
          return b._id.localeCompare(a._id);
      });
      setSubmissions(sorted);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to update.", background: "#0a0f1c", color: "#fff" });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 font-medium">Fetching submissions...</p>
    </div>
  );

  /* ================= VIEW 1: SELECT CONTEST ================= */
  if (!contestId) {
    return (
      <div className="space-y-8">
        <header>
          <h2 className="text-3xl md:text-4xl font-black text-white">Review <span className="text-primary">Submissions</span></h2>
          <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-widest">Select an arena to grade participants</p>
        </header>

        {!contests.length ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-[2.5rem]">
             <FiInbox className="text-slate-700 text-5xl mx-auto mb-4" />
             <p className="text-slate-400">No active contests found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map(contest => (
              <div key={contest._id} className="group bg-[#0a0f1c]/50 border border-slate-800 p-6 rounded-[2rem] hover:border-primary/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                     <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-800 text-slate-400 rounded-lg">{contest.type}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2">{contest.name}</h3>
                  <div className="flex items-center gap-2 mt-3 mb-6">
                    <FiUser className="text-slate-500" />
                    <span className="text-slate-400 text-sm font-bold">{contest.submissionsCount || 0} Submissions</span>
                  </div>
                </div>
                <button
                  onClick={() => setSearchParams({ contestId: contest._id.toString() })}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  <FiEye /> Inspect Tasks
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ================= VIEW 2: SUBMISSIONS LIST ================= */
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button onClick={() => setSearchParams({})} className="flex items-center gap-2 text-slate-500 hover:text-primary mb-2 transition-colors text-xs font-black uppercase tracking-widest">
            <FiArrowLeft /> Back to Arenas
          </button>
          <h2 className="text-3xl font-black text-white">Task <span className="text-primary">Review</span></h2>
        </div>
        <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-sm font-bold text-slate-400 italic">
          {submissions.length} Total entries for this challenge
        </div>
      </header>

      {!submissions.length ? (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-[2.5rem]">
           <FiSearch className="text-slate-700 text-5xl mx-auto mb-4" />
           <p className="text-slate-400">No tasks have been submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {submissions.map((sub, index) => {
            // HIGHLIGHT LOGIC: The newest item (index 0) that isn't already a winner
            const isNewest = index === 0 && !sub.isWinner;

            return (
              <div
                key={sub._id}
                className={`relative overflow-hidden p-6 md:p-8 rounded-[2rem] border transition-all duration-500 ${
                  sub.isWinner
                    ? "border-emerald-500 bg-emerald-950/20 shadow-[0_0_40px_-15px_rgba(16,185,129,0.3)]"
                    : isNewest 
                      ? "border-primary bg-primary/10 shadow-[0_0_30px_-15px_rgba(59,130,246,0.3)]" // Highlighted Background
                      : "bg-[#0a0f1c]/50 border-slate-800"
                }`}
              >
                {isNewest && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/20 px-3 py-1 rounded-md border border-primary/30">
                    <FiClock /> New Submission
                  </div>
                )}

                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                      {/* IDENTITY FIX: Displaying image if available, else letter fallback */}
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 flex items-center justify-center shadow-inner">
                        {sub.participantImage || sub.photo || sub.userPhoto ? (
                          <img src={sub.participantImage || sub.photo || sub.userPhoto} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-primary font-bold text-2xl">
                            {(sub.participantName || sub.userName || sub.name || "A")[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        {/* IDENTITY FIX: Displaying name from common field names */}
                        <p className="text-white font-bold text-xl">
                          {sub.participantName || sub.userName || sub.name || "Anonymous Participant"}
                        </p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">{sub.userEmail || sub.participantEmail}</p>
                      </div>
                    </div>

                    <div className={`p-5 rounded-2xl border ${
                      sub.isWinner ? "bg-emerald-900/20 border-emerald-500/30" : "bg-slate-950/50 border-slate-800/50"
                    }`}>
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap flex items-start gap-2">
                         <FiExternalLink className={`mt-1 flex-shrink-0 ${sub.isWinner ? "text-emerald-400" : "text-primary"}`} />
                         <a href={sub.content} target="_blank" rel="noreferrer" className="hover:underline break-all font-medium">
                           {sub.content}
                         </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {sub.isWinner ? (
                      <div className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-emerald-500/20">
                        <FiAward className="text-lg" /> Champion
                      </div>
                    ) : (
                      <button
                        disabled={hasWinner}
                        onClick={() => declareWinner(sub._id)}
                        className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                          hasWinner 
                          ? "bg-slate-800 text-slate-600 cursor-not-allowed opacity-50" 
                          : "bg-white text-black hover:bg-primary hover:text-white hover:-translate-y-1 active:scale-95 shadow-xl shadow-white/5"
                        }`}
                      >
                        <FiAward /> {hasWinner ? "Locked" : "Declare Winner"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Submissions;