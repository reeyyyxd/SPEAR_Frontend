import React from "react";
import Navbar from "../../Navbar/Navbar";
import Header from "../../Header/Header";

const ProjectSummary = () => {
  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">
            Project Summary
          </h1>
          <Header />
        </div>
      </div>
    </div>
  );
};

export default ProjectSummary;
