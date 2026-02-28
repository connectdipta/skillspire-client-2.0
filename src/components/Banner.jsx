import React, { useState, useMemo } from "react";
import { FiSearch, FiCode, FiCamera, FiMusic, FiPenTool, FiCpu, FiPieChart } from "react-icons/fi";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

const Banner = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/all-contests?search=${encodeURIComponent(query)}`);
  };

  // Use useMemo to prevent particles from resetting on every render
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,      // 0% to 100% (Left to Right)
      y: Math.random() * 100,      // 0% to 100% (Top to Bottom)
      size: Math.random() * 4 + 2, // Size 2px to 6px
      duration: Math.random() * 5 + 5, // Duration 5s to 10s (Faster to see movement)
      delay: Math.random() * 2,
    }));
  }, []);

  // Floating Icons Configuration
  const floatingIcons = [
    { Icon: FiCode, top: "15%", left: "10%", color: "text-cyan-400", size: "text-5xl" },
    { Icon: FiPenTool, top: "25%", left: "85%", color: "text-fuchsia-400", size: "text-6xl" },
    { Icon: FiCamera, top: "65%", left: "5%", color: "text-pink-400", size: "text-4xl" },
    { Icon: FiCpu, top: "75%", left: "80%", color: "text-emerald-400", size: "text-5xl" },
    { Icon: FiMusic, top: "10%", left: "50%", color: "text-yellow-300", size: "text-3xl" },
    { Icon: FiPieChart, top: "80%", left: "25%", color: "text-orange-400", size: "text-5xl" },
  ];

  return (
    <section className="relative w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-[#1e1b4b] to-slate-900 shadow-2xl my-8 border border-white/10">
      
      {/* ================= BACKGROUND LAYERS ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]"></div>

        {/* Grid Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,transparent,black)] transform perspective-[1000px] rotate-x-[30deg] scale-150"></div>

        {/*Particles Animation Logic */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              y: -100, // Move 100px Upwards
              opacity: [0, 0.8, 0], // Fade In -> Hold -> Fade Out
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
            className="absolute rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`, // Fixed starting position
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
          />
        ))}

        {/* Floating Icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            animate={{ 
              y: [0, -20, 0], 
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute ${item.color} ${item.size} opacity-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`}
            style={{ top: item.top, left: item.left }}
          >
            <item.Icon />
          </motion.div>
        ))}
      </div>

      {/* ================= FOREGROUND CONTENT ================= */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-28 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-sm font-semibold mb-6 backdrop-blur-md">
            🚀 Level Up Your Skills
          </span>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
            Discover & Compete in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 animate-gradient">
              Skill-Based Contests
            </span>
          </h1>

          <p className="mt-6 text-slate-300 max-w-2xl mx-auto text-lg md:text-xl font-light">
            Join exciting contests, showcase your talent, climb the leaderboard,
            and win amazing rewards on SkillSpire.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  onSubmit={handleSearch}
  className="
    mt-8 sm:mt-10
    flex flex-col sm:flex-row
    items-stretch sm:items-center
    gap-2
    max-w-2xl mx-auto
    p-2
    rounded-2xl sm:rounded-full
    bg-white/10 border border-white/20
    backdrop-blur-xl
    shadow-[0_0_40px_rgba(0,0,0,0.3)]
  "
>
  {/* Input Area */}
  <div className="flex-1 flex items-center px-3 sm:px-4">
    <FiSearch className="text-xl sm:text-2xl text-white/70 shrink-0" />

    <input
      type="text"
      placeholder="Search contests (e.g. Coding, Quiz)..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="
        w-full bg-transparent border-none
        text-white text-base sm:text-lg
        px-3 sm:px-4 py-3
        focus:outline-none focus:ring-0
        placeholder:text-white/50
      "
    />
  </div>

  {/* Button */}
  <button
    type="submit"
    className="
      w-full sm:w-auto
      px-6 sm:px-8
      py-3
      rounded-xl sm:rounded-full
      bg-gradient-to-r from-yellow-400 to-orange-500
      text-slate-900 font-bold
      text-base sm:text-lg
      shadow-lg
      hover:shadow-orange-500/50
      active:scale-95 sm:hover:scale-105
      transition-all duration-300
    "
  >
    Search
  </button>
</motion.form>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {["Coding",
  "Design",
  "Article Writing",
  "Photography",
  "Marketing",
  "Quiz"].map((tag) => (
            <button
              key={tag}
              onClick={() => navigate(`/all-contests?search=${tag}`)}
              className="px-5 py-2 rounded-full text-sm font-medium text-white bg-white/5 border border-white/10 hover:bg-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300"
            >
              {tag}
            </button>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Banner;