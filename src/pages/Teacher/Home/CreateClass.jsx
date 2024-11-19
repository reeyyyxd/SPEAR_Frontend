import React, { useState } from "react";
import Select from "react-select";
import Navbar from "../../../components/Navbar/Navbar";
import Header from "../../../components/Header/Header";

const semesterOptions = [
  { value: "First", label: "First" },
  { value: "Second", label: "Second" },
  { value: "Mid-Year", label: "Mid-Year" },
];

const schoolYearOptions = [
  { value: "2023_2024", label: "2023-2024" },
  { value: "2024_2025", label: "2024-2025" },
  { value: "2025_2026", label: "2025-2026" },
  { value: "2026_2027", label: "2026-2027" },
];

const CreateClass = () => {
  const [selectedType, setSelectedType] = useState(null); // State for Capstone/Non-Capstone selection
  const [courseCode, setCourseCode] = useState("");
  const [section, setSection] = useState("");
  const [selectedSchoolYear, setSelectedSchoolYear] = useState(null); // State for selected school year
  const [selectedSemester, setSelectedSemester] = useState(null); // State for selected semester
  const [projectOverview, setProjectOverview] = useState("");

  const handleSelectChange = (selected, setter) => {
    if (selected) {
      setter(selected); // Since we are using single selection, just set the selected value
    } else {
      setter(null); // If nothing is selected, reset the state
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log({
      selectedType,
      courseCode,
      section,
      schoolYear: selectedSchoolYear,
      semester: selectedSemester,
      projectOverview,
    });
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

        <form className="grid grid-cols-2 gap-8" onSubmit={handleSubmit}>
          {/* Capstone / Non-Capstone Buttons */}
          <div className="flex items-center mb-4 col-span-2 gap-8">
            <button
              type="button"
              className={`flex-1 p-2 rounded-md border ${
                selectedType === "capstone"
                  ? "bg-peach text-white"
                  : "border-gray-300 hover:bg-peach hover:text-white"
              }`}
              onClick={() => setSelectedType("capstone")}
            >
              Capstone
            </button>
            <button
              type="button"
              className={`flex-1 p-2 rounded-md border ${
                selectedType === "non-capstone"
                  ? "bg-peach text-white"
                  : "border-gray-300 hover:bg-peach hover:text-white"
              }`}
              onClick={() => setSelectedType("non-capstone")}
            >
              Non-Capstone
            </button>
          </div>

          {/* Course Code */}
          <div>
            <label
              className="block text-sm mb-1 font-medium"
              htmlFor="courseCode"
            >
              Course Code
            </label>
            <input
              type="text"
              id="courseCode"
              className="w-full p-2 rounded-md border border-gray-300"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
            />
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="section">
              Section
            </label>
            <input
              type="text"
              id="section"
              className="w-full p-2 rounded-md border border-gray-300"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
            />
          </div>

          {/* School Year */}
          <div>
            <label className="block text-sm mb-1">School Year</label>
            <Select
              options={schoolYearOptions}
              onChange={(selected) =>
                handleSelectChange(selected, setSelectedSchoolYear)
              }
              value={selectedSchoolYear}
              className="text-black"
              placeholder="Select school year"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-md font-medium mb-1">Semester</label>
            <Select
              options={semesterOptions}
              onChange={(selected) =>
                handleSelectChange(selected, setSelectedSemester)
              }
              value={selectedSemester}
              className="text-black"
              placeholder="Select semester"
            />
          </div>

          {/* Course Description */}
          <div className="form-group col-span-2 mb-8">
            <label
              htmlFor="project-overview"
              className="block text-base font-medium text-teal"
            >
              Course Description
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
          onClick={handleSubmit}
        >
          Create Class
        </button>
      </div>
    </div>
  );
};

export default CreateClass;
