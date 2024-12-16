import React from "react";
import { useNavigate } from "react-router-dom";

const ApplyTeamsTable = ({ teams = [] }) => {
  const navigate = useNavigate();

  // Handle row click and redirect
  const handleRowClick = (teamId) => {
    navigate(`/team-formation/apply-team/${teamId}`); // Redirect to the team application page
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="p-2 min-w-full inline-block align-middle">
          <div className="overflow-hidden rounded-lg border border-gray-300">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-800 text-white font-medium">
                  {[
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
                {teams.map((team) => (
                  <tr
                    key={team.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRowClick(team.id)} // Add click event
                  >
                    {/* Project Name */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {team.name || "N/A"}
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {team.description || "N/A"}
                    </td>

                    {/* Features */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {team.features || "N/A"}
                    </td>

                    {/* Adviser */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {team.adviser || "N/A"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-block px-3 py-3 rounded-md font-semibold 
                          ${
                            team.status === "APPROVED"
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {team.status || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {teams.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No projects found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyTeamsTable;
