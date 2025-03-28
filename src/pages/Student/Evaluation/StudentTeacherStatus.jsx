import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import axios from "axios";
import { format } from "date-fns";

const StudentTeacherStatus = () => {
  const { getDecryptedId } = useContext(AuthContext);
  const navigate = useNavigate();

  const classId = getDecryptedId("cid");
  const studentId = parseInt(getDecryptedId("uid"), 10);
  const evaluationId = parseInt(getDecryptedId("eid"), 10);

  const [adviser, setAdviser] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const address = window.location.hostname;

  useEffect(() => {
    if (!classId || !studentId) {
      setError("Missing class ID or user ID. Please try again.");
      setLoading(false);
      return;
    }
    fetchAdviserDetails();
    fetchTeamMembers();
    fetchSubmissions();
  }, []);

  const fetchAdviserDetails = async () => {
    try {
      const response = await axios.get(
        `http://${address}:8080/evaluation/${studentId}/class/${classId}/adviser`
      );
      setAdviser(response.data.adviserName || "Unknown Adviser");
    } catch (error) {
      console.error("Error fetching adviser details:", error);
      setError("Failed to load adviser details.");
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(
        `http://${address}:8080/evaluation/${studentId}/class/${classId}/team`
      );
      if (!Array.isArray(response.data.memberIds) || !Array.isArray(response.data.memberNames)) {
        console.error("Unexpected response format for team members:", response.data);
        return;
      }
      const members = response.data.memberIds.map((id, index) => ({
        memberId: id,
        memberName: response.data.memberNames[index],
      }));
      setTeamMembers(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setError("Failed to load team members.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(
        `http://${address}:8080/submissions/by-evaluation/${evaluationId}`
      );
      setSubmissions(response.data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const getSubmissionDateByName = (name) => {
    const submission = submissions.find((sub) => sub.evaluatorName === name);
    if (!submission) return "Not Yet Submitted";
    return format(new Date(submission.submittedAt), "MMM d, yyyy - h:mm a");
  };

  const hasSubmitted = () => {
    return submissions.some(sub => sub.evaluatorId === studentId);
  }

  const handleEvaluate = () => {
    if (!hasSubmitted()) {
      navigate("/student/student-teacher-evaluation");
    }
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole="STUDENT" />

      <div className="p-8 bg-white shadow-md rounded-md w-full">

        <div className="flex justify-between mb-6">
          <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold text-teal flex-grow text-center">
            Adviser & Team Evaluation Tracker
          </h1>
          <button
            className={`px-4 py-2 rounded-md transition ${
              hasSubmitted() ? "bg-gray-400 cursor-not-allowed" : "bg-[#323c47] hover:bg-gray-900 text-white"
            }`}
            disabled={hasSubmitted()}
            onClick={handleEvaluate}
          >
            Evaluate
          </button>
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {loading ? (
          <div className="text-center text-gray-500">Loading details...</div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-md font-semibold text-gray-700 mb-2">Adviser Evaluation</h2>
              <table className="min-w-full border border-gray-300">
                <thead className="sticky top-0 bg-[#323c47] text-white shadow-md">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Adviser Name</th>
            
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-bold text-blue-600">{adviser}</td>
              
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h2 className="text-md font-semibold text-gray-700 mb-2">Team Members Evaluation</h2>
              <table className="min-w-full border border-gray-300">
                <thead className="sticky top-0 bg-[#323c47] text-white shadow-md">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Member Name</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Date Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.length > 0 ? (
                    teamMembers.map((member, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{member.memberName}</td>
                        <td className="px-4 py-2">{getSubmissionDateByName(member.memberName)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="px-4 py-2 text-center text-gray-500">
                        No team members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentTeacherStatus;