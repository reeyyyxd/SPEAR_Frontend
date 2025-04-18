import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../services/AuthContext";
import Navbar from "../../../components/Navbar/Navbar";
import axios from "axios";

const TeacherEvaluationStatus = () => {
  const { getDecryptedId } = useContext(AuthContext);
  const teamName = getDecryptedId("teamName");

  const [teamDetails, setTeamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const address = window.location.hostname;

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (!teamName) {
        setError("Team Name is missing. Please try again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://${address}:8080/evaluation/teacher/team-details/${encodeURIComponent(
            teamName
          )}`
        );
        setTeamDetails(response.data);
      } catch (error) {
        console.error("Error fetching team details:", error);
        setError("Failed to fetch team details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [teamName]);

  const handleEvaluateTeam = () => {
    navigate("/teacher/adviser-evaluation");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole="TEACHER" />

      <div className="p-4 sm:p-8 bg-white shadow-md rounded-md w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6">
          Team Evaluation Details
        </h1>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {loading ? (
          <div className="text-center text-gray-500">
            Loading team details...
          </div>
        ) : teamDetails ? (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-[600px] w-full bg-white border border-gray-300">
              <thead className="bg-gray-800 text-white text-sm sm:text-base">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold border">
                    Official Project
                  </th>
                  <th className="px-4 py-3 text-left font-semibold border">
                    Project Description
                  </th>
                  <th className="px-4 py-3 text-left font-semibold border">
                    Team Members
                  </th>
                  <th className="px-4 py-3 text-left font-semibold border">
                    Date Submitted
                  </th>
                  <th className="px-4 py-3 text-left font-semibold border">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b text-sm sm:text-base">
                  <td className="px-4 py-3 border">
                    {teamDetails.projectName || "No Project Assigned"}
                  </td>
                  <td className="px-4 py-3 border">
                    {teamDetails.projectDescription ||
                      "No Description Available"}
                  </td>
                  <td className="px-4 py-3 border">
                    {teamDetails.memberNames &&
                    teamDetails.memberNames.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {teamDetails.memberNames.map((member, index) => (
                          <li key={index}>{member}</li>
                        ))}
                      </ul>
                    ) : (
                      "No Team Members Found"
                    )}
                  </td>
                  <td className="px-4 py-3 border">
                    {teamDetails.dateSubmitted || "Not Submitted"}
                  </td>
                  <td className="px-4 py-3 border">
                    <button
                      className="bg-[#323c47] text-white px-4 py-2 rounded-md hover:bg-gray-900 transition w-full"
                      onClick={handleEvaluateTeam}
                    >
                      Evaluate Team
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No team details available.
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherEvaluationStatus;
