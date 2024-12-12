import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import axios from "axios";

const ClassSettings = () => {
  const navigate = useNavigate();
  const { authState, getDecryptedId } = useContext(AuthContext);
  const [classData, setClassData] = useState({
    courseType: "",
    courseDescription: "",
    courseCode: "",
    section: "",
    schoolYear: "",
    semester: "",
  });

  useEffect(() => {
    const fetchClassData = async () => {
      const classId = getDecryptedId("cid");
      if (!classId || !authState.token) {
        console.error("Class ID or authentication token is missing.");
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:8080/class/${classId}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
  
        const { courseType, courseDescription, courseCode, section, schoolYear, semester } = response.data;
        setClassData({ courseType, courseDescription, courseCode, section, schoolYear, semester });
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };
  
    fetchClassData();
  }, [authState.token, getDecryptedId]);
  

  const handleUpdateClass = async (event) => {
    event.preventDefault();
    const confirmation = window.confirm("Are you sure you want to update the class details?");
    if (!confirmation) return;
  
    const classId = getDecryptedId("cid");
    if (!classId || !authState.token) {
      console.error("Class ID or authentication token is missing.");
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:8080/teacher/updateClass/${classId}`,
        classData,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Class updated successfully: " + response.data.message);
  
      // Redirect to ClassPage
      navigate(`/teacher/class/${classData.courseCode}`);
    } catch (error) {
      console.error("Error updating class:", error);
      alert("Failed to update class. Please try again.");
    }
  };
  
  

  const handleChange = (e) => {
    const { id, value } = e.target;
    setClassData((prevData) => ({ ...prevData, [id]: value }));
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
              <label htmlFor="courseType" className="block text-sm font-medium text-gray-700">
                Course Type
              </label>
              <input
                type="text"
                id="courseType"
                value={classData.courseType}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal focus:border-teal"
              />
            </div>

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

            <div className="col-span-2">
              <button
                type="submit"
                className="bg-teal text-white px-6 py-2 rounded-lg hover:bg-teal-dark transition-all duration-300"
              >
                Update Class
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClassSettings;
