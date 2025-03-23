import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import AuthContext from "../../services/AuthContext";
import axios from "axios";

const AdminQuestionTemplates = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    questionType: "RADIO",
  });
  const [error, setError] = useState("");

  const address = window.location.hostname;

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get(`http://${address}:8080/templates/admin/get-suggested-questions`);  
      const formattedData = data.map(q => ({
        qid: q.id,
        questionText: q.questionText,
        questionType: q.questionType
      }));
  
      setQuestions(formattedData);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

const handleCreateQuestion = async () => {
    if (!newQuestion.questionText.trim()) {
      setError("Question text is required.");
      return;
    }

    try {
      const response = await axios.post(
        `http://${address}:8080/templates/admin/create-questions`,
        newQuestion,
        { headers: { "Content-Type": "application/json" } }
      );
      alert(response.data.message || "Question created successfully!");
      fetchQuestions();
      setShowModal(false);
      setNewQuestion({ questionText: "", questionType: "RADIO" });
    } catch (error) {
      console.error("Error creating question:", error);
      setError(error.response?.data?.message || "Failed to create question.");
    }
  };

const handleEditQuestion = (question) => {
    if (!question.qid) {
      question.qid = question.id;  
    }
  
    if (!question.qid) {
      console.error("Question ID is missing:", question);
      setError("Invalid question data. Please refresh and try again.");
      return;
    }
  
    setNewQuestion({
      qid: question.qid, 
      questionText: question.questionText,
      questionType: question.questionType,
    });
  
    setIsEditing(true);
    setShowModal(true);
  };
  
 
const handleUpdateQuestion = async () => {
    
    if (!newQuestion.qid) {
      setError("Question ID is missing. Cannot update.");
      console.error("Error: Question ID is undefined:", newQuestion);
      return;
    }
  
    try {
      const response = await axios.put(
        `http://${address}:8080/templates/admin/update-question/${newQuestion.qid}`,
        {
          questionText: newQuestion.questionText,
          questionType: newQuestion.questionType,
        },
        { headers: { "Content-Type": "application/json" } }
      );
  
      alert(response.data.message || "Question updated successfully!");
      fetchQuestions();
      setShowModal(false);
      setIsEditing(false); 
      setNewQuestion({ questionText: "", questionType: "RADIO" }); 
    } catch (error) {
      console.error("Error updating question:", error);
      setError(error.response?.data?.message || "Failed to update question.");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      await axios.delete(`http://${address}:8080/templates/admin/delete-question/${questionId}`);
      alert("Question deleted successfully!");
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      
      <div className="p-8 bg-white shadow-md rounded-md w-full">
        <div className="flex justify-between items-center mb-6">
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            className="bg-[#323c47] text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
            onClick={() => {
              setIsEditing(false);
              setNewQuestion({ questionText: "", questionType: "RADIO" });
              setShowModal(true);
            }}
          >
            Create Question
          </button>
        </div>

        <h1 className="text-lg font-semibold text-teal text-center mb-6">Question Templates</h1>
        {/* Table Section */}
        <div className="overflow-y-auto max-h-96 rounded-lg shadow-md">
          {loading ? (
            <p className="text-center text-gray-500">Loading questions...</p>
          ) : questions.length > 0 ? (
            <table className="min-w-full border border-gray-300">
              <thead className="sticky top-0 bg-[#323c47] text-white shadow-md">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Question</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, index) => (
                  <tr key={question.qid || index} className="border-b">
                    <td className="px-4 py-2">{question.questionText}</td>
                    <td className="px-4 py-2 capitalize">{question.questionType}</td>
                    <td className="px-4 py-2 flex space-x-3">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditQuestion(question)}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteQuestion(question.qid)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">No questions available.</p>
          )}
        </div>
      </div>

    {/* Create/Edit Question Modal */}
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
      <h2 className="text-lg font-bold mb-4">
        {isEditing ? "Edit Question" : "Create Question"}
      </h2>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      {/* Question Text Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question
        </label>
        <input
          type="text"
          name="questionText"
          value={newQuestion.questionText}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, questionText: e.target.value })
          }
          className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          placeholder="Type your question here..."
        />
      </div>

      {/* Question Type Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Type
        </label>
        <select
          name="questionType"
          value={newQuestion.questionType}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, questionType: e.target.value })
          }
          className="w-full border border-gray-300 px-3 py-2 rounded-lg"
        >
          <option value="RADIO">Radio (Multiple Choice)</option>
          <option value="TEXT">Text (Open-Ended Answer)</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
        <button
          className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark"
          onClick={isEditing ? handleUpdateQuestion : handleCreateQuestion}
        >
          {isEditing ? "Update" : "Create"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminQuestionTemplates;