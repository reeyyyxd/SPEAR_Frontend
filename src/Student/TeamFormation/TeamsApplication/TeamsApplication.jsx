import React from "react";
import Navbar from "../../Navbar/Navbar";
import Guidelines from "./Guidelines";
import { Link } from "react-router-dom";
import Header from "../../Header/Header";
import TeamsTable from "./TeamsTable";
import { Team } from "./teams-table";

const TeamsApplication = () => {
  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Teams Application</h1>
          <Header />
        </div>
        <Guidelines />
        <TeamsTable Team={Team} />
      </div>
    </div>
  );
};

export default TeamsApplication;
