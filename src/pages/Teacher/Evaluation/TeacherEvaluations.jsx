import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";

const TeacherEvaluations = () => {
  const { getDecryptedId, storeEncryptedId } = useContext(AuthContext);
  const [evaluations, setEvaluations] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  const fetchEvaluations = async () => {
    try {
      const classId = getDecryptedId("cid");
      const response = await fetch(
        `http://localhost:8080/teacher/class/${classId}/evaluations`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch evaluations");
      }
      const data = await response.json();
      setEvaluations(data);
    } catch (error) {
      console.error("Error fetching evaluations:", error);
    }
  };

  const fetchQuestions = async (evaluationId) => {
    try {
      const classId = getDecryptedId("cid");
      const response = await fetch(
        `http://localhost:8080/get-questions-by-class-and-evaluation/${classId}/${evaluationId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(data);
      setShowQuestionsModal(true);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handlePeriodClick = (evaluation) => {
    storeEncryptedId("eid", evaluation.eid); // Encrypt and store evaluation ID
    setSelectedEvaluation(evaluation);
    fetchQuestions(evaluation.eid);
  };

  const handleCreateQuestion = () => {
    alert("Create Question functionality to be implemented");
    // Add logic for creating a question
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole="TEACHER" />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <h1 className="text-lg font-semibold mb-6 text-center">Evaluations</h1>

        <div className="flex justify-end mb-4">
          <button
            className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark transition-all duration-300"
            onClick={() => {
              setShowModal(true);
              setIsEditMode(false);
              setNewEvaluation({
                availability: "",
                dateOpen: "",
                dateClose: "",
                period: "",
              });
            }}
          >
            Create Evaluation
          </button>
        </div>

        <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold">Period</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Date Open</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Date Close</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Availability</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((evalItem, index) => (
            <tr key={index} className="border-b">
              <td
                className="px-4 py-2 text-blue-500 cursor-pointer underline"
                onClick={() => handlePeriodClick(evalItem)}
              >
                {evalItem.period}
              </td>
              <td className="px-4 py-2">{evalItem.dateOpen}</td>
              <td className="px-4 py-2">{evalItem.dateClose}</td>
              <td className="px-4 py-2">{evalItem.availability}</td>
              <td className="px-4 py-2 flex space-x-3">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => console.log("Delete Evaluation")}
                >
                  <i className="fa fa-trash"></i>
                </button>
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => console.log("Edit Evaluation")}
                >
                  <i className="fa fa-edit"></i>
                </button>
                <button
                  className="text-green-500 hover:text-green-700"
                  onClick={() => handleDownload(evalItem)}
                >
                  <i className="fa fa-download"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


        {showQuestionsModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
              <h2 className="text-lg font-bold mb-4">
                Questions for {selectedEvaluation?.period}
              </h2>
              <button
                className="bg-teal text-white px-4 py-2 mb-4 rounded-lg hover:bg-teal-dark"
                onClick={handleCreateQuestion}
              >
                Create Question
              </button>
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Question</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{question.questionText || `Question ${index + 1}`}</td>
                      <td className="px-4 py-2 flex space-x-3">
                        <button className="text-blue-500 hover:text-blue-700">Edit</button>
                        <button className="text-red-500 hover:text-red-700">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                  onClick={() => setShowQuestionsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherEvaluations;
