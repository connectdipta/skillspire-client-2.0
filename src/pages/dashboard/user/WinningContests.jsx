import React, { useEffect, useState } from "react";
import axiosPublic from "../../../api/axiosPublic";
import axiosSecure from "../../../api/axiosSecure";
import { motion } from "framer-motion";
import { FiAward, FiDollarSign, FiCalendar, FiArrowRight, FiZap } from "react-icons/fi";
import { Link } from "react-router";

const WinningContests = () => {
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWins = async () => {
      try {
        // 1. Fetch the user profile to get the list of Won Contest IDs
        const meRes = await axiosSecure.get("/users/me");
        const contestIds = meRes.data?.wonContests || [];

        if (contestIds.length === 0) {
          setWins([]);
          setLoading(false);
          return;
        }

        // 2. Map through IDs and fetch full details for each contest
        const contestPromises = contestIds.map(id =>
          axiosPublic.get(`/contests/${id}`)
            .then(res => res.data)
            .catch(() => null) // Handle cases where a contest might have been deleted
        );

        const results = await Promise.all(contestPromises);
        
        // 3. Filter out nulls and sort by deadline (newest wins first)
        const validContests = results.filter(c => c !== null);
        setWins(validContests.sort((a, b) => new Date(b.deadline) - new Date(a.deadline)));
      } catch (error) {
        console.error("Victory Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWins();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing Hall of Fame...</p>
    </div>
  );

  if (!wins.length) return (
    <div className="text-center py-24 bg-[#0a0f1c]/50 border-2 border-dashed border-slate-800 rounded-[3rem]">
      <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiAward className="text-slate-700 text-4xl" />
      </div>
      <h3 className="text-2xl font-black text-white">No Victories Yet</h3>
      <p className="text-slate-500 mt-2 max-w-xs mx-auto">
        The podium is empty for now. Keep honing your skills and enter more challenges to claim your first trophy!
      </p>
      <Link to="/all-contests" className="btn btn-primary mt-8 rounded-2xl px-8 font-black uppercase tracking-tighter">
        Find a Contest <FiZap />
      </Link>
    </div>
  );

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-4xl font-black text-white">My <span className="text-emerald-400">Victories</span></h2>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-2">Your hall of fame achievements</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {wins.map((contest, index) => (
          <motion.div
            key={contest._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-[#0a0f1c] border border-emerald-500/20 p-8 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/50 transition-all shadow-2xl shadow-emerald-500/5"
          >
            {/* Aesthetic Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full group-hover:bg-emerald-500/20 transition-all"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                  <FiAward className="text-emerald-400 text-3xl" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-lg border border-emerald-400/20">
                    Champion
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-black text-white mb-2 group-hover:text-emerald-400 transition-colors leading-tight">
                {contest.name}
              </h3>
              
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-800/50">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Prize Earned</p>
                  <div className="flex items-center gap-1 text-xl font-black text-white">
                    <FiDollarSign className="text-emerald-400" />
                    {contest.prize}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Won Date</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                    <FiCalendar className="text-emerald-400" />
                    {new Date(contest.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <Link 
                to={`/contests/${contest._id}`} 
                className="mt-8 w-full flex items-center justify-between group/btn py-4 px-6 bg-slate-900/50 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                View Winning Entry
                <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WinningContests;