import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";

const TeacherEvaluations = () => {
  const { getDecryptedId, storeEncryptedId } = useContext(AuthContext);
  const [evaluations, setEvaluations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [newEvaluation, setNewEvaluation] = useState({
    availability: "",
    dateOpen: "",
    dateClose: "",
    period: "",
  });

  // Utility function to calculate availability status
  const calculateAvailability = (dateOpen, dateClose) => {
    const currentDate = new Date();
    const openDate = new Date(dateOpen);
    const closeDate = new Date(dateClose);

    if (currentDate < openDate) {
      return "Pending";
    } else if (currentDate >= openDate && currentDate <= closeDate) {
      return "Open";
    } else {
      return "Closed";
    }
  };

  // Fetch all evaluations
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
      console.log("Fetched evaluations:", data); // Log the data
      const updatedEvaluations = data.map((evaluation) => ({
        ...evaluation,
        availability: calculateAvailability(evaluation.dateOpen, evaluation.dateClose),
      }));
      setEvaluations(updatedEvaluations);
    } catch (error) {
      console.error("Error fetching evaluations:", error);
    }
  };
  

  const handleCreateEvaluation = async () => {
    try {
      const classId = getDecryptedId("cid"); // Ensure this is a valid ID
      const url = `http://localhost:8080/teacher/create-evaluation/${classId}`; // Updated URL
  
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvaluation),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create evaluation");
      }
  
      const data = await response.json();
      alert(data.message || "Evaluation created successfully!");
  
      // Add the new evaluation to the list
      setEvaluations((prev) => [
        ...prev,
        {
          ...data.evaluation,
          availability: calculateAvailability(data.evaluation.dateOpen, data.evaluation.dateClose),
        },
      ]);
  
      setShowModal(false);
      setNewEvaluation({
        availability: "",
        dateOpen: "",
        dateClose: "",
        period: "",
      });
    } catch (error) {
      console.error("Error creating evaluation:", error);
    }
  };
  

  const handleDeleteEvaluation = async (eid) => {
    console.log("Attempting to delete evaluation with ID:", eid); // Log the ID
    if (!eid) {
      alert("Invalid evaluation ID");
      return;
    }
  
    if (window.confirm("Are you sure you want to delete this evaluation?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/teacher/delete-evaluation/${eid}`,
          { method: "DELETE" }
        );
  
        if (!response.ok) {
          throw new Error("Failed to delete evaluation");
        }
  
        alert("Evaluation deleted successfully!");
        fetchEvaluations(); // Refresh evaluations after deletion
      } catch (error) {
        console.error("Error deleting evaluation:", error);
      }
    }
  };
  
  const handleEditEvaluation = async () => {
    const eid = getDecryptedId("eid");
    console.log("Attempting to edit evaluation with ID:", eid); // Log the ID
  
    if (!eid) {
      alert("Invalid evaluation ID");
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:8080/teacher/update-evaluation/${eid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEvaluation),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update evaluation");
      }
  
      const updatedEvaluation = await response.json();
      alert("Evaluation updated successfully!");
      setEvaluations((prev) =>
        prev.map((evalItem) =>
          evalItem.eid === updatedEvaluation.eid
            ? { ...updatedEvaluation, availability: calculateAvailability(updatedEvaluation.dateOpen, updatedEvaluation.dateClose) }
            : evalItem
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error updating evaluation:", error);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvaluation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // On component mount, fetch evaluations
  useEffect(() => {
    fetchEvaluations();
  }, []);

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole="TEACHER" />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <h1 className="text-lg font-semibold mb-6 text-center">Evaluations</h1>

        <div className="flex justify-start mb-4">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>


        <div className="flex justify-end mb-4">
          <button
            className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark transition-all duration-300"
            onClick={() => {
              setShowModal(true);
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
              <th className="px-4 py-2 text-left text-sm font-semibold">Questions</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((evalItem, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{evalItem.period}</td>
                <td className="px-4 py-2">{evalItem.dateOpen}</td>
                <td className="px-4 py-2">{evalItem.dateClose}</td>
                <td className="px-4 py-2">{evalItem.availability}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                    storeEncryptedId("eid", evalItem.eid);
                    window.location.href = `/teacher/questions/${evalItem.eid}`;
                                 }}
                                >
                           View
                   </button>
                </td>
                <td className="px-4 py-2 flex space-x-3">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteEvaluation(evalItem.eid)}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setShowModal(true);
                      setNewEvaluation(evalItem);
                      storeEncryptedId("eid", evalItem.eid);
                    }}
                  >
                    <i className="fa fa-edit"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">
                {newEvaluation.eid ? "Edit Evaluation" : "Create Evaluation"}
              </h2>
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
                  onClick={newEvaluation.eid ? handleEditEvaluation : handleCreateEvaluation}
                >
                  {newEvaluation.eid ? "Update" : "Create"}
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
