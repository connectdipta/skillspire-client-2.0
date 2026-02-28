import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axiosSecure from "../../api/axiosSecure";
import {
  FaUsers,
  FaTrophy,
  FaClipboardList,
  FaShieldAlt,
  FaRocket,
  FaChartLine,
  FaCrown,
} from "react-icons/fa";
import { motion } from "framer-motion";

const DashboardHome = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);

  useEffect(() => {
    axiosSecure
      .get("/users/me")
      .then((res) => setRole(res.data.role))
      .catch(() => setRole("user"));
  }, []);

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-slate-500 animate-pulse">
          Preparing your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">

      {/* ================= HERO ================= */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] p-12 bg-gradient-to-br from-primary/90 via-indigo-500 to-secondary text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
      >
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Welcome back,{" "}
            {user?.displayName?.split(" ")[0] || "Champion"} 👋
          </h2>

          <p className="max-w-xl text-white/90 text-lg">
            Your SkillSpire command center is live. Monitor growth,
            manage contests, and dominate the leaderboard.
          </p>
        </div>

        {/* glowing shapes */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-300/20 blur-3xl rounded-full"></div>
      </motion.div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<FaChartLine />} title="Performance" value="+24%" subtitle="Growth this month" />
        <StatCard icon={<FaUsers />} title="Creators Online" value="1.2k" subtitle="Global community" />
        <StatCard icon={<FaTrophy />} title="Prize Pool" value="$25,000" subtitle="Live rewards" />
      </div>

      {/* ================= ROLE CONTENT ================= */}
      <div>
        {role === "user" && <UserDashboard />}
        {role === "creator" && <CreatorDashboard />}
        {role === "admin" && <AdminDashboard />}
      </div>

      {/* ================= MOTIVATION ================= */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative group bg-gradient-to-br from-[#0a0f1c] to-[#111827] border border-slate-800 rounded-[2.5rem] p-12 text-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-primary/5 blur-3xl"></div>

        <FaRocket className="text-6xl text-primary mx-auto mb-6 group-hover:rotate-12 transition-transform" />

        <h3 className="text-3xl font-black text-white mb-4">
          Ready for your next victory?
        </h3>

        <p className="text-slate-400 max-w-xl mx-auto text-lg">
          Every challenge improves your reputation. Compete, win,
          and let the world notice your skills.
        </p>
      </motion.div>
    </div>
  );
};

/* ================= USER ================= */

const UserDashboard = () => (
  <Section title="Your Activity Hub" color="bg-primary">
    <ActionCard icon={<FaClipboardList />} title="Joined Contests" text="Track contests you joined." />
    <ActionCard icon={<FaCrown className="text-yellow-400" />} title="Achievements" text="View your wins & rankings." />
    <ActionCard icon={<FaUsers />} title="Competitors" text="Explore global talent." />
  </Section>
);

/* ================= CREATOR ================= */

const CreatorDashboard = () => (
  <Section title="Creator Command Center" color="bg-secondary">
    <ActionCard icon={<FaClipboardList />} title="My Contests" text="Manage hosted competitions." />
    <ActionCard icon={<FaUsers />} title="Submissions" text="Review participants work." />
    <ActionCard icon={<FaTrophy />} title="Select Winners" text="Finalize results easily." />
  </Section>
);

/* ================= ADMIN ================= */

const AdminDashboard = () => (
  <Section title="System Control Panel" color="bg-indigo-500">
    <ActionCard icon={<FaShieldAlt />} title="Permissions" text="Manage access levels." />
    <ActionCard icon={<FaUsers />} title="Users" text="Control platform members." />
    <ActionCard icon={<FaClipboardList />} title="Moderation" text="Approve or reject contests." />
  </Section>
);

/* ================= SECTION WRAPPER ================= */

const Section = ({ title, color, children }) => (
  <section className="space-y-6">
    <div className="flex items-center gap-3">
      <div className={`h-8 w-1.5 ${color} rounded-full`} />
      <h3 className="text-2xl font-black text-white">{title}</h3>
    </div>

    <div className="grid md:grid-cols-3 gap-6">{children}</div>
  </section>
);

/* ================= CARDS ================= */

const StatCard = ({ icon, title, value, subtitle }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-gradient-to-br from-slate-900/60 to-slate-900/30 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-xl"
  >
    <div className="text-2xl text-primary mb-4">{icon}</div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
      {title}
    </p>
    <h4 className="text-4xl font-black text-white my-1">{value}</h4>
    <p className="text-xs text-slate-400">{subtitle}</p>
  </motion.div>
);

const ActionCard = ({ icon, title, text }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="group bg-[#0a0f1c] border border-slate-800 rounded-3xl p-8 cursor-pointer transition-all hover:border-primary/40 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)]"
  >
    <div className="text-4xl text-primary/80 group-hover:text-primary mb-5 transition">
      {icon}
    </div>
    <h4 className="text-xl font-black text-white mb-2">{title}</h4>
    <p className="text-slate-400 text-sm">{text}</p>
  </motion.div>
);

export default DashboardHome;