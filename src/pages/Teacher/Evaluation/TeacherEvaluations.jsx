import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import * as XLSX from 'xlsx';

const TeacherEvaluations = () => {
  const { getDecryptedId, storeEncryptedId } = useContext(AuthContext);
  const [evaluations, setEvaluations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [newEvaluation, setNewEvaluation] = useState({
    availability: "",
    dateOpen: "",
    dateClose: "",
    period: "",
  });

  // On component mount, fetch evaluations
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
    const response = await fetch(`http://localhost:8080/teacher/class/${classId}/evaluations`);
    if (!response.ok) {
      throw new Error("Failed to fetch evaluations");
    }
    const data = await response.json();

    // Ensure data is valid and avoid undefined fields
    const sanitizedData = data.map((evaluation) => ({
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



const handleCreateEvaluation = async () => {
  if (!validateEvaluation()) return;

  try {
    const classId = getDecryptedId("cid");
    const url = `http://localhost:8080/teacher/create-evaluation/${classId}`;

    const body = JSON.stringify(cleanEvaluationData(newEvaluation));

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create evaluation.");
    }

    const data = await response.json();
    alert(data.message || "Evaluation created successfully!");
    window.location.reload();
    setEvaluations((prev) => {
      if (!data || !data.evaluation) {
        console.error("data.evaluation is undefined. Skipping update.");
        return prev; // Return previous state if data.evaluation is invalid
      }
    
      const { dateOpen = "N/A", dateClose = "N/A", ...rest } = data.evaluation;
    
      return [
        ...prev,
        {
          ...rest,
          dateOpen,
          dateClose,
          availability: calculateAvailability(dateOpen, dateClose),
        },
      ];
    });
    

    setShowModal(false);
    setNewEvaluation({
      availability: "",
      dateOpen: "",
      dateClose: "",
      period: "",
    });
  } catch (error) {
    setError(error.message || "Error creating evaluation.");
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
    //console.log("Attempting to delete evaluation with ID:", eid);
    if (!eid) {
      alert("Invalid evaluation ID");
      return;
    }
  
    if (window.confirm("Are you sure you want to delete this evaluation?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/teacher/delete-evaluation/${eid}`,
          { method: "DELETE" }
        );
  
        if (!response.ok) {
          throw new Error("Failed to delete evaluation");
        }
  
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
  
    try {
      const response = await fetch(
        `http://localhost:8080/teacher/update-evaluation/${eid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEvaluation),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update evaluation.");
      }
  
      const updatedEvaluation = await response.json();
      alert("Evaluation updated successfully!");
      window.location.reload();
    } catch (error) {
      setError(error.message || "Error updating evaluation.");
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
      [name]: value,
    }));
  };

  const handleDownload = async (eid) => {
    if (!eid) {
      alert("Invalid evaluation ID");
      return;
    }
    try {
      const [detailsRes, submissionsRes, resultsRes, responsesRes] = await Promise.all([
        fetch(`http://localhost:8080/evaluation/${eid}/details`),
        fetch(`http://localhost:8080/submissions/by-evaluation/${eid}`),
        fetch(`http://localhost:8080/teacher/by-evaluation/${eid}`),
        fetch(`http://localhost:8080/responses/get-evaluation/${eid}`),
      ]);
  
      if (!detailsRes.ok || !submissionsRes.ok || !resultsRes.ok || !responsesRes.ok) {
        throw new Error("Failed to fetch data for Excel export");
      }
  
      const [details, submissions, results, responses] = await Promise.all([
        detailsRes.json(),
        submissionsRes.json(),
        resultsRes.json(),
        responsesRes.json(),
      ]);
  
      const exportData = {
        Submissions: submissions.map((sub) => ({
          "Submission ID": sub.sid,
          "Student Name": sub.evaluatorName,
          "Evaluation Period": sub.evaluationPeriod,
          "Status": sub.status,
          "Submission Date": sub.submittedAt,  
        })),
        Results: results.map((res) => ({
          "Result ID": res.resultId,
          "Evaluatee Name": res.evaluateeName,
          "Average Score": res.averageScore,
        })),
        Responses: responses.map((resp) => ({
          "Response ID": resp.rid,
          "Evaluation Period": resp.evaluationPeriod,
          "Evaluatee": resp.evaluateeName,
          "Question": resp.questionName,
          "Evaluator": resp.evaluatorName,
          "Answer": resp.score,
        })),
      };
  
      const headerDetails = [
        ["EVALUATION REPORT"],
        [`Course Code: ${details.courseCode || "Not Available"}`],
        [`Course Name: ${details.courseDescription || "Not Available"}`],
        [`Section: ${details.section || "Not Available"}`],
        
        [],
      ];
  
      // Create Excel workbook
      const workbook = XLSX.utils.book_new();
  
      Object.keys(exportData).forEach((sheetName) => {
        const sheetData = exportData[sheetName];
  
        // Convert data to worksheet and prepend header
        const worksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.sheet_add_aoa(worksheet, headerDetails, { origin: "A1" });
        XLSX.utils.sheet_add_json(worksheet, sheetData, { origin: `A${headerDetails.length + 1}` });
  
        // Append worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });
  
      // Write file
      XLSX.writeFile(workbook, `Evaluation_${eid}_Export.xlsx`);
      alert("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("An error occurred while exporting data to Excel.");
    }
  };
  
  
  

  

  return (
<div className="grid grid-cols-[256px_1fr] min-h-screen">
  <Navbar userRole="TEACHER" />
  <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
    {/* Header with Back and Create Evaluation buttons */}
    <div className="flex flex-col mb-6">
      <div className="flex justify-between mb-4">
        <button
          className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-peach hover:text-white"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark transition-all duration-300"
          onClick={() => {
            setShowModal(true);
            setNewEvaluation({
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
      <h1 className="text-lg font-semibold text-teal text-center mb-6">Evaluations</h1>
    </div>

    {/* Table with evaluations */}
    <div className="overflow-y-auto max-h-96 rounded-lg shadow-md">
    <table className="min-w-full border border-gray-300">
      <thead className="sticky top-0 bg-teal text-white z-20 shadow-lg">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-semibold">Period</th>
          <th className="px-4 py-2 text-left text-sm font-semibold">Date Open</th>
          <th className="px-4 py-2 text-left text-sm font-semibold">Date Close</th>
          <th className="px-4 py-2 text-left text-sm font-semibold">Availability</th>
          <th className="px-4 py-2 text-left text-sm font-semibold">Questions</th>
          <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {evaluations.map((evalItem, index) => (
          <tr key={index} className="border-b">
            <td className="px-4 py-2">{evalItem.period || "N/A"}</td>
            <td className="px-4 py-2">{evalItem.dateOpen || "N/A"}</td>
            <td className="px-4 py-2">{evalItem.dateClose || "N/A"}</td>
            <td className="px-4 py-2">{evalItem.availability || "N/A"}</td>
            <td className="px-4 py-2">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => {
                  storeEncryptedId("eid", evalItem.eid);
                  window.location.href = `/teacher/questions/${evalItem.eid}`;
                }}
              >
                View
              </button>
            </td>
            <td className="px-4 py-2 flex space-x-3">
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
              <button
                className="text-green-500 hover:text-green-700"
                onClick={() => handleDownload(evalItem.eid)}
              >
                <i className="fa fa-download"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <h2 className="text-lg font-bold mb-4">
            {newEvaluation.eid ? "Edit Evaluation" : "Create Evaluation"}
          </h2>
          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}
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
            <input
              type="text"
              name="period"
              value={newEvaluation.period}
              onChange={handleInputChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              placeholder="Enter period (e.g., Prelims)"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark"
              onClick={newEvaluation.eid ? handleEditEvaluation : handleCreateEvaluation}
            >
              {newEvaluation.eid ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
</div>
  );
};

export default TeacherEvaluations;
