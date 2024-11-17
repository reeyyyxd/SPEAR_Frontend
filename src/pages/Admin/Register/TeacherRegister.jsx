import React, { useState } from "react";
import Select from "react-select";
import logo from "../../../assets/imgs/logo-light.png";
import { Link } from "react-router-dom";

const options = [
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "ux_ui", label: "UX / UI" },
  { value: "ai", label: "AI" },
  { value: "data_analytics", label: "Data Analytics" },
  { value: "automation", label: "Automation" },
  { value: "machine_learning", label: "Machine Learning" },
  { value: "cloud_computing", label: "Cloud Computing" },
  { value: "software_engineering", label: "Software Engineering" },
  { value: "blockchain", label: "Blockchain" },
  { value: "robotics", label: "Robotics" },
  { value: "iot", label: "Internet of Things (IoT)" },
  { value: "game_development", label: "Game Development" },
  { value: "mobile_app_development", label: "Mobile App Development" },
  { value: "quantum_computing", label: "Quantum Computing" },
  { value: "networking", label: "Networking" },
];

const MAX_SELECTION_LIMIT = 3; // Set the maximum number of selections

const TeacherRegister = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange = (selected) => {
    // Check if the new selection exceeds the limit
    if (selected.length <= MAX_SELECTION_LIMIT) {
      setSelectedOptions(selected);
    } else {
      alert(
        `You can only select up to ${MAX_SELECTION_LIMIT} fields of interest.`
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="main-content grid grid-cols-1 bg-teal w-[928px] h-auto max-h-[700px] rounded-lg items-center">
        {/* Header */}
        <div className="header flex items-center justify-center bg-white rounded-t-lg w-full h-20">
          <img src={logo} alt="logo" className="w-20 h-20 object-contain" />
          <p className="text-md font-medium pl-4">
            Student Peer Evaluation and Review System
          </p>
        </div>

        <div className="form-field w-full px-32 py-8 overflow-auto">
          {/* Identifier */}
          <h1 className="text-white text-2xl font-medium pb-6 text-center">
            Teacher Registration
          </h1>
          <form className="grid grid-cols-2 gap-8">
            {/* University Email */}
            <div>
              <label className="block text-sm text-white mb-1" htmlFor="email">
                University Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 rounded-md border border-gray-300"
                required
              />
            </div>

            {/* Field of Interest */}
            <div>
              <label className="block text-sm text-white mb-1">
                Field of Interest
              </label>
              <Select
                isMulti
                options={options}
                onChange={handleSelectChange}
                value={selectedOptions}
                className="text-black"
                placeholder="Select your fields of interest"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "40px",
                    maxHeight: "150px", // limit max height to avoid overflow
                  }),
                  multiValue: (base) => ({
                    ...base,
                    display: "flex",
                    flexDirection: "row",
                    overflowX: "auto", // allow horizontal scrolling
                    whiteSpace: "nowrap",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    display: "flex",
                    alignItems: "center",
                    overflowX: "auto", // allow horizontal scrolling
                    padding: "2px", // padding for better spacing
                  }),
                }}
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

          {/* Link to login */}
          <p className="mt-8 text-white text-sm text-center">
            Already have an account?{" "}
            <Link to="/teacher/login" className="text-peach hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;
