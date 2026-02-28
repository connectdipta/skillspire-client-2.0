import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import axiosPublic from "../api/axiosPublic";
import ContestCard from "../components/ContestCard";

import AOS from "aos";
import "aos/dist/aos.css";

const contestTypes = [
  "All",
  "Coding",
  "Design",
  "Article Writing",
  "Photography",
  "Marketing",
  "Quiz",
];

const AllContests = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
      offset: 50,
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    axiosPublic
      .get("/contests", { params: { search } })
      .then((res) => {
        // Sort newest first (Backend usually provides 'createdAt')
        const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setContests(sorted);
        setCurrentPage(1);
      })
      .catch((err) => console.error("Failed to load contests:", err))
      .finally(() => setLoading(false));
  }, [search]);

  const filteredContests = useMemo(() => {
    return activeType === "All"
      ? contests
      : contests.filter(
          (contest) => contest.type?.toLowerCase() === activeType.toLowerCase()
        );
  }, [activeType, contests]);

  const totalPages = Math.ceil(filteredContests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContests.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
    AOS.refresh();
  }, [activeType]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="min-h-screen bg-base-100 pb-10 md:pb-20">
      {/* ================= RESPONSIVE HERO ================= */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-10 md:py-20 mb-6 md:mb-10">
        <div className="max-w-7xl mx-auto px-6 text-center" data-aos="fade-down">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-secondary mb-4">
            Explore <span className="text-primary">Contests</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-lg text-base-content/70 px-4">
            Join the world's most exciting challenges. Show your skills, win prizes, and grow.
          </p>
          
          {search && (
            <div className="mt-6 inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs md:text-sm">
              🔍 Results for: <span className="font-bold text-primary">{search}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ================= MOBILE-FRIENDLY SCROLLABLE TABS ================= */}
        {/* On mobile, this will scroll horizontally. On desktop, it centers. */}
        <div 
          className="flex overflow-x-auto no-scrollbar md:flex-wrap justify-start md:justify-center gap-2 md:gap-3 mb-10 pb-4 md:pb-0"
          data-aos="fade-up"
        >
          {contestTypes.map((type, index) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`whitespace-nowrap px-5 py-2 md:px-7 md:py-3 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 flex-shrink-0
              ${
                activeType === type
                  ? "bg-primary text-primary-content shadow-lg shadow-primary/30 scale-105"
                  : "bg-base-200 text-base-content/60 hover:bg-base-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* ================= ADAPTIVE GRID ================= */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredContests.length === 0 ? (
          <div className="text-center py-20 px-6 bg-base-200/30 rounded-3xl border border-dashed border-base-300" data-aos="zoom-in">
            <p className="text-lg font-medium text-base-content/50">No contests found in this category.</p>
            <button onClick={() => setActiveType("All")} className="btn btn-ghost btn-sm mt-2 text-primary underline">Clear filters</button>
          </div>
        ) : (
          <>
            {/* Grid: 1 col (mobile), 2 col (tablet), 3 col (desktop) */}
            <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {currentItems.map((contest, index) => (
                <div
                  key={contest._id}
                  data-aos="fade-up"
                  data-aos-delay={window.innerWidth > 768 ? (index % 3) * 100 : 0}
                >
                  <ContestCard contest={contest} />
                </div>
              ))}
            </div>

            {/* ================= RESPONSIVE PAGINATION ================= */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 md:mt-20" data-aos="fade-up">
                <div className="flex items-center space-x-1 md:space-x-2 bg-base-200/50 p-1.5 md:p-2 rounded-2xl">
                  <button 
                    className="btn btn-ghost btn-square btn-sm" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ❮
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-xl text-xs md:text-sm font-bold transition-all
                          ${currentPage === page 
                            ? "bg-primary text-white shadow-md" 
                            : "hover:bg-base-300 text-base-content/60"}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button 
                    className="btn btn-ghost btn-square btn-sm" 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    ❯
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AllContests;