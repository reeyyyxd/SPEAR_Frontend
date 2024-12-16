import React, { useContext, useState, useEffect } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import ProjectProposalService from "../../../services/ProjectProposalService";
import { useNavigate, useParams } from "react-router-dom";

const TeamFormation = () => {
  const { authState, getDecryptedId } = useContext(AuthContext);
  const [proposal, setProposal] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { teamId } = useParams(); 
  const classId = getDecryptedId("cid");
  const navigate = useNavigate();

  // Navigate to the TeamApplication page
  const handleNavigate = () => {
    if (teamId) {
      navigate(`/team-formation/apply-team/${teamId}/TeamApplication`);
    } else {
      console.error("Team ID is not available in the URL.");
    }
  };

  // Fetch project proposal details
  const fetchProjectDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching project with teamId:", teamId);

      // Fetch project proposal details by class and student
      const projectData = await ProjectProposalService.getProposalsByClassAndStudent(
        classId,
        authState.uid
      );
      console.log("Fetched Project Data:", projectData);

      // Check if data is an array and set the first proposal
      if (Array.isArray(projectData) && projectData.length > 0) {
        setProposal(projectData[0]); 
      } else {
        setError("Project data not found.");
      }
    } catch (err) {
      setError("Failed to fetch project details.");
      console.error("Error fetching project details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch details on component mount or when teamId changes
  useEffect(() => {
    fetchProjectDetails();
  }, [teamId]);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />

      {/* Main Content */}
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        {/* Header Section */}
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold my-6">Project Proposal Summary</h1>
        </div>

        {/* Form Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          {loading ? (
            <div>Loading project details...</div>
          ) : error ? (
            <div>{error}</div>
          ) : proposal ? (
            <div className="project-details">
              <h2 className="text-xl font-semibold">
                {proposal.projectName || "N/A"}
              </h2>
              <p>
                <strong>Description:</strong> {proposal.description || "N/A"}
              </p>
              <p>
                <strong>Features:</strong>{" "}
                {proposal.features && proposal.features.length > 0
                  ? proposal.features.join(", ")
                  : "N/A"}
              </p>
              <p>
                <strong>Class:</strong> {proposal.courseCode || "N/A"}
              </p>
            </div>
          ) : (
            <div>No project details available.</div>
          )}

          {/* Submit Button */}
          <div className="text-right mt-6">
            <button
              type="button" 
              className="w-1/6 h-1/4 ml-4 bg-teal text-white rounded-lg p-4 text-sm text-center hover:bg-peach mx-2"
              onClick={handleNavigate} 
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



export default TeamFormation;
