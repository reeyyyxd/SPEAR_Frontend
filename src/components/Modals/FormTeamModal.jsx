import React, { useState, useContext } from "react";
import AuthContext from "../../services/AuthContext";

const FormTeamModal = ({ onClose, projectId }) => {
  const { authState } = useContext(AuthContext);
  const [groupName, setGroupName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/student/create-team/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ groupName }),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create team.");
      }
    
      alert("Team successfully created!");
      onClose(); // Close the modal
    } catch (err) {
      setError(err.message || "Failed to create team. Please try again.");
      console.error("Error creating team:", err);
    } finally {
      setIsSubmitting(false);
    }
    
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Form a Team</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="groupName" className="block text-sm font-medium">
            Group Name
          </label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mt-2 mb-4"
            placeholder="Enter group name"
            required
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-white px-4 py-2 rounded-md hover:bg-peach hover:text-white transition"
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
