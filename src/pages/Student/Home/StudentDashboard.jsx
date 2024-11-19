import React, { useContext } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext"; // Adjust path

const StudentDashboard = () => {
  const { authState } = useContext(AuthContext); // Get the auth state from context

  if (!authState.isAuthenticated) {
    // Optionally handle the case where the user is not authenticated (e.g., redirect to login)
    return <div>Loading...</div>; // Or redirect to login if needed
  }

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="p-4">Student Dashboard Content</div>
    </div>
  );
};

export default StudentDashboard;
