import React, { useContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import AuthContext from "../../services/AuthContext"; // Adjust path
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { authState } = useContext(AuthContext); // Get the auth state from context
  const navigate = useNavigate();

  if (!authState.isAuthenticated) {
    // Redirect to login if not authenticated
    navigate("/login");
  }

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="p-4">Admin Dashboard Content</div>
    </div>
  );
};

export default AdminDashboard;
