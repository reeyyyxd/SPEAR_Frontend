// this is real!!!
import React, { useEffect, useState, useContext } from "react";
import axios from "axios"; 
import Navbar from "../../../components/Navbar/Navbar";
import ApplyTeamsTable from "../../../components/Tables/ApplyTeamsTable";
import AuthContext from "../../../services/AuthContext";

const ApplyTeamsPage = () => {
  const { authState, getDecryptedId } = useContext(AuthContext);
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const classId = getDecryptedId("cid");

  useEffect(() => {
    const fetchApprovedProjects = async () => {
      setError(null); 

      try {
        if (!classId) {
          setError("Class ID not found. Please navigate to your class first.");
          setLoading(false);
          return;
        }

        setLoading(true);

        const response = await axios.get(
          `http://localhost:8080/proposals/class/${classId}/approved`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );

        // console.log("API Response:", response.data); 
        if (!response.data || response.data.length === 0) {
          setApprovedProjects([]); 
          return;
        }

        
        const mappedProjects = response.data.map((project) => ({
          id: project.pid || "N/A",
          name:
            project.project_name?.trim() ||
            project.name?.trim() || 
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
          <p className="text-center text-gray-500">Loading approved projects...</p>
        )}

  
        {error && <p className="text-center text-red-500">{error}</p>}
 
        {!loading && !error && (
          approvedProjects.length > 0 ? (
            <ApplyTeamsTable teams={approvedProjects} />
          ) : (
            <p className="text-center text-gray-500 py-4 font-semibold">
              No teams are open
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default ApplyTeamsPage;

