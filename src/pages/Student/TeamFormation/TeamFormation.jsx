import React, { useContext } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Header from "../../../components/Header/Header";
import AuthContext from "../../../services/AuthContext";
import { useNavigate } from "react-router-dom";

const TeamFormation = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      {/* Main Content */}
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        {/* Header Section */}
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">
            Welcome to SPEAR'S team formation
          </h1>
          <Header />
        </div>

        {/* Guidelines Section */}
        <div className="guidelines mb-8">
          <h2 className="text-lg font-semibold mb-4">Guidelines:</h2>
          <p className="text-gray-700 mb-2">
            Select{" "}
            <span className="text-peach font-semibold">Project Proposal</span>{" "}
            if you wish to propose a project and form your own team.
          </p>
          <p className="text-gray-700">
            Select <span className="text-peach font-semibold">Apply Team</span>{" "}
            if you wish to apply to join a team with an existing approved
            project proposal.
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex gap-6 mb-8 justify-start">
          <button
            className="w-1/6 h-1/4 bg-peach text-white rounded-lg p-4 text-sm hover:bg-orange-500"
            onClick={() => navigate(`/team-formation/project-proposal`)}
          >
            Project Proposal
          </button>
          <button
            className="w-1/6 h-1/4 bg-gray-800 text-white rounded-lg p-4 text-sm hover:bg-gray-600"
            onClick={() => navigate(`/team-formation/apply-to-teams`)}
          >
            Apply Team
          </button>
        </div>

        {/* Proposal Status Table */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Proposal Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-2 px-4 text-left">Project Title</th>
                  <th className="py-2 px-4 text-left">Evaluation Status</th>
                  <th className="py-2 px-4 text-left">Applicants</th>
                  <th className="py-2 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100">
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4">-</td>
                  <td className="py-2 px-4">-</td>
                  <td className="py-2 px-4">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamFormation;
