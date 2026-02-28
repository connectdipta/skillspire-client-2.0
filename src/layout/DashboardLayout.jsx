import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
  FiPlusCircle,
  FiGrid,
  FiUpload,
  FiUsers,
  FiCheckSquare,
  FiLogOut,
  FiUser,
  FiAward,
  FiList,
} from "react-icons/fi";
import Logo from "../components/Logo";
import useAuth from "../hooks/useAuth";
import axiosPublic from "../api/axiosPublic";
import userProfile from "../assets/userProfile.png";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    axiosPublic
      .get("/users/me")
      .then(res => setRole(res.data.role))
      .catch(() => setRole("user"))
      .finally(() => setLoading(false));
  }, [user?.email]);

  // Premium Navigation Classes
  const activeClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-slate-900 font-bold shadow-lg shadow-primary/20 transition-all duration-300 scale-[1.02]";

  const normalClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex flex-col items-center justify-center gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-slate-400 animate-pulse font-medium">Securing access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-12 bg-[#020617] text-slate-200">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-[#0a0f1c] p-6 flex flex-col justify-between border-r border-slate-800/50 sticky top-0 h-screen">

        <div className="space-y-8">
          <Link to="/" className="block px-2">
            <Logo />
          </Link>

          <nav className="flex flex-col gap-2">
            {/* USER ROLE LINKS */}
            {role === "user" && (
              <>
                <NavLink to="/dashboard/participated" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  <FiList size={20} /> <span className="text-sm">Participated</span>
                </NavLink>
                <NavLink to="/dashboard/winnings" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  <FiAward size={20} /> <span className="text-sm">My Winnings</span>
                </NavLink>
                <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  <FiUser size={20} /> <span className="text-sm">My Profile</span>
                </NavLink>
              </>
            )}

            {/* CREATOR ROLE LINKS */}
            {role === "creator" && (
              <>
                <NavLink to="/dashboard/add-contest" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  <FiPlusCircle size={20} /> <span className="text-sm">Add Contest</span>
                </NavLink>
                <NavLink to="/dashboard/my-contests" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  <FiGrid size={20} /> <span className="text-sm">My Contests</span>
                </NavLink>
                <NavLink to="/dashboard/submissions" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  <FiUpload size={20} /> <span className="text-sm">Submissions</span>
                </NavLink>
              </>
            )}

            {/* ADMIN ROLE LINKS */}
            {role === "admin" && (
              <>
                <NavLink to="/dashboard/manage-users" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  <FiUsers size={20} /> <span className="text-sm">Manage Users</span>
                </NavLink>
                <NavLink to="/dashboard/manage-contests" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  <FiCheckSquare size={20} /> <span className="text-sm">Manage Contests</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* FOOTER / USER CARD */}
        <div className="pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl mb-4">
            <img
              src={user?.photoURL || userProfile}
              alt="Profile"
              className="w-10 h-10 rounded-xl border border-white/10 object-cover"
            />
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-white truncate">
                {user?.displayName || "Champion"}
              </p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{role}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="col-span-12 md:col-span-9 lg:col-span-10 p-6 lg:p-10 overflow-y-auto h-screen bg-[#020617]">
        <div className="bg-[#0a0f1c]/50 border border-slate-800/50 rounded-[2.5rem] p-8 min-h-full backdrop-blur-sm shadow-2xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;