import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../services/AuthContext";

const StudentTeacherEvaluation = () => {
  const { getDecryptedId } = useContext(AuthContext);
  const navigate = useNavigate();
  const address = window.location.hostname;

  const [questions, setQuestions] = useState([]);
  const [adviserName, setAdviserName] = useState("");
  const [responses, setResponses] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const studentId = getDecryptedId("uid");
  const evaluationId = getDecryptedId("eid");
  const classId = getDecryptedId("cid");
  const [adviserId, setAdviserId] = useState(null);

  const STORAGE_KEY = `eval-${evaluationId}-class-${classId}`;

  // Fetching questions and team data
  useEffect(() => {
    fetchQuestions();
    fetchTeamData();
  }, []);

  // Load saved responses from localStorage when the component mounts
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setResponses(JSON.parse(saved));
      } catch (err) {
        console.warn("Failed to parse saved responses", err);
      }
    }
  }, []); 

  // Save responses to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
    }
  }, [responses]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`http://${address}:8080/get-questions-by-evaluation/${evaluationId}`);
      setQuestions(res.data || []);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const fetchTeamData = async () => {
    try {
      const teamRes = await axios.get(`http://${address}:8080/evaluation/${studentId}/class/${classId}/team`);
      const teamId = teamRes.data.tid;
  
      const res = await axios.get(`http://${address}:8080/team/${teamId}/members-and-adviser`);
      setAdviserName(res.data.adviserName || "Unknown Adviser");
      setAdviserId(res.data.adviserId || null); 
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch team or adviser details.");
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [`${adviserName}-${questionId}`]: value,
    }));
  };

  const handleTextChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [`text-${questionId}`]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!adviserName) {
      alert("Adviser not loaded. Please wait.");
      return;
    }
  
    // 1) Validate that all required INPUT fields are properly filled
    const inputQuestions = questions.filter(q => q.questionType === "INPUT");
    for (const question of inputQuestions) {
      const score = responses[`${adviserName}-${question.qid}`];
      
      // Must NOT be blank, undefined, and must be a valid number between 0 and 10 (exclusive of 0, inclusive of 10)
      if (
        score === undefined || 
        score === "" || 
        isNaN(score) || 
        parseFloat(score) <= 0 || 
        parseFloat(score) > 10
      ) {
        alert(`Please provide a valid score (greater than 0 and up to 10) for: "${question.questionTitle}"`);
        return;
      }
    }
    
    // 2) Validate that all TEXT fields are properly filled
    const textQuestions = questions.filter(q => q.questionType === "TEXT");
    for (const question of textQuestions) {
      const textValue = responses[`text-${question.qid}`];
      
      // Must not be blank, empty or contain only whitespace
      if (!textValue || textValue.trim() === "") {
        alert(`Please write a response for: "${question.questionTitle}"`);
        return;
      }
    }
    
    // 3) Check for identical scores between team members for INPUT questions (not applicable for adviser evaluation)
    // This constraint doesn't apply here since we're evaluating only the adviser, not multiple team members
    
    // 4) Build the responseList
    const responseList = questions.map((q) => ({
      evaluator: { uid: studentId },
      evaluatee: { uid: adviserId },
      question: { qid: q.qid },
      evaluation: { eid: evaluationId },
      score: q.questionType === "INPUT" ? responses[`${adviserName}-${q.qid}`] : 0,
      textResponse: q.questionType === "TEXT" ? responses[`text-${q.qid}`] : null,
    }));
  
    // 5) User confirmation via modal dialog is already implemented in the UI
    try {
      await axios.post(
        `http://${address}:8080/responses/submit-adviser?evaluationId=${evaluationId}&evaluatorId=${studentId}&classId=${classId}`,
        responseList
      );
      alert("Evaluation successfully submitted!");
      localStorage.removeItem(STORAGE_KEY);
      navigate(-1);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit evaluation.");
    }
  };

  const inputQuestions = questions.filter((q) => q.questionType === "INPUT");
  const textQuestions = questions.filter((q) => q.questionType === "TEXT");

  const calculateTotalScore = () => {
    let total = 0;
    inputQuestions.forEach((question) => {
      const value = responses[`${adviserName}-${question.qid}`];
      if (!isNaN(value) && value !== "") {
        total += parseFloat(value);
      }
    });
  
    // Check if the total is NaN, and if so, return 0.00
    return isNaN(total) ? "0.0" : total.toFixed(1); // Return total score with one decimal place
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-4xl mb-6">
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          ← Back
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Adviser Evaluation</h1>

      {adviserName && (
        <p className="text-md text-gray-600 mb-6">
          You are evaluating your adviser:{" "}
          <span className="text-blue-600 font-semibold">{adviserName}</span>
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Show the confirmation popup
          if (window.confirm("Are you sure you want to submit your evaluation? You won't be able to make changes after this.")) {
            handleSubmit();
          }
        }}
        className="w-full max-w-6xl bg-white p-6 md:p-8 rounded-lg shadow space-y-8"
      >
        {/* Instructions for Evaluation */}
        {inputQuestions.length > 0 && (
          <div className="mb-4 text-sm text-gray-500">
            <p className="mb-2">
              Rate your adviser on a scale of <code>0.1</code> – <code>10</code> for each question.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>No question can be left unanswered.</li>
              <li>Ensure you provide valid input for each question (greater than 0, up to 10).</li>
            </ul>
          </div>
        )}

        {/* Table for INPUT Questions */}
        {inputQuestions.length > 0 && (
          <div className="overflow-x-auto space-y-4">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="sticky left-0 bg-gray-100 p-3 text-left z-10 w-52 border-r border-gray-300">
                    {adviserName}
                  </th>
                  {inputQuestions.map((question) => (
                    <th
                      key={question.qid}
                      className="text-center p-3 min-w-[180px] border-r border-gray-200"
                    >
                      <div className="font-bold text-xs">
                        {question.questionTitle}
                      </div>
                      {question.questionDetails && question.questionDetails !== question.questionTitle && (
                        <div className="mt-1 text-[10px] text-gray-500" title={question.questionDetails}>
                          {question.questionDetails}
                        </div>
                      )}
                    </th>
                  ))}
                  <th className="sticky right-0 bg-gray-100 p-3 text-center z-10 min-w-[100px] border-l border-gray-300">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="sticky left-0 bg-white z-0 p-3 font-medium text-gray-700 w-52 border-r border-gray-200">
                    {adviserName}
                  </td>
                  {inputQuestions.map((question) => (
                    <td key={question.qid} className="p-3 text-center border-r border-gray-100">
                      <input
                        type="number"
                        min="0.1"
                        max="10"
                        step="0.1"
                        placeholder="0.0"
                        className="w-20 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        value={responses[`${adviserName}-${question.qid}`] || ""}
                        onChange={(e) => {
                          // Get the new value from the input
                          let newValue = e.target.value;

                          // Ensure it's a valid number and falls within the correct range (0.1-10)
                          if (newValue !== "" && (parseFloat(newValue) <= 0 || parseFloat(newValue) > 10)) {
                            // Clamp between 0.1 and 10
                            newValue = Math.max(0.1, Math.min(10, parseFloat(newValue)));
                          }

                          // Ensure it does not have more than one decimal place
                          if (/^\d+(\.\d{1})?$/.test(newValue) || newValue === "") {
                            handleResponseChange(question.qid, parseFloat(newValue));
                          }
                        }}
                      />
                    </td>
                  ))}
                  <td className="sticky right-0 bg-white z-0 text-center font-semibold border-l border-gray-200">
                    {calculateTotalScore()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Render TEXT questions second */}
        {textQuestions.map((question) => (
          <div key={question.qid} className="space-y-3">
            <div>
              <div className="font-semibold text-gray-700">{question.questionTitle}</div>
              <div className="text-xs text-gray-500">{question.questionDetails}</div>
            </div>

            <textarea
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400"
              rows="4"
              placeholder="Write your response here..."
              value={responses[`text-${question.qid}`] || ""}
              onChange={(e) => handleTextChange(question.qid, e.target.value)}
            />
          </div>
        ))}

        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition">
            Submit
          </button>
        </div>
      </form>

      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Submission</h2>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to submit your evaluation?</p>
            <p className="text-sm text-gray-600 mb-6">You cannot edit once submitted.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-white rounded"
                style={{ backgroundColor: "#323c47" }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTeacherEvaluation;