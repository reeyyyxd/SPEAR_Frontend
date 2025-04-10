import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import AuthContext from "../../services/AuthContext";
import axios from "axios";

const AdminQuestionTemplates = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState("");
  const [loading, setLoading] = useState(true);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showSetModal, setShowSetModal] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [newQuestion, setNewQuestion] = useState({ questionText: "", questionType: "INPUT" });
  const [newSetName, setNewSetName] = useState("");
  const [error, setError] = useState("");

  const address = window.location.hostname;

  useEffect(() => {
    fetchSets();
  }, []);

  const fetchSets = async () => {
    try {
      const { data } = await axios.get(`http://${address}:8080/templates/teacher/get-template-sets`);
      setSets(data);
    } catch (error) {
      console.error("Error fetching sets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSet = async () => {
    if (!newSetName.trim()) {
      setError("Set name is required.");
      return;
    }
    try {
      await axios.post(`http://${address}:8080/templates/admin/create-set?name=${newSetName}`);
      alert("Set created successfully");
      setNewSetName("");
      setShowSetModal(false);
      fetchSets();
    } catch (error) {
      console.error("Error creating set:", error);
    }
  };

  const handleDeleteSet = async () => {
    if (!selectedSet || !window.confirm("Are you sure you want to delete this set?")) return;
    try {
      await axios.delete(`http://${address}:8080/templates/admin/delete-set/${selectedSet}`);
      alert("Set deleted successfully");
      setSelectedSet("");
      fetchSets();
    } catch (error) {
      console.error("Error deleting set:", error);
    }
  };

  const handleCreateOrUpdateQuestion = async () => {
    if (!selectedSet) {
      setError("Please select a set first.");
      return;
    }
    if (!newQuestion.questionText.trim()) {
      setError("Question text is required.");
      return;
    }
  
    const payload = {
      ...newQuestion,
      createdByUserId: authState.uid,
    };
  
    try {
      if (isEditingQuestion) {
        await axios.put(
          `http://${address}:8080/templates/admin/update-question/${editingQuestionId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        alert("Question updated successfully!");
      } else {
        await axios.post(
          `http://${address}:8080/templates/admin/add-question/${selectedSet}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        alert("Question created successfully!");
      }
  
      fetchSets();
      setShowQuestionModal(false);
      setNewQuestion({ questionText: "", questionType: "INPUT" });
      setIsEditingQuestion(false);
    } catch (error) {
      console.error("Error saving question:", error);
      setError(error.response?.data?.message || "Failed to save question.");
    }
  };

  const handleEditQuestion = (question) => {
    setNewQuestion({ questionText: question.questionText, questionType: question.questionType });
    setEditingQuestionId(question.id);
    setIsEditingQuestion(true);
    setShowQuestionModal(true);
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await axios.delete(`http://${address}:8080/templates/admin/delete-question/${id}`);
      alert("Question deleted successfully");
      fetchSets();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="p-8 bg-white shadow-md rounded-md w-full">
        <div className="flex justify-between items-center mb-6">
          <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition" onClick={() => navigate(-1)}>
            Back
          </button>
          <div className="space-x-2">
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700" onClick={() => setShowSetModal(true)}>
              Create Template
            </button>
            <button className="bg-[#323c47] text-white px-4 py-2 rounded-md hover:bg-gray-900 transition" onClick={() => setShowQuestionModal(true)}>
              Create Question
            </button>
          </div>
        </div>

        <h1 className="text-lg font-semibold text-teal text-center mb-6">Question Templates</h1>

        <div className="flex justify-between mb-4">
          <select className="border rounded p-2 w-64" value={selectedSet} onChange={(e) => setSelectedSet(e.target.value)}>
            <option value="">Select Template</option>
            {sets.map((set) => (<option key={set.id} value={set.id}>{set.name}</option>))}
          </select>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700" onClick={handleDeleteSet}>Delete Template</button>
        </div>

        <div className="overflow-y-auto max-h-96 rounded-lg shadow-md">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : selectedSet && sets.find((s) => s.id === parseInt(selectedSet))?.questions.length > 0 ? (
            <table className="min-w-full border border-gray-300">
              <thead className="sticky top-0 bg-[#323c47] text-white shadow-md">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Question</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sets.find((s) => s.id === parseInt(selectedSet))?.questions.map((question, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{question.questionText}</td>
                    <td className="px-4 py-2 capitalize">{question.questionType}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditQuestion(question)}>Edit</button>
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">No questions in this set.</p>
          )}
        </div>
      </div>

      {showQuestionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">{isEditingQuestion ? "Edit Question" : "Create Question"}</h2>
            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <input type="text" value={newQuestion.questionText} onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })} className="w-full border border-gray-300 px-3 py-2 rounded-lg" placeholder="Type your question here..." />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
              <select
              value={newQuestion.questionType}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  questionType: e.target.value.toUpperCase(), // 🔥 Ensures it matches ENUM
                })
              } className="w-full border border-gray-300 px-3 py-2 rounded-lg"
            >
              <option value="INPUT">Input (Ratings)</option>
              <option value="TEXT">Text (Open-Ended)</option>
            </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400" onClick={() => { setShowQuestionModal(false); setIsEditingQuestion(false); }}>Cancel</button>
              <button className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark" onClick={handleCreateOrUpdateQuestion}>{isEditingQuestion ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {showSetModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-4">Create Set</h2>
            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Set Name</label>
              <input type="text" value={newSetName} onChange={(e) => setNewSetName(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-lg" placeholder="Enter set name..." />
            </div>
            <div className="flex justify-end space-x-4">
              <button className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400" onClick={() => setShowSetModal(false)}>Cancel</button>
              <button className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark" onClick={handleCreateSet}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestionTemplates;
