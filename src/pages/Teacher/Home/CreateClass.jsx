import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Navbar from "../../../components/Navbar/Navbar";
import Header from "../../../components/Header/Header";
import AuthContext from "../../../services/AuthContext";
import ClassService from "../../../services/ClassService"; // Import your ClassService

const semesterOptions = [
  { value: "First", label: "First" },
  { value: "Second", label: "Second" },
  { value: "Mid-Year", label: "Mid-Year" },
];

const schoolYearOptions = [
  { value: "2023-2024", label: "2023-2024" },
  { value: "2024-2025", label: "2024-2025" },
  { value: "2025-2026", label: "2025-2026" },
  { value: "2026-2027", label: "2026-2027" },
];

const courseType = [
  { value: 1, label: "Capstone" },
  { value: 0, label: "Non-Capstone" },
];

const CreateClass = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { authState } = useContext(AuthContext); // Get the auth state from context

  // Redirect to login if not authenticated
  if (!authState.isAuthenticated) {
    navigate("/login");
  }

  // State for form inputs
  const [courseTypeValue, setCourseTypeValue] = useState(null);
  const [courseCode, setCourseCode] = useState("");
  const [section, setSection] = useState("");
  const [schoolYear, setSchoolYear] = useState(null);
  const [semester, setSemester] = useState(null);
  const [courseDescription, setCourseDescription] = useState("");

  // State for feedback messages
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (
      !courseTypeValue ||
      !courseCode ||
      !section ||
      !schoolYear ||
      !semester ||
      !courseDescription
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const classData = {
      courseType: courseTypeValue.label,
      courseCode,
      section,
      schoolYear: schoolYear.label,
      semester: semester.label,
      courseDescription,
    };

    try {
      // Pass the auth token from the context to the createClass function
      const response = await ClassService.createClass(
        classData,
        authState.token
      );
      setMessage("Class created successfully!");
      setError(null); // Clear any previous errors
      alert("Class created successfully");
      navigate("/teacher-dashboard"); // Redirect to the teacher dashboard or classes page after success
    } catch (err) {
      setError("Failed to create class. Please try again.");
      setMessage(null); // Clear any previous success messages
    }
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Create Class</h1>
          <Header />
        </div>

        {/* Form */}
        <form className="grid grid-cols-2 gap-8" onSubmit={handleSubmit}>
          {/* Course Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Type
            </label>
            <Select
              options={courseType}
              value={courseTypeValue}
              onChange={setCourseTypeValue}
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
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
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
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </div>

          {/* School Year */}
          <div>
            <label className="block text-sm font-medium mb-1">
              School Year
            </label>
            <Select
              options={schoolYearOptions}
              value={schoolYear}
              onChange={setSchoolYear}
              className="text-black"
              placeholder="Select school year"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium mb-1">Semester</label>
            <Select
              options={semesterOptions}
              value={semester}
              onChange={setSemester}
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
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="ml-auto mt-4 bg-teal text-white px-6 py-3 rounded-md"
          >
            Create Class
          </button>
        </form>

        {/* Feedback Messages */}
        {message && <div className="mt-4 text-green-500">{message}</div>}
        {error && <div className="mt-4 text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default CreateClass;
