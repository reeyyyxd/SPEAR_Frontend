import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../services/AuthContext";

const AdviserCandidateModal = ({ onClose, classId }) => {
  const { authState } = useContext(AuthContext);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [advisers, setAdvisers] = useState([]);
  const [qualifiedAdvisers, setQualifiedAdvisers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uid = authState?.uid; // Ensure userId is retrieved
  console.log("AdviserCandidateModal Loaded. User ID:", uid, "Class ID:", classId); // Debugging

  const departmentsList = [
    "College of Engineering and Architecture",
    "College of Management, Business & Accountancy",
    "College of Arts, Sciences & Education",
    "College of Nursing & Allied Health Sciences",
    "College of Computer Studies",
    "College of Criminal Justice",
    "None"
  ];

  useEffect(() => {
    if (selectedDepartment) {
      fetchAdvisers(selectedDepartment);
    }
    if (classId && uid) {
      fetchQualifiedAdvisers();
    }
  }, [selectedDepartment, classId, uid]);

  const fetchAdvisers = async (department) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:8080/teacher/see-teachers/${encodeURIComponent(department)}`,
        {
          headers: { Authorization: `Bearer ${authState.token}` },
        }
      );

      setAdvisers(response.data || []);
    } catch (err) {
      setError("Failed to fetch advisers. Try again.");
      console.error("Error fetching advisers:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQualifiedAdvisers = async () => {
    if (!classId || !uid) {
      console.error("Error: classId or uid is undefined, skipping fetchQualifiedAdvisers.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/${uid}/class/${classId}/qualified-advisers`,
        {
          headers: { Authorization: `Bearer ${authState.token}` },
        }
      );
      setQualifiedAdvisers(response.data || []);
    } catch (err) {
      console.error("Error fetching qualified advisers:", err);
      setError("Failed to fetch qualified advisers.");
    }
  };

  const handleSelectAdviser = async (adviser) => {
    if (!classId || !uid) {
      alert("Error: class ID or User ID is missing.");
      return;
    }

    if (window.confirm(`Confirm selection of ${adviser.firstname} ${adviser.lastname}?`)) {
      try {
        await axios.post(
          `http://localhost:8080/teacher/${classId}/qualified-adviser/${adviser.id}`,
          {},
          { headers: { Authorization: `Bearer ${authState.token}` } }
        );

        alert(`Adviser ${adviser.firstname} ${adviser.lastname} assigned!`);
        fetchQualifiedAdvisers();
      } catch (err) {
        console.error("Error assigning adviser:", err);
        alert("Failed to assign adviser.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-teal">Manage Advisers</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        </div>

        {/* Display Assigned Advisers */}
        <h3 className="text-md font-semibold text-gray-700">Qualified Advisers</h3>
        <div className="max-h-40 overflow-y-auto border rounded p-2 mb-4">
          {qualifiedAdvisers.length > 0 ? (
            qualifiedAdvisers.map((adviser) => (
              <div key={adviser.id || adviser.email} className="p-2 border-b">
                {adviser.firstname} {adviser.lastname} ({adviser.email})
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No advisers assigned yet.</p>
          )}
        </div>

        {/* Department Dropdown */}
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Select a Department:
        </label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-4"
        >
          <option value="">-- Choose Department --</option>
          {departmentsList.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Adviser List */}
        <div className="max-h-60 overflow-y-auto border-t pt-2">
          {loading ? (
            <p className="text-gray-500 text-center">Loading advisers...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : advisers.length > 0 ? (
            advisers.map((adviser) => (
              <div key={adviser.id || adviser.email} className="p-2 border-b flex justify-between items-center">
                <p className="text-gray-800">{adviser.firstname} {adviser.lastname} ({adviser.email})</p>
                <button
                  className="bg-teal text-white px-3 py-1 rounded-lg hover:bg-peach"
                  onClick={() => handleSelectAdviser(adviser)}
                >
                  Assign
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No advisers found.</p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdviserCandidateModal;