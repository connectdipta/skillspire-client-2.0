import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axiosSecure from "../api/axiosSecure";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import { FaCreditCard, FaLock, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  /* ================= LOAD CONTEST ================= */
  useEffect(() => {
    const loadContest = async () => {
      try {
        const res = await axiosSecure.get(`/contests/${id}`);
        setContest(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          Swal.fire("Login required", "Please login first", "warning");
          navigate("/login");
        } else {
          Swal.fire("Error", "Failed to load payment info", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    loadContest();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-base-content/60 font-medium animate-pulse">Setting up secure checkout...</p>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-10 bg-error/10 rounded-3xl border border-error/20">
            <h2 className="text-2xl font-bold text-error">Contest not found</h2>
            <button onClick={() => navigate(-1)} className="btn btn-ghost mt-4">Go Back</button>
        </div>
      </div>
    );
  }

  /* ================= PAY ================= */
  const handlePayment = async () => {
    if (!user) {
      Swal.fire("Login required", "Please login to continue", "warning");
      navigate("/login");
      return;
    }

    setProcessing(true);

    Swal.fire({
      title: "Verifying Transaction...",
      text: "Please do not refresh the page",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await axiosSecure.post("/payments", {
        contestId: id,
        email: user.email,
        // Using registrationFee as the primary cost field
        amount: contest.registrationFee || contest.price || 0, 
      });

      Swal.fire({
        icon: "success",
        title: "Payment Successful 🎉",
        text: "Your spot in the contest is confirmed!",
        timer: 2500,
        showConfirmButton: false,
      });

      navigate(`/contests/${id}`);
    } catch (error) {
      Swal.fire(
        "Payment Failed ❌",
        error?.response?.data?.message || "Something went wrong with the transaction",
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200/50 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-base-100 rounded-[2.5rem] shadow-2xl overflow-hidden" data-aos="zoom-in">
        
        {/* LEFT SIDE: ORDER SUMMARY */}
        <div className="bg-primary p-8 md:p-12 text-primary-content flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8 opacity-80">
                <FaShieldAlt />
                <span className="text-xs font-bold uppercase tracking-widest">Secure Checkout</span>
            </div>
            <h2 className="text-3xl font-black mb-2">Order Summary</h2>
            <p className="opacity-70 text-sm mb-8">You're one step away from joining the challenge.</p>
            
            <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-primary-focus pb-4">
                    <div>
                        <p className="font-bold text-lg">{contest.name}</p>
                        <p className="text-xs opacity-60">Contest Entry Fee</p>
                    </div>
                    <p className="text-xl font-black">${contest.registrationFee || contest.price}</p>
                </div>
                
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <FaCheckCircle className="text-success-content" />
                        <span>Instant Access after payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <FaCheckCircle className="text-success-content" />
                        <span>Eligible for ${contest.prize} prize pool</span>
                    </div>
                </div>
            </div>
          </div>

          <div className="mt-12 p-4 bg-white/10 rounded-2xl border border-white/10">
            <p className="text-xs opacity-70 mb-1">Authenticated as</p>
            <p className="font-bold truncate">{user?.email}</p>
          </div>
        </div>

        {/* RIGHT SIDE: PAYMENT FORM */}
        <div className="p-8 md:p-12">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            Card Details 
            <span className="text-[10px] bg-base-200 px-2 py-0.5 rounded text-base-content/50">TEST MODE</span>
          </h3>

          <div className="space-y-5">
            {/* Card Preview UI */}
            <div className="h-44 w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-lg mb-8 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full"></div>
                <div className="flex justify-between items-start">
                    <div className="w-12 h-10 bg-yellow-500/20 rounded-md border border-yellow-500/30 flex items-center justify-center">
                        <div className="w-8 h-6 bg-yellow-600/50 rounded-sm"></div>
                    </div>
                    <FaCreditCard className="text-3xl opacity-50" />
                </div>
                <div>
                    <p className="text-lg tracking-[0.2em] font-mono">**** **** **** 4242</p>
                    <div className="flex justify-between mt-4">
                        <p className="text-[10px] uppercase opacity-50">Card Holder<br/><span className="text-xs font-bold tracking-wider opacity-100">{user?.displayName || 'Your Name'}</span></p>
                        <p className="text-[10px] uppercase opacity-50 text-right">Expires<br/><span className="text-xs font-bold opacity-100">12 / 28</span></p>
                    </div>
                </div>
            </div>

            <div className="form-control">
              <label className="label text-xs font-bold opacity-50">CARD NUMBER</label>
              <div className="relative">
                <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                <input disabled placeholder="4242 4242 4242 4242" className="input input-bordered w-full pl-12 bg-base-200/50 border-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label text-xs font-bold opacity-50">EXPIRY DATE</label>
                <input disabled placeholder="MM / YY" className="input input-bordered bg-base-200/50 border-none" />
              </div>
              <div className="form-control">
                <label className="label text-xs font-bold opacity-50">CVC</label>
                <input disabled placeholder="***" className="input input-bordered bg-base-200/50 border-none" />
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={processing}
              className={`btn btn-primary w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 mt-4 transition-all ${processing ? 'loading' : ''}`}
            >
              {!processing && <FaLock className="mr-2 text-sm" />}
              {processing ? "Confirming..." : `Pay $${contest.registrationFee || contest.price}`}
            </button>

            <div className="flex items-center justify-center gap-2 mt-6 opacity-40 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="visa" className="h-3" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="mastercard" className="h-5" />
                <div className="w-px h-4 bg-base-content mx-1"></div>
                <p className="text-[10px] font-bold">SSL ENCRYPTED</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;