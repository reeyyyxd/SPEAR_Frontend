import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../services/AuthContext";
import ProjectProposalService from "../../services/ProjectProposalService";

const ManageTeamsTable = () => {
  const { authState } = useContext(AuthContext);
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovedProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all approved projects
        const response = await ProjectProposalService.getProposalsByStatus(
          "APPROVED",
          authState.token
        );

        console.log("API Response:", response); // Debugging: Log the API response

        // Map API response to table format
        const mappedProjects = response.map((project) => ({
          id: project.pid,
          projectId: project.pid,
          courseCode: project.courseCode || "N/A",
          name: project.projectName || "N/A",
          description: project.description || "N/A",
          features: project.features
            ? project.features.map((feature) => feature.featureTitle).join(", ")
            : "N/A",
          adviser: project.adviser || "No Adviser",
          status: project.status || "N/A",
        }));

        setApprovedProjects(mappedProjects);
      } catch (err) {
        setError("Failed to fetch approved projects.");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedProjects();
  }, [authState.token]);

  const handleRowClick = (teamId) => {
    navigate(`/manage-teams/${teamId}`);
  };

  return (
    <div className="flex flex-col">
      {loading && <p>Loading approved projects...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <div className="p-2 min-w-full inline-block align-middle">
            <div className="overflow-hidden rounded-lg border border-gray-300">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-800 text-white font-medium">
                    {[
                      "Course Code",
                      "Project Name",
                      "Description",
                      "Features",
                      "Adviser",
                      "Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="px-6 py-3 text-start text-md"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {approvedProjects.map((team) => (
                    <tr
                      key={team.id}
                      className="hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleRowClick(team.id)}
                    >
                      {/* Course Code */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {team.courseCode}
                      </td>

                      {/* Project Name */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {team.name}
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {team.description}
                      </td>

                      {/* Features */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {team.features}
                      </td>

                      {/* Adviser */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {team.adviser}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-md font-semibold 
                            ${
                              team.status === "APPROVED"
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                        >
                          {team.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {approvedProjects.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No approved projects found.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeamsTable;
