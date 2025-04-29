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
  const [exportInProgress, setExportInProgress] = useState(false);

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

  const handleDownload = async (eid, evaluationInfo) => {
    try {
      setExportInProgress(true);
      
      const [submissions, responses] = await Promise.all([
        axios.get(`http://${address}:8080/submissions/by-evaluation/${eid}`),
        axios.get(`http://${address}:8080/responses/get-evaluation/${eid}`),
      ]);
      
      // Process responses to match the database structure we can see
      // Map properties to ensure all required fields are available
      const processedResponses = responses.data.map(resp => {
        return {
          ...resp,
          // Make sure we have these fields, based on the database screenshot
          rid: resp.rid || resp.id || "",
          score: resp.score || 0,
          text_response: resp.textResponse || resp.text_response || null,
          evaluatee_id: resp.evaluateeId || resp.evaluatee_id || 0,
          evaluation_id: resp.evaluation_id || resp.evaluationId || eid,
          evaluator_id: resp.evaluatorId || resp.evaluator_id || 0,
          question_id: resp.questionId || resp.question_id || 0,
          questionName: resp.questionName || "",
          questionDetails: resp.questionDetails || "",
          questionType: resp.questionType || "INPUT",
          evaluatorName: resp.evaluatorName || "",
          evaluateeName: resp.evaluateeName || ""
        };
      });

      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Add evaluation metadata to the workbook
      const metadataSheet = XLSX.utils.aoa_to_sheet([
        ['Evaluation Details'],
        ['Course Code', evaluationInfo.courseCode || ''],
        ['Section', evaluationInfo.section || ''],
        ['Period', evaluationInfo.period || ''],
        ['Adviser Name', evaluationInfo.adviserName || ''],
        ['Date Open', evaluationInfo.dateOpen || ''],
        ['Date Close', evaluationInfo.dateClose || ''],
        ['Availability', evaluationInfo.availability || ''],
        ['Course Description', evaluationInfo.courseDescription || ''],
        ['Export Date', new Date().toLocaleString()],
      ]);
      
      // Format the submissions data right below the metadata
      if (submissions.data && submissions.data.length > 0) {
        // Add a separator row
        XLSX.utils.sheet_add_aoa(metadataSheet, [
          [''], // Empty row for spacing
          ['Submissions Information'], // Title for submissions section
          [''] // Empty row for spacing
        ], { origin: -1 }); // Append to the bottom
        
        // Convert submissions to AOA format
        const submissionHeaders = ['Evaluator', 'Evaluation Period', 'Status', 'Submission Date'];
        const submissionRows = submissions.data.map(sub => [
          sub.evaluatorName,
          sub.evaluationPeriod,
          sub.status,
          new Date(sub.submittedAt).toLocaleString()
        ]);
        
        // Add the headers and data
        XLSX.utils.sheet_add_aoa(metadataSheet, [submissionHeaders], { origin: -1 });
        XLSX.utils.sheet_add_aoa(metadataSheet, submissionRows, { origin: -1 });
      }
      
      // Set column widths for better readability
      const metadataCols = [
        { wch: 20 }, // Field name width
        { wch: 40 }, // Value width
      ];
      metadataSheet['!cols'] = metadataCols;
      
      XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Evaluation Info');

      // Format and add responses data with grouping
      if (processedResponses && processedResponses.length > 0) {
        // Group responses by evaluator and evaluatee
        const groupedResponses = {};
        
        processedResponses.forEach(resp => {
          const key = `${resp.evaluatorName} → ${resp.evaluateeName}`;
          if (!groupedResponses[key]) {
            groupedResponses[key] = [];
          }
          groupedResponses[key].push(resp);
        });
        
        // Create a flattened array with summary statistics
        const responseData = [];
        Object.entries(groupedResponses).forEach(([key, respList]) => {
          // Add a header row for each evaluator-evaluatee pair
          responseData.push({
            "Question": `=== ${key} ===`,
            "Score": "",
            "Comments": ""
          });
          
          // First add all INPUT type questions
          respList.filter(resp => resp.questionType === "INPUT").forEach(resp => {
            responseData.push({
              "Question": resp.questionName,
              "Score": resp.score,
              "Comments": ""
            });
          });
          
          // Calculate average score for this evaluator-evaluatee pair (only for INPUT types)
          const inputResponses = respList.filter(resp => resp.questionType === "INPUT");
          if (inputResponses.length > 0) {
            const avgScore = inputResponses.reduce((sum, item) => sum + (item.score || 0), 0) / inputResponses.length;
            responseData.push({
              "Question": "Average Score",
              "Score": avgScore.toFixed(2),
              "Comments": ""
            });
          }
          
          // Add a separator
          responseData.push({
            "Question": "--------------------------------------------",
            "Score": "",
            "Comments": ""
          });
          
          // Then add all TEXT type questions at the bottom
          respList.filter(resp => resp.questionType === "TEXT").forEach(resp => {
            responseData.push({
              "Question": resp.questionName,
              "Score": "",
              "Comments": resp.textResponse || ""
            });
          });
          
          // Add an empty row for separation between evaluator groups
          responseData.push({
            "Question": "",
            "Score": "",
            "Comments": ""
          });
        });
        
        const responseSheet = XLSX.utils.json_to_sheet(responseData);
        
        // Set column widths for better readability
        const responseCols = [
          { wch: 40 }, // Question width
          { wch: 10 }, // Score width
          { wch: 60 }, // Comments width (wider for text responses)
        ];
        responseSheet['!cols'] = responseCols;
        
        XLSX.utils.book_append_sheet(workbook, responseSheet, 'Responses');
      }
      
      // Add summary statistics sheet
      if (processedResponses && processedResponses.length > 0) {
        // Filter to only include INPUT type questions for statistics
        const inputResponses = processedResponses.filter(resp => 
          resp.questionType === "INPUT"
        );
        
        // Group by question
        const questionStats = {};
        inputResponses.forEach(resp => {
          if (!questionStats[resp.questionName]) {
            questionStats[resp.questionName] = {
              scores: [],
              questionDetails: resp.questionDetails || ""
            };
          }
          if (resp.score !== null && resp.score !== undefined) {
            questionStats[resp.questionName].scores.push(resp.score);
          }
        });
        
        // Calculate statistics
        const statsData = Object.entries(questionStats).map(([question, data]) => {
          const scores = data.scores;
          const avg = scores.length > 0 ? 
            scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
          const min = scores.length > 0 ? Math.min(...scores) : 0;
          const max = scores.length > 0 ? Math.max(...scores) : 0;
          
          return {
            "Question": question,
            "Question Details": data.questionDetails,
            "Average Score": avg.toFixed(2),
            "Min Score": min,
            "Max Score": max,
            "# of Responses": scores.length
          };
        });
        
        // Calculate total statistics
        const allScores = inputResponses.map(resp => resp.score).filter(score => 
          score !== null && score !== undefined
        );
        
        const totalAverage = allScores.length > 0 ? 
          allScores.reduce((sum, score) => sum + score, 0) / allScores.length : 0;
          
        // Add a total row
        statsData.push({
          "Question": "--- TOTAL AVERAGE ---",
          "Question Details": "",
          "Average Score": totalAverage.toFixed(2),
          "Min Score": "",
          "Max Score": "",
          "# of Responses": allScores.length
        });
        
        const statsSheet = XLSX.utils.json_to_sheet(statsData);
        
        // Set column widths for better readability
        const statsCols = [
          { wch: 40 }, // Question width
          { wch: 40 }, // Question Details width
          { wch: 15 }, // Average Score width
          { wch: 15 }, // Min Score width
          { wch: 15 }, // Max Score width
          { wch: 15 }, // # of Responses width
        ];
        statsSheet['!cols'] = statsCols;
        
        XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistics');
      }

      // Generate filename with course code and date
      const courseCode = evaluationInfo.courseCode || '';
      const period = evaluationInfo.period || '';
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const filename = `${courseCode}_${period}_Evaluation_${today}.xlsx`;

      // Write the file and trigger download
      XLSX.writeFile(workbook, filename);
      alert("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Failed to download evaluation data. Error: " + error.message);
    } finally {
      setExportInProgress(false);
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
                          className={`text-white px-3 py-2 rounded-md transition w-full flex items-center justify-center ${
                            exportInProgress || evaluation.availability === "Open"
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-700"
                          }`}
                          onClick={() => handleDownload(evaluation.eid, evaluation)}
                          disabled={exportInProgress || evaluation.availability === "Open"}
                        >
                          {exportInProgress ? (
                            <>
                              <span className="animate-spin mr-2">⟳</span> Exporting...
                            </>
                          ) : (
                            <>
                              <i className="fa fa-download mr-2"></i> Download
                            </>
                          )}
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