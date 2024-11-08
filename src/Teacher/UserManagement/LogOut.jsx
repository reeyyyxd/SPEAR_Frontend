// LogOut.jsx
import React from "react";

const LogOut = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null; // Don't render anything if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white text-teal rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
        <p>Are you sure you want to log out?</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 bg-gray-300 text-black rounded-md px-4 py-2 hover:bg-peach hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-teal text-white rounded-md px-4 py-2 hover:bg-peach"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogOut;
