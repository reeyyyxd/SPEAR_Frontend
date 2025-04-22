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
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const studentId = getDecryptedId("uid");
  const evaluationId = getDecryptedId("eid");
  const classId = getDecryptedId("cid");

  useEffect(() => {
    fetchQuestions();
    fetchAdviser();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`http://${address}:8080/get-questions-by-evaluation/${evaluationId}`);
      setQuestions(res.data || []);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const fetchAdviser = async () => {
    try {
      const res = await axios.get(`http://${address}:8080/evaluation/${studentId}/class/${classId}/adviser`);
      if (res.data?.adviserId && res.data?.adviserName) {
        setAdviser({
          adviserId: res.data.adviserId,
          adviserName: res.data.adviserName
        });
      } else {
        console.error("Invalid adviser data:", res.data);
      }
    } catch (err) {
      console.error("Error fetching adviser:", err);
    }
  };

  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [`${adviser.adviserId}-${questionId}`]: value
    }));
  };

  const handleTextChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [`text-${questionId}`]: value
    }));
  };

  const handleSubmit = async () => {
    if (!adviser) {
      alert("Adviser not loaded. Please wait.");
      return;
    }

    for (const question of questions) {
      if (question.questionType === "INPUT" && responses[`${adviser.adviserId}-${question.qid}`] === undefined) {
        alert(`Please provide a score for: ${question.questionTitle}`);
        return;
      }
      if (question.questionType === "TEXT" && (!responses[`text-${question.qid}`] || responses[`text-${question.qid}`].trim() === "")) {
        alert(`Please write a response for: ${question.questionTitle}`);
        return;
      }
    }

    const responseList = questions.map((q) => ({
      evaluator: { uid: studentId },
      evaluatee: { uid: adviser.adviserId },
      question: { qid: q.qid },
      evaluation: { eid: evaluationId },
      score: q.questionType === "INPUT" ? responses[`${adviser.adviserId}-${q.qid}`] : 0,
      textResponse: q.questionType === "TEXT" ? responses[`text-${q.qid}`] : null
    }));

    try {
      await axios.post(
        `http://${address}:8080/submissions/submit-adviser?evaluationId=${evaluationId}&evaluatorId=${studentId}`,
        responseList
      );
      alert("Evaluation successfully submitted!");
      navigate(-1);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit evaluation.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-4xl mb-6">
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          ← Back
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Adviser Evaluation</h1>

      {adviser && (
        <p className="text-md text-gray-600 mb-6">
          You are evaluating your adviser:{" "}
          <span className="text-blue-600 font-semibold">{adviser.adviserName}</span>
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowConfirmModal(true);
        }}
        className="w-full max-w-4xl bg-white p-6 md:p-8 rounded-lg shadow space-y-8"
      >
        {questions.map((question) => (
          <div key={question.qid} className="space-y-3">
            <div>
              <div className="font-semibold text-gray-700">{question.questionTitle}</div>
              <div className="text-xs text-gray-500">{question.questionDetails}</div>
            </div>

            {question.questionType === "INPUT" && adviser && (
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="0.0"
                className="w-20 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={responses[`${adviser.adviserId}-${question.qid}`] || ""}
                onChange={(e) => handleResponseChange(question.qid, parseFloat(e.target.value))}
              />
            )}

            {question.questionType === "TEXT" && (
              <textarea
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400"
                rows="4"
                placeholder="Write your response here..."
                value={responses[`text-${question.qid}`] || ""}
                onChange={(e) => handleTextChange(question.qid, e.target.value)}
              />
            )}
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