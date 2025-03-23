import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import axios from "axios";
import TeacherQuestionTemplateModal from "../../../components/Modals/TeacherQuestionTemplateModal";

const TeacherQuestions = () => {
  const { getDecryptedId, storeEncryptedId } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("TEXT");
  const [editQuestion, setEditQuestion] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false); 
  const navigate = useNavigate();

  const address = getIpAddress();

  function getIpAddress() {
      const hostname = window.location.hostname;
      const indexOfColon = hostname.indexOf(':');
      return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }


  const fetchQuestions = async () => {
    try {
      const evaluationId = getDecryptedId("eid");
      const response = await axios.get(`http://${address}:8080/get-questions-by-evaluation/${evaluationId}`);
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };


  const handleCreateQuestion = async () => {
    try {
        const classId = getDecryptedId("cid");
        const evaluationId = getDecryptedId("eid");
        const uid = getDecryptedId("uid"); 
        const token = localStorage.getItem("token"); // Get the stored token

        console.log("Debugging UID:", uid);
        console.log("Debugging Token:", token); // Debug if token exists

        if (!token) {
            alert("Authentication failed. Please log in again.");
            return;
        }

        if (!uid) {
            alert("User ID is missing! Please log in again.");
            return;
        }

        if (!newQuestion || !newQuestionType) {
            alert("Please enter a question and select a type.");
            return;
        }

        const requestData = {
            questionText: newQuestion,
            questionType: newQuestionType,
            // createdByUserId: uid
        };

        console.log("Sending Request:", requestData);

        const response = await axios.post(
            `http://${address}:8080/teacher/create-question/${classId}/${evaluationId}`,
            requestData,
            {
                headers: {
                    Authorization: `Bearer ${token}` // Include token in the request
                }
            }
        );

        alert("Question created successfully!");
        setQuestions([...questions, response.data]);
        setNewQuestion("");
        setNewQuestionType("TEXT");
        setShowCreateModal(false);
    } catch (error) {
        console.error("Error creating question:", error.response?.data || error);
        alert("Failed to create question. Please check console for details.");
    }
};

  const handleEditQuestion = async () => {
    const qid = getDecryptedId("qid");
    if (!qid || !editQuestion || !editQuestion.questionText) {
      alert("Invalid question data");
      return;
    }

    if (!window.confirm("Are you sure you want to edit this question?")) {
      return;
    }

    try {
      const response = await axios.put(
        `http://${address}:8080/teacher/update-question/${qid}`,
        { questionText: editQuestion.questionText }
      );

      setQuestions((prev) =>
        prev.map((q) =>
          q.questionId === response.data.questionId ? response.data : q
        )
      );
      setShowEditModal(false);
      alert("Edit success!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      await axios.delete(`http://${address}:8080/teacher/delete-question/${questionId}`);
      setQuestions((prev) => prev.filter((q) => q.questionId !== questionId));
      alert("Delete success!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  // Fetch questions when the component is mounted
  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole="TEACHER" />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <h1 className="text-lg font-semibold mb-6 text-center">Questions</h1>

        <div className="flex justify-start mb-4">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        <div className="flex justify-end mb-4 space-x-2">
          <button
            className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
            onClick={() => setShowImportModal(true)}
          >
            Import Questions
          </button>

          <button
            className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark transition-all duration-300"
            onClick={() => setShowCreateModal(true)}
          >
            Create Question
          </button>
        </div>

        {questions.length > 0 ? (
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Question</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Type</th>
                {/* <th className="px-4 py-2 text-left text-sm font-semibold">Created By</th> */}
                <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{question.questionText}</td>
                  <td className="px-4 py-2">{question.questionType}</td>
                  {/* <td className="px-4 py-2">{question.createdByName || "Unknown"}</td> */}
                  <td className="px-4 py-2 flex space-x-3">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteQuestion(question.qid)}
                    >
                      <i className="fa fa-trash"></i> Delete
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        storeEncryptedId("qid", question.qid);
                        setEditQuestion(question);
                        setShowEditModal(true);
                      }}
                    >
                      <i className="fa fa-edit"></i> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No questions found.</p>
        )}

        {/* Import Questions Modal */}
        {showImportModal && (
          <TeacherQuestionTemplateModal
            onClose={() => setShowImportModal(false)}
            fetchQuestions={fetchQuestions} 
          />
        )}

        {/* Create Question Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">Create Question</h2>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                placeholder="Enter your question"
              />
              <select
                value={newQuestionType}
                onChange={(e) => setNewQuestionType(e.target.value)}
                className="w-full mt-3 border border-gray-300 px-3 py-2 rounded-lg"
              >
                <option value="TEXT">TEXT</option>
                <option value="RADIO">RADIO</option>
              </select>
              <div className="flex justify-end space-x-4 mt-4">
                <button className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark" onClick={handleCreateQuestion}>
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Question Modal */}
        {showEditModal && editQuestion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Edit Question</h2>

            {/* Edit Question Text */}
            <input
              type="text"
              value={editQuestion.questionText}
              onChange={(e) =>
                setEditQuestion((prev) => ({
                  ...prev,
                  questionText: e.target.value,
                }))
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-4"
              placeholder="Edit your question"
            />

            {/* Edit Question Type Dropdown */}
            <label className="block mb-2 text-sm font-semibold">Question Type:</label>
            <select
              value={editQuestion.questionType}
              onChange={(e) =>
                setEditQuestion((prev) => ({
                  ...prev,
                  questionType: e.target.value,
                }))
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-4"
            >
              <option value="TEXT">Text</option>
              <option value="RADIO">Multiple Choice</option>
            </select>

            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark"
                onClick={() => handleEditQuestion()}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default TeacherQuestions;
