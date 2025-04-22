import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../services/AuthContext";

const TeacherAdviserEvaluation = () => {
  const { getDecryptedId } = useContext(AuthContext);
  const navigate = useNavigate();
  const address = window.location.hostname;

  const [teamDetails, setTeamDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [feedback, setFeedback] = useState("");

  const teamName = getDecryptedId("teamName");
  const evaluationId = getDecryptedId("eid");

  useEffect(() => {
    fetchTeamDetails();
    fetchQuestions();
  }, []);

  const fetchTeamDetails = async () => {
    try {
      const teamId = getDecryptedId("tid");
      const response = await axios.get(`http://${address}:8080/team/${teamId}/members-and-adviser`);
      setTeamDetails(response.data);
    } catch (error) {
      console.error("Error fetching team details:", error);
    }
  };
  

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `http://${address}:8080/get-questions-by-evaluation/${evaluationId}`
      );
      setQuestions(response.data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleResponseChange = (memberId, questionId, value) => {
    setResponses({
      ...responses,
      [`${memberId}-${questionId}`]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const confirmed = window.confirm("Are you sure you want to submit your evaluation? You won't be able to make changes after this.");
    if (!confirmed) return;
  
    const teacherId = getDecryptedId("uid");
    const classId = getDecryptedId("cid");
  
    // Validation: Check all required questions are answered
    for (const question of questions) {
      if (question.questionType === "INPUT") {
        for (const memberId of teamDetails.memberIds) {
          const value = responses[`${memberId}-${question.qid}`];
          if (value === "" || value === undefined || isNaN(value) || value < 0 || value > 10) {
            alert(`Please enter a valid score between 0.0 and 10.0 for "${question.questionTitle}"`);
            return;
          }
        }
      }
  
      if (question.questionType === "TEXT") {
        const value = responses[`text-${question.qid}`];
        if (!value || value.trim() === "") {
          alert(`Please answer the text question: "${question.questionTitle}"`);
          return;
        }
      }
    }
  
    // Prevent same score for all students per question
    for (const question of questions.filter(q => q.questionType === "INPUT")) {
      const scores = teamDetails.memberIds.map(memberId => responses[`${memberId}-${question.qid}`]);
      const uniqueScores = [...new Set(scores)];
      if (uniqueScores.length === 1) {
        alert(`You cannot give the same score to all members for "${question.questionTitle}"`);
        return;
      }
    }
  
    const responseList = [];
  
    // INPUT responses
    questions.filter(q => q.questionType === "INPUT").forEach((question) => {
      teamDetails.memberIds.forEach((memberId) => {
        const value = responses[`${memberId}-${question.qid}`];
        responseList.push({
          evaluator: { uid: teacherId },
          evaluatee: { uid: memberId },
          question: { qid: question.qid },
          evaluation: { eid: evaluationId },
          score: value,
          textResponse: null,
        });
      });
    });
  
    // TEXT responses
    questions.filter(q => q.questionType === "TEXT").forEach((question) => {
      const value = responses[`text-${question.qid}`];
      if (value && value.trim() !== "") {
        responseList.push({
          evaluator: { uid: teacherId },
          evaluatee: { uid: teacherId },
          question: { qid: question.qid },
          evaluation: { eid: evaluationId },
          score: 0,
          textResponse: value,
        });
      }
    });
  
    try {
      await axios.post(
        `http://${address}:8080/responses/submit?teamId=${classId}`,
        responseList
      );
      alert("Evaluation successfully submitted!");
      navigate(-1);
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      alert("Failed to submit evaluation.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="w-full max-w-6xl mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          ← Back
        </button>
      </div>
  
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Adviser to Student Evaluation</h1>
      <p className="text-md text-gray-500 mb-6">Evaluate your students based on the criteria below.</p>
  
      <form onSubmit={handleSubmit} className="w-full max-w-6xl bg-white p-6 md:p-8 rounded-lg shadow space-y-8">
  
        {teamDetails?.memberNames?.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Rate each student on a scale of 0.0 - 10.0 for each question.
            </p>
  
            <div className="overflow-x-auto space-y-4">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-sm">
                    <th className="sticky left-0 bg-gray-100 p-3 text-left z-10 w-52 border-r border-gray-300">
                      Student
                    </th>
                    {questions.filter(q => q.questionType === "INPUT").map((q, index) => (
                      <th
                        key={q.qid}
                        className={`text-center p-3 min-w-[180px] border-r border-gray-200 ${index > 3 ? "hidden lg:table-cell" : ""}`}
                      >
                        <div className="font-semibold text-xs">{q.questionTitle}</div>
                        <div className="text-[10px] text-gray-500">{q.questionDetails}</div>
                      </th>
                    ))}
                    <th className="sticky right-0 bg-gray-100 p-3 text-center z-10 min-w-[100px] border-l border-gray-300">
                      Total
                    </th>
                  </tr>
                </thead>
  
                <tbody>
                  {teamDetails.memberNames.map((member, index) => {
                    const memberId = teamDetails.memberIds[index];
                    const inputQs = questions.filter(q => q.questionType === "INPUT");
                    const total = inputQs.reduce((acc, q) => acc + (parseFloat(responses[`${memberId}-${q.qid}`]) || 0), 0);
  
                    return (
                      <tr key={memberId} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="sticky left-0 bg-white z-0 p-3 font-medium text-gray-700 w-52 border-r border-gray-200">
                          {member}
                        </td>
                        {inputQs.map((q, idx) => (
                          <td
                            key={q.qid}
                            className={`p-3 text-center border-r border-gray-100 ${idx > 3 ? "hidden lg:table-cell" : ""}`}
                          >
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              placeholder="0.0"
                              className="w-20 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              value={responses[`${memberId}-${q.qid}`] || ""}
                              onChange={(e) => handleResponseChange(memberId, q.qid, parseFloat(e.target.value))}
                            />
                          </td>
                        ))}
                        <td className="sticky right-0 bg-white z-0 text-center font-semibold border-l border-gray-200">
                          {total.toFixed(1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
  
        {questions.filter(q => q.questionType === "TEXT").length > 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-700 mt-10">Written Feedback</h2>
            {questions.filter(q => q.questionType === "TEXT").map((q) => (
              <div key={q.qid} className="space-y-2">
                <div className="font-semibold text-gray-800">{q.questionTitle}</div>
                <div className="text-sm text-gray-500">{q.questionDetails}</div>
                <textarea
                  rows="4"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-gray-400"
                  placeholder="Write your response here..."
                  value={responses[`text-${q.qid}`] || ""}
                  onChange={(e) => handleResponseChange("text", q.qid, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}
  
        <div className="flex justify-end mt-10">
          <button
            type="submit"
            className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 transition"
          >
            Submit Evaluation
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default TeacherAdviserEvaluation;
