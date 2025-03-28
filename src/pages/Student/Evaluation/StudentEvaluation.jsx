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

        {questions.map((question) => (
          <div key={question.qid} className="space-y-3">
            <h2 className="font-semibold text-gray-700">{question.questionText}</h2>

            {question.questionType === "RADIO" && teamMembers.length > 0 && (
              <div className="overflow-x-auto rounded border">
                <table className="w-full text-center table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600">
                      <th className="p-2 text-left">Team Member</th>
                      {[1, 2, 3, 4, 5].map((score) => (
                        <th key={score} className="p-2">{score}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.memberId} className="border-t hover:bg-gray-50">
                        <td className="p-2 text-left">{member.memberName}</td>
                        {[1, 2, 3, 4, 5].map((score) => (
                          <td key={score} className="p-2">
                            <input
                              type="radio"
                              name={`rating-${member.memberId}-${question.qid}`}
                              value={score}
                              checked={responses[`${member.memberId}-${question.qid}`] === score}
                              onChange={() => handleResponseChange(member.memberId, question.qid, score)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {question.questionType === "TEXT" && (
              <div>
                <textarea
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-gray-400"
                  rows="4"
                  placeholder="Write your response here..."
                  value={responses[`text-${question.qid}`] || ""}
                  onChange={(e) => handleResponseChange("text", question.qid, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-gray-700 text-white py-3 rounded hover:bg-gray-800 transition text-lg"
        >
          Submit Evaluation
        </button>
      </form>

    </div>
  );
};

export default StudentEvaluation;