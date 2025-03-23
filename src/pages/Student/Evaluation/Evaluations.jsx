import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import axios from "axios";

const Evaluations = () => {
  const { getDecryptedId, storeEncryptedId } = useContext(AuthContext);
  const studentId = getDecryptedId("uid"); // Get student ID from AuthContext
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const address = getIpAddress();

  function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(":");
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  const getEvaluationTypeLabel = (type) => {
    const typeMapping = {
      STUDENT_TO_STUDENT: "Team Evaluation",
      STUDENT_TO_ADVISER: "Adviser Evaluation",
    };
    return typeMapping[type] || type.replace(/_/g, " ");
  };

  useEffect(() => {
    const fetchEvaluations = async () => {
      if (!studentId) {
        setError("User ID is missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://${address}:8080/student/${studentId}/available-evaluations`
        );
        setEvaluations(response.data);
      } catch (error) {
        console.error("Error fetching evaluations:", error);
        setError("Failed to fetch evaluations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [studentId]);

  const handleViewStatus = async (evaluationId, classId, evaluationType) => {
    storeEncryptedId("cid", classId);
    storeEncryptedId("eid", evaluationId);
  
    if (evaluationType === "STUDENT_TO_ADVISER") {
      try {
        const response = await axios.get(
          `http://${address}:8080/evaluation/${studentId}/class/${classId}/adviser`
        );
  
        if (response.data) {
          storeEncryptedId("adviserId", response.data.adviserId);
          storeEncryptedId("adviserName", response.data.adviserName);
          navigate("/student/student-teacher-status"); // Redirect to teacher evaluation page
        } else {
          alert("No adviser found for this evaluation.");
        }
      } catch (error) {
        console.error("Error fetching adviser:", error);
        alert("Failed to fetch adviser details.");
      }
    } else {
      navigate("/student/evaluation-status"); // Default route for team evaluations
    }
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole="STUDENT" />
      <div className="p-8 bg-white shadow-md rounded-md w-full">
        <h1 className="text-lg font-semibold text-teal text-center mb-6">Available Evaluations</h1>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {loading ? (
          <div className="text-center text-gray-500">Loading evaluations...</div>
        ) : evaluations.length === 0 ? (
          <div className="text-center text-gray-500">No open evaluations available.</div>
        ) : (
          <div className="overflow-y-auto max-h-96 rounded-lg shadow-md">
            <table className="min-w-full border border-gray-300">
              <thead className="sticky top-0 bg-[#323c47] text-white shadow-md">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Evaluation Type</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Course Description</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Period</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Date Open</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Date Close</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Availability</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((evalItem, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{getEvaluationTypeLabel(evalItem.evaluationType)}</td>
                    <td className="px-4 py-2">{evalItem.courseDescription || "N/A"}</td>
                    <td className="px-4 py-2">{evalItem.period || "N/A"}</td>
                    <td className="px-4 py-2">{evalItem.dateOpen || "N/A"}</td>
                    <td className="px-4 py-2">{evalItem.dateClose || "N/A"}</td>
                    <td className="px-4 py-2">{evalItem.availability || "N/A"}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-[#323c47] text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition-all"
                        onClick={() => handleViewStatus(evalItem.eid, evalItem.classId, evalItem.evaluationType)}
                      >
                        View Status
                      </button>
                    </td>
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

export default Evaluations;