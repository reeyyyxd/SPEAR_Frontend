import React from "react";
import logo from "../imgs/logo.png";

const AdminLogin = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="main-content grid grid-cols-2 gap-0 bg-teal w-[928px] h-[696px] rounded-lg items-center">
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
            Admin Login
          </h1>

          <form className="grid grid-cols-1 gap-8">
            {/* Username */}
            <div className="col-span-1">
              <label
                className="block text-sm text-white mb-1"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
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
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
