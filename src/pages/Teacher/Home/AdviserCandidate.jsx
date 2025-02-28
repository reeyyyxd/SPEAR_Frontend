import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import AuthContext from "../../../services/AuthContext";
import axios from "axios";

const departmentsList = [
  "College of Engineering and Architecture",
  "College of Management, Business & Accountancy",
  "College of Arts, Sciences & Education",
  "College of Nursing & Allied Health Sciences",
  "College of Computer Studies",
  "College of Criminal Justice",
];

const address = getIpAddress();

function getIpAddress() {
    const hostname = window.location.hostname;
    const indexOfColon = hostname.indexOf(':');
    return indexOfColon !== -1 ? hostname.substring(0, indexOfColon) : hostname;
}

const AdviserCandidate = () => {
  const { authState } = useContext(AuthContext);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [selectedAdvisers, setSelectedAdvisers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate("/login");
      return;
    }

    if (selectedDepartment) {
      fetchTeachersByDepartment(selectedDepartment);
    }
  }, [selectedDepartment, authState, navigate]);

  const fetchTeachersByDepartment = async (department) => {
    try {
      const response = await axios.get(`http://${address}:8080/teachers?department=${department}`);
      setTeachers(response.data.teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const selectAdviser = (teacher) => {
    setSelectedAdvisers([...selectedAdvisers, teacher]);
    setTeachers(teachers.filter((t) => t.email !== teacher.email));
  };

  const removeAdviser = (teacher) => {
    setSelectedAdvisers(selectedAdvisers.filter((t) => t.email !== teacher.email));
  };

  return (
    <div className="grid grid-cols-[256px_1fr] min-h-screen">
      <Navbar userRole={authState?.role} />
      <div className="main-content bg-white text-teal md:px-20 lg:px-28 pt-8 md:pt-12">
        <button
          className="bg-teal text-white px-4 py-2 rounded-lg hover:bg-peach hover:text-white mb-4"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <h2 className="text-xl font-bold mb-4">Select Candidate Advisers</h2>

        <label className="block text-sm font-medium mb-2">Select Department:</label>
        <select
          className="w-full p-2 border rounded-md mb-4"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">-- Select Department --</option>
          {departmentsList.map((dept, index) => (
            <option key={index} value={dept}>{dept}</option>
          ))}
        </select>

        <h3 className="text-lg font-semibold mb-2">Teachers Available</h3>
        <div className="overflow-y-auto max-h-96 rounded-lg shadow-md bg-gray-100 p-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Interests</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr key={index}>
                  <td className="border p-2">{teacher.name}</td>
                  <td className="border p-2">{teacher.email}</td>
                  <td className="border p-2">{teacher.interests}</td>
                  <td className="border p-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => selectAdviser(teacher)}
                    >
                      Select Adviser
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Selected Advisers</h3>
        <div className="overflow-y-auto max-h-96 rounded-lg shadow-md bg-gray-100 p-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Interests</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedAdvisers.map((adviser, index) => (
                <tr key={index}>
                  <td className="border p-2">{adviser.name}</td>
                  <td className="border p-2">{adviser.email}</td>
                  <td className="border p-2">{adviser.interests}</td>
                  <td className="border p-2">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => removeAdviser(adviser)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdviserCandidate;