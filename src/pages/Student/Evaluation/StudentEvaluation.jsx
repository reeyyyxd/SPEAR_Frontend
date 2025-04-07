import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../services/AuthContext";

const StudentEvaluation = () => {
  const { getDecryptedId } = useContext(AuthContext);
  const navigate = useNavigate();
  const address = window.location.hostname;

  const [questions, setQuestions] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [responses, setResponses] = useState({});

  const studentId = getDecryptedId("uid");
  const evaluationId = getDecryptedId("eid");
  const classId = getDecryptedId("cid");

  useEffect(() => {
    fetchQuestions();
    fetchTeamMembers();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`http://${address}:8080/get-questions-by-evaluation/${evaluationId}`);
      setQuestions(response.data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(`http://${address}:8080/evaluation/${studentId}/class/${classId}/team`);
      if (!Array.isArray(response.data.memberIds) || !Array.isArray(response.data.memberNames)) {
        console.error("Unexpected response format for team members:", response.data);
        return;
      }
      const members = response.data.memberIds.map((id, index) => ({
        memberId: id,
        memberName: response.data.memberNames[index]
      }));
      setTeamMembers(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
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

    // Check all questions are answered
    for (const question of questions) {
        if (question.questionType === "RADIO") {
            const missingMember = teamMembers.find(member => !responses[`${member.memberId}-${question.qid}`]);
            if (missingMember) {
                alert(`Please answer all ratings for "${question.questionText}"`);
                return;
            }
        }
        if (question.questionType === "TEXT") {
            if (!responses[`text-${question.qid}`] || responses[`text-${question.qid}`].trim() === "") {
                alert(`Please answer the text question: "${question.questionText}"`);
                return;
            }
        }
        if (question.questionType === "RADIO") {
          for (const member of teamMembers) {
            const value = responses[`${member.memberId}-${question.qid}`];
            if (
              value === "" ||
              value === undefined ||
              isNaN(value) ||
              value < 0 ||
              value > 10
            ) {
              alert(`Please enter a valid score between 0.0 and 10.0 for "${question.questionText}"`);
              return;
            }
          }
        }
        
    }

    // Check if all radio scores are not identical
    for (const question of questions) {
        if (question.questionType === "RADIO") {
            const scores = teamMembers.map(member => responses[`${member.memberId}-${question.qid}`]).filter(Boolean);
            const uniqueScores = [...new Set(scores)];
            if (scores.length > 0 && uniqueScores.length === 1) {
                alert(`You cannot assign the same score to all members for "${question.questionText}"`);
                return;
            }
        }
    }

    // Build the responses
    const responseList = [];

    teamMembers.forEach((member) => {
        questions.forEach((question) => {
            const key = `${member.memberId}-${question.qid}`;
            const value = responses[key];
            if (question.questionType === "RADIO" && value) {
                responseList.push({
                    evaluator: { uid: studentId },
                    evaluatee: { uid: member.memberId },
                    question: { qid: question.qid },
                    evaluation: { eid: evaluationId },
                    score: value,
                    textResponse: null
                });
            }
        });
    });

    questions.forEach((question) => {
        if (question.questionType === "TEXT") {
            const value = responses[`text-${question.qid}`];
            if (value) {
                responseList.push({
                    evaluator: { uid: studentId },
                    evaluatee: { uid: studentId },
                    question: { qid: question.qid },
                    evaluation: { eid: evaluationId },
                    score: 0,
                    textResponse: value
                });
            }
        }
    });

    try {
        await axios.post(`http://${address}:8080/responses/submit?teamId=${classId}`, responseList);
        alert("Evaluation successfully submitted!");
        navigate(-1);
    } catch (error) {
        console.error("Error submitting evaluation:", error);
        alert("Failed to submit evaluation.");
    }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">

      {/* Back Button */}
      <div className="w-full max-w-4xl mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          ← Back
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Evaluation</h1>
      <p className="text-md text-gray-500 mb-6">Evaluate your team members carefully.</p>

      <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white p-8 rounded-lg shadow space-y-8">

        {questions.some(q => q.questionType === "RADIO") && (
          <div className="overflow-x-auto space-y-4">
            <p className="text-sm text-gray-500 mb-4">Rate each team member on a scale of 0.0 - 10.0 for each question.</p>
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="w-1/3 text-left p-3">Criteria</th>
                  {teamMembers.map((member) => (
                    <th key={member.memberId} className="text-center p-3">{member.memberName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {questions
                  .filter(q => q.questionType === "RADIO")
                  .map((question) => (
                    <tr key={question.qid}>
                      <td className="p-3 text-left align-top whitespace-normal text-sm text-gray-700">
                        {question.questionText}
                      </td>
                      {teamMembers.map((member) => (
                        <td key={member.memberId} className="p-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="0.0"
                            className="w-20 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            value={responses[`${member.memberId}-${question.qid}`] || ""}
                            onChange={(e) =>
                              handleResponseChange(
                                member.memberId,
                                question.qid,
                                parseFloat(e.target.value)
                              )
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
          .map((question) => (
            <div key={question.qid} className="space-y-3">
              <h2 className="font-semibold text-gray-700">{question.questionText}</h2>
              <textarea
                className="w-full p-3 border rounded focus:ring-2 focus:ring-gray-400"
                rows="4"
                placeholder="Write your response here..."
                value={responses[`text-${question.qid}`] || ""}
                onChange={(e) => handleResponseChange("text", question.qid, e.target.value)}
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
    </div>
  );
};

export default StudentEvaluation;
