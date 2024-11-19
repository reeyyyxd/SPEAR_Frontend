import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext"; 

const PrivateRoute = ({ children, requiredRoles }) => {
  const { authState, isAuthenticated, isAdmin, isTeacher, isStudent } =
    useContext(AuthContext);

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to login if no token is found
  }

  // Check if the user's role is authorized to access the route
  if (requiredRoles && !requiredRoles.includes(authState.role)) {
    return <Navigate to="/notAuthorized" />; // Redirect if the role is not authorized
  }

  return children; // Render children if authenticated and authorized
};

export default PrivateRoute;
