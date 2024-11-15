import React from "react";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import LandingPage from "../../../LandingPage"; // Import LandingPage component

const Register = () => {
  return (
    <div>
      {/* Include LandingPage at the top */}
      <LandingPage />

      <div className="flex items-center justify-center min-h-screen">
        <div className="main-content grid grid-cols-1 bg-teal w-[928px] h-[696px] rounded-lg items-center">
          {/*  Header */}
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
            <form className="grid grid-cols-2 gap-8">
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
                  required
                />
              </div>

              {/* Register Button */}
              <div className="col-span-2">
                <button
                  type="submit"
                  className="mt-4 bg-peach text-white font-semibold py-2 rounded-md hover:bg-white hover:text-teal w-full"
                >
                  Register
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
