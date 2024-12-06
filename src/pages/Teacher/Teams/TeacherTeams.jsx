import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";

const TeacherTeams = () => {
  const { authState, getDecryptedId, storeEncryptedId } = useContext(AuthContext); // Include `storeEncryptedId` and `getDecryptedId`
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamsByClass = async () => {
      const classId = getDecryptedId("cid"); // Retrieve classId securely from local storage
      if (!classId) {
        console.error("Class ID is not available. Please ensure it's stored.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/teams/class/${classId}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch teams data: ${response.status}`);
        }

        const data = await response.json();
        setTeams(data || []);
      } catch (error) {
        console.error("Error fetching teams data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsByClass();
  }, [authState, getDecryptedId]);

  const handleTeamClick = (teamId) => {
    // Encrypt and store the teamId in local storage
    storeEncryptedId("tid", teamId);

    // Navigate to another page or perform another action as needed
    navigate(`/team-details`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-teal">Loading teams...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState?.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        {/* Back Button */}
        <span
          className="text-teal cursor-pointer hover:underline transition-all duration-300 mb-4 inline-block"
          onClick={() => navigate(-1)}
        >
          Back to Class Page
        </span>

        <h1 className="text-lg font-semibold mb-6 text-center">Teams</h1>
        <div className="bg-gray-100 shadow-md rounded-lg p-6">
          {teams.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-teal-500">
                  <th
                    className="px-6 py-3 text-left text-sm font-bold"
                    style={{ color: "#1a1a1a" }} // Darker font color
                  >
                    Group Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-bold"
                    style={{ color: "#1a1a1a" }} // Darker font color
                  >
                    Leader
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-bold"
                    style={{ color: "#1a1a1a" }} // Darker font color
                  >
                    Recruitment Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-bold"
                    style={{ color: "#1a1a1a" }} // Darker font color
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teams.map((team) => (
                  <tr key={team.tid}>
                    <td className="px-6 py-4 text-sm text-gray-900">{team.groupName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{team.leader}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {team.recruitmentOpen ? "Open" : "Closed"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                        onClick={() => handleTeamClick(team.tid)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No teams available for this class.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherTeams;
