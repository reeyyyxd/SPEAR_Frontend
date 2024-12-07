import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";

const TeamDetails = () => {
  const { authState, getDecryptedId } = useContext(AuthContext);
  const [teamDetails, setTeamDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamDetails = async () => {
      const teamId = getDecryptedId("tid"); // Retrieve team ID from local storage
      if (!teamId) {
        console.error("Team ID is not available.");
        setLoading(false);
        return;
      }

      try {
        // Fetch team details including leader, features, and project description
        const response = await fetch(`http://localhost:8080/teams/${teamId}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch team details: ${response.status}`);
        }

        const data = await response.json();

        // Fetch leader's name
        const leaderResponse = await fetch(`http://localhost:8080/teams/leader/${data.leaderId}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        if (!leaderResponse.ok) {
          throw new Error("Failed to fetch leader's name");
        }

        const leaderData = await leaderResponse.json();
        data.leaderName = leaderData.leaderName || "N/A"; // Combine leader name into team details
        setTeamDetails(data);

        // Fetch team members
        const membersResponse = await fetch(
          `http://localhost:8080/teams/${teamId}/members`,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );

        if (!membersResponse.ok) {
          throw new Error("Failed to fetch team members");
        }

        const membersData = await membersResponse.json();
        setMembers(membersData);
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
        {/* Back Button */}
        <span
          className="text-teal cursor-pointer hover:underline transition-all duration-300 mb-4 inline-block"
          onClick={() => navigate(-1)}
        >
          Back to Teams
        </span>

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