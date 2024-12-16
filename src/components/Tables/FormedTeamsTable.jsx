import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../services/AuthContext";
import TeamService from "../../services/TeamService";

const FormedTeamsTable = () => {
  const { authState } = useContext(AuthContext);
  const [formedTeams, setFormedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormedTeams = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all formed teams
        const response = await TeamService.getAllActiveTeams(authState.token);

        console.log("API Response:", response);
        response.forEach((team) => console.log("Team Object:", team));

        // Map API response to table format using `tid`
        const mappedTeams = response.map((team) => ({
          id: team.tid, // Use 'tid' as the unique key
          groupName: team.groupName || "N/A", // Correct key: 'groupName'
          projectName: team.projectName || "N/A", // Correct key: 'projectName'
          projectId: team.projectId || "N/A", // Correct key: 'projectId'
          classId: team.classId || "N/A", // Correct key: 'classId'
          leaderId: team.leaderId || "N/A", // Correct key: 'leaderId'
          status: team.recruitmentOpen ? "ACTIVE" : "INACTIVE", // Boolean check for 'recruitmentOpen'
        }));

        setFormedTeams(mappedTeams);
      } catch (err) {
        setError("Failed to fetch formed teams.");
        console.error("Error fetching teams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormedTeams();
  }, [authState.token]);

  // Use `tid` to redirect
  const handleRowClick = (tid, projectId) => {
    navigate(`/manage-teams/${tid}?projectId=${projectId}`);
  };

  return (
    <div className="flex flex-col">
      {loading && <p>Loading formed teams...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <div className="p-2 min-w-full inline-block align-middle">
            <div className="overflow-hidden rounded-lg border border-gray-300">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-800 text-white font-medium">
                    {[
                      "Group Name",
                      "Project Name",
                      "Project ID", // Add Project ID header
                      "Leader ID",
                      "Status",
                    ].map((heading, index) => (
                      <th
                        key={`${heading}-${index}`} // Ensures unique keys
                        scope="col"
                        className="px-6 py-3 text-start text-md"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {formedTeams.map((team) => (
                    <tr
                      key={team.id}
                      className="hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleRowClick(team.id, team.projectId)}
                    >
                      {/* Group Name */}
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {team.groupName}
                      </td>

                      {/* Project Name */}
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {team.projectName}
                      </td>

                      {/* Project ID */}
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {team.projectId}
                      </td>

                      {/* Leader ID */}
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {team.leaderId}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-md font-semibold ${
                            team.status === "ACTIVE"
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
              {formedTeams.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No formed teams found.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormedTeamsTable;