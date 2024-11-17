import React from "react";
import Navbar from "../../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import Header from "../../../components/Header/Header";

const TeamFormation = () => {
  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">
            Welcome to SPEAR's Team Formation
          </h1>
          <Header />
        </div>
        <div className="guidelines">
          <h1 className="text-lg font-semibold mt-16">Guidelines:</h1>
          <p className="mt-4">
            Select{" "}
            <span className="text-peach font-semibold">Project proposal</span>{" "}
            if you wish to propose a project and form your own team.
          </p>
          <p>
            Select{" "}
            <span className="text-peach font-semibold">Teams Application</span>{" "}
            if you wish to apply to join a team with existing approved project
            proposal.
          </p>
        </div>

        <div className="buttons flex mt-8 gap-8">
          {/* Use Link to navigate to project-proposal page */}
          <Link
            to="/team-formation/project-proposal"
            className="w-1/6 h-1/4 bg-teal text-white rounded-lg p-4 text-sm text-center hover:bg-peach"
          >
            Project Proposal
          </Link>

          {/* Use Link to navigate to teams-application page */}
          <Link
            to="/team-formation/teams-application"
            className="w-1/6 h-1/4 bg-teal text-white rounded-lg p-4 text-sm text-center hover:bg-peach"
          >
            Teams Application
          </Link>
        </div>

        <div className="status-table">
          <h1 className="text-lg font-medium my-6">Proposal status</h1>
        </div>
      </div>
    </div>
  );
};

export default TeamFormation;
