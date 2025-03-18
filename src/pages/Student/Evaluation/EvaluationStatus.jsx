import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import axios from "axios";

const EvaluationStatus = () => {
  const { getDecryptedId } = useContext(AuthContext);
  const navigate = useNavigate();

  const classId = getDecryptedId("cid");
  const studentId = getDecryptedId("uid");
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const address = getIpAddress();

  function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(":");
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  useEffect(() => {
    if (!classId || !studentId) {
      setError("Missing class ID or user ID. Please try again.");
      setLoading(false);
      return;
    }
    fetchTeamDetails();
  }, []);



  const fetchTeamDetails = async () => {
    try {
      const response = await axios.get(
        `http://${address}:8080/evaluation/${studentId}/class/${classId}/team`
      );

      let members = response.data.memberNames || [];

      const sortedMembers = members
        .filter((m) => m === studentId)
        .concat(members.filter((m) => m !== studentId));

      setTeam(sortedMembers);
    } catch (error) {
      console.error("Error fetching team details:", error);
      setError("Failed to load team details.");
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = () => {
    navigate("/student/student-evaluation");
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole="STUDENT" />

      <div className="p-8 bg-white shadow-md rounded-md w-full">
        {/* Back & Evaluate Buttons */}
        <div className="flex justify-between mb-6">
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        {/* Header with Title & Evaluate Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold text-teal flex-grow text-center">
            Team Members
          </h1>

          {/* Evaluate Button */}
          <button
            className="bg-[#323c47] text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
            onClick={handleEvaluate}
          >
            Evaluate
          </button>
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {loading ? (
          <div className="text-center text-gray-500">Loading team details...</div>
        ) : (
          <div className="overflow-y-auto max-h-96 rounded-lg shadow-md">
            <table className="min-w-full border border-gray-300">
              <thead className="sticky top-0 bg-[#323c47] text-white shadow-md">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Member Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                {team.map((member, index) => (
                  <tr key={index} className="border-b">
                    <td className={`px-4 py-2 ${member === studentId ? "font-bold text-blue-600" : ""}`}>
                      {member === studentId ? `${member} (You)` : member}
                    </td>
                    <td className="px-4 py-2">{member === studentId ? "Logged-in User" : "Team Member"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationStatus;