import React from "react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa6";
import Logo from "./Logo";
import { Link } from "react-router";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Dark Navy Background Overlay */}
      <div className="absolute inset-0 bg-[#0a0f1c]"></div>
      
      {/* Subtle Gradient Glow for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5"></div>

      <div className="relative backdrop-blur border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center gap-5"
          >
            {/* Logo */}
            <Link to="/" className="hover:scale-105 transition-transform duration-300">
              <Logo />
            </Link>

            {/* Tagline */}
            <p className="text-sm md:text-base max-w-2xl text-slate-400 leading-relaxed">
              SkillSpire is a modern contest creation platform where creativity,
              innovation, and competition come together. Create contests,
              participate, win rewards, and showcase your talent to the world.
            </p>

            {/* Divider Animation */}
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 96 }} // 96px = w-24
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-[2px] bg-primary rounded-full"
            ></motion.div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <motion.a
                whileHover={{ y: -5 }}
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center
                           bg-slate-800 text-white shadow hover:shadow-primary/20 hover:bg-primary
                           hover:text-secondary transition-all duration-300 border border-slate-700"
              >
                <FaFacebookF />
              </motion.a>

              <motion.a
                whileHover={{ y: -5 }}
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center
                           bg-slate-800 text-white shadow hover:shadow-primary/20 hover:bg-primary
                           hover:text-secondary transition-all duration-300 border border-slate-700"
              >
                <FaLinkedinIn />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/50 py-4 text-center text-sm text-slate-500">
          © 2025 <span className="font-semibold text-slate-300">SkillSpire</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;