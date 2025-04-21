import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../services/AuthContext";

const TeacherImportSetModal = ({ onClose, fetchQuestions }) => {
  const { getDecryptedId, authState } = useContext(AuthContext);
  const [sets, setSets] = useState([]);
  const [myTemplateSets, setMyTemplateSets] = useState([]);
  const [expandedSetId, setExpandedSetId] = useState(null);

  const address = window.location.hostname;

  useEffect(() => {
    fetchSets();
    fetchMyTemplateSets();
  }, []);

  const fetchSets = async () => {
    try {
      const { data } = await axios.get(`http://${address}:8080/templates/teacher/get-template-sets`);
      setSets(data);
    } catch (error) {
      console.error("Error fetching sets:", error);
    }
  };

  const fetchMyTemplateSets = async () => {
    try {
      const { data } = await axios.get(`http://${address}:8080/teacher/my-template-sets`, {
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      setMyTemplateSets(data);
    } catch (error) {
      console.error("Error fetching template sets:", error);
    }
  };

  const handleImportSet = async (setId, isMine = false) => {
    try {
      const classId = getDecryptedId("cid");
      const evaluationId = getDecryptedId("eid");
      const path = isMine ? "import-my-template-set" : "import-set";
      await axios.post(
        `http://${address}:8080/teacher/${path}/${setId}/for-class/${classId}/evaluation/${evaluationId}`,
        {},
        { headers: { Authorization: `Bearer ${authState.token}` } }
      );
      alert("Set imported successfully!");
      fetchQuestions();
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error importing set:", error);
      alert("Failed to import set.");
    }
  };

  const handleDeleteMySet = async (setId) => {
    const confirmed = window.confirm("Are you sure you want to delete your template set?");
    if (!confirmed) return;
    try {
      await axios.delete(`http://${address}:8080/templates/teacher/delete-set/${setId}`, {
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      alert("Your template set has been deleted.");
      fetchMyTemplateSets();
    } catch (error) {
      const msg = error?.response?.data?.error || "Failed to delete set.";
      if (msg.includes("currently in use")) {
        alert("This set cannot be deleted because it is currently in use.");
      } else {
        alert(msg);
      }
      console.error("Error deleting your template set:", error);
    }
  };

  const toggleExpand = (setId) => {
    setExpandedSetId(expandedSetId === setId ? null : setId);
  };

  const renderSetRow = (set, isMine = false) => (
    <React.Fragment key={set.id}>
      <tr className="border-b hover:bg-gray-100">
        <td
          className="px-4 py-2 cursor-pointer text-center text-blue-700 font-semibold"
          onClick={() => toggleExpand(set.id)}
        >
          {set.name}
        </td>
        <td className="px-4 py-2 text-center">{set.questions.length}</td>
        <td className="px-4 py-2 text-center">
          <div className="flex justify-center gap-2">
            <button
              className="bg-[#323c47] text-white px-3 py-1 rounded hover:bg-gray-900"
              onClick={() => handleImportSet(set.id, isMine)}
            >
              Import
            </button>
            {isMine && (
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => handleDeleteMySet(set.id)}
              >
                Delete
              </button>
            )}
          </div>
        </td>
      </tr>
      {expandedSetId === set.id && (
        <tr>
          <td colSpan="3" className="bg-gray-50 px-4 py-2">
            <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
              {set.questions.map((q) => (
                <li key={q.id}>{q.questionTitle} — {q.questionDetails} [{q.questionType}]</li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </React.Fragment>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4 text-center">Import Question Set</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Available Template Sets</h3>
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-center">Set Name</th>
                <th className="px-4 py-2 text-center">Number of Questions</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>{sets.map((set) => renderSetRow(set, false))}</tbody>
          </table>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">My Template Sets</h3>
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-center">Set Name</th>
                <th className="px-4 py-2 text-center">Number of Questions</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>{myTemplateSets.map((set) => renderSetRow(set, true))}</tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherImportSetModal;
