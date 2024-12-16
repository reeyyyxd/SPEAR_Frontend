import React, { useContext, useState, useEffect } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import TeamRecruitmentService from "../../../services/TeamRecuitmentService";
import { useNavigate, useParams } from "react-router-dom";

const TeamApplication = () => {
  const { authState } = useContext(AuthContext);
  const { teamId } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [reason, setReason] = useState("");


  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />

      {/* Main Content */}
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        {/* Header Section */}
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold my-6">Team Application</h1>
        </div>
        
        {/* Form Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <form>
            <div className="mb-4">
              <label htmlFor="projectTitle" className="block text-sm font-semibold mb-2">
                Role to fill
              </label>
              <input
                id="projectTitle"
                type="text"
                className="w-full p-2 border rounded-md bg-white"
                placeholder="Enter position"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="overview" className="block text-sm font-semibold mb-2">
                Why Am I a Great Fit for the Team
              </label>
              <textarea
                id="overview"
                className="w-full p-2 border rounded-md bg-white"
                placeholder="Provide a brief reason"
                rows="4"
              />
            </div>

          {/* Submit Button */}
            <div className="text-right mt-6">
              <button
                type="submit"
                className="w-1/6 h-1/4 ml-4 bg-teal text-white rounded-lg p-4 text-sm text-center hover:bg-peach mx-2"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeamApplication;
