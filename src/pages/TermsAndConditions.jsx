import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const TermsAndConditions = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-base-200 py-20 px-4">
      <div 
        data-aos="fade-up" 
        className="max-w-4xl mx-auto bg-base-100 p-8 md:p-16 shadow-xl rounded-3xl border border-base-300 relative overflow-hidden"
      >
        {/* Subtle decorative background circle */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-base-content mb-4">Terms & Conditions</h1>
          <p className="text-base-content/60 font-medium">Last updated: February 28, 2026</p>
        </div>
        
        <div className="space-y-10">
          {[
            { title: "1. Acceptance of Terms", icon: "🤝", desc: "By accessing SkillSpire, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use this service." },
            { title: "2. User Accounts", icon: "🛡️", desc: "To participate in contests, you must register. You are responsible for maintaining the security of your account. We are not liable for any loss resulting from your failure to keep your credentials safe." },
            { title: "3. Contest Participation", icon: "🏆", desc: "Entry fees are non-refundable. SkillSpire acts as a platform for creators; we are not responsible for the outcome or management of specific contests hosted by third-party creators." },
            { title: "4. Intellectual Property", icon: "💡", desc: "You retain ownership of the content you submit. By submitting, you grant SkillSpire a non-exclusive license to display and distribute your work solely for the purpose of the contest platform." },
            { title: "5. Termination", icon: "🚫", desc: "We reserve the right to terminate or suspend access to our service immediately, without prior notice, for any breach of these Terms." }
          ].map((item, index) => (
            <div key={index} className="flex gap-6 group">
              <div className="text-4xl">{item.icon}</div>
              <div>
                <h2 className="text-2xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h2>
                <p className="text-base-content/70 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-base-300 flex justify-center">
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-primary btn-outline px-10 rounded-full hover:scale-105 transition-transform"
          >
            ← Return to Previous Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;