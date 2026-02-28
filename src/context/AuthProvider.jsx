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

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

      if (currentUser?.email) {
        // refresh backend JWT cookie
        await axiosPublic.post("/jwt", {
          email: currentUser.email,
          name: currentUser.displayName || "",
          photo: currentUser.photoURL || "",
        });
      }

      setLoading(false);
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
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
