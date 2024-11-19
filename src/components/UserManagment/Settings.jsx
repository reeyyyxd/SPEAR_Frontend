import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";

const Settings = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    profilePicture: null, // For storing the file input
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profilePicture: e.target.files[0],
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Profile Overview</h1>
          <Header />
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col">
            <label className="block mb-2 font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="block mb-2 font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter your last name"
              required
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="block mb-2 font-medium">Change Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Enter a new password"
              required
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="block mb-2 font-medium">Profile Picture</label>
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-teal text-white font-semibold rounded-md px-4 py-2 transition duration-300 hover:bg-peach"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
