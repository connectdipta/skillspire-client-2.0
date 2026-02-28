import React, { useEffect, useState } from "react";
import axiosPublic from "../api/axiosPublic";
import { FaTrophy, FaMedal, FaCrown, FaStar } from "react-icons/fa";
import userProfile from "../assets/userProfile.png";

import AOS from "aos";
import "aos/dist/aos.css";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
      offset: 120,
    });
  }, []);

  useEffect(() => {
    axiosPublic
      .get("/leaderboard")
      .then((res) => setLeaders(res.data))
      .catch((err) => console.error("Leaderboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <span className="loading loading-infinity loading-lg text-primary"></span>
        <p className="text-lg font-bold animate-pulse text-base-content/60">Assembling the Champions...</p>
      </div>
    );
  }

  // Reorder for Podium: [Rank 2, Rank 1, Rank 3] for a visual peak in the middle
  const podiumOrder = leaders.length >= 3 
    ? [leaders[1], leaders[0], leaders[2]] 
    : leaders;

  return (
    <section className="min-h-screen bg-base-100 pb-20 overflow-x-hidden">
      {/* ================= HERO HEADER ================= */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent py-20 px-4 text-center">
        <div data-aos="zoom-in">
          <div className="inline-block p-3 bg-yellow-400/10 rounded-full mb-4">
            <FaCrown className="text-4xl text-yellow-500 animate-bounce" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-secondary tracking-tight">
            Hall of <span className="text-primary">Fame</span>
          </h1>
          <p className="mt-4 text-base-content/60 max-w-xl mx-auto text-lg">
            The elite performers who have conquered challenges and set new benchmarks.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* ================= VISUAL PODIUM (Only shows if 3+ users) ================= */}
        {leaders.length >= 3 && (
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-0 mb-20 mt-10">
            {podiumOrder.map((user, index) => {
              // index 0 = Rank 2, index 1 = Rank 1, index 2 = Rank 3
              const isFirst = leaders[0].email === user.email;
              const isThird = leaders[2].email === user.email;
              
              return (
                <div
                  key={user.email}
                  className={`w-full md:w-1/3 flex flex-col items-center ${isFirst ? 'z-10 order-1 md:order-2' : isThird ? 'order-3' : 'order-2 md:order-1'}`}
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                >
                  <div className={`relative mb-4 ${isFirst ? 'scale-110' : 'scale-90 opacity-80'}`}>
                    <img
                      src={user.photo || userProfile}
                      className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 object-cover shadow-2xl ${isFirst ? 'border-yellow-400' : 'border-base-300'}`}
                      alt={user.name}
                    />
                    <div className={`absolute -top-4 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg
                      ${isFirst ? 'bg-yellow-400 text-yellow-900' : 'bg-base-300 text-base-content'}`}>
                      {isFirst ? <FaCrown /> : isThird ? "3" : "2"}
                    </div>
                  </div>
                  
                  <div className={`w-full p-6 text-center rounded-t-[2rem] shadow-xl border-x border-t border-base-200
                    ${isFirst ? 'bg-base-200 h-64 md:h-80' : 'bg-base-200/50 h-48 md:h-60'}`}>
                    <h3 className="font-black text-lg truncate px-2">{user.name}</h3>
                    <p className="text-xs opacity-50 mb-4">{user.email}</p>
                    <div className="badge badge-primary gap-2 p-4 font-bold">
                      <FaTrophy /> {user.wins} Wins
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= THE RANKING LIST ================= */}
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="px-6 py-2 flex justify-between text-xs font-black uppercase tracking-widest opacity-40">
            <span>Rank & Player</span>
            <span>Performance</span>
          </div>
          
          {/* UPDATED LOGIC: If less than 3 leaders, show everyone in list. If 3+, skip first 3. */}
          {leaders.slice(leaders.length >= 3 ? 3 : 0).map((user, index) => (
            <div
              key={user.email}
              data-aos="fade-up"
              className="group flex items-center justify-between bg-base-100 border border-base-200 rounded-3xl p-4 md:p-5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center font-black text-secondary group-hover:bg-primary group-hover:text-white transition-colors">
                   {/* UPDATED LOGIC: Calculate Rank correctly based on whether podium is shown */}
                   {index + (leaders.length >= 3 ? 4 : 1)}
                </div>

                <div className="relative">
                  <img
                    src={user.photo || userProfile}
                    className="w-12 h-12 rounded-full border-2 border-base-200 object-cover"
                    alt="User"
                  />
                  {user.wins > 5 && <FaStar className="absolute -top-1 -right-1 text-yellow-500 text-xs animate-pulse" />}
                </div>

                <div>
                  <p className="font-bold text-secondary group-hover:text-primary transition-colors">{user.name}</p>
                  <p className="text-xs opacity-50 hidden sm:block">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black opacity-30 uppercase">Wins</p>
                  <p className="font-black text-primary">{user.wins}</p>
                </div>
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-2xl flex items-center justify-center">
                   <FaMedal className="text-xl" />
                </div>
              </div>
            </div>
          ))}

          {/* Fallback for empty state (matches your theme) */}
          {leaders.length === 0 && (
            <div className="text-center py-10 opacity-50 font-bold text-base-content/60">
                No champions yet. Be the first!
            </div>
          )}
        </div>

        {/* ================= CTA / MOTIVATION ================= */}
        <div 
          className="mt-32 relative rounded-[3rem] overflow-hidden bg-secondary p-1 md:p-2"
          data-aos="zoom-in"
        >
          <div className="bg-base-100 rounded-[2.8rem] p-10 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <h2 className="text-3xl md:text-5xl font-black text-secondary mb-6">
              Claim Your Spot at the <span className="text-primary">Top</span>
            </h2>
            <p className="max-w-2xl mx-auto text-base-content/60 text-lg mb-12">
              Every champion was once a contender who refused to give up. Start your journey today and let the world see your name.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-12">
               <Feature icon="⚡" title="Quick Wins" desc="Entry level contests to start your streak." />
               <Feature icon="💎" title="Elite Rewards" desc="High-tier prizes for the best creators." />
               <Feature icon="🚀" title="Pro Profile" desc="Showcase your wins to top recruiters." />
            </div>

            <a
              href="/all-contests"
              className="btn btn-primary btn-lg rounded-2xl px-12 font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all"
            >
              Start Competing Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="p-6 rounded-3xl bg-base-200/50 hover:bg-base-200 transition-colors">
    <div className="text-3xl mb-2">{icon}</div>
    <h4 className="font-bold text-secondary mb-1">{title}</h4>
    <p className="text-xs opacity-60 leading-relaxed">{desc}</p>
  </div>
);

export default Leaderboard;