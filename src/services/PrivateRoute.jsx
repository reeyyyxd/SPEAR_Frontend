import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, requiredRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />; // Redirect to login if no token is found
  }

  if (!requiredRoles.includes(userRole)) {
    return <Navigate to="/notAuthorized" />; // Redirect if the role is not authorized
  }

  return children; // Render children if authenticated and authorized
};

export default PrivateRoute;
