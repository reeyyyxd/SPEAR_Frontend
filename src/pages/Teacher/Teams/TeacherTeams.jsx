import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import axios from "axios";

const TeacherTeams = () => {
  const { authState, getDecryptedId, storeEncryptedId } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaders, setLeaders] = useState({});
  const navigate = useNavigate();

  const address = getIpAddress();

  function getIpAddress() {
      const hostname = window.location.hostname;
      const indexOfColon = hostname.indexOf(':');
      return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  const fetchLeaderName = async (leaderId) => {
    try {
      const response = await axios.get(`http://${address}:8080/teams/leader/${leaderId}`, {
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      return response.data.leaderName || "N/A";
    } catch (error) {
      console.error("Error fetching leader's name:", error);
      return "N/A";
    }
  };

  useEffect(() => {
    const fetchTeamsByClass = async () => {
      const classId = getDecryptedId("cid");
      if (!classId) {
        console.error("Class ID is not available. Please ensure it's stored.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://${address}:8080/teams/class/${classId}`, {
          headers: { Authorization: `Bearer ${authState.token}` },
        });

        const data = response.data;

        const leaderPromises = data.map(async (team) => ({
          tid: team.tid,
          leaderName: await fetchLeaderName(team.leaderId),
        }));

        const leaderData = await Promise.all(leaderPromises);
        const leaderMap = leaderData.reduce((map, leader) => {
          map[leader.tid] = leader.leaderName;
          return map;
        }, {});

        setLeaders(leaderMap);
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
    storeEncryptedId("tid", teamId);
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
        <div className="flex justify-start mb-4">
          <button
            className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-peach hover:text-white"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

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
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {leaders[team.tid] || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {team.recruitmentOpen ? "Open" : "Closed"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <button
                        className="bg-blue-500 text-black px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                        onClick={() => handleTeamClick(team.tid)} // Extract, encrypt, and store tid
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
