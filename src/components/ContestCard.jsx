import React from "react";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { FaUsers, FaArrowRight } from "react-icons/fa6";

const ContestCard = ({ contest }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDetails = () => {
    navigate(`/contests/${contest._id}`);
  };

  return (
    <div className="
      group relative
      bg-base-100
      border-2 border-yellow-600
      rounded-[2rem]
      overflow-hidden
      transition-all duration-500
      hover:border-primary/50
      hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)]
      flex flex-col h-full
    ">

      {/* ================= IMAGE SECTION ================= */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={contest.image}
          alt={contest.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient Overlay (works both themes) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* STATUS BADGE */}
        <div
          className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest
            ${
              contest.status === "ended"
                ? "bg-red-500/90 text-white"
                : "bg-emerald-500/90 text-slate-900"
            }
          `}
        >
          {contest.status === "ended" ? "Ended" : "Active"}
        </div>

        {/* PARTICIPANTS BADGE */}
        <div className="
          absolute top-4 right-4
          bg-base-100/80
          backdrop-blur-md
          border border-base-300
          text-base-content
          text-xs font-bold
          px-3 py-1.5 rounded-full
          flex items-center gap-2
        ">
          <FaUsers className="text-primary" />
          {contest.participants}
        </div>
      </div>

      {/* ================= CONTENT SECTION ================= */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="
          text-xl font-black
          text-base-content
          group-hover:text-primary
          transition-colors duration-300
          line-clamp-1
        ">
          {contest.name}
        </h3>

        <p className="
          mt-3
          text-base-content/70
          text-sm
          leading-relaxed
          line-clamp-2
        ">
          {contest.description}
        </p>

        {/* ================= FOOTER ================= */}
        <div className="mt-auto pt-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-base-content/50 font-bold">
              Prize Pool
            </span>

            <span className="text-lg font-black text-primary">
              ${contest.prize || "TBA"}
            </span>
          </div>

          <button
            onClick={handleDetails}
            className="
              flex items-center gap-2
              px-5 py-2.5
              rounded-xl
              bg-primary
              text-primary-content
              font-black text-sm
              hover:scale-105 active:scale-95
              transition-all
              shadow-lg shadow-primary/10
            "
          >
            Details
            <FaArrowRight
              size={12}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;