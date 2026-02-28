import React from 'react';
import logo from '../assets/logo.png';

const Logo = () => {
  return (
    <div className="inline-flex items-center gap-3 active:scale-95 transition-all duration-200 cursor-pointer group">
      
      {/* Icon Container */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-yellow-400/20 blur-lg rounded-full 
                        group-hover:bg-yellow-400/40 transition-all"></div>

        {/* Logo box */}
        <div className="relative w-10 h-10 rounded-xl bg-yellow-400 
                        flex items-center justify-center
                        shadow-[0_0_15px_rgba(250,204,21,0.3)]
                        group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]
                        transition-all overflow-hidden">
          <img
            src={logo}
            alt="SkillSpire Logo"
            className="w-7 h-7 object-contain 
                       group-hover:rotate-12 
                       transition-transform duration-300"
          />
        </div>
      </div>

      {/* Text Branding */}
      <h3 className="text-2xl md:text-3xl font-black tracking-tighter">
        {/* Auto theme color */}
        <span className="text-zinc-600 group-hover:text-yellow-400 transition-colors duration-300">
          Skill
        </span>
        <span className="text-yellow-400">
          Spire
        </span>
      </h3>

    </div>
  );
};

export default Logo;