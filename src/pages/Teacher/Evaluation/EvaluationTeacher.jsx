import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import axios from "axios";
import { Eye } from "lucide-react"

const EvaluationTeacher = () => {
  const { getDecryptedId, storeEncryptedId } = useContext(AuthContext);
  const teacherId = getDecryptedId("uid"); // Get logged-in teacher ID
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

  // const getEvaluationTypeLabel = (type) => {
  //   const typeMapping = {
  //     ADVISER_TO_STUDENT: "Advisory Teams",
  //   };
  //   return typeMapping[type] || type.replace(/_/g, " ");
  // };

  useEffect(() => {
    const fetchEvaluations = async () => {
      if (!teacherId) {
        setError("User ID is missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://${address}:8080/teacher/${teacherId}/available-evaluations`
        );

        // Filter evaluations to include only "ADVISER_TO_STUDENT"
        const filteredEvaluations = response.data.filter(
          (evaluation) => evaluation.evaluationType === "ADVISER_TO_STUDENT"
        );

        setEvaluations(filteredEvaluations);
      } catch (error) {
        console.error("Error fetching advisory teams:", error);
        setError("Failed to fetch advisory teams. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [teacherId]);

  const handleViewStatus = (evaluationId, classId, teamName) => {
    storeEncryptedId("cid", classId); // Store classId securely in local storage
    storeEncryptedId("eid", evaluationId); // Store evaluationId securely in local storage
    storeEncryptedId("teamName", teamName); // Store teamName securely
    navigate(`/teacher/teacher-evaluation-status`);
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole="TEACHER" />

      <div className="p-4 sm:p-6 md:p-8 bg-white shadow-md rounded-md w-full">
        <h1 className="text-lg sm:text-xl font-semibold text-teal text-center mb-6">
          Advisory Teams
        </h1>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {loading ? (
          <div className="text-center text-gray-500">
            Loading advisory teams...
          </div>
        ) : evaluations.length === 0 ? (
          <div className="text-center text-gray-500">
            No advisory teams available.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full text-sm sm:text-base border border-gray-300">
              <thead className="sticky top-0 bg-[#323c47] text-white shadow-md text-xs sm:text-sm">
                <tr>
                  <th className="px-3 sm:px-4 py-2 text-left font-semibold">
                    Team Name
                  </th>
                  <th className="px-3 sm:px-4 py-2 text-left font-semibold">
                    Course Description
                  </th>
                  <th className="px-3 sm:px-4 py-2 text-left font-semibold">
                    Period
                  </th>
                  <th className="px-3 sm:px-4 py-2 text-left font-semibold">
                    Date Open
                  </th>
                  <th className="px-3 sm:px-4 py-2 text-left font-semibold">
                    Date Close
                  </th>
                  <th className="px-3 sm:px-4 py-2 text-left font-semibold">
                    Availability
                  </th>
                  <th className="px-3 sm:px-4 py-2 text-left font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((evalItem, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-3 sm:px-4 py-2 font-medium">
                      {evalItem.teamName || "N/A"}
                    </td>
                    <td className="px-3 sm:px-4 py-2">
                      {evalItem.courseDescription || "N/A"}
                    </td>
                    <td className="px-3 sm:px-4 py-2">
                      {evalItem.period || "N/A"}
                    </td>
                    <td className="px-3 sm:px-4 py-2">
                      {evalItem.dateOpen || "N/A"}
                    </td>
                    <td className="px-3 sm:px-4 py-2">
                      {evalItem.dateClose || "N/A"}
                    </td>
                    <td className="px-3 sm:px-4 py-2">
                    <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                    evalItem.availability === "Open" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}
                   >
                      {evalItem.availability || "N/A"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-2">
                      <button
                        className="border border-gray-300 text-black px-3 py-1 rounded-lg hover:bg-gray-200 transition"
                        onClick={() =>
                          handleViewStatus(
                            evalItem.eid,
                            evalItem.classId,
                            evalItem.teamName
                          )
                        }
                      >
                         <Eye className="h-4 w-4 inline mr-1" />  
                        View Details
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

export default EvaluationTeacher;
