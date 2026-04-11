import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";

const CreatorPage = () => {
  const { user } = useAuth();

  const ctaLink = user ? "/dashboard/apply-creator" : "/login";
  const ctaText = user ? "Apply Now" : "Login To Apply";

  return (
    <section className="min-h-screen bg-[#060b18] text-white relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute top-24 -right-32 w-[28rem] h-[28rem] bg-cyan-500/10 blur-[130px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="uppercase tracking-[0.25em] text-primary text-xs font-black mb-4">
            Creator Program
          </p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            Build Challenges.
            <span className="block text-primary">Lead The Arena.</span>
          </h1>
          <p className="mt-6 text-slate-300 text-lg leading-relaxed max-w-2xl">
            Become a SkillSpire creator and launch high-impact contests for designers,
            developers, writers, and marketers. You set the standard. The community competes.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to={ctaLink}
              className="btn btn-primary px-8 h-12 rounded-2xl font-black text-slate-900 shadow-xl shadow-primary/20"
            >
              {ctaText}
            </Link>
            <Link
              to="/all-contests"
              className="btn btn-outline border-slate-500/50 text-white hover:bg-white hover:text-slate-900 h-12 rounded-2xl px-8"
            >
              Explore Active Contests
            </Link>
          </div>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <FeatureCard
            index={0}
            title="Create Premium Contests"
            text="Design challenge formats, define task rules, and offer meaningful rewards."
          />
          <FeatureCard
            index={1}
            title="Review Submissions"
            text="Access participant submissions and choose winners with transparent criteria."
          />
          <FeatureCard
            index={2}
            title="Grow Your Reputation"
            text="Build authority as a creator and attract skilled talent to your challenge ecosystem."
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ title, text, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.12, duration: 0.45 }}
    className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-7 hover:border-primary/50 transition-all"
  >
    <h3 className="text-2xl font-black mb-3 text-white">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{text}</p>
  </motion.div>
);

export default CreatorPage;
