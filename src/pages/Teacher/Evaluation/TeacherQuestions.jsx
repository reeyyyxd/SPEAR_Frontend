import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import axios from "axios";
import TeacherImportSetModal from "../../../components/Modals/TeacherImportSetModal";

const TeacherQuestions = () => {
  const { getDecryptedId, storeEncryptedId } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ questionTitle: "", questionDetails: "" });
  const [newQuestionType, setNewQuestionType] = useState("TEXT");
  const [editQuestion, setEditQuestion] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importedSets, setImportedSets] = useState([]);
  const [expandedSets, setExpandedSets] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateSetName, setTemplateSetName] = useState("");
  const navigate = useNavigate();

  const address = getIpAddress();

  function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(":");
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  const toggleSetExpansion = (setId) => {
    setExpandedSets((prev) =>
      prev.includes(setId) ? prev.filter((id) => id !== setId) : [...prev, setId]
    );
  };

  const fetchQuestions = async () => {
    try {
      const evaluationId = getDecryptedId("eid");
      const response = await axios.get(
        `http://${address}:8080/get-questions-by-evaluation/${evaluationId}`
      );
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
      const token = localStorage.getItem("token");
  
      if (!token || !uid) {
        alert("Authentication failed. Please log in again.");
        return;
      }
  
      const questionPayload = {
        ...newQuestion,
        questionType: newQuestionType
      };
  
      if (
        !questionPayload.questionTitle?.trim() ||
        !questionPayload.questionDetails?.trim() ||
        !questionPayload.questionType?.trim()
      ) {
        alert("Please fill in title, details, and type.");
        return;
      }
  
      const response = await axios.post(
        `http://${address}:8080/teacher/create-question/${classId}/${evaluationId}`,
        questionPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert("Question created successfully!");
      setQuestions([...questions, response.data]);
  
      // Reset state
      setNewQuestion({ questionTitle: "", questionDetails: "" });
      setNewQuestionType("TEXT");
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating question:", error.response?.data || error);
      alert("Failed to create question. Please check console for details.");
    }
  };

  const handleEditQuestion = async () => {
    const qid = getDecryptedId("qid");
    if (!qid || !editQuestion?.questionTitle || !editQuestion?.questionDetails) {
      alert("Invalid question data");
      return;
    }

    if (!window.confirm("Are you sure you want to edit this question?")) {
      return;
    }

    try {
      const response = await axios.put(
        `http://${address}:8080/teacher/update-question/${qid}`,
        {
          questionTitle: editQuestion.questionTitle,
          questionDetails: editQuestion.questionDetails,
          questionType: editQuestion.questionType
        }
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
      await axios.delete(
        `http://${address}:8080/teacher/delete-question/${questionId}`
      );
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


  const fetchImportedSets = async () => {
    try {
      const evaluationId = getDecryptedId("eid");
      const response = await axios.get(`http://${address}:8080/teacher/get-imported-sets/${evaluationId}`);
      setImportedSets(response.data || []);
    } catch (error) {
      console.error("Error fetching imported sets:", error);
    }
  };

  const handleDeleteSet = async (setId) => {
    if (!window.confirm("Are you sure you want to delete this set?")) return;
    try {
      await axios.delete(`http://${address}:8080/teacher/delete-questions-by-set/${setId}`);
      setImportedSets((prev) => prev.filter((set) => set.id !== setId));
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting set:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchImportedSets();
  }, []);

  const handleSaveAsTemplate = async () => {
    const evaluationId = getDecryptedId("eid");
    const token = localStorage.getItem("token");
  
    if (!templateSetName.trim()) {
      alert("Please enter a template set name.");
      return;
    }
  
    try {
      await axios.post(
        `http://${address}:8080/teacher/save-as-template/${evaluationId}`,
        { name: templateSetName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Template saved successfully!");
      setShowTemplateModal(false);
      setTemplateSetName("");
    } catch (error) {
      console.error("Error saving template:", error.response?.data || error);
      alert("Failed to save template.");
    }
  };






  return (
    <div className="grid grid-cols-1 md:grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole="TEACHER" />

      <div className="main-content bg-white text-teal p-4 sm:p-8 md:px-20 lg:px-28 pt-8 md:pt-12">
        <h1 className="text-lg sm:text-xl font-semibold mb-6 text-center">
          Questions
        </h1>

        <div className="flex flex-col sm:flex-row justify-start sm:justify-between mb-4 space-y-4 sm:space-y-0">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        <div className="flex justify-between sm:justify-end mb-4 space-x-2">
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


        {importedSets.length > 0 && (
          <div className="overflow-x-auto rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-2">Imported Sets</h2>
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Set Name</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
            {importedSets.map((set) => {
              const isExpanded = expandedSets.includes(set.id);
              const setQuestions = questions.filter((q) => q.templateSetId === set.id);

              return (
                <React.Fragment key={set.id}>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium">{set.name}</td>
                    <td className="px-4 py-2 space-x-4">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => toggleSetExpansion(set.id)}
                      >
                        {/* {isExpanded ? "Hide Questions" : "Show Questions"} */}
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteSet(set.id)}
                      >
                        Delete Set
                      </button>
                    </td>
                  </tr>

                  {isExpanded &&
                    setQuestions.map((q) => (
                      <tr key={q.qid} className="border-b bg-gray-50">
                        <td className="px-6 py-2" colSpan={2}>
                          <div className="font-semibold">{q.questionTitle}</div>
                          <div className="text-sm text-gray-600">{q.questionDetails}</div>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
            </table>
          </div>
        )}

        {questions.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-sm sm:text-base font-semibold">
                    Questions
                  </th>
                  <th className="px-4 py-2 text-left text-sm sm:text-base font-semibold">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-sm sm:text-base font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">
                      <div className="font-semibold">{question.questionTitle}</div>
                      <div className="text-gray-600 text-sm">{question.questionDetails}</div>
                    </td>
                    <td className="px-4 py-2">{question.questionType}</td>
                   <td className="px-4 py-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                   {question.editable && (
                      <>
                        <button
                          className="text-red-500 hover:text-red-700 text-sm sm:text-base"
                          onClick={() => handleDeleteQuestion(question.qid)}
                        >
                          <i className="fa fa-trash"></i> Delete
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700 text-sm sm:text-base"
                          onClick={() => {
                            storeEncryptedId("qid", question.qid);
                            setEditQuestion(question);
                            setShowEditModal(true);
                          }}
                        >
                          <i className="fa fa-edit"></i> Edit
                        </button>
                      </>
                    )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex justify-end mt-4 bg-transparent">
            <button
              className="text-emerald-700 border border-emerald-700 px-5 py-2 rounded-lg transition hover:bg-emerald-50"
              onClick={() => setShowTemplateModal(true)}
            >
              Save as Template
            </button>
          </div>

          </div>
        ) : (
          <p className="text-center text-gray-500">No questions found.</p>
        )}

        {/* Import Questions Modal */}
        {showImportModal && (
          <TeacherImportSetModal
          onClose={() => setShowImportModal(false)}
          fetchQuestions={fetchQuestions}
          fetchImportedSets={fetchImportedSets}
        />
        )}

       {/* Create Question Modal */}
{showCreateModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/3">
      <h2 className="text-lg sm:text-xl font-bold mb-4">Create Question</h2>

      {/* Title */}
      <div className="mb-4">
        <label htmlFor="questionTitle" className="block mb-2 text-sm sm:text-base font-semibold">
          Question Title
        </label>
        <input
          id="questionTitle"
          type="text"
          value={newQuestion.questionTitle}
          onChange={(e) => setNewQuestion({ ...newQuestion, questionTitle: e.target.value })}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          placeholder="Enter question title"
        />
      </div>

      {/* Details */}
      <div className="mb-4">
        <label htmlFor="questionDetails" className="block mb-2 text-sm sm:text-base font-semibold">
          Question Details
        </label>
        <textarea
          id="questionDetails"
          value={newQuestion.questionDetails}
          onChange={(e) => setNewQuestion({ ...newQuestion, questionDetails: e.target.value })}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          placeholder="Enter question details"
        />
      </div>

      {/* Type */}
      <div className="mb-4">
        <label htmlFor="questionType" className="block mb-2 text-sm sm:text-base font-semibold">
          Question Type
        </label>
        <select
          id="questionType"
          value={newQuestionType}
          onChange={(e) => setNewQuestionType(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg"
        >
          <option value="TEXT">TEXT</option>
          <option value="INPUT">INPUT</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-4">
        <button
          className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
          onClick={() => setShowCreateModal(false)}
        >
          Cancel
        </button>
        <button
          className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark"
          onClick={handleCreateQuestion}
        >
          Create
        </button>
      </div>
    </div>
  </div>
)}

      {showEditModal && editQuestion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/3">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Edit Question</h2>

            {/* Edit Title */}
            <label className="block mb-1 text-sm font-medium">Question:</label>
            <input
              type="text"
              value={editQuestion.questionTitle}
              onChange={(e) =>
                setEditQuestion((prev) => ({
                  ...prev,
                  questionTitle: e.target.value,
                }))
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-4"
              placeholder="Edit question title"
            />

            {/* Edit Details */}
            <label className="block mb-1 text-sm font-medium">Question Details:</label>
            <textarea
              value={editQuestion.questionDetails}
              onChange={(e) =>
                setEditQuestion((prev) => ({
                  ...prev,
                  questionDetails: e.target.value,
                }))
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-4"
              placeholder="Edit question details"
            />

            {/* Edit Type */}
            <label className="block mb-2 text-sm sm:text-base font-semibold">Question Type:</label>
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
              <option value="INPUT">Input</option>
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
                onClick={handleEditQuestion}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Template Set Modal */}
{showTemplateModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/3">
      <h2 className="text-lg font-bold mb-4">Save as Template Set</h2>
      <input
        type="text"
        className="w-full border border-gray-300 px-3 py-2 rounded-lg"
        placeholder="Enter template set name"
        value={templateSetName}
        onChange={(e) => setTemplateSetName(e.target.value)}
      />

      <div className="flex justify-end space-x-4 mt-4">
        <button
          className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
          onClick={() => setShowTemplateModal(false)}
        >
          Cancel
        </button>
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
          onClick={handleSaveAsTemplate}
        >
          Save
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