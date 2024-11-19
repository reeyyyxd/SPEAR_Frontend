import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setAuthState({
        token,
        role,
        isAuthenticated: true,
      });
    }
  }, []);

  // login and update the context
  const login = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setAuthState({ token, role, isAuthenticated: true });
  };

  // logout and clear the context
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuthState({ token: null, role: null, isAuthenticated: false });
  };

  // check user roles
  const isAuthenticated = () => {
    return authState.isAuthenticated;
  };

  const isAdmin = () => {
    return authState.role === "ADMIN";
  };

  const isTeacher = () => {
    return authState.role === "TEACHER";
  };

  const isStudent = () => {
    return authState.role === "STUDENT";
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isTeacher,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
