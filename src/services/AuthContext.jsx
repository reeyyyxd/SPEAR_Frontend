import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    uid: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const role = localStorage.getItem("role");
    const uid = localStorage.getItem("uid");

    if (token && isTokenExpired(token)) {
      console.log("Token is expired, attempting to refresh...");
      if (refreshToken) {
        refreshAccessToken(refreshToken); // Refresh the token
      } else {
        logout(); // No refresh token available
      }
    } else if (token && role && uid) {
      setAuthState({
        token,
        role,
        uid,
        isAuthenticated: true,
      });
    } else {
      logout(); // No token, role, or uid found
    }
  }, []);

  const isTokenExpired = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return decodedToken.exp < currentTime; // Compare expiry time
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Treat as expired if decoding fails
    }
  };

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await axios.post("http://localhost:8080/refresh-token", {
        token: refreshToken,
      });

      const { token, refreshToken: newRefreshToken } = response.data;

      // Store the new token and refresh token
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", newRefreshToken);

      setAuthState({
        token,
        role: localStorage.getItem("role"),
        uid: localStorage.getItem("uid"),
        isAuthenticated: true,
      });
      console.log("Token refreshed successfully.");
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout(); // Logout if token refresh fails
    }
  };

  const login = (token, role, refreshToken, uid) => {
    // Store the token, role, refreshToken, and uid in localStorage and state
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role);
    localStorage.setItem("uid", uid);

    setAuthState({
      token,
      role,
      uid,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("uid"); // Remove uid from localStorage
    setAuthState({
      token: null,
      role: null,
      uid: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        isAuthenticated: authState.isAuthenticated,
        isAdmin: authState.role === "ADMIN",
        isTeacher: authState.role === "TEACHER",
        isStudent: authState.role === "STUDENT",
        uid: authState.uid, // Expose uid if needed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
