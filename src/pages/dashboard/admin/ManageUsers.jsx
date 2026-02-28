import React, { useEffect, useState } from "react";
import axiosPublic from "../../../api/axiosPublic";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiSearch, FiX } from "react-icons/fi";

const ManageUsers = () => {
  const { user: loggedInUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingEmail, setUpdatingEmail] = useState(null);

  /* 1. ADD SEARCH STATE */
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= LOAD USERS ================= */
  useEffect(() => {
    axiosPublic
      .get("/users")
      .then(res => setUsers(res.data))
      .catch(() =>
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Failed to load user directory",
          background: "#0a0f1c",
          color: "#fff"
        })
      )
      .finally(() => setLoading(false));
  }, []);

  /* 2. FILTER LOGIC */
  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  /* ================= CHANGE ROLE ================= */
  const handleRoleChange = async (email, role) => {
    if (email === loggedInUser.email) {
      Swal.fire({
        title: "Restricted",
        text: "You cannot modify your own administrative privileges.",
        icon: "warning",
        background: "#0a0f1c",
        color: "#fff",
        confirmButtonColor: "#fbbf24"
      });
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Role Elevation?",
      text: `User will be reassigned as: ${role.toUpperCase()}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm Change",
      cancelButtonText: "Cancel",
      background: "#0a0f1c",
      color: "#fff",
      confirmButtonColor: "#fbbf24",
      cancelButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;

    try {
      setUpdatingEmail(email);
      await axiosPublic.patch(`/users/role/${email}`, { role });

      setUsers(prev =>
        prev.map(u => (u.email === email ? { ...u, role } : u))
      );

      Swal.fire({
        title: "Success",
        text: "Registry updated successfully",
        icon: "success",
        background: "#0a0f1c",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false
      });
    } catch {
      Swal.fire("System Error", "Role update failed on server", "error");
    } finally {
      setUpdatingEmail(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-slate-500 animate-pulse font-medium">Accessing User Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">
            Manage <span className="text-primary">Users</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">
            {searchQuery ? `${filteredUsers.length} Matches Found` : `System Directory: ${users.length} Total Accounts`}
          </p>
        </div>
        
        {/* 3. FUNCTIONAL SEARCH BAR */}
        <div className="relative group w-full md:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-sm rounded-2xl py-3 pl-12 pr-10 w-full focus:outline-none focus:border-primary/50 transition-all text-white"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <FiX />
            </button>
          )}
        </div>
      </header>

      <div className="overflow-hidden bg-[#0a0f1c]/50 border border-slate-800 rounded-[2rem] shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="p-6 text-[10px] uppercase tracking-widest text-slate-500 font-black">Account</th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-slate-500 font-black">Role</th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-slate-500 font-black text-center">Permissions Management</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/50">
            <AnimatePresence>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u, index) => (
                  <motion.tr 
                    layout // This makes the row repositioning smooth
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={u._id} 
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                          <FiUser size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-white">{u.name || "Anonymous User"}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${
                          u.role === "admin"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : u.role === "creator"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <RoleButton 
                          active={u.role === "user"} 
                          loading={updatingEmail === u.email}
                          onClick={() => handleRoleChange(u.email, "user")}
                          label="User"
                        />
                        <RoleButton 
                          active={u.role === "creator"} 
                          loading={updatingEmail === u.email}
                          onClick={() => handleRoleChange(u.email, "creator")}
                          label="Creator"
                          variant="warning"
                        />
                        <RoleButton 
                          active={u.role === "admin"} 
                          loading={updatingEmail === u.email}
                          onClick={() => handleRoleChange(u.email, "admin")}
                          label="Admin"
                          variant="error"
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan="3" className="p-20 text-center">
                    <p className="text-slate-500 italic">No users found matching "{searchQuery}"</p>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================= HELPER BUTTON COMPONENT ================= */
const RoleButton = ({ active, loading, onClick, label, variant = "default" }) => {
  const styles = {
    default: "hover:bg-slate-700 text-slate-400",
    warning: "hover:bg-amber-500/20 text-amber-500/60 hover:text-amber-400",
    error: "hover:bg-red-500/20 text-red-500/60 hover:text-red-400"
  };

  return (
    <button
      disabled={active || loading}
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase transition-all duration-200 border border-transparent ${
        active 
          ? "bg-slate-800/50 text-slate-600 cursor-not-allowed opacity-30" 
          : styles[variant] + " bg-slate-900 border-slate-800"
      }`}
    >
      {loading ? "..." : label}
    </button>
  );
};

export default ManageUsers;