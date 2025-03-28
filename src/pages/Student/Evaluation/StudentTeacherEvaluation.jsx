import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../services/AuthContext";

const StudentTeacherEvaluation = () => {
  const { getDecryptedId } = useContext(AuthContext);
  const navigate = useNavigate();
  const address = window.location.hostname;

  const [questions, setQuestions] = useState([]);
  const [adviser, setAdviser] = useState(null);
  const [responses, setResponses] = useState({});

  const studentId = getDecryptedId("uid");
  const evaluationId = getDecryptedId("eid");
  const classId = getDecryptedId("cid");

  useEffect(() => {
    fetchQuestions();
    fetchAdviser();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`http://${address}:8080/get-questions-by-evaluation/${evaluationId}`);
      setQuestions(response.data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchAdviser = async () => {
    try {
      const response = await axios.get(`http://${address}:8080/evaluation/${studentId}/class/${classId}/adviser`);
      if (response.data && response.data.adviserName && response.data.adviserId) {
        setAdviser({
          adviserId: response.data.adviserId,
          adviserName: response.data.adviserName
        });
      } else {
        console.error("Invalid adviser data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching adviser details:", error);
    }
  };

  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [`${adviser?.adviserId}-${questionId}`]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adviser) {
      alert("Adviser not loaded. Please wait.");
      return;
    }

    // Check if all questions are answered
    for (const question of questions) {
      if (question.questionType === "RADIO" && !responses[`${adviser.adviserId}-${question.qid}`]) {
        alert("Please answer all radio questions.");
        return;
      }
      if (question.questionType === "TEXT" && !responses[`text-${question.qid}`]) {
        alert("Please answer all text questions.");
        return;
      }
    }

    // Check for same score restriction
    const radioAnswers = questions.filter(q => q.questionType === "RADIO").map(q => responses[`${adviser.adviserId}-${q.qid}`]);
    const allSame = radioAnswers.every(val => val === radioAnswers[0]);

    if (allSame) {
      alert("You cannot give the same rating for all questions.");
      return;
    }

    const responseList = [];
    questions.forEach((question) => {
      if (question.questionType === "RADIO") {
        const key = `${adviser.adviserId}-${question.qid}`;
        const value = responses[key];
        if (value) {
          responseList.push({
            evaluator: { uid: studentId },
            evaluatee: { uid: adviser.adviserId },
            question: { qid: question.qid },
            evaluation: { eid: evaluationId },
            score: value,
            textResponse: null
          });
        }
      }
      if (question.questionType === "TEXT") {
        const value = responses[`text-${question.qid}`];
        if (value) {
          responseList.push({
            evaluator: { uid: studentId },
            evaluatee: { uid: adviser.adviserId },
            question: { qid: question.qid },
            evaluation: { eid: evaluationId },
            score: 0,
            textResponse: value
          });
        }
      }
    });

    try {
      await axios.post(`http://${address}:8080/submissions/submit-adviser?evaluationId=${evaluationId}&evaluatorId=${studentId}`);
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

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Adviser Evaluation</h1>
      <p className="text-md text-gray-500 mb-6">Evaluate your adviser below.</p>

      {/* Evaluation Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white p-8 rounded-lg shadow space-y-8">

        {questions.map((question) => (
          <div key={question.qid} className="space-y-3">
            <h2 className="font-semibold text-gray-700">{question.questionText}</h2>

            {/* Radio */}
            {question.questionType === "RADIO" && adviser && (
              <div className="overflow-x-auto rounded border">
                <table className="w-full text-center table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600">
                      <th className="p-2 text-left">Adviser</th>
                      {[1, 2, 3, 4, 5].map((score) => (
                        <th key={score} className="p-2">{score}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t hover:bg-gray-50">
                      <td className="p-2 text-left font-medium">{adviser?.adviserName || "Adviser"}</td>
                      {[1, 2, 3, 4, 5].map((score) => (
                        <td key={score} className="p-2">
                          <input
                            type="radio"
                            name={`rating-${question.qid}`}
                            value={score}
                            checked={responses[`${adviser?.adviserId}-${question.qid}`] === score}
                            onChange={() => handleResponseChange(question.qid, score)}
                          />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Text */}
            {question.questionType === "TEXT" && (
              <div>
                <textarea
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-gray-400"
                  rows="4"
                  placeholder="Write your response here..."
                  value={responses[`text-${question.qid}`] || ""}
                  onChange={(e) => handleResponseChange(question.qid, e.target.value)}
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

export default StudentTeacherEvaluation;