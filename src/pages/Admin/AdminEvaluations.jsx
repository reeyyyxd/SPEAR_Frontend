import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import AuthContext from "../../services/AuthContext";
import axios from "axios";
import * as XLSX from "xlsx";

const AdminEvaluations = () => {
  const { authState } = useContext(AuthContext);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const address = window.location.hostname;

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const response = await axios.get(
        `http://${address}:8080/admin/students-to-adviser-evaluations`,
        { headers: { Authorization: `Bearer ${authState.token}` } }
      );
      setEvaluations(response.data || []);
    } catch (error) {
      console.error("Error fetching evaluations:", error);
      setError("Failed to fetch evaluations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (eid) => {
    try {
      const [submissions, responses] = await Promise.all([
        axios.get(`http://${address}:8080/submissions/by-evaluation/${eid}`),
        axios.get(`http://${address}:8080/responses/get-evaluation/${eid}`),
      ]);

      const exportData = {
        Submissions: submissions.data.map((sub) => ({
          "Submission ID": sub.sid,
          "Evaluator": sub.evaluatorName,
          "Evaluation Period": sub.evaluationPeriod,
          "Status": sub.status,
          "Submission Date": sub.submittedAt,
        })),
        Responses: responses.data.map((resp) => ({
          "Question": resp.questionName,
          "Evaluator": resp.evaluatorName,
          "Evaluatee": resp.evaluateeName,
          "Score": resp.score,
        })),
      };

      const workbook = XLSX.utils.book_new();
      Object.keys(exportData).forEach((sheetName) => {
        const worksheet = XLSX.utils.json_to_sheet(exportData[sheetName]);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });

      XLSX.writeFile(workbook, `Evaluation_${eid}_Export.xlsx`);
      alert("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Failed to download evaluation data.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole="ADMIN" />
      <div className="p-8 bg-white shadow-md rounded-md w-full">
        <div className="flex justify-between items-center mb-6 pt-8">
          <h1 className="text-2xl font-bold text-gray-800">Student to Adviser Evaluations</h1>
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {loading ? (
          <div className="text-center text-gray-500">Loading evaluations...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-[#323c47] text-white">
                <tr>
                  <th className="px-4 py-3 text-center font-semibold border">Course Code</th>
                  <th className="px-4 py-3 text-center font-semibold border">Section</th>
                  <th className="px-4 py-3 text-center font-semibold border">Period</th>
                  <th className="px-4 py-3 text-center font-semibold border">Date Open</th>
                  <th className="px-4 py-3 text-center font-semibold border">Date Close</th>
                  <th className="px-4 py-3 text-center font-semibold border">Availability</th>
                  <th className="px-4 py-3 text-center font-semibold border">Adviser Name</th>
                  <th className="px-4 py-3 text-center font-semibold border">Action</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.length > 0 ? (
                  evaluations.map((evaluation, index) => (
                    <tr key={`${evaluation.eid}-${index}`} className="border-b">
                      <td className="px-4 py-3 border">{evaluation.courseCode}</td>
                      <td className="px-4 py-3 border">{evaluation.section}</td>
                      <td className="px-4 py-3 border">{evaluation.period}</td>
                      <td className="px-4 py-3 border">{evaluation.dateOpen}</td>
                      <td className="px-4 py-3 border">{evaluation.dateClose}</td>
                      <td className="px-4 py-3 border">{evaluation.availability}</td>
                      <td className="px-4 py-3 border">{evaluation.adviserName}</td>
                      <td className="px-4 py-3 border">
                        <button
                          className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-700 transition w-full flex items-center justify-center"
                          onClick={() => handleDownload(evaluation.eid)}
                        >
                          <i className="fa fa-download mr-2"></i> Download
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="border p-3 text-center text-gray-500">
                      No evaluations available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvaluations;
