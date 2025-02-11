import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../../services/AuthContext";
import Navbar from "../../../components/Navbar/Navbar";

const ManageTeamsPage = () => {
  const { authState } = useContext(AuthContext);
  const { tid } = useParams(); // Extract `tid` from the URL
  const [teamDetails, setTeamDetails] = useState(null); // Store team details
  const [projectDetails, setProjectDetails] = useState(null); // Store project details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch Team Details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = authState.token;

        const teamResponse = await fetch(`http://localhost:8080/teams/${tid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!teamResponse.ok) {
          throw new Error("Failed to fetch team details.");
        }

        const teamData = await teamResponse.json();
        setTeamDetails(teamData);
        console.log("Team Details:", teamData);

        // If projectId exists, fetch project details
        if (teamData?.projectId) {
          const projectResponse = await fetch(
            `http://localhost:8080/proposals/class/${teamData.classId}/approved`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!projectResponse.ok) {
            throw new Error("Failed to fetch project details.");
          }

          const projectData = await projectResponse.json();
          const project = projectData.find((p) => p.id === teamData.projectId);
          setProjectDetails(project || null);
          console.log("Project Details:", project);
        }
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Failed to fetch details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [tid, authState.token]);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState?.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <button
          className="bg-teal text-white px-4 py-2 my-8 rounded-lg hover:bg-peach hover:text-white"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        {loading ? (
          <p>Loading details...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            {/* Display Team Details */}
            {teamDetails && (
              <div className="mb-8">
                <h1 className="text-lg font-semibold">Team Details</h1>
                <p>Team Name: {teamDetails.groupName || "N/A"}</p>
                <p>Leader ID: {teamDetails.leaderId || "N/A"}</p>
                <p>Class ID: {teamDetails.classId || "N/A"}</p>
                <p>
                  Recruitment Status:{" "}
                  {teamDetails.recruitmentOpen ? "ACTIVE" : "INACTIVE"}
                </p>
              </div>
            )}

            {/* Display Project Details */}
            {projectDetails ? (
              <div>
                <h1 className="text-lg font-semibold">Project Details</h1>
                <p>Project Name: {projectDetails.projectName || "N/A"}</p>
                <p>Description: {projectDetails.description || "N/A"}</p>
                <p>Course Code: {projectDetails.courseCode || "N/A"}</p>
                <p>Adviser: {projectDetails.adviser || "N/A"}</p>
                <p>Status: {projectDetails.status || "N/A"}</p>
              </div>
            ) : (
              <p>No project details available for this team.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTeamsPage;