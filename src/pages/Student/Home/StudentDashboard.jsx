import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) {
      navigate("/login"); // Redirect to login if no role found
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  if (!userRole) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={userRole} />
      <div className="p-4">Student Dashboard Content</div>
    </div>
  );
};

export default StudentDashboard;
