import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Navbar from "../../../components/Navbar/Navbar";
import Header from "../../../components/Header/Header";
import AuthContext from "../../../services/AuthContext";
import axios from "axios";

const semesterOptions = [
  { value: "1st Semester", label: "1st Semester" },
  { value: "2nd Semester", label: "2nd Semester" },
  { value: "Mid-Year", label: "Mid-Year" },
];

const address = getIpAddress();

  function getIpAddress() {
      const hostname = window.location.hostname;
      const indexOfColon = hostname.indexOf(':');
      return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }

const generateSchoolYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let i = 0; i < 5; i++) {
    const startYear = currentYear + i;
    const endYear = startYear + 1;
    years.push({ value: `${startYear}-${endYear}`, label: `${startYear}-${endYear}` });
  }

  return years;
};

const schoolYearOptions = generateSchoolYears();

const CreateClass = () => {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate("/login");
    }
  }, [authState.isAuthenticated, navigate]);

  const [courseCode, setCourseCode] = useState("");
  const [section, setSection] = useState("");
  const [schoolYear, setSchoolYear] = useState(null);
  const [semester, setSemester] = useState(null);
  const [courseDescription, setCourseDescription] = useState("");
  const [invalidSection, setInvalidSection] = useState(false);

  const handleSectionChange = (e) => {
    const value = e.target.value;
    const sectionPattern = /^[a-zA-Z0-9-_]*$/; // Allow letters, numbers, '-', '_'

    setInvalidSection(!sectionPattern.test(value));
    setSection(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseCode || !section || !schoolYear || !semester || !courseDescription) {
      alert("Please fill in all fields.");
      return;
    }

    // Validate section format
    const sectionPattern = /^[a-zA-Z0-9-_]+$/;
    if (!sectionPattern.test(section)) {
      alert("Invalid section format. Use only letters, numbers, '-' or '_'.");
      return;
    }

    try {
      // Check for duplicate class
      const checkResponse = await axios.get(
        `http://${address}:8080/teacher/classes/check-duplicate?courseCode=${courseCode}&section=${section}&schoolYear=${schoolYear.label}`,
        { headers: { Authorization: `Bearer ${authState.token}` } }
      );

      if (checkResponse.data.exists) {
        alert("The class you entered already exists.");
        return;
      }

      const classData = {
        courseCode,
        section,
        schoolYear: schoolYear.label,
        semester: semester.label,
        courseDescription,
        createdBy: { uid: authState.uid },
      };

      const response = await axios.post(
        `http://${address}:8080/teacher/create-class`,
        classData,
        { headers: { Authorization: `Bearer ${authState.token}` } }
      );

      alert(`Class created successfully!\nClass Key: ${response.data.classKey}`);
      navigate("/teacher-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create class.");
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
          {/* Course Code */}
          <div>
            <label htmlFor="courseCode" className="block text-sm font-medium mb-1">
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
              className={`w-full border rounded-md p-2 ${invalidSection ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter section"
              value={section}
              onChange={handleSectionChange}
            />
            <p className={`text-xs mt-1 ${invalidSection ? "text-red-500" : "text-gray-500"}`}>
              To add multiple sections, please use "-" and "_" as indicators
            </p>
          </div>

          {/* School Year */}
          <div>
            <label className="block text-sm font-medium mb-1">School Year</label>
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
            <label htmlFor="courseDescription" className="block text-sm font-medium mb-1">
              Course Description
            </label>
            <textarea
              id="courseDescription"
              rows="4"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Provide an overview of the course"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-2 flex justify-end mt-4">
            <button type="submit" className="bg-teal text-white px-6 py-3 rounded-md">
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;