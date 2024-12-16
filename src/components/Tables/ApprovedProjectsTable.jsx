import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../services/AuthContext";
import ProjectProposalService from "../../services/ProjectProposalService";
import TeamService from "../../services/TeamService";
import FormTeamModal from "../Modals/FormTeamModal";

const ApprovedProjectsTable = () => {
  const { authState } = useContext(AuthContext);
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovedProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await ProjectProposalService.getProposalsByStatus(
          "APPROVED",
          authState.token
        );

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

  // Handle "Form Team" button click
  const handleFormTeamClick = (projectId) => {
    setSelectedProjectId(projectId); // Set the selected project ID
    setShowModal(true); // Open the modal
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
                      "Action",
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
                          className={`inline-block px-3 py-1 rounded-md font-semibold ${
                            team.status === "APPROVED"
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {team.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <button
                          onClick={() => handleFormTeamClick(team.projectId)}
                          className="bg-teal text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                          Form Team
                        </button>
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

      {/* Modal */}
      {showModal && (
        <FormTeamModal
          onClose={() => setShowModal(false)}
          projectId={selectedProjectId}
        />
      )}
    </div>
  );
};

export default ApprovedProjectsTable;