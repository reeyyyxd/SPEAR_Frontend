import React, { useState, useContext } from "react";
import AuthContext from "../../services/AuthContext";
import axios from "axios";

const ApplyTeamModal = ({ teamId, onClose }) => {
  const { authState } = useContext(AuthContext);
  const [role, setRole] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const address = getIpAddress();

  function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(":");
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    if (!authState.uid) {
      setMessage("Error: User ID is missing. Please log in again.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(`http://${address}:8080/student/apply`, {
        teamId: teamId,
        uid: authState.uid,
        role: role,
        reason: reason,
      });
  
      if (response.status === 200) {
        setMessage("Application submitted successfully!");
      } else {
        setMessage("Failed to submit application. Please try again.");
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error) {
        setMessage(error.response.data.error); 
      } else {
        setMessage("An error occurred while applying. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Apply to Team</h2>

        <form onSubmit={handleSubmit}>
          {/* Role Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Role</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>

          {/* Reason Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Reason</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Why do you want to join?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 disabled:bg-gray-400"
            disabled={loading}
            style={{ backgroundColor: "#2563EB", color: "#ffffff", border: "2px solid #1E40AF" }}
          >
            {loading ? "Submitting..." : "Apply"}
          </button>

          {/* Status Message */}
          {message && <p className="mt-3 text-center text-gray-700">{message}</p>}
        </form>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ApplyTeamModal;