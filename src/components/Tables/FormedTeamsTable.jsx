import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../services/AuthContext";
import TeamService from "../../services/TeamService";

const FormedTeamsTable = () => {
  const { authState } = useContext(AuthContext);
  const [formedTeams, setFormedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFormedTeams = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all formed teams
        const response = await TeamService.getAllActiveTeams(authState.token);

        console.log("API Response:", response); // Debugging: Log the API response

        // Map API response to table format
        const mappedTeams = response.map((team) => ({
          id: team.teamId,
          groupName: team.groupName || "N/A",
          projectName: team.projectName || "N/A",
          members: team.members
            ? team.members.map((m) => m.name).join(", ")
            : "N/A",
          status: team.status || "N/A",
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
                    {["Group Name", "Project Name", "Members", "Status"].map(
                      (heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="px-6 py-3 text-start text-md"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formedTeams.map((team) => (
                    <tr
                      key={team.id}
                      className="hover:bg-gray-100 cursor-pointer"
                    >
                      {/* Group Name */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {team.groupName}
                      </td>

                      {/* Project Name */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {team.projectName}
                      </td>

                      {/* Members */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {team.members}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
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
