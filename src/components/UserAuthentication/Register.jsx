import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/imgs/logo-dark.png";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      alert("Passwords do not match!");
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
      const response = await axios.post("http://localhost:8080/register", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        alert("User created successfully");
        navigate("/login");
      } else {
        const errorMessage = response.data?.message || "Registration failed.";
        setError(errorMessage);
        alert(errorMessage);
      }
    } catch (err) {
      console.error("Error during registration:", err);
  
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data.message || "This email is already registered.";
        setError(errorMessage);
        alert(errorMessage);
      } else {
        const errorMessage = "Registration failed. Please try again.";
        setError(errorMessage);
        alert(errorMessage);
      }
    } finally {
      setIsLoading(false);
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
            <h1 className="text-white text-2xl font-medium pb-16 text-center">
              Registration
            </h1>
            {error && (
              <div className="text-red-500 text-sm text-center mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
              {/* Form Fields */}
              <div className="col-span-2">
                <label className="block text-sm text-white mb-1" htmlFor="email">
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

              <div>
                <label className="block text-sm text-white mb-1" htmlFor="firstName">
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

              <div>
                <label className="block text-sm text-white mb-1" htmlFor="lastName">
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

              <div>
                <label className="block text-sm text-white mb-1" htmlFor="password">
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

              <div>
                <label className="block text-sm text-white mb-1" htmlFor="confirmPassword">
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
  