import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import LogOut from "./LogOut"; // Import the LogOut component
import UserService from "../../../services/UserService"; // Import UserService to call the logout method

const LogoutPage = () => {
  const navigate = useNavigate(); // Hook for redirecting
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Handle logout function
  const handleLogout = () => {
    // Call the logout method from UserService
    UserService.logout();

    // After logout, redirect to the landing page (or home page)
    navigate("/"); // Replace "/" with your desired landing page route
  };

  return (
    <div>
      {/* Logout Button */}
      <button
        onClick={() => setIsModalOpen(true)} // Open the logout modal
        className="bg-teal text-white py-2 px-4 rounded-md hover:bg-peach"
      >
        Logout
      </button>

      {/* LogOut Modal Component */}
      <LogOut
        isOpen={isModalOpen} // Modal visibility state
        onClose={() => setIsModalOpen(false)} // Close modal if cancelled
        onConfirm={handleLogout} // Perform logout and redirect
      />
    </div>
  );
};

export default LogoutPage;
