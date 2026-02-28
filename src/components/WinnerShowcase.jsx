import React, { useEffect, useState } from "react";
import { FaTrophy, FaUsers, FaDollarSign } from "react-icons/fa";
import axiosPublic from "../api/axiosPublic";
import userProfile from "../assets/userProfile.png";
import { motion } from "framer-motion";

const WinnerShowcase = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadWinners = async () => {
      try {
        const res = await axiosPublic.get("/winners");
        // Slice to ensure only 6 winners are shown
        setWinners(res.data?.slice(0, 6) || []);
      } catch (err) {
        console.error("Failed to load winners", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadWinners();
  }, []);

  return (
    <section className="py-24 bg-[#0a0f1c] relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-primary/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-black text-white">
            🏆 Our Recent <span className="text-primary">Champions</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-lg">
            SkillSpire rewards excellence. Join the ranks of our top performers and turn your talent into triumph.
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20" data-aos="fade-up">
          <StatCard icon={<FaUsers />} title="1,200+" subtitle="Participants" />
          <StatCard icon={<FaTrophy />} title={winners.length === 6 ? "6" : winners.length} subtitle="Top Winners" />
          <StatCard icon={<FaDollarSign />} title="$25,000+" subtitle="Prize Money" />
        </div>

        {/* ================= WINNERS GRID ================= */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-900/50 animate-pulse rounded-[2rem]"></div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-error bg-error/10 py-4 rounded-xl">Failed to load winners. Please try again later.</p>
        ) : winners.length === 0 ? (
          <p className="text-center text-slate-500 py-10">No winners announced yet. Be the first!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {winners.map((winner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 text-center hover:border-primary/40 transition-all duration-500"
              >
                {/* Winner Rank Badge */}
                <div className="absolute top-4 right-6 text-primary/20 group-hover:text-primary transition-colors font-black text-4xl">
                  #{index + 1}
                </div>

                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-0 group-hover:scale-110 transition-transform duration-500"></div>
                  <img
                    src={winner.photo || userProfile}
                    alt={winner.name}
                    className="relative w-28 h-28 mx-auto rounded-full object-cover border-4 border-slate-800 group-hover:border-primary transition-all duration-500"
                  />
                </div>

                <h3 className="text-2xl font-bold mt-6 text-white group-hover:text-primary transition-colors">
                  {winner.name || "Champion"}
                </h3>

                <p className="text-slate-400 mt-2">
                  Won <span className="text-slate-200 font-semibold">{winner.contest}</span>
                </p>

                <div className="mt-6">
                  <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-2xl font-bold border border-primary/20 group-hover:bg-primary group-hover:text-slate-900 transition-all duration-300">
                    💰 ${winner.prize} Reward
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ================= CTA ================= */}
        <div className="mt-20 text-center" data-aos="zoom-in">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-12 rounded-[3rem] border border-white/5 backdrop-blur-sm">
            <h3 className="text-3xl font-black mb-4 text-white">
              Ready to Claim Your <span className="text-primary">Spot?</span> 🚀
            </h3>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto text-lg">
              The next champion could be you. Browse the latest contests and start your journey today.
            </p>
            <a
              href="/all-contests"
              className="btn btn-primary btn-lg rounded-2xl px-12 font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Explore All Contests
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ================= REUSABLE STAT CARD ================= */
const StatCard = ({ icon, title, subtitle }) => (
  <div className="bg-slate-900/30 border border-slate-800 rounded-[2rem] p-8 text-center group hover:bg-slate-800/40 transition-all">
    <div className="text-5xl text-primary/40 group-hover:text-primary mb-4 flex justify-center transition-colors">
      {icon}
    </div>
    <h3 className="text-4xl font-black text-white tracking-tighter">{title}</h3>
    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">{subtitle}</p>
  </div>
);

export default WinnerShowcase;