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
      const response = await axios.get(`http://${address}:8080/evaluation/teacher/team-details/${teamName}`);
      setTeamDetails(response.data);
    } catch (error) {
      console.error("Error fetching team details:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`http://${address}:8080/get-questions-by-evaluation/${evaluationId}`);
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

    // Check unanswered RADIO
    const unansweredRadio = questions.some(question =>
      question.questionType === "RADIO" &&
      teamDetails.memberIds.some(memberId => !responses[`${memberId}-${question.qid}`])
    );

    // Check unanswered TEXT
    const unansweredText = questions.some(question =>
      question.questionType === "TEXT" &&
      !responses[`text-${question.qid}`]
    );

    if (unansweredRadio || unansweredText) {
      alert("Please answer all questions before submitting.");
      return;
    }

    // Check duplicate scores
    const hasDuplicateScores = questions.some(question => {
      if (question.questionType !== "RADIO") return false;
      const scores = teamDetails.memberIds.map(memberId => responses[`${memberId}-${question.qid}`]);
      return new Set(scores).size === 1;
    });

    if (hasDuplicateScores) {
      alert("Please avoid giving the same score to all members on any question.");
      return;
    }

    const responseList = [];

    // RADIO responses
    teamDetails.memberIds.forEach((memberId) => {
      questions.forEach((question) => {
        const key = `${memberId}-${question.qid}`;
        const value = responses[key];
        if (question.questionType === "RADIO" && value) {
          responseList.push({
            evaluator: { uid: -1 }, // Replace with teacher ID if available
            evaluatee: { uid: memberId },
            question: { qid: question.qid },
            evaluation: { eid: evaluationId },
            score: value,
            textResponse: null
          });
        }
      });
    });

    // TEXT responses
    questions.forEach((question) => {
      if (question.questionType === "TEXT") {
        const value = responses[`text-${question.qid}`];
        if (value) {
          responseList.push({
            evaluator: { uid: -1 },
            evaluatee: { uid: 0 },
            question: { qid: question.qid },
            evaluation: { eid: evaluationId },
            score: 0,
            textResponse: value
          });
        }
      }
    });

    try {
      await axios.post(`http://${address}:8080/responses/submit?teamId=${teamDetails.teamId}`, responseList);
      alert("Evaluation submitted successfully!");
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

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Team Evaluation</h1>
      <p className="text-md text-gray-500 mb-6">Evaluate the team's performance below.</p>

      {teamDetails && questions.length > 0 ? (
        <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white p-8 rounded-lg shadow space-y-8">

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Project Name: {teamDetails.projectName}</h2>
            <p className="text-gray-600">Project Description: {teamDetails.projectDescription}</p>
          </div>

          {questions.map((question) => (
            <div key={question.qid} className="space-y-3">
              <h3 className="font-semibold text-lg text-gray-700">{question.questionText}</h3>

              {/* Radio Type */}
              {question.questionType === "RADIO" && (
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
                      {teamDetails.memberNames.map((member, index) => (
                        <tr key={index} className="border-t hover:bg-gray-50">
                          <td className="p-2 text-left font-medium">{member}</td>
                          {[1, 2, 3, 4, 5].map((score) => (
                            <td key={score} className="p-2">
                              <input
                                type="radio"
                                name={`rating-${teamDetails.memberIds[index]}-${question.qid}`}
                                value={score}
                                checked={responses[`${teamDetails.memberIds[index]}-${question.qid}`] === score}
                                onChange={() => handleResponseChange(teamDetails.memberIds[index], question.qid, score)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Text Type */}
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

          {/* Feedback */}
          <div>
            <h3 className="font-semibold text-lg text-gray-700 mb-2">Additional Feedback</h3>
            <textarea
              className="w-full p-3 border rounded focus:ring-2 focus:ring-gray-400"
              rows="4"
              placeholder="Write your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-3 rounded hover:bg-gray-800 transition text-lg"
          >
            Submit Evaluation
          </button>

        </form>
      ) : (
        <p className="text-gray-500">Loading team details...</p>
      )}
    </div>
  );
};

export default TeacherAdviserEvaluation;