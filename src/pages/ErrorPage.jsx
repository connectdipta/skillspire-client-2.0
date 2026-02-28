import { Link, useRouteError } from "react-router";
import { motion } from "framer-motion";
import { FaHome, FaArrowLeft } from "react-icons/fa";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-base-100 text-base-content px-6">
      
      {/* ================= DYNAMIC BACKGROUND ================= */}
      {/* Animated blurred orbs that drift slowly */}
      <motion.div 
        animate={{ 
          x: [0, 30, 0], 
          y: [0, 50, 0],
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -left-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px]"
      ></motion.div>
      
      <motion.div 
        animate={{ 
          x: [0, -40, 0], 
          y: [0, -60, 0],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-20 -right-20 w-[250px] md:w-[450px] h-[250px] md:h-[450px] bg-secondary/10 rounded-full blur-[80px] md:blur-[120px]"
      ></motion.div>

      {/* ================= CONTENT ================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-2xl"
      >
        {/* Playful 404 text with "floating" animation */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative inline-block"
        >
          <h1 className="text-[100px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary-focus drop-shadow-2xl">
            404
          </h1>
          {/* Decorative element */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-primary/20 blur-xl rounded-full"></div>
        </motion.div>

        <div className="mt-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-secondary uppercase tracking-tight">
            Lost in Space?
          </h2>
          
          <p className="max-w-md mx-auto text-base md:text-lg opacity-60 leading-relaxed font-medium">
            {error?.statusText || error?.message || 
            "The coordinate you're looking for doesn't exist. Let's get you back to safety."}
          </p>
        </div>

        {/* ================= ACTIONS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => window.history.back()}
            className="btn btn-ghost btn-lg rounded-2xl px-8 gap-2 hover:bg-base-200 transition-all border-base-300"
          >
            <FaArrowLeft className="text-sm" />
            Go Back
          </button>

          <Link
            to="/"
            className="btn btn-primary btn-lg rounded-2xl px-10 gap-2 shadow-xl shadow-primary/30 hover:scale-105 transition-all active:scale-95 text-white"
          >
            <FaHome />
            Return Home
          </Link>
        </motion.div>

        {/* Support Link */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-sm opacity-40 font-medium"
        >
          Think this is a mistake? <a href="/contact" className="underline hover:text-primary transition-colors">Contact Support</a>
        </motion.p>
      </motion.div>

      {/* Decorative Grid Pattern (theme-safe) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
    </div>
  );
};

export default ErrorPage;