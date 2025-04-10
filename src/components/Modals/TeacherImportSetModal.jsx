import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../services/AuthContext";

const TeacherImportSetModal = ({ onClose, fetchQuestions }) => {
    const { getDecryptedId, authState } = useContext(AuthContext);
    const [sets, setSets] = useState([]);
    const [myQuestions, setMyQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedSetId, setExpandedSetId] = useState(null);

    const [myPage, setMyPage] = useState(1);
    const itemsPerPage = 5;

    const address = window.location.hostname;

    useEffect(() => {
        fetchSets();
        fetchMyQuestions();
    }, []);

    const fetchSets = async () => {
        try {
            const { data } = await axios.get(`http://${address}:8080/templates/teacher/get-template-sets`);
            setSets(data);
        } catch (error) {
            console.error("Error fetching sets:", error);
            setError("Failed to load sets. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchMyQuestions = async () => {
        try {
            const { data } = await axios.get(`http://${address}:8080/teacher/get-my-questions`, {
                headers: { Authorization: `Bearer ${authState.token}` },
            });
            setMyQuestions(data);
        } catch (error) {
            console.error("Error fetching my questions:", error);
        }
    };

    const handleImportSet = async (setId) => {
        try {
            const classId = getDecryptedId("cid");
            const evaluationId = getDecryptedId("eid");
            await axios.post(`http://${address}:8080/teacher/import-set/${setId}/for-class/${classId}/evaluation/${evaluationId}`, {}, {
                headers: { Authorization: `Bearer ${authState.token}` },
            });
            alert("Set imported successfully!");
            fetchQuestions();
            onClose();
        } catch (error) {
            console.error("Error importing set:", error);
            alert("Failed to import set. Check console logs.");
        }
    };

    const handleReuseQuestion = async (questionId) => {
        try {
            const classId = getDecryptedId("cid");
            const evaluationId = getDecryptedId("eid");
            await axios.post(`http://${address}:8080/teacher/reuse-question/${questionId}/for-class/${classId}/evaluation/${evaluationId}`, {}, {
                headers: { Authorization: `Bearer ${authState.token}` },
            });
            alert("Question imported successfully!");
            fetchQuestions();
            onClose();
        } catch (error) {
            console.error("Error importing question:", error);
            alert("Failed to import question. Check console logs.");
        }
    };

    const toggleExpand = (setId) => {
        setExpandedSetId(expandedSetId === setId ? null : setId);
    };

    const paginatedMyQuestions = myQuestions.slice((myPage - 1) * itemsPerPage, myPage * itemsPerPage);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <h2 className="text-lg font-bold mb-4">Import Question Set</h2>
                {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
                {loading ? (
                    <p className="text-center text-gray-500">Loading sets...</p>
                ) : (
                    <table className="w-full border border-gray-300 mb-6">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left">Set Name</th>
                                <th className="px-4 py-2 text-left"># of Questions</th>
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sets.map((set) => (
                                <React.Fragment key={set.id}>
                                    <tr className="border-b">
                                        <td className="px-4 py-2">{set.name}</td>
                                        <td className="px-4 py-2">{set.questions.length}</td>
                                        <td className="px-4 py-2 space-x-2 text-center">
                                            <button
                                                className="bg-[#323c47] text-white px-3 py-1 rounded-md hover:bg-gray-900"
                                                onClick={() => handleImportSet(set.id)}
                                            >
                                                Import Set
                                            </button>
                                            <button
                                                className="text-sm text-blue-600 underline"
                                                onClick={() => toggleExpand(set.id)}
                                            >
                                                {expandedSetId === set.id ? "Hide" : "View Questions"}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedSetId === set.id && (
                                        <tr>
                                            <td colSpan="3" className="px-4 py-2 bg-gray-50">
                                                <ul className="space-y-1">
                                                    {set.questions.map((q) => (
                                                        <li key={q.id} className="text-sm text-gray-700">
                                                            • {q.questionText} [{q.questionType}]
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}

                <h3 className="text-md font-semibold mb-2">My Previous Questions</h3>
                <ul className="space-y-2 border border-gray-300 p-2 rounded">
                    {paginatedMyQuestions.map((q) => (
                        <li key={q.qid} className="flex justify-between text-sm">
                            <span>• {q.questionText} [{q.questionType}]</span>
                            <button
                                className="text-xs text-blue-600 underline"
                                onClick={() => handleReuseQuestion(q.qid)}
                            >
                                Import
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Pagination */}
                <div className="flex justify-between mt-2">
                    <button
                        disabled={myPage === 1}
                        onClick={() => setMyPage(myPage - 1)}
                        className={`px-4 py-1 rounded ${myPage === 1 ? "bg-gray-300" : "bg-teal text-white hover:bg-teal-dark"}`}
                    >
                        Previous
                    </button>
                    <span className="text-gray-700">
                    Page {myPage} of {Math.max(1, Math.ceil(myQuestions.length / itemsPerPage))}
                    </span>
                    <button
                        disabled={myPage >= Math.ceil(myQuestions.length / itemsPerPage)}
                        onClick={() => setMyPage(myPage + 1)}
                        className={`px-4 py-1 rounded ${myPage >= Math.ceil(myQuestions.length / itemsPerPage) ? "bg-gray-300" : "bg-teal text-white hover:bg-teal-dark"}`}
                    >
                        Next
                    </button>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
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