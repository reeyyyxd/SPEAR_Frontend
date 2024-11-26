import React, { useContext } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";

const ProjectProposals = () => {
  const { authState } = useContext(AuthContext);

  if (!authState.isAuthenticated) {
    navigate("/login"); // Redirect to login if not authenticated
  }

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12 font-medium">
        Project Proposals
      </div>
    </div>
  );
};

export default ProjectProposals;
