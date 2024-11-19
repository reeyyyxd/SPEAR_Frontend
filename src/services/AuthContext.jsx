import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const role = localStorage.getItem("role");

    if (token && isTokenExpired(token)) {
      console.log("Token is expired, attempting to refresh...");
      if (refreshToken) {
        refreshAccessToken(refreshToken); // Refresh the token
      } else {
        console.log("No refresh token available, logging out...");
        logout(); // No refresh token available
      }
    } else if (token && role) {
      setAuthState({
        token,
        role,
        isAuthenticated: true,
      });
    } else {
      console.log("No token or role found, logging out...");
      logout(); // No token or role found
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

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", newRefreshToken);

      setAuthState({
        token,
        role: localStorage.getItem("role"),
        isAuthenticated: true,
      });
      console.log("Token refreshed successfully.");
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout(); // Logout if token refresh fails
    }
  };

  const login = (token, role, refreshToken) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role);
    setAuthState({ token, role, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("refreshToken");
    setAuthState({ token: null, role: null, isAuthenticated: false });
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
