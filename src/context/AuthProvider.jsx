import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.init";
import axiosPublic from "../api/axiosPublic";

const googleProvider = new GoogleAuthProvider();

const syncJwtSession = async (targetUser = auth.currentUser) => {
  if (!targetUser?.email) {
    localStorage.removeItem("access-token");
    return null;
  }

  const jwtRes = await axiosPublic.post("/jwt", {
    email: targetUser.email,
    name: targetUser.displayName || "",
    photo: targetUser.photoURL || "",
  });

  if (jwtRes?.data?.token) {
    localStorage.setItem("access-token", jwtRes.data.token);
    return jwtRes.data;
  }

  return null;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshJwtSession = syncJwtSession;

  const registerUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const signInUser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signInGoogle = () =>
    signInWithPopup(auth, googleProvider);

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setLoading(false);
  };

  const updateUserProfile = profile =>
    updateProfile(auth.currentUser, profile);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser?.email) {
        refreshJwtSession(currentUser).catch((error) => {
          console.error("JWT sync failed:", error?.response?.data || error.message);
        });
      } else {
        localStorage.removeItem("access-token");
      }
    });

    return unsubscribe;
  }, []);

  const authInfo = {
    user,
    loading,
    registerUser,
    signInUser,
    signInGoogle,
    logout,
    updateUserProfile,
    refreshJwtSession,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
