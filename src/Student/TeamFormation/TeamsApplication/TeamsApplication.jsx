import React from "react";
import Navbar from "../../Navbar/Navbar";
import Header from "../../Header/Header";

const TeamsApplication = () => {
  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar />
      <div className="main-content bg-white text-teal md:px-20 lg:px-32 pt-12 md:pt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Teams Application</h1>
          <Header />
        </div>

        <div className="table">this is the table</div>
      </div>
    </div>
  );
};

export default TeamsApplication;
