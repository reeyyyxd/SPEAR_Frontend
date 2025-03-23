import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../services/AuthContext";

const TeacherQuestionTemplateModal = ({ onClose, fetchQuestions }) => {
    const { authState, getDecryptedId } = useContext(AuthContext);
    const address = window.location.hostname;

  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [myQuestions, setMyQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination States
  const [suggestedPage, setSuggestedPage] = useState(1);
  const [myQuestionsPage, setMyQuestionsPage] = useState(1);
  const itemsPerPage = 5; // Number of questions per page

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const fetchAllQuestions = async () => {
    try {
      const [suggestedRes, myQuestionsRes] = await Promise.all([
        axios.get(`http://${address}:8080/templates/teacher/get-suggested-questions`),
        axios.get(`http://${address}:8080/teacher/get-my-questions`, {
          headers: { Authorization: `Bearer ${authState.token}` }, 
        }),
      ]);

      setSuggestedQuestions(suggestedRes.data || []);
      setMyQuestions(myQuestionsRes.data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // **Pagination Logic**
  const getPaginatedData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleReuseQuestion = async (questionId) => {
    try {
      const classId = getDecryptedId("cid");
      const evaluationId = getDecryptedId("eid");

      if (!classId || !evaluationId) {
        alert("Missing class or evaluation ID.");
        return;
      }

      const response = await axios.post(
        `http://${address}:8080/teacher/reuse-question/${questionId}/for-class/${classId}/evaluation/${evaluationId}`,
        {},
        {
          headers: { Authorization: `Bearer ${authState.token}` },
        }
      );

      alert("Question reused successfully!");
      fetchQuestions();
    } catch (error) {
      console.error("Error reusing question:", error);
      alert("Failed to reuse question. Check console logs.");
    }
};
const handleClose = () => {
    fetchQuestions(); // Refresh the questions list
    onClose(); // Close the modal
  };

const handleUseTemplate = async (templateId) => {
    try {
      const classId = getDecryptedId("cid");
      const evaluationId = getDecryptedId("eid");
  
      const response = await axios.post(
        `http://${address}:8080/teacher/use-template/${templateId}/for-class/${classId}/evaluation/${evaluationId}`,
        {},
        { headers: { Authorization: `Bearer ${authState.token}` } } // Ensure authentication
      );
  
      alert("Question imported successfully!");
      fetchAllQuestions(); // Refresh UI
    } catch (error) {
      console.error("Error using template question:", error);
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex flex-col items-center">
        <h2 className="text-lg font-bold mb-4 self-start">Import Questions</h2>

        {/* Error Handling */}
        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

        {/* Loading State */}
        {loading ? (
        <p className="text-center text-gray-500">Loading questions...</p>
        ) : (
        <div className="w-full space-y-6">
            {/* Suggested Questions Table */}
            <div className="w-full">
            <h3 className="text-md font-semibold mb-2">Suggested Questions</h3>
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                <thead className="bg-gray-200">
                    <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Question</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Type</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {getPaginatedData(suggestedQuestions, suggestedPage).length > 0 ? (
                    getPaginatedData(suggestedQuestions, suggestedPage).map((question, index) => (
                        <tr key={index} className="border-b">
                        <td className="px-4 py-2">{question.questionText}</td>
                        <td className="px-4 py-2">{question.questionType}</td>
                        <td className="px-4 py-2">
                            <button
                            className="bg-[#323c47] text-white px-3 py-1 rounded-md hover:bg-gray-900 transition"
                            onClick={() => handleUseTemplate(question.id)}
                            >
                            Import
                            </button>
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                        No suggested questions found.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-between mt-4">
                <button
                disabled={suggestedPage === 1}
                onClick={() => setSuggestedPage(suggestedPage - 1)}
                className={`px-4 py-2 rounded-lg ${suggestedPage === 1 ? "bg-gray-300" : "bg-teal text-white hover:bg-teal-dark"}`}
                >
                Previous
                </button>
                <span className="text-gray-700">
                {suggestedPage} of {Math.ceil(suggestedQuestions.length / itemsPerPage)}
                </span>
                <button
                disabled={suggestedPage === Math.ceil(suggestedQuestions.length / itemsPerPage)}
                onClick={() => setSuggestedPage(suggestedPage + 1)}
                className={`px-4 py-2 rounded-lg ${suggestedPage === Math.ceil(suggestedQuestions.length / itemsPerPage) ? "bg-gray-300" : "bg-teal text-white hover:bg-teal-dark"}`}
                >
                Next
                </button>
            </div>
            </div>

            {/* Your Used Questions Table */}
            <div className="w-full">
            <h3 className="text-md font-semibold mb-2">Your Previous Questions</h3>
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                <thead className="bg-gray-200">
                    <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Question</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Type</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {getPaginatedData(myQuestions, myQuestionsPage).length > 0 ? (
                    getPaginatedData(myQuestions, myQuestionsPage).map((question, index) => (
                        <tr key={index} className="border-b">
                        <td className="px-4 py-2">{question.questionText}</td>
                        <td className="px-4 py-2">{question.questionType}</td>
                        <td className="px-4 py-2">
                            <button
                            className="bg-[#323c47] text-white px-3 py-1 rounded-md hover:bg-gray-900 transition"
                            onClick={() => handleReuseQuestion(question.qid)}
                            >
                            Import
                            </button>
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                        No questions found.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-between mt-4">
                <button
                disabled={myQuestionsPage === 1}
                onClick={() => setMyQuestionsPage(myQuestionsPage - 1)}
                className={`px-4 py-2 rounded-lg ${myQuestionsPage === 1 ? "bg-gray-300" : "bg-teal text-white hover:bg-teal-dark"}`}
                >
                Previous
                </button>
                <span className="text-gray-700">
                {myQuestionsPage} of {Math.ceil(myQuestions.length / itemsPerPage)}
                </span>
                <button
                disabled={myQuestionsPage === Math.ceil(myQuestions.length / itemsPerPage)}
                onClick={() => setMyQuestionsPage(myQuestionsPage + 1)}
                className={`px-4 py-2 rounded-lg ${myQuestionsPage === Math.ceil(myQuestions.length / itemsPerPage) ? "bg-gray-300" : "bg-teal text-white hover:bg-teal-dark"}`}
                >
                Next
                </button>
            </div>
            </div>
        </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end mt-4 w-full">
        <button className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400" onClick={handleClose}>
            Close
        </button>
        </div>
    </div>
    </div>
  );
};

export default TeacherQuestionTemplateModal;