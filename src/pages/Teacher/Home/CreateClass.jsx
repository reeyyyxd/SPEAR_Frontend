import React from "react";
import Select from "react-select";
import Navbar from "../../../components/Navbar/Navbar";
import Header from "../../../components/Header/Header";
import AuthContext from "../../../services/AuthContext";

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

const courseType = [
  { value: 1, label: "Capstone" },
  { value: 2, label: "Non-Capstone" },
];

const CreateClass = () => {
  const { authState } = useContext(AuthContext); // Get the auth state from context

  if (!authState.isAuthenticated) {
    // Redirect to login if not authenticated
    navigate("/login");
  }

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Create Class</h1>
          <Header />
        </div>

        <form className="grid grid-cols-2 gap-8">
          {/* Course Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Type
            </label>
            <Select
              options={courseType}
              className="text-black bg-peach hover:bg-peach"
              placeholder="Select Course Type"
            />
          </div>

          {/* Course Code */}
          <div>
            <label
              htmlFor="courseCode"
              className="block text-sm font-medium mb-1"
            >
              Course Code
            </label>
            <input
              type="text"
              id="courseCode"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter course code"
              disabled
            />
          </div>

          {/* Section */}
          <div>
            <label htmlFor="section" className="block text-sm font-medium mb-1">
              Section
            </label>
            <input
              type="text"
              id="section"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter section"
            />
          </div>

          {/* School Year */}
          <div>
            <label className="block text-sm font-medium mb-1">
              School Year
            </label>
            <Select
              options={schoolYearOptions}
              className="text-black"
              placeholder="Select school year"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium mb-1">Semester</label>
            <Select
              options={semesterOptions}
              className="text-black"
              placeholder="Select semester"
            />
          </div>

          {/* Course Description */}
          <div className="col-span-2">
            <label
              htmlFor="projectOverview"
              className="block text-sm font-medium mb-1"
            >
              Course Description
            </label>
            <textarea
              id="projectOverview"
              rows="4"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Provide an overview of the project"
              disabled
            />
          </div>
        </form>

        {/* Submit Button */}
        <button
          type="button"
          className="ml-auto mt-4 bg-teal text-white px-6 py-3 rounded-md"
        >
          Create Class
        </button>
      </div>
    </div>
  );
};

export default CreateClass;
