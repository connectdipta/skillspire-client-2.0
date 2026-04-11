import React, { useEffect, useState } from "react";
import axiosPublic from "../../../api/axiosSecure";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { FiCalendar, FiUsers, FiAward, FiArrowRight } from "react-icons/fi";

const normalizeId = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (value.$oid) return value.$oid;
    if (typeof value.toHexString === "function") return value.toHexString();
    if (typeof value.toString === "function") {
      const parsed = value.toString();
      if (parsed && parsed !== "[object Object]") return parsed;
    }
  }
  return null;
};

const ParticipatedContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const meRes = await axiosPublic.get("/users/me");
        const ids = (meRes.data?.participatedContests || [])
          .map(normalizeId)
          .filter(Boolean);

        if (!ids.length) {
          setContests([]);
          return;
        }

        // Fetching contest details in parallel
        const contestData = await Promise.all(
          ids.map(id =>
            axiosPublic.get(`/contests/${id}`)
              .then(res => res.data)
              .catch(() => null) // Ignore failed individual fetches
          )
        );

        setContests(contestData.filter(c => c !== null));
      } catch (err) {
        console.error("Error fetching participated contests:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-slate-500 animate-pulse font-medium">Retrieving your entries...</p>
      </div>
    );
  }

  if (!contests.length) {
    return (
      <div className="text-center py-32 bg-slate-900/20 rounded-[2.5rem] border border-dashed border-slate-800">
        <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAward className="text-slate-500 text-4xl" />
        </div>
        <h3 className="text-2xl font-black text-white">No Arena Entries Found</h3>
        <p className="text-slate-400 mt-2 max-w-sm mx-auto">
          You haven't stepped into any contests yet. The spire is waiting for your talent!
        </p>
        <Link to="/all-contests" className="btn btn-primary mt-8 px-8 rounded-xl font-black">
          Browse Contests
        </Link>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-white">
            My <span className="text-primary">Participations</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">
            Tracking {contests.length} active entries
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {contests.map((contest, index) => {
          const deadlinePassed = new Date(contest.deadline) < new Date();

          return (
            <motion.div
              key={contest._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-[#0a0f1c] border border-slate-800 hover:border-primary/40 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full shadow-2xl"
            >
              {/* IMAGE HEADER */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={contest.image}
                  alt={contest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] to-transparent opacity-80" />
                
                <span
                  className={`absolute top-4 right-4 px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-lg backdrop-blur-md border ${
                    deadlinePassed 
                      ? "bg-red-500/20 text-red-400 border-red-500/30" 
                      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  }`}
                >
                  {deadlinePassed ? "Ended" : "Active Now"}
                </span>
              </div>

              {/* BODY CONTENT */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors line-clamp-1">
                  {contest.name}
                </h3>

                <p className="text-slate-400 text-sm mt-3 line-clamp-2 leading-relaxed">
                  {contest.description}
                </p>

                {/* STATS ROW */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-800/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Prize Pool</span>
                    <span className="text-lg font-black text-primary">${contest.prize}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Competitors</span>
                    <div className="flex items-center gap-1.5 text-slate-200 font-bold justify-end">
                      <FiUsers className="text-primary" /> {contest.participants}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-500 font-bold bg-slate-900/50 p-2.5 rounded-xl">
                  <FiCalendar className="text-primary" />
                  Ends: {new Date(contest.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>

                <Link
                  to={`/contests/${contest._id}`}
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-slate-800 hover:bg-primary hover:text-slate-900 text-white rounded-2xl font-black text-sm transition-all duration-300 group/btn"
                >
                  Enter Details
                  <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ParticipatedContests;