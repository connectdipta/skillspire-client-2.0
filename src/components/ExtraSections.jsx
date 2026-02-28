import React from "react";
import {
  FaUserCheck,
  FaUpload,
  FaMoneyBillWave,
  FaStar,
  FaShieldAlt,
  FaGlobe,
  FaRocket,
} from "react-icons/fa";
import { motion } from "framer-motion";

const ExtraSections = () => {
  return (
    <div className="space-y-24 mb-20">
      {/* ================= HOW IT WORKS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center mb-16">
          <h2
            data-aos="fade-up"
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            🚀 How <span className="text-primary">SkillSpire</span> Works
          </h2>
          <p className="text-slate-400 text-lg">Your journey from participant to champion in 3 easy steps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Line for Desktop (Hidden on Mobile) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
          
          <StepCard
            icon={<FaUserCheck />}
            number="01"
            title="Join a Contest"
            text="Choose a contest that matches your skill and register securely."
            aos="fade-up"
            delay={0}
          />

          <StepCard
            icon={<FaUpload />}
            number="02"
            title="Submit Your Work"
            text="Complete the challenge and submit before the deadline."
            aos="fade-up"
            delay={150}
          />

          <StepCard
            icon={<FaMoneyBillWave />}
            number="03"
            title="Win & Get Rewarded"
            text="Best submissions win exciting prizes and recognition."
            aos="fade-up"
            delay={300}
          />
        </div>
      </section>

      {/* ================= WHY SKILLSPIRE ================= */}
      <section className="bg-[#0a0f1c] py-24 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              data-aos="fade-up"
              className="text-4xl font-black text-white mb-4"
            >
              💡 Why Choose SkillSpire?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaStar />}
              title="Skill-Focused"
              text="Purely skill-based contests where talent matters most, not just popularity."
              aos="zoom-in"
              delay={0}
            />

            <FeatureCard
              icon={<FaShieldAlt />}
              title="Fair & Transparent"
              text="Clear rules, automated anti-cheat, and trusted results for every participant."
              aos="zoom-in"
              delay={150}
            />

            <FeatureCard
              icon={<FaGlobe />}
              title="Global Exposure"
              text="Compete with creators worldwide and get your portfolio noticed by experts."
              aos="zoom-in"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ================= MOTIVATION (CTA) ================= */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/90 to-secondary p-1">
          <div className="bg-[#0a0f1c]/90 backdrop-blur-3xl rounded-[2.4rem] p-8 md:p-16 flex flex-col md:flex-row gap-14 items-center overflow-hidden">
            
            {/* Animated Glow behind the content */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-20 -mt-20"></div>

            {/* LEFT */}
            <div data-aos="fade-right" className="relative z-10 flex-1">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                🔥 Turn Your <span className="text-primary">Skills</span> Into Success
              </h2>

              <p className="text-slate-300 text-lg mb-8 max-w-lg">
                Thousands of creators are transforming their passion into real-world recognition. 
                SkillSpire isn't just a platform—it's your launchpad.
              </p>

              <div className="space-y-4 mb-10">
                {['Gain real-world experience', 'Build a winning portfolio', 'Earn prizes & confidence'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-200 font-medium">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✓</span>
                    {item}
                  </div>
                ))}
              </div>

              <button className="btn btn-primary btn-lg rounded-2xl h-16 px-10 text-slate-900 font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                Start Your Journey
              </button>
            </div>

            {/* RIGHT (Testimonial Card) */}
            <div
              data-aos="fade-left"
              className="relative z-10 w-full md:w-[400px] bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <FaRocket className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Real Growth</h3>
                  <div className="flex text-yellow-500 text-xs">
                    {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                  </div>
                </div>
              </div>

              <p className="text-slate-300 italic leading-relaxed text-lg">
                “SkillSpire pushed me beyond tutorials into real challenges.
                Winning a contest boosted my confidence massively and helped me land my first gig!”
              </p>

              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="font-bold text-white">— Sarah Jenkins</p>
                <p className="text-primary text-sm font-medium">UI/UX Contest Winner</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const StepCard = ({ icon, number, title, text, aos, delay }) => (
  <div
    data-aos={aos}
    data-aos-delay={delay}
    className="relative group bg-slate-900/50 border border-slate-800 rounded-[2rem] p-10 text-center
    hover:border-primary/50 transition-all duration-500"
  >
    <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl shadow-lg">
      {number}
    </div>
    <div className="text-6xl text-primary/30 group-hover:text-primary mb-6 flex justify-center transition-colors duration-500">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-400 leading-relaxed font-medium">{text}</p>
  </div>
);

const FeatureCard = ({ icon, title, text, aos, delay }) => (
  <div
    data-aos={aos}
    data-aos-delay={delay}
    className="bg-slate-900/30 border border-slate-800/50 rounded-[2rem] p-10
    hover:bg-slate-800/40 hover:scale-[1.02] transition-all duration-300 group"
  >
    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl text-primary mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 font-medium leading-relaxed">{text}</p>
  </div>
);

export default ExtraSections;