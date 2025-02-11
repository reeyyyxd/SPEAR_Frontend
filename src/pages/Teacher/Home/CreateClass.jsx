import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Navbar from "../../../components/Navbar/Navbar";
import Header from "../../../components/Header/Header";
import AuthContext from "../../../services/AuthContext";

const semesterOptions = [
  { value: "1st Semester", label: "1st Semester" },
  { value: "2nd Semeseter", label: "2nd Semester" },
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
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate("/login");
    }
  }, [authState.isAuthenticated, navigate]);

  const [courseTypeValue, setCourseTypeValue] = useState(null);
  const [courseCode, setCourseCode] = useState("");
  const [section, setSection] = useState("");
  const [schoolYear, setSchoolYear] = useState(null);
  const [semester, setSemester] = useState(null);
  const [courseDescription, setCourseDescription] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      createdBy: { uid: authState.uid },
    };

    try {
      const response = await fetch("http://localhost:8080/teacher/create-class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(classData),
      });
    
      const responseData = await response.json();
    
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create class. Please try again.");
      }
    
      setMessage(`Class created successfully! Class Key: ${responseData.classKey}`);
      setError(null);
      navigate("/teacher-dashboard");
    } catch (err) {
      setError(err.message || "Failed to create class. Please try again.");
      setMessage(null);
    }
    
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">

      <div className="flex justify-start mb-4">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold flex justify-center items-center h-full">Create Class</h1>

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
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-teal text-white px-6 py-3 rounded-md"
            >
              Create Class
            </button>
          </div>
        </form>

        {/* Feedback Messages */}
        {message && <div className="mt-2 text-green-500">{message}</div>}
        {error && <div className="mt-2 text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default CreateClass;
