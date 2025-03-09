import React, { useState } from "react";

const RejectModal = ({ onClose, onSubmit, rejectReason, setRejectReason }) => {
  const [error, setError] = useState("");
  const [confirmReject, setConfirmReject] = useState(false); // New state for confirmation

  const handleSubmit = () => {
    if (!rejectReason.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }
    setConfirmReject(true); // Show confirmation message
  };

  const handleFinalReject = () => {
    onSubmit(); // Call the parent function to submit rejection
    setConfirmReject(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Reject Application</h2>
        
        {/* Show Confirmation Prompt Instead */}
        {confirmReject ? (
          <>
            <p className="text-gray-800 font-medium text-lg">Are you sure you want to reject this application?</p>
            <p className="text-gray-600 text-sm">This action cannot be undone.</p>

            {/* Confirmation Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setConfirmReject(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={handleFinalReject}
              >
                Yes, Reject
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-3 font-medium">Reasons why you are rejected because:</p>

            {/* Rejection Input */}
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter the reason for rejection..."
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value);
                setError(""); // Clear error when typing
              }}
            ></textarea>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={handleSubmit}
              >
                Reject
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RejectModal;