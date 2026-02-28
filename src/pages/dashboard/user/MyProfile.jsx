import React, { useEffect, useState } from "react";
import axiosPublic from "../../../api/axiosSecure";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";
import userProfile from "../../../assets/userProfile.png";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit3, FiCamera, FiCheck, FiX } from "react-icons/fi";

const MyProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [me, setMe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosPublic.get("/users/me").then((res) => {
      setMe(res.data);
      setName(res.data.name || "");
      setBio(res.data.bio || "");
      setPhotoURL(res.data.photo || user?.photoURL || "");
    });
  }, [user?.photoURL]);

  if (!me) return (
    <div className="flex justify-center py-20">
      <span className="loading loading-ring loading-lg text-primary"></span>
    </div>
  );

  const participated = me.participatedContests?.length || 0;
  const wins = me.wonContests?.length || 0;
  const winPercentage = participated === 0 ? 0 : Math.round((wins / participated) * 100);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      let updatedPhoto = photoURL;
      if (photoFile) {
        const formData = new FormData();
        formData.append("image", photoFile);
        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgHost}`,
          formData
        );
        updatedPhoto = imgRes.data.data.url;
      }

      await updateUserProfile({ displayName: name, photoURL: updatedPhoto });
      await axiosPublic.patch(`/users/profile/${user.email}`, {
        name,
        photo: updatedPhoto,
        bio,
      });

      setPhotoURL(updatedPhoto);
      setShowModal(false);
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        background: "#0a0f1c",
        color: "#fff",
        confirmButtonColor: "#fbbf24",
      });
    } catch (err) {
      Swal.fire("Error", "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-black text-white mb-8">My <span className="text-primary">Profile</span></h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <img
                  src={photoURL || userProfile}
                  className="w-32 h-32 rounded-3xl border-4 border-slate-800 object-cover shadow-2xl"
                  alt="Profile"
                />
                <div className="absolute inset-0 bg-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FiCamera className="text-white text-2xl" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <p className="text-3xl font-black text-white">{name}</p>
                <p className="text-primary font-bold text-sm tracking-widest uppercase mt-1">{me.role || "Participant"}</p>
                <p className="text-slate-500 mt-2">{me.email}</p>
                {bio && <p className="mt-4 text-slate-400 italic">"{bio}"</p>}
                
                <button 
                  onClick={() => setShowModal(true)}
                  className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-bold text-sm"
                >
                  <FiEdit3 /> Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            <Stat label="Total Participated" value={participated} />
            <Stat label="Victories Claimed" value={wins} />
          </div>
        </div>

        {/* Win Rate Section */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center">
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-6">Success Rate</p>
          <div 
            className="radial-progress text-primary mb-4" 
            style={{ "--value": winPercentage, "--size": "12rem", "--thickness": "12px" }}
            role="progressbar"
          >
            <span className="text-3xl font-black text-white">{winPercentage}%</span>
          </div>
          <p className="text-slate-400 text-sm">Winning probability based on contest history.</p>
        </div>
      </div>

      {/* UPDATE MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-[#0a0f1c] border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl"
            >
              <h3 className="text-2xl font-black text-white mb-6">Update Your <span className="text-primary">Identity</span></h3>
              
              <div className="space-y-5">
                <div className="form-control">
                  <label className="label text-slate-500 font-bold text-xs uppercase">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="input bg-slate-900 border-slate-700 rounded-xl focus:border-primary text-white"
                  />
                </div>

                <div className="form-control">
                  <label className="label text-slate-500 font-bold text-xs uppercase">Your Bio</label>
                  <textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    className="textarea bg-slate-900 border-slate-700 rounded-xl focus:border-primary text-white h-24"
                    placeholder="Tell the world about your skills..."
                  />
                </div>

                <div className="form-control">
                  <label className="label text-slate-500 font-bold text-xs uppercase">Profile Picture</label>
                  <input 
                    type="file" 
                    onChange={(e) => setPhotoFile(e.target.files[0])}
                    className="file-input file-input-bordered bg-slate-900 border-slate-700 rounded-xl w-full"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handleUpdateProfile} 
                    disabled={loading}
                    className="flex-1 btn btn-primary rounded-xl font-black"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="btn btn-ghost rounded-xl text-slate-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 text-center group hover:border-primary/30 transition-all">
    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">{label}</p>
    <p className="text-4xl font-black text-white tracking-tighter group-hover:text-primary transition-colors">{value}</p>
  </div>
);

export default MyProfile;