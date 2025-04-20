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

  const teamName = getDecryptedId("teamName");
  const evaluationId = getDecryptedId("eid");

  useEffect(() => {
    fetchTeamDetails();
    fetchQuestions();
  }, []);

  const fetchTeamDetails = async () => {
    try {
      const response = await axios.get(
        `http://${address}:8080/evaluation/teacher/team-details/${teamName}`
      );
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

    for (const question of questions) {
      if (question.questionType === "INPUT") {
        const missing = teamDetails.memberIds.find(
          (id) => !responses[`${id}-${question.qid}`]
        );
        if (missing) {
          alert(`Please answer all ratings for "${question.questionTitle}"`);
          return;
        }
        for (const id of teamDetails.memberIds) {
          const val = responses[`${id}-${question.qid}`];
          if (val === "" || val === undefined || isNaN(val) || val < 0 || val > 10) {
            alert(`Please enter a valid score between 0.0 and 10.0 for "${question.questionTitle}"`);
            return;
          }
        }
      }
      if (question.questionType === "TEXT") {
        if (!responses[`text-${question.qid}`] || responses[`text-${question.qid}`].trim() === "") {
          alert(`Please answer the text question: "${question.questionTitle}"`);
          return;
        }
      }
    }

    for (const question of questions.filter(q => q.questionType === "INPUT")) {
      const scores = teamDetails.memberIds.map(id => responses[`${id}-${question.qid}`]).filter(Boolean);
      if (scores.length && new Set(scores).size === 1) {
        alert(`You cannot assign the same score to all members for "${question.questionTitle}"`);
        return;
      }
    }

    const responseList = [];
    teamDetails.memberIds.forEach((memberId) => {
      questions.forEach((q) => {
        const key = `${memberId}-${q.qid}`;
        const value = responses[key];
        if (q.questionType === "INPUT" && value) {
          responseList.push({
            evaluator: { uid: -1 },
            evaluatee: { uid: memberId },
            question: { qid: q.qid },
            evaluation: { eid: evaluationId },
            score: value,
            textResponse: null,
          });
        }
      });
    });

    questions.forEach((q) => {
      const value = responses[`text-${q.qid}`];
      if (q.questionType === "TEXT" && value) {
        responseList.push({
          evaluator: { uid: -1 },
          evaluatee: { uid: 0 },
          question: { qid: q.qid },
          evaluation: { eid: evaluationId },
          score: 0,
          textResponse: value,
        });
      }
    });

    try {
      await axios.post(`http://${address}:8080/responses/submit?teamId=${teamDetails.teamId}`, responseList);
      alert("Evaluation successfully submitted!");
      navigate(-1);
    } catch (err) {
      console.error("Error submitting evaluation:", err);
      alert("Failed to submit evaluation.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="w-full max-w-4xl mb-6">
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          ← Back
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Team Evaluation</h1>
      <p className="text-md text-gray-500 mb-6">Evaluate the team members below.</p>

      {teamDetails && (
        <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white p-8 rounded-lg shadow space-y-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Project Name: {teamDetails.projectName}
            </h2>
            <p className="text-sm text-gray-600">
              Project Description: {teamDetails.projectDescription}
            </p>
          </div>

          {questions.some(q => q.questionType === "INPUT") && (
            <div className="overflow-x-auto space-y-4">
              <p className="text-sm text-gray-500 mb-4">Rate each team member on a scale of 0.0 - 10.0 for each question.</p>
              <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-gray-100 text-gray-600">
                    <th className="w-1/3 text-left p-3">Criteria</th>
                    {teamDetails.memberNames.map((name, i) => (
                      <th key={i} className="text-center p-3">{name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {questions
                    .filter(q => q.questionType === "INPUT")
                    .map((q) => (
                      <tr key={q.qid}>
                        <td className="p-3 text-left align-top whitespace-normal text-sm text-gray-700">
                          <div>
                            <div className="font-semibold">{q.questionTitle}</div>
                            <div className="text-xs text-gray-500">{q.questionDetails}</div>
                          </div>
                        </td>
                        {teamDetails.memberIds.map((id, i) => (
                          <td key={id} className="p-3 text-center">
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              placeholder="0.0"
                              className="w-20 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              value={responses[`${id}-${q.qid}`] || ""}
                              onChange={(e) =>
                                handleResponseChange(id, q.qid, parseFloat(e.target.value))
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {questions
            .filter(q => q.questionType === "TEXT")
            .map((q) => (
              <div key={q.qid} className="space-y-3">
                <div>
                  <div className="font-semibold">{q.questionTitle}</div>
                  <div className="text-xs text-gray-500">{q.questionDetails}</div>
                </div>
                <textarea
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-gray-400"
                  rows="4"
                  placeholder="Write your response here..."
                  value={responses[`text-${q.qid}`] || ""}
                  onChange={(e) => handleResponseChange("text", q.qid, e.target.value)}
                />
              </div>
          ))}

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TeacherAdviserEvaluation;
