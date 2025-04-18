import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/imgs/logo-dark.png";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import AuthContext from "../../services/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const address = getIpAddress();

  function getIpAddress() {
      const hostname = window.location.hostname;
      const indexOfColon = hostname.indexOf(':');
      return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post(`http://${address}:8080/login`, { email, password });
      const data = response.data;
  
      if (!data || !data.token || !data.role) {
        throw new Error("Invalid Credentials.");
      }
  
      login(data.token, data.role, data.refreshToken, data.uid);
  
      if (data.role === "STUDENT") {
        navigate("/student-dashboard");
      } else if (data.role === "TEACHER") {
        navigate("/teacher-dashboard");
      } else if (data.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else {
        throw new Error("Invalid user role.");
      }
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message || "An unexpected error occurred. Please try again.");
    }
  };
  

  return (
    <div>
      {/* Login Form Section */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="main-content grid grid-cols-2 gap-0 bg-teal w-[928px] h-[696px] rounded-lg items-center drop-shadow-2xl">
          {/* Logo */}
          <div className="logo flex flex-col items-center justify-center bg-white h-full p-4 rounded-l-lg">
            <img src={logo} alt="logo" className="w-1/2 justify-items-center" />
            <p className="text-md font-medium p-4 text-center">
              Student Peer Evaluation and Review System
            </p>
          </div>

          {/* Form Field */}
          <div className="flex-1 form-field w-full h-full px-14">
            {/* Identifier */}
            <h1 className="text-white text-2xl font-medium text-center p-20">
              Login
            </h1>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form className="grid grid-cols-1 gap-8" onSubmit={handleLogin}>
              {/* University Email */}
              <div className="col-span-1">
                <label
                  className="block text-sm text-white mb-1"
                  htmlFor="email"
                >
                  University Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded-md border border-gray-300"
                  required
                />
              </div>

              {/* Password */}
              <div className="col-span-1">
                <label
                  className="block text-sm text-white mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded-md border border-gray-300"
                  required
                />
              </div>

              {/* Login Button */}
              <div className="col-span-1">
                <button
                  type="submit"
                  className="mt-4 bg-peach text-white font-semibold py-2 rounded-md hover:bg-white hover:text-teal w-full"
                >
                  Log In
                </button>
              </div>
            </form>

            {/* Link to create an account */}
            <p className="mt-8 text-white text-sm text-center">
              Don’t have an account?{" "}
              <Link to="/register" className="text-peach hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
