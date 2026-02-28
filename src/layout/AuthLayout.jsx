import React from "react";
import { Link, Outlet } from "react-router";
import Logo from "../components/Logo";
import authImg from "../assets/authImage.png";
import { motion } from "framer-motion";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-[#0B1120] text-slate-200 selection:bg-primary/30">
      
      {/* ================= LEFT SECTION (FORM) ================= */}
      <div className="flex-1 flex flex-col relative z-10">
        
        {/* Logo Header */}
        <header className="px-8 pt-8 md:px-12 md:pt-10">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
             <Logo />
          </Link>
        </header>

        {/* Central Form Area */}
        <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-[440px]"
          >
            {/* The "Shrinked" Card Effect */}
            <div className="bg-[#111827]/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-800/50 ring-1 ring-white/5">
              <Outlet />
            </div>
          </motion.div>
        </main>

        {/* Subtle Bottom Glow */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      </div>

      {/* ================= RIGHT SECTION (ILLUSTRATION) ================= */}
      <div className="relative flex-1 hidden lg:flex items-center justify-center overflow-hidden bg-[#0F172A]">
        
        {/* Deep Atmospheric Gradients */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]"></div>

        {/* Illustration Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 w-full flex justify-center"
        >
          {/* Floating Image Effect */}
          <motion.img
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            src={authImg}
            alt="SkillSpire Contests"
            className="w-[80%] max-w-lg drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          />
        </motion.div>

        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>
    </div>
  );
};

export default AuthLayout;