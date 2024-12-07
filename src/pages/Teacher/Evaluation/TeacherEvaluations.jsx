import React, { useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";

const TeacherEvaluations = () => {
  const [evaluations, setEvaluations] = useState([
    {
      availability: "Open",
      dateOpen: "2024-12-01",
      dateClose: "2024-12-10",
      period: "Prelims",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newEvaluation, setNewEvaluation] = useState({
    availability: "",
    dateOpen: "",
    dateClose: "",
    period: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvaluation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateEvaluation = () => {
    // Add new evaluation to the list
    setEvaluations((prev) => [...prev, newEvaluation]);
    setNewEvaluation({
      availability: "",
      dateOpen: "",
      dateClose: "",
      period: "",
    });
    setShowModal(false);
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole="TEACHER" />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <h1 className="text-lg font-semibold mb-6 text-center">Evaluations</h1>

        <div className="flex justify-end mb-4">
          <button
            className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark transition-all duration-300"
            onClick={() => setShowModal(true)}
          >
            Create Evaluation
          </button>
        </div>

        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Availability</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Date Open</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Date Close</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Period</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((evalItem, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{evalItem.availability}</td>
                <td className="px-4 py-2">{evalItem.dateOpen}</td>
                <td className="px-4 py-2">{evalItem.dateClose}</td>
                <td className="px-4 py-2">{evalItem.period}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for creating a new evaluation */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">Create Evaluation</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <input
                  type="text"
                  name="availability"
                  value={newEvaluation.availability}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                  placeholder="Enter availability (e.g., Open)"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Open</label>
                <input
                  type="date"
                  name="dateOpen"
                  value={newEvaluation.dateOpen}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Close</label>
                <input
                  type="date"
                  name="dateClose"
                  value={newEvaluation.dateClose}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                <input
                  type="text"
                  name="period"
                  value={newEvaluation.period}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                  placeholder="Enter period (e.g., Prelims)"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark"
                  onClick={handleCreateEvaluation}
                >
                  Create
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