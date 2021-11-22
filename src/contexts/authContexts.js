import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { db, auth } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error,setError] = useState("")

  const register = ({ ...userData }) => {
    return axios
      .post(
        `https://asia-northeast1-my-project-1545051214681.cloudfunctions.net/api/signUp`,
        userData
      )
      .then((info) => {
        console.log(userData)
        auth.signInWithEmailAndPassword(userData.email, userData.password);
      }).catch(err=>setError(err));
  };

  const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const forgotPassword = (email, continueUrl) => {
    return auth.sendPasswordResetEmail(email, {
      url: continueUrl,
    });
  };

  const logout = () => {
    return auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currUser) => {
      if (currUser) {
        auth.currentUser.getIdTokenResult().then((user) => {
          //fetch photographer user detail only if email is verified
          db.collection("users")
            .where("email", "==", currUser.email)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                setActiveUser({ ...doc.data(), id: doc.id });
                setCurrentUser(user);
                setIsAuthLoading(false);
              });
            });
        });
      } else {
        setCurrentUser(null);
        setIsAuthLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = {
    register,
    login,
    currentUser,
    activeUser,
    forgotPassword,
    logout,
    error,
    setActiveUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
