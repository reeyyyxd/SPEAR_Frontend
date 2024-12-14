import React, { useState } from "react";
import { toast } from "react-toastify";
import UserService from "../../services/UserService";

const AddUsersModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    interests: "",
    role: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const userData = {
      email: formData.email,
      firstname: formData.firstName,
      lastname: formData.lastName,
      password: formData.password,
      interests: formData.interests,
      role: formData.role,
    };

    try {
      const newUser = await UserService.register(userData);
      
      alert("User added successfully!");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Failed to add user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-hidden="true"
    >
      <div className="relative w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full w-8 h-8 flex justify-center items-center"
            aria-label="Close modal"
          >
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form className="p-4" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center mb-4">{error}</div>
          )}
          <div className="grid gap-4 mb-4">
            {/* University Email */}
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                University Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 rounded-md border border-gray-300"
                placeholder="Enter university email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full p-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full p-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Interests */}
            <div>
              <label
                htmlFor="interests"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Interests
              </label>
              <input
                type="text"
                id="interests"
                className="w-full p-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter interests"
                value={formData.interests}
                onChange={handleInputChange}
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                className="w-full p-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="TEACHER">TEACHER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full p-2 text-white rounded-md ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal hover:bg-peach"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUsersModal;
