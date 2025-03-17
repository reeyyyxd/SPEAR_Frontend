import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../services/AuthContext";

const FormTeamModal = ({ onClose }) => {
  const { authState, getDecryptedId } = useContext(AuthContext); // Import getDecryptedId
  const [groupName, setGroupName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const address = getIpAddress();

  function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(":");
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const classId = getDecryptedId("cid"); 

    if (!classId) {
      console.error("Class ID is missing. Cannot create a team.");
      setError("Class ID is missing. Please refresh and try again.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      groupName: groupName.trim(),
      leaderId: authState.uid,
      classId: classId,
    };

    console.log("Sending payload:", payload);

    try {
      const response = await axios.post(
        `http://${address}:8080/student/create-team`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
        },
      });

      alert("Team successfully created!");
      onClose();
      window.location.href = window.location.href; // Ensures page reload while keeping route
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create team. Please try again.");
      console.error("Error creating team:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <div className="flex items-center justify-between">
        <h2 className="text-xl text-teal font-semibold mb-4">Form a Team</h2>
        <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 mb-4"
            >
            ✖
            </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Group Name */}
          <label htmlFor="groupName" className="block text-sm font-medium">Group Name</label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mt-2 mb-4"
            placeholder="Enter group name"
            required
          />

          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal text-white px-4 py-2 rounded-md hover:bg-peach transition"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormTeamModal;