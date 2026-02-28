import React, { useEffect } from "react";
import Banner2 from "../components/Banner2";
import { FaTrophy, FaUsers, FaLightbulb, FaRocket, FaCheckCircle, FaChartLine, FaGlobe } from "react-icons/fa";

import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
      offset: 120,
    });
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ================= HERO BANNER ================= */}
      <div data-aos="zoom-out" className="relative">
        <Banner2 />
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
      </div>

      {/* ================= STORY SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right">
            <span className="text-primary font-bold tracking-widest uppercase text-sm">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-black text-secondary mt-2 mb-6 leading-tight">
              Empowering the next generation of <span className="text-primary">Talent.</span>
            </h2>
            <div className="space-y-4 text-lg text-base-content/70">
              <p>
                SkillSpire is more than just a contest platform; it's a launchpad for dreams. 
                We started with a simple belief: <span className="text-secondary font-semibold">true potential is unlocked through challenge.</span>
              </p>
              <p>
                By bridging the gap between learning and doing, we provide a space where 
                creatives and professionals can prove their worth in real-world scenarios.
              </p>
            </div>
          </div>

          <div 
            className="relative bg-base-100 border border-base-300 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            data-aos="fade-left"
          >
            {/* Decorative background element */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
            
            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
              The SkillSpire Edge
            </h3>
            <div className="grid gap-4">
              {[
                "Skill-based high-stakes competitions",
                "Community-vetted judging & transparency",
                "Global recognition and digital certificates",
                "A growth-driven ecosystem for innovators"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-base-200/50 hover:bg-base-200 transition-colors">
                  <FaCheckCircle className="text-primary text-xl mt-1 flex-shrink-0" />
                  <p className="font-semibold opacity-80">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

{/* ================= STATS COUNTER ================= */}
<section className="relative py-24 overflow-hidden rounded-2xl">

  {/* Background Gradient */}
  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"></div>

  {/* Glow Decorations */}
  <div className="absolute -top-24 left-10 w-72 h-72 bg-primary/20 blur-3xl rounded-full"></div>
  <div className="absolute -bottom-24 right-10 w-72 h-72 bg-secondary/20 blur-3xl rounded-full"></div>

  <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

    <StatItem icon={<FaUsers />} count="50k+" label="Active Users" />
    <StatItem icon={<FaTrophy />} count="1.2k+" label="Winners Crowned" />
    <StatItem icon={<FaGlobe />} count="120+" label="Countries" />
    <StatItem icon={<FaChartLine />} count="$250k+" label="Prizes Distributed" />

  </div>
</section>

      {/* ================= MISSION & VISION ================= */}
      <section className="bg-base-200/50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-secondary mb-4" data-aos="fade-up">Driven by Purpose</h2>
            <p className="text-base-content/60" data-aos="fade-up" data-aos-delay="100">
              We are on a mission to democratize talent recognition and inspire global innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group bg-base-100 rounded-[2.5rem] p-12 shadow-xl border border-transparent hover:border-primary transition-all duration-300" data-aos="fade-right">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <FaLightbulb />
              </div>
              <h3 className="text-2xl font-black mb-4">Our Mission</h3>
              <p className="text-base-content/70 leading-relaxed text-lg">
                To create a supportive yet competitive environment where talent is the 
                only currency that matters. We empower users to showcase their skills 
                through fair, transparent contests.
              </p>
            </div>

            <div className="group bg-base-100 rounded-[2.5rem] p-12 shadow-xl border border-transparent hover:border-primary transition-all duration-300" data-aos="fade-left">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <FaRocket />
              </div>
              <h3 className="text-2xl font-black mb-4">Our Vision</h3>
              <p className="text-base-content/70 leading-relaxed text-lg">
                To become the world's most trusted home for talent, where any individual 
                with a skill can find a platform to thrive, regardless of their background 
                or geography.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-black text-center text-secondary mb-16" data-aos="fade-up">
          Why People Love SkillSpire
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
            <WhyCard 
                icon={<FaUsers />} 
                title="Global Community" 
                text="Collaborate and compete with thousands of creators worldwide." 
                delay="0"
            />
            <WhyCard 
                icon={<FaTrophy />} 
                title="Verified Winners" 
                text="Our transparent judging system ensures every win is earned and respected." 
                delay="100"
            />
            <WhyCard 
                icon={<FaRocket />} 
                title="Level Up Your Career" 
                text="Use your contest wins to build a portfolio that employers can't ignore." 
                delay="200"
            />
        </div>
      </section>

      {/* ================= MODERN CTA ================= */}
      <section className="px-6 mb-24">
        <div 
          className="max-w-7xl mx-auto bg-primary rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20"
          data-aos="zoom-in"
        >
          {/* Abstract background decorations */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-6">Ready to make your mark?</h2>
            <p className="text-xl text-white/80 max-w-xl mx-auto mb-10">
              Stop waiting for opportunities. Create them by joining your first contest today.
            </p>

            <a
              href="/all-contests"
              className="btn bg-white hover:bg-white text-primary hover:scale-105 border-none h-16 px-12 rounded-2xl text-lg font-black transition-all"
            >
              Get Started Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */
const StatItem = ({ icon, count, label }) => (
    <div className="space-y-2" data-aos="fade-up">
        <div className="text-3xl text-primary/80 mb-2 flex justify-center">{icon}</div>
        <div className="text-4xl font-black">{count}</div>
        <div className="text-sm uppercase tracking-widest font-bold opacity-60">{label}</div>
    </div>
);

const WhyCard = ({ icon, title, text, delay }) => (
  <div 
    data-aos="fade-up" 
    data-aos-delay={delay}
    className="bg-base-100 border border-base-300 rounded-[2rem] p-10 text-center hover:shadow-2xl hover:border-primary/30 transition-all group"
  >
    <div className="text-5xl text-primary mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-black mb-3">{title}</h3>
    <p className="text-base-content/60 leading-relaxed">{text}</p>
  </div>
);

export default AboutUs;