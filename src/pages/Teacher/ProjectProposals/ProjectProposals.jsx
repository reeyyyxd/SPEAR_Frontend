import React from "react";
import Navbar from "../../../components/Navbar/Navbar";

const ProjectProposals = () => {
  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12 font-medium">
        Project Proposals
      </div>
    </div>
  );
};

export default ProjectProposals;
