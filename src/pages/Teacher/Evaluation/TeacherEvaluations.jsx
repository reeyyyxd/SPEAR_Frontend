import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import * as XLSX from "xlsx";
import axios from "axios";
import { Eye } from "lucide-react"

const TeacherEvaluations = () => {
  const { getDecryptedId, storeEncryptedId } = useContext(AuthContext);
  const [evaluations, setEvaluations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [newEvaluation, setNewEvaluation] = useState({
    evaluationType: "",
    availability: "",
    dateOpen: "",
    dateClose: "",
    period: "Prelims",
  });
  const [customPeriodInput, setCustomPeriodInput] = useState("");

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showModal]);

  const address = getIpAddress();

  function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(":");
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const calculateAvailability = (dateOpen, dateClose) => {
    const currentDate = new Date();
    const openDate = new Date(dateOpen);
    const closeDate = new Date(dateClose);

    if (currentDate < openDate) {
      return "Closed"; // Before open date
    } else if (currentDate >= openDate && currentDate < closeDate) {
      return "Open"; // Between open and close dates
    } else {
      return "Closed"; // After close date
    }
  };

  const fetchEvaluations = async () => {
    try {
      const classId = getDecryptedId("cid");
      const response = await axios.get(
        `http://${address}:8080/teacher/class/${classId}/evaluations`
      );
      const sanitizedData = response.data.map((evaluation) => ({
        ...evaluation,
        dateOpen: evaluation.dateOpen || "",
        dateClose: evaluation.dateClose || "",
        period: evaluation.period || "",
      }));
      setEvaluations(sanitizedData);
    } catch (error) {
      console.error("Error fetching evaluations:", error);
    }
  };

  //create dont affect the fetch please :(

  const handleCreateEvaluation = async () => {
    if (!validateEvaluation()) return;

    try {
      const classId = getDecryptedId("cid");
      const url = `http://${address}:8080/teacher/create-evaluation/${classId}`;

      const body = cleanEvaluationData({
        ...newEvaluation,
        evaluationType: newEvaluation.evaluationType || "STUDENT_TO_STUDENT",
        period:
          newEvaluation.period === "Others"
            ? `${customPeriodInput.trim()}`
            : newEvaluation.period || "Prelims",
      });

      const response = await axios.post(url, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.data || !response.data.eid) {
        throw new Error(
          "Invalid server response. No evaluation data returned."
        );
      }

      alert(response.data.message || "Evaluation created successfully!");

      // Ensure response data is correctly structured
      const newEval = {
        ...response.data,
        dateOpen: response.data.dateOpen || "N/A",
        dateClose: response.data.dateClose || "N/A",
        availability: calculateAvailability(
          response.data.dateOpen,
          response.data.dateClose
        ),
      };

      setEvaluations((prev) => [...prev, newEval]);

      setShowModal(false);
      setNewEvaluation({
        evaluationType: "STUDENT_TO_STUDENT", // Default value
        availability: "",
        dateOpen: "",
        dateClose: "",
        period: "Prelims",
      });
    } catch (error) {
      console.error("Error creating evaluation:", error);

      if (error.response) {
        console.error("Server responded with:", error.response.status);
        console.error("Response data:", error.response.data);
        setError(
          error.response?.data?.error ||
            `Server Error: ${error.response.status}`
        );
      } else if (error.request) {
        console.error("No response received from server.");
        setError("No response from server. Please check your connection.");
      } else {
        console.error("Error setting up the request:", error.message);
        setError("Unexpected error. Please try again.");
      }
    }
  };

  const cleanEvaluationData = (evaluation) => {
    const cleaned = {};
    Object.keys(evaluation).forEach((key) => {
      if (evaluation[key]) {
        cleaned[key] = evaluation[key];
      }
    });
    return cleaned;
  };

  const handleDeleteEvaluation = async (eid) => {
    if (!eid) {
      alert("Invalid evaluation ID");
      return;
    }

    if (window.confirm("Are you sure you want to delete this evaluation?")) {
      try {
        await axios.delete(
          `http://${address}:8080/teacher/delete-evaluation/${eid}`
        );
        alert("Evaluation deleted successfully!");
        fetchEvaluations();
      } catch (error) {
        console.error("Error deleting evaluation:", error);
      }
    }
  };

  const handleEditEvaluation = async () => {
    if (!validateEvaluation()) return;

    const eid = getDecryptedId("eid");
    if (!eid) {
      alert("Invalid evaluation ID");
      return;
    }

    const period =
      newEvaluation.period === "Others"
        ? `${customPeriodInput.trim()}`
        : newEvaluation.period || "Prelims";

    try {
      const response = await axios.put(
        `http://${address}:8080/teacher/update-evaluation/${eid}`,
        { ...newEvaluation, period }
      );
      alert("Evaluation updated successfully!");
      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.message || "Error updating evaluation.");
    }
  };

  const validateEvaluation = () => {
    const { dateOpen, dateClose } = newEvaluation || {};
    if (!dateOpen || !dateClose) {
      setError("Both open and close dates are required.");
      return false;
    }
    const openDate = new Date(dateOpen);
    const closeDate = new Date(dateClose);

    if (isNaN(openDate.getTime()) || isNaN(closeDate.getTime())) {
      setError("Invalid date format.");
      return false;
    }

    if (openDate >= closeDate) {
      setError("Date open must be earlier than date close.");
      return false;
    }

    setError("");
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvaluation((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const handleDownload = async (eid) => {
    if (!eid) {
      alert("Invalid evaluation ID");
      return;
    }
    try {
      const [submissions, responses] = await Promise.all([
        axios.get(`http://${address}:8080/submissions/by-evaluation/${eid}`),
        axios.get(`http://${address}:8080/responses/get-evaluation/${eid}`),
      ]);

      const workbook = XLSX.utils.book_new();

      const submissionsSheet = XLSX.utils.json_to_sheet(submissions.data);
      XLSX.utils.book_append_sheet(workbook, submissionsSheet, "Submissions");

      const responsesSheet = XLSX.utils.json_to_sheet(responses.data);
      XLSX.utils.book_append_sheet(workbook, responsesSheet, "Responses");

      XLSX.writeFile(
        workbook,
        `Evaluation_${eid}_Submissions_and_Responses.xlsx`
      );
      alert("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("An error occurred while exporting data to Excel.");
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole="TEACHER" />

      <div className="p-4 sm:p-6 md:p-8 bg-white shadow-md rounded-md w-full">
        {/* Header with Back and Create Evaluation buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <button
            className="bg-[#323c47] text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all w-full sm:w-auto"
            onClick={() => navigate(-1)}
          >
            Back
          </button>

          <button
            className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark transition-all duration-300 w-full sm:w-auto"
            onClick={() => {
              setShowModal(true);
              setNewEvaluation({
                evaluationType: "",
                availability: "",
                dateOpen: "",
                dateClose: "",
                period: "",
              });
            }}
          >
            Create Evaluation
          </button>
        </div>

        {/* Evaluation title */}
        <h1 className="text-lg sm:text-xl font-semibold text-teal text-center mb-6">
          Evaluations
        </h1>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-lg shadow-md max-h-[70vh]">
          <table className="min-w-full text-sm sm:text-base border border-gray-300">
            <thead className="sticky top-0 bg-[#323c47] text-white text-xs sm:text-sm shadow-md">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">
                  Evaluation Type
                </th>
                <th className="px-4 py-2 text-left font-semibold">Period</th>
                <th className="px-4 py-2 text-left font-semibold">Date Open</th>
                <th className="px-4 py-2 text-left font-semibold">
                  Date Close
                </th>
                <th className="px-4 py-2 text-left font-semibold">
                  Availability
                </th>
                <th className="px-4 py-2 text-left font-semibold">Questions</th>
                <th className="px-4 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((evalItem, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    {evalItem.evaluationType === "STUDENT_TO_STUDENT"
                      ? "Student to Student"
                      : evalItem.evaluationType === "STUDENT_TO_ADVISER"
                      ? "Student to Adviser"
                      : evalItem.evaluationType === "ADVISER_TO_STUDENT"
                      ? "Adviser to Student"
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">{evalItem.period || "N/A"}</td>
                  <td className="px-4 py-2">{evalItem.dateOpen || "N/A"}</td>
                  <td className="px-4 py-2">{evalItem.dateClose || "N/A"}</td>
                  <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                    evalItem.availability === "Open" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}
                   >
                    {evalItem.availability || "N/A"}
                  </span>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="border border-gray-300 text-black px-3 py-1 rounded-lg hover:bg-gray-200 transition"
                      onClick={() => {
                        storeEncryptedId("eid", evalItem.eid);
                        window.location.href = `/teacher/questions/${evalItem.eid}`;
                      }}
                    >
                      <Eye className="h-4 w-4 inline mr-1" />  
                      View
                    </button>
                  </td>
                  <td className="px-4 py-2 flex flex-wrap gap-2">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteEvaluation(evalItem.eid)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        setShowModal(true);
                        setNewEvaluation(evalItem);
                        storeEncryptedId("eid", evalItem.eid);
                      }}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                    {evalItem.evaluationType !== "STUDENT_TO_ADVISER" && (
                      <button
                        className="text-green-500 hover:text-green-700"
                        onClick={() => handleDownload(evalItem.eid)}
                      >
                        <i className="fa fa-download"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white w-full sm:w-3/4 md:w-2/3 lg:w-1/3 p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold mb-4">
                {newEvaluation.eid ? "Edit Evaluation" : "Create Evaluation"}
              </h2>
              <button
              type="button"
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700 mb-4"
            >
              ✖
            </button>
              </div>
              {error && (
                <div className="mb-4 text-red-500 text-sm">{error}</div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Evaluation Type
                </label>
                <select
                  name="evaluationType"
                  value={newEvaluation.evaluationType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                >
                  <option value="">Select Evaluation Type</option>
                  <option value="STUDENT_TO_STUDENT">Student to Student</option>
                  <option value="STUDENT_TO_ADVISER">
                    Student to Adviser (Applicable to Teams that have
                    Advisories)
                  </option>
                  <option value="ADVISER_TO_STUDENT">
                    Adviser to Student (Applicable to Teams that have
                    Advisories)
                  </option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Open
                </label>
                <input
                  type="date"
                  name="dateOpen"
                  value={newEvaluation.dateOpen}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Close
                </label>
                <input
                  type="date"
                  name="dateClose"
                  value={newEvaluation.dateClose}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period
                </label>
                <select
                  name="period"
                  value={newEvaluation.period}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (e.target.value !== "Others") {
                      setCustomPeriodInput("");
                    }
                  }}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                >
                  <option value="">Select Period</option>
                  <option value="Prelims">Prelims</option>
                  <option value="Midterms">Midterms</option>
                  <option value="Pre-Finals">Pre-Finals</option>
                  <option value="Finals">Finals</option>
                  <option value="Others">Others</option>
                </select>

                {newEvaluation.period === "Others" && (
                  <input
                    type="text"
                    placeholder="Enter custom period..."
                    value={customPeriodInput}
                    onChange={(e) => setCustomPeriodInput(e.target.value)}
                    className="mt-2 w-full border border-gray-300 px-3 py-2 rounded-lg"
                  />
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-teal text-white px-4 py-2 rounded-md hover:bg-peach transition"
                  onClick={() => {
                    if (newEvaluation?.eid) {
                      handleEditEvaluation();
                    } else {
                      handleCreateEvaluation();
                    }
                  }}
                >
                  {newEvaluation?.eid ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherEvaluations;
