import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/imgs/logo-dark.png";
import UserService from "../../services/UserService";

const Register = () => {
  const navigate = useNavigate();

  // Form state object
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Validate form and handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError(null);
    setIsLoading(true);

    const userData = {
      email: formData.email,
      firstname: formData.firstName,
      lastname: formData.lastName,
      password: formData.password,
      role: "STUDENT",
    };

    try {
      // Register the user
      await UserService.register(userData);

      alert("User created successfully"); // Alert on success
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again."); // Handle any error during registration
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="main-content grid grid-cols-1 bg-teal w-[928px] h-[696px] rounded-lg items-center">
          {/* Header */}
          <div className="header flex items-center justify-center bg-white rounded-t-lg w-full h-full">
            <img src={logo} alt="logo" className="w-20 h-20 object-contain" />
            <p className="text-md font-medium pl-4">
              Student Peer Evaluation and Review System
            </p>
          </div>

          <div className="form-field w-full px-32 py-16">
            {/* Identifier */}
            <h1 className="text-white text-2xl font-medium pb-16 text-center">
              Registration
            </h1>
            {error && (
              <div className="text-red-500 text-sm text-center mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
              {/* University Email */}
              <div className="col-span-2">
                <label
                  className="block text-sm text-white mb-1"
                  htmlFor="email"
                >
                  University Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 rounded-md border border-gray-300"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* First Name */}
              <div>
                <label
                  className="block text-sm text-white mb-1"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full p-2 rounded-md border border-gray-300"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  className="block text-sm text-white mb-1"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full p-2 rounded-md border border-gray-300"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-sm text-white mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full p-2 rounded-md border border-gray-300"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className="block text-sm text-white mb-1"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full p-2 rounded-md"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Register Button */}
              <div className="col-span-2">
                <button
                  type="submit"
                  className={`mt-4 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-peach text-white font-semibold py-2 rounded-md hover:bg-white hover:text-teal"
                  } w-full`}
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </div>
            </form>

            {/* Link to log in */}
            <p className="mt-8 text-white text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-peach hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
