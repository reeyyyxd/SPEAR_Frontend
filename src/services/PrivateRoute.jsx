import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const PrivateRoute = ({ children, requiredRoles }) => {
  const { authState } = useContext(AuthContext);

  // Delay rendering until `authState` is initialized
  if (authState.token === null) {
    return <div>Loading...</div>; // Show a loader or placeholder
  }

  // Check if user is authenticated and has the required role
  if (!authState.isAuthenticated || !requiredRoles.includes(authState.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
