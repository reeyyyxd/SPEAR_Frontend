import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import axios from "axios";

const ClassSettings = () => {
  const navigate = useNavigate();
  const { authState, getDecryptedId } = useContext(AuthContext);
  const [classData, setClassData] = useState({
    courseDescription: "",
    courseCode: "",
    section: "",
    schoolYear: "",
    semester: "",
    maxTeamSize: 5,
  });
  const [error, setError] = useState(null);

  const address = getIpAddress();

  function getIpAddress() {
      const hostname = window.location.hostname;
      const indexOfColon = hostname.indexOf(':');
      return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
  }


  useEffect(() => {
    const fetchClassData = async () => {
      const classId = getDecryptedId("cid");
      if (!classId) return console.error("Class ID is missing.");

      try {
        const { data } = await axios.get(`http://${address}:8080/class/${classId}`, {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        setClassData(data);
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    fetchClassData();
  }, [authState.token, getDecryptedId]);

  const handleUpdateClass = async (event) => {
    event.preventDefault();
    if (!window.confirm("Are you sure you want to update the class details?")) return;

    const classId = getDecryptedId("cid");
    if (!classId) return console.error("Class ID is missing.");

    // Validate section format
    const sectionPattern = /^[a-zA-Z0-9-_]+$/;
    if (!sectionPattern.test(classData.section)) {
      setError("Invalid section format. Use only letters, numbers, '-' or '_'.");
      return;
    }

    try {
      await axios.put(`http://${address}:8080/teacher/updateClass/${classId}`, classData, {
        headers: { Authorization: `Bearer ${authState.token}`, "Content-Type": "application/json" },
      });
      alert("Class updated successfully!");
      navigate(`/class-settings`);
    } catch (error) {
      console.error("Error updating class:", error);
      alert("Failed to update class. Please try again.");
    }
  };

  const handleDeleteClass = async () => {
    const classId = getDecryptedId("cid");
    if (!classId) return console.error("Class ID is missing.");

    const confirmDelete = window.confirm("Are you sure you want to delete this class? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`http://${address}:8080/teacher/deleteClass/${classId}`, {
        headers: { Authorization: `Bearer ${authState.token}` },
      });

      if (data.statusCode === 200) {
        alert("Class deleted successfully!");
        navigate("/teacher-dashboard");
      } else {
        alert(data.message || "Failed to delete class.");
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      alert("Failed to delete class. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    
    if (id === "section") {
      // Validate section field in real-time
      const sectionPattern = /^[a-zA-Z0-9-_]*$/;
      if (!sectionPattern.test(value)) {
        setError("Invalid section format. Use only letters, numbers, '-' or '_'.");
      } else {
        setError(null);
      }
    }

    setClassData({ ...classData, [id]: value });
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <div className="header flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Class Settings</h1>
          <button
            className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-dark transition-all duration-300"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        <div className="bg-gray-100 shadow-md rounded-lg p-6">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleUpdateClass}>
            <div>
              <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700">
                Course Description
              </label>
              <input
                type="text"
                id="courseDescription"
                value={classData.courseDescription}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal focus:border-teal"
              />
            </div>

            <div>
              <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700">
                Course Code
              </label>
              <input
                type="text"
                id="courseCode"
                value={classData.courseCode}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal focus:border-teal"
              />
            </div>

            <div>
              <label htmlFor="section" className="block text-sm font-medium text-gray-700">
                Section
              </label>
              <input
                type="text"
                id="section"
                value={classData.section}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal focus:border-teal"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <div>
              <label htmlFor="schoolYear" className="block text-sm font-medium text-gray-700">
                School Year
              </label>
              <input
                type="text"
                id="schoolYear"
                value={classData.schoolYear}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal focus:border-teal"
              />
            </div>

            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                Semester
              </label>
              <input
                type="text"
                id="semester"
                value={classData.semester}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal focus:border-teal"
              />
            </div>

            {/* Max Team Size Field */}
            <div>
              <label htmlFor="maxTeamSize" className="block text-sm font-medium text-gray-700">
                Max Team Size
              </label>
              <input
                type="number"
                id="maxTeamSize"
                min="1"
                max="20"
                value={classData.maxTeamSize}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal focus:border-teal"
              />
            </div>

            <div className="col-span-2 flex justify-between">
              <button
                type="submit"
                className="bg-teal text-white px-6 py-2 rounded-lg hover:bg-teal-dark transition-all duration-300"
              >
                Update Class
              </button>
              <button
                type="button"
                onClick={handleDeleteClass}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                Delete Class
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClassSettings;