import React, { useEffect, useState, useContext } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import ApplyTeamsTable from "../../../components/Tables/ApplyTeamsTable";
import ProjectProposalService from "../../../services/ProjectProposalService";
import AuthContext from "../../../services/AuthContext";

const ApplyTeamsPage = () => {
  const { authState, getDecryptedId } = useContext(AuthContext);
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const classId = getDecryptedId("cid");

  useEffect(() => {
    const fetchApprovedProjects = async () => {
      try {
        if (!classId) {
          setError("Class ID not found. Please navigate to your class first.");
          setLoading(false);
          return;
        }

        setLoading(true);

        // Fetch only approved projects
        const approvedProjectsData =
          await ProjectProposalService.getApprovedProposalsByClass(
            classId,
            authState.token
          );

        console.log("API Response:", approvedProjectsData); // Debugging step

        // Map API response and ensure clean values
        const mappedProjects = approvedProjectsData.map((project) => ({
          id: project.pid || "N/A",
          name:
            project.project_name?.trim() ||
            project.name?.trim() || // Check alternative names
            project.projectName?.trim() ||
            "N/A",
          description: project.description?.trim() || "N/A",
          features: Array.isArray(project.features)
            ? project.features
                .map((feature) => feature.featureTitle || "Unnamed Feature")
                .join(", ")
            : "N/A",
          adviser: project.adviser?.trim() || "No Adviser Assigned",
          status: project.status || "N/A",
        }));

        setApprovedProjects(mappedProjects);
      } catch (err) {
        setError("Failed to fetch approved projects. Please try again.");
        console.error("Error fetching approved projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedProjects();
  }, [authState.token, classId]);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Select Available Teams</h1>
        </div>
        {loading && (
          <p className="text-center text-gray-500">
            Loading approved projects...
          </p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && <ApplyTeamsTable teams={approvedProjects} />}
      </div>
    </div>
  );
};

export default ApplyTeamsPage;
