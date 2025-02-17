import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import axios from "axios";

const TeamDetails = () => {
  const { authState, getDecryptedId } = useContext(AuthContext);
  const [teamDetails, setTeamDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamDetails = async () => {
      const teamId = getDecryptedId("tid");
      if (!teamId) {
        console.error("Team ID is not available.");
        setLoading(false);
        return;
      }

      try {
        // Fetch team details including leader, features, and project description
        const { data } = await axios.get(`http://localhost:8080/teams/${teamId}`, {
          headers: { Authorization: `Bearer ${authState.token}` },
        });

        // Fetch leader's name
        const leaderResponse = await axios.get(
          `http://localhost:8080/teams/leader/${data.leaderId}`,
          { headers: { Authorization: `Bearer ${authState.token}` } }
        );

        data.leaderName = leaderResponse.data.leaderName || "N/A";
        setTeamDetails(data);

        // Fetch team members
        const membersResponse = await axios.get(
          `http://localhost:8080/teams/${teamId}/members`,
          { headers: { Authorization: `Bearer ${authState.token}` } }
        );

        setMembers(membersResponse.data);
      } catch (error) {
        console.error("Error fetching team details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [authState, getDecryptedId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-teal">Loading team details...</p>
      </div>
    );
  }

  if (!teamDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-500">Team details not found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState?.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
      <div className="flex justify-start mb-4">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        <h1 className="text-lg font-semibold mb-6 text-center">Team Details</h1>

        <div className="bg-gray-100 shadow-md rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{teamDetails.groupName}</h2>
          <p className="text-md text-gray-700 mb-2">
            <strong>Leader:</strong> {teamDetails.leaderName}
          </p>
          <p className="text-md text-gray-700 mb-2">
            <strong>Recruitment Status:</strong>{" "}
            {teamDetails.recruitmentOpen ? "Open" : "Closed"}
          </p>

          {/* Members List */}
          <p className="text-md text-gray-700 mb-2">
            <strong>Members:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700">
            {members.length > 0 ? (
              members.map((member, index) => (
                <li key={index}>
                  {member.firstname} {member.lastname}
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No members found.</p>
            )}
          </ul>

          {/* Project Details */}
          {teamDetails.projectName && (
            <div className="mt-6">
              <h3 className="text-md font-bold text-gray-800 mb-2">Project Details</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-bold">Project Name</th>
                    <th className="px-6 py-3 text-left text-sm font-bold">Description</th>
                    <th className="px-6 py-3 text-left text-sm font-bold">Features</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4">{teamDetails.projectName}</td>
                    <td className="px-6 py-4">{teamDetails.projectDescription}</td>
                    <td className="px-6 py-4">
                      {teamDetails.features?.length > 0 ? (
                        teamDetails.features.map((feature, index) => (
                          <div key={index}>
                            <strong>{feature.featureTitle}:</strong>{" "}
                            {feature.featureDescription}
                          </div>
                        ))
                      ) : (
                        "No features available"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
