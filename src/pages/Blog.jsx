import React, { useState, useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Blog = () => {

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const modalRef = useRef(null);

  const postsPerPage = 6;

  /* ================= BLOG DATA ================= */
  const posts = [
    {
      id: 1,
      title: "Mastering Design Contests",
      category: "Design",
      date: "Feb 28, 2026",
      excerpt:
        "Stop guessing what clients want. Learn the systematic UI/UX contest strategy.",
      fullContent:
        "Winning design contests requires understanding business goals, psychology, and visual storytelling.",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Competitive Coding Tactics",
      category: "Coding",
      date: "Feb 25, 2026",
      excerpt:
        "Algorithmic thinking is more than syntax. Optimize for performance.",
      fullContent:
        "Competitive coding focuses on time complexity, pattern recognition and optimization strategies.",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "The Art of Persuasive Writing",
      category: "Writing",
      date: "Feb 20, 2026",
      excerpt:
        "Persuasion turns average writing into winning content.",
      fullContent:
        "Use Hook → Story → Offer framework to create compelling submissions.",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Portfolio Building Secrets",
      category: "Career",
      date: "Feb 18, 2026",
      excerpt:
        "Turn contest participation into job opportunities.",
      fullContent:
        "Document projects, explain decisions and showcase outcomes.",
      image:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      title: "Digital Marketing Trends 2026",
      category: "Marketing",
      date: "Feb 15, 2026",
      excerpt:
        "Modern contests reward storytelling-driven marketing.",
      fullContent:
        "Community engagement and brand authenticity dominate marketing contests.",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      title: "Photography Composition Mastery",
      category: "Photography",
      date: "Feb 10, 2026",
      excerpt:
        "Advanced framing techniques used by contest winners.",
      fullContent:
        "Master lighting, geometry, and storytelling through images.",
      image:
        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 7,
      title: "Public Speaking for Creators",
      category: "Business",
      date: "Feb 05, 2026",
      excerpt:
        "Present your ideas confidently in competitions.",
      fullContent:
        "Storytelling + confidence = higher judging scores.",
      image:
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 8,
      title: "Networking Like a Pro",
      category: "Networking",
      date: "Feb 01, 2026",
      excerpt:
        "Build meaningful creator relationships.",
      fullContent:
        "Strong networks increase collaboration opportunities.",
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 9,
      title: "AI Tools for Contest Winners",
      category: "Technology",
      date: "Jan 28, 2026",
      excerpt:
        "Use AI smartly without losing originality.",
      fullContent:
        "AI accelerates ideation but creativity still wins contests.",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    }
  ];

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const openModal = (post) => {
    setSelectedPost(post);
    modalRef.current.showModal();
  };

  return (
    <div className="min-h-screen  py-20 px-4 transition-colors">

      {/* HEADER */}
      <div className="text-center mb-16" data-aos="fade-down">
        <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          SkillSpire Insights
        </h1>
        <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
          Expert strategies, success stories, and tips to dominate your next contest.
        </p>
      </div>

      {/* BLOG GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentPosts.map((post, index) => (
          <div
            key={post.id}
            data-aos="fade-up"
            data-aos-delay={index * 80}
            className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >
            <figure className="h-56 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </figure>

            <div className="card-body">
              <div className="flex justify-between items-center mb-2">
                <span className="badge badge-primary badge-outline font-bold text-xs">
                  {post.category}
                </span>
                <span className="text-xs text-base-content/50">
                  {post.date}
                </span>
              </div>

              <h2 className="card-title text-base-content hover:text-primary transition-colors">
                {post.title}
              </h2>

              <p className="text-sm text-base-content/70 flex-grow">
                {post.excerpt}
              </p>

              <button
                onClick={() => openModal(post)}
                className="btn btn-primary mt-4 w-full"
              >
                Explore Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-14 gap-3">
        <button
          className="btn btn-outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          ← Prev
        </button>

        <div className="btn btn-primary pointer-events-none">
          Page {currentPage} / {totalPages}
        </div>

        <button
          className="btn btn-outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Next →
        </button>
      </div>

      {/* MODAL */}
      <dialog ref={modalRef} className="modal modal-middle">
        <div className="modal-box bg-base-100 border-t-4 border-primary max-w-2xl">
          {selectedPost && (
            <>
              <h3 className="font-black text-3xl text-primary mb-4">
                {selectedPost.title}
              </h3>

              <p className="text-base-content/80 leading-relaxed">
                {selectedPost.fullContent}
              </p>

              <div className="modal-action">
                <form method="dialog">
                  <button className="btn btn-primary">Close</button>
                </form>
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default Blog;