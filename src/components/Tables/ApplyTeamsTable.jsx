import React from "react";
import deleteIcon from "../../assets/icons/delete-icon.svg";

const ApplyTeamsTable = () => {
  // Static data for demonstration
  const staticTeams = [
    {
      id: 1,
      name: "Team Alpha",
      members: ["Alice", "Bob", "Charlie"],
      creationDate: "2023-01-10",
    },
    {
      id: 2,
      name: "Team Beta",
      members: ["David", "Eve", "Frank"],
      creationDate: "2023-02-15",
    },
    {
      id: 3,
      name: "Team Gamma",
      members: ["Grace", "Hank", "Ivy"],
      creationDate: "2023-03-20",
    },
  ];

  const handleDelete = (teamId) => {
    const teamToDelete = staticTeams.find((team) => team.id === teamId);
    const confirmationMessage = `Are you sure you want to delete team "${teamToDelete?.name}"?`;

    const confirmDeletion = window.confirm(confirmationMessage);

    if (!confirmDeletion) {
      alert("Deletion cancelled.");
      return;
    }

    alert(`Team "${teamToDelete?.name}" deleted successfully (simulated).`);
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="p-2 min-w-full inline-block align-middle">
          <div className="overflow-hidden rounded-lg border border-gray-300">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-teal font-medium text-white">
                  {["Name", "Members", "Creation Date", "Action"].map(
                    (heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="px-6 py-2 text-start text-md font-medium"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {staticTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-gray-100">
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-teal-800">
                      {team.name}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-teal-800">
                      {team.members.join(", ")}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-teal-800">
                      {new Date(team.creationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-start text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => handleDelete(team.id)}
                        className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <img src={deleteIcon} alt="delete-icon" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {staticTeams.length === 0 && (
              <p className="text-center text-gray-500 py-4">No teams found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyTeamsTable;
