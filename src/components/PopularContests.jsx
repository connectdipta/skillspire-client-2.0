import React, { useEffect, useState } from "react";
import axiosPublic from "../api/axiosPublic";
import ContestCard from "./ContestCard";
import { Link } from "react-router";
import { motion } from "framer-motion";

const PopularContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosPublic
      .get("/contests", {
        params: {
          sort: "participants",
          limit: 5,
        },
      })
      .then((res) => {
        // Fallback slice in case the API returns more
        setContests(res.data.slice(0, 5));
      })
      .catch((err) => {
        console.error("Failed to load contests", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0a0f1c] min-h-[400px] flex flex-col items-center justify-center gap-4">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-slate-400 font-medium animate-pulse text-lg">
          Scouting popular contests...
        </p>
      </div>
    );
  }

  return (
    <section className="py-24 bg-[#0a0f1c] relative overflow-hidden">
      {/* Decorative radial gradient for that 'premium' feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-primary/5 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* ================= HEADER ================= */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            🔥 Popular <span className="text-primary">Contests</span>
          </h2>

          <p className="mt-6 text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            The arena is heating up. These are the most active challenges 
            where creators like you are pushing boundaries right now.
          </p>
        </div>

        {/* ================= GRID ================= */}
        {/* Flex wrap used for the 5-item layout to keep them centered */}
        <div className="flex flex-wrap justify-center gap-8">
          {contests.map((contest, index) => (
            <motion.div
              key={contest._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm"
            >
              <ContestCard contest={contest} />
            </motion.div>
          ))}
        </div>

        {/* ================= CTA ================= */}
        <div className="flex justify-center mt-20" data-aos="zoom-in">
          <Link
            to="/all-contests"
            className="group relative inline-flex items-center gap-3 px-10 py-4 
                       bg-primary text-slate-900 font-black rounded-2xl 
                       shadow-[0_0_20px_rgba(250,204,21,0.2)] 
                       hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] 
                       hover:scale-105 transition-all active:scale-95"
          >
            Explore the Spire
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularContests;