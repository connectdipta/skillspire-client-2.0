import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import Logo from "./Logo";
import useAuth from "../hooks/useAuth";
import userProfile from "../assets/userProfile.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState("light");

  const activeClass =
    "text-primary font-bold border-b-2 border-primary pb-1";
  const inactiveClass =
    "text-base-content/70 hover:text-primary transition-all duration-300 font-medium";

  /* ================= THEME ================= */
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") ?? "light";
    setTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    logout().catch(console.log);
  };

  /* ================= NAV LINKS ================= */
const links = (
  <>
    <li>
      <NavLink to="/" onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
        Home
      </NavLink>
    </li>
    <li>
      <NavLink to="/all-contests" onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
        All Contests
      </NavLink>
    </li>
    <li>
      <NavLink to="/leaderboard" onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
        Leaderboard
      </NavLink>
    </li>
    <li>
      <NavLink to="/aboutUs" onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
        About Us
      </NavLink>
    </li>
    <li>
      <NavLink to="/blog" onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
        Blog
      </NavLink>
    </li>
    <li>
      <NavLink to="/terms" onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
        Terms & Conditions
      </NavLink>
    </li>
  </>
);

  return (
    <div className="sticky top-0 z-[100] px-4 pt-4">
      <div className="navbar bg-base-100/80 backdrop-blur-md border border-base-content/5 shadow-xl rounded-[1.5rem] px-4 sm:px-6 py-2 sm:py-3 transition-all duration-300">

        {/* ================= LEFT ================= */}
        <div className="navbar-start relative">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="btn btn-ghost lg:hidden p-2 mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>

          {/* Mobile Dropdown */}
          {open && (
            <ul className="menu menu-sm absolute left-0 top-14 bg-base-100 rounded-2xl w-64 p-4 shadow-2xl border border-base-200 lg:hidden animate-in fade-in zoom-in-95 duration-200">
              {links}
            </ul>
          )}

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Logo />
          </Link>
        </div>

        {/* ================= CENTER ================= */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-8 px-1">{links}</ul>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="navbar-end gap-2 sm:gap-3">

          {/* Theme Toggle */}
          <label className="swap swap-rotate btn btn-ghost btn-circle bg-base-200/50 hover:bg-base-200">
            <input
              type="checkbox"
              onChange={toggleTheme}
              checked={theme === "dark"}
            />

            <span className="swap-off text-lg">☀️</span>
            <span className="swap-on text-lg">🌙</span>
          </label>

          {!user ? (
            <Link
              to="/login"
              className="btn btn-primary h-11 sm:h-12 px-6 sm:px-8 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-slate-900"
            >
              Login
            </Link>
          ) : (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar border-2 border-primary/20 hover:border-primary transition-all"
              >
                <div className="w-10 rounded-full">
                  <img src={user.photoURL || userProfile} alt="profile" />
                </div>
              </label>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-4 z-[100] p-4 shadow-2xl bg-base-100 rounded-2xl w-64 border border-base-200"
              >
                <div className="px-4 py-3 mb-2 border-b border-base-200">
                  <p className="text-sm font-bold opacity-80 uppercase tracking-wider">
                    Account
                  </p>
                  <p className="text-primary font-black truncate">
                    {user.displayName}
                  </p>
                </div>

                <li>
                  <Link
                    to="/dashboard"
                    className="py-3 flex items-center gap-3 hover:bg-primary/10 rounded-xl transition-colors"
                  >
                    <span className="bg-primary/20 p-2 rounded-lg text-primary">
                      ⚙️
                    </span>
                    Dashboard
                  </Link>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="py-3 mt-1 flex items-center gap-3 hover:bg-error/10 text-error rounded-xl transition-colors"
                  >
                    <span className="bg-error/20 p-2 rounded-lg text-error">
                      Logout
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;