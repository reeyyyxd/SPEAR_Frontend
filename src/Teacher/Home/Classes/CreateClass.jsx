import React, { useState } from "react";
import Navbar from "../../Navbar/Navbar";
import Header from "../../Header/Header";
import Select from "react-select";

const options = [
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "ux_ui", label: "UX / UI" },
  { value: "ai", label: "AI" },
  { value: "data_analytics", label: "Data Analytics" },
];

const MAX_SELECTION_LIMIT = 1; // Set the maximum number of selections

const JoinClass = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [projectOverview, setProjectOverview] = useState("");

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
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar />
      {/* Main Content */}
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Create Class</h1>
          <Header />
        </div>

        <form className="grid grid-cols-2 gap-8">
          {/* University Email */}
          <div>
            <label className="block text-sm mb-1" htmlFor="email">
              Capstone
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
            <label className="block text-sm mb-1" htmlFor="firstName">
              Non-Capstone
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full p-2 rounded-md border border-gray-300"
              required
            />
          </div>

          {/* Course Code */}
          <div>
            <label
              className="block text-sm mb-1 font-medium"
              htmlFor="lastName"
            >
              Course Code
            </label>
            <input
              type="text"
              id="lastName"
              className="w-full p-2 rounded-md border border-gray-300"
              required
            />
          </div>

          {/* Section */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="lastName"
            >
              Section
            </label>
            <input
              type="text"
              id="lastName"
              className="w-full p-2 rounded-md border border-gray-300"
              required
            />
          </div>

          {/* School Year */}
          <div>
            <label className="block text-sm  mb-1">School Year</label>
            <Select
              isMulti
              options={options}
              onChange={handleSelectChange}
              value={selectedOptions}
              className="text-black"
              placeholder="Select your fields of interest"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-md font-medium  mb-1">Semester</label>
            <Select
              isMulti
              options={options}
              onChange={handleSelectChange}
              value={selectedOptions}
              className="text-black"
              placeholder="Select your fields of interest"
            />
          </div>

          {/* Project Overview */}
          <div className="form-group">
            <label
              htmlFor="project-overview"
              className="block text-base font-medium text-teal"
            >
              Project Overview
            </label>
            <textarea
              id="project-overview"
              rows="4"
              className="mt-2 block w-full border border-gray-300 rounded-md p-3 text-base"
              placeholder="Provide an overview of the project"
              value={projectOverview}
              onChange={(e) => setProjectOverview(e.target.value)}
            />
          </div>
        </form>
        {/* Submit Button */}
        <button
          type="submit"
          className="flex ml-auto bg-teal text-white px-6 py-3 rounded-md hover:bg-peach transition text-md"
        >
          Submit Proposal
        </button>
      </div>
    </div>
  );
};

export default JoinClass;
