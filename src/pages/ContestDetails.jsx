import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axiosSecure from "../api/axiosSecure";
import axiosPublic from "../api/axiosPublic";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

const normalizeId = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (value.$oid) return value.$oid;
    if (typeof value.toHexString === "function") return value.toHexString();
    if (typeof value.toString === "function") {
      const parsed = value.toString();
      if (parsed && parsed !== "[object Object]") return parsed;
    }
  }
  return null;
};

const ContestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submissionText, setSubmissionText] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);


  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadContest = async () => {
      try {
        const res = await axiosPublic.get(`/contests/${id}`);
        setContest(res.data);
      } catch {
        Swal.fire("Error", "Failed to load contest", "error");
      } finally {
        setLoading(false);
      }
    };
    loadContest();
  }, [id]);

  useEffect(() => {
    if (!user?.email) return;
    axiosSecure.get("/users/me").then(res => {
      const participated = res.data?.participatedContests || [];
      setIsRegistered(participated.some((contestId) => normalizeId(contestId) === id));
    });
    axiosSecure.get("/submissions", { params: { contestId: id } }).then(res => {
      const submitted = res.data.some(s => s.userEmail === user.email);
      setHasSubmitted(submitted);
    });
  }, [id, user]);

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    if (!contest?.deadline || contest?.status === "ended") return;
    const interval = setInterval(() => {
      const diff = new Date(contest.deadline) - new Date();
      if (diff <= 0) {
        setTimeLeft("Ended");
        clearInterval(interval);
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    }, 1000);
    return () => clearInterval(interval);
  }, [contest]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <span className="loading loading-bars loading-lg text-primary"></span>
      <p className="animate-pulse font-medium text-base-content/60">Fetching contest data...</p>
    </div>
  );

  if (!contest) return <div className="text-center py-20 text-error font-bold">Contest not found</div>;

  const contestEnded = contest.status === "ended" || new Date(contest.deadline) < new Date();

  const handleSubmitTask = async () => {
    if (!submissionText.trim()) return;
    try {
      await axiosSecure.post("/submissions", { contestId: id, content: submissionText });
      Swal.fire("Success!", "Task submitted successfully", "success");
      setHasSubmitted(true);
      setShowModal(false);
      setSubmissionText("");
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Submission failed",
        "error"
      );
    }
  };

  return (
    <section className="min-h-screen bg-base-100 pb-20">
      {/* ================= HERO SECTION ================= */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <img src={contest.image} alt={contest.name} className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4" data-aos="zoom-out">
          <div className="badge badge-primary badge-outline px-4 py-3 mb-4 backdrop-blur-md bg-white/10 uppercase tracking-widest text-xs font-bold">
            {contest.type || "Competition"}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl mb-4">
            {contest.name}
          </h1>
          <div className="flex gap-4">
            <span className={`badge border-none px-4 py-3 font-bold text-white ${contestEnded ? 'bg-error' : 'bg-success'}`}>
              {contestEnded ? "Finished" : `Ends in: ${timeLeft}`}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-8 space-y-8">
            {/* STATS ROW */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4" data-aos="fade-up">
              <InfoCard icon="👥" label="Participants" value={contest.participants} />
              <InfoCard icon="💰" label="Prize Pool" value={`$${contest.prize}`} />
              <div className="hidden md:block">
                <InfoCard icon="📅" label="Deadline" value={new Date(contest.deadline).toLocaleDateString()} />
              </div>
            </div>

            {/* WINNER SECTION */}
            {contest.winner && (
              <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/10 border-2 border-yellow-500/50 rounded-3xl p-8 relative overflow-hidden" data-aos="flip-up">
                <div className="absolute -right-10 -top-10 text-9xl opacity-10">🏆</div>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <img 
                      src={contest.winner.photo?.trim() ? contest.winner.photo : "https://i.ibb.co/2kRZqkB/user.png"} 
                      alt={contest.winner.name} 
                      className="w-28 h-28 rounded-full border-4 border-yellow-500 shadow-xl object-cover" 
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-black px-3 py-1 rounded-full text-xs">WINNER</div>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-3xl font-black text-secondary">Congratulations!</h3>
                    <p className="text-xl font-bold">{contest.winner.name}</p>
                    <p className="opacity-60">{contest.winner.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* CONTENT TABS/SECTIONS */}
            <div className="bg-base-200/50 p-6 md:p-10 rounded-3xl space-y-8" data-aos="fade-up">
              <Section title="📘 About the Contest">{contest.description}</Section>
              <hr className="border-base-300" />
              <Section title="📝 Instructions">{contest.taskInstruction}</Section>
            </div>
          </div>

          {/* RIGHT SIDEBAR (STICKY) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-base-100 border border-base-300 shadow-2xl rounded-3xl p-8 space-y-6" data-aos="fade-left">
              <h4 className="text-xl font-bold">Registration Area</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm opacity-70">
                  <span>Registration Fee:</span>
                  <span className="font-bold text-base-content">${contest.price || "0.00"}</span>
                </div>
                <div className="flex justify-between text-sm opacity-70">
                  <span>Status:</span>
                  <span className={`font-bold ${isRegistered ? 'text-success' : 'text-primary'}`}>
                    {isRegistered ? 'Joined' : 'Open'}
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  disabled={contestEnded || isRegistered}
                  onClick={() => {
                       if (!user) {
                           Swal.fire({
                              icon: "warning",
                              title: "Login required",
                              text: "Please login to join this contest",});
                             navigate("/login");
                             return;}
                             navigate(`/payment/${id}`);}}
                  className={`btn btn-block h-14 rounded-2xl text-lg font-bold transition-all border-none ${isRegistered ? 'bg-success/20 text-success' : 'btn-primary shadow-lg shadow-primary/30'}`}
                >
                  {isRegistered ? "✓ Registered" : "Join Contest"}
                </button>

                {isRegistered && !contestEnded && !hasSubmitted && (
                  <button onClick={() => setShowModal(true)} className="btn btn-outline btn-block h-14 rounded-2xl border-2 hover:bg-secondary">
                    🚀 Submit Task Now
                  </button>
                )}

                {hasSubmitted && (
                  <div className="p-4 bg-success/10 rounded-xl border border-success/20 text-center">
                    <p className="text-success font-bold text-sm">✅ Submission Received</p>
                  </div>
                )}

                {contestEnded && !contest.winner && (
                  <div className="p-4 bg-base-200 rounded-xl text-center italic text-sm opacity-60">
                    Results are being processed...
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          >
            <motion.div 
              initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.9 }}
              className="bg-base-100 rounded-3xl p-8 w-full max-w-lg shadow-2xl shadow-primary/20"
            >
              <h3 className="text-2xl font-black mb-2">Ready to Submit?</h3>
              <p className="text-sm opacity-60 mb-6">Make sure your work follows all instructions carefully.</p>

              <textarea
                rows="6"
                value={submissionText}
                onChange={e => setSubmissionText(e.target.value)}
                className="textarea textarea-bordered w-full rounded-2xl p-4 focus:ring-2 focus:ring-primary/50 text-lg"
                placeholder="Paste your Google Drive link or GitHub URL here..."
              />

              <div className="mt-6 flex gap-3">
                <button onClick={() => setShowModal(false)} className="btn btn-ghost flex-1 rounded-xl">Cancel</button>
                <button onClick={handleSubmitTask} className="btn btn-primary flex-1 rounded-xl font-bold">Finish Submission</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-base-200/50 backdrop-blur-md rounded-2xl p-4 text-center border border-base-300">
    <div className="text-2xl mb-1">{icon}</div>
    <p className="text-[10px] md:text-xs uppercase tracking-widest opacity-50 font-black">{label}</p>
    <p className="text-lg md:text-xl font-black text-secondary">{value}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-4">
    <h2 className="text-xl md:text-2xl font-black text-secondary flex items-center gap-3">
      {title}
    </h2>
    <div className="leading-relaxed opacity-80 text-sm md:text-base whitespace-pre-wrap">
      {children}
    </div>
  </div>
);

export default ContestDetails;