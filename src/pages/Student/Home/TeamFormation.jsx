import React, { useContext } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext"; // Adjust path

const TeamFormation = () => {
  const { authState } = useContext(AuthContext); // Get the auth state from context

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="p-4">Student Dashboard Content</div>
    </div>
  );
};

export default TeamFormation;
