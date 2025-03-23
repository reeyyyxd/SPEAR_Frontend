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

  // Fetch Questions by Evaluation ID
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`http://${address}:8080/get-questions-by-evaluation/${evaluationId}`);
      setQuestions(response.data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Fetch Adviser
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

  // Handle Input Changes
  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [`${adviser?.adviserId}-${questionId}`]: value,
    });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adviser) {
      alert("Adviser not loaded. Please wait.");
      return;
    }

    try {
      await axios.post(`http://${address}:8080/submit-evaluation`, {
        studentId,
        evaluationId,
        responses,
      });

      alert("Evaluation successfully submitted!");
      navigate(-1);
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      alert("Failed to submit evaluation.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Adviser Evaluation</h1>
      <p className="text-lg text-gray-600 mb-6">Evaluate your adviser below.</p>

      {/* Evaluation Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white p-6 shadow-md rounded-md">
        {questions.map((question) => (
          <div key={question.qid} className="mb-6">
            <h2 className="font-semibold text-lg text-gray-700">{question.questionText}</h2>

            {/* Radio Type Question (Rating 1-5) */}
            {question.questionType === "RADIO" && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mt-2">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-2 text-left">Rate</th>
                      {[1, 2, 3, 4, 5].map((score) => (
                        <th key={score} className="p-2 text-center">{score}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-semibold">{adviser?.adviserName || "Adviser"}</td>
                      {[1, 2, 3, 4, 5].map((score) => (
                        <td key={score} className="p-2 text-center">
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

            {/* Text Type Question (Essay) */}
            {question.questionType === "TEXT" && (
              <div className="mt-3">
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md"
                  rows="4"
                  placeholder="Write your response here..."
                  value={responses[`text-${question.qid}`] || ""}
                  onChange={(e) => handleResponseChange(question.qid, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white px-6 py-3 mt-6 rounded-md hover:bg-green-800 transition"
        >
          Submit Evaluation
        </button>
      </form>
    </div>
  );
};

export default StudentTeacherEvaluation;