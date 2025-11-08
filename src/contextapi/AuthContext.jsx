import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  userRegister,
  userLogin,
  refreshTokenApi,
} from "../services/userServices";
import api from "../Common API/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Auto-login from localStorage token
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      api
        .get("/accounts/user_profile/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCurrentUser(res.data))
        .catch((err) => {
          console.error("Failed to restore user", err);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // ✅ Silent refresh every 50 minutes
    const interval = setInterval(async () => {
      try {
        await refreshTokenApi();
        console.log("Access token refreshed silently ✅");
      } catch (err) {
        console.error("Auto refresh failed", err);
        logoutUser();
      }
    }, 50 * 60 * 1000); // every 50 min

    return () => clearInterval(interval);
  }, []);

  //Login
  const loginUser = async (username, password) => {
    try {
      const res = await userLogin({ username, password });
      console.log("Login Response:", res);
      const { access, refresh, user } = res;

      if (user.status === "blocked") {
        toast.error("Your account has been blocked by the admin.");
        return null;
      }

      // Save tokens & user info
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userId", user.id);
      setCurrentUser(user);
      toast.success(`Welcome back, ${user.first_name || user.username}!`);
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
      return user;
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 400) {
        toast.error("Invalid username or password.");
      } else {
        toast.error("Login failed. Try again later.");
      }

      return null;
    }
  };

  // ✅ Registration
  const registerUser = async (formData) => {
    try {
      await userRegister(formData);
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Error registering user", err);
      if (err.response?.status === 400) {
        toast.warning("Invalid details or user already exists!");
      } else {
        toast.error("Registration failed! Try again later.");
      }
    }
  };

  // ✅ Logout
  const logoutUser = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    toast.info("Logged out successfully.");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, registerUser, loginUser, logoutUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
